/**
 * ============================================================
 * PAES Challenge Engine v5.3.0 — UX & Mobile Optimized
 * Mejoras aplicadas:
 *  1. Tap-to-Place para móviles (reemplazo de drag native)
 *  2. Manejo de red suave y feedback de carga
 *  3. Ritmo pedagógico (Sin bonus de velocidad en lectura)
 *  4. Avance automático en aciertos con cancelación manual
 * ============================================================
 */

// ===== CONFIGURACIÓN DEL BACKEND =====
const API_URL = 'https://script.google.com/macros/s/AKfycbzAeYMWNPk_YCETYU1BaPdnrhOKkDieKOC9kpsuZ0CT98TKN7d4qR1sD57I_zA39MZA/exec';
const TOKEN_STORAGE_KEY = 'paes_token_qr';

// ===== ESTADO GLOBAL =====
const state = {
    idUsuario: null,
    nombreUsuario: null,
    materiaActual: null,
    preguntas: [],
    indiceActual: 0,
    totalPreguntas: 0,
    preguntaActual: null,
    desafioStartTime: null,
    score: 0,
    streak: 0,
    maxStreak: 0,
    totalPreguntasRespondidas: 0,
    mode: 'normal',
    timer: 60,
    timerInterval: null,
    _boredTimeout: null,
    _freezeTimeout: null,
    _autoNextTimeout: null, // Timeout para avance automático
    isFrozen: false,
    questionStartTime: 0,
    powerups: { time: 2, freeze: 1, hint: 2 },
    powerupsUsedThisLevel: false,
    badges: {
        perfectScore: false,
        speedDemon: false,
        streaker: false,
        paesPro: false,
        noPowerups: false
    },
    topicScores: {},
    lecturaActiva: null,
    dragSelectedIdx: null // Para selección Tap-to-Place en móviles
};

// ===== MATERIAS DISPONIBLES =====
const materiasDisponibles = [
    { id: 'lectora', nombre: 'Competencia Lectora', icono: '📖', color: '#8B5CF6', timerDefault: 60, variable: 'paesLenguajeQuestions' },
    { id: 'matematica1', nombre: 'Matemática 1 (M1)', icono: '📐', color: '#3B82F6', timerDefault: 45, variable: 'paesM1Questions' },
    { id: 'matematica2', nombre: 'Matemática 2 (M2)', icono: '📊', color: '#10B981', timerDefault: 35, variable: 'paesM2Questions' },
    { id: 'ciencias', nombre: 'Ciencias', icono: '🔬', color: '#EF4444', timerDefault: 40, variable: 'paesCienciasQuestions' }
];

// ===== UTILIDADES =====
function safeLocalGet(key, fallback) {
    try { 
        const raw = localStorage.getItem(key); 
        return raw !== null ? raw : fallback; 
    } catch (e) { 
        return fallback; 
    }
}

function safeLocalSet(key, value) {
    try { 
        localStorage.setItem(key, value); 
        return true; 
    } catch (e) { 
        return false; 
    }
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function clearAllTimers() {
    if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
    if (state._boredTimeout) { clearTimeout(state._boredTimeout); state._boredTimeout = null; }
    if (state._freezeTimeout) { clearTimeout(state._freezeTimeout); state._freezeTimeout = null; }
    if (state._autoNextTimeout) { clearTimeout(state._autoNextTimeout); state._autoNextTimeout = null; }
}

function mostrarErrorRegistro(msg, esCargando = false) {
    const errorBox = document.getElementById('lock-error');
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
    errorBox.style.color = esCargando ? '#3B82F6' : '#EF4444';
}

function mostrarToast(msg, icono = '🦉', duracion = 2500) {
    if (window.effectsManager) {
        window.effectsManager.triggerToastAcademico(msg, { icon: icono, duration: duracion });
    }
}

function playSound(type) {
    const alwaysPlay = ['correct', 'incorrect', 'levelup', 'levelstart', 'achievement', 'powerup', 'next'];
    if (!alwaysPlay.includes(type) && state.mode === 'normal') return;
    if (window.effectsManager) window.effectsManager.playSound(type);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    loadBadges();
    setupPowerups();
    createSpeedBonusToast();
    if (typeof injectBuhoSVGs === 'function') injectBuhoSVGs();
    limpiarResaltadosAntiguos();
    setupPantallaRegistro();
    setupInstalacionPWA();
    verificarAccesoQR();
});

// ===== CONTROL DE ACCESO QR =====
async function verificarAccesoQR() {
    const tokenGuardado = safeLocalGet(TOKEN_STORAGE_KEY, null);
    const urlParams = new URLSearchParams(window.location.search);
    const tokenURL = urlParams.get('token');

    if (tokenGuardado) {
        ocultarPantallasBloqueo();
        mostrarPantallaInicial();
        return;
    }

    if (tokenURL) {
        mostrarErrorRegistro('🔄 Validando token de acceso...', true);
        const valido = await validarTokenQR(tokenURL);
        if (valido) {
            safeLocalSet(TOKEN_STORAGE_KEY, tokenURL);
            window.history.replaceState({}, document.title, window.location.pathname);
            ocultarPantallasBloqueo();
            mostrarPantallaInicial();
        } else {
            mostrarPantallaBloqueoQR('Token inválido, expirado o ya utilizado.');
        }
    } else {
        mostrarPantallaBloqueoQR('Escanea el código QR oficial para ingresar.');
    }
}

async function validarTokenQR(token) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'validar_token_qr', token: token }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        const data = await response.json();
        return data.success === true;
    } catch (err) {
        console.error('Error validando token QR o timeout de red:', err);
        return false;
    }
}

function ocultarPantallasBloqueo() {
    const qrScreen = document.getElementById('qr-lock-screen');
    if (qrScreen) qrScreen.style.display = 'none';
}

function mostrarPantallaBloqueoQR(mensaje = '') {
    const qrScreen = document.getElementById('qr-lock-screen');
    if (!qrScreen) return;
    qrScreen.style.display = 'flex';
    document.getElementById('lock-screen').style.display = 'none';
    const errorBox = document.getElementById('qr-error');
    if (errorBox) {
        errorBox.textContent = mensaje;
        errorBox.style.display = mensaje ? 'block' : 'none';
    }
}

// ===== PANTALLA INICIAL & REGISTRO =====
function mostrarPantallaInicial() {
    const idUsuario = safeLocalGet('paes_id_usuario', null);
    const nombre = safeLocalGet('paes_jugador_nombre', null);
    
    if (idUsuario && nombre) {
        state.idUsuario = idUsuario;
        state.nombreUsuario = nombre;
        ocultarPantallaRegistro();
        mostrarPantallaMaterias();
    } else {
        mostrarPantallaRegistro();
    }
}

function setupPantallaRegistro() {
    const nameInput = document.getElementById('lock-name-input');
    const pinInput = document.getElementById('lock-pin-input');
    if (nameInput && pinInput) {
        nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') pinInput.focus(); });
        pinInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') intentarIngresoInicial(); });
    }
}

function mostrarPantallaRegistro() {
    const lock = document.getElementById('lock-screen');
    if (lock) {
        lock.style.display = 'flex';
        ocultarPantallasBloqueo();
        setTimeout(() => document.getElementById('lock-name-input')?.focus(), 300);
    }
}

function ocultarPantallaRegistro() {
    const lock = document.getElementById('lock-screen');
    if (lock) lock.style.display = 'none';
}

async function intentarIngresoInicial() {
    const nameInput = document.getElementById('lock-name-input');
    const pinInput = document.getElementById('lock-pin-input');
    const btnSubmit = document.getElementById('lock-submit-btn');
    const nombre = (nameInput?.value || '').trim();
    const pin = (pinInput?.value || '').trim();

    if (!nombre || !pin) {
        mostrarErrorRegistro('Por favor completa tu nombre y PIN.');
        return;
    }

    try {
        mostrarErrorRegistro('⌛ Entrando al servidor...', true);
        if (btnSubmit) btnSubmit.disabled = true;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'login_o_registro', nombre: nombre, pin: pin }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        const data = await response.json();
        if (btnSubmit) btnSubmit.disabled = false;

        if (!data.success) {
            mostrarErrorRegistro(data.error || 'Error al iniciar sesión.');
            return;
        }

        state.idUsuario = data.usuario.id_usuario;
        state.nombreUsuario = data.usuario.nombre;
        safeLocalSet('paes_id_usuario', state.idUsuario);
        safeLocalSet('paes_jugador_nombre', state.nombreUsuario);

        ocultarPantallaRegistro();
        mostrarPantallaMaterias();
    } catch (err) {
        if (btnSubmit) btnSubmit.disabled = false;
        // Estrategia Offline / Fallback si falla la red en el aula de clases
        console.warn('Servidor inaccesible, permitiendo ingreso local offline:', err);
        state.idUsuario = 'local_' + Date.now();
        state.nombreUsuario = nombre;
        safeLocalSet('paes_id_usuario', state.idUsuario);
        safeLocalSet('paes_jugador_nombre', state.nombreUsuario);
        
        ocultarPantallaRegistro();
        mostrarPantallaMaterias();
        mostrarToast('Modo sin conexión activado', '📡');
    }
}

// ===== SELECCIÓN DE MATERIA =====
function mostrarPantallaMaterias() {
    showScreen('screen-welcome');
    const container = document.getElementById('lote-selector');
    if (!container) return;
    container.innerHTML = '';

    const info = document.createElement('div');
    info.className = 'info-card';
    info.style.borderLeftColor = '#8B5CF6';
    info.innerHTML = `<strong>🦉 Sabiondo dice:</strong> Selecciona un área para practicar<br><small>Jugador: <b>${state.nombreUsuario}</b></small>`;
    container.appendChild(info);

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%';
    materiasDisponibles.forEach(materia => {
        const card = document.createElement('div');
        card.className = 'mode-card';
        card.style.cursor = 'pointer';
        card.style.borderLeft = `4px solid ${materia.color}`;
        card.innerHTML = `
            <div class="mode-icon">${materia.icono}</div>
            <div class="mode-title">${materia.nombre}</div>
            <div class="mode-desc">${materia.timerDefault}s por pregunta</div>`;
        card.addEventListener('click', () => seleccionarMateria(materia));
        grid.appendChild(card);
    });
    container.appendChild(grid);
}

function seleccionarMateria(materia) {
    const variable = materia.variable;
    const banco = typeof window[variable] !== 'undefined' ? window[variable] : [];

    if (banco.length === 0) {
        alert('No hay preguntas disponibles cargadas para esta materia.');
        return;
    }

    const preguntasSeleccionadas = shuffleArray(banco).slice(0, 25);

    state.materiaActual = materia.id;
    state.preguntas = preguntasSeleccionadas;
    state.totalPreguntas = preguntasSeleccionadas.length;
    state.indiceActual = 0;
    state.preguntaActual = preguntasSeleccionadas[0];
    state.score = 0;
    state.streak = 0;
    state.maxStreak = 0;
    state.totalPreguntasRespondidas = 0;
    state.topicScores = {};
    state.powerups = { time: 2, freeze: 1, hint: 2 };
    state.powerupsUsedThisLevel = false;
    state.isFrozen = false;
    state.desafioStartTime = Date.now();
    
    clearAllTimers();

    const materiaInfo = materiasDisponibles.find(m => m.id === materia.id);
    state.timer = materiaInfo ? materiaInfo.timerDefault : 60;
    state.mode = 'normal';

    document.body.className = '';
    updatePowerupButtons();
    updateScore();
    updateStreak();
    updateProgress();
    showScreen('screen-question');
    loadQuestion();
}

// ===== CARGA DE PREGUNTA =====
function loadQuestion() {
    if (!state.preguntaActual) {
        finalizarPartida();
        return;
    }

    clearAllTimers();
    state.isFrozen = false;
    state.dragSelectedIdx = null;
    state.questionStartTime = Date.now();

    const q = state.preguntaActual;

    ['options-grid','matching-container','drag-container','slider-container'].forEach(id => {
        const el = document.getElementById(id); 
        if (el) { el.innerHTML = ''; el.style.display = 'none'; }
    });
    
    const fb = document.getElementById('feedback-box'); 
    if (fb) { fb.className = 'feedback-box'; fb.innerHTML = ''; }
    
    const bn = document.getElementById('btn-next'); 
    if (bn) bn.style.display = 'none';

    // Render de lectura si aplica
    const lecturaContainer = document.getElementById('lectura-container');
    if (q.textKey && typeof paesTexts !== 'undefined' && paesTexts[q.textKey]) {
        const texto = paesTexts[q.textKey];
        state.lecturaActiva = q.textKey;
        if (lecturaContainer) {
            lecturaContainer.style.display = 'block';
            lecturaContainer.innerHTML = `
                <div class="lectura-panel" id="lectura-panel-${q.textKey}">
                    <div class="lectura-header">
                        <strong>📖 ${texto.title || 'Lectura'}</strong>
                        <button class="btn-lectura-fullscreen" onclick="abrirLecturaFullscreen('${q.textKey}')">⛶ Pantalla Completa</button>
                    </div>
                    <div class="lectura-body lectura-selectable" id="lectura-body-${q.textKey}">
                        ${texto.body.replace(/\n/g, '<br>')}
                    </div>
                    <div class="lectura-toolbar">
                        <button onclick="resaltarSeleccion('${q.textKey}')">🖍️ Resaltar</button>
                        <button onclick="limpiarResaltados('${q.textKey}')">🗑️ Limpiar</button>
                    </div>
                </div>`;
            setTimeout(() => {
                const resaltadosGuardados = JSON.parse(safeLocalGet(`paes_resaltados_${q.textKey}`, '[]'));
                aplicarResaltadosGuardados(q.textKey, resaltadosGuardados);
            }, 100);
        }
    } else {
        if (lecturaContainer) lecturaContainer.style.display = 'none';
        state.lecturaActiva = null;
    }

    const qt = document.getElementById('question-text');
    if (qt) {
        qt.innerHTML = q.question || '';
        if (window.katex) {
            window.katex.renderMathInElement(qt, {
                delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
                throwOnError: false
            });
        }
    }

    if (q.type === 'multiple' || q.type === 'opcion_multiple') {
        loadMultipleChoice(q);
    } else if (q.type === 'slider') {
        loadSlider(q);
    } else if (q.type === 'matching') {
        loadMatching(q);
    } else if (q.type === 'drag') {
        loadDragOptimized(q); // Versión optimizada Tap-to-Place
    }

    if (state.mode === 'timed') startTimer();
    updateProgress();
}

// ===== MEJORA 1: TAP-TO-PLACE PARA DRAG & DROP (100% MÓVIL) =====
function loadDragOptimized(q) {
    const dc = document.getElementById('drag-container'); 
    if (!dc) return;
    dc.style.display = 'flex';
    dc.style.flexDirection = 'column';
    dc.style.gap = '12px';

    const items = q.items || [];
    
    // Zonas de destino
    const zonesContainer = document.createElement('div');
    zonesContainer.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
    
    items.forEach((_, idx) => {
        const dz = document.createElement('div'); 
        dz.className = 'drop-zone'; 
        dz.style.cssText = 'padding:12px;border:2px dashed #94A3B8;border-radius:10px;background:#F8FAFC;text-align:center;font-weight:600;cursor:pointer;transition:all 0.2s';
        dz.textContent = `${idx + 1}. [ Toca una opción de abajo para colocar ]`; 
        dz.dataset.index = idx;

        dz.addEventListener('click', () => {
            if (state.dragSelectedIdx !== null) {
                dz.textContent = `${idx + 1}. ${items[state.dragSelectedIdx]}`;
                dz.dataset.filled = state.dragSelectedIdx;
                dz.style.borderColor = '#3B82F6';
                dz.style.background = '#EFF6FF';

                // Desmarcar la ficha seleccionada
                document.querySelectorAll('.draggable-item').forEach(el => el.classList.remove('selected-chip'));
                state.dragSelectedIdx = null;

                checkDragComplete(q, items.length);
            }
        });
        zonesContainer.appendChild(dz);
    });
    dc.appendChild(zonesContainer);

    // Fichas seleccionables (Chips)
    const chipsContainer = document.createElement('div'); 
    chipsContainer.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;justify-content:center;';
    
    shuffleArray(items.map((item, originalIdx) => ({ item, originalIdx }))).forEach(obj => {
        const chip = document.createElement('button'); 
        chip.className = 'draggable-item'; 
        chip.style.cssText = 'padding:10px 14px;border-radius:20px;background:#E2E8F0;border:2px solid #CBD5E1;font-weight:600;cursor:pointer;';
        chip.textContent = obj.item; 
        
        chip.addEventListener('click', () => {
            document.querySelectorAll('.draggable-item').forEach(el => {
                el.style.background = '#E2E8F0';
                el.style.borderColor = '#CBD5E1';
            });
            chip.style.background = '#DBEAFE';
            chip.style.borderColor = '#3B82F6';
            state.dragSelectedIdx = obj.originalIdx;
        });
        chipsContainer.appendChild(chip);
    });
    dc.appendChild(chipsContainer);
}

function loadMultipleChoice(q) {
    const grid = document.getElementById('options-grid'); 
    if (!grid) return;
    grid.style.display = 'flex';
    const opciones = Array.isArray(q.options) ? q.options : [];
    const indices = opciones.map((_, i) => i);
    const shuffled = shuffleArray(indices);
    q._shuffledIndices = shuffled;
    
    shuffled.forEach((orig) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = opciones[orig];
        btn.dataset.originalIndex = orig;
        
        if (window.katex) {
            window.katex.renderMathInElement(btn, {
                delimiters: [{left: '$', right: '$', display: false}],
                throwOnError: false
            });
        }

        btn.addEventListener('click', () => checkMultipleAnswer(orig, q));
        grid.appendChild(btn);
    });
}

function loadMatching(q) {
    const mc = document.getElementById('matching-container'); 
    if (!mc) return;
    mc.style.display = 'grid';
    const pairs = q.pairs || [];
    const leftItems = shuffleArray(pairs.map(p => ({ id: p.id, text: p.left })));
    const rightItems = shuffleArray(pairs.map(p => ({ id: p.id, text: p.right })));
    let sel = null;
    const matches = {};

    leftItems.forEach(item => {
        const d = document.createElement('div');
        d.className = 'matching-item'; d.textContent = item.text; d.dataset.pairId = item.id; d.dataset.side = 'left';
        d.addEventListener('click', function(){
            if (this.classList.contains('matched')) return;
            mc.querySelectorAll('.matching-item[data-side="left"]').forEach(el => { if (!el.classList.contains('matched')) el.classList.remove('selected'); });
            this.classList.add('selected'); sel = this;
        });
        mc.appendChild(d);
    });

    rightItems.forEach(item => {
        const d = document.createElement('div');
        d.className = 'matching-item'; d.textContent = item.text; d.dataset.pairId = item.id; d.dataset.side = 'right';
        d.addEventListener('click', function(){
            if (this.classList.contains('matched')) return;
            if (sel && !this.classList.contains('matched')) {
                if (sel.dataset.pairId === this.dataset.pairId) {
                    sel.classList.add('matched'); this.classList.add('matched'); matches[this.dataset.pairId] = true; sel = null;
                    if (Object.keys(matches).length === pairs.length) evaluarRespuesta(true, q);
                } else {
                    const le = sel;
                    le.style.borderColor = 'var(--rojo-alerta)'; this.style.borderColor = 'var(--rojo-alerta)';
                    setTimeout(() => { le.style.borderColor = '#CBD5E1'; this.style.borderColor = '#CBD5E1'; le.classList.remove('selected'); }, 500);
                    sel = null;
                }
            }
        });
        mc.appendChild(d);
    });
}

function loadSlider(q) {
    const sc = document.getElementById('slider-container'); 
    if (!sc) return;
    sc.style.display = 'block';
    const min = parseFloat(q.min || 0); 
    const max = parseFloat(q.max || 100);
    const vd = document.createElement('div'); vd.className = 'slider-value'; vd.textContent = min; vd.id = 'slider-value-display';
    const tr = document.createElement('div'); tr.className = 'slider-track';
    const fl = document.createElement('div'); fl.className = 'slider-fill'; fl.style.width = '0%';
    const inp = document.createElement('input'); inp.type = 'range'; inp.className = 'slider-input'; inp.min = min; inp.max = max; inp.step = '0.1'; inp.value = min;
    
    inp.addEventListener('input', () => { 
        fl.style.width = `${((inp.value-min)/(max-min))*100}%`; 
        vd.textContent = inp.value; 
    });
    
    tr.appendChild(fl); tr.appendChild(inp);
    const sb = document.createElement('button'); sb.className = 'main-btn'; sb.textContent = 'Confirmar ✅';
    sb.addEventListener('click', () => {
        sb.disabled = true;
        const userAnswer = parseFloat(inp.value);
        const correct = Math.abs(userAnswer - parseFloat(q.correctAnswer)) <= parseFloat(q.tolerance || 0.5);
        evaluarRespuesta(correct, q);
    });
    sc.appendChild(vd); sc.appendChild(tr); sc.appendChild(sb);
}

function checkDragComplete(q, totalItems) {
    const dzs = document.querySelectorAll('.drop-zone');
    let allFilled = true;
    dzs.forEach(z => { if (!z.dataset.filled) allFilled = false; });
    if (allFilled) {
        const userOrder = Array.from(dzs).map(z => parseInt(z.dataset.filled));
        const correctOrder = q.items.map((_, i) => i);
        const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
        evaluarRespuesta(isCorrect, q);
    }
}

// ===== EVALUACIÓN LOCAL & RITMO ADAPTATIVO =====
function checkMultipleAnswer(oi, q) {
    if (window.effectsManager) window.effectsManager.ensureAudio();
    const opts = document.querySelectorAll('.option-btn');
    opts.forEach(b => b.disabled = true);
    
    clearAllTimers();
    const correctIndex = q.correct;
    const isCorrect = parseInt(oi) === parseInt(correctIndex);
    evaluarRespuesta(isCorrect, q);
}

function evaluarRespuesta(isCorrect, q) {
    const tiempo = (Date.now() - state.questionStartTime) / 1000;
    state.totalPreguntasRespondidas++;
    
    if (isCorrect) {
        let pts = q.points || 100;
        state.streak++;
        if (state.streak > state.maxStreak) state.maxStreak = state.streak;

        // MEJORA 3: Sin bonus por velocidad en Lectora para evitar adivinanza rápida
        const esMateriaLectora = state.materiaActual === 'lectora';
        if (tiempo < 3 && !esMateriaLectora) {
            const bonus = Math.round(pts * 0.5);
            pts += bonus;
            showSpeedBonus(bonus);
        }

        state.score += pts;
        updateScore(); updateStreak(); playSound('correct');
        if (window.effectsManager) window.effectsManager.triggerConfettiAcademico();
        updateBuhoReaction('correct');

        showFeedback(`¡Correcto! ${q.explanation || ''}`, 'correct');

        // MEJORA 4: Avance automático inteligente en aciertos
        state._autoNextTimeout = setTimeout(() => {
            nextQuestion();
        }, 1800);

    } else {
        state.streak = 0;
        updateStreak(); playSound('incorrect');
        showFeedback(`Incorrecto. ${q.explanation || ''}`, 'incorrect');
        setTimeout(() => updateBuhoReaction('determined'), 400);
        // Si falla, NO hay avance automático para forzar la lectura del error.
    }

    if (q.topic) {
        if (!state.topicScores[q.topic]) state.topicScores[q.topic] = { correct: 0, total: 0 };
        state.topicScores[q.topic].total++;
        if (isCorrect) state.topicScores[q.topic].correct++;
    }

    if (state.lecturaActiva && q.evidenceText) {
        resaltarEvidenciaEnLectura(state.lecturaActiva, q.evidenceText, isCorrect ? 'correct' : 'incorrect');
    }

    const bn = document.getElementById('btn-next');
    if (bn) bn.style.display = 'block';
    
    state.indiceActual++;
    if (state.indiceActual < state.totalPreguntas) {
        state.preguntaActual = state.preguntas[state.indiceActual];
    } else {
        state.preguntaActual = null;
    }
    checkBadges();
}

function nextQuestion() {
    if (window.effectsManager) window.effectsManager.playSound('next');
    clearAllTimers();
    state.isFrozen = false;
    document.getElementById('streak-display')?.classList.remove('on-fire');
    if (state.preguntaActual) {
        loadQuestion();
    } else {
        finalizarPartida();
    }
}

// ===== FINALIZAR PARTIDA & BACKEND =====
function finalizarPartida() {
    clearAllTimers();
    state.isFrozen = false;

    const finalScoreEl = document.getElementById('final-score');
    if (finalScoreEl) finalScoreEl.textContent = state.score;

    const tiempoTotal = (Date.now() - (state.desafioStartTime || Date.now())) / 1000;
    const td = document.getElementById('tiempo-desempeno');
    if (td && state.totalPreguntasRespondidas > 0) {
        const prom = tiempoTotal / state.totalPreguntasRespondidas;
        const min = Math.floor(tiempoTotal / 60);
        const seg = Math.floor(tiempoTotal % 60);
        let ev = '🐢 Sin prisa, lo importante es aprender';
        if (prom < 15) ev = '🏆 ¡Excelente velocidad!';
        else if (prom < 30) ev = '👍 Buen ritmo';
        else if (prom < 60) ev = '📚 Tómate tu tiempo';
        td.innerHTML = `<div style="margin-top:12px;padding:14px;background:#F5F3FF;border-radius:12px;border-left:4px solid #8B5CF6;text-align:left"><strong>⏱️ Desempeño:</strong><br><span style="font-size:0.9rem">• Tiempo total: <b>${min}m ${seg}s</b><br>• Preguntas: <b>${state.totalPreguntasRespondidas}</b><br>• Promedio: <b>${prom.toFixed(1)}s</b><br>• ${ev}</span></div>`;
    }

    const sp = document.getElementById('result-character-speech');
    if (sp) {
        if (state.score >= 7000) sp.textContent = '¡Rendimiento excepcional! ¡La universidad te espera! 🎓✨';
        else if (state.score >= 5000) sp.textContent = '¡Excelente! Vas por muy buen camino. 👏🎓';
        else if (state.score >= 3000) sp.textContent = '¡Buen esfuerzo! Sigue practicando. 📚💪';
        else sp.textContent = '¡El aprendizaje es un camino diario! 💡📖';
    }

    showScreen('screen-results');
    if (window.effectsManager) window.effectsManager.triggerFuegosAcademicos();
    updateBuhoReaction('graduate');
    guardarPuntajeEnBackend();
}

async function guardarPuntajeEnBackend() {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
                action: 'guardar_puntaje',
                id_usuario: state.idUsuario,
                materia: state.materiaActual,
                puntaje: state.score,
                racha_maxima: state.maxStreak
            })
        });
    } catch (err) {
        console.warn('No se pudo guardar el puntaje en el backend (guardado en caché local)', err);
    }
}

function volverAlInicio() {
    clearAllTimers();
    state.isFrozen = false;
    state.preguntas = [];
    state.preguntaActual = null;
    state.materiaActual = null;
    document.body.className = '';
    updateScore(); updateStreak(); updateProgress();
    mostrarPantallaMaterias();
}

// ===== LEADERBOARD =====
async function loadLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Cargando tabla...</td></tr>';
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'obtener_lideres', materia: state.materiaActual || '' })
        });
        const data = await response.json();
        if (!data.success) {
            tbody.innerHTML = '<tr><td colspan="4">Sin datos de ranking actualmente</td></tr>';
            return;
        }
        tbody.innerHTML = '';
        data.ranking.forEach((item, i) => {
            const r = document.createElement('tr');
            r.innerHTML = `<td class="${i<3?'rank-'+(i+1):''}">${i+1}</td><td>${item.nombre}</td><td>${item.puntaje_maximo} pts</td><td>${'🏅'.repeat(item.racha_maxima ? 1 : 0)}</td>`;
            tbody.appendChild(r);
        });
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="4">Servidor offline / Sin datos localmente</td></tr>';
    }
}

// ===== POWER-UPS & TEMPORIZADOR =====
function setupPowerups() {
    ['time','freeze','hint'].forEach(t => {
        document.getElementById(`powerup-${t}`)?.addEventListener('click', () => usePowerup(t));
    });
}

function usePowerup(type) {
    if (state.powerups[type] <= 0) return;
    if ((type === 'time' || type === 'freeze') && state.mode !== 'timed') return;
    state.powerups[type]--;
    state.powerupsUsedThisLevel = true;
    updatePowerupButtons();
    playSound('powerup');
    
    switch (type) {
        case 'time':
            if (state.mode === 'timed') { state.timer += 15; updateTimerDisplay(); }
            break;
        case 'freeze':
            state.isFrozen = true;
            updateBuhoReaction('frozen');
            state._freezeTimeout = setTimeout(() => {
                state.isFrozen = false;
                updateBuhoReaction('thinking');
            }, 10000);
            break;
        case 'hint':
            const q = state.preguntaActual;
            if (q && q.hint) {
                showFeedback(`💡 Pista: ${q.hint}`, 'correct');
            } else {
                showFeedback('💡 Descartada una opción ilógica.', 'correct');
            }
            break;
    }
}

function updatePowerupButtons() {
    ['time','freeze','hint'].forEach(t => {
        const b = document.getElementById(`powerup-${t}`);
        if (!b) return;
        const s = b.querySelector('small');
        if (s) s.textContent = `(${state.powerups[t]})`;
        b.disabled = state.powerups[t] <= 0 || ((t === 'time' || t === 'freeze') && state.mode !== 'timed');
    });
}

function startTimer() {
    clearAllTimers();
    state.timer = materiasDisponibles.find(m => m.id === state.materiaActual)?.timerDefault || 60;
    updateTimerDisplay();
    
    state.timerInterval = setInterval(() => {
        if (state.isFrozen) return;
        state.timer--;
        updateTimerDisplay();
        if (state.timer <= 0) {
            clearAllTimers();
            const q = state.preguntaActual;
            if (q) evaluarRespuesta(false, q);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const td = document.getElementById('timer-display');
    if (td) td.textContent = `⏱️ ${state.timer}s`;
}

// ===== INTERFAZ & UI =====
function updateScore() {
    const b = document.getElementById('score-badge');
    if (b) b.textContent = `⭐ ${state.score} pts`;
}

function updateStreak() {
    const s = document.getElementById('streak-display');
    if (s) s.textContent = `🔥 ${state.streak}`;
}

function updateProgress() {
    const p = document.getElementById('progress-fill');
    if (p) p.style.width = `${(state.indiceActual / state.totalPreguntas) * 100}%`;
}

function showFeedback(msg, type) {
    const fb = document.getElementById('feedback-box');
    if (!fb) return;
    fb.textContent = msg;
    fb.className = `feedback-box ${type}`;
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    if (screen) screen.classList.add('active');
    if (id === 'screen-leaderboard') loadLeaderboard();
    if (id === 'screen-badges') loadBadges();
}

// ===== INSIGNIAS =====
function checkBadges() {
    if (state.score >= 3000 && !state.badges.paesPro) {
        state.badges.paesPro = true; playSound('achievement'); mostrarToast('¡PAES Pro!', '🏆'); saveBadges();
    }
    if (state.streak >= 5 && !state.badges.streaker) {
        state.badges.streaker = true; playSound('achievement'); mostrarToast('¡Rachador!', '🔥'); saveBadges();
    }
}

function getBadgeIcon(b) { const icons = { perfectScore:'💯', speedDemon:'⚡', streaker:'🔥', paesPro:'🏆', noPowerups:'💪' }; return icons[b] || '🏅'; }
function getBadgeName(b) { const names = { perfectScore:'Puntaje Perfecto', speedDemon:'Velocista', streaker:'Rachador', paesPro:'PAES Pro', noPowerups:'Poder Natural' }; return names[b] || b; }

function loadBadges() {
    const saved = safeLocalGet('paes_badges_v4', null);
    if (saved) { try { state.badges = { ...state.badges, ...JSON.parse(saved) }; } catch(e) {} }
    const g = document.getElementById('badges-grid');
    if (!g) return;
    g.innerHTML = '';
    for (const [b,u] of Object.entries(state.badges)) {
        const e = document.createElement('div');
        e.className = `badge-item ${u?'unlocked':''}`;
        e.innerHTML = `<div class="badge-icon">${getBadgeIcon(b)}</div><div class="badge-name">${getBadgeName(b)}</div>`;
        g.appendChild(e);
    }
}

function saveBadges() { safeLocalSet('paes_badges_v4', JSON.stringify(state.badges)); }

// ===== LECTURA Y RESALTADO =====
function resaltarSeleccion(textKey) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    if (!bodyEl || !bodyEl.contains(range.commonAncestorContainer)) return;
    
    const span = document.createElement('span');
    span.className = 'lectura-resaltado';
    try { range.surroundContents(span); } catch (e) {}
    selection.removeAllRanges();
    guardarResaltados(textKey);
}

function guardarResaltados(textKey) {
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    if (!bodyEl) return;
    const resaltados = [];
    bodyEl.querySelectorAll('.lectura-resaltado').forEach((span, index) => {
        resaltados.push({ texto: span.textContent, posicion: index, timestamp: Date.now() });
    });
    safeLocalSet(`paes_resaltados_${textKey}`, JSON.stringify(resaltados));
}

function aplicarResaltadosGuardados(textKey, resaltados) {
    if (!resaltados || resaltados.length === 0) return;
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    if (!bodyEl) return;
    
    resaltados.forEach(res => {
        const regex = new RegExp(`(${escapeRegExp(res.texto)})`, 'g');
        bodyEl.innerHTML = bodyEl.innerHTML.replace(regex, `<span class="lectura-resaltado">$1</span>`);
    });
}

function limpiarResaltados(textKey) {
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    if (!bodyEl) return;
    bodyEl.querySelectorAll('.lectura-resaltado').forEach(span => {
        span.replaceWith(document.createTextNode(span.textContent));
    });
    safeLocalSet(`paes_resaltados_${textKey}`, '[]');
}

function limpiarResaltadosAntiguos() {
    if (typeof paesTexts === 'undefined') return;
    const ahora = Date.now();
    const treintaDias = 30 * 24 * 60 * 60 * 1000;
    Object.keys(paesTexts).forEach(key => {
        const guardados = JSON.parse(safeLocalGet(`paes_resaltados_${key}`, '[]'));
        if (guardados.length > 0) {
            const filtrados = guardados.filter(r => (ahora - (r.timestamp || 0)) < treintaDias);
            safeLocalSet(`paes_resaltados_${key}`, JSON.stringify(filtrados));
        }
    });
}

function resaltarEvidenciaEnLectura(textKey, evidenceText, tipo) {
    if (!textKey || !evidenceText) return;
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    if (!bodyEl) return;
    
    const fragmento = evidenceText.substring(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
        const regex = new RegExp(`(${fragmento})`, 'i');
        const clase = tipo === 'correct' ? 'evidencia-correcta' : 'evidencia-incorrecta';
        bodyEl.innerHTML = bodyEl.innerHTML.replace(regex, `<span class="${clase}">$1</span>`);
    } catch (e) {}
}

function abrirLecturaFullscreen(textKey) {
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    if (!bodyEl) return;
    if (state.mode === 'timed') state.isFrozen = true;

    const overlay = document.createElement('div');
    overlay.className = 'lectura-fullscreen-overlay';
    overlay.id = 'lectura-fullscreen-overlay';
    overlay.innerHTML = `
        <div class="lectura-fullscreen-header">
            <strong>📖 Vista de Lectura Completa</strong>
            <button class="btn-lectura-cerrar" onclick="cerrarLecturaFullscreen()">✕ Cerrar</button>
        </div>
        <div class="lectura-fullscreen-content" id="lectura-fullscreen-body">${bodyEl.innerHTML}</div>`;
    document.body.appendChild(overlay);
}

function cerrarLecturaFullscreen() {
    const overlay = document.getElementById('lectura-fullscreen-overlay');
    if (overlay) overlay.remove();
    if (state.mode === 'timed') state.isFrozen = false;
}

// ===== PWA =====
function setupInstalacionPWA() {
    window.addEventListener('beforeinstallprompt', (e) => e.preventDefault());
}

// ===== SABIONDO & REACCIONES =====
function updateBuhoReaction(r) {
    const sp = document.getElementById('question-speech');
    const msgs = {
        'thinking':['¡Analiza con sabiduría! 🦉','Lee con atención 📖'],
        'correct':['¡Excelente respuesta! ✨','¡Puntos para el marcador! 🌟'],
        'incorrect':['¡Atención a la explicación! 📚','¡Aprender del error es clave! 💪'],
        'determined':['¡Vamos con la siguiente! 😤','¡Tú puedes superarlo! 📖'],
        'graduate':['¡Felicidades por completar el desafío! 🎓✨']
    };
    const list = msgs[r] || msgs['thinking'];
    if (sp) sp.textContent = list[Math.floor(Math.random()*list.length)];
}

function createSpeedBonusToast() {
    if (document.getElementById('speed-bonus-toast')) return;
    const t = document.createElement('div');
    t.className = 'speed-bonus-toast';
    t.id = 'speed-bonus-toast';
    document.body.appendChild(t);
}

function showSpeedBonus(p) {
    const t = document.getElementById('speed-bonus-toast');
    if (!t) return;
    t.textContent = `⚡ +${p} pts bonus por velocidad!`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 1500);
}

function confirmarSalir() {
    clearAllTimers();
    if (confirm('¿Deseas salir del desafío actual y perder el progreso de esta ronda?')) {
        volverAlInicio();
    }
}

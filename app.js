/**
 * ============================================================
 * PAES Challenge Engine v5.2.0 — Token QR + Google Sheets
 * Autenticación por token de un solo uso + Nombre/PIN
 * Preguntas locales + Leaderboard en Google Sheets
 * SIN 50/50
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
    lecturaActiva: null
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
    try { const raw = localStorage.getItem(key); return raw !== null ? raw : fallback; }
    catch (e) { return fallback; }
}
function safeLocalSet(key, value) {
    try { localStorage.setItem(key, value); return true; }
    catch (e) { return false; }
}
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function mostrarErrorRegistro(msg) {
    const errorBox = document.getElementById('lock-error');
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
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
        mostrarPantallaInicial();
        return;
    }

    if (tokenURL) {
        const valido = await validarTokenQR(tokenURL);
        if (valido) {
            safeLocalSet(TOKEN_STORAGE_KEY, tokenURL);
            window.history.replaceState({}, document.title, window.location.pathname);
            mostrarPantallaInicial();
        } else {
            mostrarPantallaBloqueoQR('Token inválido o ya utilizado.');
        }
    } else {
        mostrarPantallaBloqueoQR();
    }
}

async function validarTokenQR(token) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'validar_token_qr', token: token })
        });
        const data = await response.json();
        return data.success === true;
    } catch (err) {
        console.error('Error validando token QR:', err);
        return false;
    }
}

function mostrarPantallaBloqueoQR(mensaje = '') {
    const qrScreen = document.getElementById('qr-lock-screen');
    if (!qrScreen) return;
    qrScreen.style.display = 'flex';
    document.getElementById('lock-screen').style.display = 'none';
    const errorBox = document.getElementById('qr-error');
    if (errorBox && mensaje) {
        errorBox.textContent = mensaje;
        errorBox.style.display = 'block';
    }
}

// ===== PANTALLA INICIAL =====
function mostrarPantallaInicial() {
    const idUsuario = safeLocalGet('paes_id_usuario', null);
    const nombre = safeLocalGet('paes_jugador_nombre', null);
    if (idUsuario && nombre) {
        state.idUsuario = idUsuario;
        state.nombreUsuario = nombre;
        mostrarPantallaMaterias();
    } else {
        mostrarPantallaRegistro();
    }
}

// ===== AUTENTICACIÓN (NOMBRE + PIN) =====
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
        document.getElementById('qr-lock-screen').style.display = 'none';
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
    const nombre = (nameInput?.value || '').trim();
    const pin = (pinInput?.value || '').trim();

    if (!nombre) {
        mostrarErrorRegistro('Por favor ingresa tu nombre.');
        nameInput?.focus();
        return;
    }
    if (!pin) {
        mostrarErrorRegistro('Por favor ingresa tu PIN o contraseña.');
        pinInput?.focus();
        return;
    }

    try {
        mostrarErrorRegistro('Conectando con el servidor...');
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'login_o_registro', nombre: nombre, pin: pin })
        });
        const data = await response.json();
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
        mostrarErrorRegistro('Error de conexión. Verifica tu internet.');
        console.error(err);
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
    info.innerHTML = `<strong>🦉 Sabiondo dice:</strong> Elige una materia para comenzar<br><small>Conectado como ${state.nombreUsuario}</small>`;
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

    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('lote-confirmacion').style.display = 'none';
}

function seleccionarMateria(materia) {
    const variable = materia.variable;
    const banco = typeof window[variable] !== 'undefined' ? window[variable] : [];

    if (banco.length === 0) {
        alert('No hay preguntas disponibles para esta materia.');
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
    if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
    if (state._boredTimeout) clearTimeout(state._boredTimeout);

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
    clearInterval(state.timerInterval); state.timerInterval = null;
    if (state._boredTimeout) clearTimeout(state._boredTimeout);
    if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
    state._freezeTimeout = null; state.isFrozen = false;
    state.questionStartTime = Date.now();

    const q = state.preguntaActual;

    ['options-grid','matching-container','drag-container','slider-container'].forEach(id => {
        const el = document.getElementById(id); if (el) { el.innerHTML = ''; el.style.display = 'none'; }
    });
    const fb = document.getElementById('feedback-box'); if (fb) { fb.className = 'feedback-box'; fb.innerHTML = ''; }
    const bn = document.getElementById('btn-next'); if (bn) bn.style.display = 'none';
    const qi = document.getElementById('question-image'); if (qi) qi.style.display = 'none';

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
                        <button class="btn-lectura-fullscreen" onclick="abrirLecturaFullscreen('${q.textKey}')" title="Ver en pantalla completa">⛶</button>
                        <span class="lectura-author">— ${texto.author || ''}</span>
                    </div>
                    <div class="lectura-body lectura-selectable" id="lectura-body-${q.textKey}">
                        ${texto.body.replace(/\n/g, '<br>')}
                    </div>
                    <div class="lectura-toolbar">
                        <button onclick="resaltarSeleccion('${q.textKey}')" title="Resaltar selección">🖍️ Resaltar</button>
                        <button onclick="limpiarResaltados('${q.textKey}')" title="Limpiar resaltados">🗑️ Limpiar</button>
                        <button class="btn-lectura-fullscreen" onclick="abrirLecturaFullscreen('${q.textKey}')" title="Pantalla completa">⛶ Completa</button>
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
    if (qt) qt.textContent = q.question || '';

    if (q.type === 'multiple' || q.type === 'opcion_multiple') {
        loadMultipleChoice(q);
    } else if (q.type === 'slider') {
        loadSlider(q);
    } else if (q.type === 'matching') {
        loadMatching(q);
    } else if (q.type === 'drag') {
        loadDrag(q);
    }

    if (state.mode === 'timed') startTimer();
    updateProgress();
}

// ===== FUNCIONES DE PREGUNTAS =====
function loadMultipleChoice(q) {
    const grid = document.getElementById('options-grid'); if (!grid) return;
    grid.style.display = 'flex';
    const opciones = Array.isArray(q.options) ? q.options : [];
    const indices = opciones.map((_, i) => i);
    const shuffled = shuffleArray(indices);
    q._shuffledIndices = shuffled;
    shuffled.forEach((orig) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opciones[orig];
        btn.dataset.originalIndex = orig;
        btn.addEventListener('click', () => checkMultipleAnswer(orig, q));
        grid.appendChild(btn);
    });
}
function loadMatching(q) {
    const mc = document.getElementById('matching-container'); if (!mc) return;
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
    const sc = document.getElementById('slider-container'); if (!sc) return;
    sc.style.display = 'block';
    const min = parseFloat(q.min || 0); const max = parseFloat(q.max || 100);
    const vd = document.createElement('div'); vd.className = 'slider-value'; vd.textContent = min; vd.id = 'slider-value-display';
    const tr = document.createElement('div'); tr.className = 'slider-track';
    const fl = document.createElement('div'); fl.className = 'slider-fill'; fl.style.width = '0%';
    const inp = document.createElement('input'); inp.type = 'range'; inp.className = 'slider-input'; inp.min = min; inp.max = max; inp.step = '0.1'; inp.value = min;
    inp.addEventListener('input', () => { fl.style.width = `${((inp.value-min)/(max-min))*100}%`; vd.textContent = inp.value; });
    tr.appendChild(fl); tr.appendChild(inp);
    const sb = document.createElement('button'); sb.className = 'main-btn'; sb.textContent = 'Confirmar ✅';
    sb.addEventListener('click', () => {
        const userAnswer = parseFloat(inp.value);
        const correct = Math.abs(userAnswer - parseFloat(q.correctAnswer)) <= parseFloat(q.tolerance || 0.5);
        evaluarRespuesta(correct, q);
    });
    sc.appendChild(vd); sc.appendChild(tr); sc.appendChild(sb);
}
function loadDrag(q) {
    const dc = document.getElementById('drag-container'); if (!dc) return;
    dc.style.display = 'flex';
    const items = q.items || [];
    items.forEach((item, idx) => {
        const dz = document.createElement('div'); dz.className = 'drop-zone'; dz.textContent = `${idx+1}. Soltar aquí`; dz.dataset.index = idx;
        dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
        dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
        dz.addEventListener('drop', e => {
            e.preventDefault(); dz.classList.remove('drag-over');
            const itemIndex = e.dataTransfer.getData('text/plain');
            dz.textContent = `${idx+1}. ${items[itemIndex]}`; dz.dataset.filled = itemIndex;
            checkDragComplete(q, items.length);
        });
        dc.appendChild(dz);
    });
    const ic = document.createElement('div'); ic.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-top:10px';
    shuffleArray(items).forEach((item, idx) => {
        const dg = document.createElement('div'); dg.className = 'draggable-item'; dg.textContent = item; dg.draggable = true; dg.dataset.originalIndex = idx;
        dg.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', idx); dg.style.opacity = '0.5'; });
        dg.addEventListener('dragend', () => { dg.style.opacity = '1'; });
        ic.appendChild(dg);
    });
    dc.appendChild(ic);
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

// ===== EVALUACIÓN LOCAL =====
function checkMultipleAnswer(oi, q) {
    if (window.effectsManager) window.effectsManager.ensureAudio();
    const opts = document.querySelectorAll('.option-btn');
    opts.forEach(b => b.disabled = true);
    clearInterval(state.timerInterval); state.timerInterval = null;
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
        if (tiempo < 3) {
            const bonus = Math.round(pts * 0.5);
            pts += bonus;
            showSpeedBonus(bonus);
        }
        state.score += pts;
        updateScore(); updateStreak(); playSound('correct');
        if (window.effectsManager) window.effectsManager.triggerConfettiAcademico();
        if (tiempo < 3 && window.effectsManager) window.effectsManager.triggerScreenFlash(180);
        updateBuhoReaction('correct');
        if (state.streak >= 5) {
            document.getElementById('streak-display')?.classList.add('on-fire');
            if (window.effectsManager) window.effectsManager.triggerStarRain();
            setTimeout(() => updateBuhoReaction('impressed'), 400);
        } else if (state.streak >= 3) {
            if (window.effectsManager) window.effectsManager.triggerStarRain();
            setTimeout(() => updateBuhoReaction('impressed'), 400);
        }
        showFeedback(`¡Correcto! ${q.explanation || ''}`, 'correct');
    } else {
        state.streak = 0;
        updateStreak(); playSound('incorrect');
        showFeedback(`Incorrecto. ${q.explanation || ''}`, 'incorrect');
        setTimeout(() => updateBuhoReaction('determined'), 400);
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
    clearInterval(state.timerInterval); state.timerInterval = null; state.isFrozen = false;
    if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
    state._freezeTimeout = null;
    document.getElementById('streak-display')?.classList.remove('on-fire');
    if (state.preguntaActual) {
        loadQuestion();
    } else {
        finalizarPartida();
    }
}

// ===== FINALIZAR PARTIDA =====
function finalizarPartida() {
    clearInterval(state.timerInterval); state.timerInterval = null;
    if (state._boredTimeout) clearTimeout(state._boredTimeout);
    if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
    state._freezeTimeout = null; state.isFrozen = false;

    document.getElementById('final-score').textContent = state.score;
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

    const ta = document.getElementById('topic-analysis');
    if (ta) {
        ta.innerHTML = '';
        const tn = { numeros:'Números', algebra:'Álgebra', geometria:'Geometría', probabilidad:'Probabilidad', estadistica:'Estadística', localizar:'Lectura: Localizar', interpretar:'Lectura: Interpretar', evaluar:'Lectura: Evaluar', biologia:'Biología', fisica:'Física', quimica:'Química' };
        const tc = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#6366F1','#14B8A6','#F97316','#84CC16','#06B6D4'];
        let ci = 0;
        for (const [topic, scores] of Object.entries(state.topicScores)) {
            const pct = scores.total > 0 ? Math.round((scores.correct/scores.total)*100) : 0;
            const bar = document.createElement('div');
            bar.className = 'topic-bar';
            bar.innerHTML = `<span class="topic-label">${tn[topic]||topic}</span><div class="topic-progress"><div class="topic-fill" style="width:${pct}%;background:${tc[ci]}"></div></div><span class="topic-score">${pct}%</span>`;
            ta.appendChild(bar);
            ci = (ci+1) % tc.length;
        }
    }

    const sb = document.getElementById('share-badges');
    if (sb) {
        sb.innerHTML = '';
        for (const [b,u] of Object.entries(state.badges)) {
            if (u) {
                const be = document.createElement('span');
                be.className = 'share-badge';
                be.textContent = getBadgeIcon(b);
                sb.appendChild(be);
            }
        }
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
        console.warn('No se pudo guardar el puntaje en el backend', err);
    }
}

function volverAlInicio() {
    clearInterval(state.timerInterval); state.timerInterval = null;
    if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
    state._freezeTimeout = null; state.isFrozen = false;
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
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Cargando...</td></tr>';
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'obtener_lideres', materia: state.materiaActual || '' })
        });
        const data = await response.json();
        if (!data.success) {
            tbody.innerHTML = '<tr><td colspan="4">No se pudo cargar el ranking</td></tr>';
            return;
        }
        tbody.innerHTML = '';
        data.ranking.forEach((item, i) => {
            const r = document.createElement('tr');
            r.innerHTML = `<td class="${i<3?'rank-'+(i+1):''}">${i+1}</td><td>${item.nombre}</td><td>${item.puntaje_maximo} pts</td><td>${'🏅'.repeat(item.racha_maxima ? 1 : 0)}</td>`;
            tbody.appendChild(r);
        });
    } catch (err) {
        console.error(err);
        tbody.innerHTML = '<tr><td colspan="4">Error de conexión</td></tr>';
    }
}

// ===== POWER-UPS =====
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
    const btn = document.getElementById(`powerup-${type}`);
    if (btn) { btn.classList.add('flash'); setTimeout(() => btn.classList.remove('flash'), 300); }
    switch (type) {
        case 'time':
            if (state.mode === 'timed') { state.timer += 15; updateTimerDisplay(); }
            break;
        case 'freeze':
            if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
            state.isFrozen = true;
            updateBuhoReaction('frozen');
            const td = document.getElementById('timer-display');
            if (td) td.style.backgroundColor = '#10B981';
            state._freezeTimeout = setTimeout(() => {
                state.isFrozen = false;
                state._freezeTimeout = null;
                updateBuhoReaction('thinking');
                if (td) td.style.backgroundColor = 'var(--azul-oscuro)';
            }, 10000);
            break;
        case 'hint':
            const q = state.preguntaActual;
            if (q && q.hint) {
                showFeedback(`💡 Pista: ${q.hint}`, 'correct');
            } else if (q && (q.type === 'multiple' || q.type === 'opcion_multiple')) {
                const buttons = document.querySelectorAll('.option-btn');
                let hidden = false;
                buttons.forEach(btn => {
                    if (!hidden && parseInt(btn.dataset.originalIndex) !== parseInt(q.correct) && btn.style.visibility !== 'hidden') {
                        btn.style.visibility = 'hidden';
                        hidden = true;
                    }
                });
                showFeedback('💡 Se ha descartado una opción incorrecta.', 'correct');
            } else {
                showFeedback('💡 Piensa en la opción más lógica.', 'correct');
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

// ===== TEMPORIZADOR =====
function startTimer() {
    clearInterval(state.timerInterval); state.timerInterval = null;
    state.timer = materiasDisponibles.find(m => m.id === state.materiaActual)?.timerDefault || 60;
    updateTimerDisplay();
    const td = document.getElementById('timer-display'); if (td) td.classList.remove('warning');
    state.timerInterval = setInterval(() => {
        if (state.isFrozen) return;
        state.timer--;
        updateTimerDisplay();
        if (state.timer <= 10 && state.timer > 0) {
            if (td) td.classList.add('warning');
            updateBuhoReaction('nervous');
            if (window.effectsManager) window.effectsManager.playTick();
        }
        if (state.timer <= 0) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
            if (td) td.classList.remove('warning');
            const q = state.preguntaActual;
            if (q) evaluarRespuesta(false, q);
        }
    }, 1000);
}
function updateTimerDisplay() {
    const td = document.getElementById('timer-display');
    if (td) td.textContent = `⏱️ ${state.timer}s`;
}

// ===== UI =====
function updateScore() {
    const b = document.getElementById('score-badge');
    if (!b) return;
    b.textContent = `⭐ ${state.score} pts`;
    b.classList.add('pop');
    setTimeout(() => b.classList.remove('pop'), 300);
    if (window.effectsManager?.triggerScoreBadgeFlash) window.effectsManager.triggerScoreBadgeFlash();
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
    if (screen) {
        screen.classList.add('active');
        screen.classList.add('screen-expand');
        setTimeout(() => screen.classList.remove('screen-expand'), 500);
    }
    if (id === 'screen-leaderboard') loadLeaderboard();
    if (id === 'screen-badges') loadBadges();
    if (id === 'screen-welcome') {
        if (state.idUsuario) mostrarPantallaMaterias();
    }
    if (typeof injectBuhoSVGs === 'function') setTimeout(injectBuhoSVGs, 100);
}
function selectMode(m) {
    state.mode = m;
    document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`mode-${m}`)?.classList.add('selected');
    const td = document.getElementById('timer-display');
    if (td) td.style.display = m === 'timed' ? 'flex' : 'none';
    updatePowerupButtons();
}

// ===== INSIGNIAS =====
function checkBadges() {
    if (state.score >= 3000 && !state.badges.paesPro) {
        state.badges.paesPro = true; playSound('achievement');
        if (window.effectsManager) window.effectsManager.triggerFuegosAcademicos();
        mostrarToast('¡PAES Pro!', '🏆'); saveBadges();
    }
    if (state.streak >= 5 && !state.badges.streaker) {
        state.badges.streaker = true; playSound('achievement');
        if (window.effectsManager) window.effectsManager.triggerFuegosAcademicos();
        mostrarToast('¡Rachador!', '🔥'); saveBadges();
    }
    if (state.mode === 'timed' && (Date.now()-state.questionStartTime) < 3000 && !state.badges.speedDemon && state.streak > 0) {
        state.badges.speedDemon = true; playSound('achievement');
        if (window.effectsManager) window.effectsManager.triggerFuegosAcademicos();
        mostrarToast('¡Velocista!', '⚡'); saveBadges();
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
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        if (window.effectsManager) window.effectsManager.triggerToastAcademico('Selecciona un texto primero', { icon: '📝', duration: 2000 });
        return;
    }
    const range = selection.getRangeAt(0);
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    if (!bodyEl || !bodyEl.contains(range.commonAncestorContainer)) return;
    const span = document.createElement('span');
    span.className = 'lectura-resaltado';
    span.dataset.textKey = textKey;
    span.dataset.timestamp = Date.now();
    try { range.surroundContents(span); }
    catch (e) {
        const fragment = range.extractContents();
        const newSpan = document.createElement('span');
        newSpan.className = 'lectura-resaltado';
        newSpan.dataset.textKey = textKey;
        newSpan.dataset.timestamp = Date.now();
        newSpan.appendChild(fragment);
        range.insertNode(newSpan);
    }
    selection.removeAllRanges();
    guardarResaltados(textKey);
    if (window.effectsManager) window.effectsManager.triggerToastAcademico('¡Texto resaltado!', { icon: '🖍️', duration: 1500 });
}
function guardarResaltados(textKey) {
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    if (!bodyEl) return;
    const resaltados = [];
    bodyEl.querySelectorAll('.lectura-resaltado').forEach((span, index) => {
        resaltados.push({ texto: span.textContent, posicion: index, timestamp: span.dataset.timestamp || Date.now() });
    });
    const ahora = Date.now();
    const treintaDias = 30 * 24 * 60 * 60 * 1000;
    const filtrados = resaltados.filter(r => (ahora - r.timestamp) < treintaDias);
    safeLocalSet(`paes_resaltados_${textKey}`, JSON.stringify(filtrados));
}
function aplicarResaltadosGuardados(textKey, resaltados) {
    if (!resaltados || resaltados.length === 0) return;
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    if (!bodyEl) return;
    resaltados.forEach(res => {
        const regex = new RegExp(`(${escapeRegExp(res.texto)})`, 'g');
        const html = bodyEl.innerHTML;
        let encontrado = false;
        bodyEl.innerHTML = html.replace(regex, (match) => {
            if (!encontrado && !html.substring(0, html.indexOf(match)).includes('lectura-resaltado')) {
                encontrado = true;
                return `<span class="lectura-resaltado" data-textkey="${textKey}" data-timestamp="${res.timestamp}">${match}</span>`;
            }
            return match;
        });
    });
}
function limpiarResaltados(textKey) {
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    if (!bodyEl) return;
    bodyEl.querySelectorAll('.lectura-resaltado').forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
    });
    bodyEl.normalize();
    safeLocalSet(`paes_resaltados_${textKey}`, '[]');
    if (window.effectsManager) window.effectsManager.triggerToastAcademico('Resaltados eliminados', { icon: '🗑️', duration: 1500 });
}
function limpiarTodosResaltados() {
    if (typeof paesTexts === 'undefined') return;
    Object.keys(paesTexts).forEach(key => {
        safeLocalSet(`paes_resaltados_${key}`, '[]');
    });
}
function limpiarResaltadosAntiguos() {
    if (typeof paesTexts === 'undefined') return;
    const ahora = Date.now();
    const treintaDias = 30 * 24 * 60 * 60 * 1000;
    Object.keys(paesTexts).forEach(key => {
        const guardados = JSON.parse(safeLocalGet(`paes_resaltados_${key}`, '[]'));
        if (guardados.length > 0) {
            const filtrados = guardados.filter(r => (ahora - r.timestamp) < treintaDias);
            if (filtrados.length < guardados.length) {
                safeLocalSet(`paes_resaltados_${key}`, JSON.stringify(filtrados));
            }
        }
    });
}
function resaltarEvidenciaEnLectura(textKey, evidenceText, tipo) {
    if (!textKey || !evidenceText) return;
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    if (!bodyEl) return;
    bodyEl.querySelectorAll('.evidencia-correcta, .evidencia-incorrecta').forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
    });
    bodyEl.normalize();
    const fragmento = evidenceText.substring(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    try {
        const regex = new RegExp(`(${fragmento})`, 'i');
        const html = bodyEl.innerHTML;
        let encontrado = false;
        bodyEl.innerHTML = html.replace(regex, (match) => {
            if (!encontrado) {
                encontrado = true;
                const clase = tipo === 'correct' ? 'evidencia-correcta' : 'evidencia-incorrecta';
                return `<span class="${clase}" data-evidencia="true">${match}</span>`;
            }
            return match;
        });
        if (encontrado) {
            const evidencia = bodyEl.querySelector('.evidencia-correcta, .evidencia-incorrecta');
            if (evidencia) setTimeout(() => evidencia.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
        }
    } catch (e) { console.warn('No se pudo resaltar la evidencia:', e); }
}
function abrirLecturaFullscreen(textKey) {
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    if (!bodyEl) return;
    if (state.mode === 'timed') {
        state.isFrozen = true;
    }
    const overlay = document.createElement('div');
    overlay.className = 'lectura-fullscreen-overlay';
    overlay.id = 'lectura-fullscreen-overlay';
    overlay.innerHTML = `
        <div class="lectura-fullscreen-header">
            <div><div class="lectura-fullscreen-title">📖 Lectura</div></div>
            <button class="btn-lectura-cerrar" onclick="cerrarLecturaFullscreen()">✕ Cerrar</button>
        </div>
        <div class="lectura-fullscreen-content lectura-selectable" id="lectura-fullscreen-body">${bodyEl.innerHTML}</div>
        <div style="max-width:900px;width:100%;margin:10px auto 0;display:flex;gap:8px;">
            <button class="btn-lectura-cerrar" onclick="resaltarDesdeFullscreen('${textKey}')" style="background:#F59E0B;border-color:#F59E0B;">🖍️ Resaltar</button>
            <button class="btn-lectura-cerrar" onclick="limpiarResaltadosFullscreen('${textKey}')" style="background:#EF4444;border-color:#EF4444;">🗑️ Limpiar</button>
            <button class="btn-lectura-cerrar" onclick="cerrarLecturaFullscreen()">✕ Cerrar</button>
        </div>`;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}
function cerrarLecturaFullscreen() {
    const overlay = document.getElementById('lectura-fullscreen-overlay');
    if (overlay) { sincronizarResaltadosFullscreen(); overlay.remove(); }
    document.body.style.overflow = '';
    if (state.mode === 'timed' && !state._freezeTimeout) {
        state.isFrozen = false;
    }
}
function resaltarDesdeFullscreen(textKey) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        if (window.effectsManager) window.effectsManager.triggerToastAcademico('Selecciona un texto primero', { icon: '📝', duration: 2000 });
        return;
    }
    const range = selection.getRangeAt(0);
    const bodyEl = document.getElementById('lectura-fullscreen-body');
    if (!bodyEl || !bodyEl.contains(range.commonAncestorContainer)) return;
    const span = document.createElement('span');
    span.className = 'lectura-resaltado';
    span.dataset.textKey = textKey;
    span.dataset.timestamp = Date.now();
    try { range.surroundContents(span); }
    catch (e) {
        const fragment = range.extractContents();
        const newSpan = document.createElement('span');
        newSpan.className = 'lectura-resaltado';
        newSpan.dataset.textKey = textKey;
        newSpan.dataset.timestamp = Date.now();
        newSpan.appendChild(fragment);
        range.insertNode(newSpan);
    }
    selection.removeAllRanges();
    if (window.effectsManager) window.effectsManager.triggerToastAcademico('¡Texto resaltado!', { icon: '🖍️', duration: 1500 });
}
function limpiarResaltadosFullscreen(textKey) {
    const bodyEl = document.getElementById('lectura-fullscreen-body');
    if (!bodyEl) return;
    bodyEl.querySelectorAll('.lectura-resaltado').forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
    });
    bodyEl.normalize();
    if (window.effectsManager) window.effectsManager.triggerToastAcademico('Resaltados eliminados', { icon: '🗑️', duration: 1500 });
}
function sincronizarResaltadosFullscreen() {
    const textKey = state.lecturaActiva;
    if (!textKey) return;
    const fullscreenBody = document.getElementById('lectura-fullscreen-body');
    const panelBody = document.getElementById(`lectura-body-${textKey}`);
    if (fullscreenBody && panelBody) {
        panelBody.innerHTML = fullscreenBody.innerHTML;
        guardarResaltados(textKey);
    }
}
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('lectura-fullscreen-overlay');
        if (overlay) cerrarLecturaFullscreen();
    }
});

// ===== INSTALACIÓN PWA =====
const INSTALL_DISMISSED_KEY_PREFIX = 'paes_install_dismissed_';
let _deferredInstallPrompt = null;
let _splashYaCerrado = false;
function estaEnModoStandalone() { return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true; }
function esIOS() { const ua = window.navigator.userAgent || ''; return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
function bannerFueDescartado(tipo) { return safeLocalGet(INSTALL_DISMISSED_KEY_PREFIX + tipo, 'false') === 'true'; }
function mostrarBannerInstalacionAndroid() { if (bannerFueDescartado('android') || estaEnModoStandalone()) return; const banner = document.getElementById('install-banner-android'); if (banner) banner.style.display = 'flex'; }
function mostrarBannerInstalacionIOS() { if (bannerFueDescartado('ios') || estaEnModoStandalone()) return; const banner = document.getElementById('install-banner-ios'); if (banner) banner.style.display = 'flex'; }
function ocultarBannerInstalacion(tipo) { const banner = document.getElementById(`install-banner-${tipo}`); if (banner) banner.style.display = 'none'; }
function cerrarBannerInstalacion(tipo) { ocultarBannerInstalacion(tipo); safeLocalSet(INSTALL_DISMISSED_KEY_PREFIX + tipo, 'true'); }
function instalarPWAAndroid() { if (!_deferredInstallPrompt) { ocultarBannerInstalacion('android'); return; } _deferredInstallPrompt.prompt(); _deferredInstallPrompt.userChoice.then(() => { _deferredInstallPrompt = null; ocultarBannerInstalacion('android'); }); }
function setupInstalacionPWA() { if (estaEnModoStandalone()) return; window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); _deferredInstallPrompt = e; if (_splashYaCerrado) mostrarBannerInstalacionAndroid(); }); window.addEventListener('appinstalled', () => { _deferredInstallPrompt = null; ocultarBannerInstalacion('android'); safeLocalSet(INSTALL_DISMISSED_KEY_PREFIX + 'android', 'true'); }); document.getElementById('skip-splash-btn')?.addEventListener('click', () => { _splashYaCerrado = true; setTimeout(() => { if (estaEnModoStandalone()) return; if (_deferredInstallPrompt) mostrarBannerInstalacionAndroid(); else if (esIOS()) mostrarBannerInstalacionIOS(); }, 1500); }, { once: true }); }

// ===== SABIONDO =====
function updateBuhoReaction(r) {
    document.querySelectorAll('.buho-svg').forEach(b => { b.className = 'buho-svg'; void b.offsetWidth; b.className = 'buho-svg ' + r; });
    const sp = document.getElementById('question-speech');
    const msgs = {
        'thinking':['¡Analiza con sabiduría! 🦉','Tú puedes lograrlo 💪','Lee con atención 📖'],
        'nervous':['¡El tiempo vuela! ⏰','¡Confía en tu instinto! 😰'],
        'bored':['¡Despierta esa mente! ☕','¡Vamos, futuro universitario! 🎓'],
        'correct':['¡Correcto! ✨','¡Bien hecho! 🌟'],
        'incorrect':['¡No era esa! 💪','¡Cada error nos hace más fuertes! 📚'],
        'impressed':['¡Impresionante! 🤩','¡Eres un genio! 🌟'],
        'determined':['¡Ahora sí, con todo! 😤','Cada error es una lección 📚'],
        'graduate':['¡Lo lograste! 🎓','¡La universidad te espera! 🦉✨'],
        'frozen':['¡Tiempo congelado! 🥶','¡Respira y piensa! ❄️']
    };
    const list = msgs[r] || msgs['thinking'];
    if (sp) { sp.textContent = list[Math.floor(Math.random()*list.length)]; sp.className = 'character-speech state-'+r; sp.style.animation='none'; void sp.offsetHeight; sp.style.animation='speechBubbleIn 0.4s ease-out'; }
}

// ===== SPEED BONUS TOAST =====
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
    t.textContent = `⚡ +${p} pts`;
    t.classList.add('show');
    setTimeout(() => t.classList.add('hide'), 1500);
    setTimeout(() => t.classList.remove('show','hide'), 2000);
}

// ===== BOTÓN SALIR =====
function confirmarSalir() {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
    if (state._boredTimeout) clearTimeout(state._boredTimeout);

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.7);z-index:3000;display:flex;align-items:center;justify-content:center;font-family:Poppins,sans-serif;padding:20px';
    const box = document.createElement('div');
    box.style.cssText = 'background:white;padding:26px 24px;border-radius:18px;max-width:340px;width:100%;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.32)';
    box.innerHTML = `
        <div style="font-size:3rem;margin-bottom:10px;">🚪</div>
        <div style="font-weight:800;font-size:1.1rem;margin-bottom:6px;color:#1E293B;">¿Salir del desafío?</div>
        <div style="margin-bottom:16px;color:#64748B;font-size:0.85rem;">
            Pregunta ${state.indiceActual + 1} de ${state.totalPreguntas}<br>
            Puntaje actual: <b>${state.score} pts</b>
        </div>
        <div style="display:flex;gap:10px;justify-content:center;">
            <button id="salir-cancelar" style="flex:1;padding:11px 0;border-radius:10px;border:none;background:#E2E8F0;color:#334155;font-weight:700;cursor:pointer;font-family:inherit;">Continuar</button>
            <button id="salir-confirmar" style="flex:1;padding:11px 0;border-radius:10px;border:none;background:#EF4444;color:white;font-weight:700;cursor:pointer;font-family:inherit;">Salir</button>
        </div>`;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    box.querySelector('#salir-cancelar').addEventListener('click', () => {
        overlay.remove();
        if (state.mode === 'timed' && !state.isFrozen && document.getElementById('btn-next').style.display === 'none') {
            startTimer();
        }
    });
    box.querySelector('#salir-confirmar').addEventListener('click', () => {
        overlay.remove();
        volverAlInicio();
    });
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

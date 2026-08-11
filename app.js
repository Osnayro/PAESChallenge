
/**
 * ============================================================
 * PAES Challenge Engine v4.4.0 — Producción
 * Lógica del juego + 4 Lotes + Sabiondo 🦉 + 4 Niveles
 * + Cronómetro de desempeño + Sonido next.mp3
 * + Agrupación de preguntas por lectura (Nivel 1)
 * + Pantalla completa de lectura + Resaltado de texto
 * + Evidencia en lectura al responder (usa evidenceText)
 * + Limpieza automática de resaltados antiguos (>30 días)
 * + Botón Salir + Guardar/Continuar partida
 * + Envío de resultados a Google Sheets (con cola offline)
 * Para "PAES Challenge: Desafío de Admisión Universitaria"
 * ============================================================
 */

// ===== ESTADO GLOBAL =====
const state = {
    score: 0,
    levelScore: 0,
    streak: 0,
    maxStreak: 0,
    currentQuestion: 0,
    totalQuestions: 25,
    currentLevel: 1,
    mode: 'normal',
    timer: 60,
    timerInterval: null,
    _boredTimeout: null,
    _freezeTimeout: null,
    isFrozen: false,
    questions: [],
    correctInLevel: 0,
    powerups: {
        fifty: 3,
        time: 2,
        freeze: 1,
        hint: 2
    },
    powerupsUsedThisLevel: false,
    levelPerfect: true,
    questionStartTime: 0,
    bonusQuestionActive: false,
    levelStars: {},
    badges: {
        perfectScore: false,
        speedDemon: false,
        streaker: false,
        paesPro: false,
        noPowerups: false
    },
    topicScores: {},
    currentLote: null,
    loteData: null,
    lotesDisponibles: [],
    ultimoEstadoBocadillo: null,
    desafioStartTime: null,
    desafioEndTime: null,
    tiempoTotalDesafio: 0,
    totalPreguntasRespondidas: 0,
    lecturaActiva: null
};

// ===== MAPA DE NIVELES =====
const levelNames = {
    1: '📖 Competencia Lectora',
    2: '📐 Matemática 1 (M1)',
    3: '📊 Matemática 2 (M2)',
    4: '🔬 Ciencias'
};

const levelColors = {
    1: '#8B5CF6',
    2: '#3B82F6',
    3: '#10B981',
    4: '#EF4444'
};

const levelTimerDefaults = {
    1: 60,
    2: 45,
    3: 35,
    4: 40
};

const questionsPerLevel = {
    1: 25,
    2: 25,
    3: 25,
    4: 25
};

// ===== SISTEMA DE 4 LOTES =====
const LOTES_STORAGE_KEY = 'paes_lotes_v4';
const LOTES_VERSION = '4.4.0';

function generarLotes() {
    const todasLectora = [...(typeof paesLenguajeQuestions !== 'undefined' ? paesLenguajeQuestions : [])];
    const todasM1 = [...(typeof paesM1Questions !== 'undefined' ? paesM1Questions : [])];
    const todasM2 = [...(typeof paesM2Questions !== 'undefined' ? paesM2Questions : [])];
    const todasCiencias = [...(typeof paesCienciasQuestions !== 'undefined' ? paesCienciasQuestions : [])];

    const shuffleArr = (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    const lectoraPorLectura = agruparPorLectura(todasLectora);
    const lecturasKeys = shuffleArr(Object.keys(lectoraPorLectura));
    
    const dividirLecturasEn4 = () => {
        const total = lecturasKeys.length;
        const porLote = Math.floor(total / 4);
        const sobrantes = total % 4;
        const resultado = [];
        let idx = 0;
        for (let i = 0; i < 4; i++) {
            const lote = [];
            for (let j = 0; j < porLote; j++) {
                const key = lecturasKeys[idx];
                lote.push(...lectoraPorLectura[key]);
                idx++;
            }
            resultado.push(lote);
        }
        for (let i = 0; i < sobrantes; i++) {
            const key = lecturasKeys[idx];
            const preguntas = lectoraPorLectura[key];
            const mitad = Math.ceil(preguntas.length / 2);
            resultado[i].push(...preguntas.slice(0, mitad));
            resultado[i + 2].push(...preguntas.slice(mitad));
            idx++;
        }
        return resultado;
    };

    const lecParts = dividirLecturasEn4();
    const m1Shuffle = shuffleArr(todasM1);
    const m2Shuffle = shuffleArr(todasM2);
    const cienciasShuffle = shuffleArr(todasCiencias);

    const dividirEn4 = (arr) => {
        const len = arr.length;
        const parteSize = Math.ceil(len / 4);
        return [
            arr.slice(0, parteSize),
            arr.slice(parteSize, parteSize * 2),
            arr.slice(parteSize * 2, parteSize * 3),
            arr.slice(parteSize * 3)
        ];
    };

    const m1Parts = dividirEn4(m1Shuffle);
    const m2Parts = dividirEn4(m2Shuffle);
    const cienciasParts = dividirEn4(cienciasShuffle);

    const lotes = [];
    for (let i = 0; i < 4; i++) {
        lotes.push({
            id: i + 1,
            generado: Date.now(),
            version: LOTES_VERSION,
            preguntas: {
                lectora: lecParts[i].slice(0, questionsPerLevel[1]),
                matematica1: m1Parts[i].slice(0, questionsPerLevel[2]),
                matematica2: m2Parts[i].slice(0, questionsPerLevel[3]),
                ciencias: cienciasParts[i].slice(0, questionsPerLevel[4])
            },
            totalPreguntas: lecParts[i].slice(0, questionsPerLevel[1]).length + 
                           m1Parts[i].slice(0, questionsPerLevel[2]).length + 
                           m2Parts[i].slice(0, questionsPerLevel[3]).length + 
                           cienciasParts[i].slice(0, questionsPerLevel[4]).length
        });
    }
    return lotes;
}

// ===== UTILIDADES =====
function agruparPorLectura(preguntas) {
    const grupos = {};
    preguntas.forEach(q => {
        if (q.textKey) {
            if (!grupos[q.textKey]) grupos[q.textKey] = [];
            grupos[q.textKey].push(q);
        }
    });
    Object.values(grupos).forEach(g => g.sort((a, b) => a.id - b.id));
    return grupos;
}

function agruparPreguntasPorLectura(preguntas) {
    const grupos = agruparPorLectura(preguntas);
    const gruposArray = shuffleArray(Object.values(grupos));
    const resultado = [];
    gruposArray.forEach(grupo => grupo.forEach(q => resultado.push(q)));
    return resultado;
}

function deepCloneQuestions(arr) {
    try { return JSON.parse(JSON.stringify(arr)); }
    catch (e) { return arr; }
}

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

function guardarLotes(lotes) {
    safeLocalSet(LOTES_STORAGE_KEY, JSON.stringify({ version: LOTES_VERSION, lotes, timestamp: Date.now() }));
}

function cargarLotes() {
    const saved = safeLocalGet(LOTES_STORAGE_KEY, null);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.version === LOTES_VERSION && data.lotes && data.lotes.length === 4 &&
                data.lotes.every(l => l.preguntas && l.totalPreguntas > 0)) {
                const lotesConEstado = data.lotes.map(l => ({
                    ...l,
                    usado: safeLocalGet(`paes_lote_${l.id}_usado_v4`, 'false') === 'true'
                }));
                if (lotesConEstado.every(l => l.usado)) {
                    const nuevosLotes = generarLotes();
                    guardarLotes(nuevosLotes);
                    for (let i = 1; i <= 4; i++) safeLocalSet(`paes_lote_${i}_usado_v4`, 'false');
                    return nuevosLotes.map(l => ({ ...l, usado: false }));
                }
                return lotesConEstado;
            }
        } catch (e) {}
    }
    const nuevosLotes = generarLotes();
    guardarLotes(nuevosLotes);
    for (let i = 1; i <= 4; i++) safeLocalSet(`paes_lote_${i}_usado_v4`, 'false');
    return nuevosLotes.map(l => ({ ...l, usado: false }));
}

function marcarLoteComoUsado(loteId) { safeLocalSet(`paes_lote_${loteId}_usado_v4`, 'true'); }

function getPreguntasNivel(nivel) {
    if (!state.loteData || !state.loteData.preguntas) return [];
    const preguntas = state.loteData.preguntas;
    const cantidad = questionsPerLevel[nivel] || 25;
    switch (nivel) {
        case 1: return [...preguntas.lectora].slice(0, cantidad);
        case 2: return [...preguntas.matematica1].slice(0, cantidad);
        case 3: return [...preguntas.matematica2].slice(0, cantidad);
        case 4: return [...preguntas.ciencias].slice(0, cantidad);
        default: return [...preguntas.lectora].slice(0, cantidad);
    }
}

// ===== SONIDO =====
function playSound(type) {
    const alwaysPlay = ['correct', 'incorrect', 'levelup', 'levelstart', 'achievement', 'powerup', 'next'];
    if (!alwaysPlay.includes(type) && state.mode === 'normal') return;
    if (window.effectsManager) window.effectsManager.playSound(type);
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    cargarYMostrarLotes();
    loadBadges();
    loadLeaderboard();
    setupPowerups();
    createSpeedBonusToast();
    if (typeof injectBuhoSVGs === 'function') injectBuhoSVGs();
    flushPendingGoogleSheets();
    limpiarResaltadosAntiguos();
    setupPantallaRegistro();
    setupInstalacionPWA();
});

window.addEventListener('online', () => {
    flushPendingGoogleSheets();
});

// ===== INSTALACIÓN PWA (Android / iPhone) =====
// Android: capturamos 'beforeinstallprompt' y mostramos nuestro propio botón
// "Instalar" — al tocarlo se dispara el diálogo nativo de Chrome.
// iOS/iPadOS: Safari NO dispara 'beforeinstallprompt' ni permite instalar
// por código (restricción de Apple, no hay forma de saltarla), así que
// mostramos un banner con instrucciones manuales (Compartir → Agregar a
// inicio). En ambos casos, si la app ya está instalada (modo standalone)
// o el usuario ya cerró el banner antes, no se vuelve a mostrar.
const INSTALL_DISMISSED_KEY_PREFIX = 'paes_install_dismissed_';
let _deferredInstallPrompt = null;
let _splashYaCerrado = false;

function estaEnModoStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
           window.navigator.standalone === true; // Safari iOS (propiedad antigua)
}

function esIOS() {
    const ua = window.navigator.userAgent || '';
    const esIPhoneIPad = /iPad|iPhone|iPod/.test(ua);
    // iPadOS 13+ se reporta como 'MacIntel' pero con soporte táctil
    const esIPadDisfrazado = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    return esIPhoneIPad || esIPadDisfrazado;
}

function bannerFueDescartado(tipo) {
    return safeLocalGet(INSTALL_DISMISSED_KEY_PREFIX + tipo, 'false') === 'true';
}

function mostrarBannerInstalacionAndroid() {
    if (bannerFueDescartado('android') || estaEnModoStandalone()) return;
    const banner = document.getElementById('install-banner-android');
    if (banner) banner.style.display = 'flex';
}

function mostrarBannerInstalacionIOS() {
    if (bannerFueDescartado('ios') || estaEnModoStandalone()) return;
    const banner = document.getElementById('install-banner-ios');
    if (banner) banner.style.display = 'flex';
}

function ocultarBannerInstalacion(tipo) {
    const banner = document.getElementById(`install-banner-${tipo}`);
    if (banner) banner.style.display = 'none';
}

function cerrarBannerInstalacion(tipo) {
    ocultarBannerInstalacion(tipo);
    safeLocalSet(INSTALL_DISMISSED_KEY_PREFIX + tipo, 'true');
}

function instalarPWAAndroid() {
    if (!_deferredInstallPrompt) { ocultarBannerInstalacion('android'); return; }
    _deferredInstallPrompt.prompt();
    _deferredInstallPrompt.userChoice.then((choice) => {
        console.log(choice.outcome === 'accepted' ? '✅ PWA instalada' : 'Instalación descartada por el usuario');
        _deferredInstallPrompt = null;
        ocultarBannerInstalacion('android');
    });
}

function setupInstalacionPWA() {
    if (estaEnModoStandalone()) return; // ya instalada: no mostrar nada

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // evitamos el mini-banner por defecto del navegador, usamos el nuestro
        _deferredInstallPrompt = e;
        if (_splashYaCerrado) mostrarBannerInstalacionAndroid();
    });

    window.addEventListener('appinstalled', () => {
        _deferredInstallPrompt = null;
        ocultarBannerInstalacion('android');
        safeLocalSet(INSTALL_DISMISSED_KEY_PREFIX + 'android', 'true');
    });

    document.getElementById('skip-splash-btn')?.addEventListener('click', () => {
        _splashYaCerrado = true;
        // Pequeño retraso para no competir visualmente con la pantalla de
        // bienvenida/registro que aparece justo al cerrar el splash.
        setTimeout(() => {
            if (estaEnModoStandalone()) return;
            if (_deferredInstallPrompt) mostrarBannerInstalacionAndroid();
            else if (esIOS()) mostrarBannerInstalacionIOS();
        }, 1500);
    }, { once: true });
}

// ===== REGISTRO INICIAL (nombre + clave, solo la primera vez) =====
// Nota: esto NO es un sistema de autenticación real — la clave vive en
// este archivo JS, así que cualquiera con acceso al código fuente puede
// leerla o saltarse el paso borrando el localStorage. Es un paso de
// bienvenida/registro de nombre para personalizar la app, no un login
// seguro. Si necesitas seguridad real, la validación debe hacerse en
// un servidor, no en el navegador del usuario.
const LOCK_REGISTERED_KEY = 'paes_registrado_v1';
const LOCK_PASSWORD = 'Atenea'; // clave de acceso — cámbiala aquí si es necesario
const LOCK_SCREEN_ENABLED = true; // <- pon en true para reactivar la pantalla de registro inicial

function estaRegistrado() {
    return safeLocalGet(LOCK_REGISTERED_KEY, 'false') === 'true';
}

function setupPantallaRegistro() {
    if (!LOCK_SCREEN_ENABLED) return; // pantalla de registro desactivada
    const skipBtn = document.getElementById('skip-splash-btn');
    if (!skipBtn) return;
    skipBtn.addEventListener('click', () => {
        if (!estaRegistrado()) mostrarPantallaRegistro();
    }, { once: true });

    const nameInput = document.getElementById('lock-name-input');
    const passInput = document.getElementById('lock-password-input');
    nameInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') passInput?.focus(); });
    passInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') intentarIngresoInicial(); });
}

function mostrarPantallaRegistro() {
    const lock = document.getElementById('lock-screen');
    if (!lock) return;
    lock.style.display = 'flex';
    setTimeout(() => document.getElementById('lock-name-input')?.focus(), 300);
}

function ocultarPantallaRegistro() {
    const lock = document.getElementById('lock-screen');
    if (lock) lock.style.display = 'none';
}

function mostrarErrorRegistro(msg) {
    const errorBox = document.getElementById('lock-error');
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
}

function intentarIngresoInicial() {
    const nameInput = document.getElementById('lock-name-input');
    const passInput = document.getElementById('lock-password-input');
    const nombre = (nameInput?.value || '').trim();
    const clave = (passInput?.value || '').trim();

    if (!nombre) {
        mostrarErrorRegistro('Por favor ingresa tu nombre.');
        nameInput?.focus();
        return;
    }
    if (clave !== LOCK_PASSWORD) {
        mostrarErrorRegistro('Clave incorrecta. Intenta nuevamente.');
        if (passInput) passInput.value = '';
        passInput?.focus();
        return;
    }

    safeLocalSet(LOCK_REGISTERED_KEY, 'true');
    safeLocalSet('paes_jugador_nombre', nombre);
    ocultarPantallaRegistro();
    enviarRegistroInicialGoogleSheets(nombre);
}

function enviarRegistroInicialGoogleSheets(nombre) {
    const payload = {
        tipo: 'registro_inicial',
        jugador: nombre,
        fecha: new Date().toISOString()
    };
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        encolarEnvioPendiente(payload);
        return;
    }
    intentarEnviarGoogleSheets(payload).catch(() => encolarEnvioPendiente(payload));
}

function cargarYMostrarLotes() {
    state.lotesDisponibles = cargarLotes();
    actualizarSelectorLotes(state.lotesDisponibles);
}

function actualizarSelectorLotes(lotes) {
    const container = document.getElementById('lote-selector');
    if (!container) return;
    const disponibles = lotes.filter(l => !l.usado);
    container.innerHTML = '';
    if (disponibles.length === 0) {
        container.innerHTML = `<div class="info-card" style="text-align:center;border-left-color:#F59E0B;"><b>¡Completaste las 4 partidas!</b><br><small>Reinicia para nuevas preguntas</small></div>
        <button class="main-btn pulse-ready" onclick="reiniciarLotes()">🔄 Generar Nuevas Partidas</button>`;
        return;
    }
    const info = document.createElement('div');
    info.className = 'info-card';
    info.style.borderLeftColor = '#8B5CF6';
    info.innerHTML = `<strong>🦉 Sabiondo dice:</strong> Elige una partida<br><small>${disponibles.length} partida(s) disponible(s)</small>`;
    container.appendChild(info);
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%';
    const iconos = ['🎲','🎯','📚','🎓'];
    const colores = ['#8B5CF6','#3B82F6','#10B981','#EF4444'];
    lotes.forEach(lote => {
        const card = document.createElement('div');
        card.className = 'mode-card';
        card.style.cursor = lote.usado ? 'not-allowed' : 'pointer';
        card.style.opacity = lote.usado ? '0.5' : '1';
        if (!lote.usado) card.style.borderLeft = `4px solid ${colores[lote.id-1]}`;
        card.innerHTML = `<div class="mode-icon">${iconos[lote.id-1]}</div>
            <div class="mode-title">Partida ${lote.id}</div>
            <div class="mode-desc">${lote.totalPreguntas} preguntas</div>
            <div class="mode-desc" style="font-size:0.65rem;color:#64748B">📖${lote.preguntas.lectora.length} 📐${lote.preguntas.matematica1.length} 📊${lote.preguntas.matematica2.length} 🔬${lote.preguntas.ciencias.length}</div>
            ${lote.usado ? '<div style="font-size:0.7rem;color:#EF4444">✅ Completada</div>' : ''}`;
        if (!lote.usado) card.addEventListener('click', () => seleccionarLote(lote));
        grid.appendChild(card);
    });
    container.appendChild(grid);
}

function seleccionarLote(lote) {
    if (lote.usado) return;
    state.currentLote = lote.id;
    state.loteData = lote;
    document.getElementById('lote-selector').style.display = 'none';
    const btn = document.getElementById('btn-start');
    if (btn) { btn.style.display = 'block'; btn.textContent = `¡Comenzar Partida ${lote.id}! 🚀`; btn.classList.add('pulse-ready'); }
    const conf = document.getElementById('lote-confirmacion');
    if (conf) { conf.style.display = 'block'; conf.innerHTML = `✅ <b>Partida ${lote.id} seleccionada</b><br><small>📖${lote.preguntas.lectora.length} 📐${lote.preguntas.matematica1.length} 📊${lote.preguntas.matematica2.length} 🔬${lote.preguntas.ciencias.length}</small>`; }
}

function reiniciarLotes() {
    for (let i = 1; i <= 4; i++) safeLocalSet(`paes_lote_${i}_usado_v4`, 'false');
    localStorage.removeItem(LOTES_STORAGE_KEY);
    limpiarTodosResaltados();
    state.lotesDisponibles = cargarLotes();
    state.currentLote = null; state.loteData = null;
    actualizarSelectorLotes(state.lotesDisponibles);
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('lote-confirmacion').style.display = 'none';
    if (window.effectsManager) window.effectsManager.triggerToastAcademico('¡4 nuevas partidas! 🦉', { icon:'🔄', bg:'linear-gradient(135deg,#8B5CF6,#6D28D9)', duration:2500 });
}

function createSpeedBonusToast() {
    if (document.getElementById('speed-bonus-toast')) return;
    const t = document.createElement('div'); t.className = 'speed-bonus-toast'; t.id = 'speed-bonus-toast';
    document.body.appendChild(t);
}

function showSpeedBonus(p) {
    const t = document.getElementById('speed-bonus-toast'); if (!t) return;
    t.textContent = `⚡ +${p} pts`; t.classList.add('show');
    setTimeout(() => t.classList.add('hide'), 1500);
    setTimeout(() => t.classList.remove('show','hide'), 2000);
}

function triggerVisualStarsFromElement(el, c) { if (window.effectsManager) window.effectsManager.triggerStarsFromElement(el, c); }

function setupPowerups() {
    ['fifty','time','freeze','hint'].forEach(t => {
        document.getElementById(`powerup-${t}`)?.addEventListener('click', () => usePowerup(t));
    });
}

// ===== NAVEGACIÓN =====
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    if (screen) { screen.classList.add('active'); screen.classList.add('screen-expand'); setTimeout(() => screen.classList.remove('screen-expand'), 500); }
    if (id === 'screen-badges') loadBadges();
    if (id === 'screen-leaderboard') loadLeaderboard();
    if (id === 'screen-welcome') {
        cargarYMostrarLotes();
        document.getElementById('btn-start').style.display = 'none';
        document.getElementById('lote-confirmacion').style.display = 'none';
        document.getElementById('lote-selector').style.display = 'block';
    }
    if (typeof injectBuhoSVGs === 'function') setTimeout(injectBuhoSVGs, 100);
}

function selectMode(m) {
    state.mode = m;
    document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`mode-${m}`)?.classList.add('selected');
    const td = document.getElementById('timer-display'); if (td) td.style.display = m === 'timed' ? 'flex' : 'none';
    updatePowerupButtons();
}

// ===== INICIO DEL JUEGO =====
function startGame() {
    if (!state.currentLote || !state.loteData) {
        if (window.effectsManager) window.effectsManager.triggerToastAcademico('¡Elige una partida! 🦉', { icon:'⚠️', bg:'linear-gradient(135deg,#F59E0B,#D97706)', duration:2500 });
        return;
    }
    
    if (hayProgresoGuardado()) {
        mostrarModalContinuar();
        return;
    }
    
    iniciarJuegoNuevo();
}

function mostrarModalContinuar() {
    const progresoGuardado = JSON.parse(safeLocalGet('paes_progreso_actual', '{}'));
    const nivelNombre = levelNames[progresoGuardado.currentLevel] || 'desconocido';
    
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.7);z-index:3000;display:flex;align-items:center;justify-content:center;font-family:Poppins,sans-serif;padding:20px';
    
    const box = document.createElement('div');
    box.style.cssText = 'background:white;padding:26px 24px;border-radius:18px;max-width:360px;width:100%;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.32)';
    box.innerHTML = `
        <div style="font-size:3rem;margin-bottom:10px;">🎯</div>
        <div style="font-weight:800;font-size:1.1rem;margin-bottom:6px;color:#1E293B;">¿Continuar o reiniciar?</div>
        <div style="margin-bottom:16px;color:#64748B;font-size:0.85rem;">
            Tienes una partida guardada:<br>
            <b>${nivelNombre}</b><br>
            Pregunta ${progresoGuardado.currentQuestion + 1} de ${progresoGuardado.totalQuestions}<br>
            Puntaje: <b>${progresoGuardado.score} pts</b>
        </div>
        <div style="display:flex;gap:10px;justify-content:center;margin-bottom:10px;">
            <button id="continuar-partida" style="flex:1;padding:12px 0;border-radius:10px;border:none;background:linear-gradient(135deg,#10B981,#059669);color:white;font-weight:700;cursor:pointer;font-family:inherit;">▶ Continuar</button>
        </div>
        <button id="reiniciar-partida" style="width:100%;padding:12px 0;border-radius:10px;border:none;background:#EF4444;color:white;font-weight:700;cursor:pointer;font-family:inherit;">🔄 Reiniciar desde cero</button>`;
    
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    
    box.querySelector('#continuar-partida').addEventListener('click', () => {
        overlay.remove();
        restaurarProgreso(progresoGuardado);
    });
    
    box.querySelector('#reiniciar-partida').addEventListener('click', () => {
        overlay.remove();
        borrarProgreso();
        iniciarJuegoNuevo();
    });
}

function restaurarProgreso(progreso) {
    if (window.effectsManager) window.effectsManager.ensureAudio();
    
    state.score = progreso.score;
    state.levelScore = progreso.levelScore;
    state.streak = progreso.streak;
    state.currentQuestion = progreso.currentQuestion;
    state.totalQuestions = progreso.totalQuestions;
    state.currentLevel = progreso.currentLevel;
    state.questions = progreso.questions;
    state.correctInLevel = progreso.correctInLevel;
    state.topicScores = progreso.topicScores || {};
    state.currentLote = progreso.loteId;
    state.loteData = progreso.loteData;
    state.powerups = progreso.powerups;
    state.isFrozen = false;
    state.powerupsUsedThisLevel = false;
    state.levelPerfect = true;
    state.desafioStartTime = Date.now();
    state.lecturaActiva = null;
    
    document.body.className = `level-${state.currentLevel}`;
    updatePowerupButtons();
    updateLevelDisplay();
    updateScore();
    updateStreak();
    updateProgress();
    showScreen('screen-question');
    updateBuhoReaction('thinking');
    loadQuestion();
    
    borrarProgreso();
    
    if (window.effectsManager) {
        window.effectsManager.triggerToastAcademico('¡Partida restaurada! 🎯', { icon:'▶', bg:'linear-gradient(135deg,#10B981,#059669)', duration:2500 });
    }
}

function iniciarJuegoNuevo() {
    if (window.effectsManager) window.effectsManager.ensureAudio();
    state.desafioStartTime = Date.now();
    state.desafioEndTime = null;
    state.tiempoTotalDesafio = 0;
    state.totalPreguntasRespondidas = 0;
    state.score = 0;
    state.levelScore = 0;
    state.streak = 0;
    state.maxStreak = 0;
    state.currentQuestion = 0;
    state.currentLevel = 1;
    state.topicScores = {};
    state.isFrozen = false;
    state.powerupsUsedThisLevel = false;
    state.levelPerfect = true;
    state.levelStars = {};
    state.ultimoEstadoBocadillo = null;
    state.lecturaActiva = null;
    if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
    state._freezeTimeout = null;
    document.body.className = 'level-1';
    startLevel(1);
}

// ===== GUARDAR / BORRAR PROGRESO =====
function guardarProgreso() {
    const progreso = {
        score: state.score,
        levelScore: state.levelScore,
        streak: state.streak,
        currentQuestion: state.currentQuestion,
        totalQuestions: state.totalQuestions,
        currentLevel: state.currentLevel,
        questions: state.questions,
        correctInLevel: state.correctInLevel,
        topicScores: state.topicScores,
        loteId: state.currentLote,
        loteData: state.loteData,
        powerups: state.powerups,
        timestamp: Date.now()
    };
    safeLocalSet('paes_progreso_actual', JSON.stringify(progreso));
}

function borrarProgreso() {
    localStorage.removeItem('paes_progreso_actual');
}

function hayProgresoGuardado() {
    const saved = safeLocalGet('paes_progreso_actual', null);
    if (!saved) return false;
    try {
        const data = JSON.parse(saved);
        return (Date.now() - data.timestamp) < 2 * 60 * 60 * 1000;
    } catch (e) {
        return false;
    }
}

// ===== SALIR DEL JUEGO =====
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
            Estás en <b>${levelNames[state.currentLevel]}</b><br>
            Pregunta ${state.currentQuestion + 1} de ${state.totalQuestions}<br>
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
        guardarProgreso();
        overlay.remove();
        restartGame();
    });
    
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function startLevel(lv) {
    if (!state.loteData?.preguntas) return;
    state.currentLevel = lv; state.currentQuestion = 0; state.streak = 0;
    state.levelScore = 0; state.isFrozen = false; state.powerupsUsedThisLevel = false;
    state.levelPerfect = true; state.bonusQuestionActive = false; state.correctInLevel = 0;
    if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
    state._freezeTimeout = null;
    document.body.className = `level-${lv}`;
    const raw = getPreguntasNivel(lv);
    const cloned = deepCloneQuestions(raw);
    state.questions = lv === 1 ? cloned : shuffleArray(cloned);
    state.totalQuestions = state.questions.length;
    state.timer = levelTimerDefaults[lv] || 60;
    updatePowerupButtons(); updateLevelDisplay(); updateScore(); updateStreak(); updateProgress();
    showScreen('screen-question'); updateBuhoReaction('thinking'); playSound('levelstart');
    loadQuestion();
}

function goToNextLevel() {
    const next = state.currentLevel + 1;
    if (next <= 4) startLevel(next);
    else showFinalResults();
}

function updateLevelDisplay() {
    const ld = document.getElementById('level-display');
    if (!ld) return;
    ld.textContent = levelNames[state.currentLevel] || `Nivel ${state.currentLevel}`;
    ld.style.background = levelColors[state.currentLevel] || '#8B5CF6';
}

// ===== SABIONDO =====
function updateBuhoReaction(r) {
    state.ultimoEstadoBocadillo = r;
    document.querySelectorAll('.buho-svg').forEach(b => { b.className = 'buho-svg'; void b.offsetWidth; b.className = 'buho-svg ' + r; });
    const sp = document.getElementById('question-speech');
    const msgs = {
        'thinking':['¡Analiza con sabiduría! 🦉','Tú puedes lograrlo 💪','Lee con atención 📖','Confío en tu razonamiento 🧠','¿Cuál será la correcta? 🤓','Sin prisa, pero sin pausa ⏳'],
        'nervous':['¡El tiempo vuela! ⏰','¡Confía en tu instinto! 😰','¡Elige con convicción! ⚡','¡Últimos segundos! 🚨'],
        'bored':['¡Despierta esa mente! ☕','¡Vamos, futuro universitario! 🎓','¡Activa tus neuronas! 🧃'],
        'preocupacion':['¡Uy, cuidado! 🤔','¡Analiza antes de responder! 📖','¡Tómate un momento! ⏳'],
        'alivio':['¡Uf, menos mal! 😮‍💨','¡Qué alivio! 🌿','¡Buen trabajo! 💚'],
        'impressed':['¡Impresionante! 🤩','¡Eres un genio! 🌟','¡Vas directo a la universidad! 🎓✨'],
        'celebrating':['¡Nivel superado! 🥳','¡Sabiondo está orgulloso! 🦉🎉','¡Así se hace! 🌟'],
        'deep-think':['¡Activa tu modo genio! 🔬','¡Piensa profundamente! 🧐','¡Confía en tus cálculos! 📐'],
        'confident':['¡Eliminamos dos! 😎','¡El 50/50 te respalda! ✨','¡Tú tienes el control! 🕶️'],
        'frozen':['¡Tiempo congelado! 🥶','¡Respira y piensa! ❄️','¡Aprovecha estos segundos! ⏸️'],
        'determined':['¡Ahora sí, con todo! 😤','Cada error es una lección 📚','¡Los geniales también se equivocan! 🧠'],
        'graduate':['¡Lo lograste! 🎓','¡La universidad te espera! 🦉✨','¡De estudiante a PROFESIONAL! 🧠👑'],
        'correct':['¡Correcto! ✨','¡Bien hecho! 🌟','¡Así se hace! 💪'],
        'incorrect':['¡No era esa! 💪','¡Cada error nos hace más fuertes! 📚','¡Revisa la explicación! 👀']
    };
    const list = msgs[r] || msgs['thinking'];
    if (sp) { sp.textContent = list[Math.floor(Math.random()*list.length)]; sp.className = 'character-speech state-'+r; sp.style.animation='none'; void sp.offsetHeight; sp.style.animation='speechBubbleIn 0.4s ease-out'; }
}

// ===== VISUALIZACIÓN DE LECTURA CON PANTALLA COMPLETA Y RESALTADO =====
function mostrarLectura(question) {
    const lecturaContainer = document.getElementById('lectura-container');
    if (!lecturaContainer) return;
    
    if (question.textKey && typeof paesTexts !== 'undefined' && paesTexts[question.textKey]) {
        const texto = paesTexts[question.textKey];
        state.lecturaActiva = question.textKey;
        
        const resaltadosKey = `paes_resaltados_${question.textKey}`;
        const resaltadosGuardados = JSON.parse(safeLocalGet(resaltadosKey, '[]'));
        
        lecturaContainer.style.display = 'block';
        lecturaContainer.innerHTML = `
            <div class="lectura-panel" id="lectura-panel-${question.textKey}">
                <div class="lectura-header">
                    <strong>📖 ${texto.title}</strong>
                    <button class="btn-lectura-fullscreen" onclick="abrirLecturaFullscreen('${question.textKey}')" title="Ver en pantalla completa">⛶</button>
                    <span class="lectura-author">— ${texto.author}</span>
                </div>
                <div class="lectura-body lectura-selectable" id="lectura-body-${question.textKey}">
                    ${texto.body.replace(/\n/g, '<br>')}
                </div>
                <div class="lectura-toolbar">
                    <button onclick="resaltarSeleccion('${question.textKey}')" title="Resaltar selección">🖍️ Resaltar</button>
                    <button onclick="limpiarResaltados('${question.textKey}')" title="Limpiar resaltados">🗑️ Limpiar</button>
                    <button class="btn-lectura-fullscreen" onclick="abrirLecturaFullscreen('${question.textKey}')" title="Pantalla completa">⛶ Completa</button>
                </div>
            </div>
        `;
        
        setTimeout(() => aplicarResaltadosGuardados(question.textKey, resaltadosGuardados), 100);
        
    } else {
        lecturaContainer.style.display = 'none';
        state.lecturaActiva = null;
    }
}

// ===== FUNCIONES DE RESALTADO =====
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
    const spans = bodyEl.querySelectorAll('.lectura-resaltado');
    spans.forEach((span, index) => {
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
    const spans = bodyEl.querySelectorAll('.lectura-resaltado');
    spans.forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
    });
    bodyEl.normalize();
    safeLocalSet(`paes_resaltados_${textKey}`, '[]');
    if (window.effectsManager) window.effectsManager.triggerToastAcademico('Resaltados eliminados', { icon: '🗑️', duration: 1500 });
}

function limpiarTodosResaltados() {
    if (typeof paesTexts === 'undefined') return;
    const textKeys = Object.keys(paesTexts);
    let totalEliminados = 0;
    textKeys.forEach(key => {
        const guardados = safeLocalGet(`paes_resaltados_${key}`, null);
        if (guardados) {
            totalEliminados++;
            safeLocalSet(`paes_resaltados_${key}`, '[]');
        }
    });
    if (totalEliminados > 0) {
        console.log(`🧹 ${totalEliminados} lecturas con resaltados eliminados.`);
    }
}

function limpiarResaltadosAntiguos() {
    if (typeof paesTexts === 'undefined') return;
    const ahora = Date.now();
    const treintaDias = 30 * 24 * 60 * 60 * 1000;
    const textKeys = Object.keys(paesTexts);
    let totalLimpio = 0;
    textKeys.forEach(key => {
        const guardados = JSON.parse(safeLocalGet(`paes_resaltados_${key}`, '[]'));
        if (guardados.length > 0) {
            const filtrados = guardados.filter(r => (ahora - r.timestamp) < treintaDias);
            if (filtrados.length < guardados.length) {
                totalLimpio++;
                safeLocalSet(`paes_resaltados_${key}`, JSON.stringify(filtrados));
            }
        }
    });
    if (totalLimpio > 0) {
        console.log(`🧹 ${totalLimpio} lecturas con resaltados antiguos eliminados.`);
    }
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ===== EVIDENCIA EN LECTURA AL RESPONDER (USA evidenceText) =====
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
    } catch (e) {
        console.warn('No se pudo resaltar la evidencia:', e);
    }
}

// ===== PANTALLA COMPLETA DE LECTURA =====
function abrirLecturaFullscreen(textKey) {
    if (typeof paesTexts === 'undefined' || !paesTexts[textKey]) return;
    const texto = paesTexts[textKey];
    const overlay = document.createElement('div');
    overlay.className = 'lectura-fullscreen-overlay';
    overlay.id = 'lectura-fullscreen-overlay';
    const bodyEl = document.getElementById(`lectura-body-${textKey}`);
    let bodyHTML = texto.body.replace(/\n/g, '<br>');
    if (bodyEl) bodyHTML = bodyEl.innerHTML;
    overlay.innerHTML = `
        <div class="lectura-fullscreen-header">
            <div><div class="lectura-fullscreen-title">📖 ${texto.title}</div><div class="lectura-fullscreen-author">${texto.author}</div></div>
            <button class="btn-lectura-cerrar" onclick="cerrarLecturaFullscreen()">✕ Cerrar</button>
        </div>
        <div class="lectura-fullscreen-content lectura-selectable" id="lectura-fullscreen-body">${bodyHTML}</div>
        <div style="max-width:900px;width:100%;margin:10px auto 0;display:flex;gap:8px;">
            <button class="btn-lectura-cerrar" onclick="resaltarDesdeFullscreen('${textKey}')" style="background:#F59E0B;border-color:#F59E0B;">🖍️ Resaltar</button>
            <button class="btn-lectura-cerrar" onclick="limpiarResaltadosFullscreen('${textKey}')" style="background:#EF4444;border-color:#EF4444;">🗑️ Limpiar</button>
            <button class="btn-lectura-cerrar" onclick="cerrarLecturaFullscreen()">✕ Cerrar</button>
        </div>`;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    const content = document.getElementById('lectura-fullscreen-body');
    if (content) content.scrollTop = 0;
}

function cerrarLecturaFullscreen() {
    const overlay = document.getElementById('lectura-fullscreen-overlay');
    if (overlay) { sincronizarResaltadosFullscreen(); overlay.remove(); }
    document.body.style.overflow = '';
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
    span.className = 'lectura-resaltado'; span.dataset.textKey = textKey; span.dataset.timestamp = Date.now();
    try { range.surroundContents(span); }
    catch (e) {
        const fragment = range.extractContents();
        const newSpan = document.createElement('span');
        newSpan.className = 'lectura-resaltado'; newSpan.dataset.textKey = textKey; newSpan.dataset.timestamp = Date.now();
        newSpan.appendChild(fragment); range.insertNode(newSpan);
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
    if (fullscreenBody && panelBody) { panelBody.innerHTML = fullscreenBody.innerHTML; guardarResaltados(textKey); }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('lectura-fullscreen-overlay');
        if (overlay) cerrarLecturaFullscreen();
    }
});

// ===== CARGA DE PREGUNTAS =====
function loadQuestion() {
    if (state.currentQuestion >= state.totalQuestions) { endLevel(); return; }
    clearInterval(state.timerInterval); state.timerInterval = null;
    if (state._boredTimeout) clearTimeout(state._boredTimeout);
    if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
    state._freezeTimeout = null; state.isFrozen = false;
    state.questionStartTime = Date.now();
    const q = state.questions[state.currentQuestion];
    ['options-grid','matching-container','drag-container','slider-container'].forEach(id => {
        const el = document.getElementById(id); if (el) { el.innerHTML = ''; el.style.display = 'none'; }
    });
    const fb = document.getElementById('feedback-box'); if (fb) { fb.className = 'feedback-box'; fb.innerHTML = ''; }
    const bn = document.getElementById('btn-next'); if (bn) bn.style.display = 'none';
    const qi = document.getElementById('question-image'); if (qi) qi.style.display = 'none';
    if (state.currentLevel === 1) mostrarLectura(q);
    else { const lc = document.getElementById('lectura-container'); if (lc) lc.style.display = 'none'; }
    const qt = document.getElementById('question-text'); if (qt) qt.textContent = q.question;
    if (state.currentLevel >= 2) updateBuhoReaction('deep-think'); else updateBuhoReaction('thinking');
    switch (q.type) {
        case 'multiple': loadMultipleChoice(q); break;
        case 'matching': loadMatching(q); break;
        case 'slider': loadSlider(q); break;
        case 'drag': loadDrag(q); break;
    }
    if (state.mode === 'timed') startTimer();
    updateProgress();
}

function loadMultipleChoice(q) {
    const grid = document.getElementById('options-grid'); if (!grid) return;
    grid.style.display = 'flex';
    const indices = q.options.map((_,i) => i);
    const shuffled = shuffleArray(indices);
    q._shuffledIndices = shuffled;
    const letters = ['A','B','C','D','E'];
    shuffled.forEach((orig, disp) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn'; if (q.isBonus) btn.classList.add('bonus-question');
        btn.textContent = q.options[orig]; btn.dataset.originalIndex = orig;
        btn.setAttribute('aria-label', `Opción ${letters[disp]}: ${q.options[orig]}`);
        btn.setAttribute('role','radio');
        btn.addEventListener('click', () => checkMultipleAnswer(orig, q));
        grid.appendChild(btn);
    });
}

function loadMatching(q) {
    const mc = document.getElementById('matching-container'); if (!mc) return;
    mc.style.display = 'grid'; let sel = null; const matches = {};
    const left = shuffleArray(q.pairs.map(p => ({id:p.id, text:p.left})));
    const right = shuffleArray(q.pairs.map(p => ({id:p.id, text:p.right})));
    left.forEach(item => {
        const d = document.createElement('div'); d.className = 'matching-item'; d.textContent = item.text;
        d.dataset.pairId = item.id; d.dataset.side = 'left';
        d.addEventListener('click', function(){
            if (this.classList.contains('matched')) return;
            if (window.effectsManager) window.effectsManager.ensureAudio();
            mc.querySelectorAll('.matching-item[data-side="left"]').forEach(el => { if (!el.classList.contains('matched')) el.classList.remove('selected'); });
            this.classList.add('selected'); sel = this;
        });
        mc.appendChild(d);
    });
    right.forEach(item => {
        const d = document.createElement('div'); d.className = 'matching-item'; d.textContent = item.text;
        d.dataset.pairId = item.id; d.dataset.side = 'right';
        d.addEventListener('click', function(){
            if (this.classList.contains('matched')) return;
            if (window.effectsManager) window.effectsManager.ensureAudio();
            if (sel && !this.classList.contains('matched')) {
                if (sel.dataset.pairId === this.dataset.pairId) {
                    sel.classList.add('matched'); this.classList.add('matched');
                    matches[this.dataset.pairId] = true; sel = null;
                    if (Object.keys(matches).length === q.pairs.length) {
                        clearInterval(state.timerInterval); state.timerInterval = null;
                        showFeedback(`¡Perfecto! ${q.explanation||''}`, 'correct');
                        triggerVisualStarsFromElement(mc, 16);
                        handleCorrectAnswer(q.points);
                    }
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
    const vd = document.createElement('div'); vd.className = 'slider-value'; vd.textContent = q.min; vd.id = 'slider-value-display';
    const tr = document.createElement('div'); tr.className = 'slider-track';
    const fl = document.createElement('div'); fl.className = 'slider-fill'; fl.style.width = '0%';
    const inp = document.createElement('input'); inp.type = 'range'; inp.className = 'slider-input';
    inp.min = q.min; inp.max = q.max; inp.step = '0.1'; inp.value = q.min;
    inp.addEventListener('input', () => { fl.style.width = `${((inp.value-q.min)/(q.max-q.min))*100}%`; vd.textContent = inp.value; });
    tr.appendChild(fl); tr.appendChild(inp);
    const sb = document.createElement('button'); sb.className = 'main-btn'; sb.textContent = 'Confirmar ✅';
    sb.addEventListener('click', () => {
        if (window.effectsManager) window.effectsManager.ensureAudio();
        clearInterval(state.timerInterval); state.timerInterval = null;
        const ua = parseFloat(inp.value);
        if (Math.abs(ua - q.correctAnswer) <= q.tolerance) { showFeedback(`¡Correcto! ${q.explanation}`, 'correct'); triggerVisualStarsFromElement(sb,14); handleCorrectAnswer(q.points); }
        else { showFeedback(`Incorrecto. ${q.explanation}`, 'incorrect'); handleIncorrectAnswer(q); }
    });
    sc.appendChild(vd); sc.appendChild(tr); sc.appendChild(sb);
}

function loadDrag(q) {
    const dc = document.getElementById('drag-container'); if (!dc) return;
    dc.style.display = 'flex';
    q.items.forEach((item, idx) => {
        const dz = document.createElement('div'); dz.className = 'drop-zone';
        dz.textContent = `${idx+1}. Soltar aquí`; dz.dataset.index = idx;
        dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
        dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
        dz.addEventListener('drop', e => {
            if (window.effectsManager) window.effectsManager.ensureAudio();
            e.preventDefault(); dz.classList.remove('drag-over');
            dz.textContent = `${idx+1}. ${q.items[e.dataTransfer.getData('text/plain')]}`;
            dz.dataset.filled = e.dataTransfer.getData('text/plain');
            checkDragComplete(q);
        });
        dc.appendChild(dz);
    });
    const ic = document.createElement('div'); ic.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-top:10px';
    shuffleArray(q.items).forEach(item => {
        const dg = document.createElement('div'); dg.className = 'draggable-item'; dg.textContent = item;
        dg.draggable = true; dg.dataset.originalIndex = q.items.indexOf(item);
        dg.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', dg.dataset.originalIndex); dg.style.opacity = '0.5'; });
        dg.addEventListener('dragend', () => { dg.style.opacity = '1'; });
        ic.appendChild(dg);
    });
    dc.appendChild(ic);
}

function checkDragComplete(q) {
    const dzs = document.querySelectorAll('.drop-zone');
    let af = true, ac = true;
    dzs.forEach((z,i) => { if (!z.dataset.filled) af = false; else if (parseInt(z.dataset.filled,10) !== i) ac = false; });
    if (af) {
        clearInterval(state.timerInterval); state.timerInterval = null;
        if (ac) { showFeedback(`¡Excelente! ${q.explanation||''}`, 'correct'); triggerVisualStarsFromElement(document.getElementById('drag-container'),16); handleCorrectAnswer(q.points); }
        else { showFeedback(`Orden incorrecto. ${q.explanation||'Revisa la secuencia.'}`, 'incorrect'); handleIncorrectAnswer(q); }
    }
}

// ===== RESPUESTAS =====
function checkMultipleAnswer(oi, q) {
    if (window.effectsManager) window.effectsManager.ensureAudio();
    const opts = document.querySelectorAll('.option-btn');
    opts.forEach(b => b.disabled = true);
    const si = q._shuffledIndices;
    const cdi = si.indexOf(q.correct);
    let cdi2 = -1;
    opts.forEach((b,i) => { if (parseInt(b.dataset.originalIndex) === oi) cdi2 = i; });
    const rt = (Date.now() - state.questionStartTime) / 1000;
    clearInterval(state.timerInterval); state.timerInterval = null;
    state.totalPreguntasRespondidas++;
    if (oi === q.correct) {
        if (opts[cdi2]) opts[cdi2].classList.add('correct');
        let tp = q.points; let sc = 15;
        if (rt < 3) { const sb = Math.round(q.points * 0.5); tp += sb; sc += 10; showSpeedBonus(sb); }
        if (opts[cdi2]) triggerVisualStarsFromElement(opts[cdi2], sc);
        showFeedback(`¡Correcto! ${q.explanation}${q.isBonus?' 🎁 BONUS!':''}`, q.isBonus?'bonus':'correct');
        if (state.currentLevel === 1 && q.textKey && q.evidenceText) {
            resaltarEvidenciaEnLectura(q.textKey, q.evidenceText, 'correct');
        }
        handleCorrectAnswer(tp);
    } else {
        if (opts[cdi2]) opts[cdi2].classList.add('incorrect');
        if (opts[cdi]) opts[cdi].classList.add('correct');
        showFeedback(`Incorrecto. ${q.explanation}`, 'incorrect');
        if (state.currentLevel === 1 && q.textKey && q.evidenceText) {
            resaltarEvidenciaEnLectura(q.textKey, q.evidenceText, 'incorrect');
        }
        handleIncorrectAnswer(q);
    }
}

function handleCorrectAnswer(pts) {
    if (state._boredTimeout) clearTimeout(state._boredTimeout);
    state.score += pts; state.levelScore += pts; state.streak++; state.correctInLevel++;
    if (state.streak > state.maxStreak) state.maxStreak = state.streak;
    const q = state.questions[state.currentQuestion];
    if (q?.topic) {
        if (!state.topicScores[q.topic]) state.topicScores[q.topic] = {correct:0, total:0};
        state.topicScores[q.topic].correct++; state.topicScores[q.topic].total++;
    }
    updateScore(); updateStreak(); playSound('correct');
    if (window.effectsManager) window.effectsManager.triggerConfettiAcademico();
    if ((Date.now()-state.questionStartTime)/1000 < 3 && window.effectsManager) window.effectsManager.triggerScreenFlash(180);
    updateBuhoReaction('correct');
    if (state.streak >= 5) { document.getElementById('streak-display')?.classList.add('on-fire'); if (window.effectsManager) window.effectsManager.triggerStarRain(); setTimeout(() => updateBuhoReaction('impressed'),400); }
    else if (state.streak >= 3) { if (window.effectsManager) window.effectsManager.triggerStarRain(); setTimeout(() => updateBuhoReaction('impressed'),400); }
    const bn = document.getElementById('btn-next'); if (bn) bn.style.display = 'block';
    checkBadges();
}

function handleIncorrectAnswer(q) {
    if (state._boredTimeout) clearTimeout(state._boredTimeout);
    state.totalPreguntasRespondidas++; state.streak = 0; state.levelPerfect = false;
    document.getElementById('streak-display')?.classList.remove('on-fire');
    if (q?.topic) {
        if (!state.topicScores[q.topic]) state.topicScores[q.topic] = {correct:0, total:0};
        state.topicScores[q.topic].total++;
    }
    updateStreak(); playSound('incorrect'); updateBuhoReaction('incorrect');
    setTimeout(() => updateBuhoReaction('determined'), 400);
    const bn = document.getElementById('btn-next'); if (bn) bn.style.display = 'block';
}

function showFeedback(msg, type) {
    const fb = document.getElementById('feedback-box'); if (!fb) return;
    fb.textContent = msg; fb.className = `feedback-box ${type}`;
}

function nextQuestion() {
    if (window.effectsManager) window.effectsManager.playSound('next');
    clearInterval(state.timerInterval); state.timerInterval = null; state.isFrozen = false;
    if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
    state._freezeTimeout = null; state.currentQuestion++;
    document.getElementById('streak-display')?.classList.remove('on-fire');
    loadQuestion();
}

// ===== FIN DE NIVEL =====
function endLevel() {
    clearInterval(state.timerInterval); state.timerInterval = null;
    if (state._boredTimeout) clearTimeout(state._boredTimeout);
    if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
    state._freezeTimeout = null; state.isFrozen = false;
    const tq = state.totalQuestions || 25;
    const sc = state.levelPerfect ? 3 : (state.correctInLevel >= tq*0.7 ? 2 : 1);
    state.levelStars[state.currentLevel] = sc;
    if (state.levelPerfect && !state.badges.perfectScore) {
        state.badges.perfectScore = true; playSound('achievement');
        if (window.effectsManager) window.effectsManager.triggerFuegosAcademicos();
        setTimeout(() => { if (window.effectsManager) window.effectsManager.triggerToastAcademico('¡Insignia: Puntaje Perfecto!', {icon:'💯',bg:'linear-gradient(135deg,#FFD700,#FFA500)',duration:3500}); }, 300);
        saveBadges();
    }
    if (!state.powerupsUsedThisLevel && !state.badges.noPowerups) {
        state.badges.noPowerups = true; playSound('achievement');
        if (window.effectsManager) window.effectsManager.triggerFuegosAcademicos();
        setTimeout(() => { if (window.effectsManager) window.effectsManager.triggerToastAcademico('¡Insignia: Poder Natural!', {icon:'💪',bg:'linear-gradient(135deg,#8B5CF6,#6D28D9)',duration:3500}); }, 300);
        saveBadges();
    }
    if (state.currentLevel < 4) {
        document.getElementById('transition-title').textContent = `${levelNames[state.currentLevel]} Completado`;
        document.getElementById('transition-speech').textContent = `¡Sabiondo está orgulloso! 🦉`;
        document.getElementById('level-score-display').textContent = state.levelScore;
        let sh = '<div class="star-rating">';
        for (let i=1;i<=3;i++) sh += `<span class="star ${i<=sc?'earned':''}">⭐</span>`;
        sh += '</div>';
        const sCard = document.querySelector('#screen-level-transition .share-card');
        const ls = document.getElementById('level-stars');
        if (ls) ls.innerHTML = sh;
        else if (sCard) { const d = document.createElement('div'); d.id = 'level-stars'; d.innerHTML = sh; sCard.appendChild(d); }
        document.getElementById('btn-next-level').textContent = `Siguiente: ${levelNames[state.currentLevel+1]} ➡️`;
        updateBuhoReaction(state.levelPerfect?'celebrating':'thinking');
        showScreen('screen-level-transition'); playSound('levelup');
        if (window.effectsManager) { window.effectsManager.triggerFuegosAcademicos(); window.effectsManager.triggerConfettiAcademico(2000,2); setTimeout(() => window.effectsManager.triggerConfettiAcademico(1500,1.5),800); }
    } else {
        updateBuhoReaction('graduate'); showFinalResults(); playSound('levelup');
        if (window.effectsManager) window.effectsManager.triggerFuegosAcademicos();
    }
}

function showFinalResults() {
    state.desafioEndTime = Date.now();
    state.tiempoTotalDesafio = (state.desafioEndTime - state.desafioStartTime) / 1000;
    document.getElementById('final-score').textContent = state.score;
    const td = document.getElementById('tiempo-desempeno');
    if (td && state.totalPreguntasRespondidas > 0) {
        const prom = state.tiempoTotalDesafio / state.totalPreguntasRespondidas;
        const min = Math.floor(state.tiempoTotalDesafio / 60);
        const seg = Math.floor(state.tiempoTotalDesafio % 60);
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
            const bar = document.createElement('div'); bar.className = 'topic-bar';
            bar.innerHTML = `<span class="topic-label">${tn[topic]||topic}</span><div class="topic-progress"><div class="topic-fill" style="width:${pct}%;background:${tc[ci]}"></div></div><span class="topic-score">${pct}%</span>`;
            ta.appendChild(bar); ci = (ci+1) % tc.length;
        }
    }
    const sb = document.getElementById('share-badges');
    if (sb) { sb.innerHTML = ''; for (const [b,u] of Object.entries(state.badges)) { if (u) { const be = document.createElement('span'); be.className = 'share-badge'; be.textContent = getBadgeIcon(b); sb.appendChild(be); } } }
    const sp = document.getElementById('result-character-speech');
    if (sp) {
        if (state.score >= 7000) sp.textContent = '¡Rendimiento excepcional! ¡La universidad te espera! 🎓✨';
        else if (state.score >= 5000) sp.textContent = '¡Excelente! Vas por muy buen camino. 👏🎓';
        else if (state.score >= 3000) sp.textContent = '¡Buen esfuerzo! Sigue practicando. 📚💪';
        else sp.textContent = '¡El aprendizaje es un camino diario! 💡📖';
    }
    if (state.currentLote) marcarLoteComoUsado(state.currentLote);
    showScreen('screen-results');
    if (window.effectsManager) window.effectsManager.triggerFuegosAcademicos();
    saveToLeaderboard();
}

function restartGame() {
    borrarProgreso();
    clearInterval(state.timerInterval); state.timerInterval = null;
    if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
    state._freezeTimeout = null; state.isFrozen = false;
    state.currentQuestion = 0; state.score = 0; state.levelScore = 0; state.streak = 0;
    state.currentLevel = 1; state.powerupsUsedThisLevel = false; state.levelPerfect = true;
    state.levelStars = {}; state.bonusQuestionActive = false; state.correctInLevel = 0;
    state.currentLote = null; state.loteData = null; state.ultimoEstadoBocadillo = null;
    state.desafioStartTime = null; state.desafioEndTime = null; state.tiempoTotalDesafio = 0;
    state.totalPreguntasRespondidas = 0; state.lecturaActiva = null;
    document.body.className = 'level-1';
    document.getElementById('streak-display')?.classList.remove('on-fire');
    updateScore(); updateStreak(); updateProgress(); updateLevelDisplay();
    cargarYMostrarLotes();
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('lote-confirmacion').style.display = 'none';
    document.getElementById('lote-selector').style.display = 'block';
    showScreen('screen-welcome');
}

function goToFinalScreen() { updateBuhoReaction('graduate'); showScreen('screen-final'); if (window.effectsManager) window.effectsManager.triggerFuegosAcademicos(); }

// ===== POWER-UPS =====
function usePowerup(type) {
    if (state.powerups[type] <= 0 || state.currentQuestion >= state.totalQuestions) return;
    if ((type === 'time' || type === 'freeze') && state.mode !== 'timed') return;
    state.powerups[type]--; state.powerupsUsedThisLevel = true;
    updatePowerupButtons(); playSound('powerup');
    const btn = document.getElementById(`powerup-${type}`); if (btn) { btn.classList.add('flash'); setTimeout(() => btn.classList.remove('flash'), 300); }
    switch (type) {
        case 'fifty': applyFiftyFifty(); updateBuhoReaction('confident'); break;
        case 'time': if (state.mode === 'timed') { state.timer += 15; updateTimerDisplay(); } break;
        case 'freeze':
            if (state._freezeTimeout) clearTimeout(state._freezeTimeout);
            state.isFrozen = true; updateBuhoReaction('frozen');
            const td = document.getElementById('timer-display'); if (td) td.style.backgroundColor = '#10B981';
            state._freezeTimeout = setTimeout(() => { state.isFrozen = false; state._freezeTimeout = null; updateBuhoReaction('thinking'); if (td) td.style.backgroundColor = 'var(--azul-oscuro)'; }, 10000);
            break;
        case 'hint': applyHint(); break;
    }
}

function applyFiftyFifty() {
    const q = state.questions[state.currentQuestion]; if (!q || q.type !== 'multiple') return;
    const opts = document.querySelectorAll('.option-btn');
    const si = q._shuffledIndices; const cdi = si.indexOf(q.correct);
    const ii = []; opts.forEach((b,i) => { if (i !== cdi) ii.push(i); });
    shuffleArray(ii).slice(0,2).forEach(i => { if (opts[i]) { opts[i].style.opacity = '0.3'; opts[i].style.pointerEvents = 'none'; } });
}

function applyHint() {
    const q = state.questions[state.currentQuestion]; if (!q) return;
    const fb = document.getElementById('feedback-box'); if (!fb) return;
    fb.textContent = `💡 Pista: ${q.hint || (q.explanation?.split('.')[0]+'.') || 'Analiza con calma.'}`;
    fb.className = 'feedback-box correct';
}

// ===== TEMPORIZADOR =====
function startTimer() {
    clearInterval(state.timerInterval); state.timerInterval = null;
    state.timer = levelTimerDefaults[state.currentLevel] || 60;
    updateTimerDisplay();
    const td = document.getElementById('timer-display'); if (td) td.classList.remove('warning');
    state.timerInterval = setInterval(() => {
        if (state.isFrozen) return;
        state.timer--; updateTimerDisplay();
        if (state.timer <= 10 && state.timer > 0) { if (td) td.classList.add('warning'); updateBuhoReaction('nervous'); if (window.effectsManager) window.effectsManager.playTick(); }
        if (state.timer <= 0) { clearInterval(state.timerInterval); state.timerInterval = null; if (td) td.classList.remove('warning'); if (window.effectsManager) window.effectsManager.playIncorrectFallback(); showFeedback(`¡Tiempo agotado! ${state.questions[state.currentQuestion].explanation}`, 'incorrect'); handleIncorrectAnswer(state.questions[state.currentQuestion]); }
    }, 1000);
    state._boredTimeout = setTimeout(() => { const bn = document.getElementById('btn-next'); if (state.currentQuestion < state.totalQuestions && (!bn || bn.style.display === 'none')) updateBuhoReaction('bored'); }, 20000);
}

function updateTimerDisplay() { const td = document.getElementById('timer-display'); if (td) td.textContent = `⏱️ ${state.timer}s`; }

// ===== UI =====
function updateScore() { const b = document.getElementById('score-badge'); if (!b) return; b.textContent = `⭐ ${state.score} pts`; b.classList.add('pop'); setTimeout(() => b.classList.remove('pop'), 300); if (window.effectsManager?.triggerScoreBadgeFlash) window.effectsManager.triggerScoreBadgeFlash(); }
function updateStreak() { const s = document.getElementById('streak-display'); if (s) s.textContent = `🔥 ${state.streak}`; }
function updateProgress() { const p = document.getElementById('progress-fill'); if (p) p.style.width = `${(state.currentQuestion/state.totalQuestions)*100}%`; }
function updatePowerupButtons() {
    ['fifty','time','freeze','hint'].forEach(t => {
        const b = document.getElementById(`powerup-${t}`); if (!b) return;
        const s = b.querySelector('small'); if (s) s.textContent = `(${state.powerups[t]})`;
        b.disabled = state.powerups[t] <= 0 || ((t === 'time' || t === 'freeze') && state.mode !== 'timed');
    });
}

// ===== INSIGNIAS =====
function checkBadges() {
    if (state.score >= 3000 && !state.badges.paesPro) { state.badges.paesPro = true; playSound('achievement'); if (window.effectsManager) window.effectsManager.triggerFuegosAcademicos(); setTimeout(() => { if (window.effectsManager) window.effectsManager.triggerToastAcademico('¡PAES Pro!', {icon:'🏆',bg:'linear-gradient(135deg,#F59E0B,#D97706)',duration:3500}); },300); saveBadges(); }
    if (state.streak >= 5 && !state.badges.streaker) { state.badges.streaker = true; playSound('achievement'); if (window.effectsManager) window.effectsManager.triggerFuegosAcademicos(); setTimeout(() => { if (window.effectsManager) window.effectsManager.triggerToastAcademico('¡Rachador!', {icon:'🔥',bg:'linear-gradient(135deg,#EF4444,#DC2626)',duration:3500}); },300); saveBadges(); }
    if (state.mode === 'timed' && (Date.now()-state.questionStartTime) < 3000 && !state.badges.speedDemon) { state.badges.speedDemon = true; playSound('achievement'); if (window.effectsManager) window.effectsManager.triggerFuegosAcademicos(); setTimeout(() => { if (window.effectsManager) window.effectsManager.triggerToastAcademico('¡Velocista!', {icon:'⚡',bg:'linear-gradient(135deg,#3B82F6,#1D4ED8)',duration:3500}); },300); saveBadges(); }
}
function getBadgeIcon(b) { const i = { perfectScore:'💯', speedDemon:'⚡', streaker:'🔥', paesPro:'🏆', noPowerups:'💪' }; return i[b]||'🏅'; }
function getBadgeName(b) { const n = { perfectScore:'Puntaje Perfecto', speedDemon:'Velocista', streaker:'Rachador', paesPro:'PAES Pro', noPowerups:'Poder Natural' }; return n[b]||b; }
function loadBadges() {
    const saved = safeLocalGet('paes_badges_v4', null);
    if (saved) { try { state.badges = { ...state.badges, ...JSON.parse(saved) }; } catch(e) {} }
    const g = document.getElementById('badges-grid'); if (!g) return;
    g.innerHTML = '';
    for (const [b,u] of Object.entries(state.badges)) {
        const e = document.createElement('div'); e.className = `badge-item ${u?'unlocked':''}`;
        e.innerHTML = `<div class="badge-icon">${getBadgeIcon(b)}</div><div class="badge-name">${getBadgeName(b)}</div>`;
        g.appendChild(e);
    }
}
function saveBadges() { safeLocalSet('paes_badges_v4', JSON.stringify(state.badges)); }

// ===== LEADERBOARD =====
function showNamePromptModal(cb) {
    const nombreGuardado = safeLocalGet('paes_jugador_nombre', '');
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.55);z-index:3000;display:flex;align-items:center;justify-content:center;font-family:Poppins,sans-serif;padding:20px';
    const bx = document.createElement('div');
    bx.style.cssText = 'background:white;padding:26px 24px;border-radius:18px;max-width:340px;width:100%;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.32)';
    bx.innerHTML = `<div style="font-weight:800;font-size:1.15rem;margin-bottom:8px;color:#1E293B">¡Buen trabajo! 🦉</div><div style="margin-bottom:16px;color:#64748B;font-size:0.9rem">Ingresa tu nombre</div><input id="paes-name-input" type="text" maxlength="20" placeholder="Jugador" value="${nombreGuardado.replace(/"/g,'&quot;')}" style="width:100%;padding:11px 14px;border-radius:10px;border:1.5px solid #CBD5E1;margin-bottom:16px;font-family:inherit;font-size:1rem"><div style="display:flex;gap:10px;justify-content:center"><button id="paes-name-skip" style="flex:1;padding:11px 0;border-radius:10px;border:none;background:#E2E8F0;color:#334155;font-weight:700;cursor:pointer">Omitir</button><button id="paes-name-ok" style="flex:1;padding:11px 0;border-radius:10px;border:none;background:linear-gradient(135deg,#2563EB,#1D4ED8);color:white;font-weight:700;cursor:pointer">Guardar</button></div>`;
    ov.appendChild(bx); document.body.appendChild(ov);
    const inp = bx.querySelector('#paes-name-input'); inp.focus();
    if (nombreGuardado) inp.select();
    const close = (v) => { ov.remove(); cb(v); };
    bx.querySelector('#paes-name-ok').addEventListener('click', () => close(inp.value.trim()||'Jugador'));
    bx.querySelector('#paes-name-skip').addEventListener('click', () => close(null));
    inp.addEventListener('keydown', (e) => { if (e.key==='Enter') close(inp.value.trim()||'Jugador'); });
    document.addEventListener('keydown', function esc(e) { if (e.key==='Escape') { close(null); document.removeEventListener('keydown',esc); } });
}

function saveToLeaderboard() {
    showNamePromptModal((name) => {
        const nombreFinal = name || 'Anónimo';
        safeLocalSet('paes_jugador_nombre', nombreFinal);
        if (name) {
            const lb = JSON.parse(safeLocalGet('paes_leaderboard_v4','[]'));
            lb.push({ name, score:state.score, badges:Object.values(state.badges).filter(Boolean).length, tiempo:state.tiempoTotalDesafio, promedio:state.totalPreguntasRespondidas>0?(state.tiempoTotalDesafio/state.totalPreguntasRespondidas).toFixed(1):0, date:new Date().toLocaleDateString() });
            lb.sort((a,b) => b.score - a.score);
            safeLocalSet('paes_leaderboard_v4', JSON.stringify(lb.slice(0,20)));
            loadLeaderboard();
        }
        enviarResultadosGoogleSheets(nombreFinal);
    });
}

function loadLeaderboard() {
    let lb = [];
    try { lb = JSON.parse(safeLocalGet('paes_leaderboard_v4','[]')); } catch(e) {}
    const tbody = document.getElementById('leaderboard-body'); if (!tbody) return;
    tbody.innerHTML = '';
    lb.forEach((e,i) => {
        const r = document.createElement('tr');
        r.innerHTML = `<td class="${i<3?'rank-'+(i+1):''}">${i+1}</td><td>${e.name}</td><td>${e.score} pts</td><td>${'🏅'.repeat(e.badges)}</td>`;
        tbody.appendChild(r);
    });
}

function shareResults() {
    const prom = state.totalPreguntasRespondidas>0?(state.tiempoTotalDesafio/state.totalPreguntasRespondidas).toFixed(1):'---';
    const text = `🎓 ¡${state.score} puntos en PAES Challenge! ⏱️ ${prom}s/pregunta. ¿Puedes superarme? 🦉`;
    if (navigator.share) navigator.share({title:'PAES Challenge',text,url:window.location.href}).catch(()=>{});
    else navigator.clipboard.writeText(text).then(()=>{ if(window.effectsManager) window.effectsManager.triggerToastAcademico('¡Copiado!',{icon:'📋',duration:2500}); }).catch(()=>{ if(window.effectsManager) window.effectsManager.triggerToastAcademico('No se pudo copiar',{icon:'⚠️',duration:2500}); });
}

// ===== ENVÍO DE RESULTADOS A GOOGLE SHEETS =====
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxvTEZlpd12ZLp0Z6krQw4iFsx6mcbBsTVucJxO4W-e-HR_VSKwUTusAi4U6VTgQx7X/exec';
const SHEETS_PENDING_KEY = 'paes_sheets_pending_v1';

function construirPayloadResultados(nombreJugador) {
    const minutos = Math.floor(state.tiempoTotalDesafio / 60);
    const segundos = Math.floor(state.tiempoTotalDesafio % 60);
    const promedio = state.totalPreguntasRespondidas > 0
        ? (state.tiempoTotalDesafio / state.totalPreguntasRespondidas).toFixed(1)
        : 0;
    return {
        jugador: nombreJugador || 'Anónimo',
        partida: state.currentLote || 1,
        puntaje: state.score,
        promedio: parseFloat(promedio),
        correctas: Object.values(state.topicScores).reduce((sum, t) => sum + (t.correct || 0), 0),
        total: state.totalPreguntasRespondidas,
        insignias: Object.values(state.badges).filter(Boolean).length,
        tiempoTotal: `${minutos}m ${segundos}s`,
        fecha: new Date().toISOString()
    };
}

function enviarResultadosGoogleSheets(nombreJugador) {
    const payload = construirPayloadResultados(nombreJugador);
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        encolarEnvioPendiente(payload);
        return;
    }
    intentarEnviarGoogleSheets(payload).catch(() => {
        encolarEnvioPendiente(payload);
    });
}

function intentarEnviarGoogleSheets(payload) {
    return fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
    }).then(() => {
        console.log('📊 Resultados enviados a Google Sheets:', payload.jugador);
    });
}

function encolarEnvioPendiente(payload) {
    let pendientes = [];
    try { pendientes = JSON.parse(safeLocalGet(SHEETS_PENDING_KEY, '[]')); } catch (e) { pendientes = []; }
    pendientes.push(payload);
    safeLocalSet(SHEETS_PENDING_KEY, JSON.stringify(pendientes.slice(-20)));
    console.warn('⚠️ Sin conexión: resultado guardado para reintentar más tarde.');
}

function flushPendingGoogleSheets() {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
    let pendientes = [];
    try { pendientes = JSON.parse(safeLocalGet(SHEETS_PENDING_KEY, '[]')); } catch (e) { pendientes = []; }
    if (!pendientes.length) return;
    const restantes = [];
    let cadena = Promise.resolve();
    pendientes.forEach((payload) => {
        cadena = cadena.then(() =>
            intentarEnviarGoogleSheets(payload).catch(() => { restantes.push(payload); })
        );
    });
    cadena.then(() => {
        safeLocalSet(SHEETS_PENDING_KEY, JSON.stringify(restantes));
        if (restantes.length === 0 && pendientes.length > 0) {
            console.log(`📊 ${pendientes.length} resultado(s) pendiente(s) enviados a Google Sheets.`);
        }
    });
}

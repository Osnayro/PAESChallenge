
/**
 * ============================================================
 * PAES Challenge Engine v4.5.0 — Firebase Edition
 * Lógica del juego + 4 Lotes + Sabiondo 🦉 + 4 Niveles
 * + Autenticación Firebase + Firestore Leaderboard
 * + Protección de respuestas en cliente (módulo ES6)
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
    limpiarResaltadosAntiguos();
    setupPantallaRegistro();
    setupInstalacionPWA();
});

// ===== INSTALACIÓN PWA =====
const INSTALL_DISMISSED_KEY_PREFIX = 'paes_install_dismissed_';
let _deferredInstallPrompt = null;
let _splashYaCerrado = false;

function estaEnModoStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
           window.navigator.standalone === true;
}

function esIOS() {
    const ua = window.navigator.userAgent || '';
    return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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

function cerrarBannerInstalacion(tipo) {
    const banner = document.getElementById(`install-banner-${tipo}`);
    if (banner) banner.style.display = 'none';
    safeLocalSet(INSTALL_DISMISSED_KEY_PREFIX + tipo, 'true');
}

function instalarPWAAndroid() {
    if (!_deferredInstallPrompt) { cerrarBannerInstalacion('android'); return; }
    _deferredInstallPrompt.prompt();
    _deferredInstallPrompt.userChoice.then((choice) => {
        _deferredInstallPrompt = null;
        cerrarBannerInstalacion('android');
    });
}

function setupInstalacionPWA() {
    if (estaEnModoStandalone()) return;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        _deferredInstallPrompt = e;
        if (_splashYaCerrado) mostrarBannerInstalacionAndroid();
    });
    window.addEventListener('appinstalled', () => {
        _deferredInstallPrompt = null;
        cerrarBannerInstalacion('android');
    });
    document.getElementById('skip-splash-btn')?.addEventListener('click', () => {
        _splashYaCerrado = true;
        setTimeout(() => {
            if (estaEnModoStandalone()) return;
            if (_deferredInstallPrompt) mostrarBannerInstalacionAndroid();
            else if (esIOS()) mostrarBannerInstalacionIOS();
        }, 1500);
    }, { once: true });
}

// ===== AUTENTICACIÓN FIREBASE =====
function switchAuthTab(tab) {
    const loginTab = document.getElementById('auth-tab-login');
    const regTab = document.getElementById('auth-tab-register');
    const loginForm = document.getElementById('auth-form-login');
    const regForm = document.getElementById('auth-form-register');
    const errorBox = document.getElementById('lock-error');
    if (errorBox) errorBox.style.display = 'none';
    if (tab === 'login') {
        loginTab?.classList.add('active');
        regTab?.classList.remove('active');
        if (loginForm) loginForm.style.display = 'flex';
        if (regForm) regForm.style.display = 'none';
    } else {
        regTab?.classList.add('active');
        loginTab?.classList.remove('active');
        if (regForm) regForm.style.display = 'flex';
        if (loginForm) loginForm.style.display = 'none';
    }
}

async function ejecutarLoginFirebase() {
    const email = document.getElementById('login-email-input')?.value.trim();
    const password = document.getElementById('login-password-input')?.value;
    if (!email || !password) { mostrarError('Por favor ingresa tu correo y contraseña.'); return; }
    try {
        mostrarError('Iniciando sesión... 🔑');
        if (window.paesFirebase) {
            await window.paesFirebase.login(email, password);
            ocultarPantallaRegistro();
        } else throw new Error('Firebase no disponible');
    } catch (err) {
        mostrarError(`Error: ${traductorErroresFirebase(err.code || err.message)}`);
    }
}

async function ejecutarRegistroFirebase() {
    const name = document.getElementById('reg-name-input')?.value.trim();
    const colegio = document.getElementById('reg-colegio-input')?.value.trim();
    const meta = document.getElementById('reg-meta-input')?.value;
    const email = document.getElementById('reg-email-input')?.value.trim();
    const password = document.getElementById('reg-password-input')?.value;
    if (!name || !email || !password) { mostrarError('Completa Nombre, Email y Contraseña.'); return; }
    if (password.length < 6) { mostrarError('La contraseña debe tener al menos 6 caracteres.'); return; }
    try {
        mostrarError('Creando cuenta... 🚀');
        if (window.paesFirebase) {
            await window.paesFirebase.register(email, password, name, colegio, meta);
            ocultarPantallaRegistro();
        } else throw new Error('Firebase no disponible');
    } catch (err) {
        mostrarError(`Error: ${traductorErroresFirebase(err.code || err.message)}`);
    }
}

async function ejecutarGoogleSignIn() {
    try {
        mostrarError('Conectando con Google... 🚀');
        if (window.paesFirebase) {
            await window.paesFirebase.googleSignIn();
            ocultarPantallaRegistro();
        } else throw new Error('Firebase no disponible');
    } catch (err) { mostrarError(`Error: ${err.message}`); }
}

function ejecutarIngresoInvitado() {
    safeLocalSet('paes_jugador_nombre', 'Invitado');
    ocultarPantallaRegistro();
    actualizarBarraUsuarioHeader({ displayName: 'Invitado 🦉', colegio: 'Modo Offline' });
}

async function ejecutarCerrarSesion() {
    if (window.paesFirebase) await window.paesFirebase.logout();
    safeLocalSet('paes_jugador_nombre', '');
    mostrarPantallaRegistro();
    actualizarBarraUsuarioHeader(null);
}

function actualizarBarraUsuarioHeader(userData) {
    const bar = document.getElementById('user-profile-bar');
    const nameEl = document.getElementById('user-display-name');
    const colegioEl = document.getElementById('user-colegio-tag');
    if (!bar) return;
    if (userData) {
        bar.style.display = 'flex';
        if (nameEl) nameEl.textContent = `👤 ${userData.displayName || 'Estudiante'}`;
        if (colegioEl) colegioEl.textContent = `🏫 ${userData.colegio || 'General'}`;
    } else {
        bar.style.display = 'none';
    }
}

function traductorErroresFirebase(code) {
    if (!code) return 'Error inesperado.';
    if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password')) return 'Correo o contraseña incorrectos.';
    if (code.includes('auth/email-already-in-use')) return 'Este correo ya está registrado.';
    if (code.includes('auth/invalid-email')) return 'Formato de correo inválido.';
    if (code.includes('auth/weak-password')) return 'Mínimo 6 caracteres.';
    return code;
}

function setupPantallaRegistro() {
    const skipBtn = document.getElementById('skip-splash-btn');
    skipBtn?.addEventListener('click', () => {
        if (window.paesFirebase) {
            window.paesFirebase.onAuthChange(async (user) => {
                if (user) {
                    ocultarPantallaRegistro();
                    const profile = await window.paesFirebase.getUserProfile(user.uid);
                    const displayName = profile?.displayName || user.displayName || 'Estudiante';
                    const colegio = profile?.colegio || 'General';
                    safeLocalSet('paes_jugador_nombre', displayName);
                    actualizarBarraUsuarioHeader({ displayName, colegio });
                    if (profile?.badges) {
                        state.badges = { ...state.badges, ...profile.badges };
                        saveBadges();
                    }
                } else {
                    const localName = safeLocalGet('paes_jugador_nombre', null);
                    if (!localName) mostrarPantallaRegistro();
                    else actualizarBarraUsuarioHeader({ displayName: localName, colegio: 'Offline' });
                }
            });
        } else {
            mostrarPantallaRegistro();
        }
    }, { once: true });
}

function mostrarPantallaRegistro() {
    const lock = document.getElementById('lock-screen');
    if (lock) lock.style.display = 'flex';
}

function ocultarPantallaRegistro() {
    const lock = document.getElementById('lock-screen');
    if (lock) lock.style.display = 'none';
}

function mostrarError(msg) {
    const errorBox = document.getElementById('lock-error');
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
}

// ===== CARGAR LOTES =====
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

// ... (resto del archivo sin cambios desde "createSpeedBonusToast" hasta "shareResults" y funciones de juego, power-ups, badges, leaderboard con Firebase, etc.)

// ===== LEADERBOARD (FIRESTORE) =====
let unsubscribeLeaderboard = null;

async function loadLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;
    if (window.paesFirebase && typeof window.paesFirebase.subscribeLeaderboard === 'function') {
        if (unsubscribeLeaderboard) unsubscribeLeaderboard();
        unsubscribeLeaderboard = window.paesFirebase.subscribeLeaderboard(20, (items) => {
            if (items && items.length > 0) {
                tbody.innerHTML = '';
                items.forEach((e, i) => {
                    const r = document.createElement('tr');
                    r.innerHTML = `<td class="${i<3?'rank-'+(i+1):''}">${i+1}</td><td>${e.displayName || 'Estudiante'} <small>(${e.colegio || 'General'})</small></td><td>${e.highScore || 0} pts</td><td>${'🏅'.repeat(e.badgesUnlocked || 0)}</td>`;
                    tbody.appendChild(r);
                });
                return;
            }
            cargarLeaderboardLocal(tbody);
        });
    } else {
        cargarLeaderboardLocal(tbody);
    }
}

function cargarLeaderboardLocal(tbody) {
    let lb = [];
    try { lb = JSON.parse(safeLocalGet('paes_leaderboard_v4','[]')); } catch(e) {}
    tbody.innerHTML = '';
    lb.forEach((e,i) => {
        const r = document.createElement('tr');
        r.innerHTML = `<td class="${i<3?'rank-'+(i+1):''}">${i+1}</td><td>${e.name}</td><td>${e.score} pts</td><td>${'🏅'.repeat(e.badges)}</td>`;
        tbody.appendChild(r);
    });
}

function saveToLeaderboard() {
    const authUser = window.paesFirebase?.getAuthInstance()?.currentUser;
    if (authUser) {
        const payload = {
            uid: authUser.uid,
            displayName: authUser.displayName || 'Estudiante',
            colegio: 'General',
            puntaje: state.score,
            partida: state.currentLote || 1,
            promedio: state.totalPreguntasRespondidas > 0 ? parseFloat((state.tiempoTotalDesafio / state.totalPreguntasRespondidas).toFixed(1)) : 0,
            correctas: Object.values(state.topicScores).reduce((sum, t) => sum + (t.correct || 0), 0),
            total: state.totalPreguntasRespondidas,
            insignias: Object.values(state.badges).filter(Boolean).length,
            tiempoTotal: state.tiempoTotalDesafio
        };
        window.paesFirebase.saveAttempt(payload).catch(err => console.warn("Error guardando intento:", err));
        window.paesFirebase.updateUserStats(authUser.uid, state.score, state.maxStreak, state.badges, state.powerups)
            .catch(err => console.warn("Error actualizando stats:", err));
    } else {
        const lb = JSON.parse(safeLocalGet('paes_leaderboard_v4','[]'));
        lb.push({ name: 'Invitado', score: state.score, badges: Object.values(state.badges).filter(Boolean).length });
        lb.sort((a,b) => b.score - a.score);
        safeLocalSet('paes_leaderboard_v4', JSON.stringify(lb.slice(0,20)));
    }
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

// ... (funciones de juego, power-ups, timer, preguntas, pantalla completa, resaltado, etc., se mantienen exactamente igual que en tu última versión de app.js)

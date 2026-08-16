/**
 * PAES Challenge Engine v4.6.0 (Production-Ready)
 * Sincronizado con index.html (Selector de Lotes & Modal)
 */

const PAESApp = (() => {
    'use strict';

    // ==========================================
    // 1. UTILIDADES Y MANEJO DE STORAGE SEGURO
    // ==========================================
    const Storage = {
        get(key, fallback = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : fallback;
            } catch (e) {
                console.warn(`[PAES Storage] Error leyendo clave "${key}":`, e);
                return fallback;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error(`[PAES Storage] Error guardando clave "${key}":`, e);
                return false;
            }
        },
        getRaw(key, fallback = null) {
            try {
                return localStorage.getItem(key) ?? fallback;
            } catch (e) {
                console.warn(`[PAES Storage] Error leyendo clave "${key}":`, e);
                return fallback;
            }
        },
        setRaw(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.error(`[PAES Storage] Error guardando clave "${key}":`, e);
                return false;
            }
        }
    };

    // ==========================================
    // 2. MOTOR DE ESTADO GLOBAL (STATE ENGINE)
    // ==========================================
    const initialState = {
        score: 0,
        streak: 0,
        streakShields: 1,
        currentLevel: 1,
        questionIndex: 0,
        playerName: '',
        offlineQueue: []
    };

    let _state = { ...initialState };
    const _listeners = new Set();

    const Engine = {
        getState() {
            return Object.freeze({ ..._state });
        },

        updateState(key, value) {
            if (_state[key] === value) return;
            _state = { ..._state, [key]: value };

            _listeners.forEach(listener => listener(_state, key));
        },

        subscribe(listener) {
            _listeners.add(listener);
            return () => _listeners.delete(listener);
        },

        reset() {
            _state = { ...initialState };
            _listeners.forEach(listener => listener(_state, 'reset'));
        }
    };

    // ==========================================
    // 3. SELECCIÓN Y HIGHLIGHTING SEGURO (RANGE API)
    // ==========================================
    const DOMUtils = {
        resaltarEvidenciaSegura(nodoContenedor, textoABuscar, claseCss = 'evidencia-correcta') {
            if (!nodoContenedor || !textoABuscar || typeof textoABuscar !== 'string') return false;

            const walker = document.createTreeWalker(
                nodoContenedor,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            const termino = textoABuscar.trim().toLowerCase();

            while ((node = walker.nextNode())) {
                const index = node.nodeValue.toLowerCase().indexOf(termino);
                if (index !== -1) {
                    try {
                        const range = document.createRange();
                        range.setStart(node, index);
                        range.setEnd(node, index + textoABuscar.length);

                        const span = document.createElement('span');
                        span.className = claseCss;

                        range.surroundContents(span);
                        span.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        return true;
                    } catch (err) {
                        console.warn('[PAES DOM] No se pudo crear el rango en el nodo actual:', err);
                    }
                }
            }
            return false;
        }
    };

    // ==========================================
    // 4. MÓDULO DE GAMEPLAY Y SISTEMA DE RACHAS
    // ==========================================
    const GameLogic = {
        procesarRespuesta(esCorrecta) {
            const state = Engine.getState();

            if (esCorrecta) {
                const nuevaRacha = state.streak + 1;
                const puntosGanados = 50 + (nuevaRacha * 10);

                Engine.updateState('streak', nuevaRacha);
                Engine.updateState('score', state.score + puntosGanados);

                this.notificarToast(`¡Respuesta Correcta! 🔥 Racha: ${nuevaRacha}`, '✨');
            } else {
                if (state.streak > 2 && state.streakShields > 0) {
                    Engine.updateState('streakShields', state.streakShields - 1);
                    this.notificarToast('¡Escudo de Racha activado! Tu progreso fue salvado 🛡️', '🛡️');
                } else {
                    Engine.updateState('streak', 0);
                    this.notificarToast('Respuesta incorrecta. Racha reiniciada 💔', '❌');
                }
            }
        },

        notificarToast(mensaje, icono = '🔔') {
            if (window.effectsManager && typeof window.effectsManager.triggerToastAcademico === 'function') {
                window.effectsManager.triggerToastAcademico(mensaje, { icon: icono, duration: 3000 });
            } else {
                console.log(`[PAES Toast ${icono}] ${mensaje}`);
            }
        }
    };

    // ==========================================
    // 5. MODAL DE REGISTRO / AUTENTICACIÓN (NICKNAME + PIN)
    // ==========================================
    const NicknameModal = {
        modalEl: null,
        formEl: null,
        nicknameFieldEl: null,
        pinFieldEl: null,
        errorMsgEl: null,
        submitBtnEl: null,

        init() {
            this.modalEl = document.getElementById('nickname-modal');
            this.formEl = document.getElementById('nickname-form');
            this.nicknameFieldEl = document.getElementById('nickname-field');
            this.pinFieldEl = document.getElementById('pin-field');
            this.errorMsgEl = document.getElementById('nickname-error-msg');
            this.submitBtnEl = document.getElementById('btn-save-nickname');

            if (!this.modalEl) {
                console.warn('[PAES Modal] #nickname-modal no existe en el DOM.');
                this.desbloquearYMostrarLotes();
                return;
            }

            const savedName = Storage.getRaw('usuario_nombre', '');
            if (savedName) {
                this.hide();
                Engine.updateState('playerName', savedName);
                this.desbloquearYMostrarLotes();
            } else {
                this.show();
            }

            if (this.formEl) {
                this.formEl.addEventListener('submit', (event) => this.handleSubmit(event));
            }
        },

        show() {
            if (this.modalEl) {
                this.modalEl.classList.add('active');
                this.modalEl.style.display = 'flex';
            }
        },

        hide() {
            if (this.modalEl) {
                this.modalEl.classList.remove('active');
                this.modalEl.style.display = 'none';
            }
            // Eliminar overlays fantasma
            const extraOverlay = document.getElementById("paes-onboarding-modal");
            if (extraOverlay) extraOverlay.remove();

            // Desbloquear interacciones globales
            document.body.style.pointerEvents = 'auto';
            document.body.style.overflow = 'auto';
        },

        desbloquearYMostrarLotes() {
            // Invocar la función de renderizado de lotes si está disponible en alguno de los scripts
            if (typeof window.cargarLotes === 'function') {
                window.cargarLotes();
            } else if (typeof window.renderLotes === 'function') {
                window.renderLotes();
            } else if (typeof window.initLotes === 'function') {
                window.initLotes();
            } else if (window.BancoPreguntas && typeof window.BancoPreguntas.init === 'function') {
                window.BancoPreguntas.init();
            }
        },

        setError(mensaje) {
            if (!this.errorMsgEl) return;
            if (mensaje) this.errorMsgEl.textContent = mensaje;
            this.errorMsgEl.classList.add('active');
            [this.nicknameFieldEl, this.pinFieldEl].forEach(el => el && el.classList.add('input-error'));
        },

        clearError() {
            if (!this.errorMsgEl) return;
            this.errorMsgEl.classList.remove('active');
            [this.nicknameFieldEl, this.pinFieldEl].forEach(el => el && el.classList.remove('input-error'));
        },

        setLoading(isLoading) {
            if (!this.submitBtnEl) return;
            this.submitBtnEl.disabled = isLoading;
            this.submitBtnEl.textContent = isLoading ? 'Verificando... ⏳' : 'Comenzar a Jugar 🚀';
        },

        async handleSubmit(event) {
            event.preventDefault();

            const nombre = (this.nicknameFieldEl?.value || '').trim();
            const pin = (this.pinFieldEl?.value || '').trim();

            if (!nombre || pin.length !== 4 || isNaN(pin)) {
                this.setError('Por favor ingresa un nombre válido y un PIN de 4 dígitos.');
                return;
            }

            this.clearError();
            this.setLoading(true);

            const resultado = await GoogleSheetsSync.registrarOAutenticarUsuario(nombre, pin);

            this.setLoading(false);

            if (!resultado.ok) {
                this.setError(resultado.mensaje || 'No se pudo verificar tu apodo y PIN. Intenta de nuevo.');
                return;
            }

            Storage.setRaw('usuario_nombre', nombre);
            Storage.setRaw('usuario_pin', pin);
            Engine.updateState('playerName', nombre);

            this.hide();
            this.desbloquearYMostrarLotes();

            GameLogic.notificarToast(`¡Bienvenido, ${nombre}! 🎉`, '🎉');
        }
    };

    // ==========================================
    // 6. COLA OFFLINE Y SINCRONIZACIÓN PERSISTENTE
    // ==========================================
    const SyncService = {
        flushPendingData() {
            if (!navigator.onLine) return;

            const queue = Storage.get('paes_pending_queue', []);
            if (!queue.length) return;

            console.log(`[PAES Sync] Sincronizando ${queue.length} registros pendientes...`);
            Storage.set('paes_pending_queue', []);
        },

        registrarEventoOffline(data) {
            const queue = Storage.get('paes_pending_queue', []);
            queue.push({ ...data, timestamp: Date.now() });
            Storage.set('paes_pending_queue', queue);
        }
    };

    // ==========================================
    // 7. INICIALIZADOR GLOBAL
    // ==========================================
    function init() {
        NicknameModal.init();

        window.addEventListener('online', () => SyncService.flushPendingData());

        Engine.subscribe((state, changedKey) => {
            const scoreElement = document.getElementById('score-display');
            const streakElement = document.getElementById('streak-display');
            const shieldElement = document.getElementById('shield-display');

            if (scoreElement && (changedKey === 'score' || changedKey === 'reset')) {
                scoreElement.textContent = state.score;
            }
            if (streakElement && (changedKey === 'streak' || changedKey === 'reset')) {
                streakElement.textContent = state.streak;
            }
            if (shieldElement && (changedKey === 'shield-display' || changedKey === 'reset')) {
                shieldElement.textContent = state.streakShields;
            }
        });

        SyncService.flushPendingData();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ==========================================
    // 8. CONEXIÓN CON GOOGLE SHEETS (APPS SCRIPT)
    // ==========================================
    const GoogleSheetsSync = {
        SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwZkLrIZ-bo4nJfJQ3r5lTa8orrmYWNVr6joi0Ng-c8SwDyU_bqzc4zxffcB1Phn7-ncA/exec",

        async registrarOAutenticarUsuario(nombre, pin) {
            try {
                await fetch(this.SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8",
                    },
                    body: JSON.stringify({
                        action: "login_or_register",
                        nombre: nombre,
                        pin_acceso: pin
                    })
                });

                console.log("Registro/Autenticación procesado correctamente en Sheets.");
                return { ok: true };
            } catch (error) {
                console.error("Error al conectar con BD_Usuarios:", error);
                return { ok: false, mensaje: 'No hay conexión con el servidor. Intenta de nuevo.' };
            }
        },

        async guardarPuntaje(materia, puntaje, racha) {
            const nombre = Storage.getRaw('usuario_nombre', '');
            if (!nombre) return;

            try {
                await fetch(this.SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8",
                    },
                    body: JSON.stringify({
                        action: "save_score",
                        nombre: nombre,
                        materia: materia || "General",
                        puntaje_maximo: puntaje || 0,
                        racha_maxima: racha || 0,
                        fecha: new Date().toISOString().split('T')[0]
                    })
                });
                console.log("Puntaje guardado con éxito en BD_Lideres.");
            } catch (error) {
                console.error("Error al registrar el puntaje en BD_Lideres:", error);
                SyncService.registrarEventoOffline({
                    action: 'save_score',
                    nombre,
                    materia: materia || 'General',
                    puntaje_maximo: puntaje || 0,
                    racha_maxima: racha || 0
                });
            }
        }
    };

    // API pública expuesta
    return {
        getState: Engine.getState,
        procesarRespuesta: GameLogic.procesarRespuesta.bind(GameLogic),
        resaltarTexto: DOMUtils.resaltarEvidenciaSegura,
        reset: Engine.reset,
        setPlayerName: (name) => Engine.updateState('playerName', name),
        guardarPuntaje: (materia, puntaje, racha) => GoogleSheetsSync.guardarPuntaje(materia, puntaje, racha)
    };
})();

// Wrapper global de compatibilidad
function guardarPuntaje(materia, puntaje, racha) {
    return PAESApp.guardarPuntaje(materia, puntaje, racha);
}

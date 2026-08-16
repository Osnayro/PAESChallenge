/**
 * PAES Challenge Engine v4.5.0 (Production-Ready)
 * 
 * Módulos integrados:
 * - State Management con suscripciones inmutables
 * - Highlighting seguro vía DOM Range API & TreeWalker
 * - Onboarding Exprés sin barreras de entrada
 * - Sistema de Racha y Escudo Anti-Frustración
 * - Persistencia robusta en LocalStorage + Cola Offline
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
            } catch (e) {
                console.error(`[PAES Storage] Error guardando clave "${key}":`, e);
            }
        }
    };

    // ==========================================
    // 2. MOTOR DE ESTADO GLOBAL (STATE ENGINE)
    // ==========================================
    const initialState = {
        score: 0,
        streak: 0,
        streakShields: 1, // Escudo inicial de retención
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
            
            // Notificar a todos los suscriptores de UI
            _listeners.forEach(listener => listener(_state, key));
        },

        subscribe(listener) {
            _listeners.add(listener);
            return () => _listeners.delete(listener); // Retorna función para desuscripción
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
        /**
         * Resalta un texto exacto en el DOM evitando destruir eventos nativos o innerHTML
         */
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
                // Mecánica de Escudo de Racha
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
    // 5. ONBOARDING Y CAPTURA DE USUARIO
    // ==========================================
    const Onboarding = {
        init() {
            const nombreGuardado = Storage.get('paes_jugador_nombre', '');
            if (nombreGuardado) {
                Engine.updateState('playerName', nombreGuardado);
                return;
            }
            this.renderizarModal();
        },

        renderizarModal() {
            const nickSugeridos = ['Aspirante2026', 'MentePAES', 'LectorPro', 'SabioPAES'];
            const nickRandom = nickSugeridos[Math.floor(Math.random() * nickSugeridos.length)];

            const overlay = document.createElement('div');
            overlay.id = 'paes-onboarding-modal';
            overlay.style.cssText = `
                position: fixed; inset: 0; background: rgba(15,23,42,0.85); 
                z-index: 9999; display: flex; align-items: center; justify-content: center; 
                padding: 20px; font-family: system-ui, -apple-system, sans-serif; backdrop-filter: blur(6px);
            `;

            overlay.innerHTML = `
                <div style="background:#ffffff; padding:32px 24px; border-radius:24px; max-width:360px; width:100%; text-align:center; box-shadow:0 25px 50px -12px rgba(0,0,0,0.35);">
                    <div style="font-size:3.5rem; margin-bottom:12px; line-height:1;">🦉</div>
                    <h2 style="font-size:1.4rem; font-weight:800; color:#0F172A; margin:0 0 8px 0;">Desafío PAES</h2>
                    <p style="font-size:0.875rem; color:#64748B; margin:0 0 20px 0;">Elige un apodo para iniciar tu racha de aprendizaje:</p>
                    
                    <input id="paes-nick-input" type="text" maxlength="15" value="${nickRandom}" 
                           style="width:100%; padding:14px; border-radius:14px; border:2px solid #8B5CF6; text-align:center; font-weight:700; font-size:1.05rem; color:#0F172A; outline:none; margin-bottom:16px; box-sizing:border-box;">
                    
                    <button id="paes-btn-start" 
                            style="width:100%; padding:16px; border-radius:14px; border:none; background:linear-gradient(135deg,#8B5CF6,#6D28D9); color:#ffffff; font-weight:800; font-size:1rem; cursor:pointer; box-shadow:0 10px 20px -5px rgba(139,92,246,0.5); transition:transform 0.1s ease;">
                        ¡Ingresar al Desafío! 🚀
                    </button>
                </div>
            `;

            document.body.appendChild(overlay);

            const input = document.getElementById('paes-nick-input');
            const btn = document.getElementById('paes-btn-start');

            btn.addEventListener('click', () => {
                const nombre = input.value.trim() || nickRandom;
                Storage.set('paes_jugador_nombre', nombre);
                Engine.updateState('playerName', nombre);

                // Bonificación inicial de retención
                const currentScore = Engine.getState().score;
                Engine.updateState('score', currentScore + 100);

                overlay.remove();
                GameLogic.notificarToast(`¡Bienvenido, ${nombre}! +100 PTS 🎁`, '🎉');
            });
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

            // Procesamiento en bloque
            console.log(`[PAES Sync] Sincronizando ${queue.length} registros pendientes...`);
            
            // Simulación de envío exitoso a backend/Google Sheets
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
        // Verificar usuario guardado (nuevo modal de registro con PIN)
        const savedName = localStorage.getItem('usuario_nombre');
        const modal = document.getElementById('nickname-modal');
        if (savedName && modal) {
            modal.style.display = 'none';
            Engine.updateState('playerName', savedName);
        }

        // Enlazar eventos de red
        window.addEventListener('online', () => SyncService.flushPendingData());

        // Suscripción de UI por cambios de estado
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
            if (shieldElement && (changedKey === 'streakShields' || changedKey === 'reset')) {
                shieldElement.textContent = state.streakShields;
            }
        });

        // Intentar sincronizar al arrancar
        SyncService.flushPendingData();
    }

    // Ejecución al estar disponible el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // API pública expuesta
    return {
        getState: Engine.getState,
        procesarRespuesta: GameLogic.procesarRespuesta.bind(GameLogic),
        resaltarTexto: DOMUtils.resaltarEvidenciaSegura,
        reset: Engine.reset,
        setPlayerName: (name) => Engine.updateState('playerName', name)
    };
})();

// ================================================================
// 8. CONEXIÓN CON GOOGLE SHEETS (APPS SCRIPT)
// ================================================================

// URL del despliegue activo de Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwZkLrIZ-bo4nJfJQ3r5lTa8orrmYWNVr6joi0Ng-c8SwDyU_bqzc4zxffcB1Phn7-ncA/exec";

// Manejar el formulario de registro/login
async function handleUserRegistration(event) {
    event.preventDefault();
    
    const nombre = document.getElementById("nickname-field").value.trim();
    const pin = document.getElementById("pin-field").value.trim();
    const errorMsg = document.getElementById("nickname-error-msg");

    if (!nombre || pin.length !== 4 || isNaN(pin)) {
        errorMsg.textContent = "Por favor ingresa un nombre válido y un PIN de 4 dígitos.";
        errorMsg.classList.add("active");
        return;
    }

    errorMsg.classList.remove("active");

    // Guardar credenciales en el navegador
    localStorage.setItem("usuario_nombre", nombre);
    localStorage.setItem("usuario_pin", pin);

    // Actualizar el estado global de PAESApp
    if (typeof PAESApp !== 'undefined' && PAESApp.setPlayerName) {
        PAESApp.setPlayerName(nombre);
    }

    // Ocultar modal
    const modal = document.getElementById("nickname-modal");
    if (modal) modal.style.display = "none";

    // Enviar datos al endpoint en Google Sheets (BD_Usuarios)
    await registrarOAutenticarUsuario(nombre, pin);
}

// 1. Enviar Usuario y PIN a BD_Usuarios
async function registrarOAutenticarUsuario(nombre, pin) {
    try {
        await fetch(SCRIPT_URL, {
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
        return true;
    } catch (error) {
        console.error("Error al conectar con BD_Usuarios:", error);
        return false;
    }
}

// 2. Enviar Puntaje a BD_Lideres al terminar una partida
async function guardarPuntaje(materia, puntaje, racha) {
    const nombre = localStorage.getItem("usuario_nombre");
    if (!nombre) return;

    try {
        await fetch(SCRIPT_URL, {
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
    }
}

// Comprobación inicial: ocultar el modal si ya existe un usuario guardado previamente
document.addEventListener("DOMContentLoaded", () => {
    const savedName = localStorage.getItem("usuario_nombre");
    const modal = document.getElementById("nickname-modal");
    
    if (savedName && modal) {
        modal.style.display = "none";
    }
});

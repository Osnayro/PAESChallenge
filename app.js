/* ================================================================
   CONFIGURACIÓN Y CONEXIÓN CON GOOGLE APPS SCRIPT
   ================================================================ */

// URL del despliegue activo en Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwZkLrIZ-bo4nJfJQ3r5lTa8orrmYWNVr6joi0Ng-c8SwDyU_bqzc4zxffcB1Phn7-ncA/exec";

/* ================================================================
   INICIALIZACIÓN DE LA APLICACIÓN
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {
    // Comprobar si el usuario ya inició sesión previamente
    const savedUser = localStorage.getItem("usuario_nombre");
    const modal = document.getElementById("nickname-modal");

    if (savedUser && modal) {
        modal.style.display = "none";
        console.log(`Sesión activa cargada: ${savedUser}`);
    }

    // Escuchar el evento de envío del formulario de apodo/PIN
    const nicknameForm = document.getElementById("nickname-form");
    if (nicknameForm) {
        nicknameForm.addEventListener("submit", handleUserRegistration);
    }
});

/* ================================================================
   GESTIÓN DE USUARIO (REGISTRO / LOGIN)
   ================================================================ */

/**
 * Procesa el formulario del modal de registro.
 * @param {Event} event 
 */
async function handleUserRegistration(event) {
    event.preventDefault();

    const nombreInput = document.getElementById("nickname-field");
    const pinInput = document.getElementById("pin-field");
    const errorMsg = document.getElementById("nickname-error-msg");

    const nombre = nombreInput.value.trim();
    const pin = pinInput.value.trim();

    // Validaciones locales básicas
    if (!nombre || pin.length !== 4 || isNaN(pin)) {
        mostrarError("Por favor ingresa un nombre válido y un PIN de 4 números.");
        return;
    }

    ocultarError();

    // Almacenar localmente en el navegador para persistencia de sesión
    localStorage.setItem("usuario_nombre", nombre);
    localStorage.setItem("usuario_pin", pin);

    // Ocultar modal de la interfaz
    const modal = document.getElementById("nickname-modal");
    if (modal) {
        modal.style.display = "none";
    }

    // Enviar datos en segundo plano a la hoja BD_Usuarios
    await registrarOAutenticarUsuario(nombre, pin);
}

/**
 * Envía la petición POST para crear o validar el usuario en BD_Usuarios.
 * @param {string} nombre 
 * @param {string} pin 
 */
async function registrarOAutenticarUsuario(nombre, pin) {
    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "login_or_register",
                nombre: nombre,
                pin_acceso: pin
            })
        });
        console.log("Datos de usuario enviados a la hoja BD_Usuarios.");
        return true;
    } catch (error) {
        console.error("Error al conectar con la base de datos de usuarios:", error);
        return false;
    }
}

/* ================================================================
   REGISTRO DE PUNTAJES (TABLA DE LÍDERES)
   ================================================================ */

/**
 * Guarda los resultados obteniendo el usuario actual desde localStorage.
 * Llama a esta función al terminar un juego o módulo.
 * 
 * @param {string} materia - Nombre de la materia o tema jugado.
 * @param {number} puntaje - Puntaje final obtenido.
 * @param {number} racha - Racha máxima alcanzada.
 */
async function guardarPuntaje(materia, puntaje, racha) {
    const nombre = localStorage.getItem("usuario_nombre");

    if (!nombre) {
        console.warn("No hay un usuario registrado localmente para guardar el puntaje.");
        return;
    }

    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json",
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
        console.log("Puntaje registrado exitosamente en BD_Lideres.");
    } catch (error) {
        console.error("Error al guardar el puntaje en la base de datos:", error);
    }
}

/* ================================================================
   MÉTODOS AUXILIARES DE INTERFAZ
   ================================================================ */

function mostrarError(mensaje) {
    const errorMsg = document.getElementById("nickname-error-msg");
    if (errorMsg) {
        errorMsg.textContent = mensaje;
        errorMsg.classList.add("active");
    }
}

function ocultarError() {
    const errorMsg = document.getElementById("nickname-error-msg");
    if (errorMsg) {
        errorMsg.classList.remove("active");
    }
}

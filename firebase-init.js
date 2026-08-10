
/**
 * ============================================================
 * PAES Challenge — Firebase v12.17.1 Integration Module
 * Auth + Firestore Real-Time Sync + Protected Answer Validation
 * ============================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { 
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    collection, 
    query, 
    where,
    orderBy, 
    limit, 
    getDocs,
    onSnapshot, 
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// ⚠️ La configuración DEBE estar definida en window.FIREBASE_CONFIG antes de cargar este módulo
const firebaseConfig = window.FIREBASE_CONFIG;
if (!firebaseConfig) {
    console.error("❌ window.FIREBASE_CONFIG no está definido. Firebase no se inicializará.");
}

let app, auth, db;
let firestoreInitialized = false;

// Mapa Oculto de Respuestas (Protegido en Scope Privado del Módulo ES6)
const privateAnswerKey = new Map();

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    try {
        db = initializeFirestore(app, {
            localCache: persistentLocalCache({
                tabManager: persistentMultipleTabManager()
            })
        });
    } catch (cacheErr) {
        console.warn("⚠️ No se pudo inicializar caché de pestañas múltiples, usando Firestore estándar:", cacheErr);
        db = getFirestore(app);
    }
    firestoreInitialized = true;
    console.log("🦉 Firebase v12.17.1 e Integración de Seguridad inicializados correctamente.");
} catch (err) {
    console.error("⚠️ Error inicializando Firebase:", err);
}

// ===== SANITIZACIÓN Y ENCAPSULAMIENTO DE RESPUESTAS =====
function registrarYSanitizarPreguntas(preguntasArray) {
    if (!Array.isArray(preguntasArray)) return [];

    return preguntasArray.map(q => {
        const qId = q.id;
        if (q.correct !== undefined) {
            // Guardar respuesta en mapa privado inaccesible desde consola
            privateAnswerKey.set(qId, {
                correct: q.correct,
                explanation: q.explanation || '',
                evidenceText: q.evidenceText || null
            });
        }

        // Retornar copia sanitizada (sin la clave 'correct')
        const sanitizada = { ...q };
        delete sanitizada.correct;
        return sanitizada;
    });
}

// ===== HELPER DE SERVICIOS PAES FIREBASE =====
window.paesFirebase = {
    isReady: () => firestoreInitialized,
    getAuthInstance: () => auth,
    getDbInstance: () => db,

    // --- PROTECCIÓN DE RESPUESTAS ---
    registerQuestions: (questions) => registrarYSanitizarPreguntas(questions),

    checkAnswer: (questionId, selectedIndex) => {
        const answerData = privateAnswerKey.get(questionId);
        if (!answerData) {
            console.warn(`⚠️ No se encontró clave de respuesta protegida para ID ${questionId}`);
            return { isCorrect: false, correctAnswer: 0, explanation: '', evidenceText: null };
        }
        const isCorrect = answerData.correct === Number(selectedIndex);
        return {
            isCorrect,
            correctAnswer: answerData.correct,
            explanation: answerData.explanation,
            evidenceText: answerData.evidenceText
        };
    },

    // --- AUTENTICACIÓN ---
    async login(email, password) {
        if (!auth) throw new Error("Firebase Auth no disponible");
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return cred.user;
    },

    async register(email, password, displayName, colegio = "", metaPuntaje = 850) {
        if (!auth) throw new Error("Firebase Auth no disponible");
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;
        
        await updateProfile(user, { displayName });

        const userRef = doc(db, "users", user.uid);
        const initialUserData = {
            uid: user.uid,
            displayName: displayName || "Estudiante PAES",
            email: user.email,
            colegio: colegio || "No especificado",
            metaPuntaje: Number(metaPuntaje) || 850,
            totalScore: 0,
            maxStreak: 0,
            totalPartidas: 0,
            badges: { perfectScore: false, speedDemon: false, streaker: false, paesPro: false, noPowerups: false },
            powerups: { fifty: 3, time: 2, freeze: 1, hint: 2 },
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        };
        await setDoc(userRef, initialUserData);
        
        await setDoc(doc(db, "leaderboard", user.uid), {
            uid: user.uid,
            displayName: displayName || "Estudiante PAES",
            colegio: colegio || "General",
            highScore: 0,
            badgesUnlocked: 0,
            updatedAt: serverTimestamp()
        });

        return user;
    },

    async googleSignIn() {
        if (!auth) throw new Error("Firebase Auth no disponible");
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);
        const user = cred.user;

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName || "Estudiante PAES",
                email: user.email,
                colegio: "General",
                metaPuntaje: 850,
                totalScore: 0,
                maxStreak: 0,
                totalPartidas: 0,
                badges: { perfectScore: false, speedDemon: false, streaker: false, paesPro: false, noPowerups: false },
                powerups: { fifty: 3, time: 2, freeze: 1, hint: 2 },
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            });
            await setDoc(doc(db, "leaderboard", user.uid), {
                uid: user.uid,
                displayName: user.displayName || "Estudiante PAES",
                colegio: "General",
                highScore: 0,
                badgesUnlocked: 0,
                updatedAt: serverTimestamp()
            });
        }
        return user;
    },

    async logout() {
        if (!auth) return;
        await signOut(auth);
    },

    onAuthChange(callback) {
        if (!auth) return () => {};
        return onAuthStateChanged(auth, callback);
    },

    // --- CARGA DE PREGUNTAS DESDE CLOUD FIRESTORE ---
    async fetchQuestionsFromFirestore(subject) {
        if (!db) return [];
        try {
            const q = query(collection(db, "questions"), where("subject", "==", subject));
            const querySnapshot = await getDocs(q);
            const rawQuestions = [];
            querySnapshot.forEach((docSnap) => {
                rawQuestions.push(docSnap.data());
            });
            return registrarYSanitizarPreguntas(rawQuestions);
        } catch (err) {
            console.warn(`⚠️ Error cargando preguntas de ${subject} desde Firestore:`, err);
            return [];
        }
    },

    // --- FIRESTORE USER PROFILE & STATS ---
    async getUserProfile(uid) {
        if (!db) return null;
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        return snap.exists() ? snap.data() : null;
    },

    async updateUserStats(uid, scoreToAdd, maxStreakInGame, newBadges, powerupsState) {
        if (!db) return;
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) return;

        const currentData = snap.data();
        const newTotalScore = (currentData.totalScore || 0) + scoreToAdd;
        const updatedMaxStreak = Math.max(currentData.maxStreak || 0, maxStreakInGame || 0);
        const updatedBadges = { ...(currentData.badges || {}), ...(newBadges || {}) };
        const unlockedBadgesCount = Object.values(updatedBadges).filter(Boolean).length;

        await updateDoc(ref, {
            totalScore: newTotalScore,
            maxStreak: updatedMaxStreak,
            totalPartidas: (currentData.totalPartidas || 0) + 1,
            badges: updatedBadges,
            powerups: powerupsState || currentData.powerups,
            lastLogin: serverTimestamp()
        });

        const lbRef = doc(db, "leaderboard", uid);
        await setDoc(lbRef, {
            uid,
            displayName: currentData.displayName || "Estudiante",
            colegio: currentData.colegio || "General",
            highScore: Math.max(currentData.highScore || 0, newTotalScore),
            badgesUnlocked: unlockedBadgesCount,
            updatedAt: serverTimestamp()
        }, { merge: true });
    },

    async saveAttempt(attemptPayload) {
        if (!db) return;
        const attemptsCol = collection(db, "attempts");
        await addDoc(attemptsCol, {
            ...attemptPayload,
            createdAt: serverTimestamp()
        });
    },

    subscribeLeaderboard(limitCount = 20, callback) {
        if (!db) return () => {};
        const q = query(collection(db, "leaderboard"), orderBy("highScore", "desc"), limit(limitCount));
        return onSnapshot(q, (snapshot) => {
            const leaderboardList = [];
            snapshot.forEach((docSnap) => {
                leaderboardList.push(docSnap.data());
            });
            callback(leaderboardList);
        }, (error) => {
            console.warn("⚠️ Error suscribiendo al leaderboard global Firestore:", error);
        });
    }
};

/**
 * ============================================================
 * PAES Challenge — Script de Sembrado a Cloud Firestore
 * Migra los 10 textos y 379 preguntas a colecciones de Firestore
 * ============================================================
 */

import { doc, setDoc, writeBatch } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

export async function sembrarBancosEnFirestore(db) {
    if (!db) {
        console.error("❌ Firestore database reference no disponible.");
        return { success: false, error: "Database reference is null" };
    }

    console.log("🦉 Iniciando sembrado de preguntas y textos en Cloud Firestore...");

    try {
        let totalTextos = 0;
        let totalPreguntas = 0;

        // 1. Sembrar Textos de Lectura (paesTexts)
        if (typeof paesTexts !== 'undefined') {
            const batchTextos = writeBatch(db);
            for (const [key, textObj] of Object.entries(paesTexts)) {
                const ref = doc(db, "texts", key);
                batchTextos.set(ref, {
                    textKey: key,
                    title: textObj.title || "",
                    author: textObj.author || "",
                    body: textObj.body || ""
                });
                totalTextos++;
            }
            await batchTextos.commit();
            console.log(`✅ ${totalTextos} textos de lectura guardados en Firestore.`);
        }

        // 2. Sembrar Preguntas (Lectora, M1, M2, Ciencias)
        const bancos = [
            { subject: 'lectora', data: typeof paesLenguajeQuestions !== 'undefined' ? paesLenguajeQuestions : [] },
            { subject: 'matematica1', data: typeof paesM1Questions !== 'undefined' ? paesM1Questions : [] },
            { subject: 'matematica2', data: typeof paesM2Questions !== 'undefined' ? paesM2Questions : [] },
            { subject: 'ciencias', data: typeof paesCienciasQuestions !== 'undefined' ? paesCienciasQuestions : [] }
        ];

        for (const banco of bancos) {
            if (!banco.data.length) continue;
            
            // Firestore admite hasta 500 escrituras por batch
            let batch = writeBatch(db);
            let countInBatch = 0;

            for (const q of banco.data) {
                const qId = `${banco.subject}_${q.id}`;
                const qRef = doc(db, "questions", qId);
                
                const qPayload = {
                    id: q.id,
                    firestoreId: qId,
                    subject: banco.subject,
                    textKey: q.textKey || null,
                    topic: q.topic || 'general',
                    type: q.type || 'multiple',
                    question: q.question || '',
                    options: q.options || [],
                    correct: q.correct !== undefined ? q.correct : 0,
                    explanation: q.explanation || '',
                    hint: q.hint || '',
                    evidenceText: q.evidenceText || null,
                    points: q.points || 100
                };

                batch.set(qRef, qPayload);
                countInBatch++;
                totalPreguntas++;

                if (countInBatch >= 400) {
                    await batch.commit();
                    batch = writeBatch(db);
                    countInBatch = 0;
                }
            }

            if (countInBatch > 0) {
                await batch.commit();
            }
            console.log(`✅ Banco ${banco.subject}: ${banco.data.length} preguntas migradas.`);
        }

        console.log(`🎉 Sembrado exitoso en Firestore: ${totalTextos} textos y ${totalPreguntas} preguntas en total.`);
        return { success: true, totalTextos, totalPreguntas };

    } catch (err) {
        console.error("❌ Error en sembrado de Firestore:", err);
        return { success: false, error: err.message };
    }
}

// Exponer en window para poder ejecutarlo fácilmente desde la consola o interfaz
window.ejecutarSembradoFirestore = async () => {
    if (!window.paesFirebase || !window.paesFirebase.getDbInstance()) {
        alert("⚠️ Firebase Firestore no está listo aún.");
        return;
    }
    const res = await sembrarBancosEnFirestore(window.paesFirebase.getDbInstance());
    if (res.success) {
        alert(`¡Éxito! Se migraron ${res.totalTextos} textos y ${res.totalPreguntas} preguntas a Cloud Firestore.`);
    } else {
        alert(`Error al migrar: ${res.error}`);
    }
};

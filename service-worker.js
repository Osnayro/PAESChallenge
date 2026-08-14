
/**
 * ============================================================
 * PAES Challenge — Service Worker v5.3.1
 * Cache y funcionalidad offline para PWA
 * ============================================================
 */

const CACHE_NAME = 'paes-challenge-v5.3.1';

const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './effects.js',
    './banco-lectora.js',
    './banco-matematica1.js',
    './banco-matematica2.js',
    './banco-ciencias.js',
    './app.js',
    './buho-svg.js',
    './firebase-init.js',
    './seed-firestore.js',
    './buho.PNG',
    './buho-uniforme.PNG',
    './icono-app.PNG',
    './icono-app-maskable.PNG',
    './manifest.json',
    './sounds/splash.mp3',
    './sounds/correct.mp3',
    './sounds/incorrect.mp3',
    './sounds/levelup.mp3',
    './sounds/levelstart.mp3',
    './sounds/achievement.mp3',
    './sounds/powerup.mp3',
    './sounds/star.mp3',
    './sounds/next.mp3'
];

self.addEventListener('install', (event) => {
    console.log('🦉 PAES Challenge v5.3.1 - Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Cacheando archivos...');
                return cache.addAll(ASSETS).catch((error) => {
                    console.warn('⚠️ Algunos archivos no se pudieron cachear:', error);
                    return Promise.resolve();
                });
            })
            .then(() => {
                console.log('✅ Instalación completada');
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('🦉 PAES Challenge v5.3.1 - Activando...');
    event.waitUntil(
        caches.keys()
            .then((keys) => {
                return Promise.all(
                    keys.filter((key) => key !== CACHE_NAME)
                        .map((key) => {
                            console.log('🗑️ Eliminando caché antigua:', key);
                            return caches.delete(key);
                        })
                );
            })
            .then(() => {
                console.log('✅ Activación completada');
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;
                return fetch(event.request)
                    .then((networkResponse) => {
                        if (!networkResponse || networkResponse.status !== 200) return networkResponse;
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => cache.put(event.request, responseClone))
                            .catch(() => {});
                        return networkResponse;
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') return caches.match('./index.html');
                        return new Response('Recurso no disponible offline', { status: 503, statusText: 'Service Unavailable' });
                    });
            })
    );
});

self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') self.skipWaiting();
    if (event.data === 'clearCache') {
        caches.delete(CACHE_NAME).then(() => console.log('🗑️ Caché eliminada'));
    }
});

console.log('🦉 PAES Challenge Service Worker v5.3.1 registrado');




const CACHE_NAME = 'future-foundation-v1';
const OFFLINE_ASSETS = [
  '/offline.html'
];

// Installation : on met le jeu en mémoire
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_ASSETS);
    })
  );
  self.skipWaiting(); // Force l'activation immédiate
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Prend le contrôle des pages immédiatement
});

// L'intercepteur magique
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Si le fetch échoue (pas d'internet), on sort le jeu du cache
        return caches.match('/offline.html');
      })
    );
  }
});

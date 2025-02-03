const CACHE_NAME = 'HK-OGD-v2'; // Update version to force cache refresh
const ASSETS_TO_CACHE = [
  '/index.html',       // Explicit entry point
  '/app.js',
  '/Medical Shield.json',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  '/offline.html'      // Added offline fallback
];

// Install Event: Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting()) // Activate SW immediately
  );
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cacheName => 
          cacheName !== CACHE_NAME ? caches.delete(cacheName) : null
        )
      )
    ).then(() => self.clients.claim()) // Control all open pages
  );
});

// Fetch Event: Network-first with cache fallback
self.addEventListener('fetch', (event) => {
  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/index.html')) // Fallback to index.html
    );
  } else {
    // Handle assets (CSS, JS, images)
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => cachedResponse || fetch(event.request))
        .catch(() => {
          if (event.request.destination === 'image') {
            return caches.match('/images/placeholder.png'); // Image fallback
          }
          return caches.match('/offline.html');
        })
    );
  }
});

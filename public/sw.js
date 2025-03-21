const CACHE_NAME = 'expense-tracker-v1';
const STATIC_ASSETS = [
  '/index.html',
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Cache static assets during installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Clean up old caches during activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch handler with different strategies based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Handle API requests (network-first strategy)
  if (request.url.includes('/rest/v1/') || request.url.includes('/auth/v1/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return caches.match(request);
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Handle static assets (cache-first strategy)
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        return caches.open(CACHE_NAME).then((cache) => {
          // Only cache same-origin requests
          if (new URL(request.url).origin === location.origin) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});
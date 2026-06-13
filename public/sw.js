const CACHE_NAME = "optiwallet-v1";

// App shell mínimo: rutas estáticas que queremos disponibles offline.
// Las llamadas a /api/* nunca se cachean (datos dinámicos de Neon).
const PRECACHE_URLS = [
  "/",
  "/app",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo manejamos GET.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Nunca interceptar la API: siempre red, siempre fresco.
  if (url.pathname.startsWith("/api/")) return;

  // Network-first para navegación HTML (para no servir una landing vieja),
  // con fallback a cache si no hay conexión.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((res) => res || caches.match("/")))
    );
    return;
  }

  // Cache-first para assets estáticos (íconos, fuentes, etc.)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});

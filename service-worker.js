const CACHE_NAME = "dossier-v1";
const FILES_TO_CACHE = [
  "/",
  "/home.html",
  "/pages/dossier.html",
  "/styles/style.css",
  "/script/util.js",
  "/script/index.js",
  "/script/dossier.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }),
  );
});

const CACHE_NAME = "dossier-v1";

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        }),
      );
    }),
  );
});

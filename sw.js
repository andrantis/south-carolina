const CACHE_NAME = "price-translator-v1";
const urlsToCache = ["/", "/index.html", "/styles.css", "/app.js", "/manifest.json", "https://unpkg.com/tesseract.js@v2.1.1/dist/tesseract.min.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

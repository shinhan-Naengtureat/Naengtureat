const CACHE_NAME = "naengteolit-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

// 설치 및 캐싱
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 네트워크 요청 캐시 처리
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
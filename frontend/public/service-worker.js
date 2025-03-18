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
  const requestURL = event.request.url;

  // 1) chrome-extension 등 비HTTP(S) 요청은 무시
  if (!requestURL.startsWith('http')) {
    return; // 여기서 return or 그냥 respondWith를 안 해주면 됨
  }

  // 2) 이후 http/https 요청만 캐싱 로직 처리
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
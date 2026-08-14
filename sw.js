/*
 * SnapEdit Service Worker v2.1
 * 职责：安装时预缓存核心资源，运行时 stale-while-revalidate
 * 注意：Cloudflare Pages 边缘缓存已处理静态资源，SW 只做离线兜底
 */
const VERSION = "snapedit-v2.1";
const PRECACHE = [
  "/",
  "/index.html"
];

/* ---------- 安装：预缓存 ---------- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => {
      return Promise.allSettled(
        PRECACHE.map((url) =>
          cache.add(url).catch((err) => console.warn("[SW] precache failed:", url, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

/* ---------- 激活：清掉旧版本缓存 ---------- */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ---------- 请求拦截 ---------- */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // 只处理同源请求
  if (url.origin !== self.location.origin) return;

  // HTML 页面：网络优先，失败回退缓存（保证始终拿到最新版）
  if (req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("/index.html")))
    );
    return;
  }

  // 其他资源：stale-while-revalidate
  event.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(req);
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.ok && res.type === "basic") {
            cache.put(req, res.clone()).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});

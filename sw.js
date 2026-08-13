/*
 * SnapEdit Service Worker
 * 职责：安装时预缓存核心资源，运行时优先走缓存（stale-while-revalidate）
 * 这样即使断网，编辑器本身依然可用
 */
const VERSION = "snapedit-v2";
const PRECACHE = [
  "/",
  "/index.html",
  "/README.md"
];

/* ---------- 安装：预缓存 ---------- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => {
      // 单个失败不影响整体
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

/* ---------- 请求拦截：stale-while-revalidate ---------- */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  // 跨域请求不处理
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(req);
      const networkFetch = fetch(req)
        .then((res) => {
          // 只缓存成功的同源响应
          if (res && res.ok && res.type === "basic") {
            cache.put(req, res.clone()).catch(() => {});
          }
          return res;
        })
        .catch(() => cached); // 断网时回退到缓存

      // 有缓存先用缓存，同时后台更新
      if (cached) {
        return cached;
      }
      return networkFetch;
    })
  );
});

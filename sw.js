// Service Worker for Web開発学習ガイド
// Version: 1.0.0
// NOTE: 本番環境では console.log を削除またはビルドプロセスで除去することを推奨

const CACHE_NAME = 'web-learn-v1';
const OFFLINE_URL = '/index.html';

// キャッシュ対象のリソース
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/pages/setup.html',
  '/pages/basics.html',
  '/pages/practice.html',
  '/pages/stitch-workflow.html',
  '/pages/ai-tools.html',
  '/pages/git-github-guide.html',
  '/pages/faq.html',
  '/css/styles.css',
  '/js/menu.js',
  '/js/search.js',
  '/js/toc.js',
  '/js/install.js',
  '/manifest.json'
];

// インストール時：リソースをキャッシュ
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// フェッチ時：キャッシュ戦略を適用
self.addEventListener('fetch', (event) => {
  // POSTリクエストなどはキャッシュしない
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // HTML: Network First（最新コンテンツ優先）
        const acceptHeader = event.request.headers.get('accept');
        if (acceptHeader && acceptHeader.includes('text/html')) {
          return fetch(event.request)
            .then((networkResponse) => {
              // 成功したら新しいレスポンスをキャッシュ
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
              return networkResponse;
            })
            .catch(() => {
              // オフライン時はキャッシュを返す
              return cachedResponse || caches.match(OFFLINE_URL);
            });
        }

        // CSS/JS/その他：Cache First（高速表示優先）
        if (cachedResponse) {
          // バックグラウンドで更新
          fetch(event.request).then((networkResponse) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }).catch(() => {
            // ネットワークエラーは無視
          });

          return cachedResponse;
        }

        // キャッシュになければネットワークから取得
        return fetch(event.request)
          .then((networkResponse) => {
            // 200番台のレスポンスのみキャッシュ
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // オフライン時のフォールバック
            return caches.match(OFFLINE_URL);
          });
      })
  );
});

// メッセージ受信：キャッシュの強制更新など
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        return self.registration.unregister();
      })
    );
  }
});

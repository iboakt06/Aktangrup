/* AKTAN GRUP - SERVICE WORKER
   PWA Caching & Offline Strategy
*/

const CACHE_NAME = 'aktan-grup-v2'; // Versiyonu v2 yapalım ki tarayıcı güncellesin!
const STATIC_ASSETS = [
  './',
  './index.html',
  './services.html',
  './about.html',
  './contact.html',
  './history.html',
  './education.html',
  './offline.html',
  './assets/css/style.css',
  './assets/js/app.js',
  './data/sample.json',
  // YENİ EKLENEN RESİMLER:
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  './assets/img/katrina.jpg',
  './assets/img/deprem.jpg',
  './assets/img/harvey.jpg',
  // Diğer CDN linkleri aynen kalsın...
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;600&display=swap'
];

// 1. KURULUM (INSTALL) - Dosyaları Önbelleğe Al
self.addEventListener('install', event => {
  console.log('[Service Worker] Kuruluyor...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Statik dosyalar önbelleklendi');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// 2. AKTİFLEŞTİRME (ACTIVATE) - Eski Cache'leri Temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim();
});

// 3. YAKALAMA (FETCH) - Offline Stratejisi
self.addEventListener('fetch', event => {
  
  // API isteklerini ve dış linkleri Network'ten çekmeye çalış, olmazsa hata ver
  if (event.request.url.includes('api.weather.gov')) {
     return; // API işini app.js içindeki mantığa bırakıyoruz
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Önce Cache'e bak, varsa ver
      return cachedResponse || fetch(event.request)
        .catch(() => {
            // 2. İnternet yoksa ve bu bir HTML sayfası isteğiyse 'offline.html'i döndür
            if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('./offline.html');
            }
        });
    })
  );
});
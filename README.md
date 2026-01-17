# 🛡️ AKTAN GRUP | Global Risk Yönetimi ve Afet Takip Sistemi (PWA)

Bu proje, **Web Tabanlı Mobil Uygulama Geliştirme** dersi dönem sonu projesi olarak hazırlanmıştır. 

Proje, kurgusal bir uluslararası risk danışmanlık firması olan **"Aktan Grup"** için geliştirilmiş kurumsal bir PWA (Progressive Web App) uygulamasıdır. Kullanıcılar, firma hakkında bilgi alabilir, ABD Ulusal Hava Durumu Servisi (NWS) üzerinden anlık doğal afet verilerini takip edebilir ve çevrimdışı (offline) durumda bile uygulamayı kullanabilirler.

---
 # Canlı Demo Linki 
    ="


---
## 📱 Proje Özellikleri (PWA)
Bu uygulama **Progressive Web App** standartlarına tam uyumludur:
* **Kurulabilir (Installable):** `manifest.json` sayesinde mobil cihazlara ana ekran uygulaması olarak eklenebilir.
* **Çevrimdışı Mod (Offline Capable):** `service-worker.js` sayesinde internet bağlantısı kopsa bile site çalışır.
* **Önbellekleme (Caching):** Statik dosyalar (CSS, JS, Resimler) ve sayfalar önbelleğe alınarak hızlı açılış sağlanır.
* **B Planı (Fallback):** API sunucusu yanıt vermezse veya internet yoksa, otomatik olarak yerel `sample.json` devreye girer.

---

## 🛠️ Kullanılan Teknolojiler
* **HTML5 & CSS3:** Semantik yapı ve modern tasarım.
* **Bootstrap 5:** Responsive (Mobil Uyumlu) iskelet yapısı.
* **JavaScript (ES6+):** `fetch()` API, DOM manipülasyonu ve Asenkron işlemler.
* **NWS API:** ABD Ulusal Hava Durumu Servisi (Gerçek Zamanlı Veri).
* **Service Worker:** Offline ve Cache yönetimi.

---

## 📡 API Kullanımı
Uygulama, **National Weather Service (NWS)** API'sini kullanmaktadır.

* **Endpoint:** `https://api.weather.gov/alerts/active`
* **Kullanım Şekli:** * `services.html` sayfasında tüm aktif uyarılar listelenir.
    * Kullanıcı arama kutusunu kullanarak (Örn: "Flood", "Texas") verileri filtreleyebilir.
    * `detail.html` sayfasında seçilen uyarının ID'si URL parametresi olarak alınır ve detaylı rapor çekilir.

> **Hata Yönetimi:** Eğer API 404/500 hatası verirse veya cihaz offline ise, sistem kullanıcıya hata mesajı gösterip `data/sample.json` içindeki yedek verileri yükler.

---

## 📂 Sayfa Yapısı (Multi-Page)
1.  **index.html:** Anasayfa, kurumsal tanıtım ve vitrin.
2.  **services.html:** Canlı risk paneli (API verilerinin listelendiği ana ekran).
3.  **detail.html:** Seçilen afetin detaylı teknik raporu (URL parametresi ile çalışır).
4.  **history.html:** ABD afet tarihçesi (Görsel ve bilgi odaklı).
5.  **education.html:** Afet eğitim rehberi (Akordeon menü).
6.  **about.html:** Kurumsal kimlik ve teknik şeffaflık raporu.
7.  **contact.html:** İletişim formu.
8.  **offline.html:** İnternet tamamen kesildiğinde gösterilen özel hata sayfası.

---

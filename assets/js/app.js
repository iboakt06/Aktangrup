/* AKTAN GRUP - PWA CORE ENGINE v2.1 (FIXED)
   API: National Weather Service (weather.gov)
*/

// NWS API için Zorunlu Kimlik Bilgisi
const API_HEADERS = {
    "User-Agent": "AktanGrup-StudentProject (contact@aktangrup.com)",
    "Accept": "application/geo+json"
};

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. LOADER & GEÇİŞLER ---
    const loader = document.getElementById('loader');
    window.onload = () => {
        if(loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => { loader.style.display = 'none'; }, 500);
            }, 800);
        }
    };

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (!target || target.startsWith('#') || target.startsWith('http') || target.includes('mailto')) return;
            e.preventDefault();
            if(loader) {
                loader.style.display = 'flex';
                setTimeout(() => { loader.style.opacity = '1'; }, 10);
                setTimeout(() => { window.location.href = target; }, 500);
            } else { window.location.href = target; }
        });
    });

    // --- 2. SAYFA YÖNLENDİRİCİ ---
    const path = window.location.pathname;
    
    if (path.includes("services.html")) {
        fetchAlerts();
    } else if (path.includes("detail.html")) {
        fetchAlertDetails();
    }
});

// --- 3. services.html İÇİN VERİ ÇEKME ---
async function fetchAlerts() {
    const API_URL = "https://api.weather.gov/alerts/active?area=CA";
    const FALLBACK_URL = "data/sample.json";
    
    try {
        console.log("API İsteği gönderiliyor...");
        
        // GÜNCELLEME: Headers eklendi
        let response = await fetch(API_URL, { headers: API_HEADERS });
        
        if (!response.ok) throw new Error(`API Hatası: ${response.status}`);
        
        let data = await response.json();
        let alerts = data.features || [];
        
        console.log("Veri alındı:", alerts.length, "adet kayıt.");

        if (alerts.length === 0) throw new Error("Veri Boş");
        
        renderAlerts(alerts);
        setupSearch(alerts);
    } catch (error) {
        console.error("HATA DETAYI:", error);
        
        // Hata mesajını göster
        const errorMsg = document.getElementById('error-message');
        if(errorMsg) {
            errorMsg.classList.remove('d-none');
            document.getElementById('error-text').innerHTML = "Canlı sunucuya erişilemedi. Çevrimdışı veriler gösteriliyor.";
        }
        
        // Yedeği Çek
        try {
            let backup = await fetch(FALLBACK_URL);
            let backupData = await backup.json();
            renderAlerts(backupData.features);
            setupSearch(backupData.features);
        } catch (e) { console.error("Yedek veri de çöktü."); }
    } finally {
        document.getElementById('loading-message')?.classList.add('d-none');
    }
}

function renderAlerts(alerts) {
    const grid = document.getElementById('alerts-grid');
    if(!grid) return;
    grid.innerHTML = "";

    alerts.forEach(alert => {
        const p = alert.properties;
        const safeID = encodeURIComponent(alert.id || alert.properties.id); 
        const severityColor = p.severity === "Severe" ? "#dc3545" : "#c3a343";
        
        grid.innerHTML += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="alert-card p-4 h-100 d-flex flex-column" style="border-left: 5px solid ${severityColor};">
                    <div class="d-flex justify-content-between mb-3">
                        <span class="badge bg-darker border border-secondary text-gold">${p.severity}</span>
                        <span class="text-gray small"><i class="fa-regular fa-clock me-1"></i>${new Date(p.sent).toLocaleTimeString()}</span>
                    </div>
                    <h5 class="text-white mb-2">${p.event}</h5>
                    <p class="text-gray small mb-4 flex-grow-1">${p.headline ? p.headline.substring(0, 80) : "Detaylar..."}...</p>
                    <a href="detail.html?id=${safeID}" class="btn btn-outline-gold w-100 mt-auto">İNCELE &rarr;</a>
                </div>
            </div>`;
    });
}

function setupSearch(alerts) {
    const searchInput = document.getElementById('searchInput');
    if(!searchInput) return;
    searchInput.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = alerts.filter(i => 
            i.properties.event.toLowerCase().includes(term) || 
            i.properties.areaDesc.toLowerCase().includes(term)
        );
        renderAlerts(filtered);
    });
}

// --- 4. detail.html İÇİN VERİ ÇEKME ---
async function fetchAlertDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        showError("Geçersiz Parametre ID");
        return;
    }

    try {
        let alertData;
        
        if (id.includes("yedek-veri")) {
            let response = await fetch("data/sample.json");
            let data = await response.json();
            let found = data.features.find(item => item.id === id);
            if(found) alertData = found.properties;
            else throw new Error("Yedek veri bulunamadı");
        } 
        else {
            // GÜNCELLEME: Headers buraya da eklendi
            let response = await fetch(id, { headers: API_HEADERS });
            if (!response.ok) throw new Error("Detay API Hatası");
            let data = await response.json();
            alertData = data.properties;
        }

        fillDetail(alertData);

    } catch (error) {
        console.error(error);
        showError("Rapor verilerine ulaşılamadı. Sunucu yanıt vermiyor.");
    }
}

function fillDetail(data) {
    document.getElementById('detail-loading').classList.add('d-none');
    document.getElementById('detail-content').classList.remove('d-none');

    const color = data.severity === "Severe" ? "#dc3545" : "#c3a343";
    document.getElementById('severity-line').style.background = color;
    document.getElementById('detail-severity').innerText = data.severity.toUpperCase() + " RİSK";
    document.getElementById('detail-severity').style.color = color;

    document.getElementById('detail-title').innerText = data.event;
    document.getElementById('detail-desc').innerText = data.description || "Açıklama mevcut değil.";
    document.getElementById('detail-instruction').innerText = data.instruction || "Özel bir talimat bulunmamaktadır. Yerel yetkilileri takip ediniz.";
    
    document.getElementById('detail-area').innerText = data.areaDesc || "Bölge Belirtilmemiş";
    document.getElementById('detail-sent').innerText = new Date(data.sent).toLocaleString();
    document.getElementById('detail-expires').innerText = new Date(data.expires).toLocaleString();
}

function showError(msg) {
    document.getElementById('detail-loading').classList.add('d-none');
    const errDiv = document.getElementById('detail-error');
    errDiv.classList.remove('d-none');
    errDiv.innerHTML += " " + msg;
}

// --- 5. PWA REGISTER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js'));
}
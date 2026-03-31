// ==========================================
// 1. БАЗОВЫЕ ДАННЫЕ (БАЗА ДАННЫХ ПО УМОЛЧАНИЮ)
// ==========================================
// Если пользователь заходит впервые, сайт возьмет данные отсюда.
const defaultData = {
    settings: {
        bgDesktop: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2000",
        bgMobile: "https://images.unsplash.com/photo-1540655037529-dec98f5807ee?q=80&w=800",
        bannerBg: "https://images.unsplash.com/photo-1620121478247-ec786ceb24c3?q=80&w=2000",
        instagram: "https://instagram.com/collusion_media",
        phone: "+79000000000",
        email: "hello@collusion.media"
    },
    translations: {
        ru: {
            portfolioTitle: "PORTFOLIO",
            aboutTitle: "О Collusion Media",
            aboutText: "Новый видео продакшн, который работает над музыкальными, коммерческими и творческими проектами.",
            catCommercial: "Коммерческие работы",
            catMusic: "Музыкальные клипы",
            catLifestyle: "Лайфстайл",
            catArtists: "Артисты"
        },
        en: {
            portfolioTitle: "PORTFOLIO",
            aboutTitle: "About Collusion Media",
            aboutText: "A new video production company working on music, commercial, and creative projects.",
            catCommercial: "Commercial Works",
            catMusic: "Music Videos",
            catLifestyle: "Lifestyle",
            catArtists: "Artists"
        },
        uk: {
            portfolioTitle: "PORTFOLIO",
            aboutTitle: "Про Collusion Media",
            aboutText: "Новий відеопродакшн, який працює над музичними, комерційними та творчими проєктами.",
            catCommercial: "Комерційні роботи",
            catMusic: "Музичні кліпи",
            catLifestyle: "Лайфстайл",
            catArtists: "Артисти"
        },
        pl: {
            portfolioTitle: "PORTFOLIO",
            aboutTitle: "O Collusion Media",
            aboutText: "Nowa produkcja wideo pracująca nad projektami muzycznymi, komercyjnymi i kreatywnymi.",
            catCommercial: "Prace komercyjne",
            catMusic: "Teledyski",
            catLifestyle: "Lifestyle",
            catArtists: "Artyści"
        },
        de: {
            portfolioTitle: "PORTFOLIO",
            aboutTitle: "Über Collusion Media",
            aboutText: "Eine neue Videoproduktion, die an Musik-, Werbe- und Kreativprojekten arbeitet.",
            catCommercial: "Kommerzielle Arbeiten",
            catMusic: "Musikvideos",
            catLifestyle: "Lifestyle",
            catArtists: "Künstler"
        }
    },
    videos: {
        // Сюда вставляй только ID видео (то, что в ссылке YouTube идет после v=)
        commercial: ["dQw4w9WgXcQ"], 
        music: ["3JZ_D3ELwOQ"],
        lifestyle: [],
        artists: []
    }
};

// Загружаем данные из памяти браузера или используем дефолтные
let siteData = JSON.parse(localStorage.getItem('collusionData'));
if (!siteData) {
    siteData = defaultData;
    localStorage.setItem('collusionData', JSON.stringify(siteData));
}

// ==========================================
// 2. СИСТЕМА ЯЗЫКОВ
// ==========================================

let currentLang = localStorage.getItem('siteLang');

// Автоопределение языка, если он не выбран вручную
if (!currentLang) {
    const browserLang = navigator.language.slice(0, 2); 
    const supported = ['ru', 'en', 'de', 'pl', 'uk'];
    currentLang = supported.includes(browserLang) ? browserLang : 'en';
    localStorage.setItem('siteLang', currentLang);
}

// Применение текстов на страницу
function applyTranslations() {
    const dict = siteData.translations[currentLang] || siteData.translations['en'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.innerText = dict[key];
    });
}

// ==========================================
// 3. ЗАПУСК И ОТРИСОВКА САЙТА
// ==========================================

function initSite() {
    // Установка картинок фона
    document.documentElement.style.setProperty('--bg-desktop', `url('${siteData.settings.bgDesktop}')`);
    document.documentElement.style.setProperty('--bg-mobile', `url('${siteData.settings.bgMobile}')`);
    document.documentElement.style.setProperty('--banner-img', `url('${siteData.settings.bannerBg}')`);

    // Ссылки
    const instLink = document.getElementById('link-instagram');
    const emailLink = document.getElementById('link-email');
    const phoneLink = document.getElementById('link-phone');

    if(instLink) instLink.href = siteData.settings.instagram;
    if(emailLink) emailLink.href = `mailto:${siteData.settings.email}`;
    if(phoneLink) {
        phoneLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(siteData.settings.phone);
            alert("Номер скопирован: " + siteData.settings.phone);
        });
    }

    // Переключатель языков
    const langSwitch = document.getElementById('lang-switch');
    if(langSwitch) {
        langSwitch.value = currentLang;
        langSwitch.addEventListener('change', (e) => {
            localStorage.setItem('siteLang', e.target.value);
            window.location.reload();
        });
    }

    applyTranslations();

    // Отрисовка видео в категориях
    renderVideos('commercial', 'row-commercial');
    renderVideos('music', 'row-music');
    renderVideos('lifestyle', 'row-lifestyle');
    renderVideos('artists', 'row-artists');
}

function renderVideos(categoryKey, containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;

    const vids = siteData.videos[categoryKey];
    if(!vids || vids.length === 0) {
        container.parentElement.style.display = 'none'; // Скрываем пустую категорию
        return;
    }

    container.innerHTML = vids.map(id => `
        <div class="video-card">
            <iframe src="https://www.youtube.com/embed/${id}?rel=0&modestbranding=1" 
                    allowfullscreen></iframe>
        </div>
    `).join('');
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', initSite);
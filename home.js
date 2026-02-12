 const translations = {
      kz: {
        hello: "Сәлем",
        menu_profile: "Профиль",
        menu_orders: "Тапсырыстар",
        menu_settings: "Баптаулар",
        menu_help: "Көмек",
        night_mode: "Түнгі режим",
        addr_label: "Мекенжай",
        services_title: "Қызметтер",
        spec_electrician: "Электрик",
        spec_plumber: "Сантехник",
        spec_builder: "Жөндеу",
        spec_garden: "Аула",
        spec_cleaner: "Тазалық",
        spec_all: "Барлығы",
        quick_btn: "Бағасын өзің қой!",
        quick_desc: "Мамандар 5 минутта жауап береді",
        active_order: "Белсенді тапсырыс",
        order_label: "Жұмыста",
        order_status: "Шебер жолда",
        tab_home: "Басты",
        tab_create: "Қосу",
        tab_profile: "Профиль"
      },
      ru: {
        hello: "Привет",
        menu_profile: "Профиль",
        menu_orders: "Заказы",
        menu_settings: "Настройки",
        menu_help: "Помощь",
        night_mode: "Ночной режим",
        addr_label: "Адрес",
        services_title: "Услуги",
        spec_electrician: "Электрик",
        spec_plumber: "Сантехник",
        spec_builder: "Ремонт",
        spec_garden: "Двор",
        spec_cleaner: "Уборка",
        spec_all: "Все",
        quick_btn: "Предложи свою цену!",
        quick_desc: "Мастера ответят за 5 минут",
        active_order: "Активный заказ",
        order_label: "В работе",
        order_status: "Мастер в пути",
        tab_home: "Главная",
        tab_create: "Создать",
        tab_profile: "Профиль"
      }
    };

    /* TOAST: используем только где реально нужно */
    const toastWrap = document.getElementById('toastWrap');
    function showToast(message, type = 'info', timeout = 2200) {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <div class="left">
          <div class="dot"></div>
          <div class="msg">${escapeHtml(message)}</div>
        </div>
        <button class="close" aria-label="close">&times;</button>
      `;
      toastWrap.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));

      const remove = () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
      };
      toast.querySelector('.close').addEventListener('click', remove);
      setTimeout(remove, timeout);
    }

    function escapeHtml(str) {
      return String(str)
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'",'&#039;');
    }

    function t(key) {
      const lang = localStorage.getItem("lang") || "kz";
      return (translations[lang] && translations[lang][key]) ? translations[lang][key] : key;
    }

    function setLanguage(lang) {
      document.querySelectorAll(".lang-pill").forEach(p => p.classList.remove("active"));
      const pill = document.querySelector(`.lang-pill[data-lang="${lang}"]`);
      if (pill) pill.classList.add("active");

      const glider = pill ? pill.closest('.lang-rect').querySelector('.glider') : null;
      if (glider && pill) {
        glider.style.width = `${pill.offsetWidth}px`;
        glider.style.transform = `translateX(${pill.offsetLeft - 4}px)`;
      }

      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang] && translations[lang][key]) el.innerText = translations[lang][key];
      });
      localStorage.setItem("lang", lang);

      // ✅ Никаких тостов тут (убрали)
    }

    const themeCheckbox = document.getElementById('themeCheckbox');
    themeCheckbox.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);

      // ✅ тоже без тоста (убрали)
    });

    function toggleMenu() {
      document.getElementById('sidebar').classList.toggle('active');
      document.getElementById('sidebarOverlay').classList.toggle('active');
      setTimeout(() => setLanguage(localStorage.getItem("lang") || "kz"), 50);
    }

    function setTab(tab) {
  document.getElementById('navHome').classList.toggle('active', tab === 'home');
  document.getElementById('navProfile').classList.toggle('active', tab === 'profile');

  if (tab === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
  if (tab === 'profile') window.location.href = "user-profile.html";
}

function openProfile() {
  window.location.href = "user-profile.html";
}


    function openProfile() {
      // Здесь потом заменишь на profile.html
      showToast('Профиль — скоро', 'info');
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
      }
    }

    // skeleton 900ms
    window.addEventListener('load', () => {
      setTimeout(() => {
        const card = document.getElementById('activeOrderCard');
        card.classList.remove('loading', 'skeleton');
      }, 900);
    });

    // Init
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeCheckbox.checked = (savedTheme === 'dark');
    window.addEventListener('load', () => setLanguage(localStorage.getItem("lang") || "kz"));

    // swipe to open menu
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive:true });
    document.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const dx = endX - touchStartX;
      if (touchStartX < 30 && dx > 60) toggleMenu();
    }, { passive:true });
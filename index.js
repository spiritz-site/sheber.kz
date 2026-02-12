const translations = {
      kz: {
        title: "Sheber.kz",
        desc: "Қазақстанға арналған шеберлер алаңы: тапсырыс беруші мен шеберді тез байланыстырамыз.",
        start_btn: "Бастау",

        modal_phone_title: "Кіру",
        modal_phone_desc: "Жалғастыру үшін телефон нөмірін енгізіңіз",

        auth_login: "Кіру",
        auth_register: "Тіркелу",

        lbl_phone: "Телефон",
        btn_get_code: "Код алу",

        modal_code_title: "Растау",
        modal_code_desc: "Код жіберілді:",
        lbl_code: "СМС коды",
        btn_confirm: "Растау",
        btn_change_phone: "Нөмірді өзгерту",

        role_title: "Сіз кімсіз?",
        role_client: "Клиент",
        role_client_sub: "Шебер іздеймін",
        role_master: "Шебер",
        role_master_sub: "Клиент іздеймін",

        reg_title: "Тіркелу",
        lbl_name: "Есіміңіз",
        lbl_spec: "Мамандық",
        btn_save: "Дайын",

        spec_plumber: "Сантехник",
        spec_electrician: "Электрик",
        spec_builder: "Құрылысшы",
        spec_cleaner: "Клининг",

        terms_text: "Жалғастыра отырып, сіз келісесіз:",
        terms_link: "қолдану ережелері",

        lbl_city: "Қала / Мекен-жай",
        lbl_exp: "Тәжірибе (жыл)",
        lbl_about: "Өзіңіз туралы"
      },
      ru: {
        title: "Sheber.kz",
        desc: "Платформа мастеров Казахстана: Мы быстро связываем заказчика и мастера.",
        start_btn: "Начать",

        modal_phone_title: "Вход",
        modal_phone_desc: "Введите номер телефона для продолжения",

        auth_login: "Войти",
        auth_register: "Регистрация",

        lbl_phone: "Телефон",
        btn_get_code: "Получить код",

        modal_code_title: "Подтверждение",
        modal_code_desc: "Код отправлен на:",
        lbl_code: "Код из СМС",
        btn_confirm: "Подтвердить",
        btn_change_phone: "Изменить номер",

        role_title: "Кто вы?",
        role_client: "Заказчик",
        role_client_sub: "Ищу мастера",
        role_master: "Мастер",
        role_master_sub: "Ищу заказы",

        reg_title: "Регистрация",
        lbl_name: "Ваше имя",
        lbl_spec: "Специальность",
        btn_save: "Готово",

        spec_plumber: "Сантехник",
        spec_electrician: "Электрик",
        spec_builder: "Строитель",
        spec_cleaner: "Клининг",

        terms_text: "Продолжая, вы соглашаетесь с",
        terms_link: "условиями использования",

        lbl_city: "Город / Адрес",
        lbl_exp: "Опыт (лет)",
        lbl_about: "О себе"
      }
    };

    /* ===== TOAST API ===== */
    const toastWrap = document.getElementById('toastWrap');
    function showToast(message, type = 'info', timeout = 2600) {
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

      // show animation
      requestAnimationFrame(() => toast.classList.add('show'));

      const closeBtn = toast.querySelector('.close');
      const remove = () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
      };

      closeBtn.addEventListener('click', remove);
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

    let currentRole = 'client';

    // auth mode
    let authMode = 'login'; // 'login' | 'register'

    function setAuthMode(mode) {
      authMode = mode;

      document.getElementById('authLoginBtn').classList.toggle('active', mode === 'login');
      document.getElementById('authRegisterBtn').classList.toggle('active', mode === 'register');

      const lang = localStorage.getItem("lang") || "kz";
      const titleEl = document.querySelector('#stepPhone .modal-title');
      const descEl = document.querySelector('#stepPhone .modal-desc');
      const mainBtn = document.getElementById('mainAuthBtn');

      if (mode === 'login') {
        titleEl.innerHTML = translations[lang].modal_phone_title;
        descEl.innerHTML = translations[lang].modal_phone_desc;
        mainBtn.innerHTML = translations[lang].btn_get_code;
      } else {
        titleEl.innerHTML = (lang === 'ru') ? "Регистрация" : "Тіркелу";
        descEl.innerHTML = (lang === 'ru')
          ? "Введите номер телефона для регистрации"
          : "Тіркелу үшін телефон нөмірін енгізіңіз";
        mainBtn.innerHTML = (lang === 'ru') ? "Продолжить" : "Жалғастыру";
      }
    }

    function setLanguage(lang) {
      document.querySelectorAll(".lang-pill").forEach(p => p.classList.remove("active"));
      const activePills = document.querySelectorAll(`.lang-pill[data-lang="${lang}"]`);

      activePills.forEach(p => {
        p.classList.add("active");
        const parent = p.closest('.lang-rect');
        const glider = parent.querySelector('.glider');
        if (glider) {
          glider.style.width = `${p.offsetWidth}px`;
          glider.style.transform = `translateX(${p.offsetLeft - 4}px)`;
        }
      });

      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang][key]) el.innerHTML = translations[lang][key];
        if (el.placeholder && translations[lang][key]) el.placeholder = translations[lang][key];
      });

      localStorage.setItem("lang", lang);
      setAuthMode(authMode);
    }

    function toggleTheme() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    }

    function updateThemeIcon(theme) {
      document.querySelector('.sun-icon').style.display = theme === 'dark' ? 'none' : 'block';
      document.querySelector('.moon-icon').style.display = theme === 'dark' ? 'block' : 'none';
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    window.addEventListener('load', () => {
      setLanguage(localStorage.getItem("lang") || "kz");
    });

    const modal = document.getElementById('smsModal');
    const steps = ['stepPhone', 'stepCode', 'stepRole', 'stepReg'];

    function showStep(stepId) {
      steps.forEach(id => document.getElementById(id).classList.remove('active'));
      document.getElementById(stepId).classList.add('active');
    }

    function openModal(e) {
      if(e) e.preventDefault();
      modal.classList.add('active');
      showStep('stepPhone');
      setAuthMode('login');
    }
    function closeModal() { modal.classList.remove('active'); }
    function backToPhone() { showStep('stepPhone'); }

    function sendCode() {
      const phone = document.getElementById('phoneInput').value.trim();
      if (phone.length < 5) {
        showToast("Нөмірді дұрыс жазыңыз / Введите номер", "warn");
        return;
      }
      document.getElementById('displayPhone').textContent = phone;
      showToast("Код жіберілді / Код отправлен", "success");
      showStep('stepCode');
    }

    // ✅ После ввода кода -> переход на home.html
    // Логика:
    // - login: сразу на home.html
    // - register: идем на выбор роли/анкета, а после сохранения тоже переходим на home.html
    function verifyCode() {
      const code = document.getElementById('codeInput').value.trim();
      if (!code) {
        showToast("Код енгізіңіз / Введите код", "warn");
        return;
      }

      if (authMode === 'login') {
        showToast("Сәтті кірдіңіз! / Успешный вход!", "success", 1200);
        setTimeout(() => window.location.href = "home.html", 600);
        return;
      }

      showToast("Код расталды / Код подтверждён", "success");
      showStep('stepRole');
    }

    function chooseRole(role) {
      currentRole = role;
      if (role === 'master') {
        document.getElementById('masterFields').style.display = 'block';
        document.getElementById('clientFields').style.display = 'none';
      } else {
        document.getElementById('masterFields').style.display = 'none';
        document.getElementById('clientFields').style.display = 'block';
      }
      showStep('stepReg');
    }

    function finishRegistration() {
      const name = document.getElementById('regName').value.trim();
      if (!name) {
        showToast("Атыңызды жазыңыз / Введите имя", "warn");
        return;
      }

      console.log("Регистрация завершена:", {
        role: currentRole,
        name: name,
        spec: document.getElementById('regSpec').value,
        exp: document.getElementById('regExp').value,
        about: document.getElementById('regAbout').value,
        city: document.getElementById('regCity').value
      });

      showToast("Сәтті тіркелу! / Успешная регистрация!", "success", 1200);
      setTimeout(() => window.location.href = "home.html", 700);
    }

    document.getElementById('startLink').addEventListener('click', openModal);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.querySelectorAll(".lang-pill").forEach(p => p.addEventListener("click", () => setLanguage(p.dataset.lang)));
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
const saveDot = document.getElementById('saveDot');
    const saveText = document.getElementById('saveText');
    let dirty = false;
    let saveTimer = null;

    function setDirty(state){
      dirty = state;
      if (dirty){
        saveDot.classList.remove('saved');
        saveText.innerText = 'Не сохранено';
      } else {
        saveDot.classList.add('saved');
        saveText.innerText = 'Сохранено';
      }
    }

    function scheduleAutoSave(){
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        if (dirty) saveProfile(true); 
      }, 700);
    }

    const defaultProfile = {
      name: "Азамат",
      about: "",
      role: "client",
      phone: "+7 (707) 123-45-67",
      city: "Астана",
      spec: "electrician"
    };

    function loadProfile(){
      const raw = localStorage.getItem('profile');
      const profile = raw ? JSON.parse(raw) : defaultProfile;

      // Заполняем поля
      document.getElementById('nameInput').value = profile.name || '';
      document.getElementById('aboutInput').value = profile.about || '';
      document.getElementById('roleSelect').value = profile.role || 'client';
      document.getElementById('phoneInput').value = profile.phone || '';
      document.getElementById('cityInput').value = profile.city || '';
      document.getElementById('specSelect').value = profile.spec || 'electrician';

      syncRoleUI(profile.role || 'client');
      syncHero(profile);
      setDirty(false);
    }

    function getProfileFromForm(){
      return {
        name: document.getElementById('nameInput').value.trim(),
        about: document.getElementById('aboutInput').value.trim(),
        role: document.getElementById('roleSelect').value,
        phone: document.getElementById('phoneInput').value.trim(),
        city: document.getElementById('cityInput').value.trim(),
        spec: document.getElementById('specSelect').value
      };
    }

    function syncHero(profile){
      const name = profile.name || '';
      document.getElementById('heroName').innerText = name || 'Без имени';
      document.getElementById('heroPhone').innerText = profile.phone || '—';
      document.getElementById('heroCity').innerText = profile.city || '—';
      document.getElementById('avatarLetter').innerText = (name[0] || 'U').toUpperCase();

      const badge = document.getElementById('roleBadge');
      if (profile.role === 'master'){
        badge.innerText = 'Master';
        badge.style.background = 'rgba(0,201,255,0.12)';
        badge.style.borderColor = 'rgba(0,201,255,0.22)';
      } else {
        badge.innerText = 'Client';
        badge.style.background = 'rgba(0,242,160,0.10)';
        badge.style.borderColor = 'rgba(0,242,160,0.25)';
      }
    }

    function syncRoleUI(role){
      // Если мастер, показываем специальность, иначе скрываем
      const masterFields = document.getElementById('masterFields');
      const row = masterFields.parentElement;
      
      if (role === 'master') {
        masterFields.style.display = 'flex';
        // Если на десктопе, возвращаем grid
        if(window.innerWidth > 460) row.style.gridTemplateColumns = "1fr 1fr";
      } else {
        masterFields.style.display = 'none';
        // Если поле одно, растягиваем его
        row.style.gridTemplateColumns = "1fr";
      }
    }

    function resetForm(){
      loadProfile();
    }

    function saveProfile(silent=false){
      const profile = getProfileFromForm();

      if (!profile.name) return; // Простая валидация

      localStorage.setItem('profile', JSON.stringify(profile));
      syncHero(profile);
      setDirty(false);
      
      // Анимация сохранения для кнопки, если нажата вручную
      if(!silent) {
        const btn = document.getElementById('saveBtn');
        const originalText = btn.innerText;
        btn.innerText = "OK";
        setTimeout(() => btn.innerText = originalText, 1000);
      }
    }

    function onAnyChange(){
      setDirty(true);
      scheduleAutoSave();
      
      // Динамическое обновление UI при вводе
      const profile = getProfileFromForm();
      syncRoleUI(profile.role);
      // Hero обновляем сразу для отзывчивости
      document.getElementById('heroName').innerText = profile.name || '...';
      document.getElementById('avatarLetter').innerText = (profile.name[0]||'?').toUpperCase();
    }

    // Слушатели событий
    const inputs = ['nameInput', 'aboutInput', 'phoneInput', 'cityInput', 'roleSelect', 'specSelect'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if(el.tagName === 'SELECT') {
        el.addEventListener('change', onAnyChange);
      } else {
        el.addEventListener('input', onAnyChange);
      }
    });

    function goBack(){
      window.history.length > 1 ? window.history.back() : (window.location.href = "home.html");
    }

    // Инициализация
    loadProfile();

    // Обработка Enter (кроме textarea)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter'){
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        if ((tag === 'input' || tag === 'select') && tag !== 'textarea'){
          e.preventDefault();
          document.activeElement.blur(); // Убираем фокус чтобы скрыть клавиатуру
          saveProfile(false);
        }
      }
    });

    window.addEventListener('beforeunload', (e) => {
      if (dirty){
        e.preventDefault();
        e.returnValue = '';
      }
    });
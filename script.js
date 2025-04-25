// Блок 1: Переключение темы
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');

if (savedTheme) body.classList.add(savedTheme);

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark-theme' : '');
});

// Блок 2: Основные обработчики DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // === Мобильное меню ===
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    function toggleMobileMenu(open) {
        mobileMenu.classList.toggle('hidden', !open);
        document.body.classList.toggle('menu-open', open);
        mobileMenuButton.setAttribute('aria-expanded', open);
        mobileMenu.setAttribute('aria-hidden', !open);
    }
    
    mobileMenuButton.addEventListener('click', () => toggleMobileMenu(true));
    closeMobileMenu.addEventListener('click', () => toggleMobileMenu(false));
    
    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });

    // === Выпадающие меню в мобильной версии ===
    document.querySelectorAll('.dropdown-mobile button').forEach(button => {
        button.addEventListener('click', function () {
            const menu = this.nextElementSibling;
            const icon = this.querySelector('i');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            menu.classList.toggle('hidden');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
            this.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // === Плавная прокрутка для якорных ссылок ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                
                if (history.pushState) {
                    history.pushState(null, null, href);
                } else {
                    location.hash = href;
                }
            }
        });
    });

    // === Обработка формы обратной связи ===
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const form = this;
            const formData = new FormData(form);
            
            fetch('/submit-feedback', {
                method: 'POST',
                body: formData
            }).then(response => {
                if (response.ok) {
                    form.reset();
                    alert('Ваше сообщение успешно отправлено!');
                }
            }).catch(error => {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при отправке сообщения');
            });
        });
    }
});

// Блок 3: Настройки доступности
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('accessibilityToggle');
    const menu = document.getElementById('accessibilityMenu');
    const fontSizeSelect = document.getElementById('fontSize');
    const colorSchemeSelect = document.getElementById('colorScheme');
    const fontFamilySelect = document.getElementById('fontFamily');
    const imagesOffCheckbox = document.getElementById('imagesOff');
    const resetButton = document.getElementById('resetSettings');

    // Показать/скрыть меню
    toggleButton.addEventListener('click', function(e) {
        e.preventDefault();
        menu.classList.toggle('hidden');
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && e.target !== toggleButton) {
            menu.classList.add('hidden');
        }
    });

    // Изменение размера шрифта
    fontSizeSelect.addEventListener('change', function() {
        document.body.classList.remove('large-text', 'very-large-text');
        switch(this.value) {
            case '20px':
                document.body.classList.add('large-text');
                break;
            case '24px':
                document.body.classList.add('very-large-text');
                break;
            default:
                document.body.style.fontSize = '';
        }
        saveSettings();
    });

    // Изменение цветовой схемы
    colorSchemeSelect.addEventListener('change', function() {
        document.body.classList.remove(
            'black-on-white', 
            'white-on-black', 
            'yellow-on-blue'
        );
        if (this.value !== 'default') {
            document.body.classList.add(this.value);
        }
        saveSettings();
    });

    // Изменение шрифта
    fontFamilySelect.addEventListener('change', function() {
        document.body.classList.remove('font-arial', 'font-times', 'font-courier');
        switch(this.value) {
            case "Arial, sans-serif":
                document.body.classList.add('font-arial');
                break;
            case "'Times New Roman', serif":
                document.body.classList.add('font-times');
                break;
            case "'Courier New', monospace":
                document.body.classList.add('font-courier');
                break;
        }
        saveSettings();
    });

    // Отключение изображений
    imagesOffCheckbox.addEventListener('change', function() {
        document.body.classList.toggle('images-off', this.checked);
        saveSettings();
    });

    // Сброс настроек
    resetButton.addEventListener('click', function() {
        fontSizeSelect.value = '16px';
        colorSchemeSelect.value = 'default';
        fontFamilySelect.value = "Arial, sans-serif";
        imagesOffCheckbox.checked = false;
        
        document.body.className = '';
        document.body.style.fontSize = '';
        localStorage.removeItem('accessibilitySettings');
    });

    // Сохранение и загрузка настроек
    function saveSettings() {
        const settings = {
            fontSize: fontSizeSelect.value,
            colorScheme: colorSchemeSelect.value,
            fontFamily: fontFamilySelect.value,
            imagesOff: imagesOffCheckbox.checked
        };
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('accessibilitySettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            fontSizeSelect.value = settings.fontSize;
            colorSchemeSelect.value = settings.colorScheme;
            fontFamilySelect.value = settings.fontFamily;
            imagesOffCheckbox.checked = settings.imagesOff;
            
            [fontSizeSelect, colorSchemeSelect, fontFamilySelect, imagesOffCheckbox]
                .forEach(el => el.dispatchEvent(new Event('change')));
        }
    }

    loadSettings();
});
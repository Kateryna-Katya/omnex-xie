document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. ICONS INITIALIZATION
    // ==========================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================
    // 2. LENIS SMOOTH SCROLL (Плавный скролл)
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ==========================================
    // 3. MOBILE MENU LOGIC
    // ==========================================
    const burgerBtn = document.querySelector('.header__burger');
    const headerNav = document.querySelector('.header__nav');
    const body = document.body;
    const navLinks = document.querySelectorAll('.header__link');
    const contactBtn = document.querySelector('.header__actions .btn'); // Кнопка в хедере

    // Функция переключения меню
    const toggleMenu = () => {
        if (!headerNav) return;
        
        const isActive = headerNav.classList.contains('header__nav--active');
        
        if (isActive) {
            headerNav.classList.remove('header__nav--active');
            body.style.overflow = ''; // Разблокируем скролл
        } else {
            headerNav.classList.add('header__nav--active');
            body.style.overflow = 'hidden'; // Блокируем скролл
        }
    };

    if (burgerBtn) {
        burgerBtn.addEventListener('click', toggleMenu);
    }

    // Закрываем меню при клике на любую ссылку навигации
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (headerNav && headerNav.classList.contains('header__nav--active')) {
                toggleMenu();
            }
        });
    });

    // Также закрываем при клике на кнопку "Начать сейчас" в мобильном меню
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
             if (headerNav && headerNav.classList.contains('header__nav--active')) {
                toggleMenu();
            }
        });
    }

    // ==========================================
    // 4. HERO ANIMATIONS (GSAP + SplitType)
    // ==========================================
    const heroTitleEl = document.querySelector('#hero-title');
    
    if (heroTitleEl && typeof gsap !== 'undefined' && typeof SplitType !== 'undefined') {
        // Разбиваем H1 на слова и буквы
        const heroTitle = new SplitType('#hero-title', { types: 'lines, chars' });
        
        // Создаем таймлайн
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(heroTitle.chars, {
            y: 100,       // Выезжают снизу
            opacity: 0,
            rotation: 5,  // Легкий поворот
            duration: 1,
            stagger: 0.02, // Задержка между появлением букв
            delay: 0.2    // Небольшая пауза перед стартом
        })
        .to('.hero__desc', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            onStart: () => gsap.set('.hero__desc', { y: 20 }) // Начальное смещение
        }, "-=0.6") // Запускаем чуть раньше окончания заголовка
        .to('.hero__actions', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            onStart: () => gsap.set('.hero__actions', { y: 20 })
        }, "-=0.6")
        .to('.hero__stats', {
            opacity: 1,
            duration: 0.8
        }, "-=0.4");
    }

// ==========================================
    // 5. HERO VISUAL (GSAP CINEMATIC REVEAL)
    // ==========================================
    const visualContainer = document.querySelector('.hero__visual--gsap');
    const visualImage = document.querySelector('.hero__img-target');
    const visualCurtain = document.querySelector('.hero__reveal-curtain');

    if (visualContainer && visualImage && visualCurtain) {
        
        // АНИМАЦИЯ ПОЯВЛЕНИЯ (Шторка + Зум)
        const tlVisual = gsap.timeline({ defaults: { ease: "power4.inOut" } });

        tlVisual
            // 1. Шторка уезжает вверх
            .to(visualCurtain, {
                height: 0,
                duration: 1.5,
                delay: 0.5
            })
            // 2. Картинка "отъезжает" (Zoom Out) одновременно со шторкой
            .to(visualImage, {
                scale: 1,
                duration: 2,
                ease: "power2.out"
            }, "-=1.5"); // Запускаем параллельно

        // АНИМАЦИЯ ПРИ ДВИЖЕНИИ МЫШИ (Parallax Tilt)
        visualContainer.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = visualContainer.getBoundingClientRect();
            // Вычисляем положение мыши относительно центра картинки (-1 до 1)
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            // Двигаем картинку
            gsap.to(visualImage, {
                x: x * 30, // Сдвиг по горизонтали (пиксели)
                y: y * 30, // Сдвиг по вертикали
                rotationY: x * 10, // Легкий поворот 3D
                rotationX: -y * 10,
                duration: 1,
                ease: "power2.out"
            });
        });

        // Возврат в центр при уходе мыши
        visualContainer.addEventListener('mouseleave', () => {
            gsap.to(visualImage, {
                x: 0,
                y: 0,
                rotationY: 0,
                rotationX: 0,
                duration: 1,
                ease: "power2.out"
            });
        });
    }
});
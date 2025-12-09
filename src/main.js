// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. ICONS & SCROLL INIT
    // ==========================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ==========================================
    // 2. MOBILE MENU
    // ==========================================
    const burgerBtn = document.querySelector('.header__burger');
    const headerNav = document.querySelector('.header__nav');
    const body = document.body;
    const navLinks = document.querySelectorAll('.header__link');
    const ctaBtn = document.querySelector('.header__actions .btn');

    const toggleMenu = () => {
        if (!headerNav) return;
        const isActive = headerNav.classList.contains('header__nav--active');
        if (isActive) {
            headerNav.classList.remove('header__nav--active');
            body.style.overflow = '';
        } else {
            headerNav.classList.add('header__nav--active');
            body.style.overflow = 'hidden';
        }
    };

    if (burgerBtn) burgerBtn.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', toggleMenu));
    if (ctaBtn) ctaBtn.addEventListener('click', toggleMenu);

    // ==========================================
    // 3. HERO ANIMATION (GSAP REVEAL)
    // ==========================================
    // Текст
    if (document.querySelector('#hero-title') && typeof SplitType !== 'undefined') {
        const heroTitle = new SplitType('#hero-title', { types: 'lines, chars' });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(heroTitle.chars, {
            y: 100, opacity: 0, rotation: 5, duration: 1, stagger: 0.02, delay: 0.2
        })
        .to('.hero__desc', { opacity: 1, y: 0, duration: 0.8, onStart: () => gsap.set('.hero__desc', { y: 20 }) }, "-=0.6")
        .to('.hero__actions', { opacity: 1, y: 0, duration: 0.8, onStart: () => gsap.set('.hero__actions', { y: 20 }) }, "-=0.6")
        .to('.hero__stats', { opacity: 1, duration: 0.8 }, "-=0.4");
    }

    // Изображение (Parallax + Reveal)
    const visualContainer = document.querySelector('.hero__visual--gsap');
    const visualImage = document.querySelector('.hero__img-target');
    const visualCurtain = document.querySelector('.hero__reveal-curtain');

    if (visualContainer && visualImage && visualCurtain) {
        const tlVisual = gsap.timeline({ defaults: { ease: "power4.inOut" } });
        tlVisual
            .to(visualCurtain, { height: 0, duration: 1.5, delay: 0.5 })
            .to(visualImage, { scale: 1, duration: 2, ease: "power2.out" }, "-=1.5");

        visualContainer.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = visualContainer.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            gsap.to(visualImage, {
                x: x * 30, y: y * 30, rotationY: x * 10, rotationX: -y * 10, duration: 1, ease: "power2.out"
            });
        });

        visualContainer.addEventListener('mouseleave', () => {
            gsap.to(visualImage, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 1, ease: "power2.out" });
        });
    }

    // ==========================================
    // 4. SCROLL ANIMATIONS (SECTIONS)
    // ==========================================
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        gsap.from(section.children, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%", // Старт анимации когда секция на 80% во вьюпорте
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        });
    });

    // ==========================================
    // 5. FORM HANDLING
    // ==========================================
    const form = document.getElementById('lead-form');
    const phoneInput = document.getElementById('phone');
    const captchaLabel = document.getElementById('captcha-label');
    const captchaInput = document.getElementById('captcha');
    const formMessage = document.getElementById('form-message');

    // Генерация капчи
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    if (captchaLabel) captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;

    // Валидация телефона (только цифры)
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Проверка капчи
            if (parseInt(captchaInput.value) !== (num1 + num2)) {
                formMessage.textContent = 'Ошибка: Неверный ответ на пример';
                formMessage.className = 'form-message error';
                return;
            }

            // Имитация отправки
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                form.reset();
                btn.textContent = originalText;
                btn.disabled = false;
                formMessage.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
                formMessage.className = 'form-message success';
                
                // Скрываем сообщение через 5 сек
                setTimeout(() => { formMessage.textContent = ''; }, 5000);
            }, 1500);
        });
    }

    // ==========================================
    // 6. COOKIE POPUP
    // ==========================================
    const cookiePopup = document.getElementById('cookie-popup');
    const cookieBtn = document.getElementById('cookie-accept');

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookiePopup.style.display = 'block';
            gsap.fromTo(cookiePopup, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
        }, 2000);
    }

    if (cookieBtn) {
        cookieBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            gsap.to(cookiePopup, { 
                y: 50, opacity: 0, duration: 0.5, 
                onComplete: () => { cookiePopup.style.display = 'none'; } 
            });
        });
    }
});
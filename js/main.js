/* ===========================
   AMKN Security Lab - Main JS
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initParticles();
    initScrollAnimations();
    initCounters();
    initMobileMenu();
    initApplyForm();
});

/* --- Navbar Scroll Effect --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        // Scrolled state
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

/* --- Hero Particles --- */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = 30;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.research-card, .pub-card, .stat-card, .contact-card, ' +
        '.professor-card, .recruit-card, .why-item, .section-header, .project-item'
    );

    animatedElements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/* --- Animated Counters --- */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.target);
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const update = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current) + '+';
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target + '+';
                        }
                    };
                    requestAnimationFrame(update);
                });
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(counter => observer.observe(counter));
}

/* --- Mobile Menu --- */
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
        toggle.classList.toggle('active');
    });

    // Close menu on link click
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.classList.remove('active');
        });
    });
}

/* --- Apply Form Modal --- */
function initApplyForm() {
    const modal = document.getElementById('applyModal');
    const openBtn = document.getElementById('openFormBtn');
    const closeBtn = document.getElementById('closeFormBtn');
    const form = document.getElementById('applyForm');
    const result = document.getElementById('formResult');

    if (!modal || !openBtn || !form) return;

    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = '전송 중...';
        result.className = 'form-result';
        result.style.display = 'none';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                result.textContent = '지원서가 성공적으로 전송되었습니다! 감사합니다.';
                result.className = 'form-result success';
                result.style.display = 'block';
                form.reset();
                setTimeout(closeModal, 2500);
            } else {
                throw new Error('전송 실패');
            }
        } catch (err) {
            result.textContent = '전송에 실패했습니다. hkim@swu.ac.kr로 직접 이메일을 보내주세요.';
            result.className = 'form-result error';
            result.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '지원서 보내기';
        }
    });
}

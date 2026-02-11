/* ============================================
   UPTRIX — PRESENTATION INTERACTIONS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Scroll-triggered Animations ──
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation slightly for multiple items
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
        el.dataset.delay = (index % 6) * 80; // Stagger within groups
        scrollObserver.observe(el);
    });

    // ── Navigation Dots (active state based on scroll) ──
    const sections = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.nav-dot');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navDots.forEach(dot => {
                    dot.classList.toggle('active', dot.dataset.section === sectionId);
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ── Smooth scroll for nav dots ──
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = dot.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Animated Counter for Result Numbers ──
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.counted) {
                entry.target.dataset.counted = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.result-number[data-target]').forEach(el => {
        counterObserver.observe(el);
    });

    function animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const suffix = element.dataset.suffix || '';
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(easeOut * target);

            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ── Parallax on Floating Orbs (subtle) ──
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                document.querySelectorAll('.floating-orb').forEach((orb, i) => {
                    const speed = (i + 1) * 0.03;
                    orb.style.transform = `translateY(${scrollY * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    // ── Hover tilt effect on cards ──
    document.querySelectorAll('.service-card, .about-card, .result-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;

            card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── Keyboard navigation ──
    let currentSection = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            currentSection = Math.min(currentSection + 1, sections.length - 1);
            sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            currentSection = Math.max(currentSection - 1, 0);
            sections[currentSection].scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Keep currentSection synced with scroll
    const syncObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(sections).indexOf(entry.target);
                if (index !== -1) currentSection = index;
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(s => syncObserver.observe(s));
});

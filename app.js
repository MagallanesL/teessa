/* ============================
   SIDEBAR NAVIGATION
============================ */
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.nav-link');

const isMobileView = () => window.matchMedia('(max-width: 1024px)').matches;

const syncSidebarState = () => {
    if (isMobileView()) {
        document.body.classList.remove('sidebar-hidden');
        document.body.classList.remove('sidebar-open');
        if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'false');
        return;
    }

    if (!document.body.classList.contains('sidebar-hidden')) {
        document.body.classList.add('sidebar-open');
    }
    if (sidebarToggle) {
        sidebarToggle.setAttribute(
            'aria-expanded',
            String(document.body.classList.contains('sidebar-open'))
        );
    }
};

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        if (isMobileView()) {
            document.body.classList.toggle('sidebar-open');
            sidebarToggle.setAttribute(
                'aria-expanded',
                String(document.body.classList.contains('sidebar-open'))
            );
            return;
        }

        document.body.classList.toggle('sidebar-hidden');
        document.body.classList.toggle('sidebar-open');
        sidebarToggle.setAttribute(
            'aria-expanded',
            String(document.body.classList.contains('sidebar-open'))
        );
    });
}

window.addEventListener('resize', syncSidebarState);
syncSidebarState();

/* ============================
   SMOOTH SCROLL
============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            event.preventDefault();

            if (this.classList.contains('nav-link')) {
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }

            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            if (isMobileView()) {
                document.body.classList.remove('sidebar-open');
                if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

/* ============================
   LINK ACTIVO SEGÚN SCROLL
============================ */
const navTargets = Array.from(navLinks)
    .map(link => {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) return null;
        const target = document.querySelector(href);
        if (!target) return null;
        return { link, target };
    })
    .filter(Boolean);

const setActiveLink = (activeLink) => {
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
        activeLink.classList.add('active');
    }
};

const updateActiveLink = () => {
    if (!navTargets.length) return;

    let activeTarget = navTargets[0];
    const focusLine = window.scrollY + (window.innerHeight * 0.35);
    const nearPageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;

    if (nearPageBottom) {
        setActiveLink(navTargets[navTargets.length - 1].link);
        return;
    }

    navTargets.forEach(item => {
        const targetTop = item.target.getBoundingClientRect().top + window.scrollY;
        if (targetTop <= focusLine) {
            activeTarget = item;
        }
    });

    setActiveLink(activeTarget?.link);
};

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

/* ============================
   SCROLL-TOP BUTTON
============================ */
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================
   ANIMACIÓN DE TARJETAS
============================ */
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});

/* ============================
   CONTADORES ANIMADOS
============================ */
const animateCounter = element => {
    const target = parseInt(element.getAttribute('data-target'));
    let current = 0;
    const increment = target / 120;

    const update = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    };

    update();
};

const statsSection = document.querySelector('.stats');

if (statsSection) {
    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-number').forEach(counter => {
                    if (counter.textContent === '0') {
                        animateCounter(counter);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

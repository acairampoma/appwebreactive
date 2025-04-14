/**
 * WorldReactive - Backend Biónico Edition
 * JavaScript optimizado para responsive design
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los componentes
    initNavigation();
    initScrollEffects();
    initHeroAnimations();
    initInterviewTabs();
    initAnimatedComponents();
    createCodeParticles();
    initResponsiveBehaviors();
    
    // Inicializar manualmente el menú móvil para asegurar que funcione
    initMobileMenu();
});

/**
 * Funcionalidad de navegación mejorada
 */
function initNavigation() {
    // Variables
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menú móvil con mejoras de accesibilidad
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            document.body.classList.toggle('mobile-menu-open');
            this.classList.toggle('active');
            
            // Accesibilidad: cambiar el aria-label según el estado
            const isOpen = document.body.classList.contains('mobile-menu-open');
            this.setAttribute('aria-label', isOpen ? 'Cerrar menú móvil' : 'Abrir menú móvil');
            this.setAttribute('aria-expanded', isOpen);
        });
    }
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (document.body.classList.contains('mobile-menu-open') && 
            !e.target.closest('.nav') && 
            !e.target.closest('.mobile-menu-btn')) {
            document.body.classList.remove('mobile-menu-open');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-label', 'Abrir menú móvil');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Desplazamiento suave para enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Cerrar menú móvil si está abierto
            document.body.classList.remove('mobile-menu-open');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-label', 'Abrir menú móvil');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
            
            // Obtener la sección objetivo
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Desplazamiento suave hasta el objetivo
                const offsetTop = targetSection.offsetTop;
                const headerHeight = header.offsetHeight;
                
                window.scrollTo({
                    top: offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Actualizar enlace activo
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
                
                // Actualizar URL sin recargar la página
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Efecto de desplazamiento para el encabezado
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Actualizar enlace de navegación activo según la posición de desplazamiento
        updateActiveNavOnScroll();
    });
    
    // Manejar la historia del navegador
    window.addEventListener('popstate', function() {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                const offsetTop = targetSection.offsetTop;
                const headerHeight = header.offsetHeight;
                
                window.scrollTo({
                    top: offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Actualizar enlace activo
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === hash) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
}

/**
 * Actualizar enlace de navegación activo según la posición de desplazamiento
 */
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 50; // Margen adicional
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSectionId = '#' + section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSectionId) {
            link.classList.add('active');
        }
    });
}

/**
 * Efectos basados en el desplazamiento con IntersectionObserver
 */
function initScrollEffects() {
    // Elementos a animar al desplazarse
    const elementsToAnimate = document.querySelectorAll(
        '.benefit-card, .layer, .portfolio-card, .question-answer, .contact-link'
    );
    
    // Verificar si el navegador admite reducción de movimiento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Si se prefiere reducir el movimiento, no animar
        return;
    }
    
    // IntersectionObserver para animaciones de desplazamiento
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Opcional: dejar de observar después de la animación
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar cada elemento
    elementsToAnimate.forEach(element => {
        observer.observe(element);
        // Agregar clase base de animación
        element.classList.add('animate-on-scroll');
    });
    
    // Agregar CSS para animaciones si aún no está en el archivo CSS
    if (!document.querySelector('#scroll-animations-css')) {
        const style = document.createElement('style');
        style.id = 'scroll-animations-css';
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .animate-on-scroll.animated {
                opacity: 1;
                transform: translateY(0);
            }
            
            @media (max-width: 768px) {
                .animate-on-scroll {
                    transform: translateY(15px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Animaciones de la sección hero
 */
function initHeroAnimations() {
    const bionicMan = document.querySelector('.bionic-man .bionic-card');
    const bionicWoman = document.querySelector('.bionic-woman .bionic-card');
    
    // Verificar si el navegador admite reducción de movimiento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Si se prefiere reducir el movimiento, no animar
        return;
    }
    
    if (bionicMan && bionicWoman) {
        // Agregar animación flotante
        bionicMan.style.animation = 'floatUpDown 4s ease-in-out infinite';
        bionicWoman.style.animation = 'floatUpDown 4s ease-in-out infinite 1s'; // Con retraso
        
        // Agregar efecto de brillo
        const addGlowEffect = (element) => {
            element.addEventListener('mouseover', () => {
                // Solo aplicar efectos en pantallas más grandes
                if (window.innerWidth > 768) {
                    element.style.animation = 'glow 2s infinite';
                }
            });
            
            element.addEventListener('mouseout', () => {
                element.style.animation = 'floatUpDown 4s ease-in-out infinite';
            });
        };
        
        addGlowEffect(bionicMan);
        addGlowEffect(bionicWoman);
        
        // Añadir efecto de partículas para simular código
        const addParticleEffects = () => {
            const particles = document.querySelectorAll('.code-particles');
            if (particles.length > 0) {
                createCodeParticles();
            }
        };
        
        // Iniciar efectos de partículas
        addParticleEffects();
        
        // Optimizaciones responsive
        window.addEventListener('resize', () => {
            // Desactivar animaciones en pantallas pequeñas
            if (window.innerWidth <= 768) {
                bionicMan.style.animation = 'none';
                bionicWoman.style.animation = 'none';
            } else {
                bionicMan.style.animation = 'floatUpDown 4s ease-in-out infinite';
                bionicWoman.style.animation = 'floatUpDown 4s ease-in-out infinite 1s';
            }
        });
    }
}
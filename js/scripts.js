/**
 * WorldReactive - Backend Biónico Edition
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initHeroAnimations();
    initInterviewTabs();
    initAnimatedComponents();
    createCodeParticles();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    // Variables
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            document.body.classList.toggle('mobile-menu-open');
            this.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            document.body.classList.remove('mobile-menu-open');
            mobileMenuBtn.classList.remove('active');
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to target
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
                
                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavOnScroll();
    });
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
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
 * Scroll-based animations and effects
 */
function initScrollEffects() {
    // Elements to animate on scroll
    const elementsToAnimate = document.querySelectorAll(
        '.benefit-card, .layer, .portfolio-card, .question-answer, .contact-link'
    );
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe each element
    elementsToAnimate.forEach(element => {
        observer.observe(element);
        // Add base animation class
        element.classList.add('animate-on-scroll');
    });
    
    // Add CSS for animations if not already in the CSS file
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
        `;
        document.head.appendChild(style);
    }
}

/**
 * Hero section animations
 */
function initHeroAnimations() {
    const bionicMan = document.querySelector('.bionic-man');
    const bionicWoman = document.querySelector('.bionic-woman');
    
    if (bionicMan && bionicWoman) {
        // Add floating animation
        bionicMan.style.animation = 'floatUpDown 4s ease-in-out infinite';
        bionicWoman.style.animation = 'floatUpDown 4s ease-in-out infinite 1s'; // With delay
        
        // Add glow effect
        const addGlowEffect = (element) => {
            element.addEventListener('mouseover', () => {
                element.style.animation = 'glow 2s infinite';
            });
            
            element.addEventListener('mouseout', () => {
                element.style.animation = 'floatUpDown 4s ease-in-out infinite';
            });
        };
        
        addGlowEffect(bionicMan);
        addGlowEffect(bionicWoman);
    }
}

/**
 * Interview section tab functionality
 */
function initInterviewTabs() {
    const levelTabs = document.querySelectorAll('.level-tab');
    const levelContents = document.querySelectorAll('.level-content');
    
    if (levelTabs.length && levelContents.length) {
        levelTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                levelTabs.forEach(t => t.classList.remove('active'));
                levelContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
                const targetLevel = tab.getAttribute('data-level');
                const targetContent = document.getElementById(`${targetLevel}-content`);
                
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
}

/**
 * Animate various components
 */
function initAnimatedComponents() {
    // Highlight elements
    const highlightElements = document.querySelectorAll('.highlight');
    
    highlightElements.forEach(element => {
        element.style.position = 'relative';
        
        // Add subtle animation
        element.addEventListener('mouseover', () => {
            element.style.transition = 'all 0.3s ease';
            element.style.textShadow = '0 0 15px rgba(156, 39, 176, 0.5), 0 0 30px rgba(33, 150, 243, 0.5)';
        });
        
        element.addEventListener('mouseout', () => {
            element.style.textShadow = 'none';
        });
    });
    
    // Add hover effects to components
    const components = document.querySelectorAll('.component');
    
    components.forEach(component => {
        component.addEventListener('mouseover', () => {
            component.style.transform = 'translateY(-5px)';
            component.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
        
        component.addEventListener('mouseout', () => {
            component.style.transform = 'translateY(0)';
            component.style.boxShadow = 'none';
        });
    });
}

/**
 * Create floating code particles in the hero section
 */
function createCodeParticles() {
    const codeParticles = document.querySelectorAll('.code-particles');
    
    if (codeParticles.length === 0) return;
    
    // Code snippets for particles
    const codeSnippets = [
        'Mono<ResponseEntity<T>>',
        'Flux<ServerSentEvent<T>>',
        'Publisher<T>',
        'return Mono.just(data)',
        '.flatMap()',
        '.subscribe()',
        '.onErrorResume()',
        'Optional<T>',
        'CompletableFuture<T>',
        '@Async',
        'WebClient',
        'R2DBC',
        'ReactiveMongoTemplate',
        'WebFlux',
        'RouterFunction<T>',
        '@ReactiveTransactional'
    ];
    
    // Create particles
    codeParticles.forEach(container => {
        // Add CSS if not already there
        if (!document.querySelector('#code-particles-css')) {
            const style = document.createElement('style');
            style.id = 'code-particles-css';
            style.textContent = `
                .code-particle {
                    position: absolute;
                    color: rgba(255, 255, 255, 0.7);
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    pointer-events: none;
                    white-space: nowrap;
                    text-shadow: 0 0 5px rgba(156, 39, 176, 0.7), 0 0 10px rgba(33, 150, 243, 0.7);
                    opacity: 0;
                    transform: translateY(0);
                    animation: floatUp 5s linear forwards;
                }
                
                @keyframes floatUp {
                    0% {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    10% {
                        opacity: 0.7;
                    }
                    90% {
                        opacity: 0.7;
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-100px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create particles on interval
        let particleCount = 0;
        const maxParticles = 30;
        
        const createParticle = () => {
            if (particleCount >= maxParticles) return;
            
            const particle = document.createElement('div');
            particle.classList.add('code-particle');
            
            // Random position
            const left = Math.random() * 100;
            particle.style.left = `${left}%`;
            particle.style.animationDuration = `${5 + Math.random() * 5}s`;
            
            // Random code snippet
            const snippetIndex = Math.floor(Math.random() * codeSnippets.length);
            particle.textContent = codeSnippets[snippetIndex];
            
            container.appendChild(particle);
            particleCount++;
            
            // Remove particle after animation
            setTimeout(() => {
                container.removeChild(particle);
                particleCount--;
            }, 10000);
        };
        
        // Create particles periodically
        setInterval(createParticle, 300);
    });
}

/**
 * Initialize the mid, senior, and tech lead interview content
 * with placeholder content (would be replaced with real content)
 */
window.addEventListener('load', function() {
    // Mid-level content
    const midContent = document.getElementById('mid-content');
    if (midContent) {
        midContent.innerHTML = `
            <div class="question-answer">
                <div class="question">Explica qué es la contrapresión (backpressure) y cómo se gestiona en sistemas reactivos</div>
                <div class="answer">La contrapresión es un mecanismo que permite a los consumidores comunicar a los productores cuánta carga pueden manejar, evitando la sobrecarga. En sistemas reactivos se implementa mediante estrategias como throttling, buffering, dropping o expanding para mantener el sistema estable bajo cargas variables.</div>
            </div>
            <div class="question-answer">
                <div class="question">¿Cuáles son las diferencias entre Mono y Flux en Project Reactor?</div>
                <div class="answer">Mono representa una fuente asíncrona de 0 o 1 elemento, mientras que Flux representa una fuente asíncrona de 0 a N elementos. Mono se utiliza para operaciones que retornan a lo sumo un resultado (como una búsqueda por ID), mientras que Flux para colecciones o streams continuos.</div>
            </div>
            <div class="question-answer">
                <div class="question">Explica el patrón Circuit Breaker y su implementación con Resilience4j</div>
                <div class="answer">El patrón Circuit Breaker evita intentos repetidos de operaciones con fallos, protegiéndolas con un "interruptor" que se abre tras ciertos fallos consecutivos. Resilience4j proporciona una implementación no bloqueante compatible con programación reactiva, con estados CLOSED, OPEN y HALF-OPEN para gestionar la recuperación gradual.</div>
            </div>
        `;
    }
    
    // Senior content
    const seniorContent = document.getElementById('senior-content');
    if (seniorContent) {
        seniorContent.innerHTML = `
            <div class="question-answer">
                <div class="question">Discute los tradeoffs entre consistencia eventual y consistencia fuerte en sistemas distribuidos</div>
                <div class="answer">La consistencia fuerte garantiza que todas las réplicas muestren los mismos datos pero sacrifica disponibilidad y latencia. La consistencia eventual ofrece alta disponibilidad y baja latencia pero permite divergencias temporales. El teorema CAP establece que en presencia de particiones de red, debemos elegir entre consistencia y disponibilidad, siendo la consistencia eventual ideal para sistemas donde la velocidad es prioritaria.</div>
            </div>
            <div class="question-answer">
                <div class="question">¿Cómo implementarías un sistema de procesamiento de eventos con garantía exactly-once?</div>
                <div class="answer">Para garantizar exactly-once se necesita: 1) Deduplicación mediante IDs únicos y un almacén de idempotencia; 2) Transacciones distribuidas o el patrón Outbox que registra eventos en la misma transacción que los cambios de estado; 3) Confirmaciones explícitas después del procesamiento exitoso; 4) Procesamiento atómico con operaciones que pueden reiniciarse. Kafka Streams y Flink ofrecen primitivas para esto.</div>
            </div>
            <div class="question-answer">
                <div class="question">Explica cómo diseñarías un sistema reactivo con alta disponibilidad y baja latencia a escala global</div>
                <div class="answer">Un sistema reactivo global de alta disponibilidad requiere: 1) Arquitectura multiregión con replicación geográfica; 2) Consistencia eventual con reconciliación de conflictos tipo CRDT/OT; 3) Enrutamiento inteligente utilizando latencia y localidad; 4) Caché distribuida con invalidación eficiente; 5) Observabilidad completa; 6) Degradación elegante mediante Circuit Breaker y Bulkhead; 7) Estrategias de recuperación automática con self-healing.</div>
            </div>
        `;
    }
    
    // Tech Lead content
    const leadContent = document.getElementById('lead-content');
    if (leadContent) {
        leadContent.innerHTML = `
            <div class="question-answer">
                <div class="question">¿Cómo evolucionar una arquitectura monolítica a reactiva sin interrumpir el servicio?</div>
                <div class="answer">La evolución requiere: 1) Strangler Pattern, encapsulando progresivamente funcionalidades en servicios reactivos; 2) API Gateway como punto de entrada unificado; 3) Adaptadores para comunicación entre componentes nuevos y legados; 4) Doble escritura y lectura durante la migración con reconciliación; 5) Feature Flags para control granular; 6) Monitoreo exhaustivo; 7) Rollback automatizado ante degradación; 8) Migración de datos gradual con esquemas compatibles.</div>
            </div>
            <div class="question-answer">
                <div class="question">¿Cuáles son los errores arquitectónicos más críticos que has observado en sistemas reactivos?</div>
                <div class="answer">Los errores críticos incluyen: 1) Blocking code en operaciones reactivas que paraliza el event loop; 2) Manejo incorrecto de backpressure causando OutOfMemoryError; 3) Hot vs Cold publishers mal utilizados; 4) Operadores de fusión incorrectos (flatMap vs concatMap); 5) Suscripciones huérfanas que causan memory leaks; 6) Error handling incompleto sin fallbacks adecuados; 7) Testing inadecuado que no considera aspectos asíncronos; 8) Sobreingeniería reactiva donde no se justifica el overhead.</div>
            </div>
            <div class="question-answer">
                <div class="question">Como líder técnico, ¿cómo evaluarías si un sistema debe ser implementado con arquitectura reactiva?</div>
                <div class="answer">La evaluación debe considerar: 1) Patrones de tráfico (picos, concurrencia); 2) Requisitos de latencia y throughput; 3) Número de conexiones simultáneas; 4) Operaciones intensivas en I/O vs CPU; 5) Complejidad del equipo y curva de aprendizaje; 6) Necesidades de escalabilidad y elasticidad; 7) Presupuesto para infraestructura; 8) SLAs y tolerancia a fallos; 9) Integración con sistemas externos; 10) Mantenibilidad a largo plazo. Es esencial un PoC para validar beneficios tangibles versus la complejidad adicional.</div>
            </div>
        `;
    }
});

/**
 * Preload images to avoid visual jumps
 */
function preloadImages() {
    // Array of image paths to preload
    const imagePaths = [
        // Add paths to the images when they are available
        // 'assets/img/hombre-bionico.png',
        // 'assets/img/mujer-bionica.png',
        // 'assets/img/frustrados-before.png',
        // 'assets/img/bionicos-after.png',
        // 'assets/img/logos-java-python.png'
    ];
    
    // Preload each image
    imagePaths.forEach(path => {
        const img = new Image();
        img.src = path;
    });
}

/**
 * Add dark mode toggle functionality
 * This is a bonus feature that can be implemented later
 */
function initDarkModeToggle() {
    // Create the toggle button
    const darkModeToggle = document.createElement('button');
    darkModeToggle.classList.add('dark-mode-toggle');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(darkModeToggle);
    
    // Add CSS for the toggle button
    if (!document.querySelector('#dark-mode-css')) {
        const style = document.createElement('style');
        style.id = 'dark-mode-css';
        style.textContent = `
            .dark-mode-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--color-primary-dark), var(--color-secondary-dark));
                color: var(--color-text-primary);
                border: none;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                transition: all 0.3s ease;
            }
            
            .dark-mode-toggle:hover {
                transform: scale(1.1);
            }
            
            body.light-mode {
                --color-background: #f5f5f5;
                --color-dark: #ffffff;
                --color-dark-light: #f0f0f0;
                --color-card-bg: #ffffff;
                --color-text-primary: #212121;
                --color-text-secondary: #757575;
                --color-border: #e0e0e0;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Toggle dark/light mode
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        // Update icon
        if (document.body.classList.contains('light-mode')) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

/**
 * Initialize performance monitoring (for future use)
 */
function initPerformanceMonitoring() {
    if (window.performance && window.performance.mark) {
        // Mark the point when page becomes interactive
        window.addEventListener('DOMContentLoaded', () => {
            window.performance.mark('dom-interactive');
        });
        
        // Mark the point when page is fully loaded
        window.addEventListener('load', () => {
            window.performance.mark('page-loaded');
            window.performance.measure('page-load-time', 'navigationStart', 'page-loaded');
            
            const pageLoadTime = window.performance.getEntriesByName('page-load-time')[0].duration;
            console.log(`Page loaded in ${pageLoadTime.toFixed(2)}ms`);
        });
    }
}

// Initialize additional features
window.addEventListener('load', function() {
    // Uncomment when ready to use
    // preloadImages();
    // initDarkModeToggle();
    // initPerformanceMonitoring();
});
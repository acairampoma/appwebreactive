document.addEventListener('DOMContentLoaded', function() {
    // Función para inicializar las pestañas (asegurando que solo Junior esté activo)
    function initializeTabs() {
        const allTabs = document.querySelectorAll('.level-tab');
        const allContents = document.querySelectorAll('.level-content');
        
        // Desactivar todas las pestañas primero
        allTabs.forEach(tab => tab.classList.remove('active'));
        allContents.forEach(content => content.classList.remove('active'));
        
        // Activar solo la pestaña Junior y su contenido
        const juniorTab = document.querySelector('.level-tab[data-level="junior"]');
        const juniorContent = document.getElementById('junior-content');
        
        if (juniorTab) juniorTab.classList.add('active');
        if (juniorContent) juniorContent.classList.add('active');
    }
    
    // Inicializar las pestañas inmediatamente
    initializeTabs();
    
    // Obtener elementos del DOM
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    const levelTabs = document.querySelectorAll('.level-tab');
    const levelContents = document.querySelectorAll('.level-content');
    
    // Verificar que los elementos existan antes de agregar los eventos
    if (!hamburger || !menu || !backdrop) return;
    
    // Manejar el clic en el botón hamburguesa
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
        backdrop.classList.toggle('active');
    });
    
    // Manejar el clic en el backdrop
    backdrop.addEventListener('click', function() {
        hamburger.classList.remove('active');
        menu.classList.remove('active');
        backdrop.classList.remove('active');
    });
    
    // Manejar el clic en los enlaces del menú
    const menuLinks = document.querySelectorAll('#menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
            backdrop.classList.remove('active');
        });
    });

    // Event listeners para las pestañas
    levelTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const level = tab.getAttribute('data-level');

            // Asegurarse de que solo una pestaña quede activa
            levelTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Mostrar solo el contenido del tab activo
            levelContents.forEach(content => {
                content.style.display = 'none';
            });
            const activeContent = document.getElementById(`${level}-content`);
            if (activeContent) {
                activeContent.style.display = 'block';
            }

            // Asegurarse de que la pestaña de píldoras solo se active cuando se hace clic en ella
            if (level !== 'pills') {
                const pillsTab = document.querySelector('.level-tab[data-level="pills"]');
                if (pillsTab) pillsTab.classList.remove('active');
            }
        });
    });

    // Añadir listeners a los botones de entrenamiento (entrena-pill)
    const entrenaPills = document.querySelectorAll('.entrena-pill');
    entrenaPills.forEach(btn => {
        btn.addEventListener('click', function() {
            const nivel = btn.getAttribute('data-entrena-level');
            // Primer tema por defecto
            const tema = 'Programación Funcional';
            window.location.href = `pregunta.html?nivel=${encodeURIComponent(nivel)}&tema=${encodeURIComponent(tema)}`;
        });
    });
});
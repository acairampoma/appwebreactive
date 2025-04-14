document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // Obtener elementos del DOM
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    
    console.log("Hamburger element:", hamburger);
    console.log("Menu element:", menu);
    console.log("Backdrop element:", backdrop);
    
    // Verificar que los elementos existan antes de agregar los eventos
    if (!hamburger || !menu || !backdrop) {
        console.error("One or more elements not found!");
        return;
    }
    
    // Manejar el clic en el botón hamburguesa
    hamburger.addEventListener('click', function(e) {
        console.log("Hamburger clicked!");
        e.preventDefault();
        
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
        backdrop.classList.toggle('active');
        
        console.log("Menu active:", menu.classList.contains('active'));
    });
    
    // Manejar el clic en el backdrop
    backdrop.addEventListener('click', function() {
        console.log("Backdrop clicked!");
        
        hamburger.classList.remove('active');
        menu.classList.remove('active');
        backdrop.classList.remove('active');
    });
    
    // Manejar el clic en los enlaces del menú
    const menuLinks = document.querySelectorAll('#menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log("Menu link clicked!");
            
            hamburger.classList.remove('active');
            menu.classList.remove('active');
            backdrop.classList.remove('active');
        });
    });
});
// Temas de las píldoras (puedes modificar o cargar dinámicamente si lo deseas)
const temasPildoras = [
    "Programación Funcional",
    "Interfaces Funcionales",
    "Tipos de Patrones",
    "Principios SOLID",
    "Programación Reactiva",
    "Tipos de Reactividad",
    "R2DBC",
    "Manejo de Errores"
];

// Obtener parámetros de la URL
function getParamFromURL(nombre, def) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nombre) || def;
}

// Inicializar la página cuando cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, iniciando configuración...');
    
    // Llenar combo de temas
    const temaCombo = document.getElementById('tema-combo');
    if (!temaCombo) {
        console.error('Error: No se encontró el elemento con id \'tema-combo\'');
        return;
    }
    
    // Agrega opción por defecto
    const optDefault = document.createElement('option');
    optDefault.value = '';
    optDefault.textContent = '••• Selecciona un tema para comenzar •••';
    optDefault.disabled = true;
    optDefault.selected = true;
    temaCombo.appendChild(optDefault);
    
    // Agregar los temas disponibles
    temasPildoras.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        temaCombo.appendChild(opt);
    });

    // Tomar nivel solo del parámetro
    const nivel = getParamFromURL('nivel', 'junior');
    console.log('Nivel detectado:', nivel);
    
    // Mostrar el nivel en el título desde el inicio
    const tituloElement = document.getElementById('nivel-titulo');
    const destacadoElement = document.getElementById('nivel-destacado');
    
    if (tituloElement) {
        tituloElement.textContent = 'Entrenemos juntos';
    } else {
        console.error('Error: No se encontró el elemento con id \'nivel-titulo\'');
    }
    
    if (destacadoElement) {
        destacadoElement.textContent = ` - Nivel ${nivel.charAt(0).toUpperCase() + nivel.slice(1)}`;
    } else {
        console.error('Error: No se encontró el elemento con id \'nivel-destacado\'');
    }
    
    // Cambiar preguntas al cambiar combo de tema
    temaCombo.addEventListener('change', function() {
        console.log('Tema seleccionado:', this.value);
        if (this.value) {
            mostrarPreguntasTemaNivel(this.value, nivel);
        } else {
            const preguntasContainer = document.getElementById('preguntas-lista');
            if (preguntasContainer) {
                preguntasContainer.innerHTML = '';
            }
        }
    });

    // Inicial: mostrar mensaje de bienvenida
    const preguntasContainer = document.getElementById('preguntas-lista');
    if (preguntasContainer) {
        preguntasContainer.innerHTML = `
            <div style="text-align: center; margin-top: 2rem;">
                <i class="fas fa-arrow-up" style="font-size: 2rem; color: var(--color-primary); margin-bottom: 1rem;"></i>
                <p>Selecciona un tema para comenzar tu entrenamiento</p>
            </div>
        `;
    } else {
        console.error('Error: No se encontró el elemento con id \'preguntas-lista\'');
    }
});

// Mostrar preguntas según tema y nivel y cantidad por nivel (carga dinámica desde JSON)
async function mostrarPreguntasTemaNivel(tema, nivel) {
    console.log(`Mostrando preguntas para tema: ${tema}, nivel: ${nivel}`);
    
    // Verificar que los elementos existan antes de modificarlos
    const tituloElement = document.getElementById('nivel-titulo');
    const preguntasContainer = document.getElementById('preguntas-lista');
    
    if (!preguntasContainer) {
        console.error('Error: No se encontró el contenedor de preguntas');
        return;
    }
    
    // Mostrar un spinner mientras se cargan las preguntas
    preguntasContainer.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Cargando preguntas...</p>
        </div>
    `;
    
    // Actualizar título con formato mejorado
    if (tituloElement) {
        tituloElement.textContent = `Entrenemos juntos - ${tema} | Nivel: ${nivel.charAt(0).toUpperCase() + nivel.slice(1)}`;
    }
    
    let preguntas = [];
    // Normaliza nombre del archivo
    let archivo = tema.toLowerCase().replace(/ /g, '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Ruta relativa desde pages/pregunta.html a la carpeta preguntas
    archivo = `../preguntas/preguntas_${archivo}.json`;
    
    console.log(`Intentando cargar: ${archivo}`);
    
    // Mostrar indicador de carga
    if (preguntasContainer) {
        preguntasContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div class="loading-spinner" style="display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(156, 39, 176, 0.3); border-radius: 50%; border-top-color: var(--color-primary); animation: spin 1s ease-in-out infinite;"></div>
                <p style="margin-top: 1rem;">Cargando preguntas...</p>
            </div>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
        `;
    } else {
        console.error('Error: No se encontró el elemento con id \'preguntas-lista\'');
        return; // No continuar si no hay donde mostrar las preguntas
    }
    
    try {
        // Con el servidor local, ahora podemos usar fetch normalmente
        console.log('Intentando cargar:', archivo);
        
        // Mapa para convertir nombres de temas a nombres de archivos
        // Basado en los archivos reales que existen en la carpeta
        const mapaArchivos = {
            'Programación Funcional': 'funcional',
            'Interfaces Funcionales': 'interfaces',
            'Tipos de Patrones': 'patrones',
            'Principios SOLID': 'solid',
            'Programación Reactiva': 'reactiva',
            'Tipos de Reactividad': 'reactividad',
            'R2DBC': 'r2dbc',
            'Manejo de Errores': 'errores'
        };
        
        // Obtener el nombre de archivo basado en el tema
        const nombreArchivo = mapaArchivos[tema] || tema.toLowerCase().replace(/\s+/g, '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        let urlFetch = `/preguntas/preguntas_${nombreArchivo}.json`;
        console.log('URL de fetch:', urlFetch);
        console.log('Ruta completa desde la raiz:', window.location.origin + urlFetch);
        
        // Intentar cargar desde el servidor local
        const resp = await fetch(urlFetch);
        if (!resp.ok) {
            throw new Error(`No se pudo cargar el archivo de preguntas: ${urlFetch}`);
        }
        
        const data = await resp.json();
        console.log('Datos cargados:', data);
        
        // Si tenemos un array directamente, usarlo
        if (Array.isArray(data)) {
            preguntas = data;
            console.log(`Usando array de preguntas. Total: ${preguntas.length}`);
        } else if (data[nivel]) {
            // Si tenemos un objeto con niveles, usar el nivel adecuado
            preguntas = data[nivel];
            console.log(`Usando preguntas del nivel ${nivel}. Total: ${preguntas.length}`);
        }
    } catch (e) {
        console.error('Error al cargar preguntas:', e);
        if (preguntasContainer) {
            preguntasContainer.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 2rem; color: #f44336;">
                    <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <p>No hay preguntas disponibles para este tema y nivel.</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem; color: #888;">Error: ${e.message}</p>
                </div>
            `;
        }
        return;
    }
    if (!preguntas || preguntas.length === 0) {
        if (preguntasContainer) {
            preguntasContainer.innerHTML = `
                <div class="empty-message" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-info-circle" style="font-size: 2rem; color: var(--color-secondary); margin-bottom: 1rem;"></i>
                    <p>No hay preguntas para este tema y nivel.</p>
                </div>
            `;
        }
        return;
    }
    // Cantidad por nivel según lo especificado
    let cantidad = 5; // Valor predeterminado para cachimbo
    if (nivel === 'junior') cantidad = 10;
    else if (nivel === 'medium') cantidad = 15;
    else if (nivel === 'senior') cantidad = 20;
    
    // Mostrar el nivel y cantidad en la consola para depuración
    console.log(`Nivel: ${nivel}, Cantidad de preguntas: ${cantidad}`);
    
    // Tomar preguntas aleatorias
    let preguntasAleatorias = [];
    if (preguntas.length <= cantidad) {
        preguntasAleatorias = preguntas; // Si hay menos preguntas que la cantidad deseada, usar todas
        console.log(`Solo hay ${preguntas.length} preguntas disponibles para este tema y nivel`);
    } else {
        // Crear copia del array original para no modificarlo
        const preguntasCopia = [...preguntas];
        // Seleccionar aleatoriamente la cantidad necesaria
        for (let i = 0; i < cantidad; i++) {
            const indiceAleatorio = Math.floor(Math.random() * preguntasCopia.length);
            preguntasAleatorias.push(preguntasCopia.splice(indiceAleatorio, 1)[0]);
        }
    }
    
    // Crear estructura HTML para mostrar las preguntas con opciones de respuesta
    let preguntasHTML = '<div class="preguntas-container">';
    
    // Añadir contador y resumen de preguntas
    preguntasHTML += `
        <div class="preguntas-resumen">
            <div class="pregunta-contador">
                <span class="nivel-badge">${nivel.charAt(0).toUpperCase() + nivel.slice(1)}</span>
                <span class="contador-texto">${preguntasAleatorias.length} preguntas para responder</span>
            </div>
            <div class="progreso-contenedor">
                <div class="progreso-barra" style="width: 0%"></div>
            </div>
        </div>
    `;
    
    // Generar cada pregunta con sus opciones
    preguntasAleatorias.forEach((pregunta, index) => {
        // Adaptar a la estructura del JSON donde 'q' es la pregunta y 'o' son las opciones
        const preguntaTexto = pregunta.q || pregunta.pregunta;
        const opciones = pregunta.o || pregunta.opciones || [];
        const respuestaCorrecta = pregunta.a;
        
        preguntasHTML += `
            <div class="pregunta-card" id="pregunta-${index}" data-respuesta-correcta="${respuestaCorrecta}">
                <div class="pregunta-numero">Pregunta ${index + 1} de ${preguntasAleatorias.length}</div>
                <div class="pregunta-texto">${preguntaTexto}</div>
        `;
        
        // Si hay opciones, mostrarlas como radio buttons
        if (opciones && opciones.length > 0) {
            preguntasHTML += '<div class="opciones-lista">';
            opciones.forEach((opcion, opIndex) => {
                preguntasHTML += `
                    <div class="opcion-item">
                        <label class="opcion-label">
                            <input type="radio" name="pregunta-${index}" value="${opIndex}" data-respuesta-index="${index}" data-opcion-index="${opIndex}">
                            <span class="opcion-texto">${opcion}</span>
                        </label>
                    </div>
                `;
            });
            preguntasHTML += '</div>';
        } else {
            // Si no hay opciones, mostrar un campo de texto para respuesta libre
            preguntasHTML += `
                <div class="respuesta-libre">
                    <textarea placeholder="Escribe tu respuesta aquí..." class="respuesta-texto" data-respuesta-index="${index}"></textarea>
                </div>
            `;
        }
        
        preguntasHTML += '</div>';
    });
    
    // Añadir botón para verificar respuestas
    preguntasHTML += `
        <div class="btn-container">
            <button id="verificar-btn" class="verificar-btn">Verificar Respuestas</button>
        </div>
    </div>
    `;
    
    // Actualizar el contenido en el DOM
    if (preguntasContainer) {
        preguntasContainer.innerHTML = preguntasHTML;
        console.log('Preguntas cargadas en el DOM.');
        
        // Agregar event listener para el botón de verificar respuestas
        const verificarBtn = document.getElementById('verificar-btn');
        if (verificarBtn) {
            verificarBtn.addEventListener('click', function() {
                console.log('Botón de verificar respuestas clickeado');
                verificarRespuestas(preguntasAleatorias, nivel);
            });
        }
    } else {
        // Si no hay opciones, mostrar un campo de texto para respuesta libre
        preguntasHTML += `
            <div class="respuesta-libre">
                <textarea placeholder="Escribe tu respuesta aquí..." class="respuesta-texto" data-respuesta-index="${index}"></textarea>
            </div>
        `;
    }
        
    preguntasHTML += '</div>';
});
    
// Añadir botón para verificar respuestas
preguntasHTML += `
    <div class="btn-container">
        <button id="verificar-btn" class="verificar-btn">Verificar Respuestas</button>
    </div>
</div>
`;
    
// Actualizar el contenido en el DOM
if (preguntasContainer) {
    preguntasContainer.innerHTML = preguntasHTML;
    console.log('Preguntas cargadas en el DOM.');
        
    // Agregar event listener para el botón de verificar respuestas
    const verificarBtn = document.getElementById('verificar-btn');
    if (verificarBtn) {
        verificarBtn.addEventListener('click', function() {
            console.log('Botón de verificar respuestas clickeado');
            verificarRespuestas(preguntasAleatorias, nivel);
        });
    }
} else {
    console.error('Error: No se encontró el elemento para mostrar las preguntas');
}

// Función para verificar respuestas
function verificarRespuestas(preguntas, nivel) {
    const respuestasCorrectas = [];
    const respuestasIncorrectas = [];
        
    // Recorrer cada pregunta y verificar la respuesta
    preguntas.forEach((pregunta, index) => {
        const preguntaElement = document.getElementById(`pregunta-${index}`);
        // El índice de respuesta correcta está en la pregunta, no en el elemento HTML
        const respuestaCorrecta = parseInt(pregunta.a);
            
        // Verificar si la pregunta tiene opciones o es de respuesta libre
        const opciones = pregunta.o || pregunta.opciones || [];
        if (opciones && opciones.length > 0) {
            // Verificar la opción seleccionada
            const opcionSeleccionada = preguntaElement.querySelector('input[type="radio"]:checked');
            if (opcionSeleccionada) {
                const opcionIndex = parseInt(opcionSeleccionada.getAttribute('data-opcion-index'));
                if (opcionIndex === respuestaCorrecta) {
                    respuestasCorrectas.push(index);
                    // Marcar visualmente la respuesta correcta
                    opcionSeleccionada.parentNode.classList.add('respuesta-correcta');
                } else {
                    respuestasIncorrectas.push(index);
                    // Marcar visualmente la respuesta incorrecta
                    opcionSeleccionada.parentNode.classList.add('respuesta-incorrecta');
                    // Marcar también la respuesta correcta para que sepa cuál era
                    const opcionCorrecta = preguntaElement.querySelector(`input[data-opcion-index="${respuestaCorrecta}"]`);
                    if (opcionCorrecta) {
                        opcionCorrecta.parentNode.classList.add('era-correcta');
                    }
                }
            } else {
                respuestasIncorrectas.push(index);
                // No seleccionó nada, marcar la correcta
                const opcionCorrecta = preguntaElement.querySelector(`input[data-opcion-index="${respuestaCorrecta}"]`);
                if (opcionCorrecta) {
                    opcionCorrecta.parentNode.classList.add('era-correcta');
                }
            }
        } else {
            // Verificar la respuesta libre (texto)
            const respuestaLibre = preguntaElement.querySelector('.respuesta-texto').value.trim();
            if (respuestaLibre === respuestaCorrecta) {
                respuestasCorrectas.push(index);
            } else {
                respuestasIncorrectas.push(index);
            }
        }
    });
        
    // Calcular porcentaje de acierto
    const porcentajeAcierto = (respuestasCorrectas.length / preguntas.length) * 100;
    console.log(`Porcentaje de acierto: ${porcentajeAcierto}%`);
        
    // Si tiene más del 70% de aciertos, es éxito, sino es para mejorar
    const esExito = porcentajeAcierto >= 70;
        
    if (esExito) {
        // Mostrar mensaje de éxito celebratorio con SweetAlert2
        Swal.fire({
            title: '¡Felicitaciones!',
            text: `Has respondido correctamente ${respuestasCorrectas.length} de ${preguntas.length} preguntas. ¡Puedes pasar al siguiente nivel!`,
            icon: 'success',
            confirmButtonText: 'Genial',
            background: '#1a1a1a',
            color: '#fff',
            iconColor: '#9c27b0',
            confirmButtonColor: '#2196f3',
            showClass: {
                popup: 'animate__animated animate__zoomIn'
            },
            hideClass: {
                popup: 'animate__animated animate__zoomOut'
            }
        });
    } else {
        // Mostrar mensaje motivador para seguir mejorando
        Swal.fire({
            title: '¡Sigue practicando!',
            text: `Has respondido correctamente ${respuestasCorrectas.length} de ${preguntas.length} preguntas. ¡No te rindas, puedes mejorar!`,
            icon: 'info',
            confirmButtonText: 'Seguiré practicando',
            background: '#1a1a1a',
            color: '#fff',
            iconColor: '#2196f3',
            confirmButtonColor: '#9c27b0',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }
        
    // Mostrar tabla de resumen de respuestas
    const resumenHTML = `
        <div class="resumen-container">
            <h2>Resumen de respuestas</h2>
            <table class="resumen-tabla">
                <thead>
                    <tr>
                        <th>Pregunta</th>
                        <th>Respuesta correcta</th>
                        <th>Tu respuesta</th>
                        <th>Resultado</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    preguntas.forEach((pregunta, index) => {
        const preguntaTexto = pregunta.q || pregunta.pregunta;
        const respuestaCorrecta = pregunta.a;
        const opciones = pregunta.o || pregunta.opciones || [];
        
        if (opciones && opciones.length > 0) {
            const opcionSeleccionada = document.getElementById(`pregunta-${index}`).querySelector('input[type="radio"]:checked');
            const opcionIndex = opcionSeleccionada ? opcionSeleccionada.getAttribute('data-opcion-index') : null;
            const tuRespuesta = opciones[opcionIndex] || 'No respondiste';
            const resultado = respuestasCorrectas.includes(index) ? 'Correcta' : 'Incorrecta';
            
            resumenHTML += `
                <tr>
                    <td>${preguntaTexto}</td>
                    <td>${respuestaCorrecta}</td>
                    <td>${tuRespuesta}</td>
                    <td>${resultado}</td>
                </tr>
            `;
        } else {
            const respuestaLibre = document.getElementById(`pregunta-${index}`).querySelector('.respuesta-texto').value.trim();
            const resultado = respuestasCorrectas.includes(index) ? 'Correcta' : 'Incorrecta';
            
            resumenHTML += `
                <tr>
                    <td>${preguntaTexto}</td>
                    <td>${respuestaCorrecta}</td>
                    <td>${respuestaLibre}</td>
                    <td>${resultado}</td>
                </tr>
            `;
        }
    });
    
    resumenHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    const resumenContainer = document.getElementById('resumen-container');
    if (resumenContainer) {
        resumenContainer.innerHTML = resumenHTML;
    } else {
        const preguntasContainer = document.getElementById('preguntas-lista');
        if (preguntasContainer) {
            preguntasContainer.insertAdjacentHTML('afterend', resumenHTML);
        }
    }
}

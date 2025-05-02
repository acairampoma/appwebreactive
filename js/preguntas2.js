// Temas de las píldoras
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
    
    if (tituloElement) {
        tituloElement.textContent = 'Entrenemos juntos';
    } else {
        console.error('Error: No se encontró el elemento con id \'nivel-titulo\'');
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
    
    try {
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
        
        // Determinar la ruta relativa basada en si estamos en GitHub Pages o local
        // En GitHub Pages, el path puede ser diferente dependiendo de la estructura del repositorio
        let urlFetch;
        
        if (window.location.hostname.includes('github.io')) {
            // Estamos en GitHub Pages
            // Ajustar la ruta según la estructura del repositorio en GitHub
            // Si tu repo se llama 'appwebreactive', necesitamos incluirlo en la ruta
            urlFetch = `/appwebreactive/preguntas/preguntas_${nombreArchivo}.json`;
            console.log('Entorno GitHub Pages detectado');
        } else {
            // Estamos en desarrollo local
            urlFetch = `./preguntas/preguntas_${nombreArchivo}.json`;
        }
        
        console.log('URL de fetch:', urlFetch);
        console.log('Ruta completa:', new URL(urlFetch, window.location.href).href);
        
        // Intentar cargar desde el servidor local
        const resp = await fetch(urlFetch);
        if (!resp.ok) {
            throw new Error(`No se pudo cargar el archivo de preguntas. Status: ${resp.status}`);
        }
        
        const data = await resp.json();
        console.log('Datos cargados:', data);
        
        // data puede ser {cachimbo:[], junior:[], ...} o un array plano
        if (Array.isArray(data)) {
            // Si es array plano, lo usamos
            preguntas = data;
        } else if (data[nivel]) {
            // Si es objeto con niveles, usamos el nivel solicitado
            preguntas = data[nivel];
        } else {
            // Si no tiene el nivel, usamos el primer nivel disponible o array vacío
            const niveles = Object.keys(data);
            preguntas = niveles.length > 0 ? data[niveles[0]] : [];
        }
    } catch (e) {
        console.error('Error al cargar preguntas:', e);
        preguntasContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error: No se pudo cargar el archivo de preguntas: ${e.message}</p>
            </div>
        `;
        return;
    }
    
    if (!preguntas || preguntas.length === 0) {
        console.log('No hay preguntas para este tema y nivel');
        preguntasContainer.innerHTML = `
            <div class="empty-message" style="text-align: center; padding: 2rem;">
                <i class="fas fa-info-circle" style="font-size: 2rem; color: var(--color-secondary); margin-bottom: 1rem;"></i>
                <p>No hay preguntas para este tema y nivel.</p>
            </div>
        `;
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
}

// Función para verificar respuestas
function verificarRespuestas(preguntas, nivel) {
    // Limpiar clases visuales de intentos anteriores
    document.querySelectorAll('.respuesta-correcta, .respuesta-incorrecta, .era-correcta').forEach(element => {
        element.classList.remove('respuesta-correcta', 'respuesta-incorrecta', 'era-correcta');
    });
    
    // Limpiar clases de filas en la tabla de resumen si existe
    document.querySelectorAll('.respuesta-correcta-fila, .respuesta-incorrecta-fila').forEach(element => {
        element.classList.remove('respuesta-correcta-fila', 'respuesta-incorrecta-fila');
    });
    
    const respuestasCorrectas = [];
    const respuestasIncorrectas = [];
    
    // Recorrer cada pregunta y verificar la respuesta
    preguntas.forEach((pregunta, index) => {
        const preguntaElement = document.getElementById(`pregunta-${index}`);
        if (!preguntaElement) {
            console.error(`No se encontró el elemento para la pregunta ${index}`);
            return;
        }
        
        // El índice de respuesta correcta está en la pregunta
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
            const respuestaInput = preguntaElement.querySelector('.respuesta-texto');
            if (respuestaInput) {
                const respuestaLibre = respuestaInput.value.trim();
                if (respuestaLibre === respuestaCorrecta) {
                    respuestasCorrectas.push(index);
                } else {
                    respuestasIncorrectas.push(index);
                }
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
    
    // Mostrar tabla de resumen de respuestas con paginaciu00f3n
    const preguntasPorPagina = 5; // Nu00famero de preguntas por pu00e1gina
    let paginaActual = 1;
    const totalPaginas = Math.ceil(preguntas.length / preguntasPorPagina);
    
    // Funciu00f3n para renderizar la tabla con paginaciu00f3n
    function renderizarTablaResumen(pagina = 1) {
        const inicio = (pagina - 1) * preguntasPorPagina;
        const fin = Math.min(inicio + preguntasPorPagina, preguntas.length);
        const preguntasPagina = preguntas.slice(inicio, fin);
        
        let resumenTbodyHTML = '';
        
        preguntasPagina.forEach((pregunta, idx) => {
            const indexGlobal = inicio + idx; // u00cdndice real en el array original
            const preguntaTexto = pregunta.q || pregunta.pregunta;
            const opciones = pregunta.o || pregunta.opciones || [];
            const respuestaCorrecta = parseInt(pregunta.a);
            
            if (opciones && opciones.length > 0) {
                const preguntaElement = document.getElementById(`pregunta-${indexGlobal}`);
                if (!preguntaElement) return;
                
                const opcionSeleccionada = preguntaElement.querySelector('input[type="radio"]:checked');
                const opcionIndex = opcionSeleccionada ? parseInt(opcionSeleccionada.getAttribute('data-opcion-index')) : null;
                const tuRespuestaTexto = opcionIndex !== null ? opciones[opcionIndex] : 'No respondiste';
                const respuestaCorrectaTexto = opciones[respuestaCorrecta];
                const resultado = respuestasCorrectas.includes(indexGlobal) ? 'Correcta' : 'Incorrecta';
                const resultadoClase = respuestasCorrectas.includes(indexGlobal) ? 'respuesta-correcta' : 'respuesta-incorrecta';
                
                resumenTbodyHTML += `
                    <tr class="${resultadoClase}-fila">
                        <td data-label="Pregunta:">${preguntaTexto}</td>
                        <td data-label="Respuesta correcta:">${respuestaCorrectaTexto}</td>
                        <td data-label="Tu respuesta:">${tuRespuestaTexto}</td>
                        <td data-label="Resultado:"><span class="${resultadoClase}">${resultado}</span></td>
                    </tr>
                `;
            } else {
                const preguntaElement = document.getElementById(`pregunta-${indexGlobal}`);
                if (!preguntaElement) return;
                
                const respuestaInput = preguntaElement.querySelector('.respuesta-texto');
                const respuestaLibre = respuestaInput ? respuestaInput.value.trim() : 'No respondiste';
                const resultado = respuestasCorrectas.includes(indexGlobal) ? 'Correcta' : 'Incorrecta';
                const resultadoClase = respuestasCorrectas.includes(indexGlobal) ? 'respuesta-correcta' : 'respuesta-incorrecta';
                
                resumenTbodyHTML += `
                    <tr class="${resultadoClase}-fila">
                        <td data-label="Pregunta:">${preguntaTexto}</td>
                        <td data-label="Respuesta correcta:">${respuestaCorrecta}</td>
                        <td data-label="Tu respuesta:">${respuestaLibre}</td>
                        <td data-label="Resultado:"><span class="${resultadoClase}">${resultado}</span></td>
                    </tr>
                `;
            }
        });
        
        let paginadorHTML = '';
        if (totalPaginas > 1) {
            paginadorHTML = `
                <div class="paginador">
                    <button class="pagina-btn" id="pagina-anterior" ${pagina === 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <span class="pagina-info">${pagina} de ${totalPaginas}</span>
                    <button class="pagina-btn" id="pagina-siguiente" ${pagina === totalPaginas ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            `;
        }
        
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
                        ${resumenTbodyHTML}
                    </tbody>
                </table>
                ${paginadorHTML}
            </div>
        `;
        
        // Insertar o actualizar el resumen
        const preguntasContainer = document.getElementById('preguntas-lista');
        if (preguntasContainer) {
            // Eliminar resumen anterior si existe
            const resumenExistente = document.querySelector('.resumen-container');
            if (resumenExistente) {
                resumenExistente.remove();
            }
            
            // Agregar el nuevo resumen
            preguntasContainer.insertAdjacentHTML('afterend', resumenHTML);
            
            // Agregar event listeners para los botones de paginaciu00f3n si existen
            if (totalPaginas > 1) {
                const botonAnterior = document.getElementById('pagina-anterior');
                const botonSiguiente = document.getElementById('pagina-siguiente');
                
                if (botonAnterior) {
                    botonAnterior.addEventListener('click', () => {
                        if (paginaActual > 1) {
                            paginaActual--;
                            renderizarTablaResumen(paginaActual);
                        }
                    });
                }
                
                if (botonSiguiente) {
                    botonSiguiente.addEventListener('click', () => {
                        if (paginaActual < totalPaginas) {
                            paginaActual++;
                            renderizarTablaResumen(paginaActual);
                        }
                    });
                }
            }
        }
    }
    
    // Iniciar la renderizaciu00f3n con la primera pu00e1gina
    renderizarTablaResumen(paginaActual);
}

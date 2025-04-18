# Guía de Branding para WorldReactive

Esta guía define los estándares visuales y de branding para todos los títulos, logotipo y botones clave en el proyecto WorldReactive. Úsala para mantener coherencia y profesionalismo en todas las páginas.

---

## 1. Tipografía

- **Títulos (h1, h2, h3, etc.):**
  - `font-family: 'Orbitron', sans-serif;`
  - Uso: Todos los títulos principales y secundarios.
- **Texto general:**
  - `font-family: 'Roboto', sans-serif;`
  - Uso: Párrafos, descripciones, textos secundarios.

---

## 2. Logotipo "WORLDREACTIVE"

- **Tipografía:** `'Orbitron', sans-serif;`
- **Estilos de color:**
  - "WORLD": blanco (`#fff`) o gris claro (`#e0e0e0`)
  - "REACTIVE": gradiente de violeta a azul (`#9c27b0` a `#2196f3`) usando background-clip/texto degradado.
- **Ejemplo CSS:**
  ```css
  .logo-text {
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      font-size: 2.2em;
      text-transform: uppercase;
      letter-spacing: 0.08em;
  }
  .logo-text .reactive {
      background: linear-gradient(to right, #9c27b0, #2196f3);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
  }
  ```

---

## 3. Botón "Volver"

- **Tipografía:** `'Orbitron', sans-serif;`
- **Colores:**
  - Fondo: gradiente de primario a secundario (`#9c27b0` a `#2196f3`)
  - Texto/icono: blanco puro (`#fff`)
  - Hover: invertir gradiente o resaltar con sombra.
- **Ejemplo CSS:**
  ```css
  .back-button {
      font-family: 'Orbitron', sans-serif;
      background: linear-gradient(135deg, #9c27b0 0%, #2196f3 100%);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(156,39,176,0.2);
      transition: transform 0.2s, box-shadow 0.2s;
  }
  .back-button:hover {
      transform: scale(1.1) rotate(-5deg);
      box-shadow: 0 5px 15px rgba(33,150,243,0.4);
  }
  ```

---

## 4. Colores para títulos

- **Color principal:** violeta (`#9c27b0`) o gradiente violeta-azul para destacar.
- **Subtítulos:** gris claro (`#e0e0e0`) o azul (`#2196f3`).
- **Ejemplo CSS:**
  ```css
  h1, h2, h3, .pildora-title {
      font-family: 'Orbitron', sans-serif;
      color: #9c27b0;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 1.2rem;
  }
  .section-title {
      color: #2196f3;
      font-family: 'Orbitron', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.05em;
  }
  ```

---

## 5. Bordes y tarjetas

- **Bordes:**
  - `border-radius: 8px` o `16px` en tarjetas y botones.
  - Bordes en cian (`#00bcd4`) o primario para destacar.
- **Tarjetas/contenedores:**
  - Fondo: `#1a1a1a` o `#121212`
  - Sombra suave para profundidad.

---

## 6. Paleta de Colores

- **Primario:** `#9c27b0` (violeta/fucsia)
- **Secundario:** `#2196f3` (azul cyber)
- **Cian/acento:** `#00bcd4`
- **Fondo oscuro:** `#121212` / `#1a1a1a`
- **Texto principal:** `#fff`
- **Texto secundario:** `#e0e0e0`
- **Bordes:** `#333333`

---

## 7. Buenas prácticas

- Usa variables CSS para colores, fuentes y espaciados.
- Mantén Orbitron para títulos, Roboto para texto general.
- Utiliza gradientes y efectos hover para botones y elementos destacados.
- Respeta los bordes redondeados y la paleta definida.

---

> **Aplica estos lineamientos en todas las páginas y componentes para mantener una identidad visual coherente y profesional.**

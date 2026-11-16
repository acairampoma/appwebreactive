/* Asistente cognitivo del curso WorldReactive (Empaty) */
(function () {
  var qs = new URLSearchParams(location.search);
  var API = qs.get('api') || window.CURSO_API_BASE || 'https://tienda.qadrante2.com';
  var SES = 'crc-' + Math.random().toString(36).slice(2, 10);

  function el(t, c) { var e = document.createElement(t); if (c) e.className = c; return e; }

  var bubble = el('button'); bubble.id = 'crc-bubble';
  bubble.setAttribute('aria-label', 'Abrir asistente del curso');
  bubble.innerHTML = '💬';

  var panel = el('div'); panel.id = 'crc-panel';
  panel.innerHTML =
    '<div class="crc-head"><div class="t"><b>Asistente WorldReactive</b><br>' +
    '<small>Pregúntame sobre el curso</small></div>' +
    '<button class="crc-x" aria-label="Cerrar">✕</button></div>' +
    '<div class="crc-log" id="crc-log"></div>' +
    '<form class="crc-form"><input class="crc-in" id="crc-in" placeholder="Escribe tu pregunta…" autocomplete="off">' +
    '<button class="crc-send" type="submit" aria-label="Enviar">➤</button></form>';

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  var log = panel.querySelector('#crc-log');
  var input = panel.querySelector('#crc-in');
  var greeted = false;

  function speak(text, btn) {
    var raw = String(text).replace(/\*\*/g, '').replace(/<[^>]+>/g, '');
    var old = btn.textContent;
    btn.disabled = true; btn.textContent = '🔊 …';
    fetch(API + '/api/curso_tts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: raw })
    }).then(function (r) { return r.json(); }).then(function (j) {
      btn.disabled = false; btn.textContent = old;
      if (j && j.audio_b64) {
        try { (new Audio('data:audio/mp3;base64,' + j.audio_b64)).play(); } catch (e) {}
      } else { btn.textContent = '🔇 sin audio'; }
    }).catch(function () { btn.disabled = false; btn.textContent = old; });
  }

  function add(text, who, speakable) {
    var m = el('div', 'crc-msg ' + (who === 'user' ? 'crc-user' : 'crc-bot'));
    m.innerHTML = String(text)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/\n/g, '<br>');
    if (who !== 'user' && speakable !== false) {
      var b = el('button', 'crc-listen');
      b.type = 'button'; b.textContent = '🔊 Escuchar';
      b.addEventListener('click', function () { speak(text, b); });
      m.appendChild(b);
    }
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  }

  function open() {
    panel.classList.add('open');
    if (!greeted) {
      greeted = true;
      add('¡Hola! Soy el asistente del curso WorldReactive. Pregúntame sobre Java, ' +
          'programación reactiva, patrones, SOLID, R2DBC o manejo de errores.');
    }
    setTimeout(function () { input.focus(); }, 60);
  }

  bubble.addEventListener('click', function () {
    if (panel.classList.contains('open')) panel.classList.remove('open'); else open();
  });
  panel.querySelector('.crc-x').addEventListener('click', function () { panel.classList.remove('open'); });

  panel.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var t = input.value.trim();
    if (!t) return;
    input.value = '';
    add(t, 'user');
    var typing = add('Escribiendo…', 'bot', false);
    typing.classList.add('crc-typing');
    fetch(API + '/api/curso_chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: t, sesion: SES })
    }).then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (j) {
      typing.remove();
      add((j && j.texto) || 'No pude responder, intenta de nuevo.');
    }).catch(function () {
      typing.remove();
      add('El asistente se está activando. Intenta de nuevo en un momento 🙂');
    });
  });
})();

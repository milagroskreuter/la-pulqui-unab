// ============================================================
// Código compartido por todas las páginas del sitio.
// ============================================================

// ------------------------------------------------------------
// Fondo animado: lluvia sutil y lenta de "+" y círculos
// ------------------------------------------------------------

function renderBackgroundDecor() {
  const container = document.getElementById("bg-decor");
  if (!container) return;

  const PLUS = "assets/decor-splash.svg";
  const RING = "assets/decor-blob-tinted.svg";
  // el "+" es un trazo más fino que el anillo, así que le damos más
  // proporción y un pelín más de opacidad para que pesen parecido a la vista
  const PLUS_RATIO = 0.58;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const count = reduceMotion ? 12 : 20;

  // Repartimos el ancho en franjas (una por partícula) y tiramos cada una
  // en un punto al azar DENTRO de su franja: así quedan esparcidas parejo
  // en todo el ancho (mezcladas entre sí) en vez de agruparse por azar en
  // los costados.
  const positions = Array.from({ length: count }, (_, i) => {
    const bandWidth = 100 / count;
    return i * bandWidth + Math.random() * bandWidth;
  });
  shuffleInPlace(positions);

  for (let i = 0; i < count; i++) {
    const isPlus = Math.random() < PLUS_RATIO;
    const img = document.createElement("img");
    img.className = "bg-decor__particle";
    img.src = isPlus ? PLUS : RING;
    img.alt = "";

    const size = isPlus ? 16 + Math.random() * 20 : 14 + Math.random() * 22; // px
    const opacity = isPlus ? 0.07 + Math.random() * 0.09 : 0.05 + Math.random() * 0.08;
    const duration = 26 + Math.random() * 26; // 26–52s: lento
    const delay = -Math.random() * duration; // arrancan ya "en caída"
    const drift = `${(Math.random() * 60 - 30).toFixed(0)}px`; // leve vaivén lateral
    const spin = `${(Math.random() < 0.5 ? -1 : 1) * (90 + Math.random() * 180)}deg`;

    img.style.left = `${positions[i]}%`;
    img.style.width = `${size}px`;
    img.style.opacity = String(opacity);
    img.style.setProperty("--drift", drift);
    img.style.setProperty("--spin", spin);

    if (reduceMotion) {
      // sin animación: las repartimos estáticas en toda la altura visible
      img.style.top = `${Math.random() * 100}vh`;
    } else {
      img.style.animationDuration = `${duration}s`;
      img.style.animationDelay = `${delay}s`;
    }

    container.appendChild(img);
  }
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Solo se acepta http(s)/mailto: bloquea "javascript:", "data:", etc. que
// alguien pudiera llegar a escribir por error (o con mala intención) en la hoja.
function isSafeUrl(raw) {
  try {
    const url = new URL(raw, window.location.href);
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:";
  } catch {
    return false;
  }
}

// ------------------------------------------------------------
// Fechas en hora de Argentina (UTC-3): la cuenta es la misma para todos,
// sin importar la zona horaria de quien mira la página.
// ------------------------------------------------------------

const AR_OFFSET = "-03:00";

function argDate(iso, endOfDay) {
  return new Date(`${iso}T${endOfDay ? "23:59:59" : "00:00:00"}${AR_OFFSET}`);
}

const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// "2026-11-02" -> "2 de noviembre"
function formatLongDate(iso) {
  const [, month, day] = iso.split("-").map(Number);
  return `${day} de ${MONTHS_ES[month - 1]}`;
}

// Encabezado de cada bloque: número de paso (opcional), título y una frase
// que explica qué hay que hacer.
function buildBlockHead({ num, title, help, titleId }) {
  const head = document.createElement("header");
  head.className = "block-head";

  if (num) {
    const badge = document.createElement("span");
    badge.className = "block-head__num";
    badge.setAttribute("aria-hidden", "true");
    badge.textContent = String(num);
    head.appendChild(badge);
  }

  const text = document.createElement("div");
  text.className = "block-head__text";

  const h2 = document.createElement("h2");
  h2.className = "block-head__title";
  if (titleId) h2.id = titleId;
  h2.textContent = title;
  text.appendChild(h2);

  if (help) {
    const p = document.createElement("p");
    p.className = "block-head__help";
    p.textContent = help;
    text.appendChild(p);
  }

  head.appendChild(text);
  return head;
}

// ------------------------------------------------------------
// Preinscripciones (paso 1): un bloque por período (Enfermería / otras
// carreras) con su estado, fechas, carreras incluidas y botón.
// Los datos salen de CONFIG.enrollment (config.js).
// ------------------------------------------------------------

function enrollmentStatus(block, now) {
  if (!block.start || !block.end) return null;
  if (now < argDate(block.start, false)) {
    return { kind: "soon", text: `Todavía no abrió · abre el ${formatLongDate(block.start)}` };
  }
  if (now <= argDate(block.end, true)) {
    return { kind: "open", text: `Abierta ahora · cierra el ${formatLongDate(block.end)}` };
  }
  return { kind: "closed", text: "Cerrada" };
}

function renderEnrollment() {
  const section = document.getElementById("enrollment");
  const data = CONFIG.enrollment;
  if (!section || !data || !data.blocks || data.blocks.length === 0) return;

  section.textContent = "";
  section.appendChild(buildBlockHead({ num: 1, title: data.title, help: data.help, titleId: "enrollment-title" }));

  const now = new Date();

  data.blocks.forEach((block) => {
    if (!isSafeUrl(block.url)) {
      console.warn("Link de inscripción con esquema no permitido, se omite:", block.url);
      return;
    }

    const box = document.createElement("div");
    box.className = "enrollment__block";

    const status = enrollmentStatus(block, now);
    if (status) {
      const pill = document.createElement("span");
      pill.className = `enrollment__status enrollment__status--${status.kind}`;
      pill.textContent = status.text;
      box.appendChild(pill);
    }

    const label = document.createElement("p");
    label.className = "enrollment__label";
    label.textContent = block.label;
    box.appendChild(label);

    const dates = document.createElement("p");
    dates.className = "enrollment__dates";
    dates.textContent = block.dates;
    box.appendChild(dates);

    // las carreras incluidas se ven siempre, para que nadie dude si la suya está;
    // cada una lleva a su página en la web de la UNaB
    if (block.careers && block.careers.length > 0) {
      const intro = document.createElement("p");
      intro.className = "enrollment__intro";
      intro.textContent = "Incluye estas carreras. Tocá una para ver su información en la web de la UNaB:";
      box.appendChild(intro);

      const list = document.createElement("ul");
      list.className = "enrollment__careers";
      block.careers.forEach((career) => {
        const li = document.createElement("li");
        if (isSafeUrl(career.url)) {
          const a = document.createElement("a");
          a.href = career.url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = career.name;
          li.appendChild(a);
        } else {
          li.textContent = career.name;
        }
        list.appendChild(li);
      });
      box.appendChild(list);
    }

    // carrera única (Enfermería): link a su información
    if (block.infoUrl && isSafeUrl(block.infoUrl)) {
      const info = document.createElement("a");
      info.className = "enrollment__info";
      info.href = block.infoUrl;
      info.target = "_blank";
      info.rel = "noopener noreferrer";
      info.textContent = "Ver información de la carrera";
      box.appendChild(info);
    }

    const button = document.createElement("a");
    button.className = "enrollment__button";
    button.href = block.url;
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.textContent = block.button || "Preinscribirme";
    box.appendChild(button);

    section.appendChild(box);
  });

  if (data.sourceUrl && isSafeUrl(data.sourceUrl)) {
    const source = document.createElement("a");
    source.className = "enrollment__source";
    source.href = data.sourceUrl;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.textContent = "Más info en unab.edu.ar/inscripciones";
    section.appendChild(source);
  }

  section.hidden = false;
}

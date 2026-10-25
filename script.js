// ============================================================
// Lógica del sitio: perfil, secciones de links y actividades
// abiertas leídas en vivo desde Google Sheets.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  renderBackgroundDecor();
  renderProfile();
  renderGroups();
  renderSections();
  loadActivities();

  if (CONFIG.sheet.refreshMs) {
    setInterval(loadActivities, CONFIG.sheet.refreshMs);
  }
});

function renderProfile() {
  document.querySelector(".profile__description").textContent =
    CONFIG.profile.description;
  const ig = document.getElementById("instagram-link");
  if (CONFIG.profile.instagram && isSafeUrl(CONFIG.profile.instagram)) {
    ig.href = CONFIG.profile.instagram;
  } else {
    ig.remove();
  }

  renderHeroLinks();
}

// Íconos propios (trazo simple), no son logos de terceros.
const HERO_ICONS = {
  whatsapp:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.03 2 11c0 1.85.6 3.58 1.64 5.03L2 22l6.18-1.62C9.62 20.79 10.78 21 12 21c5.52 0 10-4.03 10-9S17.52 2 12 2zm0 2c4.42 0 8 3.58 8 8 0 3.87-3.58 7-8 7-1.1 0-2.15-.2-3.1-.56l-.5-.19-3.02.79.8-2.85-.2-.47A6.95 6.95 0 0 1 5 11c0-4.42 3.13-7 7-7z"/></svg>',
  library:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H12v20H6.5A2.5 2.5 0 0 1 4 19.5v-15zM13 2h4.5A2.5 2.5 0 0 1 20 4.5v15a2.5 2.5 0 0 1-2.5 2.5H13V2z"/></svg>',
  campus:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M3 4h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-7v2h3v2H7v-2h3v-2H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm1 2v9h16V6H4z"/></svg>',
  graduation:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>',
  clipboard:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M9 2h6a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V3a1 1 0 0 1 1-1zm0 2v1h6V4H9zM6 6v14h12V6h-2v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6H6zm2 7h8v2H8v-2zm0 4h5v2H8v-2z"/></svg>',
};

function renderHeroLinks() {
  const container = document.getElementById("hero-links");
  const links = CONFIG.heroLinks;
  if (!container || !links) return;

  links.forEach((link) => {
    if (!isSafeUrl(link.url)) {
      console.warn("Link con esquema no permitido, se omite:", link.url);
      return;
    }

    const a = document.createElement("a");
    a.className = link.highlight ? "profile__social profile__social--highlight" : "profile__social";
    a.href = link.url;
    // los links internos (sameTab) navegan en la misma pestaña
    if (!link.sameTab) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }

    const iconSvg = HERO_ICONS[link.icon];
    if (iconSvg) {
      const span = document.createElement("span");
      span.setAttribute("aria-hidden", "true");
      span.innerHTML = iconSvg;
      a.appendChild(span.firstChild);
    }

    const text = document.createElement("span");
    text.textContent = link.title;
    a.appendChild(text);

    container.appendChild(a);
  });
}

// Carrusel de grupos de ingresantes. Hoy se muestra solo el de 2027 (el de
// 2026, CONFIG.groups, sigue en config.js por si se quiere volver a mostrar:
// alcanza con agregarlo a esta lista). Las tarjetas van en orden alfabético.
function renderGroups() {
  const container = document.getElementById("groups-container");
  const g2027 = CONFIG.groups2027;

  const carousels = [
    g2027 && {
      title: g2027.carouselTitle,
      subtitle: g2027.subtitle,
      items: [...g2027.items].sort((a, b) => (a.sort || a.title).localeCompare(b.sort || b.title, "es")),
    },
  ];

  carousels.forEach((groups) => {
    if (groups && groups.items && groups.items.length > 0) {
      container.appendChild(renderGroupCarousel(groups));
    }
  });
}

function renderGroupCarousel(groups) {
  const section = document.createElement("section");
  section.className = "section";

  const title = document.createElement("h2");
  title.className = "section__title";
  title.textContent = groups.title;
  section.appendChild(title);

  const carousel = document.createElement("div");
  carousel.className = "carousel";

  const prev = document.createElement("button");
  prev.className = "carousel__arrow carousel__arrow--prev";
  prev.type = "button";
  prev.setAttribute("aria-label", "Anterior");
  prev.textContent = "‹";

  const list = document.createElement("ul");
  list.className = "carousel__track";

  const next = document.createElement("button");
  next.className = "carousel__arrow carousel__arrow--next";
  next.type = "button";
  next.setAttribute("aria-label", "Siguiente");
  next.textContent = "›";

  groups.items.forEach((item) => {
    if (!isSafeUrl(item.url)) {
      console.warn("Link de grupo con esquema no permitido, se omite:", item.url);
      return;
    }

    const li = document.createElement("li");

    const a = document.createElement("a");
    a.className = "group-card";
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    const media = document.createElement("div");
    media.className = "group-card__media";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.title;
    img.loading = "lazy";
    media.appendChild(img);

    const body = document.createElement("div");
    body.className = "group-card__body";

    const name = document.createElement("span");
    name.className = "group-card__name";
    name.textContent = item.title;
    body.appendChild(name);

    const subtitle = document.createElement("span");
    subtitle.className = "group-card__subtitle";
    subtitle.textContent = groups.subtitle || "";
    body.appendChild(subtitle);

    a.appendChild(media);
    a.appendChild(body);
    li.appendChild(a);
    list.appendChild(li);
  });

  carousel.appendChild(prev);
  carousel.appendChild(list);
  carousel.appendChild(next);
  section.appendChild(carousel);

  setupCarouselArrows(list, prev, next);
  return section;
}

function setupCarouselArrows(track, prev, next) {
  const scrollByCard = () => {
    const card = track.querySelector(".group-card");
    return card ? card.getBoundingClientRect().width + 14 : 180;
  };
  prev.addEventListener("click", () => {
    track.scrollBy({ left: -scrollByCard() * 2, behavior: "smooth" });
  });
  next.addEventListener("click", () => {
    track.scrollBy({ left: scrollByCard() * 2, behavior: "smooth" });
  });
}

function renderSections() {
  const container = document.getElementById("sections");
  container.innerHTML = "";

  CONFIG.sections.forEach((section) => {
    const wrap = document.createElement("div");
    wrap.className = "section";

    const title = document.createElement("h2");
    title.className = "section__title";
    title.textContent = section.title;
    wrap.appendChild(title);

    const list = document.createElement("ul");
    list.className = "link-list";

    section.links.forEach((link) => {
      if (!isSafeUrl(link.url)) {
        console.warn("Link con esquema no permitido, se omite:", link.url);
        return;
      }

      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "link-btn";
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";

      if (link.icon) {
        const icon = document.createElement("img");
        icon.className = "link-btn__icon";
        icon.src = link.icon;
        icon.alt = "";
        a.appendChild(icon);
      }

      const text = document.createElement("span");
      text.className = "link-btn__text";
      text.textContent = link.title;
      a.appendChild(text);

      const chevron = document.createElement("span");
      chevron.className = "link-btn__chevron";
      chevron.textContent = "›";
      a.appendChild(chevron);

      li.appendChild(a);
      list.appendChild(li);
    });

    wrap.appendChild(list);
    container.appendChild(wrap);
  });
}

// ------------------------------------------------------------
// Actividades abiertas (Google Sheet: Fecha | Nombre | Link)
// ------------------------------------------------------------

async function loadActivities() {
  const section = document.getElementById("actividades");
  const list = document.getElementById("activities-list");

  try {
    const { header, rows } = await fetchSheetRows(CONFIG.sheet.id, CONFIG.sheet.gid);
    const cols = buildColumnIndex(header);
    const today = startOfToday();

    const parsed = rows.map((row) => parseActivityRow(row, cols)).filter(Boolean);

    // con fecha y todavía no pasó: primero, ordenadas por fecha más próxima
    const dated = parsed
      .filter((a) => !a.undated && a.date >= today)
      .sort((a, b) => a.date - b.date);

    // sin fecha ("a definir"): siempre al final, no expiran solas
    const undated = parsed.filter((a) => a.undated);

    const visible = [...dated, ...undated];

    list.innerHTML = "";

    if (visible.length === 0) {
      section.hidden = true;
      return;
    }

    visible.forEach((activity) => {
      list.appendChild(renderActivityItem(activity));
    });

    section.hidden = false;
  } catch (err) {
    console.error("No se pudieron cargar las actividades abiertas:", err);
    // si falla la carga (ej. hoja no compartida), no mostramos la sección
    section.hidden = true;
  }
}

async function fetchSheetRows(sheetId, gid) {
  // sheetId/gid son públicos de solo lectura (la hoja está compartida como
  // "cualquiera con el enlace - lector"); nunca se manda ninguna credencial.
  const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sheetId)}/gviz/tq?tqx=out:csv&gid=${encodeURIComponent(gid)}&t=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store", referrerPolicy: "no-referrer" });
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  const text = await res.text();
  const table = parseCSV(text);
  if (table.length === 0) return { header: [], rows: [] };

  const [header, ...rest] = table;
  const rows = rest.filter((r) => r.some((cell) => cell && cell.trim()));
  return { header, rows };
}

// Sin acentos/mayúsculas ni espacios de más, para matchear el nombre de la
// columna sin importar cómo lo haya tipeado (MAXIMO DE CUPOS, Máximo de Cupos, etc.)
function normalizeHeader(s) {
  return (s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

// Mapea nombre de columna -> índice, para no depender del orden de las
// columnas en la hoja (podés agregar/mover columnas sin romper el sitio).
function buildColumnIndex(header) {
  const index = {};
  header.forEach((title, i) => {
    index[normalizeHeader(title)] = i;
  });
  return index;
}

function cell(row, cols, name) {
  const i = cols[normalizeHeader(name)];
  return i === undefined ? "" : (row[i] || "").trim();
}

function parseActivityRow(row, cols) {
  const nombre = cell(row, cols, "Nombre");
  const link = cell(row, cols, "Link");

  // Columna "Activo": hasta que no diga "Si" (sin importar mayúsculas/acento),
  // la fila no se muestra en el linktree, aunque tenga fecha y link cargados.
  const activo = normalizeHeader(cell(row, cols, "Activo"));
  if (activo !== "si") return null;

  if (!nombre || !link || !isSafeUrl(link)) return null;

  // Columna "Últimos cupos" (la mantiene al día un script de Google Sheets
  // que compara las respuestas del form contra "Maximo de cupos"): si dice
  // "Si" se muestra la cintita de "ÚLTIMOS CUPOS" en la actividad.
  const ultimosCupos = normalizeHeader(cell(row, cols, "Ultimos cupos")) === "si";

  const fechaTrim = cell(row, cols, "Fecha");
  if (!fechaTrim) {
    // sin fecha cargada -> "a definir", pero se permite la inscripción igual
    return { date: null, nombre, link, undated: true, ultimosCupos };
  }

  const date = parseFlexibleDate(fechaTrim);
  if (!date) {
    // fecha con formato inválido: no la descartamos, la tratamos como "a definir"
    return { date: null, nombre, link, undated: true, ultimosCupos };
  }

  return { date, nombre, link, undated: false, ultimosCupos };
}

function renderActivityItem(activity) {
  const li = document.createElement("li");
  li.className = "activities__item";

  const a = document.createElement("a");
  a.href = activity.link;
  a.target = "_blank";
  a.rel = "noopener noreferrer";

  if (activity.ultimosCupos) {
    const wrap = document.createElement("span");
    wrap.className = "activities__ribbon-wrap";
    const ribbon = document.createElement("span");
    ribbon.className = "activities__ribbon";
    ribbon.textContent = "Últimos cupos";
    wrap.appendChild(ribbon);
    a.appendChild(wrap);
  }

  const dateBadge = document.createElement("span");

  if (activity.undated) {
    dateBadge.className = "activities__date activities__date--undated";
    dateBadge.textContent = "A definir";
  } else {
    dateBadge.className = "activities__date";
    const day = String(activity.date.getDate()).padStart(2, "0");
    const month = activity.date.toLocaleDateString("es-AR", { month: "short" }).replace(".", "");
    const daySpan = document.createElement("span");
    daySpan.textContent = day;
    const monthSpan = document.createElement("span");
    monthSpan.textContent = month;
    dateBadge.appendChild(daySpan);
    dateBadge.appendChild(monthSpan);
  }

  const name = document.createElement("span");
  name.className = "activities__name";
  name.textContent = activity.nombre;

  a.appendChild(dateBadge);
  a.appendChild(name);
  li.appendChild(a);
  return li;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Acepta DD/MM/AAAA, DD-MM-AAAA o AAAA-MM-DD
function parseFlexibleDate(raw) {
  if (!raw) return null;
  const value = raw.trim();

  let m = value.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    const date = new Date(Number(y), Number(mo) - 1, Number(d));
    date.setHours(0, 0, 0, 0);
    return isNaN(date) ? null : date;
  }

  m = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    const [, y, mo, d] = m;
    const date = new Date(Number(y), Number(mo) - 1, Number(d));
    date.setHours(0, 0, 0, 0);
    return isNaN(date) ? null : date;
  }

  return null;
}

// Parser de CSV simple que soporta campos entre comillas con comas adentro
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      // ignorar
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

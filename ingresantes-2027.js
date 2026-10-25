// ============================================================
// Página de ingresantes 2027: preinscripciones (paso 1) y buscador de
// grupos por carrera (paso 2).
// Los datos viven en config.js (CONFIG.groups2027).
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  renderBackgroundDecor();
  renderEnrollment();

  const groups = CONFIG.groups2027;
  document.getElementById("page-title").textContent = groups.heading || groups.title;
  document.getElementById("page-description").textContent = groups.description;
  document.title = `${groups.title} — ${CONFIG.profile.name}`;

  const items = [...groups.items]
    .sort((a, b) => (a.sort || a.title).localeCompare(b.sort || b.title, "es"))
    .filter((item) => {
      if (isSafeUrl(item.url)) return true;
      console.warn("Link de grupo con esquema no permitido, se omite:", item.url);
      return false;
    })
    .map((item) => ({
      ...item,
      words: normalizeText(`${item.title} ${item.keywords || ""}`).split(/[^a-z0-9]+/).filter(Boolean),
      el: renderGroupTile(item),
    }));

  const list = document.getElementById("finder-results");
  items.forEach((item) => list.appendChild(item.el));

  renderEmptyLinks();
  setupSearch(items);
  setupCountdown();
  setupContact();
});

// Sin tildes ni mayúsculas, y con la ñ tratada como n: "ensenanza",
// "Enseñanza" y "ENSEÑANZA" dan lo mismo (desde el celu casi nadie tipea la ñ).
function normalizeText(s) {
  return (s || "")
    .toLowerCase()
    .replace(/ñ/g, "n")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Una carrera coincide si CADA palabra tipeada es el comienzo de alguna
// palabra de su nombre (o de sus keywords): "log tra" encuentra
// "Logística y Transporte", "mat" encuentra "Enseñanza de la Matemática".
function matches(item, tokens) {
  return tokens.every((token) => item.words.some((word) => word.startsWith(token)));
}

function setupSearch(items) {
  const input = document.getElementById("finder-input");
  const clear = document.getElementById("finder-clear");
  const count = document.getElementById("finder-count");
  const empty = document.getElementById("finder-empty");
  const list = document.getElementById("finder-results");

  const update = () => {
    const tokens = normalizeText(input.value).split(/\s+/).filter(Boolean);
    const searching = tokens.length > 0;
    let visible = 0;

    items.forEach((item) => {
      const show = !searching || matches(item, tokens);
      item.el.hidden = !show;
      if (show) visible++;
    });

    // sin búsqueda: grilla de fotos para explorar; buscando: lista grande
    // con el botón "Unirme" bien a mano
    list.classList.toggle("is-searching", searching);
    list.hidden = visible === 0;
    empty.hidden = visible !== 0;
    clear.hidden = !searching;

    if (!searching) {
      count.textContent = `${items.length} carreras, en orden alfabético`;
    } else if (visible === 0) {
      count.textContent = "";
    } else {
      count.textContent = visible === 1 ? "1 resultado" : `${visible} resultados`;
    }
  };

  input.addEventListener("input", update);

  clear.addEventListener("click", () => {
    input.value = "";
    update();
    input.focus();
  });

  // Enter abre el primer resultado visible, así no hace falta tocar la lista
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const first = items.find((item) => !item.el.hidden);
    if (first) window.open(first.url, "_blank", "noopener,noreferrer");
  });

  update();
}

// Una carrera = una tarjeta. El mismo markup se ve como foto en la grilla y
// como fila con botón "Unirme" cuando se está buscando (ver .is-searching).
function renderGroupTile(item) {
  const li = document.createElement("li");

  const a = document.createElement("a");
  a.className = "tile";
  a.href = item.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.title = `Unirme al grupo de ${item.title}`;

  const media = document.createElement("span");
  media.className = "tile__media";

  const img = document.createElement("img");
  img.className = "tile__img";
  img.src = item.image;
  img.alt = "";
  img.width = 160;
  img.height = 160;
  img.loading = "lazy";
  media.appendChild(img);

  const name = document.createElement("span");
  name.className = "tile__name";
  name.textContent = item.title;

  const cta = document.createElement("span");
  cta.className = "tile__cta";
  cta.append("Entrar");
  const rest = document.createElement("span");
  rest.className = "tile__cta-rest";
  rest.textContent = " al grupo";
  cta.appendChild(rest);

  a.appendChild(media);
  a.appendChild(name);
  a.appendChild(cta);
  li.appendChild(a);
  return li;
}

// ------------------------------------------------------------
// Cuenta regresiva: cuánto falta para la próxima fecha de ingreso y,
// cuando esa fecha ya empezó, cuánto queda para que cierre. Usa los
// eventos "ingreso" de calendar-data.js que se ven en esta página.
// Las fechas se interpretan en hora de Argentina (UTC-3), así que la
// cuenta es la misma sin importar la zona horaria de quien mira.
// ------------------------------------------------------------

// Devuelve { mode: "starts" | "ends" | "reopens", ev, target } o null si no queda nada
function pickCountdownTarget(now) {
  const events = CALENDAR_DATA.events
    .filter((ev) => ev.cat === "ingreso" && (ev.scope === "both" || ev.scope === "ingresantes"))
    .map((ev) => ({ ev, p: periodState(now, ev) }));

  // lo que ya empezó tiene prioridad: el que cierra primero
  const running = events
    .filter((e) => e.p.state === "open" || e.p.state === "between")
    .sort((a, b) => a.p.last - b.p.last)[0];
  if (running) {
    return running.p.state === "open"
      ? { mode: "ends", ev: running.ev, target: running.p.last }
      : { mode: "reopens", ev: running.ev, target: running.p.opensAt }; // fuera del horario de hoy
  }

  const upcoming = events.filter((e) => e.p.state === "before").sort((a, b) => a.p.first - b.p.first)[0];
  if (upcoming) return { mode: "starts", ev: upcoming.ev, target: upcoming.p.first };

  return null;
}

function setupCountdown() {
  const box = document.getElementById("countdown");
  if (!box) return;

  const render = () => {
    const now = new Date();
    const pick = pickCountdownTarget(now);
    if (!pick) {
      box.hidden = true;
      return;
    }

    const totalMin = Math.max(0, Math.floor((pick.target - now) / 60000));
    const days = Math.floor(totalMin / 1440);
    const hours = Math.floor((totalMin % 1440) / 60);
    const minutes = totalMin % 60;

    box.textContent = "";

    const label = document.createElement("p");
    label.className = "countdown__label";
    label.textContent = {
      starts: "Próxima fecha · empieza en",
      ends: "En curso · cierra en",
      reopens: "Cerrada por hoy · abre en",
    }[pick.mode];
    box.appendChild(label);

    const title = document.createElement("p");
    title.className = "countdown__title";
    title.textContent = pick.ev.title;
    box.appendChild(title);

    const time = document.createElement("p");
    time.className = "countdown__time";
    const units = [];
    if (days > 0) units.push([days, days === 1 ? "día" : "días"]);
    units.push([hours, "h"], [minutes, "min"]);
    units.forEach(([value, unit]) => {
      const part = document.createElement("span");
      part.className = "countdown__unit";
      const num = document.createElement("span");
      num.className = "countdown__num";
      num.textContent = String(value);
      const name = document.createElement("span");
      name.className = "countdown__unit-label";
      name.textContent = unit;
      part.append(num, name);
      time.appendChild(part);
    });
    box.appendChild(time);

    box.classList.toggle("countdown--live", pick.mode === "ends");
    box.hidden = false;
  };

  render();
  setInterval(render, 30 * 1000);
}

// ------------------------------------------------------------
// Contacto (Instagram) y botón de compartir con un amigo
// ------------------------------------------------------------

function setupContact() {
  const ig = document.getElementById("contact-instagram");
  if (CONFIG.profile.instagram && isSafeUrl(CONFIG.profile.instagram)) {
    ig.href = CONFIG.profile.instagram;
  } else {
    ig.remove();
  }

  const button = document.getElementById("share-btn");
  const toast = document.getElementById("share-toast");

  // link limpio de esta página (sin ?query ni #hash)
  const url = `${window.location.origin}${window.location.pathname}`;
  const data = {
    title: "Ingreso 2027 · UNaB",
    text: "Fechas, preinscripción y grupos de WhatsApp por carrera para ingresar a la UNaB 💙",
    url,
  };

  const say = (message) => {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(say.timer);
    say.timer = setTimeout(() => { toast.hidden = true; }, 3500);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      say("¡Link copiado! Pegalo donde quieras 💙");
    } catch {
      window.prompt("Copiá este link para compartirlo:", url);
    }
  };

  button.addEventListener("click", async () => {
    // en el celu abre el menú de compartir (WhatsApp, Instagram, etc.)
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (err) {
        if (err.name !== "AbortError") copyLink(); // cerrar el menú no es un error
      }
      return;
    }
    copyLink();
  });
}

// Si no encuentran su carrera: canal de WhatsApp e Instagram (de config.js)
function renderEmptyLinks() {
  const container = document.getElementById("empty-links");
  const links = [];

  const channel = (CONFIG.heroLinks || []).find((l) => l.icon === "whatsapp");
  if (channel) links.push({ title: channel.title, url: channel.url });
  if (CONFIG.profile.instagram) links.push({ title: "Instagram", url: CONFIG.profile.instagram });

  links.forEach((link) => {
    if (!isSafeUrl(link.url)) return;
    const a = document.createElement("a");
    a.className = "profile__social";
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = link.title;
    container.appendChild(a);
  });
}

// ============================================================
// Calendario mensual (estilo Google Calendar) con las fechas del
// calendario académico. Datos en calendar-data.js.
//
// Uso: <section class="calendar" data-scope="general|ingresantes"
//        data-title="Texto del título"></section>
// Siempre abre en el mes actual; las flechas permiten ir a otros meses.
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".calendar[data-scope]").forEach(setupCalendar);
});

const CAL_WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"]; // semana desde el lunes
// qué tipo de fecha manda el color del día cuando hay varias
const CAL_PRIORITY = ["feriado", "ingreso", "examenes", "inscripcion", "tramites", "clases", "receso"];
const CAL_MAX_DOTS = 3;
const CAL_HIGHLIGHT_MAX_DAYS = 14; // fechas más largas que esto no pintan el día
const CAL_LIST_LIMIT = 4; // fechas visibles antes de "Ver más"

function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// cantidad de días que dura un evento (1 si es de un solo día)
function eventDays(ev) {
  return Math.round((ev.endDate - ev.startDate) / 86400000) + 1;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function setupCalendar(root) {
  const scope = root.dataset.scope;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Solo los eventos de este calendario: "general" ve general + both,
  // "ingresantes" ve ingresantes + both.
  const events = CALENDAR_DATA.events
    .filter((ev) => {
      const evScope = ev.scope || "general";
      return evScope === "both" || evScope === scope;
    })
    .map((ev) => ({ ...ev, startDate: parseISODate(ev.start), endDate: parseISODate(ev.end || ev.start) }));

  // Meses navegables: del primero al último con datos, siempre incluyendo hoy
  const monthIndex = (d) => d.getFullYear() * 12 + d.getMonth();
  const starts = events.map((ev) => monthIndex(ev.startDate));
  const ends = events.map((ev) => monthIndex(ev.endDate));
  const minMonth = Math.min(monthIndex(today), ...starts);
  const maxMonth = Math.max(monthIndex(today), ...ends);

  const state = { month: monthIndex(today), selected: null, expanded: false };

  // --- estructura fija ---
  root.textContent = "";
  root.classList.add("calendar");

  if (root.dataset.title) {
    root.appendChild(buildBlockHead({ title: root.dataset.title, help: root.dataset.help }));
  }

  const nav = el("div", "calendar__nav");
  const prev = el("button", "calendar__arrow", "‹");
  prev.type = "button";
  prev.setAttribute("aria-label", "Mes anterior");
  const label = el("p", "calendar__month");
  label.setAttribute("aria-live", "polite");
  const next = el("button", "calendar__arrow", "›");
  next.type = "button";
  next.setAttribute("aria-label", "Mes siguiente");
  const todayBtn = el("button", "calendar__today", "Hoy");
  todayBtn.type = "button";
  nav.append(prev, label, next, todayBtn);
  root.appendChild(nav);

  const weekdays = el("div", "calendar__weekdays");
  weekdays.setAttribute("aria-hidden", "true");
  CAL_WEEKDAYS.forEach((w) => weekdays.appendChild(el("span", "", w)));
  root.appendChild(weekdays);

  const grid = el("div", "calendar__grid");
  root.appendChild(grid);

  const legend = el("ul", "calendar__legend");
  root.appendChild(legend);

  const listHead = el("div", "calendar__list-head");
  const listTitle = el("h3", "calendar__list-title");
  const showAll = el("button", "calendar__showall", "Ver todo el mes");
  showAll.type = "button";
  listHead.append(listTitle, showAll);
  root.appendChild(listHead);

  const list = el("ul", "calendar__list");
  root.appendChild(list);

  const more = el("button", "calendar__more");
  more.type = "button";
  root.appendChild(more);

  const source = el("p", "calendar__source");
  source.append("Fuente: ");
  const sourceLink = el("a", "", CALENDAR_DATA.source.label);
  sourceLink.href = CALENDAR_DATA.source.url;
  sourceLink.target = "_blank";
  sourceLink.rel = "noopener noreferrer";
  source.append(sourceLink, ". Puede sufrir modificaciones.");
  root.appendChild(source);

  // --- interacción ---
  const go = (delta) => {
    state.month = Math.min(maxMonth, Math.max(minMonth, state.month + delta));
    state.selected = null;
    state.expanded = false;
    draw();
  };
  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));
  todayBtn.addEventListener("click", () => {
    state.month = monthIndex(today);
    state.selected = null;
    state.expanded = false;
    draw();
  });
  showAll.addEventListener("click", () => {
    state.selected = null;
    draw();
  });
  more.addEventListener("click", () => {
    state.expanded = !state.expanded;
    draw();
  });

  const eventsOn = (date) => events.filter((ev) => ev.startDate <= date && date <= ev.endDate);

  function draw() {
    const year = Math.floor(state.month / 12);
    const month = state.month % 12;
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const lastDay = new Date(year, month, daysInMonth);

    label.textContent = capitalize(first.toLocaleDateString("es-AR", { month: "long", year: "numeric" }));
    prev.disabled = state.month <= minMonth;
    next.disabled = state.month >= maxMonth;
    todayBtn.hidden = state.month === monthIndex(today);

    // --- grilla ---
    grid.textContent = "";
    const offset = (first.getDay() + 6) % 7; // lunes = 0
    for (let i = 0; i < offset; i++) grid.appendChild(el("span", "cal-day cal-day--blank"));

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = eventsOn(date);
      const holiday = dayEvents.find((ev) => ev.cat === "feriado");

      const cell = el("button", "cal-day");
      cell.type = "button";
      if (sameDay(date, today)) cell.classList.add("is-today");
      if (holiday) cell.classList.add("is-holiday");

      // día con fechas: se marca con el color del tipo de fecha más importante
      // (los trámites muy largos, de más de dos semanas, solo dejan su puntito para no teñir todo el mes)
      const highlight = CAL_PRIORITY.map((cat) => dayEvents.find((ev) => ev.cat === cat && !ev.period && eventDays(ev) <= CAL_HIGHLIGHT_MAX_DAYS)).find(Boolean);
      if (highlight) {
        cell.classList.add("has-event");
        cell.style.setProperty("--cat", CALENDAR_DATA.categories[highlight.cat].color);
      }
      if (state.selected && sameDay(date, state.selected)) cell.classList.add("is-selected");

      cell.appendChild(el("span", "cal-day__num", String(day)));

      const marks = el("span", "cal-day__marks");
      // categorías puntuales: un puntito por categoría (máx. 3)
      const dotCats = [...new Set(dayEvents.filter((ev) => !ev.period && ev.cat !== "feriado").map((ev) => ev.cat))];
      dotCats.slice(0, CAL_MAX_DOTS).forEach((cat) => {
        const dot = el("span", "cal-day__dot");
        dot.style.background = CALENDAR_DATA.categories[cat].color;
        marks.appendChild(dot);
      });
      cell.appendChild(marks);

      // períodos largos (clases, receso): barrita abajo del día
      const bars = el("span", "cal-day__bars");
      const periodCats = [...new Set(dayEvents.filter((ev) => ev.period).map((ev) => ev.cat))];
      periodCats.slice(0, 2).forEach((cat) => {
        const bar = el("span", "cal-day__bar");
        bar.style.background = CALENDAR_DATA.categories[cat].color;
        bars.appendChild(bar);
      });
      cell.appendChild(bars);

      const fullDate = date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
      cell.setAttribute(
        "aria-label",
        dayEvents.length ? `${fullDate}: ${dayEvents.map((ev) => ev.title).join("; ")}` : fullDate
      );
      cell.setAttribute("aria-pressed", String(Boolean(state.selected && sameDay(date, state.selected))));

      cell.addEventListener("click", () => {
        state.selected = state.selected && sameDay(date, state.selected) ? null : date;
        state.expanded = false;
        draw();
      });
      grid.appendChild(cell);
    }

    // --- lista de eventos (del día elegido o de todo el mes) ---
    const rangeStart = state.selected || first;
    const rangeEnd = state.selected || lastDay;
    const shown = events
      .filter((ev) => ev.startDate <= rangeEnd && ev.endDate >= rangeStart)
      // primero las fechas puntuales (por fecha), al final los períodos largos
      .sort((a, b) => Number(Boolean(a.period)) - Number(Boolean(b.period)) || a.startDate - b.startDate);

    // leyenda: solo los tipos de fecha que aparecen este mes
    legend.textContent = "";
    [...new Set(events.filter((ev) => ev.startDate <= lastDay && ev.endDate >= first).map((ev) => ev.cat))].forEach((cat) => {
      const item = el("li", "calendar__legend-item");
      const swatch = el("span", "calendar__swatch");
      swatch.style.background = CALENDAR_DATA.categories[cat].color;
      item.append(swatch, CALENDAR_DATA.categories[cat].label);
      legend.appendChild(item);
    });

    if (state.selected) {
      listTitle.textContent = capitalize(
        state.selected.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })
      );
    } else {
      listTitle.textContent = `Fechas de ${first.toLocaleDateString("es-AR", { month: "long" })}`;
    }
    showAll.hidden = !state.selected;

    list.textContent = "";
    more.hidden = true;
    if (shown.length === 0) {
      list.appendChild(
        el(
          "li",
          "calendar__empty",
          state.selected
            ? "No hay fechas cargadas para este día."
            : "Todavía no hay fechas cargadas para este mes. Las sumamos cuando la UNaB publique el calendario."
        )
      );
      return;
    }

    const collapsed = !state.expanded && shown.length > CAL_LIST_LIMIT;
    (collapsed ? shown.slice(0, CAL_LIST_LIMIT) : shown).forEach((ev) => list.appendChild(renderEvent(ev, today)));

    if (shown.length > CAL_LIST_LIMIT) {
      more.hidden = false;
      more.textContent = collapsed ? `Ver las ${shown.length} fechas` : "Ver menos";
    }
  }

  draw();
}

function formatEventDates(ev) {
  const short = { day: "numeric", month: "short" };
  const fmt = (d) => d.toLocaleDateString("es-AR", short).replace(".", "");
  if (sameDay(ev.startDate, ev.endDate)) {
    const weekday = ev.startDate.toLocaleDateString("es-AR", { weekday: "short" }).replace(".", "");
    return `${capitalize(weekday)} ${fmt(ev.startDate)}`;
  }
  return `${fmt(ev.startDate)} – ${fmt(ev.endDate)}`;
}

function renderEvent(ev, today) {
  const cat = CALENDAR_DATA.categories[ev.cat];
  const past = ev.endDate < today;
  const active = ev.startDate <= today && today <= ev.endDate;

  const li = el("li", "cal-event");
  li.style.setProperty("--cat", cat.color);
  if (past) li.classList.add("is-past");

  const body = el("span", "cal-event__body");
  body.appendChild(el("span", "cal-event__title", ev.title));
  body.appendChild(
    el("span", "cal-event__meta", ev.note ? `${formatEventDates(ev)} · ${ev.note}` : formatEventDates(ev))
  );
  li.appendChild(body);

  if (active) li.appendChild(el("span", "cal-event__badge", "En curso"));
  return li;
}

// ============================================================
// DATOS DEL CALENDARIO ACADÉMICO — editá acá cuando la UNaB publique
// una versión nueva (el 2027 todavía no está publicado).
//
// Fuente: Calendario Académico 2026 (actualizado), junio 2026
// https://www.unab.edu.ar/wp-content/uploads/2026/06/CALENDARIO-ACADEMICO-2026-actualizado.pdf
//
// Cada evento:
//   title  -> qué es
//   start  -> "AAAA-MM-DD"
//   end    -> "AAAA-MM-DD" (si es un solo día, se puede omitir)
//   cat    -> categoría (ver "categories" abajo)
//   note   -> aclaración opcional (se ve en chico debajo del título)
//   from/to -> horario diario "HH:MM" (opcional). La cuenta regresiva abre a la hora
//             "from" del primer día y cierra a la hora "to" del último
//   period -> true para períodos largos (clases, receso): se dibujan como
//             una barrita en cada día en vez de un puntito
//   scope  -> dónde se muestra: "general" (solo inicio, es el valor por
//             defecto), "ingresantes" (solo la página de ingresantes) o
//             "both" (en las dos)
// ============================================================

const CALENDAR_DATA = {
  source: {
    label: "Calendario académico UNaB 2026",
    url: "https://www.unab.edu.ar/wp-content/uploads/2026/06/CALENDARIO-ACADEMICO-2026-actualizado.pdf",
  },

  categories: {
    clases:      { label: "Clases",                color: "#14827a" },
    inscripcion: { label: "Inscripción a cursada", color: "#2f6fed" },
    examenes:    { label: "Exámenes",              color: "#7c4dff" },
    tramites:    { label: "Trámites",              color: "#e8890c" },
    ingreso:     { label: "Ingreso",               color: "#d6336c" },
    receso:      { label: "Receso",                color: "#8a94a6" },
    feriado:     { label: "Feriado / asueto",      color: "#e63946" },
  },

  events: [
    // --- Curso de Preparación Universitaria (para el ciclo 2026) ---
    { title: "Curso de Preparación Universitaria · Pedidos de exención", start: "2025-11-19", end: "2025-11-20", cat: "ingreso" },
    { title: "Curso de Preparación Universitaria · Inscripción a cursada", start: "2025-12-15", end: "2025-12-17", cat: "ingreso" },
    { title: "Curso de Preparación Universitaria · Clases", start: "2026-02-02", end: "2026-02-28", cat: "clases", period: true },

    // --- Materias de verano ---
    { title: "Materias de verano · Inscripción a cursada", start: "2025-12-22", cat: "inscripcion" },
    { title: "Materias de verano · Clases", start: "2026-02-02", end: "2026-02-28", cat: "clases", period: true },

    // --- Exámenes finales de febrero ---
    { title: "Exámenes finales de febrero · Inscripción", start: "2026-02-02", end: "2026-02-04", cat: "examenes" },
    { title: "Exámenes finales de febrero · Mesas", start: "2026-02-09", end: "2026-02-21", cat: "examenes" },

    // --- Trámites del verano ---
    { title: "Cambio de carrera, reincorporación y simultaneidad", start: "2026-02-23", end: "2026-02-24", cat: "tramites", note: "Presentación de solicitud" },
    { title: "Baja de carrera", start: "2026-03-02", end: "2026-03-03", cat: "tramites", note: "Presentación de solicitud" },
    { title: "Solicitud de equivalencias", start: "2026-03-02", end: "2026-03-06", cat: "tramites", note: "Formulario online" },

    // --- Primer cuatrimestre ---
    { title: "1.er cuatrimestre · Inscripción a cursada", start: "2026-03-03", end: "2026-03-06", cat: "inscripcion" },
    { title: "1.er cuatrimestre · Inscripción a remanentes", start: "2026-03-09", cat: "inscripcion" },
    { title: "1.er cuatrimestre · Baja de inscripción a asignaturas", start: "2026-03-03", end: "2026-03-20", cat: "inscripcion" },
    { title: "1.er cuatrimestre · Clases", start: "2026-03-16", end: "2026-07-04", cat: "clases", period: true },
    { title: "Solicitud de equivalencias", start: "2026-07-06", end: "2026-07-08", cat: "tramites", note: "Formulario online" },

    // --- Exámenes finales de julio ---
    { title: "Exámenes finales de julio · Inscripción", start: "2026-07-09", end: "2026-07-10", cat: "examenes" },
    { title: "Exámenes finales de julio · Mesas", start: "2026-07-13", end: "2026-07-25", cat: "examenes" },

    // --- Receso y trámites de invierno ---
    { title: "Receso de invierno", start: "2026-07-27", end: "2026-08-01", cat: "receso", period: true },
    { title: "Cambio de carrera, reincorporación y simultaneidad", start: "2026-07-14", end: "2026-07-15", cat: "tramites", note: "Presentación de solicitud" },

    // --- Ingreso 2026, art. 7 L.E.S. (mayores de 25 sin título secundario) ---
    { title: "Ingreso art. 7 L.E.S. · Recepción de solicitud", start: "2026-08-03", end: "2026-08-04", cat: "ingreso", note: "Mayores de 25 años sin título secundario" },
    { title: "Ingreso art. 7 L.E.S. · Evaluación de antecedentes", start: "2026-08-05", end: "2026-08-07", cat: "ingreso" },
    { title: "Ingreso art. 7 L.E.S. · Entrevistas personales", start: "2026-08-10", end: "2026-08-14", cat: "ingreso" },
    { title: "Ingreso art. 7 L.E.S. · Publicación de nómina", start: "2026-08-17", end: "2026-08-21", cat: "ingreso" },
    { title: "Ingreso art. 7 L.E.S. · Evaluación de contenidos", start: "2026-08-31", end: "2026-09-04", cat: "ingreso" },
    { title: "Ingreso art. 7 L.E.S. · Publicación de resultados", start: "2026-09-17", end: "2026-09-18", cat: "ingreso" },

    // --- Segundo cuatrimestre ---
    { title: "2.º cuatrimestre · Inscripción a cursada", start: "2026-08-03", end: "2026-08-05", cat: "inscripcion" },
    { title: "2.º cuatrimestre · Inscripción a remanentes", start: "2026-08-06", end: "2026-08-07", cat: "inscripcion" },
    { title: "2.º cuatrimestre · Baja de inscripción a asignaturas", start: "2026-08-03", end: "2026-08-21", cat: "inscripcion" },
    { title: "2.º cuatrimestre · Clases", start: "2026-08-17", end: "2026-12-05", cat: "clases", period: true },

    // --- Trámites del segundo semestre ---
    { title: "Baja de carrera", start: "2026-10-09", end: "2026-10-10", cat: "tramites", note: "Presentación de solicitud por formulario" },
    { title: "Cambio de carrera, reincorporación y simultaneidad", start: "2026-10-26", end: "2026-11-13", cat: "tramites", note: "Presentación de solicitud" },

    // --- Ingreso 2027 (preinscripción: fechas de unab.edu.ar/inscripciones) ---
    { title: "Preinscripción a Lic. en Enfermería 2027", start: "2026-10-26", end: "2026-10-27", from: "08:00", to: "20:00", cat: "ingreso", scope: "both", note: "Online por SIU Guaraní, de 8 a 20 hs" },
    { title: "Preinscripción a las demás carreras 2027", start: "2026-11-02", end: "2026-11-13", from: "08:00", to: "20:00", cat: "ingreso", scope: "both", note: "Online por SIU Guaraní, de 8 a 20 hs" },
    { title: "Curso de Preparación Universitaria 2027 · Pedidos de exención", start: "2026-11-18", end: "2026-11-19", cat: "ingreso", scope: "both" },
    { title: "Curso de Preparación Universitaria 2027 · Inscripción a cursada", start: "2026-12-07", end: "2026-12-09", cat: "ingreso", scope: "both" },

    // --- Exámenes finales de diciembre ---
    { title: "Exámenes finales de diciembre · Inscripción", start: "2026-12-10", end: "2026-12-11", cat: "examenes" },
    { title: "Exámenes finales de diciembre · Mesas", start: "2026-12-14", end: "2026-12-26", cat: "examenes" },

    // --- Feriados y asuetos ("Fechas a considerar para la actividad académica") ---
    { title: "Año nuevo", start: "2026-01-01", cat: "feriado", note: "Feriado" },
    { title: "Carnaval", start: "2026-02-16", end: "2026-02-17", cat: "feriado", note: "Feriado" },
    { title: "Día Nacional de la Memoria por la Verdad y la Justicia", start: "2026-03-24", cat: "feriado", note: "Feriado" },
    { title: "Día del Veterano y de los Caídos en la Guerra de Malvinas", start: "2026-04-02", cat: "feriado", note: "Feriado" },
    { title: "Viernes Santo", start: "2026-04-03", cat: "feriado", note: "Asueto nodocente, docente y estudiantil" },
    { title: "Día del Trabajador", start: "2026-05-01", cat: "feriado", note: "Feriado" },
    { title: "Día del Docente Universitario", start: "2026-05-15", cat: "feriado", note: "Asueto docente y estudiantil" },
    { title: "Día de la Revolución de Mayo", start: "2026-05-25", cat: "feriado", note: "Feriado" },
    { title: "Paso a la Inmortalidad del Gral. Güemes (trasladable del 17/6)", start: "2026-06-15", cat: "feriado", note: "Feriado trasladable" },
    { title: "Paso a la Inmortalidad del Gral. Manuel Belgrano", start: "2026-06-20", cat: "feriado", note: "Feriado" },
    { title: "Día de la Independencia", start: "2026-07-09", cat: "feriado", note: "Feriado" },
    { title: "Día no laborable con fines turísticos", start: "2026-07-10", cat: "feriado", note: "Feriado" },
    { title: "Paso a la Inmortalidad del Gral. José de San Martín", start: "2026-08-17", cat: "feriado", note: "Feriado" },
    { title: "Día del Estudiante", start: "2026-09-21", cat: "feriado", note: "Asueto nodocente, docente y estudiantil" },
    { title: "Aniversario de la Creación del Partido de Almirante Brown", start: "2026-09-30", cat: "feriado", note: "Asueto nodocente, docente y estudiantil" },
    { title: "Día del Respeto a la Diversidad Cultural", start: "2026-10-12", cat: "feriado", note: "Feriado" },
    { title: "Día de la Soberanía Nacional (trasladable del 20/11)", start: "2026-11-23", cat: "feriado", scope: "both", note: "Feriado trasladable" },
    { title: "Día de las/los Trabajadores No Docentes de las Universidades Nacionales", start: "2026-11-26", cat: "feriado", note: "Asueto nodocente, docente y estudiantil" },
    { title: "Día no laborable con fines turísticos", start: "2026-12-07", cat: "feriado", scope: "both", note: "Feriado" },
    { title: "Día de la Inmaculada Concepción de María", start: "2026-12-08", cat: "feriado", scope: "both", note: "Feriado" },
    { title: "Navidad", start: "2026-12-25", cat: "feriado", scope: "both", note: "Feriado" },
  ],
};

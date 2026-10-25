// ============================================================
// CONFIGURACIÓN DEL SITIO — editá acá para personalizar todo
// ============================================================

const CONFIG = {
  profile: {
    name: "La Pulqui",
    description: "Somos el Centro de Estudiantes de nuestra querida UNaB 💙",
    avatar: "assets/avatar.png",
    instagram: "https://instagram.com/la.pulqui.unab",
  },

  // --- Pastillas junto al Instagram (accesos rápidos) ---
  // "icon" usa un ícono ya dibujado en script.js: "whatsapp" | "library" | "campus" | "clipboard"
  heroLinks: [
    // highlight: botón destacado; sameTab: se abre en la misma pestaña (link interno)
    { title: "Preinscripciones y grupos 2027", url: "ingresantes-2027.html", icon: "graduation", sameTab: true, highlight: true },
    { title: "Canal de WhatsApp", url: "https://whatsapp.com/channel/0029VaBrByaCsU9U8ftHhK3d", icon: "whatsapp" },
    { title: "Biblioteca Virtual", url: "https://drive.google.com/drive/folders/1GYbCxjDEohxmuKd-EAthOo2XGbauCM0W", icon: "library" },
    { title: "Campus Virtual", url: "https://campus.unab.edu.ar/login", icon: "campus" },
    { title: "SIU Guaraní", url: "https://inscripcion.unab.edu.ar/rectorado/", icon: "clipboard" },
  ],

  // --- Google Sheet de "Actividades abiertas" ---
  // La hoja fue creada en tu Google Drive: "La Pulqui - Actividades Abiertas"
  //
  // El sitio busca las columnas POR NOMBRE (no importa el orden ni si
  // agregás columnas nuevas al medio). Las que usa son:
  //   Fecha           -> DD/MM/AAAA (ej: 15/10/2026). Vacía = "a definir".
  //   Nombre          -> título de la actividad
  //   Activo          -> tiene que decir exactamente "Si" para que se
  //                      muestre; cualquier otro valor la oculta aunque
  //                      tenga fecha y link cargados.
  //   Link            -> a dónde lleva el botón (form de inscripción, etc.)
  //   Últimos cupos   -> "Si" muestra la cintita roja "ÚLTIMOS CUPOS".
  //                      La mantiene al día sola el script de Apps Script
  //                      (ver más abajo), comparando "Maximo de cupos"
  //                      contra las respuestas del form. No hace falta
  //                      tocarla a mano.
  //
  // Otras columnas (ID ACTIVIDAD, ID FORM, Maximo de cupos) son para uso
  // interno del script de Google Sheets, el sitio no las lee.
  //
  // IMPORTANTE: para que la página pueda leer la hoja sin que vos tengas que
  // tocar el código cada vez, la hoja tiene que estar compartida como
  // "Cualquier persona con el enlace" → "Lector".
  // Abrí la hoja, tocá "Compartir" arriba a la derecha, y cambiá el acceso
  // general a "Cualquier persona con el enlace".
  sheet: {
    id: "1wR0ewHbHy_MNoJ8sWZMwDF-fOBnfMp9FAjSUbSo11PM",
    gid: "717376071", // pestaña (tab) dentro de la hoja
    // cada cuánto se vuelve a chequear la hoja mientras la página está abierta (ms)
    refreshMs: 5 * 60 * 1000,
  },

  // --- Carrusel de tarjetas con imagen (igual que "GRUPOS INGRESANTES") ---
  groups: {
    title: "GRUPOS INGRESANTES 2026",
    subtitle: "WhatsApp Community",
    items: [
      { title: "Enseñanza de la Matemática", url: "https://chat.whatsapp.com/EehxDilq9HJ1p4bv6Hf96w?mode=wwt", image: "assets/group-ensenanza-matematica.jpeg" },
      { title: "Logística y Transporte", url: "https://chat.whatsapp.com/CITEV8fglaFHx1utbVnBQw?mode=wwt", image: "assets/group-logistica-transporte.jpeg" },
      { title: "Administración + Gestión de las Organizaciones", url: "https://chat.whatsapp.com/DwXDS2NdeYYAyj06cQmd0j?mode=wwt", image: "assets/group-administracion-gestion.jpeg" },
      { title: "Ciencias de datos", url: "https://chat.whatsapp.com/KQwVKeKKCdtIHHTQm4roOS?mode=wwt", image: "assets/group-ciencias-datos.jpeg" },
      { title: "Ciencia política", url: "https://chat.whatsapp.com/GBel95l9gWpHnM1nYkWC8Q?mode=wwt", image: "assets/group-ciencia-politica.jpeg" },
      { title: "Comunicación digital", url: "https://chat.whatsapp.com/EjA639cpVHbLJS5N1CdQzv?mode=wwt", image: "assets/group-comunicacion-digital.jpeg" },
      { title: "Diseño y desarrollo de producto", url: "https://chat.whatsapp.com/ECFMRUOIrdmD11ewsEz40O?mode=wwt", image: "assets/group-diseno-producto.jpeg" },
      { title: "Enfermería", url: "https://chat.whatsapp.com/BshWCvMGh2HF4C8rEkb1ZO?mode=wwt", image: "assets/group-enfermeria.jpeg" },
      { title: "Programación", url: "https://chat.whatsapp.com/GEX4b2EWqVU2rRZsz33L96?mode=wwt", image: "assets/group-programacion.jpeg" },
      { title: "Acompañamiento terapéutico", url: "https://chat.whatsapp.com/COmGjzmpmqfF49mbfIO8jp?mode=wwt", image: "assets/group-acompanamiento-terapeutico.jpeg" },
      { title: "automatización y control", url: "https://chat.whatsapp.com/KCbPJ1SypDOC8cQroqNu0k?mode=wwt", image: "assets/group-automatizacion-control.jpeg" },
    ],
  },

  // --- Preinscripciones 2027 (paso 1 de ingresantes-2027.html).
  // Fuente: https://www.unab.edu.ar/inscripciones/
  // Cada bloque: label (título), dates (fechas en texto), start/end (AAAA-MM-DD,
  // para el cartelito "Abierta ahora / Cerrada"), url, button (texto del botón)
  // y, opcional, careers (lista visible; cada una con name y url a su página en
  // unab.edu.ar/carreras) e infoUrl (link "Ver información de la carrera").
  // Para sacar la sección entera, borrá "enrollment".
  enrollment: {
    title: "Preinscribite",
    help: "Es online, por el SIU Guaraní, de 8 a 20 hs. Elegí tu carrera y tocá el botón.",
    sourceUrl: "https://www.unab.edu.ar/inscripciones/",
    blocks: [
      {
        label: "Licenciatura en Enfermería",
        dates: "26 y 27 de octubre",
        start: "2026-10-26",
        end: "2026-10-27",
        url: "https://www.unab.edu.ar/inscripcion-enfermeria",
        button: "Preinscribirme en Enfermería",
        infoUrl: "https://www.unab.edu.ar/lic-enfermeria/",
      },
      {
        label: "Todas las demás carreras",
        dates: "Del 2 al 13 de noviembre",
        start: "2026-11-02",
        end: "2026-11-13",
        url: "https://www.unab.edu.ar/inscripcion-carreras",
        button: "Preinscribirme en mi carrera",
        careers: [
          { name: "Tecnicatura en Ciencias de Datos", url: "https://www.unab.edu.ar/tec-ciencias-datos/" },
          { name: "Tecnicatura en Acompañamiento Terapéutico", url: "https://www.unab.edu.ar/tec-acomp-terapeutico/" },
          { name: "Tecnicatura en Programación", url: "https://www.unab.edu.ar/programacion/" },
          { name: "Tecnicatura en Comunicación Digital", url: "https://www.unab.edu.ar/tec-comunicacion-digital/" },
          { name: "Tecnicatura en Automatización y Control", url: "https://www.unab.edu.ar/automatizacion/" },
          { name: "Tecnicatura en Diseño y Desarrollo de Producto", url: "https://www.unab.edu.ar/tec-desarrollo-producto/" },
          { name: "Tecnicatura Gestión de las Organizaciones", url: "https://www.unab.edu.ar/gestion/" },
          { name: "Tecnicatura en Logística y Transporte", url: "https://www.unab.edu.ar/logistica/" },
          { name: "Tecnicatura en Prótesis Dental", url: "https://www.unab.edu.ar/protesis-dental/" },
          { name: "Licenciatura en Ciencia Política", url: "https://www.unab.edu.ar/lic-ciencia-politica/" },
          { name: "Licenciatura en Ciencias de Datos", url: "https://www.unab.edu.ar/lic-ciencia-datos/" },
          { name: "Licenciatura en Logística y Transporte", url: "https://www.unab.edu.ar/lic-logistica-transporte/" },
          { name: "Licenciatura en Administración", url: "https://www.unab.edu.ar/lic-administracion/" },
          { name: "(CCC) Licenciatura en Enseñanza de la Matemática", url: "https://www.unab.edu.ar/ccc-matematica/" },
        ],
      },
    ],
  },

  // --- Página de ingresantes 2027 (ingresantes-2027.html) ---
  // "keywords": palabras extra que también encuentra el buscador (ej: "tec" o
  // "lic" para Administración). El buscador ignora tildes y mayúsculas.
  // "sort": con qué nombre se ordena alfabéticamente la tarjeta (por defecto, su título).
  groups2027: {
    title: "Ingreso 2027", // título de la pestaña del navegador
    heading: "INGRESO 2027", // título grande de la página
    description: "Todo lo que necesitás para inscribirte 💙",
    // así se ve en el carrusel de la página de inicio
    carouselTitle: "GRUPOS INGRESANTES 2027",
    subtitle: "WhatsApp Community",
    items: [
      { title: "Enfermería", url: "https://chat.whatsapp.com/DgLYeO88208GU4U5cWG4Hw?s=cl&p=a&mlu=4&ilr=4", image: "assets/group2027-enfermeria.jpg" },
      { title: "CCC en Enseñanza de la Matemática", url: "https://chat.whatsapp.com/FfwjIombA7nDB3AeoS0TTy?s=cl&p=a&mlu=4&ilr=4", image: "assets/group2027-ensenanza-matematica.jpg", sort: "Enseñanza de la Matemática", keywords: "ccc matematica profesorado" },
      { title: "Ciencia de Datos", url: "https://chat.whatsapp.com/JXSqU6Pi78p7a1jYT1tApc?s=cl&p=a&mlu=4&ilr=4", image: "assets/group2027-ciencia-de-datos.jpg" },
      { title: "Automatización y Control", url: "https://chat.whatsapp.com/IwTZjg4LQEpDWKdrPtgilY?s=cl&p=a&mlu=4&ilr=4", image: "assets/group2027-automatizacion-control.jpg" },
      { title: "Programación", url: "https://chat.whatsapp.com/EAFbJmdIzkR3pg35jc91W5?s=cl&p=a&mlu=4&ilr=4", image: "assets/group2027-programacion.jpg" },
      { title: "Logística y Transporte", url: "https://chat.whatsapp.com/GI9dPbjsZ2JDBYs1A8dOFm?s=cl&p=a&mlu=4&ilr=4", image: "assets/group2027-logistica-transporte.jpg" },
      { title: "Acompañamiento Terapéutico", url: "https://chat.whatsapp.com/CEgW1anDGcJJLtVjAW0oJ3?s=cl&p=a&mlu=4&ilr=4", image: "assets/group2027-acompanamiento-terapeutico.jpg" },
      { title: "Comunicación Digital", url: "https://chat.whatsapp.com/GB8sOpQzxpfA6VYab3nGKj?s=cl&p=a&mlu=4&ilr=4", image: "assets/group2027-comunicacion-digital.jpg" },
      { title: "Diseño y Desarrollo de Producto", url: "https://chat.whatsapp.com/COfWAiNLIrxCXqPKJKO0Z3?s=cl&p=a&mlu=4&ilr=4", image: "assets/group2027-diseno-producto.jpg" },
      { title: "Tec. en Gestión / Lic. en Administración", url: "https://chat.whatsapp.com/KkdEmmC3eNv8gL5foAxWYA?s=cl&p=a&mlu=4&ilr=4", image: "assets/group2027-administracion-gestion.jpg", sort: "Administración", keywords: "tecnicatura licenciatura administracion gestion organizaciones" },
      { title: "Ciencia Política", url: "https://chat.whatsapp.com/KlVO420cg4413VI16cpdDJ?s=cl&p=a&mlu=4&ilr=4", image: "assets/group2027-ciencia-politica.jpg" },
      { title: "Prótesis Dental", url: "https://chat.whatsapp.com/EegMHBna0wvGC3QPnMZ9VG?s=cl&p=a&mlu=4&ilr=4", image: "assets/group2027-protesis-dental.jpg", keywords: "odontologia dientes" },
    ],
  },

  // --- Secciones de links "fijos" extra (hoy vacío: todo vive en heroLinks) ---
  sections: [],
};

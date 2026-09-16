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

  // --- Secciones de links "fijos" extra (hoy vacío: todo vive en heroLinks) ---
  sections: [],
};

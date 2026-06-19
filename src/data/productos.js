// ---------------------------------------------------------------------------
// DATOS DE LA TIENDA  ·  src/data/productos.js
// ---------------------------------------------------------------------------
// Este es el ÚNICO sitio donde editas tus productos. Tanto la tienda de la
// home como cada página de producto leen de aquí.
//
// Para añadir un producto nuevo: copia un bloque { ... } entero y rellena.
//
// Campos:
//   slug          -> la dirección de su página. slug "x" => sadocmix.com/recursos/x
//                    (solo minúsculas, sin espacios ni acentos, guiones para separar)
//   badge         -> etiqueta (Vocal Chain / Plantilla / Curso / Gratis)
//   title, price  -> título y precio ("Gratis" pinta el precio en naranja)
//   cover         -> imagen de portada. Súbela a public/img/ y pon "/img/archivo.jpg".
//                    Vacío "" = se muestra un icono por defecto.
//   comprarLink   -> enlace de pago (Stripe/Gumroad). Vacío "" = botón sin enlace aún.
//   tagline       -> frase corta bajo el título
//   descripcionLarga -> párrafo de descripción
//   puntos        -> tarjetas de "qué hace" [{ titulo, texto }]
//   plugins       -> [{ nombre, empresa }]  (déjalo [] si no aplica, p.ej. un curso)
//   requisitos    -> texto de compatibilidad / qué hace falta
//   incluye       -> lista de lo que se lleva el comprador [textos]
//   demoAntes / demoDespues -> audio del MISMO fragmento sin y con la cadena.
//                    Súbelos a public/audio/. Vacíos = no aparece el reproductor A/B.
//   video         -> enlace de YouTube o Vimeo. Vacío = no aparece la sección de vídeo.
// ---------------------------------------------------------------------------

export const PRODUCTOS = [
  {
    slug: "cadena-vocal-beele",
    badge: "Vocal Chain",
    title: "Cadena Vocal — Beele",
    price: "19€",
    cover: "/img/productos/cadena-vocal-beele.png",
    comprarLink: "",
    // Versiones por DAW. Cada una con su enlace de pago/descarga, sus requisitos
    // y su lista de "qué incluye" — la página se actualiza al elegir el DAW.
    // Quita o añade DAW libremente. Si dejas 'daws' fuera, no aparece el desplegable.
    daws: [
      {
        nombre: "Ableton Live",
        comprarLink: "",
        requisitos: "Ableton Live 11 o superior. Necesitas tener instalados los plugins listados.",
        incluye: [
          "Cadena de voz para Ableton Live (.adg)",
          "Versión para voz principal y para coros",
          "Guía rápida de instalación en PDF",
        ],
      },
      {
        nombre: "FL Studio",
        comprarLink: "",
        requisitos: "FL Studio 21 o superior. Necesitas tener instalados los plugins listados.",
        incluye: [
          "Preset de cadena de voz para FL Studio",
          "Versión para voz principal y para coros",
          "Guía rápida de instalación en PDF",
        ],
      },
      {
        nombre: "Logic Pro",
        comprarLink: "",
        requisitos: "Logic Pro 10.7 o superior. Necesitas tener instalados los plugins listados.",
        incluye: [
          "Channel Strip de voz para Logic Pro",
          "Versión para voz principal y para coros",
          "Guía rápida de instalación en PDF",
        ],
      },
      {
        nombre: "Pro Tools",
        comprarLink: "",
        requisitos: "Pro Tools 2022 o superior. Necesitas tener instalados los plugins listados.",
        incluye: [
          "Track Preset de voz para Pro Tools",
          "Versión para voz principal y para coros",
          "Guía rápida de instalación en PDF",
        ],
      },
      {
        nombre: "Studio One",
        comprarLink: "",
        requisitos: "Studio One 6 o superior. Necesitas tener instalados los plugins listados.",
        incluye: [
          "FX Chain de voz para Studio One",
          "Versión para voz principal y para coros",
          "Guía rápida de instalación en PDF",
        ],
      },
    ],
    tagline: "El carácter cálido y pegado de Beele, listo para cargar.",
    descripcionLarga:
      "Una cadena de voz completa, afinada para el tono cálido y cercano de Beele. Presencia, cuerpo y un fondo de delays y reverbs ya equilibrado, para que solo tengas que cargar tu toma y cantar.",
    puntos: [
      { titulo: "Afinación natural", texto: "Corrección sutil que mantiene la voz humana, sin sonar robótica." },
      { titulo: "Presencia y aire", texto: "EQ que despeja la voz y la coloca delante de la instrumental." },
      { titulo: "Espacio de serie", texto: "Delays y reverbs en paralelo ya enrutados y nivelados." },
    ],
    plugins: [
      { nombre: "Pro-Q 3", empresa: "FabFilter" },
      { nombre: "Pro-C 2", empresa: "FabFilter" },
      { nombre: "VintageVerb", empresa: "Valhalla DSP" },
      { nombre: "Decapitator", empresa: "Soundtoys" },
    ],
    requisitos: "Ableton Live 11 o superior. Necesitas tener instalados los plugins listados.",
    incluye: [
      "Cadena de voz lista para cargar",
      "Versión para voz principal y para coros",
      "Guía rápida de instalación en PDF",
    ],
    demoAntes: "",
    demoDespues: "",
    video: "",
  },

  {
    slug: "template-vocal-fx-reggaeton",
    badge: "Plantilla",
    title: "Template Vocal FX — Reggaetón",
    price: "24€",
    cover: "/img/productos/template-vocal-fx.png",
    comprarLink: "",
    daws: [
      {
        nombre: "Ableton Live",
        comprarLink: "",
        requisitos: "Ableton Live 11 o superior. Necesitas tener instalados los plugins listados.",
        incluye: [
          "Sesión de Ableton Live con los FX enrutados",
          "Buses de reverb, delay y paralelos etiquetados",
          "Guía rápida de uso en PDF",
        ],
      },
      {
        nombre: "FL Studio",
        comprarLink: "",
        requisitos: "FL Studio 21 o superior. Necesitas tener instalados los plugins listados.",
        incluye: [
          "Proyecto de FL Studio con los FX enrutados",
          "Buses de reverb, delay y paralelos etiquetados",
          "Guía rápida de uso en PDF",
        ],
      },
      {
        nombre: "Logic Pro",
        comprarLink: "",
        requisitos: "Logic Pro 10.7 o superior. Necesitas tener instalados los plugins listados.",
        incluye: [
          "Proyecto de Logic Pro con los FX enrutados",
          "Buses de reverb, delay y paralelos etiquetados",
          "Guía rápida de uso en PDF",
        ],
      },
      {
        nombre: "Pro Tools",
        comprarLink: "",
        requisitos: "Pro Tools 2022 o superior. Necesitas tener instalados los plugins listados.",
        incluye: [
          "Sesión de Pro Tools con los FX enrutados",
          "Buses de reverb, delay y paralelos etiquetados",
          "Guía rápida de uso en PDF",
        ],
      },
      {
        nombre: "Studio One",
        comprarLink: "",
        requisitos: "Studio One 6 o superior. Necesitas tener instalados los plugins listados.",
        incluye: [
          "Canción de Studio One con los FX enrutados",
          "Buses de reverb, delay y paralelos etiquetados",
          "Guía rápida de uso en PDF",
        ],
      },
    ],
    tagline: "Reverbs, delays y cadenas en paralelo ya enrutadas para reggaetón.",
    descripcionLarga:
      "Plantilla de efectos de voz pensada para reggaetón: todos los envíos, reverbs, delays y procesos en paralelo ya creados y nivelados. Arrastras tu toma, la mandas a los sends y tienes el ambiente listo.",
    puntos: [
      { titulo: "Envíos listos", texto: "Reverbs y delays en buses aparte, ya mezclados con la voz." },
      { titulo: "Paralelos creativos", texto: "Cadenas de saturación y compresión paralela para más pegada." },
      { titulo: "Sesión ordenada", texto: "Todo etiquetado y por colores para que encuentres cada cosa rápido." },
    ],
    plugins: [
      { nombre: "Chorus JUN-6", empresa: "Arturia" },
      { nombre: "EC300", empresa: "McDSP" },
      { nombre: "Unfiltered Audio Fault", empresa: "Plugin Alliance" },
      { nombre: "TSAR-1 Reverb", empresa: "Softube" },
      { nombre: "AIR Chorus", empresa: "AIR Music Technology" },
      { nombre: "AIR Ensemble", empresa: "AIR Music Technology" },
      { nombre: "AIR Lo-Fi", empresa: "AIR Music Technology" },
      { nombre: "Auto-Tune EFX AAX", empresa: "Antares" },
      { nombre: "EQ3 7-Band", empresa: "Avid" },
      { nombre: "Lo-Fi", empresa: "Avid" },
      { nombre: "D-Verb", empresa: "Avid" },
      { nombre: "Trim", empresa: "Avid" },
      { nombre: "Stratus3D", empresa: "Exponential Audio" },
      { nombre: "Symphony3D", empresa: "Exponential Audio" },
      { nombre: "FabFilter Pro-C 2", empresa: "FabFilter" },
      { nombre: "FabFilter Pro-Q 3", empresa: "FabFilter" },
      { nombre: "FabFilter Pro-R 2", empresa: "FabFilter" },
      { nombre: "TR5JoeChiccarelliVclStrp", empresa: "IK Multimedia" },
      { nombre: "MH ChannelStrip", empresa: "Metric Halo" },
      { nombre: "Raum", empresa: "Native Instruments" },
      { nombre: "Purple Audio MC 77", empresa: "Plugin Alliance" },
      { nombre: "bx_digital V3", empresa: "Plugin Alliance" },
      { nombre: "bx_opto", empresa: "Plugin Alliance" },
      { nombre: "PrimalTap", empresa: "SoundToys" },
      { nombre: "Little Plate", empresa: "SoundToys" },
      { nombre: "FilterFreak1", empresa: "SoundToys" },
      { nombre: "EchoBoy", empresa: "SoundToys" },
      { nombre: "EchoBoy Jr", empresa: "SoundToys" },
      { nombre: "MicroShift", empresa: "SoundToys" },
      { nombre: "Crystallizer", empresa: "SoundToys" },
      { nombre: "Little AlterBoy", empresa: "SoundToys" },
      { nombre: "PanMan", empresa: "SoundToys" },
      { nombre: "EffectRack", empresa: "SoundToys" },
      { nombre: "TAL-Chorus-LX", empresa: "TAL-Togu Audio Line" },
      { nombre: "UADx Studio D Chorus", empresa: "Universal Audio / UADx" },
      { nombre: "ValhallaRoom", empresa: "Valhalla DSP" },
      { nombre: "ValhallaSpaceModulator", empresa: "Valhalla DSP" },
      { nombre: "ValhallaDelay", empresa: "Valhalla DSP" },
      { nombre: "ValhallaSupermassive", empresa: "Valhalla DSP" },
      { nombre: "ValhallaVintageVerb", empresa: "Valhalla DSP" },
      { nombre: "CLA-76", empresa: "Waves Audio" },
      { nombre: "Abbey Road Reel ADT", empresa: "Waves Audio" },
      { nombre: "RCompressor", empresa: "Waves Audio" },
      { nombre: "Brauer Motion", empresa: "Waves Audio" },
      { nombre: "CLA Effects", empresa: "Waves Audio" },
      { nombre: "IRLive", empresa: "Waves Audio" },
      { nombre: "MetaFlanger", empresa: "Waves Audio" },
      { nombre: "GTR Stomp 4", empresa: "Waves Audio" },
      { nombre: "H-Delay", empresa: "Waves Audio" },
      { nombre: "MV2", empresa: "Waves Audio" },
      { nombre: "Scheps 73", empresa: "Waves Audio" },
      { nombre: "OneKnob Pumper", empresa: "Waves Audio" },
      { nombre: "RVerb", empresa: "Waves Audio" },
      { nombre: "RVox", empresa: "Waves Audio" },
      { nombre: "TrueVerb", empresa: "Waves Audio" },
      { nombre: "Abbey Road Chambers", empresa: "Waves Audio" },
      { nombre: "SuperTap 2-Taps", empresa: "Waves Audio" },
      { nombre: "SuperTap 6-Taps", empresa: "Waves Audio" },
      { nombre: "Waves Tune Real-Time", empresa: "Waves Audio" },
      { nombre: "Doubler4", empresa: "Waves Audio" },
      { nombre: "Doubler2", empresa: "Waves Audio" },
      { nombre: "Cassette", empresa: "Wavesfactory" },
      { nombre: "Trackspacer 2.5", empresa: "Wavesfactory" },
      { nombre: "RC-20 Retro Color", empresa: "XLN Audio" },
      { nombre: "Neutron 3 Elements", empresa: "iZotope" },
    ],
    pluginStats: {
      distintos: 65,
      instancias: 203,
    },
    requisitos: "Ableton Live 11 o superior. Necesitas tener instalados los plugins listados.",
    incluye: [
      "Sesión de Ableton con los FX enrutados",
      "Buses de reverb, delay y paralelos etiquetados",
      "Guía rápida de uso en PDF",
    ],
    demoAntes: "",
    demoDespues: "",
    video: "",
  },

  {
    slug: "mastering-desde-cero",
    badge: "Curso",
    title: "Mastering desde Cero",
    price: "89€",
    cover: "",
    comprarLink: "",
    tagline: "Aprende a masterizar tus propios temas, paso a paso.",
    descripcionLarga:
      "Un curso práctico que te lleva desde la preparación del mix hasta la cadena de mastering final y los niveles correctos para streaming. Sin teoría de relleno: solo lo que necesitas para que tus temas suenen competitivos.",
    puntos: [
      { titulo: "Paso a paso", texto: "Cada módulo es una etapa concreta del proceso, en orden." },
      { titulo: "Con proyecto real", texto: "Sigues el curso sobre una sesión de ejemplo descargable." },
      { titulo: "Niveles para streaming", texto: "Cómo entregar a la sonoridad correcta para Spotify y Apple Music." },
    ],
    plugins: [],
    requisitos: "Cualquier DAW. Recomendado tener nociones básicas de mezcla.",
    incluye: [
      "Más de 4 horas de vídeo",
      "Proyecto de Ableton de ejemplo",
      "Cadena de mastering descargable",
      "Acceso de por vida y actualizaciones",
    ],
    demoAntes: "",
    demoDespues: "",
    video: "",
  },

  {
    slug: "starter-pack-vocal-chain-ableton",
    badge: "Gratis",
    title: "Starter Pack — Vocal Chain Ableton",
    price: "Gratis",
    cover: "",
    comprarLink: "",
    tagline: "Una cadena de voz sencilla, solo con plugins de fábrica de Ableton.",
    descripcionLarga:
      "El punto de partida perfecto: una cadena de voz limpia montada únicamente con plugins de serie de Ableton, para que entiendas el flujo sin instalar nada extra.",
    puntos: [
      { titulo: "Sin plugins externos", texto: "Funciona solo con lo que ya trae Ableton de fábrica." },
      { titulo: "Ideal para aprender", texto: "Cada plugin etiquetado para que veas qué hace y por qué." },
    ],
    plugins: [
      { nombre: "EQ Eight", empresa: "Ableton (de serie)" },
      { nombre: "Glue Compressor", empresa: "Ableton (de serie)" },
      { nombre: "Reverb", empresa: "Ableton (de serie)" },
    ],
    requisitos: "Ableton Live 11 o superior. No necesita plugins externos.",
    incluye: [
      "Cadena de voz en formato Ableton",
      "Plugins de fábrica ya etiquetados",
    ],
    demoAntes: "",
    demoDespues: "",
    video: "",
  },
];

// Busca un producto por su slug. Devuelve null si no existe.
export function getProducto(slug) {
  return PRODUCTOS.find((p) => p.slug === slug) || null;
}

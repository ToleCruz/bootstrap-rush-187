// ===== Bootstrap Rush 187 · Niveles =====
// Cada nivel: html con huecos {0}, {1}...; sol = clases correctas de cada hueco;
// req = clases que SÍ o SÍ deben escribirse en ese hueco (cuando el resultado visual podría engañar).
// data-k marca los elementos que el juego compara entre el objetivo y tu diseño.

const MUNDOS = [
  { id: 1, nombre: "Pinta y espacia", icono: "🎨", tema: "Utilidades: colores, espaciado, texto y bordes", color: "#ff4fa3", insignia: "pintor" },
  { id: 2, nombre: "FlexLab", icono: "📦", tema: "Flexbox con Bootstrap", color: "#22d3ee", insignia: "flex" },
  { id: 3, nombre: "Ciudad Grid", icono: "🧱", tema: "Sistema de rejilla y diseño responsivo", color: "#a3e635", insignia: "grid" },
  { id: 4, nombre: "Fábrica de componentes", icono: "🧩", tema: "Botones, badges, alertas, cards y listas", color: "#fbbf24", insignia: "componentes" },
  { id: 5, nombre: "Jefe final: Dashboard PAEC", icono: "📊", tema: "Todo junto: el panel contra el acoso escolar", color: "#f87171", insignia: "campeon" }
];

const CAJAS = `
    <div data-k="b1" class="caja">A</div>
    <div data-k="b2" class="caja">B</div>
    <div data-k="b3" class="caja">C</div>`;

const NIVELES = [
  // ---------------- MUNDO 1 · Utilidades ----------------
  { m: 1, t: "La etiqueta del CBTis", mision: "Pinta el fondo de azul (primary) y las letras de blanco.",
    html: `<div data-k="a" class="{0}">CBTis No. 187</div>`,
    sol: ["bg-primary text-white"],
    pistas: ["Los fondos empiezan con bg- y los colores de texto con text-.", "Usa bg-primary y text-white."],
    aprende: "bg-* cambia el color de fondo y text-* el color de la letra. Los colores de Bootstrap son primary, secondary, success, danger, warning, info, light y dark." },

  { m: 1, t: "Dale aire", mision: "La caja verde está apretada. Dale relleno (padding) de tamaño 4 por todos lados.",
    html: `<div data-k="a" class="bg-success text-white {0}">Programación 3AV</div>`,
    sol: ["p-4"],
    pistas: ["El relleno interno es padding: la clase empieza con p-.", "p-4 pone relleno de tamaño 4 en los cuatro lados."],
    aprende: "p-0 a p-5 es el relleno interno. Con pt-, pb-, ps-, pe-, px- y py- eliges el lado." },

  { m: 1, t: "Mensaje que se nota", mision: "Centra el texto, ponlo en negritas y de color rojo (danger).",
    html: `<p data-k="a" class="{0}">Cero tolerancia al acoso escolar</p>`,
    sol: ["text-center fw-bold text-danger"],
    pistas: ["Necesitas 3 clases: alineación, grosor y color.", "text-center, fw-bold y text-danger."],
    aprende: "text-start, text-center y text-end alinean; fw-bold, fw-normal y fw-light cambian el grosor." },

  { m: 1, t: "Marco de aviso", mision: "Ponle borde amarillo (warning) de grosor 3 y esquinas redondeadas tamaño 3.",
    html: `<div data-k="a" class="p-3 {0}">⚠️ Aviso importante para 3AV</div>`,
    sol: ["border border-warning border-3 rounded-3"],
    pistas: ["Primero activa el borde con border; luego color, grosor y redondeo.", "border border-warning border-3 rounded-3"],
    aprende: "border activa el borde, border-{color} lo pinta, border-1 a border-5 da el grosor y rounded-* redondea las esquinas." },

  { m: 1, t: "JEFE · Cartel #NoAlAcoso", jefe: true,
    mision: "Arma el cartel: fondo rojo, letra blanca, relleno 4, esquinas rounded-4, sombra y texto centrado. El título va en negritas con margen abajo 2.",
    html: `<div class="bg-light p-3">
  <div data-k="a" class="{0}">
    <h5 data-k="b" class="{1}">#NoAlAcoso</h5>
    <p data-k="c" class="mb-0">Si lo ves, repórtalo. 💬</p>
  </div>
</div>`,
    sol: ["bg-danger text-white p-4 rounded-4 shadow text-center", "fw-bold mb-2"],
    pistas: ["Para el contenedor: bg-, text-, p-, rounded-, shadow y text-center.", "Contenedor: bg-danger text-white p-4 rounded-4 shadow text-center · Título: fw-bold mb-2"],
    aprende: "¡Combinaste 8 utilidades sin escribir ni una línea de CSS! Así se trabaja con un framework." },

  // ---------------- MUNDO 2 · Flexbox ----------------
  { m: 2, t: "Todos en fila", mision: "Las cajas están una debajo de otra. Ponlas en fila convirtiendo el contenedor en flex.",
    html: `<div data-k="a" class="contenedor {0}">${CAJAS}
</div>`,
    sol: ["d-flex"],
    pistas: ["La clase empieza con d- (display).", "d-flex"],
    aprende: "d-flex convierte al contenedor en flexbox y sus hijos se acomodan en fila." },

  { m: 2, t: "Al centro", mision: "Centra las cajas horizontalmente.",
    html: `<div data-k="a" class="contenedor d-flex {0}">${CAJAS}
</div>`,
    sol: ["justify-content-center"],
    pistas: ["En horizontal manda justify-content-*.", "justify-content-center"],
    aprende: "justify-content-start, center, end, between, around y evenly reparten los elementos sobre el eje principal." },

  { m: 2, t: "Sepáralos", mision: "Manda la primera caja a la izquierda, la última a la derecha y la de en medio al centro.",
    html: `<div data-k="a" class="contenedor d-flex {0}">${CAJAS}
</div>`,
    sol: ["justify-content-between"],
    pistas: ["Es un justify-content que deja el espacio ENTRE las cajas.", "justify-content-between"],
    aprende: "between pega los extremos a las orillas y reparte el espacio entre los elementos." },

  { m: 2, t: "Centro perfecto", mision: "El contenedor es alto. Centra las cajas en horizontal Y en vertical.",
    html: `<div data-k="a" class="contenedor d-flex {0}" style="height:170px">${CAJAS}
</div>`,
    sol: ["justify-content-center align-items-center"],
    pistas: ["Horizontal = justify-content; vertical = align-items.", "justify-content-center align-items-center"],
    aprende: "align-items-* acomoda sobre el eje cruzado (vertical cuando hay fila). Con las dos clases logras el centro perfecto." },

  { m: 2, t: "Torre", mision: "Apila las cajas en columna y pégalas a la derecha.",
    html: `<div data-k="a" class="contenedor d-flex {0}">${CAJAS}
</div>`,
    sol: ["flex-column align-items-end"],
    pistas: ["flex-column cambia la dirección. Ojo: ahora el eje cruzado es el horizontal.", "flex-column align-items-end"],
    aprende: "Con flex-column el eje principal es vertical, así que align-items mueve los elementos a izquierda o derecha." },

  { m: 2, t: "Espacio entre amigos", mision: "Deja un hueco de tamaño 4 entre las cajas, sin usar márgenes.",
    html: `<div data-k="a" class="contenedor d-flex {0}">${CAJAS}
</div>`,
    sol: ["gap-4"],
    pistas: ["Hay una utilidad para el espacio entre hijos de un flex: gap-*.", "gap-4"],
    aprende: "gap-* separa los elementos de un flex o grid sin tocar sus márgenes." },

  { m: 2, t: "JEFE · Barra del PAEC", jefe: true,
    mision: "Arma la barra: logo a la izquierda, menú a la derecha, todo centrado en vertical. Los enlaces del menú en fila con gap 3.",
    html: `<nav data-k="a" class="bg-dark text-white p-3 {0}">
  <span data-k="l" class="fw-bold">🛡️ PAEC 187</span>
  <div data-k="m" class="{1}">
    <a data-k="e1" class="text-white">Inicio</a>
    <a data-k="e2" class="text-white">Reportar</a>
    <a data-k="e3" class="text-white">Ayuda</a>
  </div>
</nav>`,
    sol: ["d-flex justify-content-between align-items-center", "d-flex gap-3"],
    pistas: ["La barra necesita d-flex, un justify-content y un align-items. El menú, d-flex y gap.", "Barra: d-flex justify-content-between align-items-center · Menú: d-flex gap-3"],
    aprende: "Así se arman casi todas las barras de navegación: un flex que separa logo y menú, y otro flex dentro del menú." },

  // ---------------- MUNDO 3 · Grid ----------------
  { m: 3, t: "Primera fila", mision: "Crea una fila con dos columnas del mismo ancho.",
    html: `<div class="container-fluid">
  <div data-k="r" class="{0}">
    <div data-k="c1" class="{1}"><div class="celda">1</div></div>
    <div data-k="c2" class="{1}"><div class="celda">2</div></div>
  </div>
</div>`,
    sol: ["row", "col"],
    pistas: ["La fila es row y cada columna col (las dos usan el mismo hueco).", "row · col"],
    aprende: "row crea la fila y col reparte el espacio en partes iguales. La rejilla de Bootstrap tiene 12 columnas." },

  { m: 3, t: "4 + 8 = 12", mision: "La primera columna mide 4 de 12 y la segunda 8 de 12.",
    html: `<div class="container-fluid">
  <div class="row">
    <div data-k="c1" class="{0}"><div class="celda">Menú</div></div>
    <div data-k="c2" class="{1}"><div class="celda">Contenido</div></div>
  </div>
</div>`,
    sol: ["col-4", "col-8"],
    pistas: ["col-N ocupa N de las 12 columnas.", "col-4 · col-8"],
    aprende: "Las columnas de una fila deben sumar 12: 4 + 8, 6 + 6, 3 + 9..." },

  { m: 3, t: "Canaletas", mision: "Separa las tres columnas con canaletas (gutters) de tamaño 4.",
    html: `<div class="container-fluid">
  <div data-k="r" class="row {0}">
    <div data-k="c1" class="col"><div data-k="d1" class="celda">A</div></div>
    <div data-k="c2" class="col"><div data-k="d2" class="celda">B</div></div>
    <div data-k="c3" class="col"><div data-k="d3" class="celda">C</div></div>
  </div>
</div>`,
    sol: ["g-4"],
    pistas: ["Las canaletas de la rejilla usan g-*.", "g-4"],
    aprende: "g-* agrega espacio entre columnas y filas; gx-* solo horizontal, gy-* solo vertical." },

  { m: 3, t: "Responsivo", mision: "En celular cada columna ocupa todo el ancho (12); desde pantallas medianas (md), la mitad (6).",
    html: `<div class="container-fluid">
  <div class="row g-2">
    <div data-k="c1" class="{0}"><div class="celda">Noticias</div></div>
    <div data-k="c2" class="{0}"><div class="celda">Eventos</div></div>
  </div>
</div>`,
    sol: ["col-12 col-md-6"], req: [["col-12", "col-md-6"]],
    pistas: ["Escribe dos clases: una para celular y otra con el prefijo md.", "col-12 col-md-6"],
    aprende: "col-12 aplica siempre; col-md-6 aplica desde 768 px. Así una página se ve bien en celular y en computadora." },

  { m: 3, t: "Columna al centro", mision: "Haz una columna de 6 y déjala centrada (deja 3 columnas vacías a la izquierda).",
    html: `<div class="container-fluid">
  <div class="row">
    <div data-k="c1" class="{0}"><div class="celda">Formulario de reporte</div></div>
  </div>
</div>`,
    sol: ["col-6 offset-3"],
    pistas: ["Hay una clase que deja columnas vacías antes: offset-*.", "col-6 offset-3"],
    aprende: "offset-N deja N columnas vacías a la izquierda. 3 + 6 + 3 = 12: queda centrada." },

  { m: 3, t: "JEFE · Galería de campañas", jefe: true,
    mision: "Tres tarjetas: en celular una por fila; desde md, tres por fila. Separa con canaletas de tamaño 3.",
    html: `<div class="container-fluid">
  <div data-k="r" class="row {0}">
    <div data-k="c1" class="{1}"><div class="celda">💬 Habla</div></div>
    <div data-k="c2" class="{1}"><div class="celda">🤝 Apoya</div></div>
    <div data-k="c3" class="{1}"><div class="celda">📢 Reporta</div></div>
  </div>
</div>`,
    sol: ["g-3", "col-12 col-md-4"], req: [[], ["col-12", "col-md-4"]],
    pistas: ["Fila: canaletas g-. Columnas: una clase para celular y otra para md (12 / 3 = 4).", "Fila: g-3 · Columnas: col-12 col-md-4"],
    aprende: "Con row, col-* y g-* armas galerías responsivas en segundos." },

  // ---------------- MUNDO 4 · Componentes ----------------
  { m: 4, t: "Botón de acción", mision: "Convierte el elemento en un botón verde (success) de Bootstrap.",
    html: `<button data-k="a" class="{0}">Enviar reporte</button>`,
    sol: ["btn btn-success"],
    pistas: ["Todo botón necesita la clase base btn y luego su color.", "btn btn-success"],
    aprende: "btn da la forma de botón y btn-{color} el estilo. Sin btn, el color no funciona." },

  { m: 4, t: "Botón grande con contorno", mision: "Botón con solo el contorno rojo (danger) y tamaño grande.",
    html: `<button data-k="a" class="{0}">Pedir ayuda</button>`,
    sol: ["btn btn-outline-danger btn-lg"],
    pistas: ["Los de contorno son btn-outline-{color}; el tamaño grande es btn-lg.", "btn btn-outline-danger btn-lg"],
    aprende: "btn-outline-* deja solo el borde de color; btn-sm y btn-lg cambian el tamaño." },

  { m: 4, t: "Notificaciones", mision: "Convierte el 3 en una pastilla (badge) roja y redonda.",
    html: `<h4>Mensajes <span data-k="a" class="{0}">3</span></h4>`,
    sol: ["badge text-bg-danger rounded-pill"],
    pistas: ["Necesitas badge, un color (text-bg-* o bg-*) y rounded-pill.", "badge text-bg-danger rounded-pill"],
    aprende: "badge crea etiquetas pequeñas. rounded-pill las hace ovaladas, ideales para contadores." },

  { m: 4, t: "Alerta", mision: "Convierte el mensaje en una alerta amarilla (warning).",
    html: `<div data-k="a" class="{0}" role="alert">Recuerda: el respeto también es en línea. 📱</div>`,
    sol: ["alert alert-warning"],
    pistas: ["Igual que los botones: una clase base y otra de color.", "alert alert-warning"],
    aprende: "alert + alert-{color} crea mensajes de aviso con fondo, borde y relleno listos." },

  { m: 4, t: "Card del buzón", mision: "Arma la tarjeta: el contenedor es card, el cuerpo card-body y el título card-title.",
    html: `<div data-k="a" class="{0}" style="width:16rem">
  <div data-k="b" class="{1}">
    <h5 data-k="c" class="{2}">📮 Buzón PAEC</h5>
    <p class="card-text">Cuéntanos de forma anónima.</p>
    <a class="btn btn-primary">Abrir</a>
  </div>
</div>`,
    sol: ["card", "card-body", "card-title"],
    pistas: ["Todas las clases empiezan con card.", "card · card-body · card-title"],
    aprende: "Una card se arma por partes: card (marco), card-body (relleno) y card-title, card-text, etc." },

  { m: 4, t: "Lista de contactos", mision: "Convierte la lista en un list-group de Bootstrap.",
    html: `<ul data-k="a" class="{0}">
  <li data-k="b1" class="{1}">👩‍🏫 Orientación educativa</li>
  <li data-k="b2" class="{1}">🧑‍💼 Tutor de grupo</li>
  <li data-k="b3" class="{1}">🏫 Dirección</li>
</ul>`,
    sol: ["list-group", "list-group-item"],
    pistas: ["La lista es list-group y cada elemento list-group-item.", "list-group · list-group-item"],
    aprende: "list-group quita las viñetas y le da a cada elemento borde y relleno uniformes." },

  // ---------------- MUNDO 5 · Jefe final ----------------
  { m: 5, t: "Indicadores del panel", jefe: true,
    mision: "Los 3 indicadores van en fila con gap 3. Cada uno crece para llenar el espacio (flex-fill), con relleno 3, esquinas redondeadas, letra blanca y centrado.",
    html: `<div class="bg-light p-3">
  <div data-k="a" class="{0}">
    <div data-k="k1" class="bg-primary {1}"><h3>12</h3>Reportes</div>
    <div data-k="k2" class="bg-success {1}"><h3>9</h3>Resueltos</div>
    <div data-k="k3" class="bg-warning {1}"><h3>3</h3>En proceso</div>
  </div>
</div>`,
    sol: ["d-flex gap-3", "flex-fill p-3 rounded text-white text-center"],
    pistas: ["Contenedor: d-flex y gap. Indicadores: flex-fill, p-, rounded, text-white, text-center.", "d-flex gap-3 · flex-fill p-3 rounded text-white text-center"],
    aprende: "flex-fill hace que cada hijo ocupe la misma parte del espacio disponible." },

  { m: 5, t: "JEFE FINAL · Dashboard PAEC", jefe: true,
    mision: "Termina el dashboard: barra flex (separada y centrada en vertical), fila con canaletas 3, columnas col-12 que desde md sean mitad, y cards con sombra pequeña (shadow-sm).",
    html: `<div class="bg-light p-2">
  <nav data-k="a" class="bg-dark text-white p-2 mb-3 {0}">
    <b data-k="n">📊 Dashboard PAEC</b>
    <span data-k="u" class="badge text-bg-info">3AV</span>
  </nav>
  <div data-k="r" class="row {1}">
    <div data-k="c1" class="{2}">
      <div data-k="d1" class="card {3}"><div class="card-body">🗂️ Casos atendidos: 9</div></div>
    </div>
    <div data-k="c2" class="{2}">
      <div data-k="d2" class="card {3}"><div class="card-body">📅 Próxima plática: viernes</div></div>
    </div>
  </div>
</div>`,
    sol: ["d-flex justify-content-between align-items-center", "g-3", "col-12 col-md-6", "shadow-sm"], req: [[], [], ["col-12", "col-md-6"], []],
    pistas: ["Repasa: barra del mundo 2, rejilla del mundo 3 y sombras del mundo 1.", "d-flex justify-content-between align-items-center · g-3 · col-12 col-md-6 · shadow-sm"],
    aprende: "¡Armaste un dashboard completo solo con clases de Bootstrap! Eso es dominar un framework. 🏆" }
];

const INSIGNIAS = [
  { id: "inicio", icono: "🐣", nombre: "Primer paso", desc: "Completa tu primer nivel" },
  { id: "pintor", icono: "🎨", nombre: "Pintor", desc: "Termina el mundo 1" },
  { id: "flex", icono: "📦", nombre: "Maestro Flex", desc: "Termina el mundo 2" },
  { id: "grid", icono: "🧱", nombre: "Rey del Grid", desc: "Termina el mundo 3" },
  { id: "componentes", icono: "🧩", nombre: "Arquitecto", desc: "Termina el mundo 4" },
  { id: "campeon", icono: "🏆", nombre: "Campeón PAEC", desc: "Vence al jefe final" },
  { id: "velocista", icono: "⚡", nombre: "Velocista", desc: "Termina un nivel en menos de 15 s" },
  { id: "racha3", icono: "🔥", nombre: "En llamas", desc: "Racha de 3 niveles sin pistas" },
  { id: "racha8", icono: "☄️", nombre: "Imparable", desc: "Racha de 8 niveles sin pistas" },
  { id: "ceropistas", icono: "🧠", nombre: "Cero pistas", desc: "Termina un mundo completo sin pistas" },
  { id: "perfecto", icono: "💎", nombre: "Perfeccionista", desc: "Termina los 26 niveles sin rendirte" }
];

const AVATARES = [
  { e: "🐣", pts: 0 }, { e: "🐱", pts: 0 }, { e: "🦊", pts: 400 }, { e: "🐼", pts: 900 },
  { e: "🦁", pts: 1500 }, { e: "🦄", pts: 2200 }, { e: "🐉", pts: 3000 }, { e: "🤖", pts: 3800 }, { e: "👑", pts: 4600 }
];

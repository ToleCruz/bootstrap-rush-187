// ===== Bootstrap Rush 187 · Motor del juego =====
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbze0fmUGhyC1F0x6jsSgthFDW17Pa1BfvMoZ69HoYrpa3x1jSkNEpc6UQuHHwej78_7eQ/exec";
const CLIENT_ID = "356721029050-m5ckg3gftddarim9hhsspmt4sooh3kmo.apps.googleusercontent.com";
const DOMINIO = "cbtis187.edu.mx";
const TOTAL = NIVELES.length;

const $ = id => document.getElementById(id);
let usuario = null;          // {correo, nombre, token}
let prog = nuevoProgreso();
let nivelActual = -1, inicioNivel = 0, relojId = null, pistasUsadas = 0, rendido = false, ganado = false;
let medidaObjetivo = null, medidaBase = null, sonido = true;

function nuevoProgreso() {
  return { mejor: {}, racha: 0, mejorRacha: 0, insignias: [], avatar: "🐣", tutorial: false };
}

// ---------- Guardado local ----------
function clave() { return "brush187_" + (usuario ? usuario.correo : "invitado"); }
function guardarLocal() { try { localStorage.setItem(clave(), JSON.stringify(prog)); } catch (e) {} }
function cargarLocal() {
  try { const t = localStorage.getItem(clave()); if (t) return Object.assign(nuevoProgreso(), JSON.parse(t)); } catch (e) {}
  return nuevoProgreso();
}
try { sonido = localStorage.getItem("brush187_sonido") !== "no"; } catch (e) {}

// ---------- Cálculos ----------
const totalPuntos = () => Object.values(prog.mejor).reduce((a, n) => a + (n.pts || 0), 0);
const completados = () => Object.keys(prog.mejor).length;
const hecho = i => !!prog.mejor[i];
const desbloqueado = i => i === 0 || hecho(i - 1) || hecho(i);
const nivelesDeMundo = m => NIVELES.map((n, i) => ({ n, i })).filter(x => x.n.m === m);

// ---------- Pantallas ----------
function mostrar(id) {
  ["pantallaInicio", "pantallaMapa", "pantallaNivel"].forEach(p => $(p).classList.toggle("oculto", p !== id));
  window.scrollTo(0, 0);
}
function actualizarBarra() {
  $("puntosTop").textContent = totalPuntos();
  $("rachaTop").textContent = prog.racha;
  $("chipRacha").classList.toggle("racha-on", prog.racha >= 3);
  $("chipAvatar").innerHTML = `${prog.avatar} <span id="nombreCorto">${usuario ? corto(usuario.nombre) : "Invitado"}</span>`;
  $("btnSonido").textContent = sonido ? "🔊" : "🔇";
}
function corto(n) { const p = String(n || "").trim().split(/\s+/); return p.length > 1 ? p[0] + " " + p[1][0] + "." : (p[0] || "Alumno"); }

function pintarMapa() {
  actualizarBarra();
  $("progresoTxt").textContent = `${completados()} / ${TOTAL} niveles · ${totalPuntos()} pts`;
  $("mundos").innerHTML = MUNDOS.map(mu => {
    const lista = nivelesDeMundo(mu.id);
    const abierto = desbloqueado(lista[0].i);
    const listos = lista.filter(x => hecho(x.i)).length;
    const botones = lista.map((x, k) => `<button class="niv-btn ${hecho(x.i) ? "hecho" : ""} ${x.n.jefe ? "jefe" : ""}" data-niv="${x.i}" ${desbloqueado(x.i) ? "" : "disabled"} title="${x.n.t}">${hecho(x.i) ? "✓" : (x.n.jefe ? "👾" : k + 1)}</button>`).join("");
    return `<div class="col-md-6 col-xl-4"><div class="mundo ${abierto ? "" : "bloqueado"}" style="border-color:${abierto ? mu.color : ""}">
      <div class="d-flex align-items-center gap-3 mb-2"><span class="ico">${abierto ? mu.icono : "🔒"}</span>
        <div><div class="small text-secondary">MUNDO ${mu.id}</div><div class="fw-bold fs-5" style="color:${mu.color}">${mu.nombre}</div></div></div>
      <div class="small text-secondary mb-2">${mu.tema}</div>
      <div class="estrellas mb-2">${"★".repeat(listos)}${"☆".repeat(lista.length - listos)}</div>
      <div class="d-flex flex-wrap gap-2">${botones}</div></div></div>`;
  }).join("");
  document.querySelectorAll("[data-niv]").forEach(b => b.onclick = () => abrirNivel(+b.dataset.niv));
  mostrar("pantallaMapa");
}

// ---------- Nivel ----------
function limpiarClases(v) { return String(v || "").toLowerCase().replace(/[^a-z0-9\- ]/g, "").replace(/\s+/g, " ").trim(); }
function rellenar(html, valores) { return html.replace(/\{(\d+)\}/g, (m, i) => valores[i] || ""); }
function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function codigoConHuecos(html) {
  let t = esc(html.replace(/ data-k="[^"]*"/g, "").replace(/ class=""/g, ""));
  t = t.replace(/(&lt;\/?)([a-z0-9]+)| ([a-z-]+)=/g, (m, a, tag, attr) => tag ? `${a}<span class="tag">${tag}</span>` : ` <span class="attr">${attr}</span>=`);
  return t.replace(/\{(\d+)\}/g, (m, i) => `<input class="hueco" data-slot="${i}" spellcheck="false" autocomplete="off" autocapitalize="off" size="10" aria-label="Clases del hueco ${+i + 1}">`);
}

function abrirNivel(i) {
  if (!desbloqueado(i)) return;
  const n = NIVELES[i], mu = MUNDOS[n.m - 1];
  nivelActual = i; pistasUsadas = 0; rendido = false; ganado = false;
  $("nivEtiqueta").textContent = `Mundo ${n.m} · Nivel ${nivelesDeMundo(n.m).findIndex(x => x.i === i) + 1}${n.jefe ? " · JEFE 👾" : ""}`;
  $("nivEtiqueta").style.background = mu.color; $("nivEtiqueta").style.color = "#111";
  $("nivTitulo").textContent = n.t;
  $("nivMision").textContent = n.mision;
  $("codigo").innerHTML = codigoConHuecos(n.html);
  $("pistaCaja").classList.add("oculto");
  $("btnPista").disabled = false; $("btnRendirse").disabled = false;
  $("avisoResp").textContent = "";
  $("vistaObjetivo").innerHTML = rellenar(n.html, n.sol);
  $("vistaAlumno").innerHTML = rellenar(n.html, []);
  mostrar("pantallaNivel");
  // Medimos después de que el navegador acomode todo
  requestAnimationFrame(() => {
    medidaObjetivo = medir($("vistaObjetivo"));
    medidaBase = medir($("vistaAlumno"));
    comparar();
  });
  document.querySelectorAll(".hueco").forEach(inp => {
    inp.addEventListener("input", () => {
      document.querySelectorAll(`.hueco[data-slot="${inp.dataset.slot}"]`).forEach(o => { if (o !== inp) o.value = inp.value; });
      document.querySelectorAll(".hueco").forEach(o => o.size = Math.max(10, o.value.length + 2));
      actualizarAlumno();
    });
  });
  const primero = document.querySelector(".hueco"); if (primero) primero.focus();
  clearInterval(relojId); inicioNivel = Date.now(); $("reloj").textContent = "0";
  relojId = setInterval(() => $("reloj").textContent = Math.floor((Date.now() - inicioNivel) / 1000), 500);
  if (!prog.tutorial) $("capaTutorial").classList.remove("oculto");
}

function valoresHuecos() {
  const v = [];
  document.querySelectorAll(".hueco").forEach(inp => v[+inp.dataset.slot] = limpiarClases(inp.value));
  return v;
}
function actualizarAlumno() {
  if (ganado) return;
  $("vistaAlumno").innerHTML = rellenar(NIVELES[nivelActual].html, valoresHuecos());
  comparar();
}

// Mide estilos y posiciones de los elementos marcados con data-k
const PROPS = ["display", "flex-direction", "justify-content", "align-items", "flex-wrap", "row-gap", "column-gap",
  "background-color", "color", "font-weight", "font-size", "text-align", "box-shadow",
  "padding-top", "padding-right", "padding-bottom", "padding-left", "margin-top", "margin-right", "margin-bottom", "margin-left",
  "border-top-width", "border-top-style", "border-top-color", "border-left-width", "border-bottom-width", "border-right-width", "border-top-left-radius", "border-bottom-right-radius"];
function medir(raiz) {
  const R = raiz.getBoundingClientRect(), out = {};
  raiz.querySelectorAll("[data-k]").forEach(el => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect(), d = {};
    PROPS.forEach(p => d[p] = cs.getPropertyValue(p));
    d["x"] = r.left - R.left; d["y"] = r.top - R.top; d["ancho"] = r.width; d["alto"] = r.height;
    out[el.dataset.k] = d;
  });
  return out;
}
function igual(a, b) {
  if (typeof a === "number") return Math.abs(a - b) <= 1.5;
  const na = parseFloat(a), nb = parseFloat(b);
  if (/^-?[\d.]+px$/.test(a) && /^-?[\d.]+px$/.test(b)) return Math.abs(na - nb) <= 1;
  return a === b;
}
function comparar() {
  if (!medidaObjetivo) return;
  const alumno = medir($("vistaAlumno"));
  let relevantes = 0, bien = 0, extras = 0, total = 0, todo = true;
  for (const k in medidaObjetivo) for (const p in medidaObjetivo[k]) {
    const o = medidaObjetivo[k][p], b = medidaBase[k][p], a = alumno[k] ? alumno[k][p] : undefined;
    const ok = a !== undefined && igual(o, a);
    total++; if (!ok) todo = false;
    if (!igual(o, b)) { relevantes++; if (ok) bien++; }
    else if (!ok) extras++;
  }
  const pct = todo ? 100 : Math.min(99, Math.round(bien / Math.max(1, relevantes + extras) * 100));
  $("medidor").style.width = pct + "%"; $("porcentaje").textContent = pct + "%";
  if (todo) {
    const falta = faltantesReq();
    if (falta.length) { $("avisoResp").innerHTML = `👀 ¡Ya se ve igual! Pero falta pensar en <b>otras pantallas</b>: incluye ${falta.map(c => `<code>${c}</code>`).join(" y ")}.`; return; }
    victoria();
  } else $("avisoResp").textContent = pct >= 80 ? "🔥 ¡Casi! Revisa los detalles." : "";
}
function faltantesReq() {
  const n = NIVELES[nivelActual], v = valoresHuecos(), falta = [];
  (n.req || []).forEach((lista, i) => lista.forEach(c => { if (!(v[i] || "").split(" ").includes(c)) falta.push(c); }));
  return falta;
}

// ---------- Pistas y rendirse ----------
$("btnPista").onclick = () => {
  const n = NIVELES[nivelActual];
  if (pistasUsadas >= n.pistas.length) return;
  $("pistaCaja").innerHTML = "💡 " + n.pistas.slice(0, pistasUsadas + 1).map(esc).join("<br>💡 ");
  pistasUsadas++; $("pistaCaja").classList.remove("oculto");
  if (pistasUsadas >= n.pistas.length) $("btnPista").disabled = true;
  beep(330, .08);
};
$("btnRendirse").onclick = () => {
  if (!confirm("¿Ver la solución? Solo ganarás 10 puntos y tu racha vuelve a 0.")) return;
  const n = NIVELES[nivelActual]; rendido = true;
  document.querySelectorAll(".hueco").forEach(inp => inp.value = n.sol[+inp.dataset.slot]);
  document.querySelectorAll(".hueco").forEach(o => o.size = Math.max(10, o.value.length + 2));
  actualizarAlumno();
};
$("btnLimpiar").onclick = () => { document.querySelectorAll(".hueco").forEach(i => i.value = ""); actualizarAlumno(); };

// ---------- Victoria ----------
function victoria() {
  if (ganado) return; ganado = true;
  clearInterval(relojId);
  document.querySelectorAll(".hueco").forEach(i => { i.classList.add("ok"); i.readOnly = true; });
  const n = NIVELES[nivelActual], seg = Math.max(1, Math.round((Date.now() - inicioNivel) / 1000));
  const base = n.jefe ? 200 : 100, limite = n.jefe ? 90 : 45;
  const bono = Math.max(0, limite - seg) * 2;
  let pts, desglose;
  if (rendido) { pts = 10; prog.racha = 0; desglose = "Viste la solución: 10 pts. ¡La próxima tú solo!"; }
  else {
    if (pistasUsadas === 0) prog.racha++; else prog.racha = 0;
    const mult = prog.racha >= 8 ? 3 : prog.racha >= 3 ? 2 : 1;
    pts = Math.max(20, Math.round((base + bono - 40 * pistasUsadas) * mult));
    desglose = `Base ${base} + tiempo ${bono} (${seg} s)` + (pistasUsadas ? ` − pistas ${40 * pistasUsadas}` : "") + (mult > 1 ? ` · racha 🔥 ×${mult}` : "");
  }
  prog.mejorRacha = Math.max(prog.mejorRacha, prog.racha);
  const antes = prog.mejor[nivelActual];
  const mejora = !antes || pts > antes.pts;
  if (mejora) prog.mejor[nivelActual] = { pts, seg, pistas: pistasUsadas, rendido };
  const nuevas = revisarInsignias(seg);
  guardarLocal(); actualizarBarra(); sincronizar();

  $("vicIcono").textContent = rendido ? "🙂" : n.jefe ? "👾💥" : "🎉";
  $("vicTitulo").textContent = rendido ? "NIVEL COMPLETADO" : n.jefe ? "¡JEFE DERROTADO!" : "¡NIVEL SUPERADO!";
  $("vicPuntos").textContent = pts;
  $("vicDesglose").textContent = desglose + (antes && !mejora ? ` · Tu récord en este nivel sigue siendo ${antes.pts}` : "");
  $("vicAprende").innerHTML = "📘 <b>Lo que aprendiste:</b> " + esc(n.aprende);
  $("vicSiguiente").classList.toggle("oculto", nivelActual >= TOTAL - 1);
  setTimeout(() => {
    $("capaVictoria").classList.remove("oculto");
    if (!rendido) { confeti(n.jefe ? 220 : 110); fanfarria(); }
    nuevas.forEach((ins, k) => setTimeout(() => avisoInsignia(ins), 900 + k * 1800));
  }, 450);
}
$("vicSiguiente").onclick = () => { $("capaVictoria").classList.add("oculto"); abrirNivel(nivelActual + 1); };
$("vicMapa").onclick = () => { $("capaVictoria").classList.add("oculto"); pintarMapa(); };

function revisarInsignias(seg) {
  const tiene = id => prog.insignias.includes(id), nuevas = [];
  const dar = id => { if (!tiene(id)) { prog.insignias.push(id); nuevas.push(INSIGNIAS.find(x => x.id === id)); } };
  if (completados() >= 1) dar("inicio");
  MUNDOS.forEach(mu => {
    const lista = nivelesDeMundo(mu.id);
    if (lista.every(x => hecho(x.i))) {
      dar(mu.insignia);
      if (lista.every(x => prog.mejor[x.i].pistas === 0 && !prog.mejor[x.i].rendido)) dar("ceropistas");
    }
  });
  if (!rendido && seg < 15) dar("velocista");
  if (prog.racha >= 3) dar("racha3");
  if (prog.racha >= 8) dar("racha8");
  if (completados() === TOTAL && Object.values(prog.mejor).every(x => !x.rendido)) dar("perfecto");
  return nuevas;
}
function avisoInsignia(ins) {
  const d = document.createElement("div");
  d.className = "toast-insignia"; d.innerHTML = `${ins.icono} ¡Nueva insignia: ${ins.nombre}!`;
  document.body.appendChild(d); beep(880, .12); setTimeout(() => d.remove(), 2600);
}

// ---------- Insignias y avatares ----------
function pintarInsignias() {
  $("listaInsignias").innerHTML = INSIGNIAS.map(i => `<div class="col-6 col-md-4 col-lg-3"><div class="insignia ${prog.insignias.includes(i.id) ? "" : "no"}">
    <div class="ico">${i.icono}</div><div class="fw-bold small">${i.nombre}</div><div class="small text-secondary">${i.desc}</div></div></div>`).join("");
  const pts = totalPuntos();
  $("listaAvatares").innerHTML = AVATARES.map(a => `<button class="avatar-op ${prog.avatar === a.e ? "sel" : ""}" data-av="${a.e}" ${pts >= a.pts ? "" : "disabled"} title="${pts >= a.pts ? "Disponible" : "Se desbloquea con " + a.pts + " pts"}">${pts >= a.pts ? a.e : "🔒"}</button>`).join("");
  document.querySelectorAll("[data-av]").forEach(b => b.onclick = () => { prog.avatar = b.dataset.av; guardarLocal(); actualizarBarra(); pintarInsignias(); sincronizar(); });
}
$("btnInsignias").onclick = () => { pintarInsignias(); new bootstrap.Modal($("modalInsignias")).show(); };
$("chipAvatar").onclick = $("btnInsignias").onclick;

// ---------- Ranking ----------
$("btnRanking").onclick = async () => {
  new bootstrap.Modal($("modalRanking")).show();
  if (!usuario) { $("rankingCuerpo").innerHTML = `<p>Juegas como <b>invitado</b>. Inicia sesión con tu correo @${DOMINIO} para aparecer en el ranking.</p><button class="btn btn-neon" onclick="location.reload()">Iniciar sesión</button>`; return; }
  $("rankingCuerpo").textContent = "Cargando…";
  try {
    const r = await (await fetch(SCRIPT_URL + "?op=ranking&token=" + encodeURIComponent(usuario.token))).json();
    if (!r.ok) throw new Error(r.error);
    $("rankingCuerpo").innerHTML = `<table class="table table-sm align-middle mb-0"><thead><tr><th>#</th><th>Jugador</th><th class="text-end">Niveles</th><th class="text-end">Puntos</th></tr></thead><tbody>` +
      r.lista.map((x, k) => `<tr class="fila-rank ${x.yo ? "yo" : ""}"><td>${["🥇", "🥈", "🥉"][k] || k + 1}</td><td>${x.avatar || "🐣"} ${esc(x.nombre)}</td><td class="text-end">${x.niveles}/${TOTAL}</td><td class="text-end fw-bold">${x.puntos}</td></tr>`).join("") +
      `</tbody></table>`;
  } catch (e) { $("rankingCuerpo").innerHTML = `<div class="alert alert-warning">No se pudo cargar el ranking: ${esc(String(e.message || e))}</div>`; }
};

// ---------- Servidor ----------
let enviando = false, pendiente = false;
async function sincronizar() {
  if (!usuario || SCRIPT_URL.startsWith("PEGAR")) return;
  if (enviando) { pendiente = true; return; }
  enviando = true;
  try {
    const r = await (await fetch(SCRIPT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ token: usuario.token, progreso: prog }) })).json();
    if (!r.ok && /sesi/i.test(r.error || "")) avisoInsignia({ icono: "⚠️", nombre: "Vuelve a iniciar sesión para guardar en el ranking" });
  } catch (e) { /* sin internet: queda guardado en este equipo */ }
  enviando = false;
  if (pendiente) { pendiente = false; sincronizar(); }
}

// ---------- Inicio de sesión ----------
function datosToken(t) {
  const p = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(decodeURIComponent(atob(p).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")));
}
async function alIniciarSesion(resp) {
  const d = datosToken(resp.credential);
  if (!String(d.email).toLowerCase().endsWith("@" + DOMINIO)) { $("estadoLogin").innerHTML = `<span class="text-danger">Usa tu correo institucional @${DOMINIO}</span>`; return; }
  usuario = { correo: String(d.email).toLowerCase(), nombre: d.name || d.email, token: resp.credential };
  prog = cargarLocal();
  $("estadoLogin").textContent = "Cargando tu progreso…";
  if (!SCRIPT_URL.startsWith("PEGAR")) {
    try {
      const r = await (await fetch(SCRIPT_URL + "?op=login&token=" + encodeURIComponent(usuario.token))).json();
      if (r.ok && r.progreso) {
        const remoto = Object.assign(nuevoProgreso(), r.progreso);
        const ptsR = Object.values(remoto.mejor).reduce((a, n) => a + n.pts, 0);
        if (ptsR > totalPuntos()) prog = remoto;
      }
      if (r.ok && r.nombre) usuario.nombre = r.nombre;
    } catch (e) {}
  }
  guardarLocal(); pintarMapa(); sincronizar();
}
$("btnInvitado").onclick = () => { usuario = null; prog = cargarLocal(); pintarMapa(); };
$("irMapa").onclick = () => { if (!$("pantallaInicio").classList.contains("oculto")) return; clearInterval(relojId); pintarMapa(); };
$("btnVolver").onclick = () => { clearInterval(relojId); pintarMapa(); };
$("btnEntendido").onclick = () => { $("capaTutorial").classList.add("oculto"); prog.tutorial = true; guardarLocal(); const h = document.querySelector(".hueco"); if (h) h.focus(); inicioNivel = Date.now(); };
$("btnSonido").onclick = () => { sonido = !sonido; try { localStorage.setItem("brush187_sonido", sonido ? "si" : "no"); } catch (e) {} actualizarBarra(); };

window.addEventListener("load", () => {
  actualizarBarra();
  const intentar = () => {
    if (!window.google || !google.accounts) return setTimeout(intentar, 300);
    google.accounts.id.initialize({ client_id: CLIENT_ID, callback: alIniciarSesion, hd: DOMINIO });
    google.accounts.id.renderButton($("botonGoogle"), { theme: "filled_black", size: "large", shape: "pill", text: "signin_with", locale: "es" });
  };
  intentar();
});
let anchoPrevio = window.innerWidth;
window.addEventListener("resize", () => {
  if (nivelActual < 0 || $("pantallaNivel").classList.contains("oculto") || Math.abs(window.innerWidth - anchoPrevio) < 5) return;
  anchoPrevio = window.innerWidth;
  medidaObjetivo = medir($("vistaObjetivo"));
  const tmp = $("vistaAlumno").innerHTML; $("vistaAlumno").innerHTML = rellenar(NIVELES[nivelActual].html, []);
  medidaBase = medir($("vistaAlumno")); $("vistaAlumno").innerHTML = tmp; comparar();
});

// ---------- Efectos ----------
let audio = null;
function beep(f, d, t = 0) {
  if (!sonido) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = "square"; o.frequency.value = f; g.gain.value = .06;
    o.connect(g); g.connect(audio.destination);
    o.start(audio.currentTime + t); o.stop(audio.currentTime + t + d);
  } catch (e) {}
}
function fanfarria() { [523, 659, 784, 1047].forEach((f, i) => beep(f, .12, i * .11)); }
function confeti(n) {
  const c = $("confeti"), ctx = c.getContext("2d");
  c.width = innerWidth; c.height = innerHeight;
  const col = ["#ff4fa3", "#22d3ee", "#fde047", "#a3e635", "#a78bfa", "#fb923c"];
  const ps = Array.from({ length: n }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, vx: (Math.random() - .5) * 4, vy: 2 + Math.random() * 4, s: 5 + Math.random() * 6, r: Math.random() * 6, c: col[Math.floor(Math.random() * col.length)] }));
  let f = 0;
  (function paso() {
    ctx.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .05; p.r += .1; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); ctx.restore(); });
    if (++f < 200) requestAnimationFrame(paso); else ctx.clearRect(0, 0, c.width, c.height);
  })();
}

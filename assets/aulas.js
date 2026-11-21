{
const LS = window.LESSONS || [];
const $ = id => document.getElementById(id), KEY = 'saa-c03-aulas-v2';
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
let done = new Set();
try { done = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) {}

/* Completa cada cena com as caixas da anterior e expande '*'. */
LS.forEach(l => {
  const all = Object.keys(l.n).join(' ');
  let prev = '';
  l.sc.forEach(sc => {
    if (sc.s === '*') sc.s = all;
    if (sc.s === undefined) sc.s = prev;
    prev = sc.s;
  });
});

const ICONS = {
  user: '<circle cx="8" cy="5" r="3"/><path d="M2.5 14.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/>',
  compute: '<rect x="3.5" y="3.5" width="9" height="9" rx="1.2"/><rect x="6.2" y="6.2" width="3.6" height="3.6"/><path d="M6 1.5v2M10 1.5v2M6 12.5v2M10 12.5v2M1.5 6h2M1.5 10h2M12.5 6h2M12.5 10h2"/>',
  db: '<ellipse cx="8" cy="3.6" rx="5.5" ry="2"/><path d="M2.5 3.6v8.8c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2V3.6M2.5 8c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2"/>',
  storage: '<path d="M2 4c0-1.1 2.7-2 6-2s6 .9 6 2-2.7 2-6 2-6-.9-6-2zM2 4l1.4 9.3c.2 1 2.2 1.7 4.6 1.7s4.4-.7 4.6-1.7L14 4"/>',
  net: '<circle cx="8" cy="8" r="6.2"/><path d="M1.8 8h12.4"/><ellipse cx="8" cy="8" rx="2.6" ry="6.2"/>',
  sec: '<rect x="3" y="7" width="10" height="7.5" rx="1.5"/><path d="M5.2 7V5.2a2.8 2.8 0 0 1 5.6 0V7"/>',
  int: '<rect x="1.5" y="4" width="13" height="8" rx="1.5"/><path d="M5.5 4v8M9 4v8"/>',
  mon: '<path d="M2 13.5h12"/><path d="M3 11l3-4 3 2.5 4.5-6"/>',
  onprem: '<rect x="3" y="1.8" width="10" height="12.7" rx=".8"/><path d="M5.8 4.8h1.2M9 4.8h1.2M5.8 7.8h1.2M9 7.8h1.2M7 14.5v-3h2v3"/>',
  note: '<path d="M4 1.5h5.5l3 3v10H4z"/><path d="M6 8h4.5M6 11h3.5"/>',
  svc: '<path d="M8 1.5l5.6 3.2v6.6L8 14.5l-5.6-3.2V4.7z"/>'
};

let L = 0, S = 0, el = 0, last = 0, playing = !still, ans = null, prevOn = new Set();
const split = s => s ? s.split(' ').filter(Boolean) : [];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const nScenes = () => LS[L].sc.length;
const isRules = () => S === nScenes();
const isQuiz = () => S === nScenes() + 1;
const scene = () => LS[L].sc[Math.min(S, nScenes() - 1)];

function pt(a, b) {
  const ax = a[0] + a[2] / 2, ay = a[1] + a[3] / 2, dx = b[0] + b[2] / 2 - ax, dy = b[1] + b[3] / 2 - ay;
  const k = Math.min(dx ? (a[2] / 2 + 6) / Math.abs(dx) : 9, dy ? (a[3] / 2 + 6) / Math.abs(dy) : 9);
  return [ax + dx * k, ay + dy * k];
}

/* Lista agrupada por categoria */
function list() {
  let html = '', cat = '';
  LS.forEach((l, i) => {
    if (l.cat !== cat) { cat = l.cat; html += `<p class="cat">${esc(cat)}</p>`; }
    html += `<button class="item ${done.has(i) ? 'ok' : ''}" data-i="${i}" aria-current="${i === L}">
      <span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(l.t)}${done.has(i) ? '<span class="d">✓ feita</span>' : ''}</span></button>`;
  });
  $('list').innerHTML = html;
  $('list').querySelectorAll('.item').forEach(b => b.onclick = () => {
    load(+b.dataset.i);
    if (matchMedia('(max-width: 860px)').matches) $('player').scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  });
  const cur = $('list').querySelector('[aria-current=true]');
  if (cur && matchMedia('(max-width: 860px)').matches) cur.scrollIntoView({ block: 'nearest', inline: 'center' });
}

function load(i, keepHash) {
  L = i; S = 0; el = 0; ans = null; prevOn = new Set(); if (!still) playing = true;
  if (!keepHash) history.replaceState(null, '', '#aula-' + (i + 1));
  const l = LS[L];
  $('lt').textContent = l.t;
  $('lcat').textContent = l.cat;
  $('segs').innerHTML = l.sc.map((sc, k) => `<button data-k="${k}" title="${esc(sc.t)}" aria-label="Cena ${k + 1}: ${esc(sc.t)}"><u></u></button>`).join('')
    + `<button data-k="${l.sc.length}" title="Para a prova" aria-label="Cola para a prova" class="rk"><u></u></button>`
    + `<button data-k="${l.sc.length + 1}" title="Pergunta" aria-label="Pergunta final" class="qk"><u></u></button>`;
  $('segs').querySelectorAll('button').forEach(b => b.onclick = () => go(+b.dataset.k));

  const defs = `<defs>${Object.entries(ICONS).map(([k, p]) => `<symbol id="i-${k}" viewBox="0 0 16 16">${p}</symbol>`).join('')}
    ${['ok', 'alt', 'no'].map(t => `<marker id="m-${t}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="mk-${t}" d="M0 0L10 5L0 10z"/></marker>`).join('')}</defs>`;
  let zones = '', boxes = '';
  Object.entries(l.n).forEach(([id, v]) => {
    const [x, y, w, h, k, t, s] = v;
    if (k === 'zone') { zones += `<g class="nd zn" id="n-${id}"><rect class="zr" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/><text class="zt" x="${x + 10}" y="${y + 17}">${esc(t)}</text></g>`; return; }
    const cy = y + h / 2;
    boxes += `<g class="nd k-${k}" id="n-${id}">
      <rect class="ring" x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" rx="11"/>
      <rect class="box" x="${x}" y="${y}" width="${w}" height="${h}" rx="7"/>
      <rect class="stripe" x="${x + 1.5}" y="${y + 1.5}" width="4" height="${h - 3}" rx="2"/>
      <use class="ic" href="#i-${k}" x="${x + 13}" y="${cy - 8}" width="16" height="16"/>
      <text class="tt" x="${x + 36}" y="${cy + (s ? -3 : 5)}">${esc(t)}</text>
      ${s ? `<text class="st" x="${x + 36}" y="${cy + 13}">${esc(s)}</text>` : ''}
      <path class="cx" d="M${x + 8} ${y + 8}L${x + w - 8} ${y + h - 8}M${x + w - 8} ${y + 8}L${x + 8} ${y + h - 8}"/>
    </g>`;
  });
  $('svg').innerHTML = defs + zones + boxes + '<g id="flows"></g>';
  list(); draw();
}

function draw() {
  const l = LS[L], sc = scene(), on = new Set(split(sc.s));
  const extra = isRules() || isQuiz();
  const hl = new Set(extra ? [] : split(sc.hl)), x = new Set(split(sc.x));
  const flows = isRules() ? [] : (sc.f || []);
  const touched = new Set(flows.flatMap(f => [f[0], f[1]]));
  Object.keys(l.n).forEach(id => {
    const g = $('n-' + id), vis = on.has(id), isZone = l.n[id][4] === 'zone';
    g.classList.toggle('on', vis);
    g.classList.toggle('enter', vis && !prevOn.has(id) && !still);
    g.classList.toggle('hi', hl.has(id));
    g.classList.toggle('x', x.has(id));
    g.classList.toggle('dim', !isZone && hl.size > 0 && !hl.has(id) && !touched.has(id) && !x.has(id));
  });
  prevOn = on;

  $('flows').innerHTML = flows.map(([a, b, t, lb], k) => {
    const p = pt(l.n[a], l.n[b]), q = pt(l.n[b], l.n[a]), mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    const dot = t === 'no' || still ? '' : `<circle class="dot" r="4.5"><animateMotion dur="${t === 'alt' ? 2.4 : 1.6}s" begin="${(k * 0.25).toFixed(2)}s" repeatCount="indefinite" path="M${p[0]} ${p[1]}L${q[0]} ${q[1]}"/></circle>`;
    const ly = t === 'no' ? my - 22 : my;
    return `<g class="fl ${t}"><line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" marker-end="url(#m-${t})"/>${dot}
      ${t === 'no' ? `<g class="bx"><circle cx="${mx}" cy="${my}" r="11"/><path d="M${mx - 4.5} ${my - 4.5}L${mx + 4.5} ${my + 4.5}M${mx + 4.5} ${my - 4.5}L${mx - 4.5} ${my + 4.5}"/></g>` : ''}
      ${lb ? `<rect class="lb" x="${mx}" y="${ly - 10}" width="0" height="20" rx="10"/><text class="lt" x="${mx}" y="${ly + 4}">${esc(lb)}</text>` : ''}</g>`;
  }).join('');
  /* pílulas dos rótulos no tamanho do texto, numa posição que não cubra caixas */
  const boxes = Object.entries(l.n).filter(([id, v]) => on.has(id) && v[4] !== 'zone').map(([, v]) => v);
  const placed = [];
  const hits = (x, y, w, h) => boxes.some(b => x < b[0] + b[2] + 3 && b[0] - 3 < x + w && y < b[1] + b[3] + 3 && b[1] - 3 < y + h)
    || placed.some(b => x < b[0] + b[2] && b[0] < x + w && y < b[1] + b[3] && b[1] < y + h);
  $('flows').querySelectorAll('.fl').forEach(g => {
    const tx = g.querySelector('text.lt'), r = g.querySelector('rect.lb');
    if (!tx || !r) return;
    let w = 60; try { w = tx.getComputedTextLength() + 16; } catch (e) {}
    const cx = +tx.getAttribute('x'), cy = +tx.getAttribute('y') - 4;
    const tries = [[0, 0], [0, -18], [0, 18], [0, -36], [0, 36], [-50, 0], [50, 0], [0, -54], [0, 54]];
    let best = tries[0];
    for (const t of tries) { if (!hits(cx + t[0] - w / 2, cy + t[1] - 10, w, 20)) { best = t; break; } }
    const nx = cx + best[0], ny = cy + best[1];
    placed.push([nx - w / 2, ny - 10, w, 20]);
    r.setAttribute('width', w); r.setAttribute('x', nx - w / 2); r.setAttribute('y', ny - 10);
    tx.setAttribute('x', nx); tx.setAttribute('y', ny + 4);
  });

  /* cola */
  const rules = $('rules');
  if (isRules()) {
    rules.hidden = false;
    rules.innerHTML = `<div class="rh"><b>Para a prova</b><button class="link" id="showAll">Mostrar todas</button></div>
      <ol>${l.regras.map((r, k) => `<li><span class="g">${esc(r[0])}</span><button class="a" data-k="${k}" aria-label="Mostrar resposta"><span>${esc(r[1])}</span></button></li>`).join('')}</ol>`;
    rules.querySelectorAll('.a').forEach(b => b.onclick = e => { e.stopPropagation(); b.classList.add('open'); b.removeAttribute('aria-label'); });
    $('showAll').onclick = e => { e.stopPropagation(); rules.querySelectorAll('.a').forEach(b => b.classList.add('open')); };
  } else { rules.hidden = true; rules.innerHTML = ''; }
  $('figwrap').hidden = isRules(); $('legend').hidden = isRules(); $('swipe').hidden = isRules();
  follow(hl, touched, on);

  if (isQuiz()) {
    const q = l.q;
    $('cap').innerHTML = `<h3 class="sh">Pergunta</h3><p class="qq">${esc(q.q)}</p><div class="opts">${q.o.map((t, k) => `<button class="opt ${ans !== null ? (k === q.c ? 'right' : k === ans ? 'wrong' : '') : ''}" data-k="${k}" ${ans !== null ? 'disabled' : ''}><span>${String.fromCharCode(65 + k)}</span>${esc(t)}</button>`).join('')}</div>${ans !== null ? `<p class="fb"><strong class="${ans === q.c ? '' : 'no'}">${ans === q.c ? 'Certo.' : 'Errado.'}</strong> ${esc(q.e)}</p>` : ''}`;
    $('cap').querySelectorAll('.opt').forEach(b => b.onclick = () => { ans = +b.dataset.k; if (ans === q.c) { done.add(L); try { localStorage.setItem(KEY, JSON.stringify([...done])); } catch (e) {} list(); } draw(); });
  } else if (isRules()) {
    $('cap').innerHTML = `<h3 class="sh">Cola desta aula</h3><p>Leia o gatilho e tente lembrar a resposta antes de tocar para revelar.</p>`;
  } else {
    $('cap').innerHTML = `<h3 class="sh">${esc(sc.t)}</h3><p>${esc(sc.c)}</p>`;
  }

  $('cnt').textContent = isQuiz() ? 'Pergunta final' : isRules() ? 'Para a prova' : `Cena ${S + 1} de ${nScenes()}`;
  const lastL = L === LS.length - 1, p = $('play');
  if (isQuiz()) { p.textContent = ans !== null && !lastL ? 'Próxima aula' : 'Responda acima'; p.disabled = !(ans !== null && !lastL); }
  else if (isRules()) { p.textContent = 'Ir para a pergunta'; p.disabled = false; }
  else { p.textContent = playing ? 'Pausar' : 'Reproduzir'; p.disabled = false; }
  $('next').disabled = isQuiz(); $('prev').disabled = S === 0;
  bars();
}

/* no celular o diagrama rola: centraliza o que está em destaque */
function follow(hl, touched, on) {
  const w = $('figwrap');
  if (!w || w.scrollWidth <= w.clientWidth + 4) return;
  const ids = hl.size ? [...hl] : touched.size ? [...touched] : [...on];
  const ns = ids.map(id => LS[L].n[id]).filter(v => v && v[4] !== 'zone');
  if (!ns.length) return;
  const x0 = Math.min(...ns.map(v => v[0])), x1 = Math.max(...ns.map(v => v[0] + v[2]));
  const k = $('fig').clientWidth / 640, cx = (x0 + x1) / 2 * k + 8;
  w.scrollTo({ left: Math.max(0, cx - w.clientWidth / 2), behavior: still ? 'auto' : 'smooth' });
}
const dur = () => { const sc = scene(); return Math.max(7000, (sc.t.length + sc.c.length) * 62); };
function bars() {
  $('segs').querySelectorAll('button').forEach((b, i) => {
    b.querySelector('u').style.width = (i < S ? 100 : i === S ? (S < nScenes() ? Math.min(100, el / dur() * 100) : 100) : 0) + '%';
    b.classList.toggle('cur', i === S);
  });
}
function go(k) { S = Math.max(0, Math.min(k, nScenes() + 1)); el = 0; if (S >= nScenes()) playing = false; if (!isQuiz()) ans = null; draw(); }
function next() { if (!isQuiz()) go(S + 1); }
function prev() { go(S - 1); }
function toggle() {
  if (isQuiz()) { if (ans !== null && L < LS.length - 1) load(L + 1); return; }
  if (isRules()) { go(S + 1); return; }
  playing = !playing; draw();
}
function tick(ts) {
  if (playing && S < nScenes() && !document.hidden) { el += Math.min(100, ts - last); if (el >= dur()) next(); else bars(); }
  last = ts; requestAnimationFrame(tick);
}

$('next').onclick = next; $('prev').onclick = prev; $('play').onclick = toggle; $('again').onclick = () => load(L);
$('fig').onclick = () => { if (S < nScenes()) toggle(); };
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.target.tagName === 'SELECT') return;
  if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); toggle(); }
  else if (e.key === 'ArrowRight') next(); else if (e.key === 'ArrowLeft') prev();
});
const fromHash = () => { const m = location.hash.match(/^#aula-(\d+)$/); const i = m ? +m[1] - 1 : 0; return i >= 0 && i < LS.length ? i : 0; };
window.addEventListener('hashchange', () => load(fromHash(), true));
load(fromHash(), true);
requestAnimationFrame(t => { last = t; tick(t); });
}

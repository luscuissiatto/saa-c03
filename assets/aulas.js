{
const LS = window.LESSONS || [];
const $ = id => document.getElementById(id), KEY = 'saa-c03-aulas';
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
let done = new Set();
try { done = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) {}

let L = 0, S = 0, el = 0, last = 0, playing = !still, quiz = false, ans = null;
const split = s => s ? s.split(' ') : [];

function pt(a, b) {
  const ax = a[0] + a[2] / 2, ay = a[1] + a[3] / 2, dx = b[0] + b[2] / 2 - ax, dy = b[1] + b[3] / 2 - ay;
  const k = Math.min(dx ? (a[2] / 2 + 5) / Math.abs(dx) : 9, dy ? (a[3] / 2 + 5) / Math.abs(dy) : 9);
  return [ax + dx * k, ay + dy * k];
}

function list() {
  $('list').innerHTML = LS.map((l, i) => `<button class="item ${done.has(i) ? 'ok' : ''}" data-i="${i}" aria-current="${i === L}">
    <span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${l.t}${done.has(i) ? '<span class="d">✓ feita</span>' : ''}</span></button>`).join('');
  $('list').querySelectorAll('.item').forEach(b => b.onclick = () => load(+b.dataset.i));
  const cur = $('list').querySelector('[aria-current=true]');
  if (cur && matchMedia('(max-width: 860px)').matches) cur.scrollIntoView({ block: 'nearest', inline: 'center' });
}

function load(i, keepHash) {
  L = i; S = 0; el = 0; quiz = false; ans = null; if (!still) playing = true;
  if (!keepHash) history.replaceState(null, '', '#aula-' + (i + 1));
  const l = LS[L];
  $('lt').textContent = l.t;
  $('segs').innerHTML = l.sc.map((_, k) => `<i data-k="${k}"><u></u></i>`).join('') + `<i data-k="q"><u></u></i>`;
  $('segs').querySelectorAll('i').forEach(b => b.onclick = () => { if (b.dataset.k === 'q') { quiz = true; playing = false; } else { quiz = false; ans = null; S = +b.dataset.k; el = 0; } draw(); });
  const mk = t => `<marker id="m-${t}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="mk-${t}" d="M0 0L10 5L0 10z"/></marker>`;
  $('svg').innerHTML = `<defs>${mk('ok')}${mk('alt')}${mk('no')}</defs>` +
    Object.entries(l.n).map(([id, v]) => v[6]
      ? `<g class="nd zn" id="n-${id}"><rect x="${v[0]}" y="${v[1]}" width="${v[2]}" height="${v[3]}"/><text x="${v[0] + 8}" y="${v[1] + 17}">${v[4]}</text></g>`
      : `<g class="nd" id="n-${id}"><rect x="${v[0]}" y="${v[1]}" width="${v[2]}" height="${v[3]}"/><text x="${v[0] + v[2] / 2}" y="${v[1] + v[3] / 2 + (v[5] ? -2 : 5)}">${v[4]}</text>${v[5] ? `<text class="s" x="${v[0] + v[2] / 2}" y="${v[1] + v[3] / 2 + 14}">${v[5]}</text>` : ''}<line class="cx" x1="${v[0] + 8}" y1="${v[1] + 8}" x2="${v[0] + v[2] - 8}" y2="${v[1] + v[3] - 8}"/><line class="cx" x1="${v[0] + v[2] - 8}" y1="${v[1] + 8}" x2="${v[0] + 8}" y2="${v[1] + v[3] - 8}"/></g>`).join('') + '<g id="flows"></g>';
  list(); draw();
}

function draw() {
  const l = LS[L], sc = l.sc[Math.min(S, l.sc.length - 1)], on = split(sc.s), hi = split(sc.h), x = split(sc.x);
  Object.keys(l.n).forEach(id => { const g = $('n-' + id); g.classList.toggle('on', on.includes(id)); g.classList.toggle('hi', !quiz && hi.includes(id)); g.classList.toggle('x', x.includes(id)); });
  $('flows').innerHTML = (sc.f || []).map(([a, b, t, lb]) => {
    const p = pt(l.n[a], l.n[b]), q = pt(l.n[b], l.n[a]), mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    return `<g class="fl ${t}"><line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" marker-end="url(#m-${t})"/>${t === 'no' ? `<text class="bx" x="${mx}" y="${my + 11}">×</text>` : still ? '' : `<circle r="5"><animateMotion dur="${t === 'alt' ? 2.6 : 1.5}s" repeatCount="indefinite" path="M${p[0]} ${p[1]}L${q[0]} ${q[1]}"/></circle>`}${lb ? `<text x="${mx}" y="${my - (t === 'no' ? 18 : 9)}">${lb}</text>` : ''}</g>`;
  }).join('');
  if (quiz) {
    const q = l.q;
    $('cap').innerHTML = `<p class="qq">${q.q}</p><div class="opts">${q.o.map((t, k) => `<button class="opt ${ans !== null ? (k === q.c ? 'right' : k === ans ? 'wrong' : '') : ''}" data-k="${k}" ${ans !== null ? 'disabled' : ''}><span>${String.fromCharCode(65 + k)}</span>${t}</button>`).join('')}</div>${ans !== null ? `<p class="fb"><strong class="${ans === q.c ? '' : 'no'}">${ans === q.c ? 'Certo.' : 'Errado.'}</strong> ${q.e}</p>` : ''}`;
    $('cap').querySelectorAll('.opt').forEach(b => b.onclick = () => { ans = +b.dataset.k; if (ans === q.c) { done.add(L); try { localStorage.setItem(KEY, JSON.stringify([...done])); } catch (e) {} list(); } draw(); });
  } else $('cap').innerHTML = `<p>${sc.c}</p>`;
  $('cnt').textContent = quiz ? 'Pergunta final' : `Cena ${S + 1} de ${l.sc.length}`;
  const isLast = L === LS.length - 1;
  $('play').textContent = quiz ? (ans !== null && !isLast ? 'Próxima aula' : 'Pergunta') : playing ? 'Pausar' : 'Reproduzir';
  $('play').disabled = quiz && !(ans !== null && !isLast);
  $('next').disabled = quiz; $('prev').disabled = !quiz && S === 0;
  bars();
}

const dur = () => Math.max(6500, LS[L].sc[S].c.replace(/<[^>]+>/g, '').length * 70);
function bars() { $('segs').querySelectorAll('u').forEach((u, i) => { u.style.width = (quiz ? 100 : i < S ? 100 : i === S ? Math.min(100, el / dur() * 100) : 0) + '%'; }); }
function next() { if (quiz) return; if (S < LS[L].sc.length - 1) { S++; el = 0; } else { quiz = true; playing = false; } draw(); }
function prev() { if (quiz) { quiz = false; ans = null; S = LS[L].sc.length - 1; } else if (S > 0) S--; el = 0; draw(); }
function toggle() { if (quiz) { if (ans !== null && L < LS.length - 1) load(L + 1); return; } playing = !playing; draw(); }
function tick(ts) { if (playing && !quiz && !document.hidden) { el += Math.min(100, ts - last); if (el >= dur()) next(); else bars(); } last = ts; requestAnimationFrame(tick); }

$('next').onclick = next; $('prev').onclick = prev; $('play').onclick = toggle; $('fig').onclick = toggle; $('again').onclick = () => load(L);
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); toggle(); }
  else if (e.key === 'ArrowRight') next(); else if (e.key === 'ArrowLeft') prev();
});
const fromHash = () => { const m = location.hash.match(/^#aula-(\d+)$/); const i = m ? +m[1] - 1 : 0; return i >= 0 && i < LS.length ? i : 0; };
window.addEventListener('hashchange', () => load(fromHash(), true));
load(fromHash(), true);
requestAnimationFrame(t => { last = t; tick(t); });
}

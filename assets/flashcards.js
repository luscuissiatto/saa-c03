{
const D = window.CARDS || [];
const KEY = 'saa-c03-dominados';
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

let known = new Set();
try { known = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify([...known])); } catch (e) {} };

let mode = 'flash', deck = [], pos = 0, flipped = false, answered = null, score = 0, done = 0;

const topics = ['Todos os temas', ...new Set(D.map(c => c.tema))];
$('topic').innerHTML = topics.map(t => `<option>${esc(t)}</option>`).join('');

function build(shuffle) {
  const set = $('set').value, t = $('topic').value, todo = $('todo').value;
  deck = D.map((c, i) => i).filter(i =>
    (set === 'all' || D[i].essencial) &&
    (t === topics[0] || D[i].tema === t) &&
    (todo === 'all' || !known.has(i)));
  if (shuffle) for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  pos = 0; flipped = false; answered = null; score = 0; done = 0;
  render();
}

function progress() {
  const set = $('set').value;
  const pool = D.map((c, i) => i).filter(i => set === 'all' || D[i].essencial);
  const k = pool.filter(i => known.has(i)).length;
  $('known').textContent = k; $('total').textContent = pool.length;
  $('fill').style.width = (pool.length ? k / pool.length * 100 : 0) + '%';
}

function endScreen() {
  const quiz = mode === 'quiz';
  const left = deck.filter(i => !known.has(i)).length;
  $('main').innerHTML = `<div class="stage"><div class="num">${quiz && done ? Math.round(score / done * 100) + '%' : '✓'}</div>
    <div class="card end"><p class="big">${quiz ? `${score} de ${done}` : 'Fim da rodada'}</p>
    <p>${quiz ? 'A nota mínima da prova equivale a cerca de 72%.' : ''} ${left ? `Ainda faltam ${left} cartões nesta seleção.` : 'Você dominou todos os cartões desta seleção.'}</p>
    <div class="act"><button class="btn red" id="again">${quiz ? 'Refazer só os que errei' : 'Revisar só os que errei'}</button><button class="btn" id="all">Recomeçar tudo</button></div></div></div>`;
  $('again').onclick = () => { $('todo').value = 'todo'; build(true); };
  $('all').onclick = () => { $('todo').value = 'all'; build(true); };
}

function render() {
  progress();
  const m = $('main');
  if (!deck.length) {
    m.innerHTML = `<div class="stage"><div class="num">0</div><div class="card"><p class="q">Nenhum cartão nesta seleção.</p><p>${$('todo').value === 'todo' ? 'Você já dominou todos daqui. Troque “Só os que ainda erro” por “Todos” para revisar.' : 'Troque o tema ou o conjunto.'}</p></div></div>`;
    return;
  }
  if (pos >= deck.length) return endScreen();
  const i = deck[pos], c = D[i];
  const head = `<div class="num">${String(pos + 1).padStart(2, '0')}<small>de ${deck.length}</small></div>`;
  const tag = `<span class="tag">${esc(c.tema)}${c.essencial ? ' · <span class="ess">essencial</span>' : ''}</span>`;

  if (mode === 'flash') {
    m.innerHTML = `<div class="stage">${head}<div>
      <div class="flip ${flipped ? 'on' : ''}" id="card" tabindex="0" role="button" aria-label="Virar cartão" aria-pressed="${flipped}">
        <div class="in">
          <div class="face f">${tag}<p class="q">${esc(c.pergunta)}</p><p class="hint">Pense na resposta e toque para virar.</p></div>
          <div class="face b">${tag}<p class="q">${esc(c.pergunta)}</p><div class="ans"><b>${esc(c.opcoes[c.correta])}</b><p>${esc(c.explicacao)}</p></div></div>
        </div>
      </div>
      <div class="act">${flipped
        ? `<button class="btn" id="miss">Errei, rever depois</button><button class="btn red" id="hit">Acertei</button>`
        : `<button class="btn red" id="turn">Virar cartão</button>`}</div>
      <div class="keys"><span><span class="kbd">espaço</span> virar</span><span><span class="kbd">←</span> errei</span><span><span class="kbd">→</span> acertei</span></div>
    </div></div>`;
    const turn = () => { if (!flipped) { flipped = true; render(); } };
    $('card').onclick = turn;
    if (!flipped) $('turn').onclick = turn;
    else { $('miss').onclick = () => next(i, false); $('hit').onclick = () => next(i, true); $('hit').focus({ preventScroll: true }); }
  } else {
    const st = k => answered === null ? '' : k === c.correta ? 'right' : k === answered ? 'wrong' : '';
    m.innerHTML = `<div class="stage">${head}<div><div class="card">${tag}<p class="q">${esc(c.pergunta)}</p>
      <div class="opts">${c.opcoes.map((t, k) => `<button class="opt ${st(k)}" data-k="${k}" ${answered !== null ? 'disabled' : ''}><span>${String.fromCharCode(65 + k)}</span>${esc(t)}</button>`).join('')}</div>
      ${answered !== null ? `<p class="fb"><strong class="${answered === c.correta ? '' : 'no'}">${answered === c.correta ? 'Certo.' : 'Errado.'}</strong> ${esc(c.explicacao)}</p>` : ''}</div>
      ${answered !== null ? `<div class="act"><button class="btn red" id="nx">Próxima</button></div>` : ''}
      <div class="keys"><span><span class="kbd">A</span>–<span class="kbd">D</span> responder</span><span><span class="kbd">enter</span> próxima</span><span>Acertos: ${score} de ${done}</span></div>
    </div></div>`;
    m.querySelectorAll('.opt').forEach(b => b.onclick = () => answer(+b.dataset.k));
    if (answered !== null) { $('nx').onclick = () => { pos++; answered = null; render(); }; $('nx').focus({ preventScroll: true }); }
  }
}

function answer(k) {
  if (answered !== null) return;
  const i = deck[pos]; answered = k; done++;
  if (k === D[i].correta) { score++; known.add(i); } else known.delete(i);
  save(); render();
}
function next(i, ok) { ok ? known.add(i) : known.delete(i); save(); pos++; flipped = false; render(); }

function setMode(md, fromHash) {
  mode = md;
  $('mFlash').setAttribute('aria-pressed', md === 'flash');
  $('mQuiz').setAttribute('aria-pressed', md === 'quiz');
  $('navF').toggleAttribute('aria-current', md === 'flash'); if (md === 'flash') $('navF').setAttribute('aria-current', 'page');
  $('navQ').toggleAttribute('aria-current', md === 'quiz'); if (md === 'quiz') $('navQ').setAttribute('aria-current', 'page');
  $('title').textContent = md === 'quiz' ? 'Quiz' : 'Flashcards';
  $('sub').textContent = md === 'quiz' ? 'Escolha a alternativa certa. Cada acerto marca o cartão como dominado.' : 'Responda de cabeça antes de virar. Marque “Acertei” só se sabia o porquê.';
  document.title = (md === 'quiz' ? 'Quiz' : 'Flashcards') + ' · SAA-C03';
  if (!fromHash) history.replaceState(null, '', md === 'quiz' ? '#quiz' : location.pathname);
  build(false);
}

$('mFlash').onclick = () => setMode('flash');
$('mQuiz').onclick = () => setMode('quiz');
['set', 'topic', 'todo'].forEach(id => $(id).onchange = () => build(false));
$('shuffle').onclick = () => build(true);
$('reset').onclick = () => { known.clear(); save(); build(false); };
window.addEventListener('hashchange', () => setMode(location.hash === '#quiz' ? 'quiz' : 'flash', true));

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'SELECT' || e.metaKey || e.ctrlKey || e.altKey) return;
  if (pos >= deck.length || !deck.length) return;
  if (mode === 'flash') {
    if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); if (!flipped) { flipped = true; render(); } }
    else if (flipped && (e.key === 'ArrowLeft' || e.key === '1')) next(deck[pos], false);
    else if (flipped && (e.key === 'ArrowRight' || e.key === '2')) next(deck[pos], true);
  } else {
    const k = 'abcd'.indexOf(e.key.toLowerCase());
    if (answered === null && k >= 0 && k < D[deck[pos]].opcoes.length) answer(k);
  }
});

setMode(location.hash === '#quiz' ? 'quiz' : 'flash', true);
}

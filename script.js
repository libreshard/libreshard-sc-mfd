// SPDX-License-Identifier: Apache-2.0
// Builds the MFD from layout.js. Buttons use LibreShard's declarative mode: data-key (press) or
// data-hold (held while the finger is on it).

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

/* ---------- Texts (strings.js) ---------- */
// The same lookup LibreShard uses: ?lang= from the viewer, else the browser; exact language, then its
// base, then English. Shard.t() isn't there yet when this script runs (shard-api.js comes after).
const LANG = (new URLSearchParams(location.search).get('lang') || navigator.language || 'en').toLowerCase();
const t = (key, vars = {}) => {
  const all = window.SHARD_STRINGS || {};
  const table = [LANG, LANG.split('-')[0], 'en'].map((l) => all[l]).find((s) => s && key in s);
  const text = table ? table[key] : key;
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
};
document.documentElement.lang = LANG.split('-')[0];
// LibreShard fills these too when it loads; doing it here also covers opening the shard on its own
document.querySelectorAll('[data-i18n]').forEach((e) => { e.textContent = t(e.dataset.i18n); });
document.querySelectorAll('[data-i18n-aria]').forEach((e) => { e.setAttribute('aria-label', t(e.dataset.i18nAria)); });

/* ---------- Saved settings (the viewer keeps them through Shard.save) ---------- */
const settings = {
  theme: 'rsi',
  fontScale: 1,
  tab: null,
  view: 'full', // 'full' (every section) | 'compact' (minimal mode)
  order: {}, // mode id → the titles of its sections in the chosen order
};
const save = () => { if (window.Shard && Shard.save) Shard.save(settings); };

/* ---------- Short key label (as in the game's keybinding menu) ---------- */
const KEY_LABEL = {
  alt: 'LALT', ralt: 'RALT', ctrl: 'LCTRL', rctrl: 'RCTRL', shift: 'LSHIFT', backspace: 'BKSP',
  pageup: 'PGUP', pagedown: 'PGDN', numpadplus: 'NUM+', numpaddiv: 'NUM/', insert: 'INS', delete: 'DEL',
  comma: ',', period: '.', slash: '/', semicolon: ';', apostrophe: "'", lbracket: '[', rbracket: ']', backslash: '\\',
};
const keyLabel = (combo) => combo.split('+')
  .map((p) => KEY_LABEL[p] || (p.startsWith('numpad') ? 'NUM' + p.slice(6) : p.toUpperCase()))
  .join('+');

/* ---------- Buttons ---------- */
const GUARD_MS = 4000; // how long a guarded button stays armed

function makeButton(b) {
  const btn = el('button', 'mfd-btn');
  if (b.tone) btn.classList.add('tone-' + b.tone);
  if (b.span) btn.style.gridColumn = 'span ' + b.span;
  if (b.i) btn.append(el('i', 'i i-' + b.i));

  const txt = el('span', 'txt');
  txt.append(el('span', 'lbl', b.l));
  if (b.guard) txt.append(el('span', 'sub', t('tapToArm')));
  btn.append(txt);

  const meta = el('span', 'meta');
  if (b.hold) meta.append(el('span', 'tag', typeof b.hold === 'string' ? 'HOLD · ' + b.hold : 'HOLD'));
  meta.append(el('span', 'kb', keyLabel(b.k)));
  btn.append(meta);

  if (b.bind) btn.title = t('bindTitle', { key: keyLabel(b.k) });
  const attr = b.hold ? 'data-hold' : 'data-key';
  if (b.hold) btn.classList.add('is-hold');

  if (!b.guard) {
    btn.setAttribute(attr, b.k);
    return btn;
  }

  // Guarded: the first tap arms the button and only the next one sends the key. The attribute is set
  // and removed in a setTimeout, so shard-api's listener (on document, it runs after this one)
  // doesn't act on the arming tap.
  btn.classList.add('guard');
  let timer;
  const sub = txt.querySelector('.sub');
  const disarm = () => {
    clearTimeout(timer);
    btn.removeAttribute(attr);
    btn.classList.remove('armed');
    sub.textContent = t('tapToArm');
  };
  btn.addEventListener('click', () => {
    if (btn.classList.contains('armed')) return setTimeout(disarm, 0);
    setTimeout(() => {
      btn.setAttribute(attr, b.k);
      btn.classList.add('armed');
      sub.textContent = b.hold ? t('holdToRun') : t('tapToRun');
      timer = setTimeout(disarm, GUARD_MS);
    }, 0);
  });
  // While held it doesn't disarm: without data-hold, shard-api wouldn't send the 'up'
  btn.addEventListener('pointerdown', () => { if (btn.classList.contains('armed')) clearTimeout(timer); });
  const rearm = () => {
    if (!btn.classList.contains('armed')) return;
    clearTimeout(timer);
    timer = setTimeout(disarm, GUARD_MS);
  };
  btn.addEventListener('pointerup', rearm);
  btn.addEventListener('pointercancel', rearm);
  return btn;
}

function makeScreen(s) {
  const sc = el('section', 'screen' + (s.cols >= 3 ? ' dense' : ''));
  sc.dataset.id = s.title; // identifies the section when saving the order
  const head = el('header', 'screen-head');
  head.append(el('span', 'grip'), el('span', 'code', s.code), el('h3', null, s.title));
  head.addEventListener('pointerdown', (e) => startDrag(e, sc));
  sc.append(head);

  const body = el('div', 'screen-body');
  body.style.gridTemplateColumns = 'repeat(' + s.cols + ', 1fr)';
  for (const b of s.items) body.append(b ? makeButton(b) : el('div', 'cell-empty'));
  sc.append(body);

  if (s.note) sc.append(el('p', 'screen-note', t(s.note)));
  return sc;
}

/* ---------- Minimal mode (compact.js) ---------- */
// Each button is one from layout.js ('SCREEN::LABEL'), so keys, hold and guard are identical
function findButton(mode, ref) {
  const [title, label] = ref.split('::');
  const screen = mode.screens.find((s) => s.title === title);
  return screen && screen.items.find((b) => b && b.l === label);
}

function makeCompactButton(mode, it) {
  const base = findButton(mode, it.ref);
  if (!base) { console.warn('[compact] not found', mode.id, it.ref); return null; }
  const btn = makeButton({ ...base, ...it.over });
  btn.classList.add('cbtn', 'shape-' + it.s);
  btn.classList.toggle('xs', it.w * it.h <= 1);
  btn.classList.toggle('wide', it.w >= it.h * 2 && it.h === 1);
  btn.classList.toggle('big', it.w >= 2 && it.h >= 2); // main actions: bigger, with a glow
  // This view shows no key, only the hold tag (if any)
  const meta = btn.querySelector('.meta');
  meta.querySelector('.kb').remove();
  if (!meta.children.length) meta.remove();
  btn.style.gridColumn = it.x + ' / span ' + it.w;
  btn.style.gridRow = it.y + ' / span ' + it.h;
  return btn;
}

// A frame with corners that groups several buttons (decorative only).
// Without a name of its own it's labelled with the title of the screen that has that code.
function makeZone(mode, z) {
  const zn = el('div', 'czone');
  zn.setAttribute('aria-hidden', 'true');
  const screen = mode.screens.find((s) => s.code === z.code);
  const name = z.name || (screen && screen.title);
  const label = el('span', 'czone-l');
  label.append(el('b', null, z.code));
  if (name && name !== z.code) label.append(el('span', null, name));
  zn.append(label);
  zn.style.gridColumn = z.x + ' / span ' + z.w;
  zn.style.gridRow = z.y + ' / span ' + z.h;
  return zn;
}

function buildCompact(mode) {
  const spec = (window.MFD_COMPACT || {})[mode.id];
  if (!spec) return null;
  const page = el('div', 'cpage');
  page.id = 'cpage-' + mode.id;
  page.setAttribute('role', 'tabpanel');
  page.style.setProperty('--cols', spec.cols || 12);
  page.style.setProperty('--rows', spec.rows || 6);
  for (const z of spec.zones || []) page.append(makeZone(mode, z));
  for (const it of spec.items) {
    const btn = makeCompactButton(mode, it);
    if (btn) page.append(btn);
  }
  return page;
}

/* ---------- Pages (game modes) ---------- */
const MODES = window.MFD_LAYOUT;
const tabs = $('tabs');
const pages = $('pages');
const pageOf = (id) => $('page-' + id);

MODES.forEach((mode, n) => {
  const tab = el('button', 'tab-btn');
  tab.setAttribute('role', 'tab');
  tab.dataset.target = mode.id;
  tab.append(el('span', 'tab-n', String(n + 1).padStart(2, '0')), el('span', 'tab-l', mode.label));
  tab.addEventListener('click', () => {
    showPage(mode.id);
    settings.tab = mode.id;
    save();
  });
  tabs.append(tab);

  // Empty for now: start() builds the pages once the saved settings are read. The page is the tab's
  // own scroll area and .cols holds the sections in columns (style.css)
  const page = el('div', 'page');
  page.id = 'page-' + mode.id;
  page.setAttribute('role', 'tabpanel');
  page.append(el('div', 'cols'));
  pages.append(page);
});
const colsOf = (id) => pageOf(id).firstElementChild;

// Draws the mode's sections in the saved order; any not in it go last
function buildPage(mode) {
  const want = Array.isArray(settings.order[mode.id]) ? settings.order[mode.id] : [];
  const rank = (s) => { const i = want.indexOf(s.title); return i < 0 ? want.length : i; };
  const screens = mode.screens.map((s, i) => ({ s, i })).sort((a, b) => rank(a.s) - rank(b.s) || a.i - b.i);
  colsOf(mode.id).replaceChildren(...screens.map(({ s }) => makeScreen(s)));
}

// Each tab scrolls on its own; switching or changing the view starts at the top
function scrollToTop() {
  pageOf(currentTab).scrollTop = 0;
  pages.scrollTop = 0;
}

let currentTab = MODES[0].id;
function showPage(id) {
  if (!pageOf(id)) id = MODES[0].id;
  currentTab = id;
  tabs.querySelectorAll('.tab-btn').forEach((tb) => {
    const on = tb.dataset.target === id;
    tb.classList.toggle('active', on);
    tb.setAttribute('aria-selected', String(on));
  });
  pages.querySelectorAll('.page, .cpage').forEach((p) => p.classList.toggle('active', p.id === 'page-' + id || p.id === 'cpage-' + id));
  scrollToTop();
}
showPage(currentTab);

/* ---------- View: full or minimal ---------- */
function applyView() {
  const compact = settings.view === 'compact';
  document.body.classList.toggle('compact', compact);
  $('view-btn').setAttribute('aria-pressed', String(compact));
  $('compact-toggle').checked = compact;
  scrollToTop();
}
function setView(view) {
  if (view === 'compact' && editing) setEditing(false); // moving sections only exists in the full view
  settings.view = view;
  applyView();
  save();
}
$('view-btn').addEventListener('click', () => setView(settings.view === 'compact' ? 'full' : 'compact'));
$('compact-toggle').addEventListener('change', (e) => setView(e.target.checked ? 'compact' : 'full'));

/* ---------- Moving sections (drag by the header) ---------- */
let editing = false;

function setEditing(on) {
  editing = on;
  document.body.classList.toggle('editing', on);
  $('edit-bar').hidden = !on;
  $('edit-toggle').checked = on;
}

function startDrag(e, screen) {
  if (!editing || e.button > 0) return;
  e.preventDefault();
  const head = e.currentTarget;
  const page = screen.parentElement; // the tab's .cols
  const content = page.parentElement; // the tab's scroll area (.page)
  const r = screen.getBoundingClientRect();
  const dx = e.clientX - r.left, dy = e.clientY - r.top;

  // The placeholder keeps the section's place while the section follows the finger
  const ph = el('div', 'screen-ph');
  ph.style.height = r.height + 'px';
  screen.before(ph);
  Object.assign(screen.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', margin: '0' });
  screen.classList.add('dragging');
  try { head.setPointerCapture(e.pointerId); } catch {}

  const move = (ev) => {
    screen.style.left = ev.clientX - dx + 'px';
    screen.style.top = ev.clientY - dy + 'px';
    // Scroll the page when the finger nears the top or bottom edge
    const cr = content.getBoundingClientRect();
    if (ev.clientY < cr.top + 50) content.scrollTop -= 14;
    else if (ev.clientY > cr.bottom - 50) content.scrollTop += 14;

    // What's under the finger, not counting the dragged section itself
    const target = document.elementsFromPoint(ev.clientX, ev.clientY)
      .map((n) => n.closest('.screen, .screen-ph'))
      .find((n) => n && n !== screen);
    if (!target || target === ph || target.parentElement !== page) return;
    const tr = target.getBoundingClientRect();
    if (ev.clientY < tr.top + tr.height / 2) { if (target.previousElementSibling !== ph) target.before(ph); }
    else if (target.nextElementSibling !== ph) target.after(ph);
  };
  const end = () => {
    head.removeEventListener('pointermove', move);
    head.removeEventListener('pointerup', end);
    head.removeEventListener('pointercancel', end);
    ph.replaceWith(screen);
    screen.removeAttribute('style');
    screen.classList.remove('dragging');
    settings.order[content.id.slice(5)] = [...page.children].map((c) => c.dataset.id);
    save();
  };
  head.addEventListener('pointermove', move);
  head.addEventListener('pointerup', end);
  head.addEventListener('pointercancel', end);
}

/* ---------- Text size ---------- */
// The MFD's CSS is all in rem, so changing the root font size is enough
const FONT_SCALES = [['S', 0.85], ['M', 1], ['L', 1.15], ['XL', 1.3]];

function applyFont() {
  document.documentElement.style.fontSize = 16 * settings.fontScale + 'px';
  $('font-scale').querySelectorAll('button').forEach((b) => b.setAttribute('aria-checked', String(Number(b.dataset.v) === settings.fontScale)));
}
for (const [label, v] of FONT_SCALES) {
  const b = el('button', null, label);
  b.setAttribute('role', 'radio');
  b.dataset.v = v;
  b.style.fontSize = 0.8 * v + 'rem';
  b.addEventListener('click', () => { settings.fontScale = v; applyFont(); save(); });
  $('font-scale').append(b);
}

/* ---------- Theme by ship maker ---------- */
// Theme id (style.css), name, and the three-letter code shown on its color swatch.
// Only the names refer to the game's makers: there are no logos or other game artwork.
const MAKERS = [
  ['rsi', 'RSI', 'RSI'],
  ['aegis', 'Aegis', 'AEG'],
  ['anvil', 'Anvil', 'ANV'],
  ['aopoa', 'Aopoa', 'AOP'],
  ['argo', 'ARGO', 'ARG'],
  ['banu', 'Banu', 'BNU'],
  ['consolidated', 'C. Outland', 'CO'],
  ['crusader', 'Crusader', 'CRU'],
  ['drake', 'Drake', 'DRK'],
  ['esperia', 'Esperia', 'ESP'],
  ['gatac', 'Gatac', 'GTC'],
  ['kruger', 'Kruger', 'KRG'],
  ['misc', 'MISC', 'MSC'],
  ['origin', 'Origin', 'ORI'],
  ['tumbril', 'Tumbril', 'TMB'],
];
const grid = $('theme-grid');

function applyTheme(id) {
  const maker = MAKERS.find((m) => m[0] === id);
  if (!maker) return;
  document.documentElement.setAttribute('data-theme', id);
  for (const sw of ['theme-swatch', 'settings-theme-swatch']) $(sw).textContent = maker[2];
  $('theme-name').textContent = maker[1];
  $('settings-theme-name').textContent = maker[1];
  grid.querySelectorAll('.maker').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === id)));
}

// One card per maker; each carries its data-theme to show its colors
for (const [id, name, code] of MAKERS) {
  const b = el('button', 'maker');
  b.dataset.theme = id;
  const sw = el('span', 'swatch', code);
  sw.setAttribute('aria-hidden', 'true');
  b.append(sw, el('span', null, name));
  b.addEventListener('click', () => {
    settings.theme = id;
    applyTheme(id);
    save();
    closeModal($('theme-modal'));
  });
  grid.append(b);
}

/* ---------- Dialogs (settings and maker) ---------- */
function openModal(m) {
  m.hidden = false;
  const selected = m.querySelector('[aria-pressed="true"]');
  if (selected) selected.scrollIntoView({ block: 'nearest' });
}
function closeModal(m) { m.hidden = true; }

document.querySelectorAll('.modal').forEach((m) => {
  m.addEventListener('click', (e) => { if (e.target === m) closeModal(m); });
  m.querySelector('.modal-close').addEventListener('click', () => closeModal(m));
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal:not([hidden])').forEach(closeModal);
});

$('theme-btn').addEventListener('click', () => openModal($('theme-modal')));
$('settings-btn').addEventListener('click', () => openModal($('settings-modal')));
$('settings-theme').addEventListener('click', () => {
  closeModal($('settings-modal'));
  openModal($('theme-modal'));
});

$('edit-toggle').addEventListener('change', (e) => {
  if (e.target.checked && settings.view === 'compact') setView('full'); // sections move in the full view
  setEditing(e.target.checked);
  if (editing) closeModal($('settings-modal')); // so the sections can be dragged
});
$('edit-done').addEventListener('click', () => setEditing(false));

$('reset-tab').addEventListener('click', () => {
  delete settings.order[currentTab];
  buildPage(MODES.find((m) => m.id === currentTab));
  save();
});
$('reset-all').addEventListener('click', () => {
  settings.order = {};
  MODES.forEach(buildPage);
  save();
});

/* ---------- Startup (behind the loading screen, boot.js) ---------- */
const Boot = window.Boot || { part() {}, done() {}, finish() {}, styles: Promise.resolve() };
// A frame, or 100 ms if frames are paused (a hidden iframe gets no requestAnimationFrame)
const nextFrame = () => new Promise((resolve) => { requestAnimationFrame(() => resolve()); setTimeout(resolve, 100); });
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Images to have decoded before the MFD shows (none here: this shard draws everything with CSS)
const PRELOAD = [];

// shard-api.js is injected after this script: Shard exists from DOMContentLoaded on
async function loadSaved() {
  if (document.readyState === 'loading') await new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
  if (!window.Shard || !Shard.load) return;
  const data = await Promise.race([Shard.load().catch(() => null), wait(2500).then(() => null)]);
  if (!data || typeof data !== 'object') return;
  if (typeof data.theme === 'string') settings.theme = data.theme;
  if (FONT_SCALES.some(([, v]) => v === data.fontScale)) settings.fontScale = data.fontScale;
  if (typeof data.tab === 'string') settings.tab = data.tab;
  if (data.view === 'full' || data.view === 'compact') settings.view = data.view;
  if (data.order && typeof data.order === 'object') settings.order = data.order;
}

async function preload(srcs) {
  let n = 0;
  await Promise.all(srcs.map(async (src) => {
    const img = new Image();
    img.src = src;
    try { await img.decode(); } catch {}
    n++;
    Boot.part('assets', n / srcs.length, t('boot.assets', { n, total: srcs.length }));
  }));
}

// Draws one icon of each kind behind the loading screen so their masks are decoded before the first
// tab switch, instead of popping in then
async function warmIcons() {
  const names = new Set();
  for (const mode of MODES) for (const s of mode.screens) for (const b of s.items) if (b && b.i) names.add(b.i);
  for (const spec of Object.values(window.MFD_COMPACT || {})) for (const it of spec.items) if (it.over && it.over.i) names.add(it.over.i);
  const box = el('div');
  box.setAttribute('aria-hidden', 'true');
  box.style.cssText = 'position:fixed;left:0;top:0;display:flex;flex-wrap:wrap;width:100vw;opacity:0.01;pointer-events:none;';
  for (const name of names) {
    const i = el('i', 'i i-' + name);
    i.style.cssText = 'width:48px;height:48px;';
    box.append(i);
  }
  document.body.append(box);
  await nextFrame();
  await nextFrame();
  box.remove();
}

async function start() {
  Boot.part('sync', 0, t('boot.sync'));
  await loadSaved();
  applyTheme(settings.theme);
  applyFont();
  applyView();
  Boot.done('sync');

  // One page per frame, so the bar moves while they're built
  for (const [n, mode] of MODES.entries()) {
    Boot.part('pages', n / MODES.length, t('boot.pages', { n: n + 1, total: MODES.length, name: mode.label }));
    await nextFrame();
    buildPage(mode);
    const compact = buildCompact(mode);
    if (compact) pageOf(mode.id).after(compact);
  }
  Boot.done('pages');

  if (PRELOAD.length) await preload(PRELOAD);
  Boot.done('assets');

  // Shows every tab and both dialogs for a frame behind the loading screen, so the browser lays them
  // out and draws them now: the hidden tabs keep that layout (style.css) and the first switch is quick
  await Boot.styles;
  const dialogs = [$('theme-modal'), $('settings-modal')];
  const total = MODES.length + dialogs.length + 1;
  let step = 0;
  for (const mode of MODES) {
    Boot.part('warm', step++ / total, t('boot.warm'));
    showPage(mode.id);
    await nextFrame();
  }
  for (const m of dialogs) {
    Boot.part('warm', step++ / total);
    m.hidden = false;
    await nextFrame();
    m.hidden = true;
  }
  await warmIcons();
  showPage(settings.tab || MODES[0].id);
  Boot.done('warm');
}

start().catch((e) => console.error(e)).finally(() => Boot.finish());

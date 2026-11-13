// SPDX-License-Identifier: Apache-2.0
// Loading screen. It covers the MFD from the first paint (the markup is #boot in index.html) until
// the stylesheets have loaded, the saved settings are read and every page is built.
//
// Progress is real: each step has a fixed share of the bar and reports how far it got.
//   Boot.part(step, fraction, text?)   step partly done; text is its line in the log
//   Boot.done(step, text?)             step finished (its line gets OK)
//   Boot.finish()                      everything is ready: close as soon as the styles are in
//   Boot.styles                        a promise that resolves when style.css and icons.css loaded
// The screen never stays stuck: it closes after MAX_MS no matter what, and on any script error.
(() => {
  const STEPS = { css: 10, icons: 15, sync: 10, pages: 25, assets: 20, warm: 20 };
  const MIN_MS = 900; // shorter than this it would only be a flash
  const MAX_MS = 12000;
  const start = performance.now();

  // Same lookup as script.js: ?lang= from the viewer, else the browser; exact language, base, English
  const LANG = (new URLSearchParams(location.search).get('lang') || navigator.language || 'en').toLowerCase();
  const t = (key, vars = {}) => {
    const all = window.SHARD_STRINGS || {};
    const table = [LANG, LANG.split('-')[0], 'en'].map((l) => all[l]).find((s) => s && key in s);
    const text = table ? table[key] : key;
    return text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  };

  const root = document.getElementById('boot');
  const q = (sel) => root && root.querySelector(sel);
  const fill = q('.boot-fill'), pct = q('.boot-pct'), arc = q('.r-prog'), log = q('.boot-log'), status = q('.boot-status');
  if (status) status.textContent = t('boot.loading');

  const frac = Object.fromEntries(Object.keys(STEPS).map((k) => [k, 0]));
  const lines = {};
  let target = 0, shown = 0, finishing = false, closed = false;

  function line(step, text) {
    if (!log || text == null) return;
    let li = lines[step];
    if (!li) {
      li = document.createElement('li');
      li.append(document.createElement('span'));
      log.append(li);
      lines[step] = li;
      while (log.children.length > 5) log.firstElementChild.remove();
    }
    li.firstChild.textContent = text;
  }
  function set(step, f, text) {
    if (!(step in frac)) return;
    frac[step] = Math.max(frac[step], Math.min(1, f));
    line(step, text);
    if (frac[step] >= 1 && lines[step]) lines[step].classList.add('ok');
    target = Object.keys(STEPS).reduce((sum, k) => sum + STEPS[k] * frac[k], 0);
  }

  // style.css and icons.css come with media="print" so they don't block this screen's first paint;
  // their onload in index.html switches them on, and here they count as steps
  let stylesLeft = 0, stylesReady;
  const styles = new Promise((resolve) => { stylesReady = resolve; });
  document.querySelectorAll('link[data-boot]').forEach((link) => {
    const step = link.dataset.boot;
    stylesLeft++;
    line(step, t('boot.' + step));
    const ok = () => {
      link.media = 'all';
      set(step, 1);
      if (--stylesLeft === 0) stylesReady();
    };
    if (link.sheet) ok();
    else {
      link.addEventListener('load', ok, { once: true });
      link.addEventListener('error', ok, { once: true });
    }
  });
  if (stylesLeft === 0) stylesReady();

  function render() {
    const n = Math.round(shown);
    if (fill) fill.style.width = shown + '%';
    if (arc) arc.style.strokeDashoffset = String(100 - shown);
    if (pct) pct.textContent = String(n).padStart(3, '0') + '%';
    if (root) root.setAttribute('aria-valuenow', String(n));
  }
  function tick() {
    if (closed) return;
    // Eases toward the real progress and never goes back
    shown = Math.min(target, shown + Math.max(0.4, (target - shown) * 0.14));
    render();
    if (finishing && shown >= 99.9 && performance.now() - start >= MIN_MS) close();
    else requestAnimationFrame(tick);
  }

  function close() {
    if (closed) return;
    closed = true;
    window.removeEventListener('error', onError);
    if (!root) return;
    shown = 100;
    render();
    root.setAttribute('aria-busy', 'false');
    root.classList.add('out');
    setTimeout(() => root.remove(), 700);
  }

  function finish() {
    if (finishing) return;
    finishing = true;
    // The page underneath must have its styles before it shows
    styles.then(() => {
      for (const k of Object.keys(STEPS)) set(k, 1);
      line('ready', t('boot.ready'));
      if (lines.ready) lines.ready.classList.add('ok');
      // tick() closes it when the bar reaches 100%; this covers frames being paused
      setTimeout(close, MIN_MS + 1500);
    });
  }

  const onError = () => { finish(); setTimeout(close, 1500); };
  window.addEventListener('error', onError);
  setTimeout(close, MAX_MS);

  window.Boot = {
    part: (step, f, text) => set(step, f, text),
    done: (step, text) => set(step, 1, text),
    finish,
    styles,
    t,
  };

  if (root) requestAnimationFrame(tick);
  else close();
})();

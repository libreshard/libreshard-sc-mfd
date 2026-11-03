#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// Checks compact.js against layout.js and manifest.json. Usage, from the shard's folder:
//   node tools/check-compact.js          summary and errors (exits with code 1 on errors)
//   node tools/check-compact.js --map    also draws each grid in ASCII
//
// Checks that every button exists, fits in the grid and doesn't overlap another, that its keys are
// already in permissions.keys, and that every tab has a minimal view.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const load = (file) => {
  const win = {};
  new Function('window', fs.readFileSync(path.join(root, file), 'utf8') + '\n;return window;')(win);
  return win;
};
const { MFD_LAYOUT } = load('layout.js');
const { MFD_COMPACT } = load('compact.js');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const allowed = new Set(manifest.permissions.keys);
const SHAPES = ['bevel', 'oct', 'hex', 'pill', 'orb', 'up', 'down', 'left', 'right'];

const errors = [];
const err = (mode, msg) => errors.push(`[${mode}] ${msg}`);

for (const mode of MFD_LAYOUT) {
  const spec = MFD_COMPACT[mode.id];
  if (!spec) { err(mode.id, 'no minimal view'); continue; }
  const cols = spec.cols || 12, rows = spec.rows || 6;
  const grid = Array.from({ length: rows }, () => Array(cols).fill('.'));
  const used = new Map();
  let n = 0;

  for (const it of spec.items) {
    const [title, label] = it.ref.split('::');
    const screen = mode.screens.find((s) => s.title === title);
    const btn = screen && screen.items.find((b) => b && b.l === label);
    if (!btn) { err(mode.id, `reference that doesn't exist: ${it.ref}`); continue; }
    if (!SHAPES.includes(it.s)) err(mode.id, `${it.ref}: unknown shape "${it.s}"`);
    if (!allowed.has(btn.k.toLowerCase())) err(mode.id, `${it.ref}: key ${btn.k} isn't in the manifest`);
    if (used.has(it.ref)) err(mode.id, `${it.ref}: repeated (also at ${used.get(it.ref)})`);
    used.set(it.ref, `${it.x},${it.y}`);

    if (it.x < 1 || it.y < 1 || it.x + it.w - 1 > cols || it.y + it.h - 1 > rows) {
      err(mode.id, `${it.ref}: outside the grid (${it.x},${it.y} ${it.w}×${it.h})`);
      continue;
    }
    const mark = String.fromCharCode(65 + (n % 26));
    n++;
    for (let y = it.y; y < it.y + it.h; y++) {
      for (let x = it.x; x < it.x + it.w; x++) {
        if (grid[y - 1][x - 1] !== '.') err(mode.id, `${it.ref}: overlaps another button at (${x},${y})`);
        grid[y - 1][x - 1] = mark;
      }
    }
  }

  for (const z of spec.zones || []) {
    if (z.x < 1 || z.y < 1 || z.x + z.w - 1 > cols || z.y + z.h - 1 > rows) err(mode.id, `zone ${z.code} outside the grid`);
  }

  const filled = grid.flat().filter((c) => c !== '.').length;
  console.log(`${mode.id.padEnd(8)} ${String(spec.items.length).padStart(2)} buttons · ${filled}/${cols * rows} cells`);
  if (process.argv.includes('--map')) console.log(grid.map((r) => '   ' + r.join(' ')).join('\n') + '\n');
}

for (const id of Object.keys(MFD_COMPACT)) {
  if (!MFD_LAYOUT.some((m) => m.id === id)) errors.push(`[${id}] minimal view for a tab that doesn't exist`);
}

if (errors.length) {
  console.error('\n' + errors.join('\n'));
  process.exit(1);
}
console.log('\nOK: references, bounds, overlaps and permissions are correct.');

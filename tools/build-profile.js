#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// Generates the game's control profile (LibreShard_MFD.xml) and the manifest's
// permissions.keys from layout.js. Usage, from the shard's folder:  node tools/build-profile.js
//
// The profile only binds the actions marked bind: true (the ones with no default key); every other
// action keeps its default key. It's imported in the game from Options → Keybindings → Control Profiles.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const window = {};
new Function('window', fs.readFileSync(path.join(root, 'layout.js'), 'utf8'))(window);

// LibreShard key name (keys.js) → the game's key name
const SC_KEY = {
  alt: 'lalt', ctrl: 'lctrl', shift: 'lshift', pageup: 'pgup', pagedown: 'pgdn', equal: 'equals',
  numpadplus: 'np_add', numpadminus: 'np_subtract', numpadmul: 'np_multiply', numpaddiv: 'np_divide',
  numpaddot: 'np_period', numpadenter: 'np_enter',
};
const toSC = (combo) => combo.toLowerCase().split('+')
  .map((p) => SC_KEY[p] || (/^numpad\d$/.test(p) ? 'np_' + p.slice(6) : p))
  .join('+');

// Actions the game defines in more than one actionmap: they're bound in all of them
const ALSO = {
  v_open_all_doors: ['spaceship_general', 'vehicle_general'],
  v_close_all_doors: ['spaceship_general', 'vehicle_general'],
  v_unlock_all_doors: ['spaceship_general', 'vehicle_general'],
  v_lock_all_doors: ['spaceship_general', 'vehicle_general'],
};

const buttons = window.MFD_LAYOUT.flatMap((m) => m.screens.flatMap((s) => s.items)).filter(Boolean);

// actionmap → action → { kb, mouse }
const binds = new Map();
const owner = new Map(); // combo → action (to catch a combo used twice)
for (const b of buttons.filter((x) => x.bind)) {
  const [map, action] = b.a.split('/');
  const kb = toSC(b.k);
  if (owner.has(kb) && owner.get(kb) !== action) throw new Error(`${b.k} is bound to ${owner.get(kb)} and to ${action}`);
  owner.set(kb, action);
  for (const m of ALSO[action] || [map]) {
    if (!binds.has(m)) binds.set(m, new Map());
    binds.get(m).set(action, { kb, mouse: b.mouse });
  }
}

const out = [
  '<ActionMaps version="1" optionsVersion="2" rebindVersion="2" profileName="LibreShard MFD">',
  ' <CustomisationUIHeader label="LibreShard MFD" description="Actions with no default key used by the SC MFD shard for LibreShard" image="">',
  '  <devices>',
  '   <keyboard instance="1"/>',
  '   <mouse instance="1"/>',
  '  </devices>',
  '  <categories/>',
  ' </CustomisationUIHeader>',
  ' <modifiers/>',
];
for (const [map, actions] of binds) {
  out.push(` <actionmap name="${map}">`);
  for (const [action, { kb, mouse }] of actions) {
    out.push(`  <action name="${action}">`);
    out.push(`   <rebind input="kb1_${kb}"/>`);
    // Keeps the default mouse input (fire, quantum…) when adding the keyboard one
    if (mouse) out.push(`   <rebind input="mo1_${mouse}"/>`);
    out.push('  </action>');
  }
  out.push(' </actionmap>');
}
out.push('</ActionMaps>', '');
fs.writeFileSync(path.join(root, 'LibreShard_MFD.xml'), out.join('\n'));

// permissions.keys: every combo in the layout, once
const manifestPath = path.join(root, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.permissions.keys = [...new Set(buttons.map((b) => b.k.toLowerCase()))];
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

console.log(`LibreShard_MFD.xml: ${owner.size} actions bound · manifest: ${manifest.permissions.keys.length} keys`);

// SPDX-License-Identifier: Apache-2.0
// The shard's own icon set: 24×24, 2 px rounded strokes, drawn for this shard (no third-party icons).
// Each value is the inside of an <svg>; tools/build-icons.js turns them into masks in icons.css,
// so every icon takes the button's color. Run `node tools/build-icons.js` after changing them.

// Base glyphs, full size
const G = {
  reticle: '<circle cx="12" cy="12" r="6"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/>',
  thruster: '<path d="M9 3h6v4l3 6H6l3-6z"/><path d="M9 16l-1 4M12 16v5M15 16l1 4"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  power: '<path d="M12 3v8"/><path d="M7 6.5a8 8 0 1 0 10 0"/>',
  flare: '<circle cx="12" cy="12" r="2.5"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
  missile: '<path d="M20 4c-4 0-8 2-11 5l-3 3 6 6 3-3c3-3 5-7 5-11z"/><path d="M6 12l-3 1 1 3M12 18l-1 3-3-1M5 19l-2 2"/>',
  corners: '<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/>',
  padlock: '<rect x="5" y="11" width="14" height="10" rx="1"/><path d="M12 15v2"/>',
  gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><circle cx="12" cy="18" r="1"/>',
  ship: '<path d="M12 7.5l3.8 9-3.8-2.3-3.8 2.3z"/>',
  hull: '<path d="M5 12.5c2-2 12-2 14 0-2 1.5-12 1.5-14 0z"/>',
};

// Shrinks a glyph into the top-left, leaving the bottom-right corner for a badge
const small = (body) => `<g transform="scale(0.72)" stroke-width="2.8">${body}</g>`;
const plus = '<path d="M19.5 14.5v7M16 18h7"/>';
const minus = '<path d="M16 18h7"/>';
const powerBadge = '<path d="M19.5 13.5v3.5"/><path d="M17 15a3.5 3.5 0 1 0 5 0"/>';
const up = (g) => small(g) + plus;
const down = (g) => small(g) + minus;
const powered = (g) => small(g) + powerBadge;
// A thick arc on one side of a shape: the shield face being raised
const face = (d) => `<path d="${d}" stroke-width="3"/>`;

module.exports = {
  power: G.power,
  ready: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>',
  'pwr-wep': powered(G.reticle),
  'pwr-thr': powered(G.thruster),
  'pwr-shd': powered(G.shield),
  'wep-up': up(G.reticle),
  'wep-down': down(G.reticle),
  'thr-up': up(G.thruster),
  'thr-down': down(G.thruster),
  'shd-up': up(G.shield),
  'shd-down': down(G.shield),
  'pwr-reset': '<path d="M7 11v8M12 11v8M17 11v8"/><path d="M4 7c3-3.5 13-3.5 16 0"/><path d="M20 7l-.8-3.4M20 7l-3.5.4"/>',
  lights: '<path d="M4 7c4 0 6 2 6 5s-2 5-6 5z"/><path d="M13 8l8-2M13 12h8M13 16l8 2"/>',
  coupled: '<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>',
  cruise: G.gauge + '<path d="M12 18l4-5"/>',
  limiter: G.gauge + '<path d="M12 18l3.5-6.5"/><path d="M16.5 9.5l2.5-2" stroke-width="3"/>',
  vtol: '<path d="M5 6h14"/><path d="M8 9v9M5.5 15.5L8 18l2.5-2.5M16 9v9M13.5 15.5L16 18l2.5-2.5"/>',
  gear: '<path d="M12 3v9M8 7l4 5"/><circle cx="12" cy="17" r="4"/><circle cx="12" cy="17" r="1"/>',
  'land-req': '<path d="M12 3v11M8 10l4 4 4-4M4 19h16M7 22h10"/>',
  exit: '<path d="M13 4H5v16h8"/><path d="M10 12h10M17 9l3 3-3 3"/>',
  'port-lock': '<rect x="6" y="11" width="12" height="9" rx="1"/><path d="M9 11V8a3 3 0 0 1 6 0v3M3 6V3h3M21 6V3h-3M3 18v3h3M21 18v3h-3"/>',
  flight: '<path d="M12 3l7 17-7-4-7 4z"/>',
  quantum: '<path d="M3 7l5 5-5 5M9 7l5 5-5 5M15 7l5 5-5 5"/>',
  scan: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 12l6.4-6.4"/>',
  ping: '<circle cx="12" cy="12" r="1.5"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8"/>',
  'sub-next': G.corners + '<path d="M8.5 12h7M13 9.5l2.5 2.5-2.5 2.5"/>',
  'sub-reset': G.corners + '<path d="M15 10.5a3.5 3.5 0 1 0 .5 3"/><path d="M15.5 7.5v3h-3"/>',
  decoy: G.flare,
  'decoy-up': up(G.flare),
  'decoy-down': down(G.flare),
  noise: '<path d="M2 12l3-6 3 12 3-12 3 12 3-12 3 12 2-6"/>',
  missiles: G.missile,
  'msl-up': up(G.missile),
  'msl-down': down(G.missile),
  bomb: '<circle cx="11" cy="14" r="6"/><path d="M15 9.5l2.5-2.5M19 3v2M22 6h-2M21 4l-1.2 1.2"/>',
  gimbal: '<circle cx="12" cy="12" r="8"/><ellipse cx="12" cy="12" rx="8" ry="3"/><circle cx="12" cy="12" r="1"/>',
  'shd-front': G.ship + face('M5.3 5.3a9.5 9.5 0 0 1 13.4 0'),
  'shd-back': G.ship + face('M18.7 18.7a9.5 9.5 0 0 1-13.4 0'),
  'shd-left': G.ship + face('M5.3 18.7a9.5 9.5 0 0 1 0-13.4'),
  'shd-right': G.ship + face('M18.7 5.3a9.5 9.5 0 0 1 0 13.4'),
  'shd-top': G.hull + face('M4 8c3.5-4.5 12.5-4.5 16 0'),
  'shd-bottom': G.hull + face('M4 17c3.5 4.5 12.5 4.5 16 0'),
  'shd-reset': G.shield + '<path d="M9 11h6M9 14h6"/>',
  guns: '<path d="M9 3v9M15 3v9M7.5 3h3M13.5 3h3M12 17v4M8 21h8"/><rect x="6" y="12" width="12" height="5" rx="1"/>',
  'door-open': '<path d="M3 21h18M6 21V3h12v18"/><path d="M6 3l7 3v15"/>',
  'door-close': '<path d="M3 21h18M6 21V3h12v18"/><circle cx="15" cy="12" r="1"/>',
  'door-unlock': G.padlock + '<path d="M8 11V7a4 4 0 0 1 7.6-1.7"/>',
  'door-lock': G.padlock + '<path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  module: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
  salvage: '<path d="M8 3h8v3H8z"/><path d="M9 6l-5 12M15 6l5 12M4 21l4-2 3 2 4-2 5 2"/>',
};

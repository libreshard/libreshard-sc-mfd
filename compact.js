// SPDX-License-Identifier: Apache-2.0
// Minimal mode: one screen per tab, no scrolling, with the most important actions.
//
// It defines no keys of its own: each button points to one in layout.js as 'SCREEN::LABEL', so keys,
// actions, hold and guard are always the same as in the full view, and the manifest and the profile
// don't change. If you rename a button in layout.js, run `node tools/check-compact.js` to see which
// references broke.
//
// Each tab is a grid of `cols` × `rows` cells that stretches to fill the screen (12 × 6 by default,
// meant for a landscape tablet). A button takes x, y (from 1), w, h cells.
//
//   item(ref, x, y, w, h, shape, changes?)   changes: { l: 'shorter label', tone, i: icon }
//   zone(code, x, y, w, h, name?)            a frame with corners that groups buttons (decorative only).
//                                            Without a name it uses the title of the screen with that code.
//
// Shapes (style.css, .shape-*): bevel (cut corners), oct, hex, pill, orb, up, down, left, right.
// Arrows (up/down/left/right) are for "more/less" and directions.
// orb is always a circle (the cell's short side): use it in nearly square spots.
// pill is a capsule: it suits wide buttons, not tall columns.

const item = (ref, x, y, w = 1, h = 1, s = 'bevel', over) => ({ ref, x, y, w, h, s, over });
const zone = (code, x, y, w, h, name) => ({ code, x, y, w, h, name });

// The SOCIAL tab's 20 emotes, in a 4-column grid
const EMOTES = ['WAVE', 'SALUTE', 'GREET', 'BOW', 'AGREE', 'DISAGREE', 'POINT', 'COME', 'WAIT', 'CHEER',
  'CLAP', 'LAUGH', 'DANCE', 'FLEX', 'SIT', 'SLEEP', 'AT EASE', 'ATTENTION', 'CONFIRM LAUNCH', 'WHISTLE'];

window.MFD_COMPACT = {
  /* ---------------------------------------------------------------- FLIGHT */
  flight: {
    zones: [
      zone('SYS', 1, 1, 3, 3), zone('LND', 1, 4, 3, 3),
      zone('IFCS', 4, 1, 5, 3, 'FLIGHT / QUANTUM'), zone('SCN', 6, 4, 3, 3),
      zone('PWR', 9, 1, 4, 4), zone('HUD', 9, 5, 4, 1), zone('DR', 9, 6, 4, 1),
    ],
    items: [
      item('SYSTEMS::FLIGHT READY', 1, 1, 3, 2, 'oct'),
      item('SYSTEMS::LIGHTS', 1, 3, 1, 1, 'orb'),
      item('SYSTEMS::PORT LOCK', 2, 3, 1, 1, 'orb'),
      item('SYSTEMS::EXIT SEAT', 3, 3, 1, 1, 'orb'),

      item('LANDING / DOCKING::LANDING GEAR', 1, 4, 2, 2, 'hex'),
      item('LANDING / DOCKING::REQUEST LANDING', 3, 4, 1, 1, 'bevel', { l: 'REQ. LAND' }),
      item('LANDING / DOCKING::VTOL', 3, 5, 1, 1),
      item('LANDING / DOCKING::DOCKING / CARGO', 1, 6, 3, 1, 'pill', { l: 'DOCKING' }),

      item('QUANTUM::ENGAGE QUANTUM', 4, 1, 3, 2, 'hex'),
      item('FLIGHT MODES::SCM', 7, 1, 2, 1, 'pill', { i: 'flight' }),
      item('FLIGHT MODES::NAV', 7, 2, 2, 1, 'pill'),
      item('FLIGHT MODES::MASTER MODE', 4, 3, 2, 1),
      item('FLIGHT MODES::COUPLED', 6, 3),
      item('FLIGHT MODES::CRUISE', 7, 3),
      item('FLIGHT MODES::SPEED LIMITER', 8, 3, 1, 1, 'bevel', { l: 'LIMITER' }),

      item('FLIGHT MODES::SPACEBRAKE', 4, 4, 2, 3, 'oct'),
      item('SCANNER::SCAN MODE', 6, 4, 3, 1),
      item('SCANNER::PING', 6, 5, 1, 2),
      item('SCANNER::SCAN', 7, 5, 2, 2, 'orb'),

      item('POWER::WEP +', 9, 1, 1, 2, 'up'),
      item('POWER::THR +', 10, 1, 1, 2, 'up'),
      item('POWER::SHD +', 11, 1, 1, 2, 'up'),
      item('POWER::POWER ALL', 12, 1, 1, 2),
      item('POWER::WEP −', 9, 3, 1, 1, 'down'),
      item('POWER::THR −', 10, 3, 1, 1, 'down'),
      item('POWER::SHD −', 11, 3, 1, 1, 'down'),
      item('POWER::RESET DIST.', 12, 3, 1, 2, 'bevel', { l: 'RESET' }),
      item('POWER::WEAPONS', 9, 4),
      item('POWER::THRUSTERS', 10, 4),
      item('POWER::SHIELDS', 11, 4),

      item('HUD / COMMS::MOBIGLAS', 9, 5, 2, 1),
      item('HUD / COMMS::STARMAP', 11, 5, 2, 1),

      item('DOORS::OPEN', 9, 6),
      item('DOORS::CLOSE', 10, 6),
      item('DOORS::UNLOCK', 11, 6),
      item('DOORS::LOCK', 12, 6),
    ],
  },

  /* ---------------------------------------------------------------- COMBAT */
  combat: {
    zones: [
      zone('TGT', 1, 1, 6, 3), zone('SHD', 7, 1, 3, 3), zone('PWR', 10, 1, 3, 3),
      zone('CM', 1, 4, 4, 3), zone('WPN', 5, 4, 4, 3), zone('MSL', 9, 4, 4, 3),
    ],
    items: [
      item('TARGETING::CYCLE IN VIEW', 1, 1, 3, 2, 'hex'),
      item('TARGETING::UNLOCK', 4, 1, 3, 1, 'pill'),
      item('TARGETING::SUB-TARGET', 4, 2, 3, 1, 'pill'),
      item('TARGETING::ATTACKERS', 1, 3),
      item('TARGETING::HOSTILES', 2, 3),
      item('TARGETING::FRIENDLIES', 3, 3),
      item('TARGETING::ALL', 4, 3),
      item('TARGETING::LOOK AHEAD', 5, 3, 2, 1),

      item('SHIELDS::TOP', 7, 1),
      item('SHIELDS::FRONT', 8, 1, 1, 1, 'up'),
      item('SHIELDS::LEFT', 7, 2, 1, 1, 'left'),
      item('SHIELDS::RESET', 8, 2, 1, 1, 'orb'),
      item('SHIELDS::RIGHT', 9, 2, 1, 1, 'right'),
      item('SHIELDS::BOTTOM', 7, 3),
      item('SHIELDS::BACK', 8, 3, 1, 1, 'down'),

      item('POWER::WEP +', 10, 1, 1, 2, 'up'),
      item('POWER::THR +', 11, 1, 1, 2, 'up'),
      item('POWER::SHD +', 12, 1, 1, 2, 'up'),
      item('POWER::WEAPONS', 10, 3),
      item('POWER::THRUSTERS', 11, 3),
      item('POWER::SHIELDS', 12, 3),

      item('COUNTERMEASURES::DECOY', 1, 4, 2, 2, 'orb'),
      item('COUNTERMEASURES::NOISE', 3, 4, 2, 2, 'orb'),
      item('COUNTERMEASURES::PANIC DECOY', 1, 6, 4, 1, 'pill'),

      item('WEAPONS::GIMBAL LOCK', 5, 4, 2, 1),
      item('WEAPONS::AIM MODE', 7, 4, 2, 1),
      item('WEAPONS::GUNS MODE', 5, 5, 2, 1),
      item('WEAPONS::MISSILE MODE', 7, 5, 2, 1),
      item('SCANNER::SCAN MODE', 5, 6, 2, 1),
      item('SCANNER::PING', 7, 6, 2, 1),

      item('MISSILES::LAUNCH', 9, 4, 2, 3, 'oct'),
      item('MISSILES::ARM +', 11, 4, 2, 1, 'up'),
      item('MISSILES::ARM −', 11, 5, 2, 1, 'down'),
      item('MISSILES::RESET ARMED', 11, 6, 2, 1),
    ],
  },

  /* ---------------------------------------------------------------- MINING */
  mining: {
    zones: [
      zone('MIN', 1, 1, 6, 5), zone('MOD', 1, 6, 6, 1),
      zone('SCN', 7, 1, 6, 3), zone('LND', 7, 4, 6, 2), zone('PWR', 7, 6, 6, 1),
    ],
    items: [
      item('MINING OPERATOR::MINING MODE', 1, 1, 4, 1, 'pill'),
      item('MINING OPERATOR::FIRE LASER', 1, 2, 4, 3, 'oct'),
      item('MINING OPERATOR::POWER +', 5, 1, 2, 2, 'up'),
      item('MINING OPERATOR::POWER −', 5, 3, 2, 2, 'down'),
      item('MINING OPERATOR::BEAM HIGH/LOW', 1, 5, 3, 1, 'bevel', { l: 'BEAM HI / LO' }),
      item('MINING OPERATOR::ACTIONS (PIT)', 4, 5, 3, 1),
      item('MODULES::MODULE 1', 1, 6, 2, 1),
      item('MODULES::MODULE 2', 3, 6, 2, 1),
      item('MODULES::MODULE 3', 5, 6, 2, 1),

      item('SCANNER::SCAN MODE', 7, 1, 3, 1),
      item('SCANNER::PING', 10, 1, 3, 1),
      item('SCANNER::SCAN', 7, 2, 3, 2, 'orb'),
      item('CARGO::JETTISON CARGO', 10, 2, 3, 2),

      item('LANDING::LANDING GEAR', 7, 4, 3, 2, 'hex'),
      item('LANDING::REQUEST LANDING', 10, 4, 3, 1, 'bevel', { l: 'REQ. LANDING' }),
      item('LANDING::VTOL', 10, 5, 3, 1),

      item('POWER::POWER ALL', 7, 6, 2, 1, 'pill'),
      item('POWER::THRUSTERS', 9, 6, 2, 1),
      item('POWER::SHIELDS', 11, 6, 2, 1),
    ],
  },

  /* --------------------------------------------------------------- SALVAGE */
  salvage: {
    zones: [
      zone('SLV', 1, 1, 8, 1), zone('FIRE', 1, 2, 8, 4), zone('BEAM', 9, 1, 4, 3, 'BEAM'),
      zone('FOC', 9, 4, 4, 2), zone('SHIP', 1, 6, 12, 1, 'SHIP'),
    ],
    items: [
      item('SALVAGE OPERATOR::SALVAGE MODE', 1, 1, 4, 1, 'pill'),
      item('SALVAGE OPERATOR::GIMBAL', 5, 1, 2, 1),
      item('SALVAGE OPERATOR::GIMBAL RESET', 7, 1, 2, 1, 'bevel', { l: 'GIMBAL RST' }),

      item('FIRE::LEFT HEAD', 1, 2, 2, 2, 'left'),
      item('FIRE::FOCUSED', 3, 2, 4, 2, 'hex'),
      item('FIRE::RIGHT HEAD', 7, 2, 2, 2, 'right'),
      item('FIRE::FRACTURE', 1, 4, 4, 2, 'oct'),
      item('FIRE::DISINTEGRATE', 5, 4, 4, 2, 'oct'),

      item('SALVAGE OPERATOR::SPACING +', 9, 1, 2, 2, 'up'),
      item('SALVAGE OPERATOR::SPACING −', 11, 1, 2, 2, 'down'),
      item('MODIFIERS::CYCLE LEFT', 9, 3, 2, 1, 'left'),
      item('MODIFIERS::CYCLE RIGHT', 11, 3, 2, 1, 'right'),

      item('FOCUS::ALL HEADS', 9, 4, 4, 1, 'pill'),
      item('FOCUS::LEFT', 9, 5, 2, 1, 'bevel', { l: 'FOCUS LEFT' }),
      item('FOCUS::RIGHT', 11, 5, 2, 1, 'bevel', { l: 'FOCUS RIGHT' }),

      item('SCANNER::SCAN MODE', 1, 6, 2, 1),
      item('SCANNER::PING', 3, 6, 2, 1),
      item('SCANNER::SCAN', 5, 6, 2, 1),
      item('CARGO::JETTISON CARGO', 7, 6, 2, 1),
      item('POWER::POWER ALL', 9, 6, 2, 1),
      item('LANDING::LANDING GEAR', 11, 6, 2, 1),
    ],
  },

  /* --------------------------------------------------------------- ON FOOT */
  fps: {
    zones: [
      zone('EQP', 1, 1, 6, 3), zone('WPN', 7, 1, 6, 3),
      zone('ACT', 1, 4, 8, 3), zone('EMG', 9, 4, 4, 2), zone('HUD', 9, 6, 4, 1),
    ],
    items: [
      item('LOADOUT::PRIMARY', 1, 1, 2, 2, 'oct'),
      item('LOADOUT::SECONDARY', 3, 1, 2, 2, 'oct'),
      item('LOADOUT::SIDEARM', 5, 1, 2, 2, 'oct', { i: 'guns' }),
      item('LOADOUT::CONSUMABLES', 1, 3, 2, 1),
      item('LOADOUT::GADGET', 3, 3, 2, 1),
      item('LOADOUT::THROWABLE', 5, 3, 2, 1),

      item('WEAPON::RELOAD', 7, 1, 3, 2, 'hex'),
      item('WEAPON::FIRE MODE', 10, 1, 3, 1, 'pill'),
      item('WEAPON::STANCE', 10, 2, 3, 1, 'pill'),
      item('WEAPON::ZEROING +', 7, 3, 2, 1, 'up'),
      item('WEAPON::ZEROING −', 9, 3, 2, 1, 'down'),
      item('WEAPON::UNDERBARREL', 11, 3, 2, 1),

      item('ACTIONS::INTERACT', 1, 4, 3, 3, 'orb'),
      item('ACTIONS::INVENTORY', 4, 4, 3, 1),
      item('ACTIONS::FLASHLIGHT', 7, 4, 2, 1),
      item('ACTIONS::CROUCH', 4, 5, 3, 1),
      item('ACTIONS::PRONE', 7, 5, 2, 1),
      item('ACTIONS::HELMET', 4, 6, 3, 1),
      item('ACTIONS::WIPE VISOR', 7, 6, 2, 1),

      item('EMERGENCY::RESCUE BEACON', 9, 4, 2, 2, 'orb'),
      item('EMERGENCY::RESPAWN', 11, 4, 2, 2, 'oct'),
      item('HUD::MOBIGLAS', 9, 6, 2, 1),
      item('HUD::MAP', 11, 6, 2, 1),
    ],
  },

  /* ---------------------------------------------------------------- SOCIAL */
  social: {
    zones: [
      zone('VOIP', 1, 1, 4, 6), zone('CS', 5, 1, 4, 6),
      zone('EMT', 9, 1, 4, 5), zone('COM', 9, 6, 4, 1, 'COMMS'),
    ],
    items: [
      item('VOICE::PUSH TO TALK', 1, 1, 4, 3, 'hex'),
      item('VOICE::PROXIMITY PTT', 1, 4, 2, 3),
      item('VOICE::HEAD TRACKING', 3, 4, 2, 3),

      item('COMBAT EMOTES::FORWARD', 6, 1, 2, 2, 'up'),
      item('COMBAT EMOTES::LEFT', 5, 3, 1, 2, 'left'),
      item('COMBAT EMOTES::STOP', 6, 3, 2, 2, 'orb'),
      item('COMBAT EMOTES::RIGHT', 8, 3, 1, 2, 'right'),
      item('COMBAT EMOTES::YES', 5, 5, 2, 2),
      item('COMBAT EMOTES::NO', 7, 5, 2, 2),

      ...EMOTES.map((l, n) => item('EMOTES::' + l, 9 + (n % 4), 1 + Math.floor(n / 4), 1, 1, 'bevel',
        l === 'CONFIRM LAUNCH' ? { l: 'LAUNCH' } : undefined)),

      item('VOICE::COMMS', 9, 6, 2, 1, 'pill'),
      item('VOICE::CHAT', 11, 6, 2, 1, 'pill'),
    ],
  },

  /* --------------------------------------------------------------- VEHICLE */
  vehicle: {
    zones: [zone('SYS', 1, 1, 4, 6), zone('DRV', 5, 1, 4, 6), zone('WPN', 9, 1, 4, 6)],
    items: [
      item('SYSTEMS::SYSTEMS READY', 1, 1, 4, 2, 'hex'),
      item('SYSTEMS::LIGHTS', 1, 3, 2, 2, 'orb'),
      item('SYSTEMS::EXIT', 3, 3, 2, 2, 'orb'),
      item('SYSTEMS::DOORS OPEN', 1, 5, 2, 2),
      item('SYSTEMS::DOORS CLOSE', 3, 5, 2, 2),

      item('DRIVING::HORN', 5, 1, 4, 2, 'pill'),
      item('DRIVING::BRAKE', 5, 3, 4, 3, 'oct'),
      item('DRIVING::AUTO-BRAKE', 5, 6, 4, 1, 'pill'),

      item('WEAPONS::GIMBAL LOCK', 9, 1, 4, 2, 'hex'),
      item('WEAPONS::AIM MODE', 9, 3, 2, 2),
      item('WEAPONS::SCAN MODE', 11, 3, 2, 2),
      item('WEAPONS::CAMERA', 9, 5, 4, 2, 'pill'),
    ],
  },
};

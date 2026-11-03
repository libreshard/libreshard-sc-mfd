// SPDX-License-Identifier: Apache-2.0
// The MFD's commands per game mode (SC 4.10.2).
//
// Each button says which game action it runs (a: 'actionmap/action', names from defaultProfile.xml):
//  - If the action has a default key, k is that key.
//  - If it hasn't, k is a free combo (RCtrl/RAlt + key) and bind: true. Those actions are bound by
//    importing the LibreShard_MFD.xml profile in the game, which tools/build-profile.js generates.
// If you change a key here, regenerate the profile and add the key to the manifest's
// permissions.keys (node tools/build-profile.js does both).
//
// Each screen: { title, code, cols, items, note? }   note is a key in strings.js
// Each button: { l: label, k: combo, a: action, i?: icon (tools/icons.js),
//                hold?: true | 'text'  → held while the finger is on it (the game tells tap and hold apart),
//                guard?: true          → tap once to arm it first (dangerous actions),
//                bind?: true           → no default key: the LibreShard MFD profile binds it,
//                mouse?: 'mouse1'      → default mouse input the profile keeps when it adds the key,
//                tone?: 'warn' | 'danger', span?: columns }
// null leaves an empty cell. Labels stay in English, like the game's own controls.

const POWER = {
  title: 'POWER', code: 'PWR', cols: 3,
  items: [
    { l: 'WEP +', k: 'f5', a: 'spaceship_power/v_engineering_assignment_weapons_increase', i: 'wep-up', hold: 'MAX' },
    { l: 'THR +', k: 'f6', a: 'spaceship_power/v_engineering_assignment_engine_increase', i: 'thr-up', hold: 'MAX' },
    { l: 'SHD +', k: 'f7', a: 'spaceship_power/v_engineering_assignment_shields_increase', i: 'shd-up', hold: 'MAX' },
    { l: 'WEP −', k: 'alt+f5', a: 'spaceship_power/v_engineering_assignment_weapons_decrease', i: 'wep-down', hold: 'MIN' },
    { l: 'THR −', k: 'alt+f6', a: 'spaceship_power/v_engineering_assignment_engine_decrease', i: 'thr-down', hold: 'MIN' },
    { l: 'SHD −', k: 'alt+f7', a: 'spaceship_power/v_engineering_assignment_shields_decrease', i: 'shd-down', hold: 'MIN' },
    { l: 'WEAPONS', k: 'p', a: 'spaceship_power/v_power_toggle_weapons', i: 'pwr-wep' },
    { l: 'THRUSTERS', k: 'i', a: 'spaceship_power/v_power_toggle_thrusters', i: 'pwr-thr' },
    { l: 'SHIELDS', k: 'o', a: 'spaceship_power/v_power_toggle_shields', i: 'pwr-shd' },
    { l: 'RESET DIST.', k: 'f8', a: 'spaceship_power/v_engineering_assignment_reset', i: 'pwr-reset' },
    { l: 'POWER ALL', k: 'u', a: 'spaceship_power/v_power_toggle', i: 'power', span: 2 },
  ],
};

const SCANNER = {
  title: 'SCANNER', code: 'SCN', cols: 2,
  items: [
    { l: 'SCAN MODE', k: 'v', a: 'seat_general/v_toggle_scan_mode', i: 'scan' },
    { l: 'PING', k: 'tab', a: 'spaceship_radar/v_invoke_ping', i: 'ping', hold: true },
    { l: 'SCAN', k: 'ralt+v', a: 'spaceship_scanning/v_scanning_trigger_scan', bind: true, hold: true, span: 2 },
    { l: 'ANGLE +', k: 'ralt+e', a: 'spaceship_scanning/v_inc_scan_focus_level', bind: true },
    { l: 'ANGLE −', k: 'ralt+q', a: 'spaceship_scanning/v_dec_scan_focus_level', bind: true },
  ],
};

const OPERATOR = {
  title: 'OPERATOR MODE', code: 'OPS', cols: 3,
  items: [
    { l: 'FLIGHT', k: 'rctrl+f1', a: 'seat_general/v_set_flight_mode', i: 'flight', bind: true },
    { l: 'GUNS', k: 'rctrl+f2', a: 'seat_general/v_set_guns_mode', i: 'guns', bind: true },
    { l: 'MISSILES', k: 'rctrl+f3', a: 'seat_general/v_set_missile_mode', i: 'missiles', bind: true },
    { l: 'SCAN', k: 'rctrl+f4', a: 'seat_general/v_set_scan_mode', i: 'scan', bind: true },
    { l: 'QUANTUM', k: 'rctrl+f5', a: 'seat_general/v_set_quantum_mode', i: 'quantum', bind: true },
    { l: 'MINING', k: 'rctrl+f6', a: 'seat_general/v_set_mining_mode', i: 'module', bind: true },
    { l: 'SALVAGE', k: 'rctrl+f7', a: 'seat_general/v_set_salvage_mode', i: 'salvage', bind: true },
    { l: 'NEXT MODE', k: 'rctrl+f8', a: 'seat_general/v_operator_mode_cycle_forward', bind: true, mouse: 'mouse3', span: 2 },
  ],
};

const LANDING = {
  title: 'LANDING', code: 'LND', cols: 2,
  items: [
    { l: 'LANDING GEAR', k: 'n', a: 'spaceship_movement/v_toggle_landing_system', i: 'gear', hold: 'AUTOLAND', span: 2 },
    { l: 'REQUEST LANDING', k: 'alt+n', a: 'spaceship_movement/v_atc_request', i: 'land-req' },
    { l: 'VTOL', k: 'k', a: 'spaceship_movement/v_vtol_toggle', i: 'vtol' },
  ],
};

const CARGO = {
  title: 'CARGO', code: 'CRG', cols: 1,
  items: [{ l: 'JETTISON CARGO', k: 'alt+j', a: 'spaceship_mining/v_jettison_volatile_cargo', guard: true, tone: 'danger' }],
};

const HUD = {
  title: 'HUD / COMMS', code: 'HUD', cols: 3,
  items: [
    { l: 'MOBIGLAS', k: 'f1', a: 'spaceship_hud/mobiglas' },
    { l: 'STARMAP', k: 'f2', a: 'spaceship_hud/v_starmap' },
    { l: 'CAMERA', k: 'f4', a: 'spaceship_view/v_view_cycle_fwd' },
    { l: 'COMMS', k: 'f11', a: 'default/toggle_contact' },
    { l: 'CHAT', k: 'f12', a: 'default/toggle_chat' },
    { l: 'LOOK BEHIND', k: 'comma', a: 'seat_general/v_view_look_behind', hold: true },
    { l: 'MFD PAGE ◀', k: 'alt+q', a: 'vehicle_mfd/v_mfd_interact_cycle_backwards_short' },
    { l: 'MFD PAGE ▶', k: 'alt+e', a: 'vehicle_mfd/v_mfd_interact_cycle_forwards_short' },
    { l: 'FREELOOK', k: 'z', a: 'spaceship_view/v_view_freelook_mode', hold: true },
  ],
};

window.MFD_LAYOUT = [
  {
    id: 'flight', label: 'FLIGHT',
    screens: [
      {
        title: 'SYSTEMS', code: 'SYS', cols: 2,
        items: [
          { l: 'FLIGHT READY', k: 'ralt+r', a: 'spaceship_general/v_flightready', i: 'ready', span: 2 },
          { l: 'LIGHTS', k: 'l', a: 'lights_controller/v_lights', i: 'lights' },
          { l: 'NIGHT VISION', k: 'ralt+l', a: 'seat_general/v_light_amplification_toggle' },
          { l: 'PORT LOCK', k: 'ralt+k', a: 'spaceship_general/v_toggle_all_portlocks', i: 'port-lock' },
          { l: 'EXIT SEAT', k: 'y', a: 'default/pl_exit', i: 'exit', hold: true },
          { l: 'EJECT', k: 'ralt+y', a: 'seat_general/v_eject', guard: true, tone: 'warn' },
          { l: 'EMERGENCY EXIT', k: 'shift+u', a: 'seat_general/v_emergency_exit', guard: true, tone: 'warn' },
          { l: 'SELF DESTRUCT', k: 'backspace', a: 'spaceship_general/v_self_destruct', guard: true, hold: true, tone: 'danger', span: 2 },
        ],
      },
      {
        title: 'FLIGHT MODES', code: 'IFCS', cols: 2,
        items: [
          { l: 'SCM', k: 'rctrl+f9', a: 'spaceship_movement/v_master_mode_set_scm', i: 'flight', bind: true },
          { l: 'NAV', k: 'rctrl+f10', a: 'spaceship_movement/v_master_mode_set_nav', i: 'quantum', bind: true },
          { l: 'MASTER MODE', k: 'b', a: 'spaceship_movement/v_master_mode_cycle_long', hold: 'CYCLE', span: 2 },
          { l: 'COUPLED', k: 'c', a: 'spaceship_movement/v_ifcs_vector_decoupling_toggle', i: 'coupled' },
          { l: 'CRUISE', k: 'alt+c', a: 'spaceship_movement/v_ifcs_throttle_swap_mode', i: 'cruise' },
          { l: 'SPEED LIMITER', k: 'rctrl+f12', a: 'spaceship_movement/v_ifcs_speed_limiter_toggle', i: 'limiter', bind: true },
          { l: 'SPACEBRAKE', k: 'x', a: 'spaceship_movement/v_space_brake', hold: true },
          { l: 'ESP', k: 'ralt+8', a: 'spaceship_movement/v_ifcs_toggle_esp', i: 'gimbal', bind: true },
          { l: 'G-SAFE', k: 'ralt+9', a: 'spaceship_movement/v_ifcs_toggle_gforce_safety', bind: true },
          { l: 'TRANSFORM', k: 'alt+k', a: 'spaceship_movement/v_transform_cycle' },
          { l: 'ACCEL. RESET', k: 'ralt+c', a: 'spaceship_movement/v_ifcs_reset_gmeter_max' },
        ],
      },
      {
        title: 'QUANTUM', code: 'QT', cols: 1,
        items: [
          { l: 'ENGAGE QUANTUM', k: 'rctrl+f11', a: 'spaceship_quantum/v_toggle_qdrive_engagement', i: 'quantum', bind: true, mouse: 'mouse1', hold: 'SPOOL', tone: 'warn' },
        ],
        note: 'note.quantum',
      },
      {
        title: 'LANDING / DOCKING', code: 'LND', cols: 2,
        items: [
          { l: 'LANDING GEAR', k: 'n', a: 'spaceship_movement/v_toggle_landing_system', i: 'gear', hold: 'AUTOLAND', span: 2 },
          { l: 'REQUEST LANDING', k: 'alt+n', a: 'spaceship_movement/v_atc_request', i: 'land-req' },
          { l: 'VTOL', k: 'k', a: 'spaceship_movement/v_vtol_toggle', i: 'vtol' },
          { l: 'DOCKING / CARGO', k: 'ralt+n', a: 'spaceship_docking/v_toggle_docking_request' },
          { l: 'DOCKING CAM', k: '0', a: 'spaceship_docking/v_dock_toggle_view', hold: true },
          { l: 'HAIL TARGET', k: '9', a: 'spaceship_target_hailing/v_target_hail', span: 2 },
        ],
      },
      POWER,
      {
        title: 'DOORS', code: 'DR', cols: 2,
        items: [
          { l: 'OPEN', k: 'rctrl+insert', a: 'spaceship_general/v_open_all_doors', i: 'door-open', bind: true },
          { l: 'CLOSE', k: 'rctrl+delete', a: 'spaceship_general/v_close_all_doors', i: 'door-close', bind: true },
          { l: 'UNLOCK', k: 'rctrl+home', a: 'spaceship_general/v_unlock_all_doors', i: 'door-unlock', bind: true },
          { l: 'LOCK', k: 'rctrl+end', a: 'spaceship_general/v_lock_all_doors', i: 'door-lock', bind: true },
        ],
      },
      SCANNER,
      OPERATOR,
      HUD,
    ],
  },
  {
    id: 'combat', label: 'COMBAT',
    screens: [
      {
        title: 'TARGETING', code: 'TGT', cols: 3,
        items: [
          { l: 'CYCLE IN VIEW', k: 't', a: 'spaceship_targeting_advanced/v_target_cycle_in_view_fwd', hold: 'AUTO TGT', span: 2 },
          { l: 'UNLOCK', k: 'alt+t', a: 'spaceship_targeting/v_target_unlock' },
          { l: 'ATTACKERS', k: '4', a: 'spaceship_targeting_advanced/v_target_cycle_attacker_fwd' },
          { l: 'HOSTILES', k: '5', a: 'spaceship_targeting_advanced/v_target_cycle_hostile_fwd' },
          { l: 'FRIENDLIES', k: '6', a: 'spaceship_targeting_advanced/v_target_cycle_friendly_fwd' },
          { l: 'ALL', k: '7', a: 'spaceship_targeting_advanced/v_target_cycle_all_fwd' },
          { l: 'SUB-TARGET', k: 'r', a: 'spaceship_targeting_advanced/v_target_cycle_subitem_fwd', i: 'sub-next' },
          { l: 'SUB RESET', k: 'alt+r', a: 'spaceship_targeting_advanced/v_target_cycle_subitem_reset', i: 'sub-reset' },
          { l: 'LOOK AHEAD', k: 'alt+l', a: 'spaceship_targeting/v_look_ahead_enable', span: 3 },
        ],
      },
      {
        title: 'PINS', code: 'PIN', cols: 3,
        items: [
          { l: 'LOCK 1', k: '1', a: 'spaceship_targeting/v_target_toggle_lock_index_1' },
          { l: 'LOCK 2', k: '2', a: 'spaceship_targeting/v_target_toggle_lock_index_2' },
          { l: 'LOCK 3', k: '3', a: 'spaceship_targeting/v_target_toggle_lock_index_3' },
          { l: 'PIN 1', k: 'alt+1', a: 'spaceship_targeting/v_target_toggle_pin_index_1' },
          { l: 'PIN 2', k: 'alt+2', a: 'spaceship_targeting/v_target_toggle_pin_index_2' },
          { l: 'PIN 3', k: 'alt+3', a: 'spaceship_targeting/v_target_toggle_pin_index_3' },
          { l: 'CLEAR PINS', k: '0', a: 'spaceship_targeting/v_target_remove_all_pins', span: 3 },
        ],
      },
      {
        title: 'SHIELDS', code: 'SHD', cols: 3,
        items: [
          { l: 'TOP', k: 'ralt+5', a: 'spaceship_defensive/v_shield_raise_level_up', i: 'shd-top', bind: true },
          { l: 'FRONT', k: 'ralt+1', a: 'spaceship_defensive/v_shield_raise_level_forward', i: 'shd-front', bind: true },
          null,
          { l: 'LEFT', k: 'ralt+3', a: 'spaceship_defensive/v_shield_raise_level_left', i: 'shd-left', bind: true },
          { l: 'RESET', k: 'ralt+7', a: 'spaceship_defensive/v_shield_reset_level', i: 'shd-reset', bind: true },
          { l: 'RIGHT', k: 'ralt+4', a: 'spaceship_defensive/v_shield_raise_level_right', i: 'shd-right', bind: true },
          { l: 'BOTTOM', k: 'ralt+6', a: 'spaceship_defensive/v_shield_raise_level_down', i: 'shd-bottom', bind: true },
          { l: 'BACK', k: 'ralt+2', a: 'spaceship_defensive/v_shield_raise_level_back', i: 'shd-back', bind: true },
          null,
        ],
      },
      {
        title: 'COUNTERMEASURES', code: 'CM', cols: 2,
        items: [
          { l: 'DECOY', k: 'h', a: 'spaceship_defensive/v_weapon_countermeasure_decoy_launch', i: 'decoy', hold: 'SET BURST', tone: 'warn' },
          { l: 'NOISE', k: 'j', a: 'spaceship_defensive/v_weapon_countermeasure_noise_launch', i: 'noise', tone: 'warn' },
          { l: 'BURST +', k: 'ralt+h', a: 'spaceship_defensive/v_weapon_countermeasure_decoy_burst_increase', i: 'decoy-up' },
          { l: 'BURST −', k: 'alt+h', a: 'spaceship_defensive/v_weapon_countermeasure_decoy_burst_decrease', i: 'decoy-down' },
          { l: 'PANIC DECOY', k: 'ralt+0', a: 'spaceship_defensive/v_weapon_countermeasure_decoy_launch_panic', i: 'decoy', bind: true, tone: 'danger', span: 2 },
        ],
      },
      {
        title: 'WEAPONS', code: 'WPN', cols: 2,
        items: [
          { l: 'GUNS MODE', k: 'rctrl+f2', a: 'seat_general/v_set_guns_mode', i: 'guns', bind: true },
          { l: 'MISSILE MODE', k: 'rctrl+f3', a: 'seat_general/v_set_missile_mode', i: 'missiles', bind: true },
          { l: 'GIMBAL LOCK', k: 'g', a: 'spaceship_weapons/v_weapon_gimbals_state_toggle', i: 'gimbal' },
          { l: 'AIM MODE', k: 'ralt+g', a: 'spaceship_weapons/v_weapon_aim_type_cycle' },
          { l: 'STAGGERED FIRE', k: 'ralt+f', a: 'spaceship_weapons/v_weapon_staggered_fire_toggle', bind: true, span: 2 },
        ],
        note: 'note.weapons',
      },
      {
        title: 'MISSILES', code: 'MSL', cols: 2,
        items: [
          { l: 'ARM +', k: 'g', a: 'spaceship_missiles/v_weapon_increase_max_missiles', i: 'msl-up' },
          { l: 'ARM −', k: 'ralt+b', a: 'spaceship_missiles/v_weapon_decrease_max_missiles', i: 'msl-down', bind: true },
          { l: 'RESET ARMED', k: 'alt+g', a: 'spaceship_missiles/v_weapon_reset_max_missiles' },
          { l: 'BOMB IMPACT PT.', k: 'alt+b', a: 'spaceship_missiles/v_weapon_bombing_toggle_desired_impact_point', i: 'bomb' },
          { l: 'LAUNCH', k: 'ralt+m', a: 'spaceship_missiles/v_weapon_toggle_launch_missile', i: 'missiles', bind: true, mouse: 'mouse1', tone: 'danger', span: 2 },
        ],
        note: 'note.missiles',
      },
      POWER,
      SCANNER,
    ],
  },
  {
    id: 'mining', label: 'MINING',
    screens: [
      {
        title: 'MINING OPERATOR', code: 'MIN', cols: 2,
        items: [
          { l: 'MINING MODE', k: 'm', a: 'seat_general/v_toggle_mining_mode', i: 'module', span: 2 },
          { l: 'FIRE LASER', k: 'ralt+x', a: 'spaceship_mining/v_toggle_mining_laser_fire', bind: true, mouse: 'mouse1', tone: 'warn', span: 2 },
          { l: 'POWER +', k: 'ralt+u', a: 'spaceship_mining/v_increase_mining_throttle', bind: true, mouse: 'maxis_z' },
          { l: 'POWER −', k: 'ralt+j', a: 'spaceship_mining/v_decrease_mining_throttle', bind: true },
          { l: 'BEAM HIGH/LOW', k: 'alt+4', a: 'spaceship_mining/v_mining_use_permanent_modifier' },
          { l: 'ACTIONS (PIT)', k: 'alt+m', a: 'player_choice/pc_pit_miningmode_actions' },
        ],
        note: 'note.mining',
      },
      {
        title: 'MODULES', code: 'MOD', cols: 3,
        items: [
          { l: 'MODULE 1', k: 'alt+1', a: 'spaceship_mining/v_mining_use_consumable1', i: 'module' },
          { l: 'MODULE 2', k: 'alt+2', a: 'spaceship_mining/v_mining_use_consumable2', i: 'module' },
          { l: 'MODULE 3', k: 'alt+3', a: 'spaceship_mining/v_mining_use_consumable3', i: 'module' },
        ],
      },
      SCANNER,
      CARGO,
      POWER,
      LANDING,
    ],
  },
  {
    id: 'salvage', label: 'SALVAGE',
    screens: [
      {
        title: 'SALVAGE OPERATOR', code: 'SLV', cols: 2,
        items: [
          { l: 'SALVAGE MODE', k: 'm', a: 'seat_general/v_toggle_salvage_mode', i: 'salvage', span: 2 },
          { l: 'GIMBAL', k: 'g', a: 'spaceship_salvage/v_salvage_toggle_gimbal_mode', i: 'gimbal' },
          { l: 'GIMBAL RESET', k: 'alt+g', a: 'spaceship_salvage/v_salvage_reset_gimbal' },
          { l: 'SPACING +', k: 'rctrl+pageup', a: 'spaceship_salvage/v_salvage_increase_beam_spacing', bind: true },
          { l: 'SPACING −', k: 'rctrl+pagedown', a: 'spaceship_salvage/v_salvage_decrease_beam_spacing', bind: true },
        ],
        note: 'note.salvage',
      },
      {
        title: 'FIRE', code: 'FIRE', cols: 2,
        items: [
          { l: 'FOCUSED', k: 'ralt+o', a: 'spaceship_salvage/v_salvage_toggle_fire_focused', bind: true, tone: 'warn', span: 2 },
          { l: 'LEFT HEAD', k: 'ralt+a', a: 'spaceship_salvage/v_salvage_toggle_fire_left' },
          { l: 'RIGHT HEAD', k: 'ralt+d', a: 'spaceship_salvage/v_salvage_toggle_fire_right' },
          { l: 'FRACTURE', k: 'ralt+w', a: 'spaceship_salvage/v_salvage_toggle_fire_fracture', tone: 'warn' },
          { l: 'DISINTEGRATE', k: 'ralt+s', a: 'spaceship_salvage/v_salvage_toggle_fire_disintegrate', tone: 'warn' },
        ],
      },
      {
        title: 'FOCUS', code: 'FOC', cols: 2,
        items: [
          { l: 'ALL HEADS', k: 'alt+s', a: 'spaceship_salvage/v_salvage_focus_all_heads', span: 2 },
          { l: 'LEFT', k: 'alt+a', a: 'spaceship_salvage/v_salvage_focus_left' },
          { l: 'RIGHT', k: 'alt+d', a: 'spaceship_salvage/v_salvage_focus_right' },
          { l: 'FRACTURE', k: 'alt+w', a: 'spaceship_salvage/v_salvage_focus_fracture' },
          { l: 'DISINTEGRATE', k: 'ralt+t', a: 'spaceship_salvage/v_salvage_focus_disintegrate', bind: true },
        ],
      },
      {
        title: 'MODIFIERS', code: 'MDF', cols: 2,
        items: [
          { l: 'CYCLE LEFT', k: 'ralt+i', a: 'spaceship_salvage/v_salvage_cycle_modifiers_left', bind: true },
          { l: 'CYCLE RIGHT', k: 'ralt+p', a: 'spaceship_salvage/v_salvage_cycle_modifiers_right', bind: true },
        ],
      },
      SCANNER,
      CARGO,
      POWER,
      LANDING,
    ],
  },
  {
    id: 'fps', label: 'ON FOOT',
    screens: [
      {
        title: 'LOADOUT', code: 'EQP', cols: 3,
        items: [
          { l: 'PRIMARY', k: '1', a: 'player/select_primary_pit', i: 'guns' },
          { l: 'SECONDARY', k: '2', a: 'player/select_secondary_pit', i: 'guns' },
          { l: 'SIDEARM', k: '3', a: 'player/select_sidearm_pit' },
          { l: 'CONSUMABLES', k: '4', a: 'player_choice/pc_qs_consumables', hold: 'WHEEL' },
          { l: 'GADGET', k: '5', a: 'player/select_gadget_pit' },
          { l: 'FISTS', k: '6', a: 'player/selectUnarmedCombat' },
          { l: 'MELEE', k: 'v', a: 'player/select_meleeweapon_pit' },
          { l: 'THROWABLE', k: 'g', a: 'player_choice/pc_qs_grenades', hold: 'WHEEL' },
          { l: 'CUSTOMIZE', k: 'j', a: 'player/customize' },
        ],
      },
      {
        title: 'WEAPON', code: 'WPN', cols: 2,
        items: [
          { l: 'RELOAD', k: 'r', a: 'player/reload', hold: 'HOLSTER', span: 2 },
          { l: 'FIRE MODE', k: 'b', a: 'player/weapon_change_firemode' },
          { l: 'STANCE', k: 'alt+r', a: 'player/toggle_lowered' },
          { l: 'ZEROING +', k: 'pageup', a: 'player/weapon_zeroing_increase' },
          { l: 'ZEROING −', k: 'pagedown', a: 'player/weapon_zeroing_decrease' },
          { l: 'UNDERBARREL', k: 'u', a: 'player/weapon_auxiliary_action' },
          { l: 'INSPECT', k: 'rctrl+apostrophe', a: 'player/inspect', bind: true },
          { l: 'DROP', k: 'rctrl+semicolon', a: 'player/drop', bind: true, span: 2 },
        ],
      },
      {
        title: 'ACTIONS', code: 'ACT', cols: 3,
        items: [
          { l: 'INTERACT', k: 'f', a: 'player_choice/pc_interaction_mode', hold: true },
          { l: 'INNER THOUGHT', k: 'alt+f', a: 'player_choice/pc_personal_thought' },
          { l: 'INVENTORY', k: 'i', a: 'player_choice/pc_pit_inventory', hold: 'LOOT' },
          { l: 'FLASHLIGHT', k: 't', a: 'player/toggle_flashlight', i: 'lights' },
          { l: 'WALK', k: 'rctrl+slash', a: 'player/walk', bind: true },
          { l: 'CROUCH', k: 'c', a: 'player/crouch', hold: true },
          { l: 'PRONE', k: 'ctrl', a: 'player/prone' },
          { l: 'HELMET', k: 'alt+h', a: 'player/toggleAttachHelmet' },
          { l: 'HELMET EQUIP', k: 'ralt+h', a: 'player/toggleEquipHelmet' },
          { l: 'WIPE VISOR', k: 'alt+x', a: 'player/visor_wipe' },
          { l: '3RD PERSON', k: 'f4', a: 'player/thirdperson' },
          { l: 'FREE VIEW', k: 'z', a: 'player/free_thirdperson_camera', hold: true },
        ],
      },
      {
        title: 'EMERGENCY', code: 'EMG', cols: 2,
        items: [
          { l: 'RESCUE BEACON', k: 'm', a: 'player/downedRevivalRequest', hold: true, tone: 'warn' },
          { l: 'RESPAWN', k: 'backspace', a: 'player/force_respawn', guard: true, hold: true, tone: 'danger' },
        ],
      },
      {
        title: 'HUD', code: 'HUD', cols: 2,
        items: [
          { l: 'MOBIGLAS', k: 'f1', a: 'player/mobiglas' },
          { l: 'MAP', k: 'f2', a: 'player/v_starmap' },
          { l: 'COMMS', k: 'f11', a: 'default/toggle_contact' },
          { l: 'CHAT', k: 'f12', a: 'default/toggle_chat' },
          { l: 'ACCEPT', k: 'lbracket', a: 'default/notification_accept' },
          { l: 'DECLINE', k: 'rbracket', a: 'default/notification_decline' },
        ],
      },
    ],
  },
  {
    id: 'social', label: 'SOCIAL',
    screens: [
      {
        title: 'COMBAT EMOTES', code: 'CS', cols: 3,
        items: [
          { l: 'LEFT', k: 'numpad1', a: 'player_emotes/emote_cs_left' },
          { l: 'STOP', k: 'numpad2', a: 'player_emotes/emote_cs_stop' },
          { l: 'RIGHT', k: 'numpad3', a: 'player_emotes/emote_cs_right' },
          { l: 'YES', k: 'numpad4', a: 'player_emotes/emote_cs_yes' },
          { l: 'FORWARD', k: 'numpad5', a: 'player_emotes/emote_cs_forward' },
          { l: 'NO', k: 'numpad6', a: 'player_emotes/emote_cs_no' },
        ],
      },
      {
        title: 'VOICE', code: 'VOIP', cols: 2,
        items: [
          { l: 'PUSH TO TALK', k: 'numpadplus', a: 'player_input_optical_tracking/foip_pushtotalk', hold: true, span: 2 },
          { l: 'PROXIMITY PTT', k: 'alt+numpadplus', a: 'player_input_optical_tracking/foip_pushtotalk_proximity', hold: true },
          { l: 'HEAD TRACKING', k: 'numpaddiv', a: 'player_input_optical_tracking/headtrack_enabled' },
          { l: 'COMMS', k: 'f11', a: 'default/toggle_contact' },
          { l: 'CHAT', k: 'f12', a: 'default/toggle_chat' },
        ],
      },
      {
        title: 'EMOTES', code: 'EMT', cols: 4,
        items: [
          { l: 'WAVE', k: 'rctrl+c', a: 'player_emotes/emote_wave', bind: true },
          { l: 'SALUTE', k: 'rctrl+d', a: 'player_emotes/emote_salute', bind: true },
          { l: 'GREET', k: 'rctrl+e', a: 'player_emotes/emote_greet', bind: true },
          { l: 'BOW', k: 'rctrl+f', a: 'player_emotes/emote_bow', bind: true },
          { l: 'AGREE', k: 'rctrl+g', a: 'player_emotes/emote_agree', bind: true },
          { l: 'DISAGREE', k: 'rctrl+h', a: 'player_emotes/emote_disagree', bind: true },
          { l: 'POINT', k: 'rctrl+i', a: 'player_emotes/emote_point', bind: true },
          { l: 'COME', k: 'rctrl+j', a: 'player_emotes/emote_come', bind: true },
          { l: 'WAIT', k: 'rctrl+k', a: 'player_emotes/emote_wait', bind: true },
          { l: 'CHEER', k: 'rctrl+l', a: 'player_emotes/emote_cheer', bind: true },
          { l: 'CLAP', k: 'rctrl+m', a: 'player_emotes/emote_clap', bind: true },
          { l: 'LAUGH', k: 'rctrl+n', a: 'player_emotes/emote_laugh', bind: true },
          { l: 'DANCE', k: 'rctrl+q', a: 'player_emotes/emote_dance', bind: true },
          { l: 'FLEX', k: 'rctrl+r', a: 'player_emotes/emote_flex', bind: true },
          { l: 'SIT', k: 'rctrl+s', a: 'player_emotes/emote_sit', bind: true },
          { l: 'SLEEP', k: 'rctrl+u', a: 'player_emotes/emote_sleep', bind: true },
          { l: 'AT EASE', k: 'rctrl+v', a: 'player_emotes/emote_atease', bind: true },
          { l: 'ATTENTION', k: 'rctrl+w', a: 'player_emotes/emote_attention', bind: true },
          { l: 'CONFIRM LAUNCH', k: 'rctrl+z', a: 'player_emotes/emote_launch', bind: true },
          { l: 'WHISTLE', k: 'rctrl+1', a: 'player_emotes/emote_whistle', bind: true },
        ],
      },
      {
        title: 'EMOTES 2', code: 'EMT2', cols: 4,
        items: [
          { l: 'TAUNT', k: 'rctrl+2', a: 'player_emotes/emote_taunt', bind: true },
          { l: 'GLOAT', k: 'rctrl+3', a: 'player_emotes/emote_gloat', bind: true },
          { l: 'THREATEN', k: 'rctrl+4', a: 'player_emotes/emote_threaten', bind: true },
          { l: 'RUDE', k: 'rctrl+5', a: 'player_emotes/emote_rude', bind: true },
          { l: 'ANGRY', k: 'rctrl+6', a: 'player_emotes/emote_angry', bind: true },
          { l: 'CRY', k: 'rctrl+7', a: 'player_emotes/emote_cry', bind: true },
          { l: 'FAILURE', k: 'rctrl+8', a: 'player_emotes/emote_failure', bind: true },
          { l: 'BORED', k: 'rctrl+9', a: 'player_emotes/emote_bored', bind: true },
          { l: 'BLAH', k: 'rctrl+0', a: 'player_emotes/emote_blah', bind: true },
          { l: 'GASP', k: 'rctrl+comma', a: 'player_emotes/emote_gasp', bind: true },
          { l: 'FLIRT', k: 'rctrl+period', a: 'player_emotes/emote_flirt', bind: true },
          { l: 'CHICKEN', k: 'rctrl+lbracket', a: 'player_emotes/emote_chicken', bind: true },
          { l: 'BURP', k: 'rctrl+rbracket', a: 'player_emotes/emote_burp', bind: true },
          { l: 'SMELL', k: 'rctrl+backslash', a: 'player_emotes/emote_smell', bind: true },
        ],
      },
    ],
  },
  {
    id: 'vehicle', label: 'VEHICLE',
    screens: [
      {
        title: 'SYSTEMS', code: 'SYS', cols: 2,
        items: [
          { l: 'SYSTEMS READY', k: 'ralt+r', a: 'vehicle_general/v_flightready', i: 'ready', span: 2 },
          { l: 'LIGHTS', k: 'l', a: 'lights_controller/v_lights', i: 'lights' },
          { l: 'EXIT', k: 'y', a: 'default/pl_exit', i: 'exit', hold: true },
          { l: 'DOORS OPEN', k: 'rctrl+insert', a: 'vehicle_general/v_open_all_doors', i: 'door-open', bind: true },
          { l: 'DOORS CLOSE', k: 'rctrl+delete', a: 'vehicle_general/v_close_all_doors', i: 'door-close', bind: true },
        ],
      },
      {
        title: 'DRIVING', code: 'DRV', cols: 2,
        items: [
          { l: 'HORN', k: 'space', a: 'vehicle_general/v_horn', hold: true },
          { l: 'BRAKE', k: 'x', a: 'vehicle_driver/v_brake', hold: true },
          { l: 'AUTO-BRAKE', k: 'c', a: 'vehicle_driver/v_mgv_switch_brake_on_idle', span: 2 },
        ],
      },
      {
        title: 'WEAPONS', code: 'WPN', cols: 2,
        items: [
          { l: 'GIMBAL LOCK', k: 'g', a: 'spaceship_weapons/v_weapon_gimbals_state_toggle', i: 'gimbal' },
          { l: 'AIM MODE', k: 'ralt+g', a: 'spaceship_weapons/v_weapon_aim_type_cycle' },
          { l: 'SCAN MODE', k: 'v', a: 'seat_general/v_toggle_scan_mode', i: 'scan' },
          { l: 'CAMERA', k: 'f4', a: 'vehicle_general/v_view_cycle_fwd' },
        ],
      },
    ],
  },
];

/* Engine: what the game expects to find in the student files.
   Used by validate.js (to give friendly errors) and panel.js (slider ranges). */

const TUNING_SPEC = {
  GRAVITY:           { def: 1800, min: 300, max: 4000, step: 10 },
  MAX_FALL_SPEED:    { def: 900,  min: 200, max: 2000, step: 10 },
  MOVE_SPEED:        { def: 220,  min: 60,  max: 600,  step: 5 },
  GROUND_ACCEL:      { def: 2400, min: 200, max: 8000, step: 50 },
  GROUND_FRICTION:   { def: 2600, min: 100, max: 8000, step: 50 },
  AIR_ACCEL:         { def: 1500, min: 0,   max: 5000, step: 50 },
  AIR_FRICTION:      { def: 500,  min: 0,   max: 5000, step: 50 },
  JUMP_VELOCITY:     { def: 620,  min: 200, max: 1400, step: 10 },
  COYOTE_TIME:       { def: 0.10, min: 0,   max: 0.4,  step: 0.01 },
  JUMP_BUFFER:       { def: 0.12, min: 0,   max: 0.4,  step: 0.01 },
  JUMP_RELEASE_CUT:  { def: 0.45, min: 0.1, max: 1,    step: 0.05 },
  APEX_GRAVITY_MULT: { def: 0.6,  min: 0.2, max: 1.5,  step: 0.05 },
  APEX_THRESHOLD:    { def: 90,   min: 0,   max: 300,  step: 5 },
  MAX_AIR_JUMPS:     { def: 0,    min: 0,   max: 5,    step: 1 },
  STOMP_BOUNCE:      { def: 480,  min: 0,   max: 1200, step: 10 },
  LIVES:             { def: 3,    min: 1,   max: 20,   step: 1, noPanel: true },
};

const MOVEMENTS = ["patrol", "hop", "hover", "chase"];
const SHAPES = ["circle", "diamond", "square"];
const LEGEND_KINDS = ["tile", "enemy", "pickup", "player", "goal"];
const TILE_NAMES = ["air", "solid", "ledge", "spikes"];

const ENEMY_FIELDS = {
  movement: "text", speed: "number", width: "number", height: "number",
  color: "color", stompable: "boolean", points: "number",
  turnsAtLedges: "boolean", hopPower: "number", hopEvery: "number",
  loopWidth: "number", loopHeight: "number", sightRange: "number",
};
const ENEMY_REQUIRED = ["movement", "speed", "width", "height", "color", "stompable", "points"];

const PICKUP_FIELDS = {
  color: "color", size: "number", shape: "text", points: "number",
  treasure: "boolean", power: "object",
};
const PICKUP_REQUIRED = ["color", "size", "shape", "points", "treasure"];
const POWER_FIELDS = ["speed", "jump", "life", "seconds"];

const THEME_KEYS = [
  "skyTop", "skyBottom", "hillsFar", "hillsNear", "solid", "solidTop",
  "ledge", "spikes", "player", "playerEyes", "goal", "text",
];

const TILE = 24;

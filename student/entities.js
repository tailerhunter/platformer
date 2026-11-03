/* ============================================================================
   entities.js  —  ENEMIES, PICKUPS, AND WHAT EACH MAP LETTER MEANS
   ============================================================================

   This file is a list of descriptions. The engine reads each description and
   makes the thing behave that way. You add new things by COPYING an existing
   description and changing it. You never write the behavior yourself.

   That is how a lot of real software is built: one part of the program does
   the work, another part just describes what to do. Change the description,
   change the program.
   ========================================================================= */


/* ===== HOLE 5 of 7 — Add a new kind of enemy ==============================
   Three kinds of enemy come with the game. Add a fourth.

     Step 1. Copy one whole block below, from its name to its closing  },
             and paste it right after the last one.
     Step 2. Give it a new name (one word, no spaces), e.g.  sentry
     Step 3. Change the settings. The menu of options is just below.
     Step 4. Give it a letter in LEGEND at the bottom of this file.
     Step 5. Put that letter in your level in levels.js.

   SETTINGS MENU
     movement   how it moves. Exactly one of:
                  "patrol"  walks back and forth on the ground
                  "hop"     walks, and jumps every so often
                  "hover"   floats in a loop and ignores walls and gravity
                  "chase"   walks toward you when you get close
     speed      how fast, in px/s.                     try 20 to 200
     width,     size in px. One block is 24.           try 12 to 48
     height
     color      any CSS color: "#ff8800", "tomato", "rgb(40, 200, 120)"
     stompable  true  = you can jump on its head to defeat it
                false = touching it from any side hurts you
     points     score for defeating it.
     turnsAtLedges  (patrol, hop, chase) true = turns around instead of
                    walking off a cliff
     hopPower       (hop only) how high it jumps.       try 200 to 700
     hopEvery       (hop only) seconds between jumps.   try 0.5 to 3
     loopWidth,     (hover only) how far it drifts side to side and up and
     loopHeight     down, in px.                        try 0 to 150
     sightRange     (chase only) how close you must be before it notices
                    you, in px.                         try 60 to 400
   Assignment: Part 2, Hole 5.                                             */

const ENEMY_TYPES = {

  walker: {
    movement: "patrol",
    speed: 60,
    width: 20,
    height: 20,
    color: "#e0605a",
    stompable: true,
    points: 100,
    turnsAtLedges: true,
  },

  flyer: {
    movement: "hover",
    speed: 70,
    width: 22,
    height: 16,
    color: "#b07cff",
    stompable: true,
    points: 150,
    loopWidth: 60,
    loopHeight: 18,
  },

  hopper: {
    movement: "hop",
    speed: 40,
    width: 18,
    height: 18,
    color: "#ff9f43",
    stompable: true,
    points: 200,
    turnsAtLedges: true,
    hopPower: 460,
    hopEvery: 1.4,
  },

  // <-- paste your new enemy here

};


/* ===== HOLE 6 of 7 — Add a new pickup =====================================
   Same idea as Hole 5: copy a block, rename it, change it, give it a letter.

   SETTINGS MENU
     color      any CSS color.
     size       size in px.                             try 6 to 20
     shape      "circle", "diamond", or "square"
     points     score for collecting it. Can be 0.
     treasure   true  = counts toward the TREASURE number at the top of the
                        screen. Collect all treasure in a level for a bonus.
                false = does not count.
     power      OPTIONAL. Delete this line if your pickup has no power.
                It is a small list of what it does and for how long:
                  speed:    multiply running speed by this.  e.g. 1.6
                  jump:     multiply jump strength by this.  e.g. 1.3
                  life:     add this many lives.             e.g. 1
                  seconds:  how long speed and jump last.    e.g. 6
                Example: power: { jump: 1.4, seconds: 5 },
   Assignment: Part 2, Hole 6.                                             */

const PICKUP_TYPES = {

  coin: {
    color: "#ffd34d",
    size: 10,
    shape: "circle",
    points: 10,
    treasure: true,
  },

  gem: {
    color: "#6fe3ff",
    size: 13,
    shape: "diamond",
    points: 50,
    treasure: true,
  },

  boots: {
    color: "#9cff6b",
    size: 14,
    shape: "square",
    points: 0,
    treasure: false,
    power: { speed: 1.6, seconds: 6 },
  },

  feather: {
    color: "#f4f4f4",
    size: 12,
    shape: "diamond",
    points: 0,
    treasure: false,
    power: { jump: 1.35, seconds: 8 },
  },

  // <-- paste your new pickup here

};


/* ===== LEGEND — what each letter in a map means ===========================
   Each line is:   "letter": { kind, name },
   kind is one of  "tile", "enemy", "pickup", "player", "goal".
   For enemies and pickups, name must match a name in the lists above.

   Pick a letter (or symbol) that is not already used. Letters are
   case-sensitive, so "e" and "E" are different. Do not use spaces.        */

const LEGEND = {
  ".": { kind: "tile",   name: "air" },
  "#": { kind: "tile",   name: "solid" },
  "=": { kind: "tile",   name: "ledge" },
  "^": { kind: "tile",   name: "spikes" },
  "P": { kind: "player" },
  "G": { kind: "goal" },

  "o": { kind: "pickup", name: "coin" },
  "*": { kind: "pickup", name: "gem" },
  "b": { kind: "pickup", name: "boots" },
  "f": { kind: "pickup", name: "feather" },

  "E": { kind: "enemy",  name: "walker" },
  "F": { kind: "enemy",  name: "flyer" },
  "H": { kind: "enemy",  name: "hopper" },

  // <-- add your new letters here
};


/* ============================================================================
   entities.js  —  ENEMIES, PICKUPS, AND WHAT EACH MAP LETTER MEANS
   ============================================================================

   This file contains descriptions of the enemies and pickups in the game.
   The game uses these descriptions to determine how each object behaves.
   You can create new enemies and pickups by copying an existing block
   and changing its settings.

   The program handles the behavior, while this file describes what each
   object should do. Changing these settings changes the game.
   ========================================================================= */


/* ===== HOLE 5 of 7 — Add a new kind of enemy ==============================
   Add a fourth enemy by copying an existing enemy and changing its settings.

   SETTINGS MENU
     movement   How the enemy moves:
                  "patrol"  walks back and forth
                  "hop"     walks and jumps every so often
                  "hover"   floats around without gravity or walls
                  "chase"   follows the player when they get close
     speed      Movement speed in px/s.
     width      Enemy width in pixels.
     height     Enemy height in pixels.
     color      Enemy color.
     stompable  true = can be defeated by jumping on its head
                false = touching it causes damage
     points     Points earned for defeating it.
     turnsAtLedges  Turns around at platform edges.
     sightRange     Distance needed to notice the player.

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

  sentry: {
    movement: "chase",
    speed: 50,
    width: 22,
    height: 26,
    color: "#32c7a5",
    stompable: false,
    points: 0,
    turnsAtLedges: true,
    sightRange: 160,
  },

};


/* ===== HOLE 6 of 7 — Add a new pickup =====================================
   Add a new pickup by copying an existing one and changing its settings.

   SETTINGS MENU
     color      Pickup color.
     size       Pickup size in pixels.
     shape      "circle", "diamond", or "square"
     points     Points earned from collecting it.
     treasure   true = counts toward the treasure total
                false = does not count as treasure
     power      Special ability the pickup gives the player:
                  speed:    increases running speed
                  jump:     increases jumping strength
                  life:     adds extra lives
                  seconds:  how long speed and jump effects last

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

  heart: {
    color: "#ff3366",
    size: 14,
    shape: "circle",
    points: 0,
    treasure: false,
    power: { life: 1 },
  },

};


/* ===== LEGEND — what each letter in a map means ===========================
   Each letter represents a different object in the game.
   Choose a letter that is not already being used.

   Assignment: Add the letters for your new enemy and pickup.              */

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
  "h": { kind: "pickup", name: "heart" },

  "E": { kind: "enemy",  name: "walker" },
  "F": { kind: "enemy",  name: "flyer" },
  "H": { kind: "enemy",  name: "hopper" },
  "S": { kind: "enemy",  name: "sentry" },

};

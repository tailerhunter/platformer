/* ============================================================================
   tuning.js  —  HOW THE GAME FEELS
   ============================================================================

   Every number in this file changes how the player moves. Nothing else.

   You do NOT have to edit this file blind. In the game, press  T  to open the
   tuning panel. Drag the sliders, play, and when you like the feel, press
   "Copy values" and paste the result over the TUNING block below.

   Units, in case you are curious:
     px     = pixels. One block in a level is 24 px wide.
     px/s   = pixels per second (a speed).
     px/s²  = pixels per second, per second (how fast a speed changes).
     s      = seconds. 0.1 s is about six frames of the game.

   If you break something, the game will tell you which line. To start over,
   copy the original values from the "DEFAULTS" comment at the bottom.
   ========================================================================= */

const TUNING = {

  /* ===== HOLE 1 of 7 — The feel you can see =============================
     Change at least three of these. Play after each change.
     Assignment: Part 2, Hole 1.                                           */

  // How fast you fall. Bigger = heavier.          try 900 (moon) to 3500 (rock)
  GRAVITY: 1800,


  
  // The fastest you can fall.                      try 400 to 1500
  MAX_FALL_SPEED: 900,

  // Top running speed.                             try 120 to 400
  MOVE_SPEED: 220,

  // How quickly you reach top speed on the ground. try 600 (sluggish) to 5000 (snappy)
  GROUND_ACCEL: 2400,

  // How quickly you stop when you let go.          try 300 (ice) to 5000 (glue)
  GROUND_FRICTION: 2600,

  // How much you can steer while in the air.       try 200 (committed) to 3000 (floaty control)
  AIR_ACCEL: 1500,

  // How quickly you slow down in the air with no keys pressed.
  AIR_FRICTION: 500,

  // How hard you push off the ground when you jump. try 400 to 900
  JUMP_VELOCITY: 620,


  /* ===== HOLE 2 of 7 — The feel you can't see ===========================
     These are the two numbers professional platformers sweat over and
     players never notice — unless they are wrong.
     Set each one to 0, play for a minute, then put it back.
     Assignment: Part 2, Hole 2.                                           */

  // COYOTE TIME: you can still jump for this long after walking off a ledge.
  // Named after the cartoon coyote who runs off a cliff and hangs there.
  // At 0, jumps at the very edge of a platform will feel like they "didn't
  // take".                                         try 0 to 0.25
  COYOTE_TIME: 0.10,

  // JUMP BUFFER: if you press jump slightly BEFORE you land, the jump still
  // happens when you touch down.
  // At 0, quick repeated jumps will sometimes be "eaten".   try 0 to 0.25
  JUMP_BUFFER: 0.12,

  // Let go of jump early to cut the jump short. This is how players make
  // small hops and big jumps with one button.
  // 1 = letting go does nothing. 0.3 = letting go stops you hard.
  JUMP_RELEASE_CUT: 0.45,

  // Near the top of a jump, gravity is multiplied by this. Below 1 gives a
  // little "hang" at the peak, which makes landing on things easier.
  //                                                try 0.4 to 1
  APEX_GRAVITY_MULT: 0.6,

  // How slow (px/s) counts as "near the top of a jump".
  APEX_THRESHOLD: 90,


  /* ===== HOLE 3 of 7 — A feature in one number ==========================
     Extra jumps you get while already in the air.
     0 = normal. 1 = double jump. 2 = triple jump.
     This is a whole feature, and it is one number. Change it and try it.
     Then ask yourself: did it make your level too easy?
     Assignment: Part 2, Hole 3.                                           */

  MAX_AIR_JUMPS: 0,


  // ----- Other -------------------------------------------------------------

  // How high you bounce after landing on an enemy.
  STOMP_BOUNCE: 480,

  // How many lives you start with.
  LIVES: 3,
};

/* DEFAULTS — copy these back if you want to start over:
   GRAVITY 1800, MAX_FALL_SPEED 900, MOVE_SPEED 220, GROUND_ACCEL 2400,
   GROUND_FRICTION 2600, AIR_ACCEL 1500, AIR_FRICTION 500, JUMP_VELOCITY 620,
   COYOTE_TIME 0.10, JUMP_BUFFER 0.12, JUMP_RELEASE_CUT 0.45,
   APEX_GRAVITY_MULT 0.6, APEX_THRESHOLD 90, MAX_AIR_JUMPS 0,
   STOMP_BOUNCE 480, LIVES 3
*/

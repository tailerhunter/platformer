/* Engine: the player, enemies, pickups, and the goal, and the rules for how
   they move and what happens when they touch. All the numbers come from
   student/tuning.js and student/entities.js. */

const Actors = (() => {
  const PW = 18, PH = 22;

  function approach(v, target, delta) {
    return v < target ? Math.min(v + delta, target) : Math.max(v - delta, target);
  }

  function makePlayer(spawn) {
    return {
      x: spawn.c * TILE + (TILE - PW) / 2, y: (spawn.r + 1) * TILE - PH, w: PW, h: PH,
      vx: 0, vy: 0, prevY: 0, onGround: false,
      coyote: 0, buffer: 0, airJumps: 0, cuttable: false,
      facing: 1, buffs: {}, squash: 0,
    };
  }

  function makeEnemy(spawn) {
    const type = ENEMY_TYPES[spawn.name];
    const w = type.width, h = type.height;
    const x = spawn.c * TILE + (TILE - w) / 2;
    const y = (spawn.r + 1) * TILE - h;
    return {
      type, name: spawn.name, x, y, w, h, vx: 0, vy: 0, dir: -1,
      homeX: x, homeY: y, phase: Math.random() * Math.PI * 2,
      hopTimer: (type.hopEvery || 1.5) * Math.random(),
      onGround: false, dead: false, alert: false,
    };
  }

  function makePickup(spawn) {
    const type = PICKUP_TYPES[spawn.name];
    const s = type.size;
    return {
      type, name: spawn.name, w: s, h: s,
      x: spawn.c * TILE + (TILE - s) / 2, y: spawn.r * TILE + (TILE - s) / 2,
      taken: false, bob: Math.random() * Math.PI * 2,
    };
  }

  function makeGoal(spawn) {
    return { x: spawn.c * TILE + 4, y: (spawn.r - 1) * TILE, w: TILE - 8, h: TILE * 2 };
  }

  function jump(p, strength, sound, fx) {
    p.vy = -strength;
    p.coyote = 0;
    p.buffer = 0;
    p.onGround = false;
    p.cuttable = true;
    p.squash = 0.25;
    SFX.play(sound);
    fx.dust(p.x + p.w / 2, p.y + p.h, 4);
  }

  // Returns "hurt", "fell", or null.
  function updatePlayer(p, world, dt, fx) {
    const T = TUNING;
    p.prevY = p.y;

    for (const k of Object.keys(p.buffs)) {
      p.buffs[k].left -= dt;
      if (p.buffs[k].left <= 0) delete p.buffs[k];
    }
    const speedMul = p.buffs.speed ? p.buffs.speed.mul : 1;
    const jumpMul = p.buffs.jump ? p.buffs.jump.mul : 1;

    // Running
    const dir = (Input.right ? 1 : 0) - (Input.left ? 1 : 0);
    if (dir) p.facing = dir;
    if (dir !== 0) {
      const accel = (p.onGround ? T.GROUND_ACCEL : T.AIR_ACCEL) * speedMul;
      p.vx = approach(p.vx, dir * T.MOVE_SPEED * speedMul, accel * dt);
    } else {
      p.vx = approach(p.vx, 0, (p.onGround ? T.GROUND_FRICTION : T.AIR_FRICTION) * dt);
    }

    // Jumping: coyote time, jump buffer, air jumps
    if (p.onGround) {
      p.coyote = T.COYOTE_TIME;
      p.airJumps = T.MAX_AIR_JUMPS;
    } else {
      p.coyote -= dt;
    }
    const pressed = Input.takeJumpPress();
    if (pressed) p.buffer = T.JUMP_BUFFER;
    if (pressed || p.buffer > 0) {
      if (p.onGround || p.coyote > 0) {
        jump(p, T.JUMP_VELOCITY * jumpMul, "jump", fx);
      } else if (pressed && p.airJumps > 0) {
        p.airJumps--;
        jump(p, T.JUMP_VELOCITY * jumpMul, "airjump", fx);
      }
    }
    p.buffer -= dt;

    // Let go of jump early for a shorter hop.
    if (p.cuttable && !Input.jumpHeld && p.vy < 0) {
      p.vy = Math.max(p.vy, -T.JUMP_VELOCITY * jumpMul * T.JUMP_RELEASE_CUT);
      p.cuttable = false;
    }
    if (p.vy >= 0) p.cuttable = false;

    // Falling, with a little hang time at the top of a held jump.
    let g = T.GRAVITY;
    if (!p.onGround && Math.abs(p.vy) < T.APEX_THRESHOLD && Input.jumpHeld) g *= T.APEX_GRAVITY_MULT;
    p.vy = Math.min(p.vy + g * dt, T.MAX_FALL_SPEED);

    const wasOnGround = p.onGround;
    const landingSpeed = p.vy;
    World.move(p, world, dt);

    if (p.onGround && !wasOnGround) {
      p.squash = -Math.min(0.35, landingSpeed / 2200);
      if (landingSpeed > 350) fx.dust(p.x + p.w / 2, p.y + p.h, 6);
    }
    p.squash *= Math.pow(0.0004, dt);

    // Landing on spikes hurts.
    if (!wasOnGround && World.touching(p, world, "spikes", World.spikeRect)) return "hurt";
    if (p.y > world.pxH + 80) return "fell";
    return null;
  }

  function updateEnemy(e, world, player, dt) {
    const t = e.type;
    if (e.dead) return;

    if (t.movement === "hover") {
      const lw = t.loopWidth || 0;
      e.phase += dt * (t.speed / Math.max(20, lw));
      e.x = e.homeX + Math.sin(e.phase) * lw;
      e.y = e.homeY - TILE / 2 + Math.sin(e.phase * 2) * (t.loopHeight || 0);
      e.dir = Math.cos(e.phase) >= 0 ? 1 : -1;
      return;
    }

    let speed = t.speed;
    if (t.movement === "chase") {
      const dx = (player.x + player.w / 2) - (e.x + e.w / 2);
      const dy = Math.abs((player.y + player.h / 2) - (e.y + e.h / 2));
      e.alert = Math.abs(dx) < (t.sightRange || 200) && dy < TILE * 4;
      if (e.alert) { e.dir = dx < 0 ? -1 : 1; speed *= 1.6; }
    }
    if (t.movement === "hop") {
      e.hopTimer -= dt;
      if (e.onGround && e.hopTimer <= 0) {
        e.vy = -(t.hopPower || 400);
        e.hopTimer = t.hopEvery || 1.5;
      }
      if (e.onGround) speed *= 0.4;
    }

    e.vx = speed * e.dir;
    e.vy = Math.min(e.vy + TUNING.GRAVITY * dt, TUNING.MAX_FALL_SPEED);
    World.move(e, world, dt);

    if (e.hitWall) {
      e.dir *= -1;
    } else if (t.turnsAtLedges && e.onGround && !(t.movement === "chase" && e.alert)) {
      const aheadX = e.dir > 0 ? e.x + e.w + 1 : e.x - 1;
      const k = world.kind(Math.floor(aheadX / TILE), Math.floor((e.y + e.h + 1) / TILE));
      if (k !== "solid" && k !== "ledge") e.dir *= -1;
    }
    if (e.y > world.pxH + 200) e.dead = true;
  }

  // Returns { stomp: enemy } or { hurt: enemy } or null.
  function playerVsEnemies(p, enemies) {
    for (const e of enemies) {
      if (e.dead || !World.overlaps(p, e)) continue;
      const cameFromAbove = p.vy >= 0 && p.prevY + p.h <= e.y + e.h * 0.6;
      if (e.type.stompable && cameFromAbove) {
        e.dead = true;
        p.vy = -TUNING.STOMP_BOUNCE;
        p.cuttable = false;
        return { stomp: e };
      }
      return { hurt: e };
    }
    return null;
  }

  function playerVsPickups(p, pickups) {
    const got = [];
    for (const k of pickups) {
      if (!k.taken && World.overlaps(p, k)) { k.taken = true; got.push(k); }
    }
    return got;
  }

  function playerAtGoal(p, goals) {
    return goals.some((g) => World.overlaps(p, g));
  }

  return {
    makePlayer, makeEnemy, makePickup, makeGoal,
    updatePlayer, updateEnemy, playerVsEnemies, playerVsPickups, playerAtGoal,
  };
})();

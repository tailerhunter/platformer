/* Engine: the game loop. Loads levels, runs everything 60 times a second,
   keeps score, and decides when you win or lose. */

const Game = (() => {
  const canvas = document.getElementById("screen");
  const ctx = canvas.getContext("2d");
  const DT = 1 / 60;
  let running = false;

  const S = {
    levelIndex: 0, world: null, player: null, enemies: [], pickups: [], goals: [],
    particles: [], score: 0, scoreAtLevelStart: 0, lives: 3, deaths: 0,
    treasureGot: 0, treasureTotal: 0, time: 0, levelTime: 0,
    mode: "play", dyingFor: 0, cam: { x: 0, y: 0 }, waiting: true, paused: false,
    showHitboxes: false, toast: "", toastAt: -10,
  };

  const fx = {
    burst(x, y, color, n, speed) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = speed * (0.4 + Math.random() * 0.6);
        S.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - speed * 0.3,
          life: 0.5 + Math.random() * 0.3, max: 0.8, color, size: 2 + Math.random() * 3, g: 600 });
      }
    },
    dust(x, y, n) {
      for (let i = 0; i < n; i++) {
        S.particles.push({ x: x + (Math.random() - 0.5) * 14, y, vx: (Math.random() - 0.5) * 90,
          vy: -Math.random() * 50, life: 0.35, max: 0.35, color: "rgba(255,255,255,0.7)", size: 3, g: 0 });
      }
    },
  };

  function say(text) { S.toast = text; S.toastAt = S.time; }

  function startIndex() {
    const q = new URLSearchParams(location.search).get("level");
    let n = q ? parseInt(q, 10) : START_LEVEL;
    if (!(n >= 1 && n <= LEVELS.length)) n = 1;
    return n - 1;
  }

  function loadLevel(i) {
    S.levelIndex = i;
    S.world = World.build(LEVELS[i]);
    const t = S.world.things;
    S.player = Actors.makePlayer(t.player);
    S.enemies = t.enemies.map(Actors.makeEnemy);
    S.pickups = t.pickups.map(Actors.makePickup);
    S.goals = t.goals.map(Actors.makeGoal);
    S.treasureTotal = S.pickups.filter((k) => k.type.treasure).length;
    S.treasureGot = 0;
    S.particles = [];
    S.levelTime = 0;
    S.scoreAtLevelStart = S.score;
    S.mode = "play";
    S.waiting = true;
    Input.clearPresses();
    snapCamera();
  }

  function restartLevel() {
    S.score = S.scoreAtLevelStart;
    loadLevel(S.levelIndex);
  }

  function newGame() {
    S.score = 0;
    S.lives = TUNING.LIVES;
    S.deaths = 0;
    loadLevel(startIndex());
  }

  function die() {
    if (S.mode !== "play") return;
    const p = S.player;
    S.mode = "dying";
    S.dyingFor = 0;
    S.lives--;
    S.deaths++;
    SFX.play("hurt");
    fx.burst(p.x + p.w / 2, p.y + p.h / 2, THEME.player, 18, 220);
  }

  function collect(k) {
    const t = k.type, p = S.player;
    S.score += t.points || 0;
    if (t.treasure) S.treasureGot++;
    fx.burst(k.x + k.w / 2, k.y + k.h / 2, t.color, 10, 140);
    if (t.power) {
      const secs = t.power.seconds || 5;
      if (t.power.speed) p.buffs.speed = { mul: t.power.speed, left: secs };
      if (t.power.jump) p.buffs.jump = { mul: t.power.jump, left: secs };
      if (t.power.life) S.lives += t.power.life;
      SFX.play("power");
      say(k.name.charAt(0).toUpperCase() + k.name.slice(1) + "!");
    } else {
      SFX.play((t.points || 0) >= 50 ? "gem" : "coin");
    }
    if (t.treasure && S.treasureGot === S.treasureTotal) say("All treasure found!");
  }

  function complete() {
    if (S.treasureTotal > 0 && S.treasureGot === S.treasureTotal) S.score += 500;
    S.mode = "complete";
    SFX.play("goal");
  }

  function advance() {
    if (S.mode === "complete") {
      if (S.levelIndex + 1 < LEVELS.length) loadLevel(S.levelIndex + 1);
      else S.mode = "won";
    } else if (S.mode === "won" || S.mode === "gameover") {
      newGame();
    }
  }

  function updateParticles(dt) {
    for (const q of S.particles) {
      q.life -= dt;
      q.vy += q.g * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
    }
    S.particles = S.particles.filter((q) => q.life > 0);
  }

  function step(dt) {
    // Nothing moves while you're away (say, editing code in another window).
    if (S.paused) return;
    S.time += dt;
    updateParticles(dt);

    if (S.mode === "dying") {
      S.dyingFor += dt;
      if (S.dyingFor > 0.9) {
        if (S.lives > 0) restartLevel();
        else { S.mode = "gameover"; SFX.play("gameover"); }
      }
      return;
    }
    if (S.mode !== "play") return;

    // Each level holds still until you press a movement key.
    if (S.waiting) {
      if (!(Input.left || Input.right || Input.jumpHeld)) return;
      S.waiting = false;
    }

    S.levelTime += dt;
    const p = S.player;
    const outcome = Actors.updatePlayer(p, S.world, dt, fx);
    for (const e of S.enemies) Actors.updateEnemy(e, S.world, p, dt);
    if (outcome) { die(); return; }

    const hit = Actors.playerVsEnemies(p, S.enemies);
    if (hit && hit.stomp) {
      const e = hit.stomp;
      S.score += e.type.points || 0;
      SFX.play("stomp");
      fx.burst(e.x + e.w / 2, e.y + e.h / 2, e.type.color, 14, 180);
    } else if (hit && hit.hurt) {
      die();
      return;
    }

    for (const k of Actors.playerVsPickups(p, S.pickups)) collect(k);
    if (Actors.playerAtGoal(p, S.goals)) complete();
    updateCamera(dt);
  }

  function cameraTarget() {
    const W = canvas.width, H = canvas.height, p = S.player, w = S.world;
    let x = p.x + p.w / 2 - W / 2 + p.facing * 40;
    let y = p.y + p.h / 2 - H * 0.55;
    x = w.pxW <= W ? (w.pxW - W) / 2 : Math.max(0, Math.min(x, w.pxW - W));
    y = w.pxH <= H ? w.pxH - H : Math.max(0, Math.min(y, w.pxH - H));
    return { x, y };
  }

  function snapCamera() { S.cam = cameraTarget(); }

  function updateCamera(dt) {
    const t = cameraTarget(), k = 1 - Math.pow(0.002, dt);
    S.cam.x += (t.x - S.cam.x) * k;
    S.cam.y += (t.y - S.cam.y) * k;
  }

  function crash(err) {
    running = false;
    const m = String(err && err.stack || "").match(/((?:student|engine)\/[\w.-]+\.js)(?:\?[^:]*)?:(\d+):(\d+)/);
    GameErrors.fromException(err && err.message || String(err), m ? m[1] : "", m ? +m[2] : 0, m ? +m[3] : 0);
  }

  let acc = 0, last = 0;
  function loop(now) {
    if (!running) return;
    try {
      const elapsed = Math.min((now - (last || now)) / 1000, 0.25);
      last = now;
      acc += elapsed;
      while (acc >= DT) { step(DT); acc -= DT; }
      Render.frame(ctx, S);
    } catch (err) {
      crash(err);
      return;
    }
    requestAnimationFrame(loop);
  }

  function bindKeys() {
    Input.on("KeyR", () => (S.mode === "gameover" || S.mode === "won" ? newGame() : restartLevel()));
    Input.on("KeyN", () => { loadLevel((S.levelIndex + 1) % LEVELS.length); say("Skipped to level " + (S.levelIndex + 1)); });
    Input.on("KeyT", () => Panel.toggle());
    Input.on("KeyH", () => { S.showHitboxes = !S.showHitboxes; });
    Input.on("KeyM", () => say(SFX.toggleMute() ? "Sound off" : "Sound on"));
    Input.on("Enter", advance);
    Input.on("NumpadEnter", advance);
    canvas.addEventListener("pointerdown", () => { SFX.unlock(); canvas.focus(); S.paused = false; });
    addEventListener("blur", () => { S.paused = true; });
    addEventListener("focus", () => { S.paused = false; });
    addEventListener("keydown", () => { S.paused = false; });
  }

  function start() {
    Panel.init();
    bindKeys();
    newGame();
    running = true;
    requestAnimationFrame(loop);
    canvas.focus();
  }

  return { start, state: S };
})();

window.addEventListener("load", () => {
  if (GameErrors.fatal) return;
  const { errors, warnings } = Validate.run();
  if (errors.length) { GameErrors.showFatal(errors); return; }
  GameErrors.showWarnings(warnings);
  Game.start();
});

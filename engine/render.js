/* Engine: drawing. Everything is drawn from shapes, so there are no image
   files to lose. Colors come from student/theme.js. */

const Render = (() => {

  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function hash(c, r) {
    const n = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
    return n - Math.floor(n);
  }

  function sky(ctx, W, H) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, THEME.skyTop);
    g.addColorStop(1, THEME.skyBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function hills(ctx, W, H, offset, base, amp, color, freq) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 8) {
      const t = x + offset;
      ctx.lineTo(x, base + Math.sin(t * freq) * amp + Math.sin(t * freq * 2.7 + 1.3) * amp * 0.35);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
  }

  function tiles(ctx, world, cam, W, H) {
    const c0 = Math.max(0, Math.floor(cam.x / TILE) - 1);
    const c1 = Math.min(world.w - 1, Math.ceil((cam.x + W) / TILE) + 1);
    const r0 = Math.max(0, Math.floor(cam.y / TILE) - 1);
    const r1 = Math.min(world.h - 1, Math.ceil((cam.y + H) / TILE) + 1);

    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const k = world.tiles[r][c];
        const x = c * TILE, y = r * TILE;
        if (k === "solid") {
          ctx.fillStyle = THEME.solid;
          ctx.fillRect(x, y, TILE, TILE);
          ctx.fillStyle = "rgba(0,0,0,0.18)";
          if (hash(c, r) > 0.5) ctx.fillRect(x + 5, y + 12, 4, 3);
          if (hash(r, c) > 0.6) ctx.fillRect(x + 14, y + 6, 3, 3);
          if (r === 0 || world.tiles[r - 1][c] !== "solid") {
            ctx.fillStyle = THEME.solidTop;
            ctx.fillRect(x, y, TILE, 6);
            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.fillRect(x, y, TILE, 2);
          }
        } else if (k === "ledge") {
          ctx.fillStyle = THEME.ledge;
          ctx.fillRect(x, y, TILE, 7);
          ctx.fillStyle = "rgba(0,0,0,0.25)";
          ctx.fillRect(x, y + 5, TILE, 2);
          ctx.fillRect(x + TILE - 1, y, 1, 7);
        } else if (k === "spikes") {
          ctx.fillStyle = THEME.spikes;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(x + i * 8, y + TILE);
            ctx.lineTo(x + i * 8 + 4, y + 9);
            ctx.lineTo(x + i * 8 + 8, y + TILE);
            ctx.fill();
          }
        }
      }
    }
  }

  function goal(ctx, g, time) {
    const px = g.x + 2, top = g.y - 6, bottom = g.y + g.h;
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillRect(px, top, 3, bottom - top);
    ctx.fillStyle = THEME.goal;
    ctx.beginPath();
    ctx.moveTo(px + 3, top);
    const wave = Math.sin(time * 5) * 3;
    ctx.quadraticCurveTo(px + 13, top + 4 + wave, px + 24, top + 8);
    ctx.quadraticCurveTo(px + 13, top + 12 - wave, px + 3, top + 18);
    ctx.fill();
  }

  function pickup(ctx, k, time) {
    const bob = Math.sin(time * 3 + k.bob) * 2.5;
    const cx = k.x + k.w / 2, cy = k.y + k.h / 2 + bob, s = k.w / 2;
    if (k.type.power) {
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath(); ctx.arc(cx, cy, s + 5 + Math.sin(time * 4) * 1.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = k.type.color;
    ctx.beginPath();
    if (k.type.shape === "diamond") {
      ctx.moveTo(cx, cy - s * 1.2); ctx.lineTo(cx + s, cy); ctx.lineTo(cx, cy + s * 1.2); ctx.lineTo(cx - s, cy);
      ctx.closePath();
    } else if (k.type.shape === "square") {
      rr(ctx, cx - s, cy - s, s * 2, s * 2, 3);
    } else {
      ctx.ellipse(cx, cy, s * (0.6 + 0.4 * Math.abs(Math.cos(time * 2.5 + k.bob))), s, 0, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillRect(cx - s * 0.35, cy - s * 0.55, Math.max(2, s * 0.3), Math.max(2, s * 0.3));
  }

  function eyes(ctx, x, y, w, dir, color, look) {
    const ex = x + w / 2 + dir * w * 0.12;
    ctx.fillStyle = "#fff";
    ctx.fillRect(ex - 6, y, 5, 6);
    ctx.fillRect(ex + 1, y, 5, 6);
    ctx.fillStyle = color;
    ctx.fillRect(ex - 6 + 2 + dir * look, y + 2, 2, 3);
    ctx.fillRect(ex + 1 + 2 + dir * look, y + 2, 2, 3);
  }

  function enemy(ctx, e, time) {
    if (e.dead) return;
    const t = e.type;
    let { x, y, w, h } = e;
    if (t.movement === "hop" && !e.onGround) { const s = Math.min(0.25, Math.abs(e.vy) / 2000); x += w * s / 2; w *= 1 - s; y -= h * s; h *= 1 + s; }
    if (t.movement === "hover") {
      const flap = Math.sin(time * 18 + e.phase) * 5;
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.beginPath(); ctx.ellipse(x + 2, y + 4 - flap / 2, 7, 3 + Math.abs(flap) / 2, -0.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + w - 2, y + 4 - flap / 2, 7, 3 + Math.abs(flap) / 2, 0.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = t.color;
    rr(ctx, x, y, w, h, Math.min(8, w / 3));
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(x + 2, y + h - 4, w - 4, 3);
    if (!t.stompable) {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      for (let i = 0; i < 3; i++) {
        const sx = x + (w / 4) * (i + 0.5) + w / 8;
        ctx.beginPath(); ctx.moveTo(sx - 3, y); ctx.lineTo(sx, y - 6); ctx.lineTo(sx + 3, y); ctx.fill();
      }
    }
    eyes(ctx, x, y + Math.max(3, h * 0.22), w, e.dir, "#111", 1);
    if (e.alert) {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("!", x + w / 2, y - 6);
    }
  }

  function player(ctx, p, time, dying) {
    const sx = 1 - p.squash, sy = 1 + p.squash;
    const w = p.w * sx, h = p.h * sy;
    const x = p.x + (p.w - w) / 2, y = p.y + p.h - h;
    if (p.buffs.speed) {
      ctx.fillStyle = "rgba(156,255,107,0.25)";
      rr(ctx, x - p.facing * 8, y + 2, w, h - 4, 6); ctx.fill();
    }
    if (p.buffs.jump) {
      ctx.strokeStyle = "rgba(255,255,255," + (0.35 + Math.sin(time * 8) * 0.2) + ")";
      ctx.lineWidth = 2;
      rr(ctx, x - 3, y - 3, w + 6, h + 6, 8); ctx.stroke();
    }
    ctx.globalAlpha = dying ? 0.4 + 0.4 * Math.sin(time * 40) : 1;
    ctx.fillStyle = THEME.player;
    rr(ctx, x, y, w, h, 6);
    ctx.fill();
    eyes(ctx, x, y + 5, w, p.facing, THEME.playerEyes, 1);
    ctx.globalAlpha = 1;
  }

  function particles(ctx, list) {
    for (const q of list) {
      ctx.globalAlpha = Math.max(0, q.life / q.max);
      ctx.fillStyle = q.color;
      ctx.fillRect(q.x - q.size / 2, q.y - q.size / 2, q.size, q.size);
    }
    ctx.globalAlpha = 1;
  }

  function hitboxes(ctx, S) {
    ctx.lineWidth = 1;
    const box = (o, c) => { ctx.strokeStyle = c; ctx.strokeRect(o.x + 0.5, o.y + 0.5, o.w - 1, o.h - 1); };
    const w = S.world;
    for (let r = 0; r < w.h; r++) for (let c = 0; c < w.w; c++) {
      if (w.tiles[r][c] === "spikes") box(World.spikeRect(c, r), "#ff8c42");
      if (w.tiles[r][c] === "solid") { ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.strokeRect(c * TILE + 0.5, r * TILE + 0.5, TILE - 1, TILE - 1); }
      if (w.tiles[r][c] === "ledge") { ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.beginPath(); ctx.moveTo(c * TILE, r * TILE + 0.5); ctx.lineTo(c * TILE + TILE, r * TILE + 0.5); ctx.stroke(); }
    }
    for (const g of S.goals) box(g, "#4dd9ff");
    for (const k of S.pickups) if (!k.taken) box(k, "#ffe066");
    for (const e of S.enemies) if (!e.dead) box(e, "#ff4d4d");
    box(S.player, "#52ff7a");
    const p = S.player;
    ctx.fillStyle = "#52ff7a";
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.fillText("vx " + p.vx.toFixed(0) + "  vy " + p.vy.toFixed(0) + (p.onGround ? "  ground" : "  air"), p.x - 20, p.y - 8);
  }

  function hud(ctx, S, W) {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, W, 30);
    ctx.fillStyle = THEME.text;
    ctx.font = "600 14px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    const m = Math.floor(S.levelTime / 60), s = Math.floor(S.levelTime % 60);
    const parts = [
      "Level " + (S.levelIndex + 1) + ": " + S.world.name,
      "Score " + S.score,
      "Treasure " + S.treasureGot + "/" + S.treasureTotal,
      "Lives " + "♥".repeat(Math.max(0, Math.min(S.lives, 10))) + (S.lives > 10 ? "+" : ""),
      m + ":" + String(s).padStart(2, "0"),
    ];
    let x = 12;
    for (const t of parts) { ctx.fillText(t, x, 15); x += ctx.measureText(t).width + 22; }
    ctx.textAlign = "right";
    const b = S.player.buffs;
    const tags = [];
    if (b.speed) tags.push("SPEED " + b.speed.left.toFixed(1) + "s");
    if (b.jump) tags.push("JUMP " + b.jump.left.toFixed(1) + "s");
    if (SFX.muted) tags.push("muted");
    if (S.showHitboxes) tags.push("hitboxes");
    ctx.fillText(tags.join("   "), W - 12, 15);
    ctx.textBaseline = "alphabetic";
  }

  function banner(ctx, W, H, title, lines) {
    ctx.fillStyle = "rgba(10,14,28,0.72)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(10,14,28,0.85)";
    rr(ctx, W / 2 - 300, H / 2 - 84, 600, 110 + lines.length * 26, 14); ctx.fill();
    ctx.fillStyle = THEME.text;
    ctx.textAlign = "center";
    ctx.font = "700 40px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.fillText(title, W / 2, H / 2 - 30);
    ctx.font = "16px system-ui, -apple-system, Segoe UI, sans-serif";
    lines.forEach((l, i) => ctx.fillText(l, W / 2, H / 2 + 10 + i * 26));
  }

  function toast(ctx, W, text, age) {
    if (!text || age > 1.6) return;
    ctx.globalAlpha = Math.min(1, (1.6 - age) * 3);
    ctx.font = "700 18px system-ui, -apple-system, Segoe UI, sans-serif";
    ctx.textAlign = "center";
    const tw = ctx.measureText(text).width + 28;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    rr(ctx, W / 2 - tw / 2, 44, tw, 30, 8); ctx.fill();
    ctx.fillStyle = THEME.text;
    ctx.fillText(text, W / 2, 65);
    ctx.globalAlpha = 1;
  }

  function frame(ctx, S) {
    const W = ctx.canvas.width, H = ctx.canvas.height;
    sky(ctx, W, H);
    hills(ctx, W, H, S.cam.x * 0.2, H * 0.6 - S.cam.y * 0.05, 34, THEME.hillsFar, 0.006);
    hills(ctx, W, H, S.cam.x * 0.45 + 400, H * 0.74 - S.cam.y * 0.1, 26, THEME.hillsNear, 0.009);

    ctx.save();
    ctx.translate(-Math.round(S.cam.x), -Math.round(S.cam.y));
    tiles(ctx, S.world, S.cam, W, H);
    for (const g of S.goals) goal(ctx, g, S.time);
    for (const k of S.pickups) if (!k.taken) pickup(ctx, k, S.time);
    for (const e of S.enemies) enemy(ctx, e, S.time);
    if (S.mode !== "gameover") player(ctx, S.player, S.time, S.mode === "dying");
    particles(ctx, S.particles);
    if (S.showHitboxes) hitboxes(ctx, S);
    ctx.restore();

    hud(ctx, S, W);
    toast(ctx, W, S.toast, S.time - S.toastAt);

    if (S.mode === "complete") {
      banner(ctx, W, H, "Level complete!", [
        "Score " + S.score + "   ·   Treasure " + S.treasureGot + "/" + S.treasureTotal +
          (S.treasureGot === S.treasureTotal && S.treasureTotal > 0 ? "   ·   +500 all-treasure bonus" : ""),
        S.levelIndex + 1 < LEVELS.length ? "Press Enter for the next level" : "Press Enter to finish",
      ]);
    } else if (S.mode === "won") {
      banner(ctx, W, H, "You beat every level!", [
        "Final score " + S.score + "   ·   Lives lost " + S.deaths,
        "Press Enter to play again",
      ]);
    } else if (S.mode === "gameover") {
      banner(ctx, W, H, "Game over", ["Score " + S.score, "Press Enter to try again"]);
    } else if (S.paused) {
      banner(ctx, W, H, "Paused", ["Click the game to keep playing"]);
    } else if (S.waiting) {
      toast(ctx, W, "Press an arrow key or Space to start", 0);
    }
  }

  return { frame };
})();

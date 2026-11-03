/* Engine: sound effects, made from tones so there are no audio files. */

const SFX = (() => {
  let ctx = null;
  let muted = false;

  function unlock() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
  }

  function tone(freq, dur, type, vol, slideTo, delay) {
    if (!ctx || muted) return;
    const t = ctx.currentTime + (delay || 0);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || "square";
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(vol || 0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  const sounds = {
    jump:     () => tone(300, 0.12, "square", 0.04, 620),
    airjump:  () => tone(500, 0.12, "square", 0.04, 900),
    coin:     () => { tone(988, 0.06, "square", 0.035); tone(1319, 0.12, "square", 0.035, null, 0.06); },
    gem:      () => { tone(784, 0.07, "triangle", 0.06); tone(1175, 0.07, "triangle", 0.06, null, 0.07); tone(1568, 0.16, "triangle", 0.06, null, 0.14); },
    power:    () => tone(220, 0.35, "sawtooth", 0.035, 880),
    stomp:    () => tone(180, 0.12, "square", 0.06, 60),
    hurt:     () => tone(400, 0.45, "sawtooth", 0.05, 70),
    goal:     () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, "square", 0.04, null, i * 0.1)),
    gameover: () => [392, 330, 262, 196].forEach((f, i) => tone(f, 0.25, "triangle", 0.06, null, i * 0.18)),
  };

  return {
    unlock,
    play(name) { if (sounds[name]) sounds[name](); },
    toggleMute() { muted = !muted; return muted; },
    get muted() { return muted; },
  };
})();

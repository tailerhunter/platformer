/* Engine: keyboard. */

const Input = (() => {
  const held = new Set();
  const handlers = {};
  let jumpQueued = false;

  const LEFT = ["ArrowLeft", "KeyA"];
  const RIGHT = ["ArrowRight", "KeyD"];
  const JUMP = ["Space", "ArrowUp", "KeyW"];
  const GAME_KEYS = [...LEFT, ...RIGHT, ...JUMP, "ArrowDown"];

  function typingInField(e) {
    const t = e.target;
    return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
  }

  addEventListener("keydown", (e) => {
    if (typingInField(e)) return;
    SFX.unlock();
    if (JUMP.includes(e.code) && !e.repeat) jumpQueued = true;
    held.add(e.code);
    if (GAME_KEYS.includes(e.code)) e.preventDefault();
    if (!e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey && handlers[e.code]) handlers[e.code]();
  });
  addEventListener("keyup", (e) => held.delete(e.code));
  addEventListener("blur", () => held.clear());

  const any = (codes) => codes.some((k) => held.has(k));

  return {
    get left() { return any(LEFT); },
    get right() { return any(RIGHT); },
    get jumpHeld() { return any(JUMP); },
    takeJumpPress() { const j = jumpQueued; jumpQueued = false; return j; },
    clearPresses() { jumpQueued = false; },
    on(code, fn) { handlers[code] = fn; },
  };
})();

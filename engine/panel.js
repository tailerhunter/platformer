/* Engine: the live tuning panel (press T). Sliders change TUNING while the
   game runs. Nothing here is saved: reloading the page re-reads tuning.js. */

const Panel = (() => {
  let el = null, built = false;
  const fileValues = {};

  const GROUPS = [
    ["The feel you can see (Hole 1)", ["GRAVITY", "MAX_FALL_SPEED", "MOVE_SPEED", "GROUND_ACCEL", "GROUND_FRICTION", "AIR_ACCEL", "AIR_FRICTION", "JUMP_VELOCITY"]],
    ["The feel you can't see (Hole 2)", ["COYOTE_TIME", "JUMP_BUFFER", "JUMP_RELEASE_CUT", "APEX_GRAVITY_MULT", "APEX_THRESHOLD"]],
    ["Features (Hole 3)", ["MAX_AIR_JUMPS", "STOMP_BOUNCE"]],
  ];

  const fmt = (key, v) => (TUNING_SPEC[key].step < 1 ? Number(v).toFixed(2) : String(Math.round(v)));

  function init() {
    el = document.getElementById("panel");
    for (const k of Object.keys(TUNING_SPEC)) fileValues[k] = TUNING[k];
  }

  function changes() {
    return Object.keys(TUNING_SPEC).filter((k) => TUNING[k] !== fileValues[k]);
  }

  function changesText() {
    const list = changes();
    if (!list.length) return "";
    const width = Math.max(...list.map((k) => (k + ": " + fmt(k, TUNING[k]) + ",").length));
    return "Change these numbers in student/tuning.js:\n\n" +
      list.map((k) => "  " + (k + ": " + fmt(k, TUNING[k]) + ",").padEnd(width + 3) + "// file says " + fmt(k, fileValues[k])).join("\n");
  }

  function refresh() {
    for (const row of el.querySelectorAll(".prow")) {
      const k = row.dataset.key;
      row.querySelector("output").textContent = fmt(k, TUNING[k]);
      const was = row.querySelector(".was");
      const changed = TUNING[k] !== fileValues[k];
      row.classList.toggle("changed", changed);
      was.textContent = changed ? "file: " + fmt(k, fileValues[k]) : "";
    }
    const n = changes().length;
    el.querySelector(".summary").textContent = n === 0
      ? "No changes yet. Drag a slider, then play."
      : n + (n === 1 ? " slider differs" : " sliders differ") + " from tuning.js. These are lost when you reload.";
    el.querySelector("[data-act=copy]").disabled = n === 0;
  }

  function build() {
    el.innerHTML = "";
    const head = document.createElement("header");
    head.innerHTML = "<h3>Tuning panel</h3>";
    const close = document.createElement("button");
    close.className = "x";
    close.setAttribute("aria-label", "Close tuning panel");
    close.textContent = "×";
    close.onclick = toggle;
    head.appendChild(close);
    el.appendChild(head);

    const note = document.createElement("p");
    note.className = "note";
    note.innerHTML = "Sliders change the game <b>right now</b>, but they live in memory and are " +
      "forgotten when you reload. To keep a value, write it into <code>student/tuning.js</code> " +
      "and save the file.";
    el.appendChild(note);

    for (const [title, keys] of GROUPS) {
      const h = document.createElement("h4");
      h.textContent = title;
      el.appendChild(h);
      for (const k of keys) {
        const spec = TUNING_SPEC[k];
        const row = document.createElement("label");
        row.className = "prow";
        row.dataset.key = k;
        const top = document.createElement("span");
        top.className = "ptop";
        top.innerHTML = '<span class="pname"></span><span class="was"></span><output></output>';
        top.querySelector(".pname").textContent = k;
        const input = document.createElement("input");
        input.type = "range";
        input.min = Math.min(spec.min, fileValues[k]);
        input.max = Math.max(spec.max, fileValues[k]);
        input.step = spec.step;
        input.value = TUNING[k];
        input.oninput = () => { TUNING[k] = parseFloat(input.value); refresh(); };
        input.onchange = () => { input.blur(); document.getElementById("screen").focus(); };
        row.append(top, input);
        el.appendChild(row);
      }
    }

    const summary = document.createElement("p");
    summary.className = "summary";
    el.appendChild(summary);

    const actions = document.createElement("div");
    actions.className = "actions";
    const copy = document.createElement("button");
    copy.dataset.act = "copy";
    copy.textContent = "Copy my changes";
    const reset = document.createElement("button");
    reset.dataset.act = "reset";
    reset.textContent = "Reset to file";
    actions.append(copy, reset);
    el.appendChild(actions);

    const out = document.createElement("textarea");
    out.readOnly = true;
    out.hidden = true;
    out.rows = 7;
    el.appendChild(out);

    copy.onclick = async () => {
      out.value = changesText();
      out.hidden = false;
      out.select();
      let ok = false;
      try { await navigator.clipboard.writeText(out.value); ok = true; } catch (e) { ok = false; }
      copy.textContent = ok ? "Copied!" : "Select the text below and copy it";
      setTimeout(() => { copy.textContent = "Copy my changes"; }, 2000);
    };
    reset.onclick = () => {
      for (const k of Object.keys(TUNING_SPEC)) TUNING[k] = fileValues[k];
      for (const input of el.querySelectorAll("input[type=range]")) input.value = TUNING[input.closest(".prow").dataset.key];
      out.hidden = true;
      refresh();
    };

    built = true;
    refresh();
  }

  function toggle() {
    if (!built) build();
    el.hidden = !el.hidden;
    if (el.hidden) document.getElementById("screen").focus();
  }

  return { init, toggle };
})();

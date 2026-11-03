/* Engine: checks the student files before the game starts, and explains any
   problem in plain language: what is wrong, where, and how to fix it. */

const Validate = (() => {

  const THEME_DEFAULTS = {
    skyTop: "#1b2a4a", skyBottom: "#3f5d8a", hillsFar: "#2c4470", hillsNear: "#26395e",
    solid: "#5b4a3a", solidTop: "#7fbf5a", ledge: "#a7865d", spikes: "#d9d9e0",
    player: "#f2f2f2", playerEyes: "#1b2a4a", goal: "#ffd34d", text: "#ffffff",
  };

  // Suggest the closest known word, for typos like GRAVTY or "patorl".
  function closest(word, options) {
    let best = null, bestD = Infinity;
    const a = String(word).toLowerCase();
    for (const o of options) {
      const b = o.toLowerCase();
      const d = [];
      for (let i = 0; i <= a.length; i++) { d[i] = [i]; }
      for (let j = 0; j <= b.length; j++) { d[0][j] = j; }
      for (let i = 1; i <= a.length; i++)
        for (let j = 1; j <= b.length; j++)
          d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (d[a.length][b.length] < bestD) { bestD = d[a.length][b.length]; best = o; }
    }
    return bestD <= Math.max(2, Math.floor(a.length / 3)) ? best : null;
  }

  function didYouMean(word, options) {
    const c = closest(word, options);
    return c ? ' Did you mean "' + c + '"?' : "";
  }

  const isColor = (v) => typeof v === "string" && window.CSS && CSS.supports("color", v);
  const show = (v) => (typeof v === "string" ? '"' + v + '"' : String(v));

  function run() {
    const errors = [], warnings = [];
    const E = (title, where, hint, snippet) => errors.push({ title, where, hint, snippet });
    const W = (title, where, hint) => warnings.push({ title, where, hint });

    // ----- Did every student file load? -------------------------------------
    const needs = [
      ["TUNING", "student/tuning.js", typeof TUNING],
      ["START_LEVEL", "student/levels.js", typeof START_LEVEL],
      ["LEVELS", "student/levels.js", typeof LEVELS],
      ["ENEMY_TYPES", "student/entities.js", typeof ENEMY_TYPES],
      ["PICKUP_TYPES", "student/entities.js", typeof PICKUP_TYPES],
      ["LEGEND", "student/entities.js", typeof LEGEND],
      ["THEME", "student/theme.js", typeof THEME],
    ];
    for (const [name, file, type] of needs) {
      if (type === "undefined") {
        E(file + " didn't finish loading", file,
          "The game couldn't find " + name + ". Check that the line  const " + name + " =  is still in that file and spelled exactly like this, in capitals. If you deleted or renamed it, put it back.");
      }
    }
    if (errors.length) return { errors, warnings };

    // ----- tuning.js ---------------------------------------------------------
    const T = "student/tuning.js";
    for (const [key, spec] of Object.entries(TUNING_SPEC)) {
      if (!(key in TUNING)) {
        W("TUNING is missing " + key + ", so the game is using " + spec.def + ".", T,
          "It may have been deleted by accident. You can copy it back from the DEFAULTS note at the bottom of the file.");
        TUNING[key] = spec.def;
        continue;
      }
      const v = TUNING[key];
      if (typeof v !== "number" || !isFinite(v)) {
        E(key + " should be a number, but it is " + show(v), T,
          typeof v === "string"
            ? "Numbers don't have quote marks around them. Write  " + key + ": " + (parseFloat(v) || spec.def) + ",  not  " + key + ': "' + v + '",'
            : "Write a plain number, like  " + key + ": " + spec.def + ",");
      } else if (v < 0) {
        W(key + " is negative (" + v + "). That's allowed, but the game may behave strangely.", T, "");
      }
    }
    if (Number.isInteger(TUNING.MAX_AIR_JUMPS) === false && typeof TUNING.MAX_AIR_JUMPS === "number") {
      W("MAX_AIR_JUMPS is " + TUNING.MAX_AIR_JUMPS + ". You can't do part of a jump, so this acts like " + Math.floor(TUNING.MAX_AIR_JUMPS) + ".", T, "Use a whole number: 0, 1, 2...");
    }
    for (const key of Object.keys(TUNING)) {
      if (!(key in TUNING_SPEC)) {
        W("TUNING has a setting called " + key + " that the game doesn't use." + didYouMean(key, Object.keys(TUNING_SPEC)), T,
          "The game ignores names it doesn't know, so this number has no effect.");
      }
    }

    // ----- entities.js: enemies ---------------------------------------------
    const EN = "student/entities.js";
    function checkFields(kind, name, obj, fields, required) {
      const where = EN + ", " + kind + " \"" + name + "\"";
      if (!obj || typeof obj !== "object") { E(kind + " \"" + name + "\" isn't written as a { ... } block", where, "Copy one of the existing blocks exactly, from its name down to its closing },"); return false; }
      for (const f of required) {
        if (!(f in obj)) E(kind + " \"" + name + "\" is missing its " + f + " setting", where, "Every " + kind + " needs: " + required.join(", ") + ".");
      }
      for (const [f, v] of Object.entries(obj)) {
        const want = fields[f];
        if (!want) { W(kind + " \"" + name + "\" has a setting called " + f + " that the game doesn't know." + didYouMean(f, Object.keys(fields)), where, "Unknown settings are ignored."); continue; }
        if (want === "number" && (typeof v !== "number" || !isFinite(v)))
          E(name + "'s " + f + " should be a number, but it is " + show(v), where, "Numbers don't have quote marks around them.");
        if (want === "boolean" && typeof v !== "boolean")
          E(name + "'s " + f + " should be true or false, but it is " + show(v), where, "Write true or false with no quote marks.");
        if (want === "color" && !isColor(v))
          E(name + "'s color " + show(v) + " isn't a color the browser understands", where, 'Try a hex code like "#ff8800" or a name like "tomato". Keep the quote marks.');
        if (want === "object" && (typeof v !== "object" || v === null))
          E(name + "'s " + f + " should be a { ... } list", where, "Example:  power: { speed: 1.5, seconds: 6 },");
      }
      return true;
    }

    if (!Object.keys(ENEMY_TYPES).length) W("There are no enemy types at all.", EN, "");
    for (const [name, t] of Object.entries(ENEMY_TYPES)) {
      if (!checkFields("enemy", name, t, ENEMY_FIELDS, ENEMY_REQUIRED)) continue;
      if ("movement" in t && !MOVEMENTS.includes(t.movement)) {
        E("Enemy \"" + name + "\" has movement " + show(t.movement) + ", which the game doesn't know." + didYouMean(t.movement, MOVEMENTS),
          EN + ", enemy \"" + name + "\"", "movement must be exactly one of: " + MOVEMENTS.map((m) => '"' + m + '"').join(", ") + ".");
      }
      for (const f of ["width", "height"]) {
        if (typeof t[f] === "number" && (t[f] < 4 || t[f] > 120))
          W("Enemy \"" + name + "\" is " + t[f] + " px " + (f === "width" ? "wide" : "tall") + ". That's unusual.", EN, "One block is 24 px. Between 12 and 48 is typical.");
      }
    }

    // ----- entities.js: pickups ---------------------------------------------
    for (const [name, t] of Object.entries(PICKUP_TYPES)) {
      if (!checkFields("pickup", name, t, PICKUP_FIELDS, PICKUP_REQUIRED)) continue;
      if ("shape" in t && !SHAPES.includes(t.shape))
        E("Pickup \"" + name + "\" has shape " + show(t.shape) + "." + didYouMean(t.shape, SHAPES), EN + ", pickup \"" + name + "\"",
          "shape must be one of: " + SHAPES.map((s) => '"' + s + '"').join(", ") + ".");
      if (t.power && typeof t.power === "object") {
        for (const [k, v] of Object.entries(t.power)) {
          if (!POWER_FIELDS.includes(k)) W("Pickup \"" + name + "\" has a power called " + k + "." + didYouMean(k, POWER_FIELDS), EN, "Powers can be: " + POWER_FIELDS.join(", ") + ".");
          else if (typeof v !== "number") E("Pickup \"" + name + "\"'s power " + k + " should be a number, but it is " + show(v), EN, "");
        }
      }
    }

    // ----- entities.js: legend -----------------------------------------------
    const used = { enemy: new Set(), pickup: new Set() };
    for (const [ch, entry] of Object.entries(LEGEND)) {
      const where = EN + ", LEGEND \"" + ch + "\"";
      if ([...ch].length !== 1) { E('LEGEND key "' + ch + '" should be exactly one character', where, 'Use one letter or symbol, like "S" or "%".'); continue; }
      if (!entry || typeof entry !== "object") { E('LEGEND "' + ch + '" isn\'t written as a { ... } block', where, 'Example:  "S": { kind: "enemy", name: "sentry" },'); continue; }
      if (!LEGEND_KINDS.includes(entry.kind)) { E('LEGEND "' + ch + '" has kind ' + show(entry.kind) + "." + didYouMean(entry.kind, LEGEND_KINDS), where, "kind must be one of: " + LEGEND_KINDS.join(", ") + "."); continue; }
      if (entry.kind === "tile" && !TILE_NAMES.includes(entry.name))
        E('LEGEND "' + ch + '" is a tile called ' + show(entry.name) + ", which doesn't exist." + didYouMean(entry.name, TILE_NAMES), where, "Tiles can be: " + TILE_NAMES.join(", ") + ".");
      if (entry.kind === "enemy") {
        if (!(entry.name in ENEMY_TYPES)) E('LEGEND "' + ch + '" points to an enemy called ' + show(entry.name) + ", but there's no enemy with that name." + didYouMean(entry.name, Object.keys(ENEMY_TYPES)), where, "The name must match a name in ENEMY_TYPES exactly, including capital letters.");
        else used.enemy.add(entry.name);
      }
      if (entry.kind === "pickup") {
        if (!(entry.name in PICKUP_TYPES)) E('LEGEND "' + ch + '" points to a pickup called ' + show(entry.name) + ", but there's no pickup with that name." + didYouMean(entry.name, Object.keys(PICKUP_TYPES)), where, "The name must match a name in PICKUP_TYPES exactly, including capital letters.");
        else used.pickup.add(entry.name);
      }
    }
    for (const name of Object.keys(ENEMY_TYPES)) if (!used.enemy.has(name))
      W('Enemy "' + name + '" has no letter in LEGEND, so it can\'t appear in a level yet.', EN, 'Add a line to LEGEND like:  "S": { kind: "enemy", name: "' + name + '" },');
    for (const name of Object.keys(PICKUP_TYPES)) if (!used.pickup.has(name))
      W('Pickup "' + name + '" has no letter in LEGEND, so it can\'t appear in a level yet.', EN, 'Add a line to LEGEND like:  "%": { kind: "pickup", name: "' + name + '" },');

    // ----- levels.js ---------------------------------------------------------
    const LV = "student/levels.js";
    if (!Array.isArray(LEVELS) || LEVELS.length === 0) {
      E("LEVELS should be a list of levels inside [ ... ], and it's empty or broken", LV, "");
      return { errors, warnings };
    }
    if (!Number.isInteger(START_LEVEL) || START_LEVEL < 1 || START_LEVEL > LEVELS.length)
      W("START_LEVEL is " + show(START_LEVEL) + ", but there are only " + LEVELS.length + " levels, so the game starts at level 1.", LV, "Use a whole number from 1 to " + LEVELS.length + ".");

    const seenLetters = new Set();
    LEVELS.forEach((lv, i) => {
      const label = "Level " + (i + 1) + (lv && lv.name ? ' "' + lv.name + '"' : "");
      if (!lv || typeof lv.map !== "string") { E(label + " has no map", LV, "Each level needs  name: \"...\",  and  map: `...`,  with the map between backticks ` (the key above Tab)."); return; }
      if (typeof lv.name !== "string") { W(label + " has no name", LV, ""); lv.name = "Level " + (i + 1); }

      const rows = World.mapRows(lv.map);
      const bad = [];
      const players = [], goals = [];
      rows.forEach((row, r) => {
        [...row].forEach((ch, c) => {
          if (ch === " ") return;
          const entry = LEGEND[ch];
          if (!entry) { bad.push({ ch, r, c, row }); return; }
          seenLetters.add(ch);
          if (entry.kind === "player") players.push("row " + (r + 1) + ", column " + (c + 1));
          if (entry.kind === "goal") goals.push(r);
        });
      });
      bad.slice(0, 3).forEach((b) => {
        const name = b.ch === "\t" ? "a Tab" : '"' + b.ch + '"';
        E(label + " uses " + name + ", which isn't in the LEGEND",
          LV + ", " + label + ", row " + (b.r + 1) + ", column " + (b.c + 1),
          b.ch === "\t" ? "Use . for empty space instead of Tab." : 'Either add "' + b.ch + '" to LEGEND in entities.js, or replace it with a character that is already there.',
          b.row.replace(/\t/g, "→") + "\n" + " ".repeat(b.c) + "^");
      });
      if (bad.length > 3) E("...and " + (bad.length - 3) + " more unknown characters in " + label, LV, "");
      if (players.length === 0) E(label + " has no player start", LV, "Put exactly one P in the map, standing on something.");
      if (players.length > 1) E(label + " has " + players.length + " player starts: " + players.join("; "), LV, "There can only be one P per level.");
      if (goals.length === 0) E(label + " has no goal", LV, "Put at least one G in the map, somewhere the player can reach.");
    });
    for (const [ch, entry] of Object.entries(LEGEND)) {
      if ((entry.kind === "enemy" || entry.kind === "pickup") && !seenLetters.has(ch) && entry.name in (entry.kind === "enemy" ? ENEMY_TYPES : PICKUP_TYPES))
        W('"' + ch + '" (' + entry.name + ") is in the LEGEND but isn't in any level yet.", LV, "Put a " + ch + " in one of your maps to use it.");
    }

    // ----- theme.js ----------------------------------------------------------
    const TH = "student/theme.js";
    for (const key of THEME_KEYS) {
      if (!(key in THEME)) { W("THEME is missing " + key + ", so it's using the default color.", TH, ""); THEME[key] = THEME_DEFAULTS[key]; }
      else if (!isColor(THEME[key])) { W("THEME." + key + " is " + show(THEME[key]) + ", which isn't a color the browser understands, so it's using the default.", TH, 'Try a hex code like "#ff8800" or a name like "tomato". Keep the quote marks.'); THEME[key] = THEME_DEFAULTS[key]; }
    }
    for (const key of Object.keys(THEME)) if (!THEME_KEYS.includes(key))
      W("THEME has a color called " + key + " that the game doesn't use." + didYouMean(key, THEME_KEYS), TH, "");

    return { errors, warnings };
  }

  return { run };
})();

/* Engine: friendly error messages.
   Loads before everything else. Catches mistakes in any file and explains
   them in plain language instead of leaving a blank screen. */

const GameErrors = (() => {
  let fatalShown = false;

  const HINTS = [
    // Most specific first: "Invalid or unexpected token" also contains "unexpected token".
    [/Invalid or unexpected token|unterminated string|illegal character|string literal contains an unescaped line break/i,
     "A quote mark was opened and not closed, or there is a character JavaScript doesn't understand. Curly “smart quotes” copied from a word processor or a website cause this. Retype the quotes by hand."],
    [/missing \} after property list|Unexpected identifier|Unexpected string|Unexpected number|expected property name|Unexpected token/i,
     "This almost always means a missing comma. Look at the last setting ABOVE the line shown (skip over any comment lines) and check that it ends with a comma. It can also be a missing or extra bracket { } or [ ]."],
    [/Unexpected end of input|missing \} in compound|unterminated template|missing \] after/i,
     "Something was opened and never closed: a curly bracket {, a square bracket [, a quote mark \", or a backtick ` (the backticks around a level map). The line shown is often the END of the file, so look above it."],
    [/is not defined|Can't find variable/i,
     "The game looked for a name that doesn't exist. Check the spelling and the capital letters: Coin and coin are different names. If another error is shown above this one, fix that first. It may be the real cause."],
    [/has already been declared|redeclaration/i,
     "The same name is defined twice. Did you paste a whole file, or a const line, a second time?"],
  ];

  function shortFile(url) {
    if (!url) return "";
    const m = String(url).match(/(student|engine)\/[^/?#]+/);
    return m ? m[0] : String(url).split("/").pop();
  }

  function hintFor(message) {
    for (const [re, hint] of HINTS) if (re.test(message)) return hint;
    return "";
  }

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function overlay() {
    return document.getElementById("overlay");
  }

  // Show a stopping error. items: [{ title, where, detail, hint, snippet }]
  function showFatal(items, heading) {
    const box = overlay();
    if (!box) { alert(items.map(i => i.title + "\n" + (i.where || "")).join("\n\n")); return; }
    if (!fatalShown) {
      box.innerHTML = "";
      box.appendChild(el("h2", null, heading || "The game can't start yet. Here's what to fix:"));
      fatalShown = true;
    }
    for (const it of items) {
      const card = el("div", "err-card");
      card.appendChild(el("div", "err-title", it.title));
      if (it.where) card.appendChild(el("div", "err-where", it.where));
      if (it.snippet) card.appendChild(el("pre", "err-snippet", it.snippet));
      if (it.detail) card.appendChild(el("div", "err-detail", it.detail));
      if (it.hint) card.appendChild(el("div", "err-hint", it.hint));
      box.appendChild(card);
    }
    if (!box.querySelector(".err-foot")) {
      box.appendChild(el("p", "err-foot",
        "Fix the first problem, save the file, then reload this page. Later problems are often caused by the first one."));
    }
    box.hidden = false;
  }

  // Non-stopping notes: the game runs, but something looks off.
  function showWarnings(items) {
    if (!items.length) return;
    let bar = document.getElementById("warnings");
    if (!bar) {
      bar = el("div", null);
      bar.id = "warnings";
      document.getElementById("shell").after(bar);
    }
    bar.innerHTML = "";
    const head = el("div", "warn-head");
    head.appendChild(el("strong", null, "Heads up: the game is running, but " +
      (items.length === 1 ? "one thing looks off." : items.length + " things look off.")));
    const close = el("button", null, "Hide");
    close.onclick = () => bar.remove();
    head.appendChild(close);
    bar.appendChild(head);
    const ul = el("ul");
    for (const it of items) {
      const li = el("li");
      li.appendChild(el("span", "warn-title", it.title));
      if (it.where) li.appendChild(el("span", "warn-where", " " + it.where));
      if (it.hint) li.appendChild(el("div", "warn-hint", it.hint));
      ul.appendChild(li);
    }
    bar.appendChild(ul);
  }

  function fromException(message, file, line, col) {
    const f = shortFile(file);
    const isStudent = f.startsWith("student/");
    const isEngine = f.startsWith("engine/");
    showFatal([{
      title: isStudent ? "There's a typo in " + f : "Something went wrong" + (f ? " in " + f : ""),
      where: f ? (f + (line ? ", line " + line : "") + (col ? ", around character " + col : "")) : "",
      detail: "The browser says: " + message,
      hint: isEngine
        ? "This happened inside the engine. Most often it is caused by an unusual value in one of your student files, so check what you changed most recently. If you are stuck, show this message to your instructor."
        : hintFor(message),
    }]);
  }

  window.addEventListener("error", (e) => {
    // Image or script load failures arrive here too, with no message.
    if (!e.message && e.target && e.target.src) {
      showFatal([{
        title: "A file is missing: " + shortFile(e.target.src),
        hint: "Did a file get renamed or moved? index.html expects it at exactly this path.",
      }]);
      return;
    }
    fromException(e.message, e.filename, e.lineno, e.colno);
  }, true);

  return {
    showFatal, showWarnings, fromException,
    get fatal() { return fatalShown; },
  };
})();

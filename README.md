# Platformer

A small, complete platform game that runs in any web browser. The engine is
already built: drawing, physics, collisions, sound, enemies, scoring. Your job
is to make the game **yours** by changing four small files, without needing to
know how to program.

> **Start here.** Read this page top to bottom once. It takes five minutes.

---

## 1. Get your own copy (Day 1)

1. Near the top of this page, click **Use this template** → **Create a new repository**.
2. Name it `platformer`, set it to **Public**, and click **Create repository**.
   You now have your own copy. Nothing you do can break anyone else's.

## 2. Turn on your live link

1. In *your* repository, go to **Settings** → **Pages** (left sidebar).
2. Under **Branch**, choose `main` and `/ (root)`, then click **Save**.
3. Wait about a minute and refresh. Your link appears at the top:
   `https://YOUR-USERNAME.github.io/platformer/`

That link is your game, live on the internet. It updates about a minute after
every change you save to GitHub.

## 3. Open your workspace

**Recommended: a Codespace (a full code editor in your browser).**
On your repository's front page, click **Code** → **Codespaces** →
**Create codespace on main**. After a minute or so you'll see your files on the
left, and the game opens in a panel on the right.

- Files save automatically. To see a change, click the reload arrow at the
  top of the game panel.
- The game pauses whenever you click away from it, and each level waits for
  you to press a key before anything moves. So you can edit code without
  losing lives.
- If the game panel doesn't open by itself: click the **Ports** tab at the
  bottom, then the globe icon next to port 8000.

**Backup: work on your own computer.** **Code** → **Download ZIP**, unzip it,
and double-click `index.html` to play. Edit the files with any text editor,
save, and reload the browser tab. You'll upload your changed files to GitHub
at the end (see section 6).

---

## 4. Where your work goes

You only edit the four files in the `student/` folder. Everything in `engine/`
is the machinery. You don't need to read it, and professionals work this way
too: most of a real job is making changes inside code someone else wrote.

| File | What it controls | Holes |
| --- | --- | --- |
| `student/tuning.js` | how the player moves and feels | 1, 2, 3 |
| `student/levels.js` | the levels, drawn as text | 4 |
| `student/entities.js` | enemies, pickups, and what each map letter means | 5, 6 |
| `student/theme.js` | colors | 7 |

Each place you're meant to work is marked in the file like this, and numbered
to match the assignment:

```js
/* ===== HOLE 4 of 7 — Draw your own level ================== */
```

Every hole can be finished using only the comments in the file. You don't
need anything else.

## 5. The loop

1. Change something.
2. Reload the game.
3. Play it. Did it do what you expected?
4. Repeat.

That loop is most of software development. Keep it short: make one change,
then check it.

**The tuning panel.** Press <kbd>T</kbd> in the game to get sliders for every
number in `tuning.js`. Sliders change the game instantly, so they're the fastest
way to find a feel you like. They are **not saved**. When you reload, the game
reads `tuning.js` again. To keep a value, write it into the file. The
**Copy my changes** button lists exactly which numbers to change.

**When something breaks.** The game checks your files every time it loads.

- A **red** box means the game can't start. It tells you the file, the line,
  and the usual fix. Fix the first problem, save, reload.
- A **yellow** bar means the game is running, but something looks off.
- Still stuck? <kbd>Ctrl</kbd>+<kbd>Z</kbd> undoes your last edits. Your
  last saved version is always on GitHub.

## 6. Save your work to GitHub ("commit")

A commit is a saved snapshot with a note about what changed. Commit every time
something works. It's your undo history, and it's what your instructor sees.

**In a Codespace:** click the **Source Control** icon on the left (it looks
like a branching line). Type a short message describing what you did, like
`Drew level 3 with a spike pit`. Click **Commit**, then **Sync Changes**.

**From your own computer:** on your repository page, click **Add file** →
**Upload files**, drag in the files you changed (keep them in the right
folder!), write a message, and click **Commit changes**.

Then check your live link a minute later.

---

## Controls

| Key | Does |
| --- | --- |
| <kbd>←</kbd> <kbd>→</kbd> or <kbd>A</kbd> <kbd>D</kbd> | move |
| <kbd>Space</kbd>, <kbd>W</kbd>, or <kbd>↑</kbd> | jump (hold for higher) |
| <kbd>R</kbd> | restart the level |
| <kbd>N</kbd> | skip to the next level (a developer shortcut) |
| <kbd>T</kbd> | tuning panel |
| <kbd>H</kbd> | show hitboxes: the invisible boxes the game uses for touching |
| <kbd>M</kbd> | mute |
| <kbd>Enter</kbd> | continue after a level |

You can also add `?level=3` to the end of the address to start on level 3.

## More

- [CHALLENGES.md](CHALLENGES.md): the Day 2 challenges.
- [docs/MAP.md](docs/MAP.md): a guided tour of every file and how they fit together.
- [docs/IDEAS.md](docs/IDEAS.md): **optional** bigger features, if you want to go further.
- Found something that doesn't work right? Open your repository's **Issues** tab
  → **New issue** → **Bug report**.

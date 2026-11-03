# Day 2 Challenges

Four challenges, each one a level you add to your game. Each one has you work
in a different part of the project, and each one has a clear finish line.

| # | Challenge | You work in | About |
| --- | --- | --- | --- |
| 1 | Sentry Post | `student/entities.js` | 10 min |
| 2 | Fixer Upper | `student/levels.js` | 12 min |
| 3 | The Wall | `student/tuning.js` | 8 min |
| 4 | Low Ceiling | `student/tuning.js` | 10 min |
| 5 | *Bonus:* make one for a teammate | `student/levels.js` | any time left |

Everything you need is on this page and in the comments inside the files.

---

## Before you start: make a branch

A **branch** is a separate copy of your project's history where you can try
things without touching your main version. Your live link keeps showing
`main`, so nothing you do today can break it. Professional developers do
almost all of their work on branches.

**In a Codespace:**

1. At the very bottom-left of the window you'll see the word `main`. Click it.
2. Choose **Create new branch...**, type `challenge`, and press Enter.
3. The bottom-left now says `challenge`. Every commit you make goes there.
4. The first time you commit, the button says **Publish Branch**. Click it.
   After that, use **Sync Changes** as usual.

**Working from the ZIP on your own computer:**

1. On your repository's GitHub page, click the branch button (it says `main`).
2. Type `challenge` and click **Create branch challenge from main**.
3. When you upload changed files at the end, make sure the branch button says
   `challenge` first.

Your live link shows `main` only, so test today's work in the Codespace game
panel or by opening `index.html` on your computer.

## Then: put tuning back to the defaults

So everyone starts equal, open `student/tuning.js` and make every number match
the **DEFAULTS** list at the bottom of the file. If you never changed it, you're
already done. Commit with the message `Reset tuning for challenges`.

## How every challenge works

1. **Copy the level.** Each challenge below has a box of code. Hover over it and
   click the copy button in its top-right corner.
2. **Paste it into `student/levels.js`.** Scroll to the very bottom of the file
   and find the line that is just `];`. Paste on the empty line right above it.
3. **Jump straight to it.** Near the top of `levels.js`, set `START_LEVEL` to
   the new level's number. Your game has 3 levels already, so Challenge 1 is
   level **4**, Challenge 2 is **5**, Challenge 3 is **6**, Challenge 4 is **7**.
   (The top-left of the game shows the level's number and name, so you can
   check.)
4. **Save and reload the game.** Then do the challenge.
5. **Prove it.** When the game says **Level complete!**, take a screenshot.
6. **Commit** with a message that says what you did, like
   `Challenge 1: add sentry and heart`.

---

## Challenge 1: Sentry Post

*You work in: `student/entities.js`.*

```js
  {
    name: "Challenge 1: Sentry Post",
    map: `
............................................
............................................
............................................
............................................
............................................
............................................
....................h.......................
...................===......................
..............o.o.o.........o.o.o...........
.P..............S..............S.........G..
##########...##########...##########...#####
##########...##########...##########...#####
`,
  },
```

Paste it, set `START_LEVEL` to 4, and reload. **The game will refuse to start
and show a red box.** That's on purpose. This level uses two letters the game
doesn't know yet. Read the message: which letters, and where?

Your job is to teach the game what those letters mean. Follow the HOLE 5 and
HOLE 6 steps in `entities.js`, building exactly these two things:

**An enemy called `sentry`.** Copy the `walker` block and change it to:

| Setting | Value |
| --- | --- |
| `movement` | `"chase"` |
| `speed` | `50` |
| `width` | `22` |
| `height` | `26` |
| `color` | any color you like |
| `stompable` | `false` |
| `points` | `0` |
| `turnsAtLedges` | `true` |
| `sightRange` | `160` (a new line: the walker doesn't have it) |

**A pickup called `heart`.** Copy the `feather` block (it already has a
`power` line) and change it to:

| Setting | Value |
| --- | --- |
| `color` | any color you like |
| `size` | `14` |
| `shape` | any shape from the menu |
| `points` | `0` |
| `treasure` | `false` |
| `power` | `{ life: 1 }` |

**Then add both letters to `LEGEND`** at the bottom of the file: `S` for the
sentry and `h` for the heart. Letters are case-sensitive.

If a new red or yellow message appears, read it: it tells you the file, the
line, and usually the fix. A missing comma is the most common cause.

**Done when:** the level loads with no red box, grabbing the heart gives you
one more life (watch the hearts at the top), and you reach the flag.

**Think about it:** sentries can't be stomped. There are at least two
different ways to get past them. Can you find both?

---

## Challenge 2: Fixer Upper

*You work in: `student/levels.js`, the map only.*

```js
  {
    name: "Challenge 2: Fixer Upper",
    map: `
................................................
................................................
................................................
................................................
................................................
............................................###.
............................................#G#.
..................o.o.o.....................###.
.................=======........................
.........####............................====...
.........#o##...................................
.PE......####.......................ooo.........
#####################......#####################
#####################......#####################
#####################......#####################
#####################......#####################
#####################..*...#####################
################################################
`,
  },
```

Playtesters sent in four reports about this level:

1. "I lose a life the moment I start."
2. "The treasure counter is stuck at 7 of 8. I can see the last coin, but I
   can't get to it."
3. "I jumped down to get the gem, and then I was stuck. I had to restart."
4. "I can see the flag, but I can't touch it."

Fix all four by editing the level's map. Rules:

- Keep every coin and gem in the level. Moving one is fine; deleting one isn't.
- Keep the pit with the gem in it. Give the player a way back out instead.
- Don't change `tuning.js` for this one. The level has to work with the default
  numbers.

Tips: each character is one block. Count columns carefully. If you type a
character the game doesn't know, the red box shows you the exact row and
column. Press `H` in the game to see the outline of everything.

**Done when:** you finish the level with all 8 treasures, and the **Level
complete!** banner says **+500 all-treasure bonus**.

*True story: problem 3 was in an early version of this game's level 2. It was
caught by playtesting before you got the game.*

---

## Challenge 3: The Wall

*You work in: `student/tuning.js`.*

```js
  {
    name: "Challenge 3: The Wall",
    map: `
..............................
..............................
..............................
..............................
..............................
..............................
....................######..G.
....................##########
....................##########
....................##########
....................##########
.P..o.o.o...........##########
##############################
##############################
`,
  },
```

The flag is on top of a wall 6 blocks tall. A normal jump reaches about 4.

**Rule: change exactly one number in `tuning.js`.** Press `T` to open the tuning
panel and experiment with the sliders. When you find a number that works,
write it into `tuning.js` (slider changes disappear when you reload).

**Done when:** you reach the flag with exactly one number changed from the
defaults. Commit with a message that names it, like
`Challenge 3: GRAVITY from 1800 to 1500`.

**Bonus:** at least three different single numbers can get you over this wall.
Find a second one. Then decide which one you'll keep.

---

## Challenge 4: Low Ceiling

*You work in: `student/tuning.js`.*

```js
  {
    name: "Challenge 4: Low Ceiling",
    map: `
................................................
................................................
................................................
................................................
................................................
...........###################..................
...........^^^^^^^^^^^^^^^^^^^..................
................................................
................................................
................................................
.P.......................o..................G...
##################.......#######################
##################.......#######################
`,
  },
```

A wide gap with spikes overhead. Touch the spikes and you lose a life.

**Rule: one `tuning.js` must beat both The Wall and Low Ceiling.** Keep your
Challenge 3 change and try this level. If it doesn't work, figure out why, and
change what you need to.

**Done when:** with the same `tuning.js`, you can finish both Challenge 3 and
Challenge 4. Screenshot both. Commit with a message that lists your numbers.

**Par is 1.** It's possible to beat both levels with just one number changed
from the defaults. Hitting par is not required. It's for bragging rights.

<details>
<summary>Stuck? Open for a hint.</summary>

The spikes limit how high you can go. That limits how long you can stay in
the air. So jumping higher can't help here. What else would get you across
the gap in the same amount of time?

</details>

---

## Bonus Challenge 5: Make one for a teammate

Build a level that can only be beaten after changing exactly **one** number in
`tuning.js`. Make sure it's fair: no hidden traps, and the right fix should
feel like an "aha," not a guess.

Copy one of the challenge blocks above as your starting shape, change the
name to `"Challenge 5: ..."`, and draw your own map. Test it yourself, then
send the block to a teammate. They paste it in and try to solve it.

---

## When you're done

- Commit and **Sync** (or upload to the `challenge` branch).
- On GitHub, the branch button lets you switch between `main` and `challenge`.
  Look at both. `main` is untouched: that's what a branch is for.
- **Optional:** if you'd like the challenges in your live game, open a **pull
  request** from `challenge` into `main` and merge it. Set `START_LEVEL` back
  to 1 first, so your game still starts at the beginning. (Next week's project
  uses pull requests for real.)

Then go on to the bug hunt and the reflection in the assignment.

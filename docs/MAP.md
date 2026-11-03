# Map of the codebase

A tour of every file: what it does, and how the pieces talk to each other.
You don't need to understand the engine files to do the assignment. This map
exists so the project doesn't feel like a black box.

```
platformer/
├── index.html           the page; loads every other file, in order
├── README.md            start here
├── student/             ← YOUR FILES
│   ├── tuning.js        numbers: how movement feels
│   ├── levels.js        the levels, drawn as text
│   ├── entities.js      enemies, pickups, and the map LEGEND
│   └── theme.js         colors
├── engine/              ← the machinery (about 1,600 lines)
│   ├── errors.js        turns crashes into friendly messages
│   ├── spec.js          what the engine expects your files to contain
│   ├── validate.js      checks your files against spec.js before starting
│   ├── input.js         the keyboard
│   ├── sfx.js           sound effects, made from tones (no audio files)
│   ├── world.js         turns map text into tiles; stops things passing through walls
│   ├── actors.js        the player, enemies and pickups: how they move and touch
│   ├── render.js        drawing everything, 60 times a second
│   ├── panel.js         the tuning panel (press T)
│   ├── game.js          the main loop: levels, score, lives, winning and losing
│   └── style.css        how the page around the game looks
└── docs/
    ├── MAP.md           you are here
    └── IDEAS.md         optional bigger features
```

## The big idea: description vs. machinery

Your four files contain **no instructions**, only **descriptions**:

```js
walker: {
  movement: "patrol",
  speed: 60,
  ...
}
```

The engine reads each description and does the work. `actors.js` has the
code for *what patrolling means*. `entities.js` only says *this enemy
patrols, at 60 pixels per second*. Add a new description and you get a new
enemy, without writing a single instruction.

Real software is built this way constantly. Settings pages, game mods, website
content and spreadsheet formulas all separate *what you want* from *how it
gets done*. It's also why you can change this game safely: the descriptions
are small, and the engine checks them.

## What happens when you open the page

1. `index.html` loads the files in the order listed inside it.
2. `errors.js` loads first, so it can catch a mistake in any later file.
3. Your four files load. Each one sets up a named list: `TUNING`, `LEVELS`,
   `ENEMY_TYPES`, `PICKUP_TYPES`, `LEGEND`, `THEME`.
4. The engine loads.
5. `validate.js` checks everything in your files. A problem gets a red or
   yellow message instead of a crash.
6. `game.js` builds level 1 from its text map and starts **the loop**.

## The loop

About 60 times every second, `game.js` does the same steps:

1. **Read input.** Which keys are down right now? (`input.js`)
2. **Update.** Move the player using the numbers in `TUNING`, move every
   enemy according to its description, and check what's touching what.
   (`actors.js`, `world.js`)
3. **Draw.** Paint the sky, hills, tiles, pickups, enemies, player and score,
   in that order, back to front. (`render.js`)

Then it waits for the next frame and does it again. Every video game you've
played runs a loop like this. Each pass is one "frame."

## Things you've seen before in this course

- **Fetch, decode, execute.** The game loop is the same shape as the CPU's
  cycle: get the next thing, work out what it means, do it, repeat, millions
  of times without getting bored.
- **Memory vs. storage.** Tuning-panel sliders change values in memory (RAM).
  Reload, and they're gone. Values written into `tuning.js` and saved are in
  storage, and they survive. Same lesson as "unsaved changes."
- **Meaning comes from an agreed code.** A `#` in a level map isn't a wall.
  It's a character. It only becomes a wall because the `LEGEND` says so.
  That's the same idea as ASCII, where the byte `0x41` is only "A" because
  everyone agreed it would be.
- **Hex.** Every color in `theme.js` is three hex numbers: red, green, blue.
  `"#ff8800"` is red `ff` = 255, green `88` = 136, blue `00` = 0.
- **The OS routes your input.** Your keystrokes reach this game only because
  the operating system knows which window you clicked last. Click somewhere
  else and the game stops hearing you.
- **Don't trust input.** `validate.js` checks everything in your files before
  using it, exactly as a website should check what people type into a
  search box. The engine assumes the data might be wrong.
- **Abstraction.** You add an enemy without knowing how collision works.
  Someone hid that complexity behind a simple description, the same way the
  internet hides routing behind a web address.

## Following one jump through the code

What happens, in order, when you press <kbd>Space</kbd>:

1. The operating system sends the keypress to the browser, and the browser
   sends it to the page.
2. `input.js` notes "jump was pressed."
3. On the next frame, `actors.js` asks: is the player on the ground? Or did
   they *just* leave it, within `COYOTE_TIME`? If yes, it sets the player's
   upward speed to `JUMP_VELOCITY`.
4. Every frame after that, `GRAVITY` pulls that speed back down. Near the top
   of the jump, gravity is multiplied by `APEX_GRAVITY_MULT` for a little
   hang time.
5. If you let go of the key early, speed is cut by `JUMP_RELEASE_CUT`, which
   makes a short hop.
6. `world.js` moves the player a little at a time and stops them at any solid
   tile.
7. `render.js` draws the player at the new position, stretched slightly while
   rising and squashed on landing.

Five numbers from your `tuning.js` were used, and you never saw any of the
code that uses them.

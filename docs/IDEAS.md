# Going further (optional)

Everything here is **optional**. The assignment can be completed in full
without anything on this page, and without using AI at all.

These ideas are for when you've finished the seven holes and want more. Some you
can do with what you already know. Others need changes to the engine, which is
where an AI assistant can help, as long as **you stay in charge of checking
its work**.

---

## No new skills needed

- **Another level.** Copy the whole `{ name: ..., map: ... }` block in
  `levels.js` and paste it after the last one. Levels play in list order.
- **A hard mode.** Find tuning that makes the game *fair but hard*. Write down
  why each number makes it harder. This is a real game-design job.
- **An enemy zoo.** Make one enemy for each `movement` type, each with its own
  personality: fast tiny chasers, huge slow walkers, hoppers that jump every
  0.3 seconds.
- **A themed game.** Pick a setting (underwater, space, a haunted house) and
  make the colors, enemy names, pickup names and level names match it.

---

## With an AI assistant

### Rules for working with AI on code

1. **Commit first.** Save a snapshot of a working game before you change
   anything, so you can always get back.
2. **Give it context.** It hasn't seen this project. Tell it the game is a
   browser platformer made of plain JavaScript files with no libraries. Paste
   in the file or files it needs to see, and say which files you're allowed to
   change.
3. **Ask it to explain before you accept.** "Before you change anything, tell
   me which files you'll change and why." If you can't follow the
   explanation, ask again until you can.
4. **Test it yourself.** Use the "check it" list for each idea. The AI can't
   play your game. You can.
5. **Commit with an honest message**, like `Add bounce pads (AI-assisted)`. If
   it broke something, undo it and try again with a clearer request.

You're responsible for every line in your repository, whoever typed it.

### Ideas

**Bounce pads** · easier
A new tile, maybe `!`, that launches you high into the air when you land on it.
> Prompt idea: *"This is a browser platformer. Levels are text maps; LEGEND in
> entities.js maps characters to tiles. Tile behavior is in engine/world.js
> and engine/actors.js (pasted below). I want a new tile called 'bouncer'
> that sets the player's upward speed to 900 when they land on it. Explain
> what you'll change first."*
>
> Check it: lands and bounces · can't bounce from the side · still works with
> double jump on · validate.js doesn't complain about the new tile name.

**Checkpoints** · medium
Touch a flag in the middle of a level, and you respawn there instead of at the start.
> Check it: respawn location changes after touching it · coins you collected
> before the checkpoint stay collected (or not: you decide which is better,
> and why) · restarting with R still goes back to the start.

**Best time that survives a reload** · medium
Show your fastest time for each level, even after you close the tab.
> Hint: ask about `localStorage`. This is the memory-vs-storage lesson again:
> the score lives in memory, but a best time has to go somewhere permanent.
>
> Check it: beat a level, reload, the time is still there · a slower run
> doesn't replace a faster one.

**Dash** · medium
Press Shift for a quick burst of sideways speed, once per jump.
> Check it: works in the air · only once until you land · has a tuning number
> in `tuning.js` and appears in the tuning panel.

**Wall jump** · harder
Jump off walls by pressing jump while sliding against one.
> Check it: can't climb a single wall forever (or can you? decide) · doesn't
> trigger when standing next to a wall on the ground.

**Title screen** · medium
A start screen with your game's name that waits for Enter.

**Moving platforms** · harder
Ledges that slide back and forth, and carry the player with them.
> This one is genuinely tricky for professionals too. The hard part is making
> the player move *with* the platform.

---

## When the AI's change doesn't work

That's normal, and it's useful. Describe exactly what you see, the way you would in
a bug report: what you did, what you expected, what happened instead, and any
red error box text. Vague requests ("it's broken, fix it") get vague fixes.
Precise ones get precise fixes. This skill is the same whether you're talking
to an AI, a teammate or a customer.

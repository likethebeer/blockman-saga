# ROADMAP.md — Blockman: next steps & analysis

This is the "what to do next and why" companion to `CLAUDE.md`. It's opinionated and
ranked. The organizing principle up front, because it changes how you should read the
rest:

> **Building is not the bottleneck. Distribution is.**
> This game already exists, is finished, polished, and now mobile-playable. A second
> finished project (Recurventory) exists too. The proven-twice skill is *building*. The
> unpracticed muscle is *getting a finished thing in front of strangers and iterating on
> what comes back.* Almost everything below is sorted by that lens: how much does it move
> the game toward, or improve its odds with, actual players who aren't your friends.

---

## Just shipped (v0.07.01)

- **Mobile/tablet touch controls + tap-to-start.** The game is now playable on a phone,
  which is where most casual web-game traffic lives. This was the single biggest
  *reach* unlock, and it's done.

---

## Tier 1 — Do these next (highest impact-to-effort)

### 1. Put it on itch.io  ← the real one
itch.io is purpose-built for browser games and people **browse it actively looking for
games to play**. That is a strangers channel, and it's far lower-stakes than promoting
anything tied to Recurventory.

- Zip the game folder (exclude `node_modules`, `package.json`, `*.md`, `*.zip` source
  assets you don't ship).
- Create a project, set it to **HTML**, upload the zip, tick "This file will be played
  in the browser," set the viewport to roughly the game's fixed size.
- Add 3–4 screenshots, a short GIF of gameplay, and a one-paragraph pitch.
- Price: free, with "donations enabled" optional.

Why first: nothing else on this list matters if no stranger can reach the game. Touch
controls were the *enabler*; this is the *door*.

### 2. Add "juice" (game feel)
Cheap to build, disproportionate effect on how professional it feels the next time
someone picks it up. You already have the right instinct here (screen shake, the red
damage flash, the win fireworks). Extend it:

- **Hit-pause:** freeze the loop for ~50ms on a hazard hit. Massively increases impact.
- **Floating score popups:** spawn a small `+5` / `+20` that drifts up and fades on
  collection. Reuse the firework canvas or simple DOM elements.
- **Collection particle burst:** a few particles when a crate is caught (you already
  have a particle system in `triggerFirework`/`animateFireworks` to borrow from).
- **Subtle squash/scale** on the player when boosting or landing.

### 3. Balance pass
- **Clamp escalation.** `escalateDifficulty()` multiplies `spawnMin`/`spawnMax` by `0.7`
  every 15s with no floor → intervals trend to zero and late game becomes impossible in
  an un-fun way. Add a minimum (e.g. don't let `spawnMin` drop below ~250ms).
- Re-tune `supplies` (needs 8 vs 5 for others) so the win condition doesn't bottleneck
  on one resource.

---

## Tier 2 — Code health (do alongside Tier 1, not before shipping)

These make the game easier to extend and are the difference between "I can build a
game" (proven) and "I can grow a codebase." None of them block shipping.

- **Migrate rendering to `<canvas>`.** This is the big one and the natural "next level."
  Right now every crate/hazard/drone is a DOM `<img>` and collisions call
  `getBoundingClientRect()` every frame, which thrashes layout. The ceiling is a few
  hundred objects. You've *already* used canvas for the fireworks — so the pattern is
  familiar. The migration, roughly:
  1. Keep game state as **plain objects** (`{x, y, vx, vy, type, w, h}`), not DOM nodes.
  2. One canvas; clear and redraw each frame in the existing loop.
  3. Replace `getBoundingClientRect()` collisions with simple AABB math on those numbers
     (cheap, and you already wrote AABB logic in `detectCollision`).
  4. Draw sprites with `ctx.drawImage`, preloaded into an `Image` cache.
  Do it incrementally — e.g. move falling objects to canvas first, leave the player/HUD
  as-is, then converge.
- **Split `main.js`.** Pull cohesive systems into their own files like you did with
  `boost.js`: e.g. `audio` (already), `spawning.js`, `scoring.js`, `entities.js`,
  `ui-overlays.js`. Smaller files, clearer ownership.
- **Config object for magic numbers.** Gravity, boost power, spawn bounds, damage,
  resource targets, cooldowns → one `CONFIG` object. Makes balancing a one-file job.
- **Cleanup:** remove leftover `console.log`s; fix the no-op `console.log*(...)` typo in
  `startGame()`; reconcile `audio.js`'s `window.gameOn` with `isGameOn`; address your own
  listed bugs (key-casing, the "enter" bug, eaz-mode).

---

## Tier 3 — Content & features (the fun pile)

Your `Enhancement ideas.txt` is genuinely good. Here's how I'd prioritize that list by
**player-retention-per-unit-effort**, not by how fun they are to build:

**High value, reasonable effort**
- **Achievements** (#11) — cheap to add, strong retention hook ("destroy 10 hazards
  without missing"). Pairs perfectly with the leaderboard you already have.
- **Power-ups** (#14) — temporary shields, rapid-fire, magnet-for-resources. High
  moment-to-moment fun, modular to implement.
- **Health/shield system** (#10) — you already have health; a pickup-based shield is a
  small extension.
- **Sprite sheets** (#17) — enables real animation cheaply and is a prerequisite for the
  canvas migration paying off visually.

**High value, higher effort**
- **Boss fight** (#6) / **mini-bosses with health-pack drops** (#19) — you already have
  the drone as a foundation. A real boss is a great "Level 2" capstone and a reason to
  come back. Build *after* the canvas migration so it performs.
- **Waves / environment effects** (#15) — wind while boosting, laser jammed, etc. Adds
  variety; needs the difficulty system generalized first.

**Lower priority (fun but not retention-moving yet)**
- Directional/mouse laser (#7), dash (#8), ground/rolling/exploding hazards (#3–5),
  gamma-wave safe-zones (#18), character strengths/unlocks (#12–13). All good — but
  these are polish on a game strangers can't find yet. Hold until Tier 1 is done.

**Deliberately defer**
- **Login / accounts / server-side stats** (#16). This is a tar pit for a solo dev and
  adds backend surface area, security, and maintenance for little early payoff. The
  `localStorage` leaderboard is the right call until you have players asking for it.

---

## Distribution channels (after itch.io)

Sorted by fit for a finished arcade web game:

1. **itch.io** — primary. (Tier 1.)
2. **Reddit, where "show me your game" is the norm:** r/WebGames, r/playmygame,
   r/IndieGaming, r/incremental_games (if you lean into the loop). Post a GIF, a one-line
   pitch, and the link. Engage in the comments — don't drive-by.
3. **Newgrounds / CrazyGames / GameJolt** — additional browser-game catalogs with
   built-in audiences.
4. **A short gameplay GIF on social** (the firework win moment is your hook).
5. **Game jams** — even retroactively, jam communities are generous playtesters. A future
   game built *for* a jam comes with an audience attached.

The point of listing these isn't "do all of them." It's that the work that's actually
been avoided — twice now — is this column, not the build column. One honest week of
column-two effort will teach you more about your real bottleneck than another month of
features.

---

## The honest throughline

You don't need permission to believe you can build. You've shipped a polished game and a
live web app solo, self-taught. The thing that's hard for you isn't on the keyboard —
it's the discomfort of pushing a finished thing toward people who owe you no kindness and
watching what comes back. Touch controls + itch.io is the smallest possible rep of that
exact muscle, on the lowest-stakes project you have. That's why it's at the top.

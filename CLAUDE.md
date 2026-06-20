# CLAUDE.md

Context for AI assistants (and humans) working on this repo. Read this first.

---

## What this is

**Rain of Pain: The Blockman Sagas** — a browser arcade game. The player pilots a
character with a jetpack, catching falling resource crates (fuel / food / supplies)
while dodging hazards. Collect enough of all three to win; run out of health and you
lose. There's a combo/streak scoring system, an escalating difficulty curve, a
spotlight "lightning" attack that punishes camping, and a drone mini-boss.

- **Author:** Mike Olson (© 2024)
- **Current version:** `0.07.01` (tracked in `change_log.txt` and the `#game-version`
  span in `index.html` — keep both in sync)
- **License:** MIT for code, CC BY-NC 4.0 for assets/story (see `LICENSE` and the
  in-game About overlay)

## Tech stack

Vanilla JavaScript, HTML, and CSS. **No build step, no framework, no bundler, no npm
runtime deps.** It runs by opening `index.html` directly, though a static server is
better (audio autoplay + relative asset paths behave more predictably):

```bash
# from the repo root
python3 -m http.server 8000   # then open http://localhost:8000
```

> Note: a `package.json` / `node_modules` may appear locally if someone ran a test
> harness (e.g. jsdom). Those are dev-only and are git-ignored — they are **not** part
> of the game.

## File map

| File | Role |
|------|------|
| `index.html` | DOM structure: overlays (title, welcome, instructions, mission, leaderboard, about, pause, game-over), HUD, sidebar, and the touch-control buttons. Loads the scripts at the bottom **in order**. |
| `main.js` | The whole game: state, game loop, movement, spawning, collisions, scoring, drone/spotlight, leaderboard, overlays. ~1650 lines. |
| `boost.js` | `BoostModule` — the jetpack fuel object (`boostJuice`, `spendPower`, `recoverPower`). Loaded before `main.js`. |
| `audio.js` | Silent-sound keepalive helpers (mostly dormant — see Gotchas). |
| `touch-controls.js` | Mobile/tablet support. Loaded **after** `main.js`. See below. |
| `styles.css` | Layout, HUD, overlays, touch-control styling. |
| `animations.css` | Keyframe animations (falling object spin/wiggle, countdown, etc). |
| `imgs/`, `sounds/` | Sprites and audio. |
| `change_log.txt` | Versioned dev journal. **Append an entry for every meaningful change.** |
| `Enhancement ideas.txt` | Mike's running idea/bug list. |
| `ROADMAP.md` | Prioritized next steps + technical analysis. **Read this for "what to do next."** |

## Script load order matters

`index.html` loads: `audio.js` → `boost.js` → `main.js` → `touch-controls.js`.
Everything shares one global scope. `touch-controls.js` depends on globals defined in
`main.js` (`keysPressed`, `updateBoostState`, `callManualPause`, `beginGameFromTitle`,
`isGameOn`, `isGameOver`), so it **must** stay last.

## How the game works (key concepts)

- **State is global.** `main.js` keeps everything in module-level `let`/`const`:
  `isGameOn`, `isGameOver`, `isGamePaused`, `playerScore`, `collectedResources`,
  `fallingObjects[]`, `drones[]`, `lasers[]`, `escalationLevel`, etc. There is no
  encapsulation layer; functions read and mutate these directly.
- **The game loop** is `gameLoop(currentTime)`, driven by `requestAnimationFrame`. It
  uses **delta-time** movement (frame-rate independent) — preserve this when touching
  movement code. It reads input from the `keysPressed` map, moves objects, runs
  collisions, and checks win/lose.
- **Input** is a `keysPressed` object set by `keydown`/`keyup`. Controls: arrows = move,
  `ArrowUp` = boost, `e` = laser, `Space` = pause, `Enter` = start. (Touch input simply
  flips the same flags — see below.)
- **Spawning** (`spawnFallingObject`) picks a resource/hazard type using per-type
  cooldowns, assigns a sprite, drop speed, and horizontal drift. Objects are **DOM
  `<img>` elements** appended to `#game-container`; collisions use
  `getBoundingClientRect()` each frame.
- **Difficulty** scales two ways: a per-run multiplier (`easy` 1 / `medium` 1.25 /
  `hard` 1.75) and a time-based `escalateDifficulty()` every 15s that tightens spawn
  intervals, then adds the spotlight attack (level 2) and the drone (level 3+).
- **Audio** uses a `sounds` map → `soundObjects`, with `playSound()` and
  `playRandomSound(category)` for randomized variants.
- **Persistence:** high scores live in `localStorage` under the key
  `blockmanHighScores` (top 5, `{name, score, character}`).

## Touch controls (added v0.07.01)

`touch-controls.js` makes the game playable on phones/tablets **without changing the
game loop**. The design principle: a touch *acts like a held key*.

- It only activates if the device has touch (`'ontouchstart' in window`). Desktop is
  untouched.
- On-screen buttons (`#touch-left/right/boost/fire/pause` in `index.html`) flip the same
  `keysPressed` flags the keyboard uses, and call `updateBoostState()` for boost.
- The title screen says "PRESS ENTER" — phones have no Enter key, so a tap on
  `#game-title` calls `beginGameFromTitle()` (the start logic, extracted from the Enter
  handler in `main.js` so both paths share it).
- Buttons are revealed only during play via `body.playing` (added in `startGame`,
  removed in `gameOver`). z-index sits below the pause/game-over overlays (500/900) so
  those screens cover the buttons.
- A `touchend`-with-zero-fingers safety net clears any stuck direction.

To test on desktop: Chrome DevTools (F12) → device toolbar → reload.

## Conventions

- **Append to `change_log.txt`** with a `MM.MM.PP`-style version line for every change,
  and bump `#game-version` in `index.html`.
- **New, self-contained behavior goes in its own file** (like `boost.js`, `audio.js`,
  `touch-controls.js`) rather than growing `main.js`.
- Keep movement **delta-time based**.
- Reuse the existing `keysPressed` / `playSound` / `showOverlay` plumbing instead of
  adding parallel systems.

## Gotchas / known rough edges

- **DOM-based objects + per-frame `getBoundingClientRect()`** is the main performance
  ceiling. Fine at current object counts; will not scale to hundreds. (Migration path in
  `ROADMAP.md`.)
- **One big `main.js`** mixing logic/render/audio/UI. Splitting is encouraged.
- `audio.js` checks `window.gameOn`, but the real flag is `isGameOn` — the silent-sound
  keepalive is effectively dormant. Harmless, but a latent bug if you rely on it.
- `escalateDifficulty()` multiplies spawn bounds by `0.7` every 15s **with no floor**, so
  late-game spawn intervals trend toward zero. Consider clamping.
- Leftover `console.log`s throughout; one typo'd `console.log*(...)` in `startGame()` is
  a no-op.
- See `Enhancement ideas.txt` for Mike's own bug list (key-casing, the "enter" bug,
  eaz-mode tweaks).

## What to do next

See **`ROADMAP.md`** — it ranks improvements by impact, lays out the canvas-migration
path, and is honest about where the real bottleneck is (distribution, not code).

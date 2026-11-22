# Last Car to Dawn

[![make.fun · best-heist-game-20261122-0559](https://make.fun/badge/best-heist-game-20261122-0559.svg)](https://make.fun/bounty/best-heist-game-20261122-0559?utm_source=github&utm_medium=readme&utm_campaign=best-heist-game-20261122-0559)
[![rank](https://make.fun/badge/best-heist-game-20261122-0559/robbyensoe/last-car-to-dawn/rank.svg)](https://make.fun/bounty/best-heist-game-20261122-0559/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-heist-game-20261122-0559)
[![reward](https://make.fun/badge/best-heist-game-20261122-0559/robbyensoe/last-car-to-dawn/reward.svg)](https://make.fun/bounty/best-heist-game-20261122-0559?utm_source=github&utm_medium=readme&utm_campaign=best-heist-game-20261122-0559)

A top-down heist in three scores, played in one night by a woman taking her
name back.

Mara Venn kept the night trains safe — until the night she was framed for
robbing one. The proof that clears her sits in three rooms, and she has until
dawn: **the Evidence Ledger** from the mail car of the moving *Sable
Meridian*, **the Black-Chip Reserve** from the *Gilded Mirage* casino that
laundered the take, and **the Master Key** from the *Astral Crown* penthouse
above it. Her getaway is a service tram that looks like nothing at all.

## The building remembers

Most heist games have one meter. This one has a memory:

- **ALARM** is what the building feels right now. It drains when you are
  unseen; at 100 the tram seals for 12 seconds and a getaway clock starts.
- **EVIDENCE** is what the building *remembers*. It never drains inside a
  score. Being seen, crossing a laser, lifting loot from a lit pedestal — all
  of it is written down. At **25** you are NOTICED (patrols quicken), at
  **50** IDENTIFIED (cameras sharpen, cover stops hiding you), at **75** the
  tram refuses to open: MANHUNT, until you clean the record.
- **HEAT** is what follows you. Half of each score's evidence walks into the
  next building with you — extra wardens, cameras that wake up staring at
  the prize, thinner tools, shorter lockdown clocks — and it *pays*: the
  night's total is multiplied by `1 + heat/200`. Greed is a strategy.

## Systems

- **Radios.** A warden who makes you out winds up a call (watch the jade
  ring). When it lands, every warden nearby turns toward your last position.
  A blackout eats the call.
- **The cleaner.** Stand in a camera's blind disc and hold C to wipe 20
  evidence off the record — once per score, unless style buys you glory
  instead.
- **Decoy bags.** Drop a bag (X) and a warden will check it; a cleared decoy
  quietly erases a little of your past.
- **Three rooms, three rules.** The train *sways* every twenty seconds —
  move with the jolt and it swallows your steps. The casino runs on
  *wardrobes*: swap faces in the closets (F) — a GUEST is barred from the
  cage, a DEALER may pass but never hurries and never touches chips. The
  penthouse atrium is a *glass floor* that creaks under a standing thief.
- **Style is scored.** Near-misses, ghosting a camera fan, threading a laser
  sneaking, wiping every record — the routes out are graded GHOST,
  PROFESSIONAL and SHOWMAN, and the night ends in a rank.

## Play

Open `game/index.html` in a browser — no build, no dependencies.

WASD / arrows move · **Shift** sneak · **E** blackout pulse · **X** drop a
bag · **C** wipe the record (in a camera's blind disc) · **F** swap disguise
· **Enter** advance. Sound is synthesized live: the train keeps time at
92 BPM, the slots sparkle in the next room, and a heartbeat follows the
nearest suspicious mind.

## Screenshots

- `screenshots/cover.jpg` — the Gilded Mirage floor: ivory at the rim of a
  warden's cone, the cage camera fanning toward the reserve, both meters
  alive.
- `screenshots/near-miss.jpg` — the Sable Meridian mail car: alarm at 64,
  evidence past IDENTIFIED, the ledger behind its crossbeam.
- `screenshots/dawn.jpg` — the night totalled: three scores, heat paid, the
  name cleared.

## Layout

- `main.ts` — the dossier program: preflight, then assembly.
- `game/` — the game itself (plain ES modules, canvas 2D, WebAudio).
- `screenshots/` — the three frames above, staged deterministically by
  `game/src/shots.js`.

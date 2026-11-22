// LAST CAR TO DAWN — the simulation.
// Mara Venn, a rail-security inspector framed for the robbery she tried to
// stop, takes back the proof in one night: the ledger from a moving train,
// the black-chip reserve from the casino that laundered it, and the master
// key from the penthouse above. The buildings remember: EVIDENCE never
// drains inside a score, and HEAT follows her to the next one.

import { VIEW_W, VIEW_H, THIEF, WARDEN, EYE, METERS, PROOF, TOOLS } from './config.js';
import { clamp, dist, angDiff } from './random.js';

const rect = (x, y, w, h) => ({ x, y, w, h });
const box = (x, y, w, h) => rect(x, y, w, h); // low cover: blocks sight, not steps? no — blocks both, low

// ---------------------------------------------------------------- levels
// Cars, floors and atriums are all just rooms; what changes is the rule the
// room plays by: sway (train), wardrobe (casino), glass (penthouse).
function levelTrain() {
  return {
    name: 'I. THE SABLE MERIDIAN', prizeName: 'THE EVIDENCE LEDGER', par: 150,
    rule: 'sway',
    walls: [
      // car dividers (vestibules) with a centre door gap
      rect(228, 40, 14, 250), rect(228, 350, 14, 250),
      rect(462, 40, 14, 250), rect(462, 350, 14, 250),
      rect(696, 40, 14, 250), rect(696, 350, 14, 250),
      rect(930, 40, 14, 250), rect(930, 350, 14, 250),
      // sleeper bunks (car 2) and luggage racks (car 4)
      box(268, 92, 150, 26), box(268, 522, 150, 26),
      box(736, 92, 150, 26), box(736, 522, 150, 26),
      // mail-car crates
      box(972, 110, 120, 30), box(972, 500, 120, 30),
    ],
    covers: [rect(60, 300, 90, 40), rect(500, 300, 90, 40), rect(980, 300, 90, 40)],
    wardens: [
      { path: [[70, 320], [1090, 320]], kind: 'warden' },                    // the conductor, end to end
      { path: [[300, 70], [420, 70], [420, 320], [300, 320]], kind: 'warden' }, // sleeper patrol
      { path: [[990, 180], [1090, 180], [1090, 460], [990, 460]], kind: 'warden' }, // mail-car guard
    ],
    eyes: [
      { x: 585, y: 44, base: Math.PI / 2, phase: 0.4 },   // car 3 vestibule chokepoint
    ],
    beams: [
      { x1: 1004, y1: 236, x2: 1004, y2: 404, high: false, phase: 1.2 }, // mail-car crossbeam
    ],
    loots: [
      { x: 340, y: 84, v: 300, lit: true }, { x: 820, y: 556, v: 350, lit: true },
      { x: 560, y: 320, v: 250, lit: false }, { x: 1010, y: 84, v: 450, lit: true },
    ],
    prize: { x: 1108, y: 320, v: 2400 },
    start: { x: 52, y: 320 }, exit: { x: 34, y: 320, w: 30, h: 92 },
    closets: [], glass: null,
    blackouts: 2,
  };
}

function levelCasino() {
  return {
    name: 'II. THE GILDED MIRAGE', prizeName: 'THE BLACK-CHIP RESERVE', par: 210,
    rule: 'wardrobe',
    walls: [
      // slot banks along the top, the bar left, the cashier cage right
      box(120, 66, 200, 30), box(400, 66, 200, 30), box(680, 66, 200, 30),
      rect(36, 200, 90, 240),                                   // bar block
      rect(1010, 150, 14, 140), rect(1010, 350, 14, 140),       // cage front (staff door gap)
      rect(1010, 150, 134, 14), rect(1010, 476, 134, 14),
      // gaming tables as low cover rows
      box(300, 220, 110, 44), box(520, 220, 110, 44), box(740, 220, 110, 44),
      box(300, 420, 110, 44), box(520, 420, 110, 44), box(740, 420, 110, 44),
    ],
    covers: [rect(180, 330, 60, 30), rect(880, 330, 60, 30)],
    wardens: [
      { path: [[250, 180], [900, 180], [900, 500], [250, 500]], kind: 'warden' },  // floor loop
      { path: [[140, 130], [880, 130]], kind: 'warden' },                          // slot-bank guard
      { path: [[960, 320], [960, 540], [1080, 540]], kind: 'boss' },               // the pit boss
    ],
    eyes: [
      { x: 590, y: 40, base: Math.PI / 2, phase: 2.1 },   // over the tables
      { x: 1144, y: 320, base: Math.PI, phase: 0 },       // inside the cage, on the prize
    ],
    beams: [],
    loots: [
      { x: 220, y: 84, v: 400, lit: true }, { x: 790, y: 84, v: 400, lit: true },
      { x: 355, y: 242, v: 250, lit: false }, { x: 795, y: 442, v: 300, lit: false },
      { x: 90, y: 556, v: 500, lit: true },
    ],
    prize: { x: 1100, y: 320, v: 3600 },
    start: { x: 52, y: 320 }, exit: { x: 34, y: 270, w: 30, h: 100 },
    closets: [{ x: 160, y: 580 }, { x: 940, y: 60 }],
    staffZone: rect(1010, 150, 134, 340),   // the cage: dealers only
    glass: null,
    blackouts: 2,
  };
}

function levelPenthouse() {
  return {
    name: 'III. THE ASTRAL CROWN', prizeName: 'THE MASTER KEY', par: 270,
    rule: 'glass',
    walls: [
      // rooms around a central atrium
      rect(330, 40, 14, 200), rect(330, 400, 14, 200),
      rect(836, 40, 14, 200), rect(836, 400, 14, 200),
      rect(344, 200, 180, 14), rect(656, 200, 180, 14),
      rect(344, 426, 180, 14), rect(656, 426, 14 + 166, 14),
      box(90, 110, 130, 30), box(960, 110, 130, 30),       // study / bedroom shelves
      box(90, 500, 130, 30), box(960, 500, 130, 30),       // kitchen / lounge units
    ],
    covers: [rect(120, 300, 70, 40), rect(990, 300, 70, 40)],
    wardens: [
      { path: [[180, 90], [1000, 90], [1000, 550], [180, 550]], kind: 'warden' },  // the butler's loop
      { path: [[420, 320], [760, 320]], kind: 'warden' },                          // atrium crosser
      { path: [[590, 90], [590, 240]], kind: 'boss' },                              // the bodyguard checks the pedestal
    ],
    eyes: [
      { x: 590, y: 596, base: -Math.PI / 2, phase: 1.0 },  // over the atrium's south door
    ],
    beams: [ // the laser ring around the pedestal
      { x1: 545, y1: 275, x2: 635, y2: 275, high: false, phase: 0 },
      { x1: 545, y1: 365, x2: 635, y2: 365, high: false, phase: 0.8 },
      { x1: 545, y1: 275, x2: 545, y2: 365, high: false, phase: 1.6 },
      { x1: 635, y1: 275, x2: 635, y2: 365, high: false, phase: 2.4 },
    ],
    loots: [
      { x: 150, y: 84, v: 450, lit: true }, { x: 1030, y: 84, v: 450, lit: true },
      { x: 150, y: 580, v: 350, lit: false }, { x: 1030, y: 580, v: 500, lit: true },
    ],
    prize: { x: 590, y: 320, v: 5200 },
    start: { x: 52, y: 320 }, exit: { x: 34, y: 270, w: 30, h: 100 },
    closets: [], glass: rect(360, 220, 460, 200),  // the creaking glass floor
    blackouts: 1,
  };
}

export const LEVELS = [levelTrain, levelCasino, levelPenthouse];

// ---------------------------------------------------------------- geometry
function segBlocked(x1, y1, x2, y2, walls) {
  // sample the segment; walls are few and the arena is small
  const steps = Math.max(4, Math.ceil(dist(x1, y1, x2, y2) / 9));
  for (let i = 1; i < steps; i++) {
    const t = i / steps, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
    for (const w of walls) {
      if (x >= w.x && x <= w.x + w.w && y >= w.y && y <= w.y + w.h) return true;
    }
  }
  return false;
}
function collide(x, y, r, solids) {
  for (const w of solids) {
    if (x + r > w.x && x - r < w.x + w.w && y + r > w.y && y - r < w.y + w.h) return true;
  }
  return x - r < 8 || x + r > VIEW_W - 8 || y - r < 8 || y + r > VIEW_H - 8;
}
const inRect = (x, y, r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

// ---------------------------------------------------------------- the run
export class Heist {
  constructor(levelIdx, heat, audio) {
    const def = LEVELS[levelIdx]();
    this.def = def;
    this.audio = audio;
    this.heat = heat;
    this.solids = [...def.walls];
    this.time = 0;
    this.phase = 'play'; // play | won | busted
    // the thief
    this.x = def.start.x; this.y = def.start.y;
    this.face = 0; this.sneak = false; this.moving = false;
    this.bags = []; this.hasPrize = false;
    this.disguise = 'guest'; // casino: guest | dealer
    this.swapT = 0;
    // the meters
    this.alarm = 0; this.evidence = 0;
    this.peakAlarm = 0; this.clearT = 0;
    this.lockdowns = 0; this.sealT = 0; this.escapeT = 0;
    this.spotted = 0; this.nearMisses = 0;
    this.style = 0; this.wipes = 0;
    this.blackouts = def.blackouts - (heat >= 60 ? 1 : 0);
    this.darkT = 0; this.cleanerLeft = 1; this.cleanT = 0;
    this.noticedFlags = { n25: false, n50: false, n75: false };
    this.banner = ''; this.bannerT = 0;
    // wardens
    this.wardens = def.wardens.map((w, i) => ({
      x: w.path[0][0], y: w.path[0][1], path: w.path, wp: 1,
      dir: 1, wait: 0, face: i % 2 ? Math.PI : 0,
      meter: 0, mode: 'patrol', lastX: 0, lastY: 0, invT: 0,
      radioT: 0, radioDone: false, flaggedInv: false, flaggedChase: false,
      peak: 0, kind: w.kind,
    }));
    if (heat >= 20) { // the night remembers: one more pair of eyes
      this.wardens.push({
        x: 590, y: 120, path: [[120, 120], [1060, 120], [1060, 520], [120, 520]], wp: 1,
        dir: 1, wait: 0, face: 0, meter: 0, mode: 'patrol', lastX: 0, lastY: 0, invT: 0,
        radioT: 0, radioDone: false, flaggedInv: false, flaggedChase: false, peak: 0, kind: 'warden',
      });
    }
    this.eyes = def.eyes.map((e) => ({ ...e, ang: e.base }));
    if (heat >= 40) for (const e of this.eyes) e.ang = Math.atan2(def.prize.y - e.y, def.prize.x - e.x);
    this.beams = def.beams.map((b) => ({ ...b, wasIn: false }));
    this.loots = def.loots.map((l) => ({ ...l, taken: false }));
    this.prizeTaken = false;
    this.swayT = 0; this.jolt = 0;
    this.stats = { lootValue: 0 };
  }

  get speedMul() { return this.noticedFlags.n25 ? 1.08 : 1; }
  get camMul() { return this.noticedFlags.n50 ? 1.2 : 1; }

  bannerSay(text) { this.banner = text; this.bannerT = 1.4; }

  addEvidence(n, why) {
    const before = this.evidence;
    this.evidence = clamp(this.evidence + n, 0, 100);
    const cross = (t, key, word) => {
      if (before < t && this.evidence >= t && !this.noticedFlags[key]) {
        this.noticedFlags[key] = true; this.bannerSay(word);
        this.audio?.sting('notice');
      }
    };
    cross(PROOF.noticed, 'n25', 'NOTICED');
    cross(PROOF.identified, 'n50', 'IDENTIFIED');
    cross(PROOF.manhunt, 'n75', 'MANHUNT');
  }

  addAlarm(n) {
    this.alarm = clamp(this.alarm + n, 0, 100);
    this.clearT = 0;
    if (this.alarm >= METERS.lockdownAt && this.sealT <= 0 && this.escapeT <= 0) {
      this.lockdowns++;
      this.sealT = METERS.sealSeconds;
      this.escapeT = this.heat >= 80 ? 30 : METERS.escapeClock;
      this.audio?.sting('lockdown');
      this.bannerSay('LOCKDOWN');
    }
  }

  // ------------------------------------------------------------- step
  step(dt, input, sfx) {
    if (this.phase !== 'play') return;
    this.time += dt;
    if (this.bannerT > 0) this.bannerT -= dt;
    if (this.darkT > 0) this.darkT -= dt;
    // train sway: a jolt every ~20 s, 2 s long
    if (this.def.rule === 'sway') {
      this.swayT += dt;
      const cyc = this.swayT % 20;
      this.jolt = cyc > 18 ? Math.sin(((cyc - 18) / 2) * Math.PI) : 0;
    }
    // lockdown clocks
    if (this.sealT > 0) this.sealT -= dt;
    if (this.escapeT > 0) {
      this.escapeT -= dt;
      if (this.escapeT <= 0) { this.phase = 'busted'; sfx.busted(); return; }
    }
    this.moveThief(dt, input, sfx);
    this.sense(dt, sfx);
    this.runWardens(dt, sfx);
    this.runEyes(dt);
    this.runBeams(dt, sfx);
    this.pickups(sfx);
    // alarm drain
    this.clearT += dt;
    if (this.clearT > METERS.drainDelay && this.sealT <= 0) {
      this.alarm = Math.max(0, this.alarm - METERS.drain * dt);
    }
    this.peakAlarm = Math.max(this.peakAlarm, this.alarm);
    // exit
    const ex = this.def.exit;
    if (this.hasPrize && this.sealT <= 0 && inRect(this.x, this.y, ex)) {
      if (this.noticedFlags.n75 && this.evidence >= PROOF.manhunt) {
        this.bannerSay('TOO HOT — CLEAN THE EVIDENCE (C)');
      } else {
        this.phase = 'won';
        // bags left behind are evidence
        sfx.won();
      }
    }
  }

  moveThief(dt, input, sfx) {
    const ax = input.axis();
    this.sneak = input.held('ShiftLeft') || input.held('ShiftRight');
    const len = Math.hypot(ax.x, ax.y);
    this.moving = len > 0;
    let speed = this.sneak ? THIEF.sneak : THIEF.walk;
    if (this.disguise === 'dealer') speed = Math.min(speed, THIEF.sneak + 18); // dealers never hurry
    speed *= 1 - 0.05 * this.bags.length;
    if (this.hasPrize) speed *= 0.97;
    if (len > 0) {
      const nx = (ax.x / (len || 1)), ny = (ax.y / (len || 1));
      this.face = Math.atan2(ny, nx);
      const mx = nx * speed * dt, my = ny * speed * dt;
      if (!collide(this.x + mx, this.y, THIEF.radius, this.solids)) this.x += mx;
      if (!collide(this.x, this.y + my, THIEF.radius, this.solids)) this.y += my;
      if (!this.sneak && Math.random() < dt * 6) sfx.step(this.def.rule === 'sway' && this.jolt > 0.3);
    }
    // glass floor: standing is a noise, sneaking is silence
    if (this.def.glass && inRect(this.x, this.y, this.def.glass) && this.moving && !this.sneak) {
      for (const w of this.wardens) {
        if (dist(this.x, this.y, w.x, w.y) < 150 && w.mode === 'patrol') {
          w.mode = 'investigate'; w.lastX = this.x; w.lastY = this.y; w.invT = 2.2;
        }
      }
    }
    // blackout pulse
    if (input.tapped('KeyE') && this.blackouts > 0 && this.darkT <= 0) {
      this.blackouts--; this.darkT = TOOLS.blackoutSeconds;
      sfx.blackout();
    }
    // drop a bag (decoy): wardens check it, and a cleared decoy erases a little past
    if (input.tapped('KeyX') && this.bags.length) {
      const bag = this.bags.pop();
      this.dropped = { x: this.x, y: this.y, v: bag.v, cleared: false };
      sfx.drop();
    }
    // disguise closets (casino)
    if (this.def.closets.length && input.tapped('KeyF')) {
      for (const c of this.def.closets) {
        if (dist(this.x, this.y, c.x, c.y) < 42 && this.swapT <= 0) {
          this.swapT = 2; sfx.shuffle();
        }
      }
    }
    if (this.swapT > 0) {
      this.swapT -= dt;
      if (this.swapT <= 0) {
        this.disguise = this.disguise === 'guest' ? 'dealer' : 'guest';
        for (const w of this.wardens) w.meter = Math.min(w.meter, 30); // a new face, a cooler room
        sfx.swapped(this.disguise);
      }
    }
    // the cleaner: stand in a camera's dead disc and wipe the record
    let inDead = false;
    if (this.darkT <= 0) for (const e of this.eyes) {
      if (dist(this.x, this.y, e.x, e.y) < EYE.deadDisc + 6) inDead = true;
    }
    if (inDead && this.cleanerLeft > 0 && input.held('KeyC')) {
      this.cleanT += dt;
      if (this.cleanT >= TOOLS.cleanerChannel) {
        this.cleanerLeft--; this.cleanT = 0; this.wipes++;
        this.addEvidence(-TOOLS.cleanerCut, 'clean');
        this.style += 100;
        sfx.clean();
        this.bannerSay('RECORD WIPED');
      }
    } else this.cleanT = Math.max(0, this.cleanT - dt * 2);
  }

  visibleTo(wx, wy, face, range) {
    const d = dist(this.x, this.y, wx, wy);
    if (d > range) return 0;
    const ang = Math.atan2(this.y - wy, this.x - wx);
    let cone = WARDEN.coneHalf;
    if (Math.abs(angDiff(face, ang)) > cone) return 0;
    if (segBlocked(wx, wy, this.x, this.y, this.solids)) return 0;
    // low cover hides a sneaking thief (until she is IDENTIFIED)
    if (this.sneak && !this.noticedFlags.n50) {
      for (const c of this.def.covers) {
        if (inRect(this.x, this.y, c)) return 0;
      }
    }
    return d <= WARDEN.sightIn ? 2 : 1; // 2 inner, 1 outer
  }

  sense(dt, sfx) {
    let anySee = false;
    for (const w of this.wardens) {
      const zone = this.visibleTo(w.x, w.y, w.face, WARDEN.sightOut);
      // role-wrong visibility: a guest inside the cage is seen by everyone, faster
      let rate = 0;
      if (zone === 2) rate = WARDEN.fillIn;
      else if (zone === 1) rate = WARDEN.fillOut;
      if (this.def.staffZone && inRect(this.x, this.y, this.def.staffZone) && this.disguise === 'guest' && zone) {
        rate *= 1.7;
      }
      if (rate > 0) {
        anySee = true;
        w.meter = clamp(w.meter + rate * dt, 0, 100);
        w.peak = Math.max(w.peak, w.meter);
        w.lastX = this.x; w.lastY = this.y;
        this.addEvidence((zone === 2 ? PROOF.guardIn : PROOF.guardOut) * dt, 'seen');
        if (w.meter >= WARDEN.suspectAt && !w.flaggedInv) {
          w.flaggedInv = true; this.addEvidence(PROOF.investigate, 'inv');
          if (w.radioT <= 0 && !w.radioDone) w.radioT = WARDEN.radioDelay;
        }
        if (w.meter >= WARDEN.chaseAt) {
          if (!w.flaggedChase) {
            w.flaggedChase = true; this.spotted++;
            this.addEvidence(PROOF.chase, 'chase');
            this.addAlarm(25);
          }
          w.mode = 'chase';
        } else if (w.meter >= WARDEN.suspectAt && w.mode === 'patrol') {
          w.mode = 'investigate'; w.invT = 2.6;
        }
      } else {
        const before = w.meter;
        w.meter = Math.max(0, w.meter - WARDEN.drain * dt);
        if (before >= 70 && w.meter <= 0.5 && w.mode !== 'chase') this.nearMisses++, this.style += 75;
        if (w.meter < 20) { w.flaggedInv = false; w.flaggedChase = false; w.radioDone = false; }
      }
      // radio propagation: a sighting becomes everyone's problem
      if (w.radioT > 0) {
        w.radioT -= dt;
        if (this.darkT > 0) { w.radioT = 0; w.radioDone = true; } // blackout eats the call
        else if (w.radioT <= 0) {
          w.radioDone = true;
          sfx.radio();
          for (const o of this.wardens) {
            if (o === w) continue;
            const d = dist(w.x, w.y, o.x, o.y);
            o.meter = clamp(o.meter + (d <= WARDEN.radioRange ? 25 : 10), 0, 99);
            if (o.mode === 'patrol') { o.mode = 'investigate'; o.lastX = w.lastX; o.lastY = w.lastY; o.invT = 2.4; }
          }
        }
      }
      // walking noise
      if (this.moving && !this.sneak) {
        const noiseR = this.jolt > 0.3 ? THIEF.noiseWalk * 0.5 : THIEF.noiseWalk;
        if (dist(this.x, this.y, w.x, w.y) < noiseR && w.mode === 'patrol') {
          w.mode = 'investigate'; w.lastX = this.x; w.lastY = this.y; w.invT = 1.8;
        }
      }
      // a dropped decoy bag draws a check; a cleared decoy erases a little past
      if (this.dropped && !this.dropped.cleared && w.mode === 'patrol'
          && dist(this.dropped.x, this.dropped.y, w.x, w.y) < 130) {
        w.mode = 'investigate'; w.lastX = this.dropped.x; w.lastY = this.dropped.y; w.invT = 2.4;
      }
    }
    if (this.dropped && !this.dropped.cleared) {
      for (const w of this.wardens) {
        if (dist(this.dropped.x, this.dropped.y, w.x, w.y) < 26) {
          this.dropped.cleared = true; this.addEvidence(-10, 'decoy');
        }
      }
    }
    return anySee;
  }

  runWardens(dt, sfx) {
    const alert = this.alarm >= METERS.tierAlert;
    for (const w of this.wardens) {
      let tx = null, ty = null, sp = WARDEN.patrol * this.speedMul;
      if (w.mode === 'chase') {
        tx = this.x; ty = this.y; sp = WARDEN.pursue * (alert ? 1.1 : 1);
        if (dist(w.x, w.y, this.x, this.y) < WARDEN.catchDist) {
          this.phase = 'busted'; sfx.busted(); return;
        }
      } else if (w.mode === 'investigate') {
        tx = w.lastX; ty = w.lastY; sp = 104 * this.speedMul;
        w.invT -= dt;
        if (dist(w.x, w.y, tx, ty) < 14 || w.invT <= 0) {
          if (w.meter < WARDEN.suspectAt) { w.mode = 'patrol'; }
          else w.invT = 1.2;
        }
      } else {
        const [px, py] = w.path[w.wp];
        tx = px; ty = py;
        if (dist(w.x, w.y, px, py) < 8) {
          w.wp += w.dir;
          if (w.wp >= w.path.length || w.wp < 0) { w.dir *= -1; w.wp += 2 * w.dir; }
        }
      }
      if (tx !== null) {
        const d = dist(w.x, w.y, tx, ty);
        if (d > 2) {
          const want = Math.atan2(ty - w.y, tx - w.x);
          w.face += clamp(angDiff(w.face, want), -3.4 * dt, 3.4 * dt);
          const stepLen = Math.min(d, sp * dt);
          const nx = w.x + Math.cos(w.face) * stepLen * (Math.abs(angDiff(w.face, want)) < 1.2 ? 1 : 0.25);
          const ny = w.y + Math.sin(w.face) * stepLen * (Math.abs(angDiff(w.face, want)) < 1.2 ? 1 : 0.25);
          if (!collide(nx, w.y, 11, this.solids)) w.x = nx;
          if (!collide(w.x, ny, 11, this.solids)) w.y = ny;
        }
      }
      // train sway wobbles every cone
      if (this.jolt > 0) w.face += Math.sin(this.time * 9 + w.x) * 0.12 * this.jolt * dt * 8;
    }
  }

  runEyes(dt) {
    if (this.darkT > 0) return;
    for (const e of this.eyes) {
      e.ang = e.base + Math.sin(this.time * EYE.sweepRate * this.camMul + e.phase) * EYE.sweepArc;
      const d = dist(this.x, this.y, e.x, e.y);
      if (d < EYE.deadDisc || d > EYE.range) continue;
      const ang = Math.atan2(this.y - e.y, this.x - e.x);
      if (Math.abs(angDiff(e.ang, ang)) > EYE.halfAngle) continue;
      if (segBlocked(e.x, e.y, this.x, this.y, this.solids)) continue;
      const inner = d < EYE.range * 0.55;
      this.addAlarm((inner ? EYE.feedIn : EYE.feedOut) * dt);
      this.addEvidence(PROOF.eye * dt, 'eye');
      // ghosting: crossing the fan sneaking, unseen by any warden, is style
      if (this.sneak && !e.ghostCounted) { e.ghostCounted = true; this.style += 50; }
    }
  }

  runBeams(dt, sfx) {
    if (this.darkT > 0) return;
    for (const b of this.beams) {
      const on = Math.sin(this.time * 1.4 + b.phase) > -0.25;
      if (!on) { b.wasIn = false; continue; }
      // distance from the thief to the segment
      const vx = b.x2 - b.x1, vy = b.y2 - b.y1;
      const t = clamp(((this.x - b.x1) * vx + (this.y - b.y1) * vy) / (vx * vx + vy * vy), 0, 1);
      const px = b.x1 + vx * t, py = b.y1 + vy * t;
      const inside = dist(this.x, this.y, px, py) < 10 && !(b.high && this.sneak);
      if (inside && !b.wasIn) {
        if (b.high && this.sneak) this.style += 40;
        else {
          this.addAlarm(30); this.addEvidence(PROOF.laser, 'laser');
          sfx.laser();
        }
      }
      b.wasIn = inside;
    }
  }

  pickups(sfx) {
    for (const l of this.loots) {
      if (!l.taken && dist(this.x, this.y, l.x, l.y) < 20) {
        l.taken = true; this.bags.push(l); this.stats.lootValue += l.v;
        if (l.lit) this.addEvidence(PROOF.litLoot, 'lit');
        sfx.loot();
      }
    }
    if (!this.prizeTaken && dist(this.x, this.y, this.def.prize.x, this.def.prize.y) < 24) {
      this.prizeTaken = true; this.hasPrize = true;
      this.stats.lootValue += this.def.prize.v;
      sfx.prize();
      this.bannerSay(this.def.prizeName + ' — NOW GET OUT');
    }
  }

  // ------------------------------------------------------------- scoring
  score() {
    const loot = this.stats.lootValue;
    const timeBonus = Math.max(0, Math.round((this.def.par - this.time) * 15));
    const cappedTime = Math.min(1500, timeBonus);
    let route = null, routeBonus = 0;
    if (this.peakAlarm === 0 && this.evidence === 0) { route = 'GHOST'; routeBonus = 3500; }
    else if (this.peakAlarm < 60 && this.wipes >= 1 && this.spotted === 0) { route = 'PROFESSIONAL'; routeBonus = 2000; }
    else if (this.style >= 600 && this.peakAlarm < 100) { route = 'SHOWMAN'; routeBonus = 2000; }
    const subtotal = loot + cappedTime + this.style + routeBonus + 500
      - this.lockdowns * 750 - this.spotted * 200;
    return {
      loot, timeBonus: cappedTime, style: this.style, route, routeBonus,
      lockdowns: this.lockdowns, spotted: this.spotted,
      total: Math.max(0, Math.round(subtotal)),
    };
  }
}

export function campaignRank(total) {
  if (total >= 34000) return 'Legend';
  if (total >= 28500) return 'Mastermind';
  if (total >= 22500) return 'Professional';
  if (total >= 16000) return 'Cat Burglar';
  if (total >= 9500) return 'Prowler';
  return 'Amateur';
}
export function letterGrade(score, par) {
  const ratio = score / (par * 62);
  if (ratio >= 0.9) return 'S';
  if (ratio >= 0.75) return 'A';
  if (ratio >= 0.6) return 'B';
  if (ratio >= 0.4) return 'C';
  return 'D';
}

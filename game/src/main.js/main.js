// LAST CAR TO DAWN — screens and flow.
// One night, three scores. Between scores the night settles its account:
// half of what the building remembers becomes HEAT, and heat is waiting
// inside the next building — more wardens, hungrier cameras, thinner tools —
// and it pays: the campaign total is multiplied by (1 + heat/200).
import { Heist, campaignRank, letterGrade, LEVELS } from './sim.js';
import { draw } from './view.js';
import { SoundKit } from './audio.js';
import { keys } from './input.js';
import { INK, VIEW_W, VIEW_H } from './config.js';
import { stagedState } from './shots.js';

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const sound = new SoundKit();
const sfx = sound.facade();

const ui = {
  mode: 'title', // title | brief | play | won | busted | campaign
  level: 0,
  heat: 0,
  campaign: [], // per-level score objects
  sim: null,
  rightText(S) {
    if (S.escapeT > 0) return `OUT IN ${Math.ceil(S.escapeT)}s`;
    if (S.sealT > 0) return 'TRAM SEALED';
    if (S.hasPrize) return 'GET TO THE TRAM';
    return 'LIFT THE PRIZE';
  },
};

function startLevel(i) {
  ui.level = i;
  ui.sim = new Heist(i, ui.heat, sound);
  ui.mode = 'brief';
}
function finishLevel() {
  const s = ui.sim.score();
  ui.campaign.push({ ...s, name: ui.sim.def.name, par: ui.sim.def.par });
  // the building tells the next building: half the evidence becomes heat
  ui.heat = Math.min(100, ui.heat + Math.round(ui.sim.evidence / 2));
  if (ui.level + 1 < LEVELS.length) startLevel(ui.level + 1);
  else ui.mode = 'campaign';
}

const staged = stagedState(ui, () => new Heist(0, 0, sound));
if (staged) {
  ui.mode = staged.mode;
  ui.sim = staged.sim || null;
  if (staged.campaign) ui.campaign = staged.campaign;
  if (staged.level !== undefined) ui.level = staged.level;
  if (staged.heat !== undefined) ui.heat = staged.heat;
}

addEventListener('pointerdown', () => sound.ensure());
addEventListener('keydown', () => sound.ensure());

function panel(lines, accent = INK.wallEdge) {
  ctx.fillStyle = 'rgba(8,6,4,0.93)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.strokeStyle = accent;
  ctx.strokeRect(190.5, 90.5, VIEW_W - 381, VIEW_H - 181);
  ctx.textAlign = 'center';
  let y = 150;
  for (const [text, size, colour, gap] of lines) {
    ctx.fillStyle = colour;
    ctx.font = `${size}px Georgia, serif`;
    ctx.fillText(text, VIEW_W / 2, y);
    y += gap ?? size + 14;
  }
}

function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.033, (now - (frame.last || now)) / 1000);
  frame.last = now;

  if (ui.mode === 'title') {
    panel([
      ['LAST CAR TO DAWN', 44, INK.paper, 58],
      ['Mara Venn kept the night trains safe — until the night she was framed for robbing one.', 15, INK.mute, 24],
      ['The proof that clears her sits in three rooms: a ledger, a chip reserve, a master key.', 15, INK.mute, 40],
      ['ALARM is what the building feels now. EVIDENCE is what it remembers — it never drains.', 14, INK.evidence, 22],
      ['Cross 25 and you are NOTICED. 50, IDENTIFIED. 75, and the tram will not open: MANHUNT.', 14, INK.evidence, 22],
      ['Half of it follows you as HEAT — and heat pays: the night’s total grows by heat/200.', 14, INK.evidence, 38],
      ['Wardens radio what they see. Break the call with a blackout. Wipe the record in a camera’s blind disc.', 14, INK.paper, 22],
      ['WASD move · Shift sneak · E blackout · X drop a bag · C wipe (in a blind disc) · F swap disguise', 13, INK.mute, 44],
      ['ENTER — take the night back', 17, INK.loot],
    ]);
    if (keys.tapped('Enter')) { ui.heat = 0; ui.campaign = []; startLevel(0); }
  } else if (ui.mode === 'brief') {
    const d = ui.sim.def;
    const heatLines = ui.heat > 0 ? [
      [`HEAT ${Math.round(ui.heat)} walks in with you:`, 14, INK.alarm, 22],
      [ui.heat >= 20 ? '· one more warden on the floor' : '· the floor is as staffed as ever', 13, INK.mute, 20],
      [ui.heat >= 40 ? '· the cameras wake up staring at the prize' : '· the cameras wake up lazy', 13, INK.mute, 20],
      [ui.heat >= 60 ? '· one blackout charge short' : '· your tools are whole', 13, INK.mute, 20],
      [ui.heat >= 80 ? '· a lockdown gives you 30 seconds, not 45' : '· a lockdown still gives you 45 seconds', 13, INK.mute, 34],
    ] : [];
    panel([
      [d.name, 30, INK.paper, 44],
      [`Lift ${d.prizeName}. Reach the tram. Par ${d.par}s.`, 15, INK.mute, 30],
      ...heatLines,
      [d.rule === 'sway' ? 'The cars sway every twenty seconds — move with the jolt, it swallows your steps.' : d.rule === 'wardrobe' ? 'Two faces in the closets (F): a GUEST is barred from the cage; a DEALER may pass, but never hurries and never touches chips.' : 'The atrium floor is glass and it creaks — cross it sneaking, or not at all. A blackout drops the laser ring.', 14, INK.paper, 40],
      ['ENTER — begin', 16, INK.loot],
    ]);
    if (keys.tapped('Enter')) ui.mode = 'play';
  } else if (ui.mode === 'play') {
    if (!staged?.frozen) {
      ui.sim.step(dt, keys, sfx);
      sound.ambience(ui.sim, dt);
    }
    draw(ctx, ui.sim, ui);
    if (ui.sim.phase === 'won') ui.mode = 'won';
    if (ui.sim.phase === 'busted') ui.mode = 'busted';
  } else if (ui.mode === 'won') {
    draw(ctx, ui.sim, ui);
    const s = ui.sim.score();
    panel([
      ['CLEAN GETAWAY', 30, INK.loot, 44],
      [`take ${s.loot} · time ${s.timeBonus} · style ${s.style}`, 15, INK.paper, 24],
      [s.route ? `route ${s.route} +${s.routeBonus}` : 'no route grade — the night saw too much', 15, INK.evidence, 24],
      [`lockdowns ${s.lockdowns} · spotted ${s.spotted}`, 14, INK.mute, 24],
      [`SCORE ${s.total} · grade ${letterGrade(s.total, ui.sim.def.par)}`, 19, INK.paper, 30],
      [`evidence ${Math.round(ui.sim.evidence)} — half of it becomes heat`, 14, INK.alarm, 40],
      ['ENTER — next score', 16, INK.loot],
    ], INK.loot);
    if (keys.tapped('Enter')) finishLevel();
  } else if (ui.mode === 'busted') {
    draw(ctx, ui.sim, ui);
    panel([
      ['CAUGHT', 32, INK.alarm, 44],
      ['The night keeps the ledger, the chips and the key.', 15, INK.mute, 24],
      ['Mara keeps her name a little longer — in the wrong column.', 15, INK.mute, 40],
      ['ENTER — run the whole night again', 16, INK.loot],
    ], INK.alarm);
    if (keys.tapped('Enter')) { ui.heat = 0; ui.campaign = []; startLevel(0); }
  } else if (ui.mode === 'campaign') {
    const base = ui.campaign.reduce((a, s) => a + s.total, 0);
    const total = Math.round(base * (1 + ui.heat / 200));
    const last = ui.campaign[ui.campaign.length - 1];
    panel([
      ['DAWN', 34, INK.paper, 50],
      ...ui.campaign.map((s) => [`${s.name} — ${s.total} (${letterGrade(s.total, s.par)}${s.route ? ', ' + s.route : ''})`, 15, INK.mute, 24]),
      [`heat ${Math.round(ui.heat)} pays: ${base} → ${total}`, 15, INK.evidence, 30],
      [`NIGHT TOTAL ${total}`, 22, INK.paper, 30],
      [`RANK — ${campaignRank(total)}`, 20, INK.loot, 44],
      ['The ledger is hers again. The name is hers again.', 14, INK.mute, 40],
      ['ENTER — another night', 15, INK.loot],
    ], INK.loot);
    if (keys.tapped('Enter')) { ui.heat = 0; ui.campaign = []; startLevel(0); }
  }
  keys.endFrame();
  if (staged) window.__shotReady = true;
}
requestAnimationFrame(frame);

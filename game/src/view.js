// LAST CAR TO DAWN — rendering. Art-deco night: black-espresso marble,
// antique brass, an ivory thief, bordeaux wardens, and jade for every sensor
// the building owns. If it is jade, it can see her.
import { VIEW_W, VIEW_H, INK, EYE, WARDEN, PROOF } from './config.js';
import { clamp } from './random.js';

function fan(ctx, x, y, ang, half, range, colour) {
  const grad = ctx.createRadialGradient(x, y, 8, x, y, range);
  grad.addColorStop(0, colour.replace('A)', '0.34)'));
  grad.addColorStop(1, colour.replace('A)', '0.02)'));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, range, ang - half, ang + half);
  ctx.closePath();
  ctx.fill();
}

export function draw(ctx, S, ui) {
  const def = S.def;
  ctx.fillStyle = INK.floor;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  // marble veins, deco-cheap: a soft diagonal sheen
  ctx.fillStyle = INK.floorAlt;
  for (let i = 0; i < 7; i++) ctx.fillRect(i * 190 - 60, 0, 70, VIEW_H);

  if (def.rule === 'sway') drawTrain(ctx, S);
  if (def.rule === 'wardrobe') drawCasino(ctx, S);
  if (def.rule === 'glass') drawAtrium(ctx, S);

  // cover blocks
  for (const c of def.covers) {
    ctx.fillStyle = INK.cover;
    ctx.fillRect(c.x, c.y, c.w, c.h);
    ctx.strokeStyle = INK.coverEdge;
    ctx.strokeRect(c.x + 0.5, c.y + 0.5, c.w - 1, c.h - 1);
  }
  // walls in brass
  for (const w of def.walls) {
    ctx.fillStyle = INK.wall;
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.fillStyle = INK.wallEdge;
    if (w.w > w.h) ctx.fillRect(w.x, w.y, w.w, 2); else ctx.fillRect(w.x, w.y, 2, w.h);
  }
  // exit: the service tram platform
  const ex = def.exit;
  ctx.fillStyle = '#241b0d';
  ctx.fillRect(ex.x, ex.y, ex.w, ex.h);
  ctx.strokeStyle = INK.wallEdge;
  ctx.setLineDash([6, 5]);
  ctx.strokeRect(ex.x + 0.5, ex.y + 0.5, ex.w - 1, ex.h - 1);
  ctx.setLineDash([]);
  ctx.fillStyle = INK.mute;
  ctx.font = '10px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('TRAM', ex.x + ex.w / 2, ex.y + ex.h / 2 + 3);
  if (S.sealT > 0) {
    ctx.fillStyle = 'rgba(232,64,52,0.25)';
    ctx.fillRect(ex.x, ex.y, ex.w, ex.h);
  }

  // lasers
  if (S.darkT <= 0) for (const b of def.beams) {
    const on = Math.sin(S.time * 1.4 + b.phase) > -0.25;
    if (!on) continue;
    ctx.strokeStyle = 'rgba(232,64,52,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.fillStyle = INK.alarm;
    ctx.beginPath(); ctx.arc(b.x1, b.y1, 3, 0, 7); ctx.arc(b.x2, b.y2, 3, 0, 7); ctx.fill();
  }

  // loot + prize in lemon gold
  for (const l of S.loots) {
    if (l.taken) continue;
    if (l.lit) { // a lit pedestal: lifting it is remembered
      ctx.fillStyle = 'rgba(255,223,0,0.10)';
      ctx.beginPath(); ctx.arc(l.x, l.y, 20, 0, 7); ctx.fill();
    }
    ctx.fillStyle = INK.loot;
    ctx.beginPath(); ctx.arc(l.x, l.y, 7, 0, 7); ctx.fill();
    ctx.fillStyle = '#17130e';
    ctx.font = 'bold 9px Georgia, serif'; ctx.textAlign = 'center';
    ctx.fillText('$', l.x, l.y + 3);
  }
  if (!S.prizeTaken) {
    const p = def.prize;
    const pulse = 1 + Math.sin(S.time * 3.2) * 0.12;
    ctx.fillStyle = 'rgba(255,223,0,0.16)';
    ctx.beginPath(); ctx.arc(p.x, p.y, 26 * pulse, 0, 7); ctx.fill();
    ctx.fillStyle = INK.loot;
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(Math.PI / 4);
    ctx.fillRect(-9, -9, 18, 18);
    ctx.restore();
    ctx.fillStyle = '#17130e';
    ctx.font = 'bold 11px Georgia, serif'; ctx.textAlign = 'center';
    ctx.fillText('◆', p.x, p.y + 4);
  }

  // dropped decoy bag
  if (S.dropped && !S.dropped.cleared) {
    ctx.fillStyle = '#8a6d1f';
    ctx.beginPath(); ctx.arc(S.dropped.x, S.dropped.y, 7, 0, 7); ctx.fill();
  }

  // camera fans + housings
  for (const e of S.eyes) {
    if (S.darkT <= 0) fan(ctx, e.x, e.y, e.ang, EYE.halfAngle, EYE.range, 'rgba(53,208,186,A)');
    ctx.fillStyle = S.darkT > 0 ? '#3a3a3a' : INK.sense;
    ctx.beginPath(); ctx.arc(e.x, e.y, 6, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(53,208,186,0.5)';
    ctx.beginPath(); ctx.arc(e.x, e.y, EYE.deadDisc, 0, 7); ctx.stroke();
  }

  // wardens
  for (const w of S.wardens) {
    fan(ctx, w.x, w.y, w.face, WARDEN.coneHalf, WARDEN.sightOut, 'rgba(245,178,60,A)');
    ctx.fillStyle = w.kind === 'boss' ? INK.boss : INK.warden;
    ctx.beginPath(); ctx.arc(w.x, w.y, 11, 0, 7); ctx.fill();
    ctx.fillStyle = INK.paper;
    ctx.beginPath();
    ctx.arc(w.x + Math.cos(w.face) * 6, w.y + Math.sin(w.face) * 6, 3.4, 0, 7);
    ctx.fill();
    if (w.radioT > 0) { // the headset wind-up: break the call with a blackout
      ctx.strokeStyle = INK.sense;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(w.x, w.y, 16 + Math.sin(S.time * 14) * 2, 0, 7); ctx.stroke();
      ctx.lineWidth = 1;
    }
    if (w.meter > 1) {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(w.x - 14, w.y - 24, 28, 5);
      ctx.fillStyle = w.meter >= 100 ? INK.alarm : INK.evidence;
      ctx.fillRect(w.x - 14, w.y - 24, 28 * clamp(w.meter / 100, 0, 1), 5);
    }
    if (w.mode === 'chase') mark(ctx, w.x, w.y - 34, '!', INK.alarm);
    else if (w.mode === 'investigate') mark(ctx, w.x, w.y - 34, '?', INK.evidence);
  }

  // the thief — ivory, with a gold sash once she carries the prize
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath(); ctx.ellipse(S.x, S.y + 9, 11, 4, 0, 0, 7); ctx.fill();
  ctx.fillStyle = INK.thief;
  ctx.beginPath(); ctx.arc(S.x, S.y, 11, 0, 7); ctx.fill();
  ctx.fillStyle = INK.thiefShade;
  ctx.beginPath();
  ctx.arc(S.x + Math.cos(S.face) * 5, S.y + Math.sin(S.face) * 5, 4, 0, 7);
  ctx.fill();
  if (S.hasPrize) {
    ctx.strokeStyle = INK.loot; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(S.x, S.y, 13, 0, 7); ctx.stroke(); ctx.lineWidth = 1;
  }
  if (S.sneak) {
    ctx.strokeStyle = 'rgba(245,240,225,0.5)';
    ctx.setLineDash([3, 4]);
    ctx.beginPath(); ctx.arc(S.x, S.y, 15, 0, 7); ctx.stroke();
    ctx.setLineDash([]);
  }
  if (S.swapT > 0) mark(ctx, S.x, S.y - 30, '…', INK.paper);
  if (S.cleanT > 0.1) {
    ctx.strokeStyle = INK.sense; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(S.x, S.y, 17, -Math.PI / 2, -Math.PI / 2 + (S.cleanT / 2.5) * Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1;
  }

  drawHud(ctx, S, ui);
  if (S.darkT > 0) {
    ctx.fillStyle = 'rgba(4,4,10,0.30)';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  if (S.jolt > 0) { // the train breathes
    ctx.fillStyle = `rgba(245,240,225,${0.03 * S.jolt})`;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
}

function mark(ctx, x, y, ch, colour) {
  ctx.fillStyle = colour;
  ctx.font = 'bold 15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(ch, x, y);
}

function drawTrain(ctx, S) {
  // windows along both edges; the night scrolls past at line speed
  ctx.fillStyle = '#0d1520';
  const off = (S.time * 130) % 118;
  for (let x = -118; x < VIEW_W + 118; x += 118) {
    ctx.fillRect(x + off - 118, 10, 104, 20);
    ctx.fillRect(x + off - 118, VIEW_H - 30, 104, 20);
  }
  ctx.fillStyle = '#cfe4ff';
  for (let i = 0; i < 26; i++) {
    const sx = ((i * 173 - S.time * 130) % (VIEW_W + 40) + VIEW_W + 40) % (VIEW_W + 40) - 20;
    ctx.fillRect(sx, 14 + (i % 3) * 5, 2, 2);
    ctx.fillRect(sx, VIEW_H - 26 + (i % 3) * 5, 2, 2);
  }
  ctx.fillStyle = INK.mute;
  ctx.font = '10px Georgia, serif'; ctx.textAlign = 'left';
  ctx.fillText('SABLE MERIDIAN — NIGHT LINE', 46, 24);
  if (S.jolt > 0.25) ctx.fillText('— the cars sway —', 980, 24);
}

function drawCasino(ctx, S) {
  // felt tables carry their game in gold thread
  ctx.fillStyle = 'rgba(53,208,186,0.05)';
  for (const w of S.def.walls) {
    if (w.w === 110 && w.h === 44) ctx.fillRect(w.x, w.y, w.w, w.h);
  }
  ctx.fillStyle = INK.mute;
  ctx.font = '10px Georgia, serif'; ctx.textAlign = 'left';
  ctx.fillText('THE GILDED MIRAGE — FLOOR', 46, 24);
  ctx.fillText(S.disguise === 'dealer' ? 'DISGUISE: DEALER' : 'DISGUISE: GUEST', 950, 24);
  for (const c of S.def.closets) {
    ctx.strokeStyle = INK.wallEdge;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(c.x - 13, c.y - 13, 26, 26);
    ctx.setLineDash([]);
    ctx.fillStyle = INK.mute;
    ctx.font = '9px Georgia, serif'; ctx.textAlign = 'center';
    ctx.fillText('👔', c.x, c.y + 3);
  }
  if (S.def.staffZone) {
    ctx.strokeStyle = 'rgba(232,64,52,0.4)';
    ctx.strokeRect(S.def.staffZone.x, S.def.staffZone.y, S.def.staffZone.w, S.def.staffZone.h);
  }
}

function drawAtrium(ctx, S) {
  const g = S.def.glass;
  if (g) {
    ctx.fillStyle = INK.glass;
    ctx.fillRect(g.x, g.y, g.w, g.h);
    // the city, far below the glass
    ctx.fillStyle = 'rgba(255,223,0,0.5)';
    for (let i = 0; i < 40; i++) {
      const lx = g.x + 12 + ((i * 97) % (g.w - 24));
      const ly = g.y + 12 + ((i * 57) % (g.h - 24));
      ctx.fillRect(lx, ly, 2, 2);
    }
    ctx.strokeStyle = 'rgba(245,240,225,0.35)';
    ctx.strokeRect(g.x + 0.5, g.y + 0.5, g.w - 1, g.h - 1);
    ctx.fillStyle = INK.mute;
    ctx.font = '10px Georgia, serif'; ctx.textAlign = 'left';
    ctx.fillText('GLASS FLOOR — IT CREAKS. SNEAK.', g.x + 10, g.y + 16);
  }
  ctx.fillStyle = INK.mute;
  ctx.font = '10px Georgia, serif'; ctx.textAlign = 'left';
  ctx.fillText('THE ASTRAL CROWN PENTHOUSE', 46, 24);
}

function meter(ctx, x, y, w, frac, colour, label) {
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(x, y, w, 9);
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, w * clamp(frac, 0, 1), 9);
  ctx.fillStyle = INK.paper;
  ctx.font = 'bold 9px Georgia, serif'; ctx.textAlign = 'left';
  ctx.fillText(`${label} ${Math.round(frac * 100)}`, x + w + 8, y + 8);
}

function drawHud(ctx, S, ui) {
  ctx.fillStyle = 'rgba(10,8,5,0.88)';
  ctx.fillRect(0, VIEW_H - 44, VIEW_W, 44);
  meter(ctx, 16, VIEW_H - 36, 240, S.alarm / 100, S.alarm >= 60 ? INK.alarm : INK.evidence, 'ALARM');
  meter(ctx, 16, VIEW_H - 18, 240, S.evidence / 100, INK.evidence, 'EVIDENCE');
  // evidence threshold ticks
  ctx.fillStyle = INK.paper;
  for (const t of [PROOF.noticed, PROOF.identified, PROOF.manhunt]) {
    ctx.fillRect(16 + 2.4 * t, VIEW_H - 19, 1, 11);
  }
  ctx.fillStyle = INK.paper;
  ctx.font = '13px Georgia, serif'; ctx.textAlign = 'left';
  const take = S.stats.lootValue;
  ctx.fillText(`${S.def.name}   TAKE ${take}   BAGS ${S.bags.length}   HEAT ${Math.round(S.heat)}`, 340, VIEW_H - 18);
  ctx.fillStyle = INK.mute;
  ctx.font = '11px Georgia, serif';
  ctx.fillText(`dark ${S.blackouts} · wipe ${S.cleanerLeft} · WASD · Shift sneak · E dark · X drop · C wipe · F swap`, 340, VIEW_H - 4);
  ctx.fillStyle = INK.paper;
  ctx.font = '13px Georgia, serif'; ctx.textAlign = 'right';
  ctx.fillText(ui.rightText(S), VIEW_W - 16, VIEW_H - 18);
  if (S.escapeT > 0) {
    ctx.fillStyle = INK.alarm;
    ctx.font = 'bold 15px Georgia, serif'; ctx.textAlign = 'center';
    ctx.fillText(`GET OUT — ${Math.ceil(S.escapeT)}s`, VIEW_W / 2, 30);
  }
  if (S.bannerT > 0 && S.banner) {
    ctx.fillStyle = INK.evidence;
    ctx.font = 'bold 21px Georgia, serif'; ctx.textAlign = 'center';
    ctx.fillText(S.banner, VIEW_W / 2, 64);
  }
}

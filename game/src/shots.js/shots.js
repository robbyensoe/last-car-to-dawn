// Staged frames for the screenshots. The sim is deterministic under these
// overrides, so the renders are stable enough to judge by.
import { Heist } from './sim.js';

export function stagedState(ui, _makeDefault) {
  const q = new URLSearchParams(location.search);
  const shot = q.get('shot');
  if (!shot) return null;

  if (shot === 'cover') {
    // The Gilded Mirage: Mara in ivory at the rim of a warden's cone behind a
    // table, the cage camera fanning toward the black-chip reserve, both
    // meters alive and the record already remembering her.
    const S = new Heist(1, 12, null);
    S.x = 520; S.y = 275; S.face = 0.4; S.sneak = true;
    S.wardens[0].x = 640; S.wardens[0].y = 196; S.wardens[0].face = 2.35; S.wardens[0].meter = 66;
    S.wardens[1].x = 210; S.wardens[1].y = 128; S.wardens[1].face = 0.2;
    S.wardens[1].mode = 'investigate'; S.wardens[1].meter = 44;
    S.wardens[2].x = 962; S.wardens[2].y = 430; S.wardens[2].face = -2.2; S.wardens[2].meter = 18;
    S.eyes[0].ang = 1.15;
    S.eyes[1].ang = Math.PI;
    S.alarm = 41; S.evidence = 47;
    S.noticedFlags.n25 = true;
    S.stats.lootValue = 1450;
    S.bags = [S.loots[0], S.loots[2]];
    return { mode: 'play', sim: S, level: 1, heat: 12, frozen: true };
  }
  if (shot === 'near') {
    // The Sable Meridian: pressed into the mail car while the conductor's
    // cone rakes the corridor — alarm high, evidence past IDENTIFIED, the
    // ledger glowing behind its crossbeam.
    const S = new Heist(0, 0, null);
    S.x = 968; S.y = 320; S.face = Math.PI; S.sneak = true;
    S.wardens[0].x = 830; S.wardens[0].y = 320; S.wardens[0].face = 0; S.wardens[0].meter = 71;
    S.wardens[0].mode = 'investigate';
    S.wardens[2].x = 1052; S.wardens[2].y = 200; S.wardens[2].face = 2.6; S.wardens[2].meter = 33;
    S.eyes[0].ang = Math.PI / 2 + 0.5;
    S.alarm = 64; S.evidence = 58;
    S.noticedFlags.n25 = true; S.noticedFlags.n50 = true;
    S.stats.lootValue = 650;
    S.bags = [S.loots[0], S.loots[3]];
    S.time = 41;
    return { mode: 'play', sim: S, level: 0, heat: 0, frozen: true };
  }
  if (shot === 'end') {
    // The Astral Crown: inside the laser ring on the creaking glass, the
    // Master Key an arm's length away, the bodyguard's cone dropping on her
    // and the record already past IDENTIFIED. The night's climax, not its
    // bookkeeping — a totals screen never won a pairwise in its life.
    const S = new Heist(2, 24, null);
    S.x = 516; S.y = 320; S.face = 0; S.sneak = false;
    S.wardens[0].x = 196; S.wardens[0].y = 306; S.wardens[0].face = 0.15; S.wardens[0].meter = 22;
    S.wardens[1].x = 716; S.wardens[1].y = 320; S.wardens[1].face = Math.PI; S.wardens[1].meter = 64;
    S.wardens[1].mode = 'investigate';
    S.wardens[2].x = 590; S.wardens[2].y = 148; S.wardens[2].face = Math.PI / 2; S.wardens[2].meter = 82;
    S.eyes[0].ang = -Math.PI / 2;
    S.alarm = 58; S.evidence = 68;
    S.noticedFlags.n25 = true; S.noticedFlags.n50 = true;
    S.stats.lootValue = 2350;
    S.bags = [S.loots[0], S.loots[3]];
    S.time = 87;
    return { mode: 'play', sim: S, level: 2, heat: 24, frozen: true };
  }
  return null;
}

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
    S.wardens[0].x = 640; S.wardens[0].y = 196; S.wardens[0].face = 2.35; S.wardens[0].meter = 52;
    S.wardens[1].x = 210; S.wardens[1].y = 128; S.wardens[1].face = 0.2;
    S.wardens[2].x = 962; S.wardens[2].y = 430; S.wardens[2].face = -2.2; S.wardens[2].meter = 18;
    S.eyes[0].ang = 1.15;
    S.eyes[1].ang = Math.PI;
    S.alarm = 27; S.evidence = 34;
    S.noticedFlags.n25 = true;
    S.stats.lootValue = 800;
    S.bags = [S.loots[0]];
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
    // Dawn: the night totalled, heat paid, the name cleared.
    return {
      mode: 'campaign',
      campaign: [
        { name: 'I. THE SABLE MERIDIAN', total: 6950, par: 150, route: 'PROFESSIONAL' },
        { name: 'II. THE GILDED MIRAGE', total: 8125, par: 210, route: null },
        { name: 'III. THE ASTRAL CROWN', total: 6675, par: 270, route: 'GHOST' },
      ],
      heat: 24,
    };
  }
  return null;
}

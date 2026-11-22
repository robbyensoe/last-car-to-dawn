// WebAudio dressing: the train keeps time, the casino sparkles, and a
// heartbeat follows the nearest suspicious mind. No samples, all synthesis.
export class SoundKit {
  constructor() {
    this.ctx = null;
    this.beatAt = 0;
    this.clackAt = 0;
  }
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.4;
        this.master.connect(this.ctx.destination);
        const len = this.ctx.sampleRate;
        this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = this.noise.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
    }
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }
  tone(type, f0, f1, t, dur, gain = 0.2) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.02);
  }
  burst(t, dur, freq, gain = 0.15, type = 'bandpass') {
    if (!this.ctx) return;
    const src = this.ctx.createBufferSource(); src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.master);
    src.start(t); src.stop(t + dur + 0.02);
  }
  now() { return this.ctx ? this.ctx.currentTime : 0; }

  // the sfx surface the simulation calls
  facade() {
    const k = this;
    return {
      step(soft) { if (k.ctx) k.burst(k.now(), 0.03, soft ? 900 : 500, 0.03); },
      loot() { if (k.ctx) { const t = k.now(); k.tone('square', 1568, 1568, t, 0.06, 0.08); k.tone('square', 2093, 2093, t + 0.06, 0.09, 0.08); } },
      prize() { if (k.ctx) { const t = k.now(); [1047, 1319, 1568, 2093].forEach((f, i) => k.tone('sine', f, f, t + i * 0.07, 0.22, 0.14)); } },
      laser() { if (k.ctx) k.tone('sawtooth', 880, 440, k.now(), 0.18, 0.12); },
      blackout() { if (k.ctx) { const t = k.now(); k.tone('sine', 120, 55, t, 0.3, 0.25); k.burst(t, 0.2, 300, 0.12, 'lowpass'); } },
      drop() { if (k.ctx) k.burst(k.now(), 0.08, 700, 0.1, 'lowpass'); },
      radio() { if (k.ctx) { const t = k.now(); k.tone('square', 1240, 1240, t, 0.05, 0.06); k.tone('square', 1240, 1240, t + 0.09, 0.05, 0.06); } },
      clean() { if (k.ctx) { const t = k.now(); k.burst(t, 0.25, 2400, 0.08); k.tone('sine', 3200, 2600, t, 0.15, 0.06); } },
      shuffle() { if (k.ctx) { const t = k.now(); for (let i = 0; i < 9; i++) k.burst(t + i * 0.035 + Math.random() * 0.01, 0.02, 3500, 0.07); } },
      swapped(role) { if (k.ctx) k.tone('triangle', role === 'dealer' ? 660 : 520, role === 'dealer' ? 880 : 700, k.now(), 0.16, 0.12); },
      won() { if (k.ctx) { const t = k.now(); [262, 330, 392, 523].forEach((f) => k.tone('sawtooth', f, f, t, 0.4, 0.05)); [523, 659, 784, 1047].forEach((f, i) => k.tone('triangle', f, f, t + 0.1 + i * 0.08, 0.4, 0.12)); k.tone('sine', 98, 49, t, 0.7, 0.2); } },
      busted() { if (k.ctx) { const t = k.now(); k.tone('sawtooth', 220, 55, t, 0.7, 0.2); k.burst(t, 0.4, 400, 0.15, 'lowpass'); } },
    };
  }
  sting(kind) {
    if (!this.ctx) return;
    const t = this.now();
    if (kind === 'notice') this.tone('square', 740, 740, t, 0.1, 0.07);
    if (kind === 'lockdown') { this.tone('square', 520, 520, t, 0.14, 0.12); this.tone('square', 520, 520, t + 0.2, 0.14, 0.12); }
  }
  // ambient beds + heartbeat, driven once per frame
  ambience(S, dt) {
    if (!this.ctx) return;
    const t = this.now();
    if (S.def.rule === 'sway' && t >= this.clackAt) { // 92 BPM clackety-clack
      this.burst(t, 0.03, 1800, 0.10);
      this.burst(t + 0.09, 0.03, 1800, 0.08);
      this.tone('sine', 55, 40, t, 0.12, 0.10);
      this.clackAt = t + 0.652;
    }
    if (S.def.rule === 'wardrobe' && Math.random() < dt * 0.25) { // distant slots
      this.tone('square', 180, 180, t, 0.05, 0.03);
      this.tone('sine', 2093, 2093, t + 0.07, 0.12, 0.03);
    }
    let m = 0;
    for (const w of S.wardens) m = Math.max(m, w.meter / 100);
    if (m > 0.02 && t >= this.beatAt) {
      const gap = 60 / (50 + 70 * m);
      this.tone('sine', 70, 45, t, 0.09, 0.05 + 0.2 * m);
      this.tone('sine', 70, 45, t + 0.16, 0.09, (0.05 + 0.2 * m) * 0.7);
      this.beatAt = t + gap;
    }
  }
}

import { loadMuted, saveMuted } from "./storage";

// Small synthesized sounds — no audio files needed.
let ctx = null;
let muted = loadMuted();

// Browsers only allow audio after a user action, so call this on a click.
export function unlockAudio() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
  } catch {
    // audio not available
  }
}

export const isMuted = () => muted;

export function setMuted(m) {
  muted = m;
  saveMuted(m);
}

function tone(freq, dur, { type = "square", vol = 0.05, delay = 0 } = {}) {
  if (muted || !ctx) return;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  hit: () => tone(880, 0.09),
  miss: () => tone(140, 0.14, { type: "sawtooth", vol: 0.04 }),
  tick: () => tone(1200, 0.04, { type: "sine", vol: 0.04 }),
  win: () =>
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, { delay: i * 0.09 })),
  lose: () =>
    [392, 330, 262].forEach((f, i) =>
      tone(f, 0.2, { type: "triangle", vol: 0.06, delay: i * 0.14 })
    ),
};

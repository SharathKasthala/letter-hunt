const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Letters that are easy to confuse with each other
const LOOK_ALIKES = {
  R: ["P", "B", "K"], P: ["R", "B", "F"], B: ["R", "P", "E"],
  E: ["F", "B"], F: ["E", "P", "T"], O: ["Q", "D", "C", "G"],
  Q: ["O", "G"], C: ["G", "O"], G: ["C", "O", "Q"], D: ["O", "B"],
  M: ["N", "W"], N: ["M", "H"], W: ["M", "V"], I: ["L", "T", "J"],
  L: ["I", "T"], T: ["I", "L"], H: ["N"], K: ["R", "X"],
  X: ["K", "Y"], V: ["W", "U", "Y"], U: ["V"],
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 7×7 on phones, 8×8 on bigger screens
export function currentGridSize() {
  if (typeof window === "undefined") return 8;
  return window.matchMedia("(max-width: 639px)").matches ? 7 : 8;
}

// A new target, never the same as the last one
export function pickTarget(previous) {
  let t;
  do {
    t = pick(ALPHABET);
  } while (t === previous);
  return t;
}

// A non-target letter (or "?") based on the difficulty settings
export function randomDistractor(target, difficulty) {
  if (Math.random() < difficulty.questionRate) return "?";
  const similar = LOOK_ALIKES[target];
  // Letters with few look-alikes (like U, only V) get them less often,
  // so the grid doesn't fill up with one repeated letter
  const rate = similar ? difficulty.lookAlikeRate * Math.min(1, similar.length / 3) : 0;
  if (similar && Math.random() < rate) return pick(similar);
  let l;
  do {
    l = pick(ALPHABET);
  } while (l === target);
  return l;
}

// One target in a random cell, everything else a distractor
export function buildGrid(target, size, difficulty) {
  const total = size * size;
  const targetIndex = Math.floor(Math.random() * total);
  const cells = [];
  for (let i = 0; i < total; i++) {
    const isTarget = i === targetIndex;
    cells.push({
      id: i,
      letter: isTarget ? target : randomDistractor(target, difficulty),
      isTarget,
      phase: "shown", // shown | out (fading away) | in (fading back)
      until: 0,
      fadeMs: 400,
    });
  }
  return cells;
}

// Advance the fade cycle: finish fades that are due, then start new ones
// so roughly `changeRate` of the cells are changing at any moment.
export function stepFades(cells, target, difficulty, now) {
  let changed = false;
  const next = cells.map((c) => {
    if (c.phase === "out" && now >= c.until) {
      changed = true;
      return {
        ...c,
        letter: randomDistractor(target, difficulty),
        phase: "in",
        until: now + c.fadeMs,
      };
    }
    if (c.phase === "in" && now >= c.until) {
      changed = true;
      return { ...c, phase: "shown" };
    }
    return c;
  });

  const busy = next.filter((c) => c.phase !== "shown").length;
  const wanted = Math.round(difficulty.changeRate * next.length);
  // Start at most two per step so changes stay staggered, not all at once
  let toStart = Math.min(wanted - busy, 2);
  let attempts = 0;
  while (toStart > 0 && attempts < 50) {
    attempts++;
    const i = Math.floor(Math.random() * next.length);
    const c = next[i];
    if (c.isTarget || c.phase !== "shown") continue;
    const fadeMs = 300 + Math.floor(Math.random() * 500);
    next[i] = { ...c, phase: "out", fadeMs, until: now + fadeMs };
    toStart--;
    changed = true;
  }

  return changed ? next : cells;
}

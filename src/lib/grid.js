const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 7×7 on phones, 8×8 on bigger screens
export function currentGridSize() {
  if (typeof window === "undefined") return 8;
  return window.matchMedia("(max-width: 639px)").matches ? 7 : 8;
}

// A new target from the symbol set, never the same as the last one
export function pickTarget(set, previous) {
  let t;
  do {
    t = pick(set.targets);
  } while (t === previous);
  return t;
}

// A distractor: a symbol, a look-alike, or another random target character.
// It is never the target itself.
export function randomDistractor(target, set, difficulty) {
  const symbolRate = difficulty.symbolRate[set.id] ?? 0;
  if (Math.random() < symbolRate) {
    const lookSymbols = set.symbolLookAlikes[target];
    if (lookSymbols && Math.random() < difficulty.lookAlikeRate) return pick(lookSymbols);
    return pick(set.symbols);
  }

  // Characters with few look-alikes get them less often,
  // so the grid doesn't fill up with one repeated character
  const similar = set.lookAlikes[target];
  const rate = similar ? difficulty.lookAlikeRate * Math.min(1, similar.length / 3) : 0;
  if (similar && Math.random() < rate) return pick(similar);

  let c;
  do {
    c = pick(set.targets);
  } while (c === target);
  return c;
}

// One target in a random cell, everything else a distractor
export function buildGrid(target, size, set, difficulty) {
  const total = size * size;
  const targetIndex = Math.floor(Math.random() * total);
  const cells = [];
  for (let i = 0; i < total; i++) {
    const isTarget = i === targetIndex;
    cells.push({
      id: i,
      letter: isTarget ? target : randomDistractor(target, set, difficulty),
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
export function stepFades(cells, target, set, difficulty, now) {
  let changed = false;
  const next = cells.map((c) => {
    if (c.phase === "out" && now >= c.until) {
      changed = true;
      return {
        ...c,
        letter: randomDistractor(target, set, difficulty),
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

// Keys are prefixed so other games on the same site won't collide.
const BESTS_KEY = "letterhunt.bests";
const MUTED_KEY = "letterhunt.muted";

function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode etc.) — ignore
  }
}

// { beginner: 1180, intermediate: 2340, ... }
export const loadBests = () => read(BESTS_KEY, {});
export const saveBests = (bests) => write(BESTS_KEY, bests);
export const loadMuted = () => read(MUTED_KEY, false);
export const saveMuted = (m) => write(MUTED_KEY, m);

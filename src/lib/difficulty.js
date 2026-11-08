// All tuning for the three challenges lives here.
// changeRate:    share of cells fading/changing at any moment
// lookAlikeRate: chance a new distractor looks like the target (R/P/B, 6/9/8...)
// symbolRate:    chance a new distractor is a symbol, per mode
//                (letters only use "?"; numbers use ! ? $ % & # @ * + =)
export const DIFFICULTIES = [
  {
    id: "beginner",
    name: "Beginner",
    finds: 5,
    seconds: 12,
    changeRate: 0.1,
    lookAlikeRate: 0.15,
    symbolRate: { letters: 0, numbers: 0.08 },
  },
  {
    id: "intermediate",
    name: "Intermediate",
    finds: 7,
    seconds: 10,
    changeRate: 0.2,
    lookAlikeRate: 0.4,
    symbolRate: { letters: 0.04, numbers: 0.15 },
  },
  {
    id: "advanced",
    name: "Advanced",
    finds: 9,
    seconds: 7,
    changeRate: 0.33,
    lookAlikeRate: 0.7,
    symbolRate: { letters: 0.08, numbers: 0.22 },
  },
];

export const DEFAULT_DIFFICULTY = "intermediate";

export function getDifficulty(id) {
  return DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[1];
}

// Scoring
export const POINTS_PER_FIND = 100;
export const POINTS_PER_SECOND_LEFT = 10;

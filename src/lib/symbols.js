// Each mode is a "symbol set": what can be a target, what looks like it,
// and which extra symbols can appear as distractors.
export const SYMBOL_SETS = {
  letters: {
    id: "letters",
    name: "Letters",
    noun: "letter",
    targets: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    lookAlikes: {
      R: ["P", "B", "K"], P: ["R", "B", "F"], B: ["R", "P", "E"],
      E: ["F", "B"], F: ["E", "P", "T"], O: ["Q", "D", "C", "G"],
      Q: ["O", "G"], C: ["G", "O"], G: ["C", "O", "Q"], D: ["O", "B"],
      M: ["N", "W"], N: ["M", "H"], W: ["M", "V"], I: ["L", "T", "J"],
      L: ["I", "T"], T: ["I", "L"], H: ["N"], K: ["R", "X"],
      X: ["K", "Y"], V: ["W", "U", "Y"], U: ["V"],
    },
    symbols: ["?"],
    symbolLookAlikes: {},
  },
  numbers: {
    id: "numbers",
    name: "Numbers",
    noun: "number",
    targets: "0123456789".split(""),
    lookAlikes: {
      0: ["8", "6", "9"], 1: ["7", "4"], 2: ["5", "7", "3"],
      3: ["8", "5", "2"], 4: ["1", "9"], 5: ["6", "3", "2"],
      6: ["9", "8", "0", "5"], 7: ["1", "2"], 8: ["0", "3", "6", "9"],
      9: ["6", "0", "8", "4"],
    },
    symbols: ["!", "?", "$", "%", "&", "#", "@", "*", "+", "="],
    // Symbols that resemble a particular digit
    symbolLookAlikes: {
      0: ["@"], 1: ["!"], 2: ["?"], 5: ["$"], 8: ["&"], 9: ["@"],
    },
  },
};

export const DEFAULT_SET = "letters";

export function getSymbolSet(id) {
  return SYMBOL_SETS[id] ?? SYMBOL_SETS.letters;
}

// Spoken names for screen readers
const SYMBOL_NAMES = {
  "!": "exclamation mark", "?": "question mark", "$": "dollar sign",
  "%": "percent sign", "&": "ampersand", "#": "hash sign", "@": "at sign",
  "*": "asterisk", "+": "plus sign", "=": "equals sign",
};

export function spokenName(ch) {
  return SYMBOL_NAMES[ch] ?? ch;
}

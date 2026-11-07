# Letter Hunt

A fast-paced letter-finding game. Spot the target letter in a shifting grid before the timer runs out, and find enough in a row to complete the challenge.

**Live demo:** [add your Vercel link here]

## How to play

1. Choose a difficulty: Beginner, Intermediate, or Advanced.
2. Find the target letter shown above the grid and tap it.
3. Each find resets the timer and reshuffles the grid with a new target.
4. Letters around the target keep fading and changing while you look. The target never moves or fades.
5. Find enough targets in a row to win. If the timer runs out, your progress resets to zero.

Wrong taps cost nothing, but the timer speeds up as it runs down.

## Difficulties

| | Beginner | Intermediate | Advanced |
|---|---|---|---|
| Targets to find | 5 | 7 | 9 |
| Time per target | 12 s | 10 s | 7 s |
| Letters changing at once | about 1 in 10 | about 1 in 5 | about 1 in 3 |
| Look-alike letters (R/P/B, O/Q/D) | Rare | Some | Many |
| "?" distractor cells | None | A few | More |

## Features

- **Live grid:** letters fade out and return as new ones while the timer runs
- **Look-alike distractors** that get trickier on harder difficulties
- **Responsive grid:** 8×8 on tablets and desktops, 7×7 on phones for easier tapping
- **Scoring:** points per find plus a speed bonus for time left
- **Personal best** saved per difficulty in the browser
- **Sound effects** with a remembered mute setting
- **Confetti** when you complete a challenge
- **Accessible:** keyboard playable, visible focus, and reduced-motion support

## Tech stack

- [React](https://react.dev/) for the UI and game state
- [Vite](https://vitejs.dev/) for the dev server and builds
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [canvas-confetti](https://github.com/catdad/canvas-confetti) for the celebration
- Web Audio API for sound effects (no audio files)
- localStorage for personal bests and settings (no backend)

## Getting started

Requires [Node.js](https://nodejs.org/) 18 or newer.

```bash
git clone https://github.com/SharathKasthala/letter-hunt.git
cd letter-hunt
npm install
npm run dev
```

Then open the local address shown in the terminal (usually http://localhost:5173).

## Build and deploy

```bash
npm run build
```

The production build goes to `dist/`. The project deploys to [Vercel](https://vercel.com/) as a standard Vite app: import the repo, keep the detected settings (build command `npm run build`, output `dist`), and deploy. Every push to `main` redeploys automatically.

## Project structure

```
src/
  App.jsx                 screens, difficulty choice, personal bests
  components/
    Header.jsx            title, difficulty, score, mute button
    StartScreen.jsx       title tiles, difficulty picker, how to play
    GameScreen.jsx        target, round markers, grid, timer, Time's up card
    CompleteScreen.jsx    results and confetti
  lib/
    difficulty.js         all tuning: targets, timing, change rates, scoring
    grid.js               grid building, look-alike letters, fading letters
    sound.js              synthesized sound effects
    storage.js            personal bests and mute setting
```

## Tuning the game

All difficulty and scoring values live in `src/lib/difficulty.js`, so you can rebalance the game without touching the game logic.

## Roadmap

Letter Hunt is one game in a planned collection of mini-games, with a shared home page and game library to come.
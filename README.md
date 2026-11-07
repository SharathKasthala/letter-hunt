# Letter Hunt

Find the target letter before the timer runs out. Each find resets the clock and
reshuffles the grid. Find them all in a row to complete the challenge.

## Run locally

    npm install
    npm run dev

## Build / deploy

    npm run build

Deploys to Vercel as a standard Vite project (build `npm run build`, output `dist`).

## Project structure

    src/
      App.jsx                  screens, difficulty choice, personal bests
      components/
        Header.jsx             title, difficulty, score, mute button
        StartScreen.jsx        title tiles, difficulty picker, how to play
        GameScreen.jsx         target, round markers, grid, timer, Time's up card
        CompleteScreen.jsx     results, confetti
      lib/
        difficulty.js          all tuning: finds, seconds, change rates, scoring
        grid.js                grid building, look-alike letters, fading letters
        sound.js               synthesized sound effects
        storage.js             personal bests and mute setting (localStorage)

## Tuning

Everything about difficulty is in `src/lib/difficulty.js`.

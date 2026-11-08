import { useState } from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import CompleteScreen from "./components/CompleteScreen";
import Header from "./components/Header";
import { DEFAULT_DIFFICULTY, getDifficulty } from "./lib/difficulty";
import { DEFAULT_SET, getSymbolSet } from "./lib/symbols";
import { loadBests, saveBests } from "./lib/storage";
import { isMuted, setMuted, sfx, unlockAudio } from "./lib/sound";

export default function App() {
  const [screen, setScreen] = useState("start"); // start | playing | complete
  const [setId, setSetId] = useState(DEFAULT_SET);
  const [difficultyId, setDifficultyId] = useState(DEFAULT_DIFFICULTY);
  const [bests, setBests] = useState(loadBests);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const [runKey, setRunKey] = useState(0); // changing it restarts the game screen
  const [muted, setMutedState] = useState(isMuted);

  const difficulty = getDifficulty(difficultyId);
  const symbolSet = getSymbolSet(setId);

  // Letters keep their original keys ("intermediate") so earlier bests still count;
  // numbers are stored as "numbers-intermediate".
  const bestKey = (dId, sId = setId) => (sId === "letters" ? dId : `${sId}-${dId}`);
  const bestFor = (dId) => bests[bestKey(dId)];

  function startGame() {
    unlockAudio();
    setScore(0);
    setResult(null);
    setRunKey((k) => k + 1);
    setScreen("playing");
  }

  function handleComplete({ findPoints, speedBonus }) {
    const total = findPoints + speedBonus;
    const key = bestKey(difficulty.id);
    const previous = bests[key] || 0;
    const newBest = total > previous;
    if (newBest) {
      const updated = { ...bests, [key]: total };
      setBests(updated);
      saveBests(updated);
    }
    setResult({ findPoints, speedBonus, total, newBest, best: Math.max(previous, total) });
    sfx.win();
    setScreen("complete");
  }

  function toggleMute() {
    const m = !muted;
    setMuted(m);
    setMutedState(m);
    if (!m) unlockAudio();
  }

  const playing = screen === "playing";

  return (
    <div className="min-h-full flex flex-col">
      <Header
        modeName={playing ? symbolSet.name : null}
        difficultyName={playing ? difficulty.name : null}
        score={playing ? score : null}
        muted={muted}
        onToggleMute={toggleMute}
        onHome={() => setScreen("start")}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 flex flex-col">
        {screen === "start" && (
          <StartScreen
            setId={setId}
            onSelectSet={setSetId}
            difficultyId={difficultyId}
            onSelect={setDifficultyId}
            bestFor={bestFor}
            onPlay={startGame}
          />
        )}

        {playing && (
          <GameScreen
            key={runKey}
            symbolSet={symbolSet}
            difficulty={difficulty}
            onScore={setScore}
            onComplete={handleComplete}
            onRetry={startGame}
            onMenu={() => setScreen("start")}
          />
        )}

        {screen === "complete" && result && (
          <CompleteScreen
            symbolSet={symbolSet}
            difficulty={difficulty}
            result={result}
            onPlayAgain={startGame}
            onMenu={() => setScreen("start")}
          />
        )}
      </main>

      <footer className="py-5 text-center text-sm text-muted">
        Built with <span role="img" aria-label="love">❤️</span> by Sharath Chandra
      </footer>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { buildGrid, currentGridSize, pickTarget, stepFades } from "../lib/grid";
import { POINTS_PER_FIND, POINTS_PER_SECOND_LEFT } from "../lib/difficulty";
import { sfx } from "../lib/sound";

function newRound(previousTarget, difficulty) {
  const size = currentGridSize();
  const target = pickTarget(previousTarget);
  return { target, size, cells: buildGrid(target, size, difficulty) };
}

export default function GameScreen({ difficulty, onScore, onComplete, onRetry, onMenu }) {
  const [round, setRound] = useState(() => newRound(null, difficulty));
  const [finds, setFinds] = useState(0);
  const [points, setPoints] = useState({ findPoints: 0, speedBonus: 0 });
  const [status, setStatus] = useState("playing"); // playing | timeup | done
  const [barLeft, setBarLeft] = useState(1); // 1 = full bar
  const [secondsLeft, setSecondsLeft] = useState(difficulty.seconds);
  const [shake, setShake] = useState(null); // { id, n } of a wrongly tapped cell

  const roundStartRef = useRef(performance.now());
  const lastTickRef = useRef(null);

  // Timer: runs every frame while playing. The bar drains slowly at first,
  // then faster (eased), like the reference.
  useEffect(() => {
    if (status !== "playing") return;
    let raf;
    const loop = () => {
      const elapsed = (performance.now() - roundStartRef.current) / 1000;
      const p = Math.min(1, elapsed / difficulty.seconds);
      const left = Math.max(0, difficulty.seconds - elapsed);
      setBarLeft(1 - p * p);
      setSecondsLeft(left);

      const whole = Math.ceil(left);
      if (left > 0 && whole <= 3 && lastTickRef.current !== whole) {
        lastTickRef.current = whole;
        sfx.tick();
      }

      if (p >= 1) {
        setStatus("timeup");
        sfx.lose();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [status, round.target, difficulty.seconds]);

  // Letters fading out and back in with new letters (never the target)
  useEffect(() => {
    if (status !== "playing") return;
    const id = setInterval(() => {
      setRound((r) => {
        const cells = stepFades(r.cells, r.target, difficulty, performance.now());
        return cells === r.cells ? r : { ...r, cells };
      });
    }, 100);
    return () => clearInterval(id);
  }, [status, difficulty]);

  function handleTap(cell) {
    if (status !== "playing") return;

    if (!cell.isTarget) {
      // No penalty, just feedback
      sfx.miss();
      setShake((s) => ({ id: cell.id, n: (s?.n || 0) + 1 }));
      return;
    }

    sfx.hit();
    const elapsed = (performance.now() - roundStartRef.current) / 1000;
    const left = Math.max(0, difficulty.seconds - elapsed);
    const next = {
      findPoints: points.findPoints + POINTS_PER_FIND,
      speedBonus: points.speedBonus + Math.ceil(left) * POINTS_PER_SECOND_LEFT,
    };
    const nextFinds = finds + 1;
    setPoints(next);
    setFinds(nextFinds);
    onScore(next.findPoints + next.speedBonus);

    if (nextFinds >= difficulty.finds) {
      setStatus("done");
      onComplete(next);
      return;
    }

    // Next round: new target, fresh grid, full timer
    setRound(newRound(round.target, difficulty));
    roundStartRef.current = performance.now();
    lastTickRef.current = null;
    setShake(null);
  }

  const timeUp = status === "timeup";
  const lowTime = status === "playing" && secondsLeft <= 3;
  const targetRow = Math.floor(round.cells.findIndex((c) => c.isTarget) / round.size);
  // Keep the Time's up card away from the revealed target
  const cardAtTop = targetRow >= round.size / 2;

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-5 pt-1 pb-8">
      {/* Target */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted">Find</p>
        <div
          role="img"
          aria-label={`Target letter ${round.target}`}
          className="w-[72px] h-[72px] sm:w-[76px] sm:h-[76px] rounded border-2 border-text bg-panel flex items-center justify-center text-[44px] sm:text-5xl font-bold"
        >
          {round.target}
        </div>
      </div>

      {/* Round markers */}
      <div className="flex items-center gap-3.5">
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: difficulty.finds }, (_, i) => (
            <span
              key={i}
              className={`w-6 sm:w-7 h-1.5 rounded-full ${i < finds ? "bg-miss" : "bg-line"}`}
            />
          ))}
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          <span className="text-text font-bold">{finds}</span> of {difficulty.finds} found
        </p>
      </div>

      {/* Board */}
      <div className="board relative">
        <div className="bg-board rounded px-1.5 sm:px-2 pt-1.5 sm:pt-2">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${round.size}, minmax(0, 1fr))`,
              "--cols": round.size,
            }}
          >
            {round.cells.map((cell) => {
              const shaking = shake?.id === cell.id;
              const showRing = timeUp && cell.isTarget;
              const opacity = timeUp
                ? cell.isTarget ? 1 : 0.18
                : cell.phase === "out" ? 0 : 1;
              return (
                <button
                  key={shaking ? `${cell.id}-${shake.n}` : cell.id}
                  type="button"
                  disabled={status !== "playing"}
                  onClick={() => handleTap(cell)}
                  aria-label={cell.letter === "?" ? "question mark" : cell.letter}
                  className={[
                    "grid-cell aspect-square rounded-sm bg-panel text-text font-medium",
                    "flex items-center justify-center select-none leading-none",
                    status === "playing" ? "cursor-pointer hover:bg-miss hover:text-white" : "",
                    shaking ? "shake" : "",
                    showRing ? "ring-2 ring-inset ring-text" : "",
                  ].join(" ")}
                >
                  <span style={{ opacity, transition: `opacity ${cell.fadeMs}ms ease` }}>
                    {cell.letter}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timer bar */}
          <div className="px-1 pt-3.5 pb-3">
            <div
              className="h-[5px] rounded-full bg-line overflow-hidden"
              role="progressbar"
              aria-label="Time left"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(barLeft * 100)}
            >
              <div
                className={`h-full rounded-full bg-miss ${secondsLeft <= 2 && status === "playing" ? "bar-pulse" : ""}`}
                style={{ width: `${barLeft * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Time's up card */}
        {timeUp && (
          <div
            className={[
              "absolute left-1/2 -translate-x-1/2 w-[340px] max-w-[calc(100%-24px)]",
              "bg-board border border-line rounded-lg p-6 sm:p-7 flex flex-col items-center gap-3 text-center",
              "shadow-[0_24px_60px_rgba(0,0,0,0.55)]",
              cardAtTop ? "top-[6%]" : "bottom-[12%]",
            ].join(" ")}
          >
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Time's up</h2>
            <p className="text-[15px] sm:text-base leading-relaxed text-[#d4d6da]">
              You had {finds} of {difficulty.finds}. Progress resets to 0, and the target is
              marked so you can see where it was.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 mt-2">
              <button
                type="button"
                onClick={onRetry}
                className="h-12 px-7 rounded-md bg-text text-ink font-bold cursor-pointer hover:bg-white"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={onMenu}
                className="h-12 px-6 rounded-md border border-line font-medium cursor-pointer hover:border-muted"
              >
                Menu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Helper line */}
      <p className={`text-sm ${lowTime ? "text-alert font-medium" : "text-muted"}`}>
        {lowTime ? "Hurry, time is low" : "Wrong taps cost nothing. The timer speeds up as it runs down."}
      </p>
    </div>
  );
}

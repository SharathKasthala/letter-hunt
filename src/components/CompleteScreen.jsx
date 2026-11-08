import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function CompleteScreen({ difficulty, result, onPlayAgain, onMenu }) {
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    confetti({
      particleCount: 140,
      spread: 85,
      origin: { y: 0.55 },
      colors: ["#dc2440", "#f2f2f2", "#8b8d93", "#ff4d5e"],
    });
  }, []);

  const rows = [
    ["Targets found", `+${result.findPoints}`],
    ["Speed bonus", `+${result.speedBonus}`],
  ];

  return (
    <div className="flex flex-col items-center text-center gap-7 py-8 sm:py-14 w-full">
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: difficulty.finds }, (_, i) => (
            <span key={i} className="w-6 sm:w-7 h-1.5 rounded-full bg-miss" />
          ))}
        </div>
        <p className="text-[15px] text-muted">{difficulty.name}</p>
        <h1 className="text-[44px] sm:text-[64px] font-black tracking-tight leading-none">
          Challenge complete
        </h1>
        <p className="text-base sm:text-[17px] text-soft">
          {difficulty.finds} of {difficulty.finds} found in a row.
        </p>
      </div>

      <dl className="w-full max-w-[400px] bg-board rounded-lg px-6 py-2 text-left">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between py-3 border-b border-line">
            <dt className="text-[15px] text-[#a3a5ab]">{label}</dt>
            <dd className="text-[15px] font-bold">{value}</dd>
          </div>
        ))}
        <div className="flex justify-between py-3 border-b border-line">
          <dt className="text-[15px] text-[#a3a5ab]">Total score</dt>
          <dd className="text-xl font-black">{result.total.toLocaleString()}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-[15px] text-[#a3a5ab]">{difficulty.name} best</dt>
          <dd className="text-[15px] font-bold">{result.best.toLocaleString()}</dd>
        </div>
      </dl>

      {result.newBest && <p className="font-medium">New personal best</p>}

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={onPlayAgain}
          className="h-14 px-9 rounded-md bg-text text-ink text-lg font-bold cursor-pointer hover:bg-white active:scale-[0.98] transition"
        >
          Play again
        </button>
        <button
          type="button"
          onClick={onMenu}
          className="h-14 px-7 rounded-md border border-line text-lg font-medium cursor-pointer hover:border-muted"
        >
          Menu
        </button>
      </div>
    </div>
  );
}

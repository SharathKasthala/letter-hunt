import { DIFFICULTIES } from "../lib/difficulty";

const TITLE = [
  [["L"], ["E"], ["T", "dim"], ["T"], ["E"], ["R"]],
  [["H"], ["U", "hot"], ["N"], ["T"]],
];

export default function StartScreen({ difficultyId, onSelect, bests, onPlay }) {
  return (
    <div className="flex flex-col items-center gap-8 sm:gap-10 py-6 sm:py-10">
      {/* Title spelled in grid tiles */}
      <div role="img" aria-label="Letter Hunt" className="flex flex-col items-center gap-1.5 sm:gap-2">
        {TITLE.map((row, r) => (
          <div key={r} className="flex gap-1.5">
            {row.map(([ch, kind], i) => (
              <span
                key={i}
                className={[
                  "w-11 h-11 sm:w-[76px] sm:h-[76px] rounded flex items-center justify-center",
                  "text-2xl sm:text-[44px] font-bold",
                  kind === "hot" ? "bg-miss text-white" : "bg-panel text-text",
                  kind === "dim" ? "opacity-45" : "",
                ].join(" ")}
              >
                {ch}
              </span>
            ))}
          </div>
        ))}
      </div>

      <p className="max-w-md text-center text-base sm:text-lg leading-relaxed text-soft">
        Find the letter before the timer runs out. Each find resets the clock and
        reshuffles the grid.
      </p>

      {/* Difficulty picker */}
      <div className="w-full max-w-3xl flex flex-col items-center gap-5">
        <fieldset className="w-full">
          <legend className="mx-auto mb-3 text-[15px] text-muted">Choose a difficulty</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DIFFICULTIES.map((d) => {
              const on = d.id === difficultyId;
              const best = bests[d.id];
              return (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onSelect(d.id)}
                  className={[
                    "text-left px-5 py-4 rounded-md border-2 flex flex-col gap-1.5 cursor-pointer transition-colors",
                    on ? "bg-panel border-text" : "bg-board border-line hover:border-muted",
                  ].join(" ")}
                >
                  <span className="text-lg font-bold">{d.name}</span>
                  <span className="text-sm text-soft">
                    Find {d.finds}, {d.seconds} seconds each
                  </span>
                  <span className="text-[13px] text-muted mt-1">
                    Best {best ? best.toLocaleString() : "none yet"}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={onPlay}
          className="min-w-[220px] h-14 px-8 rounded-md bg-text text-ink text-lg font-bold cursor-pointer hover:bg-white active:scale-[0.98] transition"
        >
          Play
        </button>
      </div>

      {/* How to play */}
      <ol className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          "Spot the target letter shown above the grid.",
          "Letters keep changing while you look. The target stays put.",
          "Find them all in a row. Run out of time and you start over.",
        ].map((text, i) => (
          <li key={i} className="bg-board rounded-md px-5 py-4 flex gap-3.5 items-start">
            <span className="text-[15px] font-bold">{i + 1}</span>
            <span className="text-[15px] leading-snug text-[#d4d6da]">{text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

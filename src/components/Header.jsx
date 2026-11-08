export default function Header({ modeName, difficultyName, score, muted, onToggleMute, onHome }) {
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-8 py-3 sm:py-5">
      <button
        type="button"
        onClick={onHome}
        className="text-lg sm:text-xl font-bold tracking-tight cursor-pointer"
      >
        Letter Hunt
      </button>

      <div className="flex items-center gap-4 sm:gap-6">
        {difficultyName && (
          <p className="text-sm sm:text-[15px] font-medium">
            {difficultyName}
            {modeName && <span className="text-muted font-normal"> {modeName.toLowerCase()}</span>}
          </p>
        )}
        {score !== null && (
          <p className="hidden sm:block text-[15px] text-muted">
            Score <span className="text-text font-bold">{score}</span>
          </p>
        )}
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className="w-11 h-11 rounded-md border border-line bg-board flex items-center justify-center cursor-pointer hover:border-muted"
        >
          <SoundIcon muted={muted} />
        </button>
      </div>
    </header>
  );
}

function SoundIcon({ muted }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      {muted ? (
        <>
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 5a10 10 0 0 1 0 14" />
        </>
      )}
    </svg>
  );
}

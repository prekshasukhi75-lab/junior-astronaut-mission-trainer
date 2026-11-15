import { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Compass,
  RotateCcw,
  Scale,
  XCircle,
} from 'lucide-react';
import {
  LUNAR_BASE_OPTIONS,
  TEMPERATURE_GAME_ROUNDS,
  type LunarBaseSiteId,
  type TemperatureZoneChoice,
} from '../../data/moonTemperatureData';

const ZONE_CHOICE_LABELS: Record<TemperatureZoneChoice, string> = {
  'direct-sunlight': 'Sunlit Lunar Plain (Direct Sunlight)',
  'permanent-shadow': 'Permanently Shadowed Polar Crater',
  'extreme-cold': 'Dark Lunar Night Side (Extreme Cold)',
};

function TemperatureZoneClueGraphic({
  type,
}: {
  type: TemperatureZoneChoice;
}) {
  if (type === 'direct-sunlight') {
    return (
      <svg
        viewBox="0 0 280 120"
        aria-hidden="true"
        className="h-28 w-full rounded-lg border border-slate-800 bg-[#050811]"
      >
        <line x1="36" y1="18" x2="96" y2="74" stroke="#FBBF24" strokeWidth="2.5" />
        <line x1="88" y1="14" x2="148" y2="70" stroke="#FBBF24" strokeWidth="2.5" />
        <line x1="140" y1="14" x2="200" y2="70" stroke="#FBBF24" strokeWidth="2.5" />
        <path
          d="M 10 82 Q 140 68 270 82 L 270 120 L 10 120 Z"
          fill="#D97706"
          fillOpacity="0.45"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  if (type === 'permanent-shadow') {
    return (
      <svg
        viewBox="0 0 280 120"
        aria-hidden="true"
        className="h-28 w-full rounded-lg border border-slate-800 bg-[#050811]"
      >
        <line x1="12" y1="30" x2="268" y2="40" stroke="#FBBF24" strokeWidth="2" strokeDasharray="5 4" />
        <path
          d="M 10 60 L 66 44 L 100 100 L 180 100 L 214 44 L 270 60 L 270 120 L 10 120 Z"
          fill="#0F172A"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <rect x="102" y="88" width="76" height="10" rx="4" fill="#22D3EE" fillOpacity="0.35" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 280 120"
      aria-hidden="true"
      className="h-28 w-full rounded-lg border border-slate-800 bg-[#050811]"
    >
      <circle cx="222" cy="34" r="14" fill="#38BDF8" opacity="0.7" />
      <circle cx="52" cy="28" r="1.5" fill="#94A3B8" />
      <circle cx="110" cy="22" r="1.5" fill="#94A3B8" />
      <path
        d="M 10 86 Q 90 74 170 86 Q 220 94 270 80 L 270 120 L 10 120 Z"
        fill="#0F172A"
        stroke="#334155"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function MoonTemperatureGames() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [answersByRound, setAnswersByRound] = useState<
    Record<string, TemperatureZoneChoice>
  >({});
  const [selectedBaseId, setSelectedBaseId] =
    useState<LunarBaseSiteId>('polar-region');

  const currentRound = TEMPERATURE_GAME_ROUNDS[roundIndex];
  const currentAnswer = answersByRound[currentRound.id];
  const isCorrect = currentAnswer === currentRound.correctChoice;

  const totalPoints = TEMPERATURE_GAME_ROUNDS.reduce((sum, round) => {
    return sum + (answersByRound[round.id] === round.correctChoice ? 100 : 0);
  }, 0);

  const selectedBase =
    LUNAR_BASE_OPTIONS.find((item) => item.id === selectedBaseId) ??
    LUNAR_BASE_OPTIONS[0];

  const handleSelectZone = (choice: TemperatureZoneChoice) => {
    setAnswersByRound((prev) => ({
      ...prev,
      [currentRound.id]: choice,
    }));
  };

  const handleResetGame = () => {
    setAnswersByRound({});
    setRoundIndex(0);
  };

  return (
    <div className="bg-[#080D1B]">
      {/* Section 6: Temperature Explorer Game */}
      <section
        id="guess-temperature-zone"
        aria-labelledby="guess-zone-heading"
        className="border-b border-slate-800/80 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs tracking-wider text-cyan-400">
                Temperature Explorer Game · 3 Lunar Clues
              </p>
              <h2
                id="guess-zone-heading"
                className="mt-2 font-display text-2xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-3xl lg:text-4xl"
              >
                GUESS THE TEMPERATURE ZONE
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-[#0B1120] px-4 py-2">
                <Award className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span className="text-xs text-slate-300">Score:</span>
                <span className="font-mono text-sm font-bold text-white tabular-nums">
                  {totalPoints} / 300
                </span>
              </div>

              <button
                type="button"
                onClick={handleResetGame}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B1120] px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-400/70 hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset Game</span>
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div className="flex flex-wrap gap-2">
                {TEMPERATURE_GAME_ROUNDS.map((round, idx) => {
                  const active = idx === roundIndex;
                  const ans = answersByRound[round.id];
                  const right = ans === round.correctChoice;
                  return (
                    <button
                      key={round.id}
                      type="button"
                      onClick={() => setRoundIndex(idx)}
                      className={`min-h-[40px] rounded-md border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                          : 'border-slate-800 bg-[#060913] text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>Clue {idx + 1}</span>
                      {ans && (
                        <span
                          className={`ml-2 font-mono ${
                            right ? 'text-emerald-400' : 'text-amber-300'
                          }`}
                        >
                          {right ? '✓' : '·'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="font-mono text-xs text-slate-400 tabular-nums">
                Answered: {Object.keys(answersByRound).length} of{' '}
                {TEMPERATURE_GAME_ROUNDS.length}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <p className="font-mono text-xs text-cyan-300">
                  {currentRound.clueTitle}
                </p>
                <div className="mt-3">
                  <TemperatureZoneClueGraphic type={currentRound.visualType} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-white sm:text-xl">
                  {currentRound.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                  {currentRound.clueDescription}
                </p>
              </div>

              <div className="flex flex-col justify-between lg:col-span-6">
                <div className="flex flex-col gap-3">
                  {(
                    ['direct-sunlight', 'permanent-shadow', 'extreme-cold'] as const
                  ).map((choice) => {
                    const isSelected = currentAnswer === choice;
                    const isRight =
                      currentAnswer && currentRound.correctChoice === choice;
                    return (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => handleSelectZone(choice)}
                        aria-pressed={isSelected}
                        className={`flex min-h-[48px] items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? isRight
                              ? 'border-emerald-400 bg-emerald-500/15 text-emerald-100'
                              : 'border-rose-400 bg-rose-500/15 text-rose-100'
                            : 'border-slate-800 bg-[#060913] text-slate-200 hover:border-cyan-400/60 hover:bg-[#0D1528]'
                        }`}
                      >
                        <span>{ZONE_CHOICE_LABELS[choice]}</span>
                        {isSelected && (
                          <span className="font-mono text-xs">
                            {isRight ? '+100 pts' : 'Try again'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {currentAnswer && (
                  <div
                    role="status"
                    className={`mt-5 rounded-lg border p-4 ${
                      isCorrect
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100'
                        : 'border-amber-500/50 bg-amber-500/10 text-amber-100'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2
                          className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <XCircle
                          className="mt-0.5 h-5 w-5 shrink-0 text-amber-300"
                          aria-hidden="true"
                        />
                      )}
                      <div>
                        <p className="text-sm font-bold">
                          {isCorrect
                            ? 'Correct! +100 Points'
                            : 'Not Quite — Check the Visual Clue'}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed sm:text-sm">
                          {isCorrect
                            ? currentRound.explanation
                            : 'Look closely at whether sunlight shines directly on the ground, gets blocked by tall crater rims, or is missing during lunar night.'}
                        </p>
                      </div>
                    </div>

                    {roundIndex < TEMPERATURE_GAME_ROUNDS.length - 1 && (
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setRoundIndex((prev) => prev + 1)}
                          className="min-h-[40px] rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#F04A3E] cursor-pointer"
                        >
                          Next Clue
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Build Your Lunar Base Challenge */}
      <section
        id="build-lunar-base"
        aria-labelledby="base-challenge-heading"
        className="border-b border-slate-800/80 bg-[#060913] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs tracking-wider text-cyan-400">
              Engineering Trade-Offs · Mission Planning
            </p>
            <h2
              id="base-challenge-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-3xl lg:text-4xl"
            >
              BUILD YOUR LUNAR BASE CHALLENGE
            </h2>
            <p className="mt-4 rounded-xl border border-slate-800 bg-[#0B1120] p-5 text-base font-medium leading-relaxed text-white sm:text-lg">
              “You are the commander of a lunar exploration mission. Your crew needs a safe
              location to build a research base.”
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Compare all three sites—every lunar location brings both advantages and real
              scientific challenges.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {LUNAR_BASE_OPTIONS.map((site, idx) => {
              const isSelected = site.id === selectedBase.id;
              return (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => setSelectedBaseId(site.id)}
                  aria-pressed={isSelected}
                  className={`flex flex-col justify-between rounded-xl border p-5 text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-[#101A33]'
                      : 'border-slate-800/90 bg-[#0B1120] hover:border-slate-700 hover:bg-[#0E1629]'
                  }`}
                >
                  <div>
                    <p className="font-mono text-xs text-cyan-300">
                      Candidate Site 0{idx + 1}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-bold text-white">
                      {site.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-300">{site.subtitle}</p>
                  </div>

                  <span className="mt-5 font-mono text-xs text-cyan-300">
                    {isSelected ? 'Viewing Site Trade-Offs' : 'Inspect Site Trade-Offs'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Balanced Site Evaluation Panel */}
          <div className="mt-6 rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <Compass
                className="mt-1 h-5 w-5 shrink-0 text-cyan-400"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                  {selectedBase.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-200 sm:text-base">
                  {selectedBase.overview}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-800/80 pt-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-800 bg-[#060913] p-4">
                <p className="font-mono text-xs text-cyan-300">Sunlight</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-200 sm:text-sm">
                  {selectedBase.sunlight}
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-[#060913] p-4">
                <p className="font-mono text-xs text-cyan-300">Temperature</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-200 sm:text-sm">
                  {selectedBase.temperature}
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-[#060913] p-4">
                <p className="font-mono text-xs text-cyan-300">Energy</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-200 sm:text-sm">
                  {selectedBase.energy}
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-[#060913] p-4">
                <p className="font-mono text-xs text-cyan-300">Water Ice Access</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-200 sm:text-sm">
                  {selectedBase.waterIce}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-slate-800 bg-[#060913] p-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
              <Scale className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
              <span>{selectedBase.tradeOffSummary}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState } from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import {
  IDENTIFY_EVENT_ROUNDS,
  MISSION_CHALLENGE_OPTIONS,
  type SolarEventChoice,
} from '../../data/solarActivityData';

const CHOICE_LABELS: Record<SolarEventChoice, string> = {
  flare: 'Solar Flare',
  cme: 'Coronal Mass Ejection',
  sep: 'Solar Energetic Particle Event',
};

function EventClueIllustration({ type }: { type: SolarEventChoice }) {
  if (type === 'flare') {
    return (
      <svg
        viewBox="0 0 280 120"
        aria-hidden="true"
        className="h-28 w-full rounded-lg border border-slate-800 bg-[#050811]"
      >
        <ellipse cx="140" cy="145" rx="150" ry="60" fill="#B45309" opacity="0.7" />
        <circle cx="140" cy="76" r="24" fill="#FDE047" opacity="0.35" />
        <circle cx="140" cy="76" r="10" fill="#FEF08A" />
        <line x1="140" y1="76" x2="225" y2="28" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="5 4" />
        <line x1="140" y1="76" x2="55" y2="28" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="5 4" />
        <line x1="140" y1="76" x2="140" y2="14" stroke="#BAE6FD" strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    );
  }
  if (type === 'cme') {
    return (
      <svg
        viewBox="0 0 280 120"
        aria-hidden="true"
        className="h-28 w-full rounded-lg border border-slate-800 bg-[#050811]"
      >
        <circle cx="72" cy="60" r="20" fill="#F59E0B" />
        <circle cx="72" cy="60" r="14" fill="#0B1120" />
        <path
          d="M 96 42 C 145 14, 210 20, 232 60 C 210 100, 145 106, 96 78 Z"
          fill="#22D3EE"
          fillOpacity="0.22"
          stroke="#22D3EE"
          strokeWidth="2"
        />
        <path
          d="M 102 50 C 138 34, 182 38, 198 60 C 182 82, 138 86, 102 70"
          fill="none"
          stroke="#67E8F9"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 280 120"
      aria-hidden="true"
      className="h-28 w-full rounded-lg border border-slate-800 bg-[#050811]"
    >
      <line x1="20" y1="30" x2="175" y2="30" stroke="#FBBF24" strokeWidth="2" strokeDasharray="8 5" />
      <line x1="30" y1="54" x2="180" y2="54" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="10 4" />
      <line x1="18" y1="80" x2="175" y2="80" stroke="#FBBF24" strokeWidth="2" strokeDasharray="8 5" />
      <circle cx="176" cy="30" r="3" fill="#FEF08A" />
      <circle cx="182" cy="54" r="3.5" fill="#FEF08A" />
      <circle cx="176" cy="80" r="3" fill="#FEF08A" />
      <rect x="200" y="34" width="46" height="52" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
      <rect x="210" y="46" width="26" height="28" rx="4" fill="#0F172A" stroke="#64748B" strokeWidth="1" />
    </svg>
  );
}

export function SolarLearningGames() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [answersByRound, setAnswersByRound] = useState<
    Record<string, SolarEventChoice>
  >({});
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);

  const currentRound = IDENTIFY_EVENT_ROUNDS[roundIndex];
  const currentAnswer = answersByRound[currentRound.id];
  const isRoundCorrect = currentAnswer === currentRound.correctAnswer;

  const totalPoints = IDENTIFY_EVENT_ROUNDS.reduce((sum, round) => {
    return sum + (answersByRound[round.id] === round.correctAnswer ? 100 : 0);
  }, 0);

  const answeredCount = Object.keys(answersByRound).length;

  const handleSelectChoice = (choice: SolarEventChoice) => {
    setAnswersByRound((prev) => ({
      ...prev,
      [currentRound.id]: choice,
    }));
  };

  const handleResetGame = () => {
    setAnswersByRound({});
    setRoundIndex(0);
  };

  const selectedChallengeOption = MISSION_CHALLENGE_OPTIONS.find(
    (option) => option.id === selectedDecisionId
  );

  return (
    <div className="bg-[#060913]">
      {/* Section 7: Interactive Mini-Game — Identify the Solar Event */}
      <section
        id="identify-solar-event"
        aria-labelledby="identify-game-heading"
        className="border-b border-slate-800/80 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs tracking-wider text-cyan-400">
                Interactive Learning Activity · 3 Rounds
              </p>
              <h2
                id="identify-game-heading"
                className="mt-2 font-display text-2xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-3xl lg:text-4xl"
              >
                IDENTIFY THE SOLAR EVENT
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-[#0B1120] px-4 py-2">
                <Award className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span className="text-xs text-slate-300">Learning Points:</span>
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
            {/* Round Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div className="flex flex-wrap gap-2">
                {IDENTIFY_EVENT_ROUNDS.map((round, idx) => {
                  const active = idx === roundIndex;
                  const answered = answersByRound[round.id];
                  const correct = answered === round.correctAnswer;
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
                      <span>Event {idx + 1}</span>
                      {answered && (
                        <span
                          className={`ml-2 font-mono ${
                            correct ? 'text-emerald-400' : 'text-amber-300'
                          }`}
                        >
                          {correct ? '✓' : '·'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="font-mono text-xs text-slate-400 tabular-nums">
                Completed: {answeredCount} of {IDENTIFY_EVENT_ROUNDS.length}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Clue & Visual Diagram */}
              <div className="lg:col-span-6">
                <p className="font-mono text-xs text-cyan-300">
                  {currentRound.promptTitle}
                </p>
                <div className="mt-3">
                  <EventClueIllustration type={currentRound.correctAnswer} />
                </div>
                <p className="mt-2 font-mono text-xs text-slate-400">
                  Visual Cue: {currentRound.visualCue}
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-100">
                  {currentRound.clueText}
                </p>
              </div>

              {/* Answer Choices & Feedback */}
              <div className="flex flex-col justify-between lg:col-span-6">
                <div>
                  <p className="text-xs font-medium text-slate-300">
                    Which solar event matches this clue?
                  </p>
                  <div className="mt-3 flex flex-col gap-3">
                    {(['flare', 'cme', 'sep'] as const).map((choice) => {
                      const isSelected = currentAnswer === choice;
                      const isRightOption =
                        currentAnswer && currentRound.correctAnswer === choice;
                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => handleSelectChoice(choice)}
                          aria-pressed={isSelected}
                          className={`flex min-h-[48px] items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${
                            isSelected
                              ? isRightOption
                                ? 'border-emerald-400 bg-emerald-500/15 text-emerald-100'
                                : 'border-rose-400 bg-rose-500/15 text-rose-100'
                              : 'border-slate-800 bg-[#060913] text-slate-200 hover:border-cyan-400/60 hover:bg-[#0D1528]'
                          }`}
                        >
                          <span>{CHOICE_LABELS[choice]}</span>
                          {isSelected && (
                            <span className="font-mono text-xs">
                              {isRightOption ? '+100 pts' : 'Try again'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {currentAnswer && (
                  <div
                    role="status"
                    className={`mt-5 rounded-lg border p-4 ${
                      isRoundCorrect
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100'
                        : 'border-amber-500/50 bg-amber-500/10 text-amber-100'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isRoundCorrect ? (
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
                          {isRoundCorrect
                            ? 'Correct! +100 Learning Points'
                            : `Not Quite — You selected ${CHOICE_LABELS[currentAnswer]}`}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed sm:text-sm">
                          {isRoundCorrect
                            ? currentRound.explanation
                            : 'Read the clue again: think about whether it describes a flash of light, an expanding plasma cloud, or fast-moving radiation particles.'}
                        </p>
                      </div>
                    </div>

                    {roundIndex < IDENTIFY_EVENT_ROUNDS.length - 1 && (
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setRoundIndex((prev) => prev + 1)}
                          className="min-h-[40px] rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#F04A3E] cursor-pointer"
                        >
                          Next Event
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

      {/* Section 8: Space Weather Mission Challenge */}
      <section
        id="mission-challenge"
        aria-labelledby="challenge-heading"
        className="border-b border-slate-800/80 bg-[#080D1B] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs tracking-wider text-cyan-400">
              Decision Scenario · Simplified Educational Simulation
            </p>
            <h2
              id="challenge-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-3xl lg:text-4xl"
            >
              SPACE WEATHER MISSION CHALLENGE
            </h2>
            <p className="mt-4 rounded-xl border border-slate-800 bg-[#0B1120] p-5 text-base font-medium leading-relaxed text-white sm:text-lg">
              “You are part of a lunar astronaut team. Mission Control has issued a
              space-weather warning. What should your team do?”
            </p>
            <p className="mt-2 font-mono text-xs text-slate-400">
              Note: This is a simplified educational decision simulation, not a real-time
              radiation prediction.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {MISSION_CHALLENGE_OPTIONS.map((option, idx) => {
              const isSelected = selectedDecisionId === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedDecisionId(option.id)}
                  aria-pressed={isSelected}
                  className={`flex flex-col justify-between rounded-xl border p-5 text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? option.isRecommended
                        ? 'border-emerald-400 bg-emerald-500/10'
                        : 'border-amber-400 bg-amber-500/10'
                      : 'border-slate-800/90 bg-[#0B1120] hover:border-cyan-400/60 hover:bg-[#0E1629]'
                  }`}
                >
                  <div>
                    <p className="font-mono text-xs text-cyan-300">
                      Option 0{idx + 1}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-bold text-white">
                      {option.label}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {option.summary}
                    </p>
                  </div>

                  <span className="mt-5 font-mono text-xs text-slate-400">
                    {isSelected ? 'Selected Decision' : 'Select Decision'}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedChallengeOption && (
            <div
              role="status"
              className={`mt-6 rounded-xl border p-6 ${
                selectedChallengeOption.isRecommended
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-amber-500/50 bg-amber-500/10'
              }`}
            >
              <div className="flex items-start gap-3">
                {selectedChallengeOption.isRecommended ? (
                  <ShieldCheck
                    className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                ) : (
                  <AlertTriangle
                    className="mt-0.5 h-6 w-6 shrink-0 text-amber-300"
                    aria-hidden="true"
                  />
                )}
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {selectedChallengeOption.outcomeTitle}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-100 sm:text-base">
                    {selectedChallengeOption.consequence}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

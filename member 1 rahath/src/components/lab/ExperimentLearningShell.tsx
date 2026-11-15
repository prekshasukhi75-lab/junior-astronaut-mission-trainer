import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Eye,
  FlaskConical,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { LabExperimentDefinition } from '../../types/spaceLab';

interface ExperimentLearningShellProps {
  experiment: LabExperimentDefinition;
  isCompleted: boolean;
  bestQuizScore: number | undefined;
  liveObservation: string;
  onBackToLab: () => void;
  onCompleteQuiz: (scoreOutOfThree: number) => {
    newlyCompleted: boolean;
    pointsGained: number;
  };
  children: ReactNode;
}

export function ExperimentLearningShell({
  experiment,
  isCompleted,
  bestQuizScore,
  liveObservation,
  onBackToLab,
  onCompleteQuiz,
  children,
}: ExperimentLearningShellProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [celebrationBanner, setCelebrationBanner] = useState<{
    score: number;
    newlyCompleted: boolean;
    pointsGained: number;
  } | null>(null);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setCelebrationBanner(null);
  }, [experiment.id]);

  const allAnswered = experiment.quiz.every(
    (q) => typeof answers[q.id] === 'number'
  );

  const currentScore = experiment.quiz.reduce((sum, q) => {
    return sum + (answers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    const outcome = onCompleteQuiz(currentScore);
    setCelebrationBanner({
      score: currentScore,
      newlyCompleted: outcome.newlyCompleted,
      pointsGained: outcome.pointsGained,
    });
  };

  const handleRetryQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setCelebrationBanner(null);
  };

  return (
    <div className="bg-[#060913] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Station Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onBackToLab}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-md border border-slate-700/80 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-slate-100 whitespace-nowrap shrink-0 transition-colors hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to Space Science Lab</span>
            </button>

            <span className="font-mono text-xs text-cyan-300">
              {experiment.stationNumber} <span aria-hidden="true">·</span>{' '}
              {experiment.discipline}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-[#0B1120] px-3.5 py-2 text-xs">
              <Award
                className={`h-4 w-4 ${
                  isCompleted ? 'text-emerald-400' : 'text-cyan-400'
                }`}
                aria-hidden="true"
              />
              <span className="text-slate-300">Badge:</span>
              <span className="font-semibold text-white">
                {experiment.badgeTitle}
              </span>
              <span
                className={`font-mono ${
                  isCompleted ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                ({isCompleted ? 'Unlocked' : 'Locked'})
              </span>
            </div>

            {typeof bestQuizScore === 'number' && (
              <div className="rounded-lg border border-slate-800 bg-[#0B1120] px-3.5 py-2 font-mono text-xs text-cyan-300 tabular-nums">
                Best Quiz: {bestQuizScore} / 3
              </div>
            )}
          </div>
        </div>

        {/* Station Title */}
        <div className="mt-8 max-w-3xl">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-4xl lg:text-5xl">
            {experiment.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-300 sm:text-lg">
            {experiment.tagline}
          </p>
        </div>

        {/* Parts 1, 2, 3: What are we learning? | Scientific concept | Experiment instructions */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <article className="rounded-xl border border-slate-800/90 bg-[#0B1120] p-5 lg:col-span-4">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>1. What Are We Learning?</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">
              {experiment.whatWeLearn}
            </p>
          </article>

          <article className="rounded-xl border border-slate-800/90 bg-[#0B1120] p-5 lg:col-span-4">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
              <span>2. Scientific Concept</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">
              {experiment.scientificConcept}
            </p>
          </article>

          <article className="rounded-xl border border-slate-800/90 bg-[#0B1120] p-5 lg:col-span-4">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              <span>3. Experiment Instructions</span>
            </div>
            <ol className="mt-3 space-y-2 text-xs leading-relaxed text-slate-200 sm:text-sm">
              {experiment.instructions.map((step, idx) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="font-mono font-bold text-cyan-300">
                    0{idx + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>

        {/* Part 4: Interactive Experiment Stage */}
        <section
          aria-label="Interactive experiment workbench"
          className="mt-8 rounded-xl border border-cyan-500/35 bg-[#080D1B] p-4 sm:p-6 lg:p-8"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
            <p className="font-mono text-xs text-cyan-300">
              4. Interactive Experiment Workbench
            </p>
            <span className="font-mono text-xs text-slate-400">
              Educational Physics Simulation · Adjust controls below
            </span>
          </div>
          {children}
        </section>

        {/* Parts 5 & 6: What did you observe? + Did you know? */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <article className="rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 lg:col-span-6">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>5. What Did You Observe?</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white sm:text-base">
              {liveObservation}
            </p>
            <p className="mt-3 border-t border-slate-800/80 pt-3 text-xs leading-relaxed text-slate-400">
              Lab Hint: {experiment.observationGuidance}
            </p>
          </article>

          <article className="rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 lg:col-span-6">
            <div className="flex items-center gap-2 font-mono text-xs text-amber-300">
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              <span>6. Did You Know?</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-100 sm:text-base">
              {experiment.didYouKnow}
            </p>
            <p className="mt-3 border-t border-slate-800/80 pt-3 font-mono text-xs text-slate-400">
              Source: {experiment.didYouKnowSource}
            </p>
          </article>
        </div>

        {/* Part 7: Three-Question Mini Quiz */}
        <section
          aria-labelledby="lab-quiz-heading"
          className="mt-8 rounded-xl border border-slate-800/90 bg-[#0B1120] p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <p className="inline-flex items-center gap-2 font-mono text-xs text-cyan-300">
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
                <span>7. Three-Question Mini Quiz · Earn Your Badge</span>
              </p>
              <h2
                id="lab-quiz-heading"
                className="mt-1.5 font-display text-2xl font-bold text-white"
              >
                TEST YOUR DISCOVERY
              </h2>
            </div>

            {submitted && (
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-cyan-300 tabular-nums">
                  Score: {currentScore} / 3
                </span>
                <button
                  type="button"
                  onClick={handleRetryQuiz}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-slate-700 bg-[#060913] px-3.5 py-2 text-xs font-semibold text-white hover:border-cyan-400/70 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Try Quiz Again</span>
                </button>
              </div>
            )}
          </div>

          {celebrationBanner && (
            <div
              role="status"
              className="mt-6 flex flex-col gap-3 rounded-xl border border-emerald-400/50 bg-emerald-500/10 p-5 text-emerald-100 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <Sparkles
                  className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {celebrationBanner.newlyCompleted
                      ? `Badge Unlocked: ${experiment.badgeTitle}!`
                      : `Experiment Completed (${celebrationBanner.score} / 3 Correct)`}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed sm:text-sm">
                    You scored {celebrationBanner.score} out of 3 on the{' '}
                    {experiment.shortTitle} checkpoint.
                    {celebrationBanner.pointsGained > 0
                      ? ` +${celebrationBanner.pointsGained} Science Points added to your lab record!`
                      : ' Your progress and best quiz score are saved.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onBackToLab}
                className="inline-flex min-h-[40px] shrink-0 items-center rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white hover:bg-[#F04A3E] cursor-pointer"
              >
                Return to Lab Hub
              </button>
            </div>
          )}

          <div className="mt-6 space-y-6">
            {experiment.quiz.map((q, qIndex) => {
              const chosen = answers[q.id];
              const isCorrect = chosen === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-800 bg-[#060913] p-5"
                >
                  <p className="font-mono text-xs text-cyan-300">
                    Question 0{qIndex + 1}
                  </p>
                  <h3 className="mt-1.5 font-display text-base font-bold text-white sm:text-lg">
                    {q.question}
                  </h3>

                  <div className="mt-4 grid grid-cols-1 gap-2.5 md:grid-cols-3">
                    {q.options.map((opt, optIdx) => {
                      const selected = chosen === optIdx;
                      const showRight = submitted && optIdx === q.correctIndex;
                      const showWrong =
                        submitted && selected && optIdx !== q.correctIndex;

                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={submitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          aria-pressed={selected}
                          className={`flex min-h-[48px] items-center justify-between gap-2 rounded-lg border px-4 py-2.5 text-left text-xs font-semibold transition-colors sm:text-sm ${
                            showRight
                              ? 'border-emerald-400 bg-emerald-500/15 text-emerald-100'
                              : showWrong
                                ? 'border-rose-400 bg-rose-500/15 text-rose-100'
                                : selected
                                  ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100'
                                  : 'border-slate-800 bg-[#0B1120] text-slate-200 hover:border-cyan-400/60'
                          } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span>{opt}</span>
                          {showRight && (
                            <CheckCircle2
                              className="h-4 w-4 shrink-0 text-emerald-400"
                              aria-hidden="true"
                            />
                          )}
                          {showWrong && (
                            <XCircle
                              className="h-4 w-4 shrink-0 text-rose-400"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <p
                      className={`mt-3 text-xs leading-relaxed sm:text-sm ${
                        isCorrect ? 'text-emerald-300' : 'text-amber-200'
                      }`}
                    >
                      {isCorrect ? 'Correct! ' : 'Learning Note: '}
                      {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {!submitted && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-5">
              <p className="text-xs text-slate-400">
                Answer all 3 questions to check your score and earn the{' '}
                <strong className="text-slate-200">{experiment.badgeTitle}</strong>{' '}
                badge.
              </p>
              <button
                type="button"
                disabled={!allAnswered}
                onClick={handleSubmitQuiz}
                className="inline-flex min-h-[44px] items-center rounded-md bg-[#E03C31] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#F04A3E] disabled:opacity-45 cursor-pointer"
              >
                Check Answers &amp; Complete Station
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

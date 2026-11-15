import { useEffect } from 'react';
import { Award, Printer, Sparkles, X } from 'lucide-react';
import { LAB_EXPERIMENTS } from '../../data/spaceScienceLabData';
import type { LabProgressState } from '../../types/spaceLab';

interface ScienceLabCertificateModalProps {
  isOpen: boolean;
  cadetName: string;
  progress: LabProgressState;
  onClose: () => void;
}

export function ScienceLabCertificateModal({
  isOpen,
  cadetName,
  progress,
  onClose,
}: ScienceLabCertificateModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lab-certificate-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-cyan-400/60 bg-[#080E1E] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2 font-mono text-xs text-cyan-300">
            <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <span>Mission: Little Astronaut · Space Science Lab Award</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close certificate"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="rounded-xl border border-amber-400/45 bg-gradient-to-b from-[#0D1731] to-[#060913] p-6 text-center sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/60 bg-amber-500/15">
              <Award className="h-7 w-7 text-amber-300" aria-hidden="true" />
            </div>

            <p className="mt-4 font-mono text-xs tracking-widest text-cyan-300">
              OFFICIAL SPACE SCIENCE EXPLORER CERTIFICATE
            </p>

            <h2
              id="lab-certificate-title"
              className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl"
            >
              {cadetName || 'Cadet Explorer'}
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-300">
              Has successfully completed all five interactive experiments and science
              checkpoints in the Space Science Lab—investigating Gravity, Solar Orbits,
              Lunar Craters, Rocket Propulsion, and Light in Space.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2.5 text-left sm:grid-cols-3">
              {LAB_EXPERIMENTS.map((exp) => {
                const earned = progress.completedIds.includes(exp.id);
                return (
                  <div
                    key={exp.id}
                    className={`rounded-lg border p-2.5 text-xs ${
                      earned
                        ? 'border-emerald-400/45 bg-emerald-500/10 text-emerald-100'
                        : 'border-slate-800 bg-[#060913] text-slate-400'
                    }`}
                  >
                    <p className="font-mono text-[10px] text-cyan-300">
                      {exp.stationNumber}
                    </p>
                    <p className="mt-0.5 font-semibold">{exp.badgeTitle}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4 text-xs font-mono text-slate-300 tabular-nums">
              <span>Date Issued: {formattedDate}</span>
              <span className="text-amber-300 font-bold">
                Total Science Points: {progress.totalPoints}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-md border border-slate-700 bg-[#0B1120] px-4 py-2 text-xs font-semibold text-white hover:border-cyan-400/70 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Print Certificate</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[42px] items-center rounded-md bg-[#E03C31] px-5 py-2 text-xs font-semibold text-white hover:bg-[#F04A3E] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

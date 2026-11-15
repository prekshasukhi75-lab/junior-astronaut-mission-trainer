import { useEffect } from 'react';
import { Check, Compass, ShieldCheck, X } from 'lucide-react';
import type { DestinationModule, FooterTopicInfo } from '../data/scienceCentreData';
import { SpaceImage } from './SpaceImage';

export interface CadetProfile {
  name: string;
  ageGroup: '7–9 Explorer' | '10–12 Commander';
  focusTrack: string;
}

interface DestinationModalProps {
  destination: DestinationModule | null;
  onClose: () => void;
}

export function DestinationPreviewModal({
  destination,
  onClose,
}: DestinationModalProps) {
  useEffect(() => {
    if (!destination) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [destination, onClose]);

  if (!destination) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="destination-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-700/80 bg-[#0B1120] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[16/9] w-full border-b border-slate-800">
          <SpaceImage
            src={destination.imageSrc}
            alt={destination.imageAlt}
            fallbackTitle={destination.title}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close destination preview"
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 bg-[#060913]/90 text-slate-200 transition-colors hover:border-cyan-400 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-400 cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6">
          <p className="font-mono text-xs tracking-wide text-cyan-300">
            Module {destination.index} <span aria-hidden="true">·</span> {destination.discipline}
          </p>

          <h3
            id="destination-modal-title"
            className="mt-2 font-display text-2xl font-bold text-white"
          >
            {destination.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
            {destination.previewSummary}
          </p>

          <div className="mt-5 border-t border-slate-800/80 pt-4">
            <p className="font-mono text-xs text-slate-400">What You Will Explore</p>
            <ul className="mt-2.5 space-y-2 text-sm text-slate-300">
              {destination.learningTopics.map((topic) => (
                <li key={topic} className="flex items-start gap-2.5">
                  <Compass
                    className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400"
                    aria-hidden="true"
                  />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
            <span className="font-mono text-xs text-slate-400">
              Destination page scheduled for upcoming Group 3 build step
            </span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[40px] items-center rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#F04A3E] focus-visible:outline-2 focus-visible:outline-cyan-400 cursor-pointer"
            >
              Back to Science Centre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FooterTopicModalProps {
  topic: FooterTopicInfo | null;
  onClose: () => void;
}

export function FooterTopicModal({ topic, onClose }: FooterTopicModalProps) {
  useEffect(() => {
    if (!topic) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [topic, onClose]);

  if (!topic) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="footer-topic-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-slate-700/80 bg-[#0B1120] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-cyan-300">{topic.subtitle}</p>
            <h3
              id="footer-topic-title"
              className="mt-1 font-display text-2xl font-bold text-white"
            >
              {topic.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close information dialog"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-[#060913] text-slate-300 transition-colors hover:border-cyan-400 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-200">
          {topic.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <ul className="mt-5 space-y-2 border-t border-slate-800/80 pt-4 text-sm text-slate-300">
          {topic.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[40px] items-center rounded-md border border-slate-700 bg-[#111B33] px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-cyan-400/70 hover:text-cyan-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface CadetProfileModalProps {
  isOpen: boolean;
  profile: CadetProfile;
  onUpdateProfile: (next: CadetProfile) => void;
  onClose: () => void;
}

const FOCUS_TRACKS = [
  'Solar Watcher',
  'Moon Mapper',
  'Mission Photographer',
  'Habitat Engineer',
];

export function CadetProfileModal({
  isOpen,
  profile,
  onUpdateProfile,
  onClose,
}: CadetProfileModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cadet-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-700/80 bg-[#0B1120] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 text-cyan-300">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono text-xs text-cyan-300">Young Explorer Pass</p>
              <h3
                id="cadet-profile-title"
                className="font-display text-xl font-bold text-white"
              >
                Cadet Profile
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cadet profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 bg-[#060913] text-slate-300 transition-colors hover:border-cyan-400 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="cadet-name-input"
              className="block text-xs font-medium text-slate-300"
            >
              Explorer Callsign
            </label>
            <input
              id="cadet-name-input"
              type="text"
              maxLength={24}
              value={profile.name}
              onChange={(e) =>
                onUpdateProfile({
                  ...profile,
                  name: e.target.value || 'Cadet Explorer',
                })
              }
              className="mt-1.5 w-full rounded-md border border-slate-700 bg-[#060913] px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-300">
              Explorer Age Group
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(['7–9 Explorer', '10–12 Commander'] as const).map((group) => {
                const active = profile.ageGroup === group;
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => onUpdateProfile({ ...profile, ageGroup: group })}
                    className={`min-h-[40px] rounded-md border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                        : 'border-slate-700 bg-[#060913] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {group}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-300">
              Science Focus Track
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {FOCUS_TRACKS.map((track) => {
                const active = profile.focusTrack === track;
                return (
                  <button
                    key={track}
                    type="button"
                    onClick={() => onUpdateProfile({ ...profile, focusTrack: track })}
                    className={`min-h-[40px] rounded-md border px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'border-cyan-400 bg-cyan-500/15 text-cyan-200'
                        : 'border-slate-700 bg-[#060913] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {track}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
          <span className="text-xs text-slate-400">
            Track: <strong className="text-slate-200">{profile.focusTrack}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[40px] items-center rounded-md bg-[#E03C31] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#F04A3E] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState, type FormEvent } from 'react';
import { Bot, Loader2, Send } from 'lucide-react';
import { DEFAULT_ASTRA_QUESTIONS } from '../../data/imageExplorerData';
import {
  askAstraQuestion,
  ImageAnalysisError,
} from '../../services/imageAnalysisService';
import type {
  AstraChatMessage,
  DetectedComponent,
  NasaImageItem,
} from '../../types/imageExplorer';

interface AstraSpaceBotProps {
  image: NasaImageItem;
  resolvedImageUrl: string;
  selectedComponent: DetectedComponent | null;
  aiConfigured: boolean | null;
}

export function AstraSpaceBot({
  image,
  resolvedImageUrl,
  selectedComponent,
  aiConfigured,
}: AstraSpaceBotProps) {
  const [messages, setMessages] = useState<AstraChatMessage[]>([]);
  const [questionInput, setQuestionInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Update ASTRA's greeting automatically whenever the image or selected component changes
  useEffect(() => {
    if (selectedComponent) {
      setMessages([
        {
          id: `astra-comp-${selectedComponent.id}`,
          role: 'astra',
          text: `You discovered ${selectedComponent.name}! ${selectedComponent.simpleDescription} ${selectedComponent.scientificExplanation}`,
        },
      ]);
    } else {
      setMessages([
        {
          id: `astra-intro-${image.nasaId}`,
          role: 'astra',
          text: `Hi Explorer! I'm ASTRA, your Space Science Guide. Click "EXPLORE THIS IMAGE" and touch any highlighted part of "${image.title}"—or ask me a question below!`,
        },
      ]);
    }
  }, [image.nasaId, image.title, selectedComponent]);

  const suggestedQuestions = selectedComponent?.suggestedQuestions?.length
    ? Array.from(
        new Set([...selectedComponent.suggestedQuestions, ...DEFAULT_ASTRA_QUESTIONS])
      ).slice(0, 5)
    : DEFAULT_ASTRA_QUESTIONS;

  const submitQuestion = async (rawQuestion: string) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed || isSending) return;

    const userMsg: AstraChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setQuestionInput('');
    setIsSending(true);

    try {
      const answer = await askAstraQuestion({
        question: trimmed,
        image,
        resolvedImageUrl,
        selectedComponent,
        history: nextHistory,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `astra-${Date.now()}`,
          role: 'astra',
          text: answer,
        },
      ]);
    } catch (err) {
      const fallbackInfo = selectedComponent
        ? ` Here is what we already discovered about ${selectedComponent.name}: ${selectedComponent.interestingFact}`
        : '';
      const messageText =
        err instanceof ImageAnalysisError
          ? `${err.message}${fallbackInfo}`
          : `ASTRA could not respond right now.${fallbackInfo}`;

      setMessages((prev) => [
        ...prev,
        {
          id: `astra-err-${Date.now()}`,
          role: 'astra',
          text: messageText,
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submitQuestion(questionInput);
  };

  return (
    <aside
      aria-label="ASTRA — Your Space Science Guide"
      className="flex h-full flex-col rounded-xl border border-slate-800/90 bg-[#0B1120] overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-slate-800/80 bg-[#080D1B] p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/40 bg-cyan-500/10 text-cyan-300">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-base font-bold tracking-wide text-white">
              ASTRA — YOUR SPACE SCIENCE GUIDE
            </h3>
            <p className="font-mono text-[11px] text-slate-400">
              AI Educational Guide · Separate from NASA official captions
            </p>
          </div>
        </div>

        {aiConfigured === false && (
          <p className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            AI chat service is unconfigured (<code className="font-mono">GEMINI_API_KEY</code>{' '}
            missing). Component explanations remain available.
          </p>
        )}
      </div>

      {/* Conversation Feed */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5 max-h-[380px] lg:max-h-[420px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg border p-3.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'ml-6 border-cyan-500/40 bg-[#101C36] text-white'
                : msg.isError
                  ? 'mr-4 border-amber-500/40 bg-amber-500/10 text-amber-100'
                  : 'mr-4 border-slate-800 bg-[#060913] text-slate-200'
            }`}
          >
            <p className="mb-1 font-mono text-[11px] text-cyan-300">
              {msg.role === 'user' ? 'Young Explorer' : 'ASTRA'}
            </p>
            <p>{msg.text}</p>
          </div>
        ))}

        {isSending && (
          <div className="mr-4 flex items-center gap-2 rounded-lg border border-slate-800 bg-[#060913] p-3.5 text-xs text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" aria-hidden="true" />
            <span>ASTRA is thinking...</span>
          </div>
        )}
      </div>

      {/* Suggested Questions + Input */}
      <div className="border-t border-slate-800/80 bg-[#080D1B] p-4 sm:p-5">
        <p className="font-mono text-[11px] text-slate-400">Suggested Questions</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              disabled={isSending}
              onClick={() => void submitQuestion(q)}
              className="rounded-md border border-slate-700/80 bg-[#0B1120] px-2.5 py-1.5 text-left text-xs text-slate-200 transition-colors hover:border-cyan-400/60 hover:text-cyan-200 disabled:opacity-50 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        <form onSubmit={handleFormSubmit} className="mt-4 flex gap-2">
          <label htmlFor="astra-question-input" className="sr-only">
            Ask ASTRA a question
          </label>
          <input
            id="astra-question-input"
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Ask ASTRA about this image..."
            maxLength={300}
            className="min-w-0 flex-1 rounded-md border border-slate-700 bg-[#060913] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSending || !questionInput.trim()}
            aria-label="Send question to ASTRA"
            className="inline-flex min-h-[40px] items-center justify-center rounded-md bg-[#E03C31] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#F04A3E] disabled:opacity-40 cursor-pointer"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </aside>
  );
}

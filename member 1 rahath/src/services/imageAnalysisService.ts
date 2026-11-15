import type {
  AiServiceStatus,
  AnalyzedImageResult,
  AstraChatMessage,
  DetectedComponent,
  NasaImageItem,
} from '../types/imageExplorer';

export class ImageAnalysisError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'ImageAnalysisError';
    this.code = code;
  }
}

function validateAnalysisResult(raw: unknown): AnalyzedImageResult {
  if (!raw || typeof raw !== 'object') {
    throw new ImageAnalysisError(
      'INVALID_AI_RESPONSE',
      'The AI analyzer returned an unreadable response.'
    );
  }

  const obj = raw as Record<string, unknown>;
  const subject =
    typeof obj.subject === 'string' && obj.subject.trim()
      ? obj.subject.trim()
      : 'NASA Space Image';
  const isSuitable = Boolean(obj.isSuitableForComponentExploration);
  const unsuitableReason =
    typeof obj.unsuitableReason === 'string' ? obj.unsuitableReason.trim() : '';
  const summary = typeof obj.summary === 'string' ? obj.summary.trim() : '';

  const rawComponents = Array.isArray(obj.components) ? obj.components : [];
  const components: DetectedComponent[] = [];

  for (const item of rawComponents) {
    if (!item || typeof item !== 'object') continue;
    const c = item as Record<string, unknown>;
    const region = c.region as Record<string, unknown> | undefined;
    const rawPoints = Array.isArray(region?.points) ? region.points : [];

    const points = rawPoints
      .map((p) => {
        if (!p || typeof p !== 'object') return null;
        const pt = p as Record<string, unknown>;
        const x = Number(pt.x);
        const y = Number(pt.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
        return {
          x: Math.max(0, Math.min(1, x)),
          y: Math.max(0, Math.min(1, y)),
        };
      })
      .filter((pt): pt is { x: number; y: number } => pt !== null);

    if (
      typeof c.name !== 'string' ||
      !c.name.trim() ||
      typeof c.simpleDescription !== 'string' ||
      points.length < 3
    ) {
      continue;
    }

    const conf =
      c.confidence === 'high' ||
      c.confidence === 'medium' ||
      c.confidence === 'low'
        ? c.confidence
        : 'medium';

    components.push({
      id:
        typeof c.id === 'string' && c.id.trim()
          ? c.id.trim()
          : `comp-${components.length + 1}`,
      name: c.name.trim(),
      simpleDescription: c.simpleDescription.trim(),
      scientificExplanation:
        typeof c.scientificExplanation === 'string' && c.scientificExplanation.trim()
          ? c.scientificExplanation.trim()
          : c.simpleDescription.trim(),
      interestingFact:
        typeof c.interestingFact === 'string' && c.interestingFact.trim()
          ? c.interestingFact.trim()
          : 'NASA scientists study this feature using specialized instruments.',
      confidence: conf,
      evidenceNote:
        typeof c.evidenceNote === 'string' && c.evidenceNote.trim()
          ? c.evidenceNote.trim()
          : 'Visually observed in the selected image.',
      region: {
        type: 'polygon',
        points,
      },
      suggestedQuestions: Array.isArray(c.suggestedQuestions)
        ? c.suggestedQuestions.filter(
            (q): q is string => typeof q === 'string' && q.trim().length > 0
          )
        : ['What is it made of?', 'Why is it important?'],
    });
  }

  return {
    subject,
    isSuitableForComponentExploration: isSuitable && components.length > 0,
    unsuitableReason,
    summary,
    components,
  };
}

export async function getAiServiceStatus(): Promise<AiServiceStatus> {
  try {
    const res = await fetch('/api/ai/status', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      return { configured: false, model: 'gemini-4-hydrogen' };
    }
    const data = (await res.json()) as Partial<AiServiceStatus>;
    return {
      configured: Boolean(data.configured),
      model: typeof data.model === 'string' ? data.model : 'gemini-4-hydrogen',
    };
  } catch {
    return { configured: false, model: 'gemini-4-hydrogen' };
  }
}

export async function analyzeNasaImage(
  image: NasaImageItem,
  resolvedImageUrl: string
): Promise<AnalyzedImageResult> {
  let response: globalThis.Response;
  try {
    response = await fetch('/api/ai/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: resolvedImageUrl || image.previewUrl,
        nasaId: image.nasaId,
        title: image.title,
        description: image.description,
        keywords: image.keywords,
      }),
      signal: AbortSignal.timeout(60000),
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      throw new ImageAnalysisError(
        'AI_TIMEOUT',
        'AI image analysis timed out. Please try again or choose another NASA image.'
      );
    }
    throw new ImageAnalysisError(
      'NETWORK_ERROR',
      'Could not reach the AI analysis service. Please verify the server is running and try again.'
    );
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = (await response.json()) as Record<string, unknown>;
  } catch {
    throw new ImageAnalysisError(
      'INVALID_AI_RESPONSE',
      'Received an invalid response from the AI image analysis endpoint.'
    );
  }

  if (!response.ok) {
    const code =
      typeof payload.code === 'string' ? payload.code : `HTTP_${response.status}`;
    const message =
      typeof payload.message === 'string'
        ? payload.message
        : 'AI image analysis is currently unavailable.';
    throw new ImageAnalysisError(code, message);
  }

  return validateAnalysisResult(payload);
}

export async function askAstraQuestion(params: {
  question: string;
  image: NasaImageItem;
  resolvedImageUrl: string;
  selectedComponent?: DetectedComponent | null;
  history: AstraChatMessage[];
}): Promise<string> {
  let response: globalThis.Response;
  try {
    response = await fetch('/api/ai/astra-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: params.question,
        imageContext: {
          nasaId: params.image.nasaId,
          title: params.image.title,
          description: params.image.description,
          imageUrl: params.resolvedImageUrl || params.image.previewUrl,
        },
        selectedComponent: params.selectedComponent
          ? {
              name: params.selectedComponent.name,
              simpleDescription: params.selectedComponent.simpleDescription,
              scientificExplanation: params.selectedComponent.scientificExplanation,
              interestingFact: params.selectedComponent.interestingFact,
              evidenceNote: params.selectedComponent.evidenceNote,
            }
          : undefined,
        history: params.history.map((m) => ({ role: m.role, text: m.text })),
      }),
      signal: AbortSignal.timeout(45000),
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      throw new ImageAnalysisError(
        'AI_TIMEOUT',
        'ASTRA took too long to answer. Please try asking again.'
      );
    }
    throw new ImageAnalysisError(
      'NETWORK_ERROR',
      'ASTRA is offline right now. You can still read the component explanations beside the image.'
    );
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = (await response.json()) as Record<string, unknown>;
  } catch {
    throw new ImageAnalysisError(
      'INVALID_AI_RESPONSE',
      'ASTRA sent an unreadable reply. Please try again.'
    );
  }

  if (!response.ok) {
    const code =
      typeof payload.code === 'string' ? payload.code : `HTTP_${response.status}`;
    const message =
      typeof payload.message === 'string'
        ? payload.message
        : 'ASTRA is currently unavailable.';
    throw new ImageAnalysisError(code, message);
  }

  if (typeof payload.answer !== 'string' || !payload.answer.trim()) {
    throw new ImageAnalysisError(
      'EMPTY_ASTRA_RESPONSE',
      'ASTRA did not return an answer. Try rephrasing your question.'
    );
  }

  return payload.answer.trim();
}

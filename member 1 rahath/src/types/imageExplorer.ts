export interface NasaImageItem {
  nasaId: string;
  title: string;
  description: string;
  dateCreated: string;
  keywords: string[];
  center: string;
  photographer: string;
  previewUrl: string;
  nasaSourceUrl: string;
}

export interface NasaSearchResponse {
  query: string;
  page: number;
  pageSize: number;
  totalHits: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  items: NasaImageItem[];
}

export interface NasaAssetDetails {
  bestImageUrl: string;
  metadataSummary?: Record<string, unknown> | null;
}

export interface NormalizedPoint {
  x: number;
  y: number;
}

export interface DetectedComponent {
  id: string;
  name: string;
  simpleDescription: string;
  scientificExplanation: string;
  interestingFact: string;
  confidence: 'high' | 'medium' | 'low';
  evidenceNote: string;
  region: {
    type: 'polygon';
    points: NormalizedPoint[];
  };
  suggestedQuestions: string[];
}

export interface AnalyzedImageResult {
  subject: string;
  isSuitableForComponentExploration: boolean;
  unsuitableReason: string;
  summary: string;
  components: DetectedComponent[];
}

export interface AiServiceStatus {
  configured: boolean;
  model: string;
}

export interface AstraChatMessage {
  id: string;
  role: 'astra' | 'user';
  text: string;
  isError?: boolean;
  isOfficialMetadataNote?: boolean;
}

export interface SavedDiscoveryItem {
  nasaId: string;
  title: string;
  previewUrl: string;
  nasaSourceUrl: string;
  center: string;
  dateCreated: string;
  description: string;
  keywords: string[];
  discoveredComponents: string[];
  savedAt: string;
}

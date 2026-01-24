export interface ShortIdea {
  title: string;
  hook: string;
  script: string;
  reasoning: string;
  viralScore: number;
  estimatedDuration: string;
  startTimeSeconds: number;
  endTimeSeconds: number;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  data: ShortIdea[] | null;
  status: 'idle' | 'uploading' | 'analyzing' | 'complete';
  sourceFile: File | null;
}

export enum InputMode {
  VIDEO = 'VIDEO',
  TRANSCRIPT = 'TRANSCRIPT'
}
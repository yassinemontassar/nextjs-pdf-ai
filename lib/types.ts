// PDF Analysis types

export interface AnalysisItem {
  id: number;
  title: string;
  details: string;
  type: 'error' | 'warning' | 'info' | 'success';
  score?: string;
  location?: {
    pageNumber: number;
    coordinates?: {
      startY: number;
      endY: number;
      x?: number;
    }
  };
}

export interface AnalysisResult {
  items: AnalysisItem[];
  summary?: string;
}

export interface BracketAnnotation {
  id: string;
  pageNumber: number;
  startY: number; 
  endY: number;
  x: number;
  color?: string;
  linkedItem: number;
} 
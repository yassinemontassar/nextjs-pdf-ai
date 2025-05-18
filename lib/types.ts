// CV/Resume Analysis types

export type AnalysisType = 'strength' | 'improvement' | 'missing' | 'warning' | 'info';

export interface AnalysisItem {
  id: number;
  section: string; // e.g., Work Experience, Education, Skills
  title: string; // Professional headline for the feedback
  details: string; // Detailed, actionable feedback
  type: AnalysisType;
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
  summary?: string; // Overall professional summary
  recommendations?: string[]; // Top actionable next steps
  language?: string; // Detected language of the resume
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
"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { analyzePdfWithGemini } from "@/lib/actions";
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PdfAnalyzerButtonProps {
  pdfUrl: string;
  setAnalysisResult: Dispatch<SetStateAction<string | null>>;
  setIsAnalyzing: Dispatch<SetStateAction<boolean>>;
}

export default function PdfAnalyzerButton({ 
  pdfUrl, 
  setAnalysisResult, 
  setIsAnalyzing 
}: PdfAnalyzerButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzingState] = useState(false);

  const analyzePdf = async () => {
    setIsAnalyzingState(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      const result = await analyzePdfWithGemini(pdfUrl);

      if (!result.success) {
        throw new Error(result.error || "Failed to analyze PDF");
      }

      setAnalysisResult(result.analysis || null);
    } catch (err) {
      console.error('Failed to analyze PDF:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzingState(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <Button
        onClick={analyzePdf}
        disabled={isAnalyzing}
        size="lg"
        className="w-full max-w-xs text-base font-semibold shadow-md flex items-center justify-center"
      >
        {isAnalyzing ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Analyzing...
          </span>
        ) : (
          "Analyze CV/Resume PDF"
        )}
      </Button>
      {error && (
        <Alert variant="destructive" className="w-full max-w-xs">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 
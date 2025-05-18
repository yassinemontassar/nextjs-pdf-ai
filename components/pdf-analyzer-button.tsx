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
        className="w-full max-w-xs text-base font-semibold shadow-md"
      >
        {isAnalyzing ? "Analyzing..." : "Analyze CV/Resume PDF"}
      </Button>
      {error && (
        <Alert variant="destructive" className="w-full max-w-xs">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 
"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { analyzePdfWithGemini } from "@/lib/actions";

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

  const analyzePdf = async () => {
    setIsAnalyzing(true);
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
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto mt-6">
      <button
        onClick={analyzePdf}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
      >
        Analyze PDF with Gemini
      </button>

      {error && (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
} 
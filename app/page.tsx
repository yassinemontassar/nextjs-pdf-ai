"use client"

import { useState } from "react"
import PdfAnalyzerButton from "@/components/pdf-analyzer-button"
import PdfCorrectionViewer from "@/components/pdf-correction-viewer"

export default function Home() {
  // Use a single source of truth for the PDF URL
    // The PDF URL is hardcoded in both the button and the viewer for consistency
    const pdfUrl = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"

  // Shared state for analysis results and status
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        PDF Analysis with Gemini
      </h1>
      
      <PdfAnalyzerButton 
        pdfUrl={pdfUrl} 
        setAnalysisResult={setAnalysisResult}
        setIsAnalyzing={setIsAnalyzing}
      />
      
      <div className="mt-8">
        <PdfCorrectionViewer 
          pdfUrl={pdfUrl} 
          analysisResult={analysisResult}
          isAnalyzing={isAnalyzing}
        />
      </div>
    </main>
  )
}

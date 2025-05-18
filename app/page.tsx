"use client"

import { useState } from "react"
import PdfAnalyzerButton from "@/components/pdf-analyzer-button"
import PdfCorrectionViewer from "@/components/pdf-correction-viewer"

export default function Home() {
  // Use a single source of truth for the PDF URL
  // The PDF URL from the user's conversation
  const pdfUrl = "https://storage.googleapis.com/loumo-437409.firebasestorage.app/exams/GpYB0zQPUPLi9iBnEYzH/copies/73dc2560-6458-461c-a2b4-58508c505c59_anglais_theo_vienne.pdf"

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

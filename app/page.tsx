"use client"

import { useState } from "react"
import PdfAnalyzerButton from "@/components/pdf-analyzer-button"
import PdfCorrectionViewer from "@/components/pdf-correction-viewer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  // Use a single source of truth for the PDF URL
  // The PDF URL from the user's conversation
  const pdfUrl = "http://localhost:3000/cv.pdf"

  // Shared state for analysis results and status
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  return (
    <main className="min-h-screen bg-muted flex flex-col items-center justify-center py-8 px-2">
      <div className="max-w-7xl w-full">
        <Card className="shadow-xl border border-border bg-white/90">
          <CardHeader className="flex flex-col items-center gap-2 pb-2">
            <CardTitle className="text-3xl font-bold text-center tracking-tight text-primary">
              CV/Resume PDF Analysis
            </CardTitle>
            <p className="text-muted-foreground text-center text-base max-w-xl">
              Upload or analyze a CV/Resume PDF and get instant, professional feedback powered by Gemini AI.
            </p>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent className="flex flex-col gap-8 items-center">
            <PdfAnalyzerButton 
              pdfUrl={pdfUrl} 
              setAnalysisResult={setAnalysisResult}
              setIsAnalyzing={setIsAnalyzing}
            />
            <div className="w-full">
              <PdfCorrectionViewer 
                pdfUrl={pdfUrl} 
                analysisResult={analysisResult}
                isAnalyzing={isAnalyzing}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

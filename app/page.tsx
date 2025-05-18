"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import PdfAnalyzerButton from "@/components/pdf-analyzer-button"
import PdfCorrectionViewer from "@/components/pdf-correction-viewer"


export default function Home() {
  // Use a single source of truth for the PDF URL
  const pdfUrl = "http://localhost:3000/french.pdf"

  // Shared state for analysis results and status
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
 


  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center py-8 px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl w-full"
      >
        <Card className="shadow-xl border border-border bg-card">
          <div className="relative overflow-hidden">
            {/* Header with animated background */}
            <div className="relative bg-[--sidebar-primary] p-8">
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <CardHeader className="flex flex-col items-center gap-2 pb-2 p-0 text-[--sidebar-primary-foreground]">
                <CardTitle className="text-3xl font-bold text-center tracking-tight">CV/Resume PDF Analysis</CardTitle>
                <p className="text-[--sidebar-primary-foreground]/80 text-center text-base max-w-xl">
                  Upload or analyze a CV/Resume PDF and get instant, professional feedback powered by Gemini AI.
                </p>
              </CardHeader>
            </div>

            <Separator className="mb-4" />

            <CardContent className="flex flex-col gap-8 items-center p-6">
              <PdfAnalyzerButton
                pdfUrl={pdfUrl}
                setAnalysisResult={setAnalysisResult}
                setIsAnalyzing={setIsAnalyzing}
              />
              <div className="w-full">
                <PdfCorrectionViewer pdfUrl={pdfUrl} analysisResult={analysisResult} isAnalyzing={isAnalyzing} />
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </main>
  )
}

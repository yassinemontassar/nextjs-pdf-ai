"use client"

import { useState } from "react"
import PdfViewer from "@/components/pdf-viewer"
import { useMobile } from "@/hooks/use-mobile"

interface PdfCorrectionViewerProps {
  pdfUrl: string;
  analysisResult?: string | null;
  isAnalyzing?: boolean;
}

export default function PdfCorrectionViewer({ 
  pdfUrl, 
  analysisResult, 
  isAnalyzing 
}: PdfCorrectionViewerProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const isMobile = useMobile();

  if (isMobile) {
    // Mobile: stack vertically
    return (
      <div className="flex flex-col h-[80vh] gap-4">
        <div className="flex-1 min-h-[40vh] rounded-md overflow-auto">
          <PdfViewer pdfUrl={pdfUrl} />
        </div>
        <div className="flex-1 min-h-[40vh] bg-white rounded-md border p-4 overflow-auto">
          {isAnalyzing ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing PDF with Gemini...</p>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-y-auto max-h-[calc(100%-4rem)] whitespace-pre-wrap">
                {analysisResult}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">PDF Analysis</h2>
                <p className="text-gray-600">Click the "Analyze PDF with Gemini" button to start analysis.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Desktop: side-by-side
  return (
    <div className="flex h-screen">
      {/* PDF Viewer */}
      <div className={`${sidebarOpen ? "w-1/2" : "w-full"} h-full overflow-auto transition-all duration-300`}>
        <PdfViewer pdfUrl={pdfUrl} />
      </div>

      {/* Right Side Panel */}
      {sidebarOpen && (
        <div className="w-1/2 h-full overflow-auto border-l bg-white p-8">
          {isAnalyzing ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing PDF with Gemini...</p>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="h-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-y-auto max-h-[calc(100%-4rem)] whitespace-pre-wrap">
                {analysisResult}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">PDF Analysis</h2>
                <p className="text-gray-600">Click the "Analyze PDF with Gemini" button to start analysis.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

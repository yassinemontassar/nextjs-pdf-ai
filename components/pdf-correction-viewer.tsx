"use client"

import { useState, useEffect } from "react"
import PdfViewer from "@/components/pdf-viewer"
import { useMobile } from "@/hooks/use-mobile"
import { AnalysisResult } from "@/lib/types"

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
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [parsedAnalysis, setParsedAnalysis] = useState<AnalysisResult | null>(null);

  // Parse analysis result into structured data
  useEffect(() => {
    if (analysisResult) {
      try {
        // Try to parse the JSON if it's already structured
        const parsed = JSON.parse(analysisResult) as AnalysisResult;
        setParsedAnalysis(parsed);
      } catch (e) {
        // If it's not JSON, it's probably raw text
        console.warn("Analysis result is not valid JSON, using fallback parsing");
        const fallbackAnalysis: AnalysisResult = {
          items: [
            {
              id: 1,
              section: "General",
              title: "Raw Analysis Result",
              details: analysisResult,
              type: "info"
            }
          ]
        };
        setParsedAnalysis(fallbackAnalysis);
      }
    } else {
      setParsedAnalysis(null);
    }
  }, [analysisResult]);

  // Get color based on type
  const getColorForType = (type: string): string => {
    switch (type) {
      case 'strength': return '#10b981'; // green
      case 'improvement': return '#f59e0b'; // amber
      case 'missing': return '#ef4444'; // red
      case 'warning': return '#f97316'; // orange  
      case 'info':
      default: return '#3b82f6';  // blue
    }
  };

  const renderAnalysisItems = () => {
    if (!parsedAnalysis) return null;
    
    return parsedAnalysis.items.map(item => (
      <div 
        id={`analysis-item-${item.id}`}
        key={item.id} 
        className={`p-4 rounded-md border mb-4 transition-all ${
          activeItem === item.id 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => setActiveItem(item.id)}
      >
        <div className="flex items-start">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-lg">{item.title}</h3>
              <span 
                className="px-3 py-1 text-xs rounded-full text-white"
                style={{ backgroundColor: getColorForType(item.type) }}
              >
                {item.type}
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-2">Section: {item.section}</div>
            <p className="text-gray-600 mt-2 whitespace-pre-wrap">{item.details}</p>
          </div>
        </div>
      </div>
    ));
  };

  // Render the recommendations section if available
  const renderRecommendations = () => {
    if (!parsedAnalysis?.recommendations?.length) return null;
    
    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h3 className="font-medium text-lg mb-2">Top Recommendations</h3>
        <ul className="list-disc pl-5 space-y-1">
          {parsedAnalysis.recommendations.map((rec, idx) => (
            <li key={idx} className="text-gray-600">{rec}</li>
          ))}
        </ul>
      </div>
    );
  };

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
                <p className="text-gray-600">Analyzing CV/Resume...</p>
              </div>
            </div>
          ) : parsedAnalysis ? (
            <div className="h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">CV/Resume Analysis Results</h2>
              {parsedAnalysis.language && (
                <div className="mb-2 text-xs text-gray-500">Detected Language: <span className="font-semibold text-gray-700">{parsedAnalysis.language}</span></div>
              )}
              {parsedAnalysis.summary && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h3 className="font-medium text-lg mb-2">Summary</h3>
                  <p className="text-gray-600">{parsedAnalysis.summary}</p>
                </div>
              )}
              {renderRecommendations()}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-y-auto max-h-[calc(100%-4rem)]">
                {renderAnalysisItems()}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">CV/Resume Analysis</h2>
                <p className="text-gray-600">Click the "Analyze CV/Resume PDF" button to start analysis.</p>
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
                <p className="text-gray-600">Analyzing CV/Resume...</p>
              </div>
            </div>
          ) : parsedAnalysis ? (
            <div className="h-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">CV/Resume Analysis Results</h2>
              {parsedAnalysis.language && (
                <div className="mb-2 text-xs text-gray-500">Detected Language: <span className="font-semibold text-gray-700">{parsedAnalysis.language}</span></div>
              )}
              {parsedAnalysis.summary && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h3 className="font-medium text-lg mb-2">Summary</h3>
                  <p className="text-gray-600">{parsedAnalysis.summary}</p>
                </div>
              )}
              {renderRecommendations()}
              <div className="space-y-2">
                {renderAnalysisItems()}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">CV/Resume Analysis</h2>
                <p className="text-gray-600">Click the "Analyze CV/Resume PDF" button to start analysis.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

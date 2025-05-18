"use client"

import { useState, useRef, useEffect } from "react"
import PdfViewer from "@/components/pdf-viewer"
import { useMobile } from "@/hooks/use-mobile"
import { AnalysisItem, AnalysisResult, BracketAnnotation } from "@/lib/types"

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
  const [annotations, setAnnotations] = useState<BracketAnnotation[]>([]);

  // Parse analysis result into structured data and generate annotations
  useEffect(() => {
    if (analysisResult) {
      try {
        // Try to parse the JSON if it's already structured
        const parsed = JSON.parse(analysisResult) as AnalysisResult;
        setParsedAnalysis(parsed);
        
        // Generate annotations from analysis items that have location info
        const newAnnotations = parsed.items
          .filter(item => item.location?.coordinates)
          .map(item => {
            const coords = item.location!.coordinates!;
            return {
              id: `annotation-${item.id}`,
              pageNumber: item.location!.pageNumber,
              startY: coords.startY,
              endY: coords.endY,
              x: coords.x || 50, // Default x position if not specified
              linkedItem: item.id,
              color: getColorForType(item.type)
            };
          });
        
        setAnnotations(newAnnotations);
      } catch (e) {
        // If it's not JSON, it's probably raw text
        console.warn("Analysis result is not valid JSON, using fallback parsing");
        const fallbackAnalysis: AnalysisResult = {
          items: [
            {
              id: 1,
              title: "Raw Analysis Result",
              details: analysisResult,
              type: "info"
            }
          ]
        };
        setParsedAnalysis(fallbackAnalysis);
        setAnnotations([]);
      }
    } else {
      setParsedAnalysis(null);
      setAnnotations([]);
    }
  }, [analysisResult]);

  // Get color based on type
  const getColorForType = (type: string): string => {
    switch (type) {
      case 'error': return '#ef4444';  // red
      case 'warning': return '#f59e0b'; // amber
      case 'success': return '#10b981'; // green
      case 'info':
      default: return '#3b82f6';  // blue
    }
  };

  const handleAnnotationClick = (itemId: number) => {
    setActiveItem(itemId);
    
    // Scroll the item into view in the sidebar
    const element = document.getElementById(`analysis-item-${itemId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
          <div 
            className="w-8 h-8 rounded-full text-white flex items-center justify-center mr-4 flex-shrink-0"
            style={{ backgroundColor: getColorForType(item.type) }}
          >
            {item.id}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{item.title}</h3>
            <p className="text-gray-600 mt-2 whitespace-pre-wrap">{item.details}</p>
            {item.score && (
              <div className="text-right text-orange-500 font-bold mt-2">{item.score}</div>
            )}
            {item.location && (
              <div className="text-xs text-gray-500 mt-2">
                Page {item.location.pageNumber}
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  if (isMobile) {
    // Mobile: stack vertically
    return (
      <div className="flex flex-col h-[80vh] gap-4">
        <div className="flex-1 min-h-[40vh] rounded-md overflow-auto">
          <PdfViewer 
            pdfUrl={pdfUrl}
            annotations={annotations}
            onAnnotationClick={handleAnnotationClick} 
          />
        </div>
        <div className="flex-1 min-h-[40vh] bg-white rounded-md border p-4 overflow-auto">
          {isAnalyzing ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing PDF with Gemini...</p>
              </div>
            </div>
          ) : parsedAnalysis ? (
            <div className="h-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-y-auto max-h-[calc(100%-4rem)]">
                {renderAnalysisItems()}
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
        <PdfViewer 
          pdfUrl={pdfUrl} 
          annotations={annotations}
          onAnnotationClick={handleAnnotationClick}
        />
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
          ) : parsedAnalysis ? (
            <div className="h-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
              {parsedAnalysis.summary && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h3 className="font-medium text-lg mb-2">Summary</h3>
                  <p className="text-gray-600">{parsedAnalysis.summary}</p>
                </div>
              )}
              <div className="space-y-2">
                {renderAnalysisItems()}
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

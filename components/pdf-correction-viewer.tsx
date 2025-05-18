"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PdfViewer from "@/components/pdf-viewer"
import { useMobile } from "@/hooks/use-mobile"
import type { AnalysisResult } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Sparkles, CheckCircle2, AlertTriangle, Info, ChevronRight, Lightbulb } from "lucide-react"

interface PdfCorrectionViewerProps {
  pdfUrl: string
  analysisResult?: string | null
  isAnalyzing?: boolean
}

export default function PdfCorrectionViewer({ pdfUrl, analysisResult, isAnalyzing }: PdfCorrectionViewerProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const isMobile = useMobile()
  const [activeItem, setActiveItem] = useState<number | null>(null)
  const [parsedAnalysis, setParsedAnalysis] = useState<AnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState("viewer")

  // Parse analysis result into structured data
  useEffect(() => {
    if (analysisResult) {
      try {
        // Try to parse the JSON if it's already structured
        const parsed = JSON.parse(analysisResult) as AnalysisResult
        setParsedAnalysis(parsed)
        // Auto-switch to results tab when analysis completes
        if (!isAnalyzing) {
          setActiveTab("results")
        }
      } catch (e) {
        // If it's not JSON, it's probably raw text
        console.warn("Analysis result is not valid JSON, using fallback parsing")
        const fallbackAnalysis: AnalysisResult = {
          items: [
            {
              id: 1,
              section: "General",
              title: "Raw Analysis Result",
              details: analysisResult,
              type: "info",
            },
          ],
        }
        setParsedAnalysis(fallbackAnalysis)
      }
    } else {
      setParsedAnalysis(null)
    }
  }, [analysisResult, isAnalyzing])

  // Get type properties (color, icon, etc.) based on type
  const getTypeProperties = (type: string) => {
    switch (type) {
      case "strength":
        return {
          color: "bg-emerald-500",
          textColor: "text-emerald-500",
          borderColor: "border-emerald-200",
          bgColor: "bg-emerald-50",
          icon: <CheckCircle2 className="h-5 w-5" />,
        }
      case "improvement":
        return {
          color: "bg-amber-500",
          textColor: "text-amber-500",
          borderColor: "border-amber-200",
          bgColor: "bg-amber-50",
          icon: <AlertTriangle className="h-5 w-5" />,
        }
      case "missing":
        return {
          color: "bg-rose-500",
          textColor: "text-rose-500",
          borderColor: "border-rose-200",
          bgColor: "bg-rose-50",
          icon: <AlertTriangle className="h-5 w-5" />,
        }
      case "warning":
        return {
          color: "bg-orange-500",
          textColor: "text-orange-500",
          borderColor: "border-orange-200",
          bgColor: "bg-orange-50",
          icon: <AlertTriangle className="h-5 w-5" />,
        }
      case "info":
      default:
        return {
          color: "bg-sky-500",
          textColor: "text-sky-500",
          borderColor: "border-sky-200",
          bgColor: "bg-sky-50",
          icon: <Info className="h-5 w-5" />,
        }
    }
  }

  const renderAnalysisItems = () => {
    if (!parsedAnalysis) return null

    return parsedAnalysis.items.map((item, idx) => {
      const { color, textColor, borderColor, bgColor, icon } = getTypeProperties(item.type)

      return (
        <motion.div
          id={`analysis-item-${item.id}`}
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + idx * 0.05 }}
          className={`p-4 rounded-lg border mb-4 transition-all ${
            activeItem === item.id
              ? "ring-2 ring-violet-500 border-violet-200"
              : `${borderColor} hover:border-slate-300`
          } ${bgColor}`}
          onClick={() => setActiveItem(item.id)}
        >
          <div className="flex items-start gap-3">
            <div className={`rounded-full ${color} p-1.5 text-white shrink-0 mt-0.5`}>{icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-lg">{item.title}</h3>
                <Badge variant="outline" className={`${textColor} border-current`}>
                  {item.type}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 mb-2">Section: {item.section}</div>
              <p className="text-slate-700 mt-2 whitespace-pre-wrap">{item.details}</p>
            </div>
          </div>
        </motion.div>
      )
    })
  }

  // Render the recommendations section if available
  const renderRecommendations = () => {
    if (!parsedAnalysis?.recommendations?.length) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 p-6 bg-white rounded-lg border border-slate-200 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-full bg-indigo-100 p-1.5">
            <Lightbulb className="h-4 w-4 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-lg">Top Recommendations</h3>
        </div>
        <ul className="space-y-2">
          {parsedAnalysis.recommendations.map((rec, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="flex items-start gap-2"
            >
              <div className="rounded-full bg-indigo-100 p-1 mt-0.5">
                <ChevronRight className="h-3 w-3 text-indigo-600" />
              </div>
              <span className="text-slate-700">{rec}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    )
  }

  if (isMobile) {
    // Mobile: tabs for PDF and analysis
    return (
      <div className="flex flex-col h-[80vh]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger
              value="viewer"
              className="data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              PDF Viewer
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Analysis Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="viewer" className="mt-0">
            <div className="bg-slate-50 rounded-lg p-4 h-[70vh]">
              <PdfViewer pdfUrl={pdfUrl} />
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-0">
            <div className="bg-slate-50 rounded-lg p-4 h-[70vh] overflow-auto">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full"
                  >
                    <div className="relative">
                      <div className="absolute -inset-10 rounded-full bg-violet-500/20 blur-xl animate-pulse"></div>
                      <div className="relative">
                        <svg
                          className="animate-spin h-16 w-16 text-violet-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-slate-700">Analyzing Your CV/Resume</h3>
                    <p className="mt-2 text-slate-500">Our AI is reviewing your document for insights...</p>
                  </motion.div>
                ) : parsedAnalysis ? (
                  <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">CV/Resume Analysis Results</h2>
                    {parsedAnalysis.language && (
                      <div className="mb-2 text-xs text-slate-500">
                        Detected Language:{" "}
                        <span className="font-semibold text-slate-700">{parsedAnalysis.language}</span>
                      </div>
                    )}
                    {parsedAnalysis.summary && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 p-4 bg-white rounded-lg border border-slate-200 shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="rounded-full bg-violet-100 p-1.5">
                            <FileText className="h-4 w-4 text-violet-600" />
                          </div>
                          <h3 className="font-semibold text-lg">Summary</h3>
                        </div>
                        <p className="text-slate-700">{parsedAnalysis.summary}</p>
                      </motion.div>
                    )}
                    {renderRecommendations()}
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm overflow-y-auto">
                      {renderAnalysisItems()}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full"
                  >
                    <div className="rounded-full bg-slate-100 p-6">
                      <Sparkles className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-slate-700">No Analysis Results Yet</h3>
                    <p className="mt-2 text-slate-500 text-center max-w-md">
                      Click the "Analyze CV/Resume PDF" button to get detailed feedback on your document
                    </p>
                    <Button className="mt-6" onClick={() => setActiveTab("viewer")}>
                      Go to PDF Viewer
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Desktop: side-by-side
  return (
    <div className="flex h-screen">
      {/* PDF Viewer */}
      <div className={`${sidebarOpen ? "w-1/2" : "w-full"} h-full overflow-auto transition-all duration-300 pr-4`}>
        <PdfViewer pdfUrl={pdfUrl} />
      </div>

      {/* Right Side Panel */}
      {sidebarOpen && (
        <div className="w-1/2 h-full overflow-auto border-l border-slate-200 bg-white p-6">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <div className="relative">
                  <div className="absolute -inset-10 rounded-full bg-violet-500/20 blur-xl animate-pulse"></div>
                  <div className="relative">
                    <svg
                      className="animate-spin h-16 w-16 text-violet-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-700">Analyzing Your CV/Resume</h3>
                <p className="mt-2 text-slate-500">Our AI is reviewing your document for insights...</p>
              </motion.div>
            ) : parsedAnalysis ? (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">CV/Resume Analysis Results</h2>
                {parsedAnalysis.language && (
                  <div className="mb-2 text-xs text-slate-500">
                    Detected Language: <span className="font-semibold text-slate-700">{parsedAnalysis.language}</span>
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  {parsedAnalysis.summary && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="rounded-full bg-violet-100 p-1.5">
                          <FileText className="h-4 w-4 text-violet-600" />
                        </div>
                        <h3 className="font-semibold text-lg">Summary</h3>
                      </div>
                      <p className="text-slate-700">{parsedAnalysis.summary}</p>
                    </motion.div>
                  )}

                  {renderRecommendations()}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 bg-white rounded-lg border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-sky-100 p-1.5">
                          <Info className="h-4 w-4 text-sky-600" />
                        </div>
                        <h3 className="font-semibold text-lg">Detailed Analysis</h3>
                      </div>
                    </div>

                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">{renderAnalysisItems()}</div>
                    </ScrollArea>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full"
              >
                <div className="rounded-full bg-slate-100 p-6">
                  <Sparkles className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-slate-700">No Analysis Results Yet</h3>
                <p className="mt-2 text-slate-500 text-center max-w-md">
                  Click the "Analyze CV/Resume PDF" button to get detailed feedback on your document
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

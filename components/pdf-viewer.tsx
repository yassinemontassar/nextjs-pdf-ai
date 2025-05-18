"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, AlertCircle } from "lucide-react"
// Import the required CSS for text layer
import "react-pdf/dist/esm/Page/TextLayer.css"

// Set up the worker for PDF.js using CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
  pdfUrl: string
}

export default function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.2)
  const [rotation, setRotation] = useState<number>(0)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset
      return Math.max(1, Math.min(numPages || 1, newPageNumber))
    })
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  function zoomIn() {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3))
  }

  function zoomOut() {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.6))
  }

  function rotate() {
    setRotation((prevRotation) => (prevRotation + 90) % 360)
  }

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* PDF Controls */}
      <div className="flex items-center justify-between mb-4 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={previousPage} disabled={pageNumber <= 1} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm px-2">
            {pageNumber} / {numPages || "?"}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextPage}
            disabled={!numPages || pageNumber >= numPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={zoomOut} className="h-8 w-8">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="icon" onClick={zoomIn} className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={rotate} className="h-8 w-8 ml-1">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Document */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center bg-white rounded-lg shadow-sm border border-slate-200 p-4"
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="space-y-2 w-[400px]">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-32 w-full" />
              </div>
              <p className="mt-4 text-slate-500">Loading PDF...</p>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="rounded-full bg-rose-100 p-4">
                <AlertCircle className="h-8 w-8 text-rose-600" />
              </div>
              <p className="mt-4 text-rose-600 font-medium">Failed to load PDF</p>
              <p className="text-slate-500 mt-1 text-sm">Please check the URL and try again</p>
              <Button variant="outline" className="mt-4" onClick={() => window.open(pdfUrl, "_blank")}>
                Open PDF directly
              </Button>
            </div>
          }
        >
          {pageNumber > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={pageNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-full flex justify-center"
              >
                <Page
                  pageNumber={pageNumber}
                  width={containerWidth ? containerWidth - 40 : undefined}
                  scale={scale}
                  rotate={rotation}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                  className="page my-4 w-full h-auto shadow-lg"
                />
              </motion.div>
            </AnimatePresence>
          )}
        </Document>
      </div>
    </div>
  )
}

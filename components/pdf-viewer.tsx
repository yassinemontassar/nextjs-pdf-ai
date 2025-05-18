"use client"

import { useState, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
// Import the required CSS for text layer
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js using CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  pdfUrl: string;
}

export default function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [scale] = useState<number>(1.2)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex flex-col h-full items-center">
      {/* PDF Document - Show all pages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center w-full">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
              <Skeleton className="h-[500px] w-[400px]" />
              <p className="mt-4 text-gray-500">Loading PDF...</p>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
              <p className="text-red-500">Failed to load PDF. Please check the URL and try again.</p>
              <Button variant="outline" className="mt-4" onClick={() => window.open(pdfUrl, "_blank")}>Open PDF directly</Button>
            </div>
          }
        >
          {numPages && Array.from({ length: numPages }, (_, idx) => (
            <div className="relative w-full max-w-full" key={idx}>
              <Page
                pageNumber={idx + 1}
                width={containerWidth || undefined}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                className="page my-4 w-full h-auto"
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  )
}

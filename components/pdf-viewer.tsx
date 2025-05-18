"use client"

import { useState, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import PdfAnnotationOverlay from "./pdf-annotation-overlay"
// Import the required CSS for text layer
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js using CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface BracketAnnotation {
  id: string;
  pageNumber: number;
  startY: number; 
  endY: number;
  x: number;
  color?: string;
  linkedItem: number;
}

interface PdfViewerProps {
  pdfUrl: string;
  annotations?: BracketAnnotation[];
  onAnnotationClick?: (itemId: number) => void;
}

export default function PdfViewer({ 
  pdfUrl,
  annotations = [],
  onAnnotationClick
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale] = useState<number>(1.2)
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 })
  const pageRef = useRef<HTMLDivElement>(null)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page)
    }
  }

  // Handle getting page dimensions after render
  const onPageRenderSuccess = () => {
    if (pageRef.current) {
      const { offsetWidth, offsetHeight } = pageRef.current;
      setPageDimensions({
        width: offsetWidth,
        height: offsetHeight
      });
    }
  };

  // Estimate PDF width for navigation bar sizing - this is a rough estimate
  // For a more precise width, you might need to measure the rendered PDF page
  const estimatedPdfWidth = 600 * scale; // A common PDF width is ~595pt, adjust as needed

  return (
    <div className="flex flex-col h-full items-center">
      {/* PDF Navigation using shadcn/ui Pagination - Centered and wraps content */}
      {numPages && numPages > 1 && (
        <div className="sticky top-0 z-10 py-2 mb-2 flex justify-center">
          <div className="inline-block bg-white shadow-md rounded-lg px-3 py-1">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={pageNumber > 1 ? () => goToPage(pageNumber - 1) : undefined}
                    className={pageNumber <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {/* Show up to 5 page numbers, with ellipsis if needed */}
                {Array.from({ length: numPages }).map((_, idx) => {
                  const page = idx + 1;
                  // Only show first, last, current, and neighbors
                  if (
                    page === 1 ||
                    page === numPages ||
                    Math.abs(page - pageNumber) <= 1
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === pageNumber}
                          onClick={() => goToPage(page)}
                          href="#"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  // Show ellipsis before/after current page range
                  if (
                    (page === pageNumber - 2 && page > 1) ||
                    (page === pageNumber + 2 && page < numPages)
                  ) {
                    return <PaginationEllipsis key={page} />;
                  }
                  return null;
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={pageNumber < (numPages || 1) ? () => goToPage(pageNumber + 1) : undefined}
                    className={pageNumber >= (numPages || 1) ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      {/* PDF Document - Takes remaining height */}
      <div className="flex-1 overflow-auto flex justify-center w-full">
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
              <Button variant="outline" className="mt-4" onClick={() => window.open(pdfUrl, "_blank")}>
                Open PDF directly
              </Button>
            </div>
          }
        >
          <div className="relative" ref={pageRef}>
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={false}
              className="page my-4"
              onRenderSuccess={onPageRenderSuccess}
            />
            {pageDimensions.width > 0 && annotations.length > 0 && (
              <PdfAnnotationOverlay
                annotations={annotations}
                pageNumber={pageNumber}
                pageWidth={pageDimensions.width}
                pageHeight={pageDimensions.height}
                onAnnotationClick={onAnnotationClick}
              />
            )}
          </div>
        </Document>
      </div>
    </div>
  )
}

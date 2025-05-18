"use client"

import { useState, useEffect, useRef } from "react"

interface BracketAnnotation {
  id: string;
  pageNumber: number;
  startY: number; 
  endY: number;
  x: number;
  color?: string;
  linkedItem: number; // ID of the analysis item this connects to
}

interface PdfAnnotationOverlayProps {
  annotations: BracketAnnotation[];
  pageNumber: number;
  pageWidth: number;
  pageHeight: number;
  onAnnotationClick?: (itemId: number) => void;
}

export default function PdfAnnotationOverlay({
  annotations,
  pageNumber,
  pageWidth,
  pageHeight,
  onAnnotationClick
}: PdfAnnotationOverlayProps) {
  // Filter annotations for current page
  const pageAnnotations = annotations.filter(ann => ann.pageNumber === pageNumber);
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg width={pageWidth} height={pageHeight} className="absolute top-0 left-0">
        {pageAnnotations.map((annotation) => (
          <g 
            key={annotation.id}
            onClick={() => onAnnotationClick?.(annotation.linkedItem)}
            className="cursor-pointer pointer-events-auto transition-all duration-300 hover:opacity-80"
          >
            {/* Left bracket line */}
            <path
              d={`M ${annotation.x} ${annotation.startY} 
                  L ${annotation.x - 10} ${annotation.startY} 
                  L ${annotation.x - 10} ${annotation.endY} 
                  L ${annotation.x} ${annotation.endY}`}
              stroke={annotation.color || "#3b82f6"}
              strokeWidth="2"
              fill="none"
            />
            
            {/* Number badge */}
            <circle 
              cx={annotation.x - 25} 
              cy={(annotation.startY + annotation.endY) / 2}
              r="14"
              fill={annotation.color || "#3b82f6"}
            />
            <text
              x={annotation.x - 25}
              y={(annotation.startY + annotation.endY) / 2 + 5}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
              className="pointer-events-none"
            >
              {annotation.linkedItem}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
} 
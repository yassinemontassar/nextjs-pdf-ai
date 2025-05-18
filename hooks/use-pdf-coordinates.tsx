"use client"

import { useState, useEffect, useCallback } from "react"

interface PdfCoordinatesHook {
  registerElement: (element: HTMLElement) => void;
  coordinates: { x: number; y: number } | null;
  pageCoordinates: { pageNumber: number; x: number; y: number } | null;
}

/**
 * Hook to detect coordinates in a PDF viewer
 * This is useful for adding manual annotations in the future
 */
export function usePdfCoordinates(): PdfCoordinatesHook {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [coordinates, setCoordinates] = useState<{ x: number; y: number } | null>(null);
  const [pageCoordinates, setPageCoordinates] = useState<{ pageNumber: number; x: number; y: number } | null>(null);

  const registerElement = useCallback((el: HTMLElement) => {
    if (el !== element) {
      setElement(el);
    }
  }, [element]);

  // Handle click events on the PDF
  useEffect(() => {
    if (!element) return;

    const handleClick = (e: MouseEvent) => {
      // Get coordinates relative to the element
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setCoordinates({ x, y });

      // Try to determine which page was clicked
      // This is a simplified example - in reality this would need more work
      // to account for page spacing, document scroll position, etc.
      const pages = element.querySelectorAll('.react-pdf__Page');
      let pageNumber = 0;
      let pageY = y;

      for (let i = 0; i < pages.length; i++) {
        const pageRect = pages[i].getBoundingClientRect();
        
        // If click is inside this page
        if (e.clientY >= pageRect.top && e.clientY <= pageRect.bottom) {
          pageNumber = i + 1;
          pageY = e.clientY - pageRect.top;
          break;
        }
      }

      if (pageNumber > 0) {
        setPageCoordinates({ 
          pageNumber, 
          x, 
          y: pageY
        });
      }
    };

    element.addEventListener('click', handleClick);
    
    return () => {
      element.removeEventListener('click', handleClick);
    };
  }, [element]);

  return {
    registerElement,
    coordinates,
    pageCoordinates
  };
} 
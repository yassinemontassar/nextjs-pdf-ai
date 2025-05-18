'use server'

import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { AnalysisResult } from './types';

/**
 * Server Action to analyze a PDF document using Gemini with structured output
 * @param pdfUrl URL to the PDF document
 * @returns The analysis in structured format
 */
export async function analyzePdfWithGemini(pdfUrl: string): Promise<{ success: boolean; analysis?: string; error?: string }> {
  if (!pdfUrl) {
    return {
      success: false,
      error: 'PDF URL is required'
    };
  }

  console.log('Server Action: Starting PDF analysis for:', pdfUrl);

  try {
    // Check if API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return {
        success: false,
        error: 'API key is not configured. Please check your environment variables.'
      };
    }

    // Define the schema for the analysis object using Zod
    const AnalysisItemSchema = z.object({
      id: z.number(),
      title: z.string().describe("Title or short description of the analysis item"),
      details: z.string().describe("Detailed explanation of the analysis item"),
      type: z.enum(['error', 'warning', 'info', 'success']).describe("Type of the item: error, warning, info, or success"),
      score: z.string().optional().describe("Score or grade if applicable"),
      location: z.object({
        pageNumber: z.number().describe("Page number where the item is located"),
        coordinates: z.object({
          startY: z.number().describe("Starting Y coordinate in the page (in pixels)"),
          endY: z.number().describe("Ending Y coordinate in the page (in pixels)"),
          x: z.number().optional().describe("X coordinate for the annotation")
        }).optional().describe("Visual coordinates for annotation")
      }).optional().describe("Location information for the analysis item")
    });

    const AnalysisResultSchema = z.object({
      items: z.array(AnalysisItemSchema).describe("List of analysis items found in the document"),
      summary: z.string().optional().describe("Overall summary of the analysis")
    });

    // Use AI SDK Core to generate structured object with the PDF as an attachment
    const result = await generateObject({
      model: google('gemini-2.0-flash'),
      schema: AnalysisResultSchema,
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that performs in-depth analysis of academic documents.`
        },
        {
          role: 'user',
          content: `Please analyze the PDF document and identify issues, errors, or notable points in the content.\n\nFor each point you identify:\n1. Provide a concise title describing the issue\n2. Add detailed explanation of the issue\n3. Classify it as 'error', 'warning', 'info', or 'success'\n4. If relevant, provide a score or assessment\n5. Include location information (page number and approximate coordinates)\n\nPay special attention to:\n- Mathematical notation and formula errors\n- Conceptual errors in problem solving\n- Quality of reasoning and logic\n- Notable strengths or correct applications\n\nFor coordinates, use relative positions within the page:\n- startY: approximate start position (0-800 where 0 is top of page)\n- endY: approximate end position (0-800 where 800 is bottom of page)\n- x: left-right position (typically use 50 to place annotations on the left margin)`,
          experimental_attachments: [
            {
              url: pdfUrl,
              contentType: 'application/pdf',
              name: 'document.pdf'
            }
          ]
        }
      ]
    });

    // Convert the result to a string for storage/transmission
    console.log('Analysis complete');
    return {
      success: true,
      analysis: JSON.stringify(result.object)
    };
  } catch (error) {
    console.error('Error analyzing PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
} 
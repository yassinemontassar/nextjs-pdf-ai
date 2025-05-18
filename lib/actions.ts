'use server'

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

/**
 * Server Action to analyze a PDF document using Gemini
 * @param pdfUrl URL to the PDF document
 * @returns The analysis text
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

    // Use AI SDK Core to generate text with the PDF as an attachment
    const result = await generateText({
      model: google('gemini-2.0-flash'),
      messages: [
        {
          role: 'user',
          content: 'Please analyze this PDF document and provide a comprehensive summary.',
          // content: 'Please analyze the PDF and provide the following information in JSON format: 1) The title of the document, 2) The exact page number where the title appears, 3) The bounding box coordinates (x, y, width, height) of the title text in the format {x: number, y: number, width: number, height: number}. These coordinates should be in points (pt) relative to the page dimensions.',
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

    console.log('Analysis complete');
    return {
      success: true,
      analysis: result.text
    };
  } catch (error) {
    console.error('Error analyzing PDF:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
} 
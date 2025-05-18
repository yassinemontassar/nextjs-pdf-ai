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
      section: z.string().describe("Section of the CV/resume this feedback relates to, e.g., Work Experience, Education, Skills, etc."),
      title: z.string().describe("Professional headline for the feedback"),
      details: z.string().describe("Detailed, actionable feedback or suggestions"),
      type: z.enum(['strength', 'improvement', 'missing', 'warning', 'info']).describe("Type of the item: strength, improvement, missing, warning, or info"),
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
      items: z.array(AnalysisItemSchema).describe("List of analysis items found in the CV/resume document"),
      summary: z.string().optional().describe("Overall professional summary of the CV/resume"),
      recommendations: z.array(z.string()).optional().describe("Top actionable recommendations for improvement"),
      language: z.string().describe("Detected language of the resume, as a language code and name (e.g., 'fr' and 'French')")
    });

    // Use AI SDK Core to generate structured object with the PDF as an attachment
    const result = await generateObject({
      model: google('gemini-2.0-flash'),
      schema: AnalysisResultSchema,
      messages: [
        {
          role: 'system',
          content: `You are a professional career coach and resume reviewer. Your task is to analyze CV/resume documents and provide structured, actionable, and professional feedback to help the candidate improve their chances of success.`
        },
        {
          role: 'user',
          content: `Please analyze the attached PDF resume. For each section (e.g., Contact Information, Summary, Work Experience, Education, Skills, Certifications, Projects, etc.), provide:\n\n1. A concise, professional headline for your feedback. IMPORTANT: Do NOT include any numbers or IDs in your titles (like \"1.09 Focus on Results\").\n2. Detailed, actionable feedback or suggestions.\n3. Classify each point as a 'strength', 'improvement', 'missing', 'warning', or 'info'.\n4. Indicate the section of the CV this feedback relates to.\n5. DO include approximate page number and location (top, middle, bottom) of the section you're commenting on so we can highlight it.\n\nAt the end, provide an overall summary and a list of top recommendations for improvement.\n\nIMPORTANT: Also detect and return the language of the resume as a language code and name (e.g., 'fr' and 'French') in a 'language' field in your response object.\n\nIMPORTANT: Your entire response (all feedback, summary, recommendations, etc.) must be written in the same language as the resume. For example, if the resume is in French, respond in French; if in English, respond in English, etc.\n\nFocus on:\n- Clarity and professionalism of presentation\n- Relevance and impact of experience and skills\n- Quantifiable achievements\n- Consistency and formatting\n- Missing or weak sections\n- Common resume pitfalls (e.g., typos, vague language, lack of results)\n\nOutput must be a structured object matching the provided schema.`,
          experimental_attachments: [
            {
              url: pdfUrl,
              contentType: 'application/pdf',
              name: 'resume.pdf'
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
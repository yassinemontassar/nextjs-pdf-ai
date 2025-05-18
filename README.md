# PDF Analysis with Gemini

This Next.js application demonstrates how to use the Vercel AI SDK Core with Google's Gemini model to analyze PDF documents. The implementation directly fetches and processes PDFs, avoiding the need for a full chat interface.

## Setup

1. **Get a Google Generative AI API key**:
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create a new API key

2. **Create your environment file**:
   - Create a file named `.env.local` in the root of your project
   - Add your API key in this format:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

## How to Use

### Using the Web Interface

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Open your browser to http://localhost:3000

3. Click the "Analyze PDF with Gemini" button to analyze the example PDF.

## How It Works

1. The application uses Vercel's AI SDK Core to interact with Gemini
2. When a PDF URL is submitted, the app:
   - Fetches the PDF content
   - Converts it to base64
   - Sends it to Gemini via the AI SDK
   - Displays the analysis results

3. The implementation demonstrates:
   - Server-side PDF analysis in an API route
      - Simple UI integration with a React component

## Troubleshooting

- **Error: GOOGLE_GENERATIVE_AI_API_KEY is not set** - Make sure you've created a `.env.local` file with your API key
- **Error fetching PDF** - Check that the PDF URL is publicly accessible 
- **Failed to analyze PDF** - Some PDFs may be too large or complex for Gemini to process

## Technologies Used

- [Next.js](https://nextjs.org/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs/ai-sdk-core)
- [Google Generative AI (Gemini)](https://ai.google.dev/)
- [React PDF](https://react-pdf.org/)

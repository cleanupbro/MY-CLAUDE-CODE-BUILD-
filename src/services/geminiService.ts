import { GoogleGenAI, Type } from '@google/genai';
import { Submission } from '../types';
import { PRICING_KNOWLEDGE_BASE } from '../lib/knowledgeBase';

// UPGRADED: Uses Gemini 3 Pro for better summarization
export const generateSubmissionSummary = async (submission: Submission): Promise<{ summary: string | null; error: string | null; }> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Based on the following submission data for the 'Clean Up Bros' cleaning company, create a concise, professional summary for an admin. Highlight key details. For quotes, focus on service scope, client needs, and potential value. For job applications, summarize the applicant's experience and suitability. \n\nSubmission Type: ${submission.type}\nData: ${JSON.stringify(submission.data, null, 2)}`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
        });

        const text = response.text.trim();
        if (!text) {
            return { summary: null, error: "The AI returned an empty summary." };
        }
        return { summary: text, error: null };
    } catch (error) {
        console.error("Error generating summary with Gemini:", error);
        return { summary: null, error: "Could not connect to the AI to generate a summary." };
    }
};

// NEW FEATURE: Uses Gemini 3 Pro for Lead Scoring
export const generateLeadScore = async (submission: Submission): Promise<{ score: number | null; reasoning: string | null; error: string | null }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `You are a sales expert for Clean Up Bros, a premium cleaning company. Evaluate the value of this lead on a scale of 1 to 10 (10 being highest value/likelihood to convert/long-term profit).

    Consider:
    - Cleaning Frequency (Weekly/Daily is high value).
    - Size of property/contract (More bedrooms or SqM is high value).
    - Commercial vs Residential (Commercial often has higher LTV).
    - Specificity of needs (Detailed notes often mean high intent).

    Return a JSON object with:
    - "score" (integer 1-10)
    - "reasoning" (a short sentence explaining the score).

    Submission Data: ${JSON.stringify(submission.data, null, 2)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER, description: "Lead score from 1-10" },
                reasoning: { type: Type.STRING, description: "Reasoning for the score" }
            },
            required: ["score", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    return { score: result.score, reasoning: result.reasoning, error: null };

  } catch (error) {
    console.error("Error generating lead score:", error);
    return { score: null, reasoning: null, error: "Failed to generate lead score." };
  }
};

// NEW FEATURE: Uses Gemini 3 Pro for Email Drafting
export const generateEmailDraft = async (submission: Submission): Promise<{ draft: string | null; error: string | null }> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `You are a helpful admin assistant for Clean Up Bros. Write a polite, professional email response to the following inquiry.
        
        YOUR KNOWLEDGE BASE (PRICING & RULES):
        ${PRICING_KNOWLEDGE_BASE}

        Context:
        - My Name: Clean Up Bros Admin
        - Tone: Friendly, professional, efficient.
        - If it's a Quote Request: Acknowledge receipt, mention their specific service (${submission.type}), and say we are reviewing the details (quote price if available in data: ${JSON.stringify((submission.data as any).priceEstimate)}).
        - If it's a Job Application: Thank them for applying and say HR is reviewing their experience.
        - Include specific details from their submission to make it personal (e.g. mention their suburb or specific cleaning issue).
        - If applicable, reference the pricing rules from the Knowledge Base to justify the estimate or explain the next steps (e.g. "Our standard deep clean for 3 bedrooms starts at...").

        Submission Data: ${JSON.stringify(submission.data, null, 2)}`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
        });

        return { draft: response.text.trim(), error: null };

    } catch (error) {
        console.error("Error generating email draft:", error);
        return { draft: null, error: "Failed to generate email draft." };
    }
}
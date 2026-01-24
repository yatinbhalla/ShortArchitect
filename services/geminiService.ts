import { GoogleGenAI, Type } from "@google/genai";
import { ShortIdea } from "../types";

const GEMINI_MODEL = 'gemini-3-pro-preview';

export const generateShortsFromContent = async (
  content: string | File,
  contentType: 'text' | 'video' | 'url'
): Promise<ShortIdea[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let parts: any[] = [];
  let useSearch = false;

  if (contentType === 'video' && content instanceof File) {
    const base64Data = await fileToGenerativePart(content);
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: content.type,
      },
    });
    parts.push({
      text: "Analyze this video deeply. Your goal is to find exactly where viral moments start and end. Provide PRECISE timestamps."
    });
  } else if (contentType === 'text' && typeof content === 'string') {
    parts.push({
      text: `Analyze this transcript:\n\n${content}\n\nIdentify the best 5-10 segments for Shorts. Estimate timestamps if they aren't provided.`
    });
  } else if (contentType === 'url' && typeof content === 'string') {
    useSearch = true;
    parts.push({
      text: `Analyze this YouTube video: ${content}. Use Google Search to find transcript/context. Identify 5-10 viral segments with timestamps.`
    });
  }

  const prompt = `
    For each identified viral segment, provide:
    1. 'title': Click-worthy title.
    2. 'hook': First 3 seconds description.
    3. 'script': Full content summary.
    4. 'reasoning': Viral potential explanation.
    5. 'viralScore': (1-10).
    6. 'estimatedDuration': e.g., "15s".
    7. 'startTimeSeconds': Precise start time in seconds (e.g., 45.5).
    8. 'endTimeSeconds': Precise end time in seconds (e.g., 60.0).
    
    Make sure timestamps are strictly within the original video length.
  `;

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts },
      config: {
        thinkingConfig: {
            thinkingBudget: 32768, 
        },
        responseMimeType: "application/json",
        tools: useSearch ? [{ googleSearch: {} }] : undefined,
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              hook: { type: Type.STRING },
              script: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              viralScore: { type: Type.NUMBER },
              estimatedDuration: { type: Type.STRING },
              startTimeSeconds: { type: Type.NUMBER },
              endTimeSeconds: { type: Type.NUMBER },
            },
            required: ["title", "hook", "script", "reasoning", "viralScore", "estimatedDuration", "startTimeSeconds", "endTimeSeconds"],
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ShortIdea[];
    }
    throw new Error("No data returned from Gemini.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

async function fileToGenerativePart(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
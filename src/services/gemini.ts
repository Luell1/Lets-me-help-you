import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

export async function evaluateGameIdea(idea: string, lang: Language = 'zh') {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: `Evaluate the following indie game idea for profitability, development feasibility, and market potential.
    Idea: ${idea}
    
    Please provide the response in ${lang === 'zh' ? 'Chinese' : 'English'}.
    
    Provide a structured JSON response with:
    - score: Overall potential score (0-100)
    - pros: Array of strengths
    - cons: Array of weaknesses/risks
    - suggestions: Array of actionable improvements for better profitability.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["score", "pros", "cons", "suggestions"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function getMarketTrends(lang: Language = 'zh') {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: `Analyze current indie game market trends for 2025. What genres are most profitable for small teams? Provide a summary of 3-5 key trends.
    Please provide the response in ${lang === 'zh' ? 'Chinese' : lang === 'en' ? 'English' : lang === 'ja' ? 'Japanese' : 'Korean'}.`,
    config: {
      systemInstruction: "You are a world-class indie game market analyst. Be concise and data-driven."
    }
  });

  return response.text;
}

export async function generateMarketingPlan(idea: string, lang: Language = 'zh') {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: `Create a comprehensive marketing plan for this indie game idea: ${idea}
    Please provide the response in ${lang === 'zh' ? 'Chinese' : lang === 'en' ? 'English' : lang === 'ja' ? 'Japanese' : 'Korean'}.
    
    Provide a structured JSON response with:
    - targetAudience: String describing the core player base
    - timeline: Array of objects with { phase: string, actions: string[] } for Pre-launch, Launch, and Post-launch
    - socialStrategy: Array of strings for social media marketing tips`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          targetAudience: { type: Type.STRING },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                actions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["phase", "actions"]
            }
          },
          socialStrategy: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["targetAudience", "timeline", "socialStrategy"]
      }
    }
  });

  return JSON.parse(response.text);
}
export async function getHistoricalRankings(platform: string, year: number, lang: Language = 'zh') {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: `Provide a list of the top 10 best-selling or most popular indie games on ${platform} for the year ${year}.
    Please provide the response in ${lang === 'zh' ? 'Chinese' : lang === 'en' ? 'English' : lang === 'ja' ? 'Japanese' : 'Korean'}.
    
    Provide a structured JSON response with an array of objects:
    - rank: Number (1-10)
    - title: String (Game title)
    - genre: String (Game genre)
    - estimatedSales: String (Estimated sales or review count if sales unknown)`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            rank: { type: Type.NUMBER },
            title: { type: Type.STRING },
            genre: { type: Type.STRING },
            estimatedSales: { type: Type.STRING },
          },
          required: ["rank", "title", "genre", "estimatedSales"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}

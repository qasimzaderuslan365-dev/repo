
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getIntelligentServiceMatch = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User search query: "${query}". Identify the service category or specific keywords related to professional services in Azerbaijan (plumbing, cleaning, electrical, general repair, painting, gardening). Return a JSON object with synonyms and the primary category.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryCategory: { type: Type.STRING, description: "The most likely service category" },
            keywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Related technical terms or synonyms" 
            }
          },
          required: ["primaryCategory", "keywords"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini search enhancement failed:", error);
    return { primaryCategory: query, keywords: [query] };
  }
};

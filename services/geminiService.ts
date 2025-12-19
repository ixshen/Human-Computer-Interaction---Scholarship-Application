
import { GoogleGenAI, Type } from "@google/genai";
import { Scholarship } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getSmartRecommendations(query: string, allScholarships: Scholarship[]): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is searching for: "${query}". 
      From the following scholarship list, return the IDs of the scholarships that most closely match the user's intent.
      Scholarships: ${JSON.stringify(allScholarships.map(s => ({ id: s.id, title: s.title, tags: s.tags, desc: s.description })))}
      
      Return ONLY a JSON array of scholarship IDs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    return result as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback: simple text match if AI fails
    return allScholarships
      .filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || 
                   s.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
      .map(s => s.id);
  }
}

export async function getScholarshipSummary(scholarship: Scholarship): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following scholarship into 2 very concise bullet points for a mobile user:
      Title: ${scholarship.title}
      Description: ${scholarship.description}
      Tags: ${scholarship.tags.join(', ')}`,
    });
    return response.text.trim();
  } catch (error) {
    return "No summary available.";
  }
}

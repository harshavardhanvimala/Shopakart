
import { GoogleGenAI } from "@google/genai";

export async function generateShopDescription(name: string, category: string) {
  // Fix: Removed fallback and used process.env.API_KEY directly as per @google/genai coding guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a catchy, professional 2-sentence marketing description for a shop named "${name}" in the "${category}" category.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI description.";
  }
}

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    if (!description) {
      return Response.json({ error: "Missing description" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `A user is manually logging a meal they ate. Based on their description, identify the food item(s) and estimate a macro breakdown.
Description: "${description}"

Respond ONLY with valid JSON, no markdown fences, no preamble, in this exact shape:
{
  "items": [
    { "name": "string", "portion_estimate": "string", "calories": number, "protein_g": number, "carbs_g": number, "fat_g": number }
  ],
  "total": { "calories": number, "protein_g": number, "carbs_g": number, "fat_g": number },
  "confidence": "low" | "medium" | "high"
}`,
            },
          ],
        },
      ],
    });

    const text = response.text.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    return Response.json(result);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to analyze description" },
      { status: 500 },
    );
  }
}

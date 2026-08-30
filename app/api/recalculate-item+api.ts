import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { name, portion_estimate } = await request.json();

    if (!name || !portion_estimate) {
      return Response.json(
        { error: "Missing name or portion" },
        { status: 400 },
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Estimate the nutrition for this food item and portion size.
Food: ${name}
Portion: ${portion_estimate}

Respond ONLY with valid JSON, no markdown fences, no preamble, in this exact shape:
{
  "calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number
}`,
            },
          ],
        },
      ],
    });

    const text = response.text.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const macros = JSON.parse(clean);

    return Response.json(macros);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to recalculate" }, { status: 500 });
  }
}

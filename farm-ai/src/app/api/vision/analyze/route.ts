import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { auth } from "@/auth";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const formData = await req.formData();
  const imageFile = formData.get("image") as File;

  if (!imageFile) {
    return Response.json({ error: "No image provided" }, { status: 400 });
  }

  // Convert the uploaded file to base64
  const bytes = await imageFile.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mimeType = imageFile.type || "image/jpeg";

  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: `data:${mimeType};base64,${base64}`,
            },
            {
              type: "text",
              text: `You are an expert plant pathologist AI. Analyze this plant/crop image and provide a diagnosis.

IMPORTANT: Respond ONLY in valid JSON format with this exact structure (no markdown, no code blocks, just raw JSON):
{
  "name": "Disease name or 'Healthy Plant' if no disease detected",
  "crop": "Identified crop type (e.g., Tomato, Wheat, Rice, Cotton)",
  "description": "2-3 sentence description of the condition",
  "symptoms": ["symptom 1", "symptom 2", "symptom 3"],
  "confidence": 85,
  "severity": "low|medium|high|critical",
  "treatment": ["treatment step 1", "treatment step 2", "treatment step 3"],
  "prevention": ["prevention tip 1", "prevention tip 2", "prevention tip 3"]
}

If the image is not a plant or crop, still return the JSON with name "Not a Plant Image" and appropriate fields.
Be specific about Indian agriculture treatments and locally available solutions.`,
            },
          ],
        },
      ],
    });

    // Parse the JSON response from Gemini
    let result;
    try {
      // Strip any markdown code block markers if present
      const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      // If parsing fails, create a structured fallback
      result = {
        name: "Analysis Complete",
        crop: "Unknown",
        description: text.slice(0, 200),
        symptoms: ["See description for details"],
        confidence: 70,
        severity: "medium",
        treatment: ["Consult a local agricultural expert for specific treatment"],
        prevention: ["Regular crop monitoring recommended"],
      };
    }

    return Response.json({ result });
  } catch (error: any) {
    console.error("Vision analysis error:", error);
    return Response.json(
      { error: "Failed to analyze image. Please try again." },
      { status: 500 }
    );
  }
}

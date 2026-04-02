import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const formData = await req.formData();
  const imageFile = formData.get("image") as File;

  if (!imageFile) {
    return Response.json({ error: "No image provided" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY_NEW || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  // Convert the uploaded file to base64
  const bytes = await imageFile.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mimeType = (imageFile.type || "image/jpeg") as string;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType: mimeType,
        },
      },
      {
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
    ]);

    const response = result.response;
    const text = response.text();

    // Parse the JSON response from Gemini
    let parsed;
    try {
      // Strip any markdown code block markers if present
      const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // If parsing fails, create a structured fallback
      parsed = {
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

    return Response.json({ result: parsed });
  } catch (error: any) {
    console.error("Vision analysis error:", error?.message || error);
    return Response.json(
      { error: `Failed to analyze image: ${error?.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

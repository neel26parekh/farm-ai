import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
const humanReviewNumber = process.env.WHATSAPP_HUMAN_REVIEW_NUMBER;
const geminiKey = process.env.GEMINI_API_KEY_NEW || process.env.GEMINI_API_KEY;

const google = createGoogleGenerativeAI({ apiKey: geminiKey });

const urgentKeywords = [
  "urgent",
  "dying",
  "severe",
  "emergency",
  "blast",
  "blight",
  "wilting",
  "pest outbreak",
];

async function sendWhatsAppText(to: string, body: string) {
  if (!accessToken || !phoneNumberId) return;
  await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      text: { body },
    }),
  });
}

function parsePlannerResponse(raw: string): {
  reply: string;
  confidence: "high" | "medium" | "low";
  needsHuman: boolean;
  reason: string;
} {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    const payload = match ? JSON.parse(match[0]) : JSON.parse(raw);
    return {
      reply: String(payload.reply || "Please share your crop details and symptoms."),
      confidence: (String(payload.confidence || "medium").toLowerCase() as "high" | "medium" | "low"),
      needsHuman: Boolean(payload.needsHuman),
      reason: String(payload.reason || "No reason provided"),
    };
  } catch {
    return {
      reply: raw.slice(0, 900),
      confidence: "medium",
      needsHuman: false,
      reason: "Fallback parser used",
    };
  }
}

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && verifyToken && token === verifyToken) {
    return new NextResponse(challenge || "", { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const from = message?.from;
    const userText = message?.text?.body || message?.image?.caption;

    if (!from || !userText) {
      return NextResponse.json({ ok: true });
    }

    if (!accessToken || !phoneNumberId || !geminiKey) {
      return NextResponse.json({
        ok: false,
        error: "Missing WhatsApp or AI environment variables",
      });
    }

    const aiResponse = await generateText({
      model: google("gemini-2.5-flash"),
      system:
        "You are AgroNexus AI, an agronomy assistant for Indian farmers. Return STRICT JSON with keys: reply, confidence(high|medium|low), needsHuman(boolean), reason. Keep reply practical and short.",
      prompt: userText,
      maxOutputTokens: 300,
    });

    const planned = parsePlannerResponse(aiResponse.text);
    const textLower = String(userText).toLowerCase();
    const keywordEscalation = urgentKeywords.some((kw) => textLower.includes(kw));
    const needsHuman = planned.needsHuman || planned.confidence === "low" || keywordEscalation;

    const confidenceLabel = planned.confidence.toUpperCase();
    await sendWhatsAppText(from, `${planned.reply}\n\nConfidence: ${confidenceLabel}`.slice(0, 1200));

    if (needsHuman) {
      await sendWhatsAppText(
        from,
        "I have also flagged this for human agronomist review. Please share 2-3 clear crop photos and your village name for faster support."
      );

      if (humanReviewNumber) {
        await sendWhatsAppText(
          humanReviewNumber,
          `Human review needed\nFrom: ${from}\nReason: ${planned.reason}\nConfidence: ${confidenceLabel}\nQuery: ${String(userText).slice(0, 500)}`
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Webhook error",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
const geminiKey = process.env.GEMINI_API_KEY_NEW || process.env.GEMINI_API_KEY;

const google = createGoogleGenerativeAI({ apiKey: geminiKey });

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
    const userText = message?.text?.body;

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
        "You are AgroNexus AI, an agronomy assistant for Indian farmers. Provide short practical guidance in simple language.",
      prompt: userText,
      maxOutputTokens: 300,
    });

    const text = aiResponse.text.slice(0, 1200);

    await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: from,
        text: { body: text },
      }),
    });

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

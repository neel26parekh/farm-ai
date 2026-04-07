import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const geminiKey = process.env.GEMINI_API_KEY_NEW || process.env.GEMINI_API_KEY;

const google = createGoogleGenerativeAI({
  apiKey: geminiKey,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, farmContext, language } = await req.json();

  if (!messages || messages.length === 0) {
    return new Response("No messages provided", { status: 400 });
  }

  // Get session for DB persistence - non-blocking
  let userId: string | null = null;
  try {
    const session = await auth();
    userId = session?.user?.id ?? null;
  } catch { /* non-blocking */ }

  const lastMessage = messages[messages.length - 1];

  // Fire DB write in background — do NOT await before streaming
  if (userId) {
    prisma.chatMessage.create({
      data: { userId, content: lastMessage.content, role: "user" },
    }).catch(() => {});
  }

  // Build personalized system prompt from user's farm settings
  let farmInfo = "";
  if (farmContext && typeof farmContext === "object") {
    const fc = farmContext as any;
    if (fc.primaryCrop) farmInfo += `The farmer's primary crop is ${fc.primaryCrop}. `;
    if (fc.location) farmInfo += `Their farm is located in ${fc.location}. `;
    if (fc.farmSize) farmInfo += `Farm size is approximately ${fc.farmSize} acres. `;
    if (fc.fullName) farmInfo += `The farmer's name is ${fc.fullName}. `;
    if (fc.irrigationType) farmInfo += `Irrigation type is ${fc.irrigationType}. `;
    if (fc.sowingDate) farmInfo += `Sowing date is ${fc.sowingDate}. `;
    if (fc.budgetBand) farmInfo += `Input budget band is ${fc.budgetBand}. `;
  }

  const languageLabel =
    language === "hi" ? "Hindi" :
    language === "gu" ? "Gujarati" :
    language === "mr" ? "Marathi" :
    language === "te" ? "Telugu" : "English";

  // Start streaming immediately — no DB wait
  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `You are the AgroNexus AI Advisor, an expert agronomist specialized in Indian agriculture. 
${farmInfo ? `\nFARMER CONTEXT: ${farmInfo}\nUse this context to give personalized, location-specific advice when relevant.\n` : ""}
You provide brief, actionable, and scientifically accurate farming advice.
- Respond in ${languageLabel} using simple farmer-friendly wording.
- Keep answers concise and practical.
- Use this output structure:
  1) Recommendation
  2) Why this helps
  3) Confidence: High/Medium/Low
  4) When to contact local agronomist
- If disease risk appears severe, always recommend local agronomist/extension-worker verification.
- If asked about prices, refer them to the Market Intelligence dashboard.
- Never fabricate exact government subsidy amounts.`,
    messages,
    onFinish: async ({ text }) => {
      if (userId) {
        prisma.chatMessage.create({
          data: { userId, content: text, role: "assistant" },
        }).catch(() => {});
      }
    },
  });

  return result.toTextStreamResponse();
}

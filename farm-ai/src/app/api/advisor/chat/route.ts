import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, farmContext } = await req.json();

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
  }

  // Start streaming immediately — no DB wait
  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `You are the AgroNexus AI Advisor, an expert agronomist specialized in Indian agriculture. 
${farmInfo ? `\nFARMER CONTEXT: ${farmInfo}\nUse this context to give personalized, location-specific advice when relevant.\n` : ""}
You provide brief, actionable, and scientifically accurate farming advice.
- Keep answers concise and practical.
- Use bullet points for steps or treatments.
- If asked about prices, refer them to the Market Intelligence dashboard.
- Speak as a trusted, professional AI assistant for farmers.`,
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

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// Create a custom Google Generative AI provider using the key provided by the user
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];

  // Save the user's message to the database immediately
  await prisma.chatMessage.create({
    data: {
      userId: userId,
      content: lastMessage.content,
      role: "user"
    }
  });


  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: `You are the AgroNexus AI Advisor, an expert agronomist specialized in Indian agriculture. 
You provide brief, actionable, and scientifically accurate farming advice.
- Keep your answers concise unless explicitly asked for a long explanation.
- Use bullet points when suggesting steps or treatments.
- If asked about prices, remind them to check the Market Intelligence dashboard.
- Speak professionally, as a trusted AI assistant.`,
    messages,
    onFinish: async ({ text }) => {
      // Save the AI's response to the database once the stream completes
      await prisma.chatMessage.create({
        data: {
          userId: userId,
          content: text,
          role: "assistant"
        }
      });
    }
  });

  return result.toDataStreamResponse();
}

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const messages = await prisma.chatMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { timestamp: "asc" },
  })

  return NextResponse.json(messages.map(m => ({
    id: m.id,
    role: m.role,
    content: m.content,
    timestamp: m.timestamp
  })))
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { content, role } = await req.json()

  const newMessage = await prisma.chatMessage.create({
    data: {
      userId: session.user.id,
      content,
      role
    }
  })

  return NextResponse.json(newMessage)
}

export async function DELETE() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.chatMessage.deleteMany({
    where: { userId: session.user.id }
  })

  return NextResponse.json({ cleared: true })
}

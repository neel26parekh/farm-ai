import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const pins = await prisma.pinnedCrop.findMany({
    where: { userId: session.user.id },
    select: { cropName: true },
  })

  return NextResponse.json(pins.map(p => p.cropName))
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { cropName } = await req.json()

  const existing = await prisma.pinnedCrop.findUnique({
    where: {
      userId_cropName: { userId: session.user.id, cropName: cropName.toLowerCase() }
    }
  })

  if (existing) {
    await prisma.pinnedCrop.delete({
      where: { id: existing.id }
    })
    return NextResponse.json({ pinned: false })
  } else {
    await prisma.pinnedCrop.create({
      data: {
        userId: session.user.id,
        cropName: cropName.toLowerCase()
      }
    })
    return NextResponse.json({ pinned: true })
  }
}

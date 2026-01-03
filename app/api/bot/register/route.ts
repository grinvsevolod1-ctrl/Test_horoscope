import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { ZodiacSign } from "@/lib/types/database"

// POST /api/bot/register - Register new user from Telegram bot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { telegram_id, zodiac_sign, birth_date, timezone } = body

    // Validate required fields
    if (!telegram_id || !zodiac_sign) {
      return NextResponse.json({ error: "Missing required fields: telegram_id, zodiac_sign" }, { status: 400 })
    }

    // Validate zodiac sign
    const validSigns: ZodiacSign[] = [
      "aries",
      "taurus",
      "gemini",
      "cancer",
      "leo",
      "virgo",
      "libra",
      "scorpio",
      "sagittarius",
      "capricorn",
      "aquarius",
      "pisces",
    ]
    if (!validSigns.includes(zodiac_sign)) {
      return NextResponse.json({ error: "Invalid zodiac_sign" }, { status: 400 })
    }

    // In production, save to database
    const userId = uuidv4()

    /*
    const user = await db.users.upsert({
      where: { telegram_id },
      create: {
        id: userId,
        telegram_id,
        zodiac_sign,
        birth_date: birth_date ? new Date(birth_date) : null,
        timezone: timezone || 'Europe/Minsk',
      },
      update: {
        zodiac_sign,
        birth_date: birth_date ? new Date(birth_date) : null,
        timezone: timezone || 'Europe/Minsk',
      },
      include: {
        subscription: true,
      },
    })
    */

    // Mock response
    return NextResponse.json({
      user_id: userId,
      telegram_id,
      zodiac_sign,
      timezone: timezone || "Europe/Minsk",
      subscription: {
        status: "trial",
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    })
  } catch (error) {
    console.error("User registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}

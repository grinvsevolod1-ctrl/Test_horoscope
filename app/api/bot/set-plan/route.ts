import { type NextRequest, NextResponse } from "next/server"
import { createCheckout } from "@/lib/bepaid"
import { v4 as uuidv4 } from "uuid"

const PLAN_PRICES: Record<string, number> = {
  basic: 300,
  plus: 600,
  premium: 1200,
}

const PLAN_NAMES: Record<string, string> = {
  basic: "Базовый",
  plus: "Плюс",
  premium: "Премиум",
}

// POST /api/bot/set-plan - Start checkout for plan selection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, telegram_id, plan_id, email } = body

    if (!telegram_id || !plan_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const amount = PLAN_PRICES[plan_id]
    if (!amount) {
      return NextResponse.json({ error: "Invalid plan_id" }, { status: 400 })
    }

    const orderId = uuidv4()

    const checkout = await createCheckout({
      orderId,
      amount,
      description: `Daily Astro — ${PLAN_NAMES[plan_id]} (месяц)`,
      email,
      telegramId: telegram_id.toString(),
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/return?status=success`,
      notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/bepaid`,
      recurring: true,
    })

    return NextResponse.json({
      checkout_url: checkout.checkout.redirect_url,
      order_id: orderId,
    })
  } catch (error) {
    console.error("Set plan error:", error)
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
  }
}

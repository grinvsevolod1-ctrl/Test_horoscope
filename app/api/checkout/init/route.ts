import { type NextRequest, NextResponse } from "next/server"
import { createCheckout } from "@/lib/bepaid"
import { v4 as uuidv4 } from "uuid"

// Plan prices in kopecks
const PLAN_PRICES: Record<string, number> = {
  plan_basic: 300,
  plan_plus: 600,
  plan_premium: 1200,
}

const PLAN_NAMES: Record<string, string> = {
  plan_basic: "Базовый",
  plan_plus: "Плюс",
  plan_premium: "Премиум",
}

// POST /api/checkout/init - Initialize checkout session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, plan_id, telegram_id, email, return_url } = body

    // Validate required fields
    if (!plan_id || !telegram_id) {
      return NextResponse.json({ error: "Missing required fields: plan_id, telegram_id" }, { status: 400 })
    }

    // Validate plan exists
    const amount = PLAN_PRICES[plan_id]
    if (!amount) {
      return NextResponse.json({ error: "Invalid plan_id" }, { status: 400 })
    }

    const orderId = uuidv4()
    const planName = PLAN_NAMES[plan_id]

    // Create bePaid checkout
    const checkout = await createCheckout({
      orderId,
      amount,
      description: `Daily Astro — ${planName} (месяц)`,
      email,
      telegramId: telegram_id.toString(),
      returnUrl: return_url || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/return`,
      notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/bepaid`,
      recurring: true,
    })

    // In production, save pending payment to database
    // await db.payments.create({
    //   order_id: orderId,
    //   user_id,
    //   plan_id,
    //   amount,
    //   status: 'pending',
    // })

    return NextResponse.json({
      checkout_url: checkout.checkout.redirect_url,
      order_id: orderId,
      token: checkout.checkout.token,
    })
  } catch (error) {
    console.error("Checkout init error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout" },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"

// POST /api/bot/cancel - Cancel subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, telegram_id } = body

    if (!user_id && !telegram_id) {
      return NextResponse.json({ error: "Missing user_id or telegram_id" }, { status: 400 })
    }

    // In production:
    // 1. Find subscription by user_id
    // 2. Set status to 'canceled'
    // 3. Set canceled_at timestamp
    // 4. User retains access until renew_at

    /*
    const subscription = await db.subscriptions.update({
      where: { 
        user_id,
        status: { in: ['active', 'trial'] }
      },
      data: {
        status: 'canceled',
        canceled_at: new Date(),
      },
    })

    // Note: We don't need to call bePaid API to stop recurring
    // because we simply won't charge the token anymore
    */

    return NextResponse.json({
      status: "canceled",
      message: "Подписка отменена. Доступ сохранится до конца оплаченного периода.",
    })
  } catch (error) {
    console.error("Cancel subscription error:", error)
    return NextResponse.json({ error: "Cancellation failed" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: "subscriptionId required" }, { status: 400 })
    }

    // Get last successful payment
    const payments = await sql`
      SELECT id, provider_payment_id, amount_byn
      FROM payments
      WHERE subscription_id = ${subscriptionId}
        AND status = 'succeeded'
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (payments.length === 0) {
      return NextResponse.json({ error: "No payment to refund" }, { status: 400 })
    }

    const payment = payments[0]

    // TODO: Call bePaid refund API here
    // For now, just mark as refunded locally

    await sql`
      UPDATE payments 
      SET status = 'refunded', updated_at = NOW()
      WHERE id = ${payment.id}
    `

    await sql`
      UPDATE subscriptions 
      SET status = 'canceled', updated_at = NOW()
      WHERE id = ${subscriptionId}
    `

    return NextResponse.json({
      success: true,
      refundedAmount: payment.amount_byn / 100,
    })
  } catch (error) {
    console.error("Refund error:", error)
    return NextResponse.json({ error: "Failed to refund" }, { status: 500 })
  }
}

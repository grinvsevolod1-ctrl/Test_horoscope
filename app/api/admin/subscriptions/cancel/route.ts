import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: "subscriptionId required" }, { status: 400 })
    }

    await sql`
      UPDATE subscriptions 
      SET status = 'canceled', updated_at = NOW()
      WHERE id = ${subscriptionId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cancel subscription error:", error)
    return NextResponse.json({ error: "Failed to cancel" }, { status: 500 })
  }
}

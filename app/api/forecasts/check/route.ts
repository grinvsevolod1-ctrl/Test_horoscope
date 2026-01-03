import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const result = await sql`
      SELECT COUNT(DISTINCT zodiac_sign)::int as count 
      FROM forecasts 
      WHERE forecast_date = CURRENT_DATE
    `

    return NextResponse.json({
      count: result[0]?.count || 0,
      date: new Date().toISOString().split("T")[0],
    })
  } catch (error) {
    console.error("Error checking forecasts:", error)
    return NextResponse.json({ count: 0, error: "Database error" }, { status: 500 })
  }
}

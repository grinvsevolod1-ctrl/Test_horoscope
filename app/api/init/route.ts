import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const botToken = process.env.BOT_TOKEN
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dailyastro.site"

    if (!botToken) {
      return NextResponse.json({ status: "skipped", reason: "no_bot_token" })
    }

    await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook?drop_pending_updates=true`)

    await new Promise((r) => setTimeout(r, 1000))

    // Set new webhook with explicit URL (no trailing slash)
    const webhookUrl = `${appUrl}/api/webhooks/telegram`

    const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        drop_pending_updates: true,
        allowed_updates: ["message", "callback_query"],
      }),
    })
    const result = await response.json()

    const infoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`)
    const info = await infoResponse.json()

    return NextResponse.json({
      status: result.ok ? "configured" : "failed",
      url: webhookUrl,
      result,
      webhookInfo: info.result,
    })
  } catch (error) {
    console.error("[v0] Init error:", error)
    return NextResponse.json({ status: "error", message: String(error) })
  }
}

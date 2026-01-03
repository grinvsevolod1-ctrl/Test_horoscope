import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const results = {
    forecasts: { generated: 0 },
    deliveries: { sent: 0, failed: 0 },
    recurring: { processed: 0 },
    webhook: { status: "unknown" },
  }

  try {
    // 1. Setup bot webhook if not set
    const botToken = process.env.BOT_TOKEN
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    if (botToken && appUrl) {
      const webhookUrl = `${appUrl}/api/webhooks/telegram`
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`,
      )
      const data = await response.json()
      results.webhook = { status: data.ok ? "set" : "failed", description: data.description }
    }

    // 2. Generate forecasts for today
    const today = new Date().toISOString().split("T")[0]
    const signs = [
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

    const existingForecasts = await sql`
      SELECT zodiac_sign FROM forecasts WHERE forecast_date = ${today}
    `
    const existingSigns = new Set(existingForecasts.map((f: any) => f.zodiac_sign))

    const templates = await sql`SELECT * FROM content_templates`
    const templatesByType: Record<string, any[]> = {}
    templates.forEach((t: any) => {
      if (!templatesByType[t.category]) templatesByType[t.category] = []
      templatesByType[t.category].push(t)
    })

    const getRandomTemplate = (category: string) => {
      const arr = templatesByType[category] || []
      return arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)].template : ""
    }

    for (const sign of signs) {
      if (existingSigns.has(sign)) continue

      await sql`
        INSERT INTO forecasts (id, zodiac_sign, forecast_date, love, money, mood, advice, source, generated_at)
        VALUES (
          gen_random_uuid(),
          ${sign},
          ${today},
          ${getRandomTemplate("love")},
          ${getRandomTemplate("money")},
          ${getRandomTemplate("mood")},
          ${getRandomTemplate("advice")},
          '{"source": "templates"}',
          NOW()
        )
      `
      results.forecasts.generated++
    }

    // 3. Deliver forecasts to active subscribers
    const activeSubscribers = await sql`
      SELECT u.id, u.telegram_id, u.zodiac_sign, u.language
      FROM users u
      JOIN subscriptions s ON u.id = s.user_id
      WHERE s.status = 'active'
        AND u.telegram_id IS NOT NULL
        AND u.zodiac_sign IS NOT NULL
    `

    for (const user of activeSubscribers) {
      const forecast = await sql`
        SELECT * FROM forecasts 
        WHERE zodiac_sign = ${user.zodiac_sign} AND forecast_date = ${today}
        LIMIT 1
      `

      if (forecast.length === 0) continue

      const f = forecast[0]
      const signNames: Record<string, string> = {
        aries: "Овен",
        taurus: "Телец",
        gemini: "Близнецы",
        cancer: "Рак",
        leo: "Лев",
        virgo: "Дева",
        libra: "Весы",
        scorpio: "Скорпион",
        sagittarius: "Стрелец",
        capricorn: "Козерог",
        aquarius: "Водолей",
        pisces: "Рыбы",
      }

      const message = `✨ *${signNames[user.zodiac_sign] || user.zodiac_sign}* — ${today}

❤️ *Любовь:* ${f.love}

💰 *Финансы:* ${f.money}

🌟 *Настроение:* ${f.mood}

💡 *Совет дня:* ${f.advice}

Хорошего дня! 🌙`

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: user.telegram_id,
            text: message,
            parse_mode: "Markdown",
          }),
        })

        await sql`
          INSERT INTO deliveries (id, user_id, forecast_id, channel, status, delivered_at)
          VALUES (gen_random_uuid(), ${user.id}, ${f.id}, 'telegram', 'delivered', NOW())
        `
        results.deliveries.sent++
      } catch (error) {
        await sql`
          INSERT INTO deliveries (id, user_id, forecast_id, channel, status, error_message)
          VALUES (gen_random_uuid(), ${user.id}, ${f.id}, 'telegram', 'failed', ${String(error)})
        `
        results.deliveries.failed++
      }
    }

    // 4. Process recurring payments
    const expiringSubscriptions = await sql`
      SELECT s.*, u.telegram_id, p.name as plan_name, p.price
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      JOIN plans p ON s.plan_id = p.id
      WHERE s.status = 'active'
        AND s.ends_at <= NOW() + INTERVAL '1 day'
        AND s.auto_renew = true
    `

    for (const sub of expiringSubscriptions) {
      // Mark for renewal notification
      if (sub.telegram_id && botToken) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: sub.telegram_id,
            text: `⏰ Ваша подписка "${sub.plan_name}" истекает завтра.\n\nДля продления перейдите в настройки: /settings`,
            parse_mode: "Markdown",
          }),
        })
      }
      results.recurring.processed++
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Daily cron error:", error)
    return NextResponse.json({ error: String(error), results }, { status: 500 })
  }
}

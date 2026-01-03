import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const sql = neon(process.env.DATABASE_URL!)

export const dynamic = "force-dynamic"

async function checkAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin_auth")
  return authCookie?.value === process.env.ADMIN_PASSWORD
}

const ZODIAC_SYMBOLS: Record<string, string> = {
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpio: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓",
}

async function getTodayForecasts() {
  try {
    return await sql`
      SELECT * FROM forecasts 
      WHERE forecast_date = CURRENT_DATE
      ORDER BY zodiac_sign
    `
  } catch {
    return []
  }
}

export default async function ForecastsPage() {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) redirect("/admin/login")

  const forecasts = await getTodayForecasts()
  const today = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Прогнозы на {today}</h2>
        <a
          href="/api/cron/daily"
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-sm font-medium transition-colors"
        >
          Сгенерировать
        </a>
      </div>

      {forecasts.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-12 text-center">
          <p className="text-zinc-500">Прогнозы на сегодня не сгенерированы</p>
          <a href="/api/cron/daily" className="mt-4 inline-block text-cyan-400 hover:underline">
            Запустить генерацию
          </a>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forecasts.map((forecast) => (
            <div key={forecast.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{ZODIAC_SYMBOLS[forecast.zodiac_sign] || "⭐"}</span>
                <span className="font-semibold capitalize">{forecast.zodiac_sign}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-pink-400">❤️ Любовь:</span>
                  <p className="text-zinc-400 mt-1">{forecast.love}</p>
                </div>
                <div>
                  <span className="text-green-400">💰 Деньги:</span>
                  <p className="text-zinc-400 mt-1">{forecast.money}</p>
                </div>
                <div>
                  <span className="text-blue-400">🌟 Настроение:</span>
                  <p className="text-zinc-400 mt-1">{forecast.mood}</p>
                </div>
                <div>
                  <span className="text-yellow-400">💡 Совет:</span>
                  <p className="text-zinc-400 mt-1">{forecast.advice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

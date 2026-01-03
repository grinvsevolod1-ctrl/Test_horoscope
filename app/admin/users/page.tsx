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

async function getUsers() {
  try {
    return await sql`
      SELECT 
        u.id, u.telegram_id, u.zodiac_sign, u.timezone, u.created_at, u.is_paused,
        s.status as subscription_status, p.name as plan_name
      FROM users u
      LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status IN ('active', 'trial', 'grace')
      LEFT JOIN plans p ON s.plan_id = p.id
      ORDER BY u.created_at DESC
      LIMIT 100
    `
  } catch {
    return []
  }
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

export default async function UsersPage() {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) redirect("/admin/login")

  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Пользователи</h2>
        <span className="text-zinc-500">Всего: {users.length}</span>
      </div>

      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-900">
            <tr className="text-left text-sm text-zinc-400">
              <th className="p-4">Telegram ID</th>
              <th className="p-4">Знак</th>
              <th className="p-4">Тариф</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Регистрация</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-zinc-800 hover:bg-zinc-900/50">
                <td className="p-4 font-medium">{user.telegram_id}</td>
                <td className="p-4">
                  {user.zodiac_sign && (
                    <span className="flex items-center gap-2">
                      <span>{ZODIAC_SYMBOLS[user.zodiac_sign] || "⭐"}</span>
                      <span className="capitalize text-zinc-400">{user.zodiac_sign}</span>
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <span className={user.plan_name ? "text-cyan-400 capitalize" : "text-zinc-600"}>
                    {user.plan_name || "—"}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      user.subscription_status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : user.subscription_status === "trial"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : user.is_paused
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {user.subscription_status || (user.is_paused ? "paused" : "free")}
                  </span>
                </td>
                <td className="p-4 text-sm text-zinc-500">{new Date(user.created_at).toLocaleDateString("ru-RU")}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  Нет пользователей
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

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

async function getSubscriptions() {
  try {
    return await sql`
      SELECT 
        s.id, s.status, s.start_at, s.renew_at, s.created_at,
        u.telegram_id, u.zodiac_sign,
        p.name as plan_name, p.price_byn_month
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      JOIN plans p ON s.plan_id = p.id
      ORDER BY s.created_at DESC
      LIMIT 100
    `
  } catch {
    return []
  }
}

export default async function SubscriptionsPage() {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) redirect("/admin/login")

  const subscriptions = await getSubscriptions()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Подписки</h2>

      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-900">
            <tr className="text-left text-sm text-zinc-400">
              <th className="p-4">Пользователь</th>
              <th className="p-4">Тариф</th>
              <th className="p-4">Цена</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Продление</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="border-t border-zinc-800 hover:bg-zinc-900/50">
                <td className="p-4">
                  <div className="font-medium">{sub.telegram_id}</div>
                  <div className="text-sm text-zinc-500 capitalize">{sub.zodiac_sign}</div>
                </td>
                <td className="p-4 capitalize text-cyan-400">{sub.plan_name}</td>
                <td className="p-4">{(sub.price_byn_month / 100).toFixed(2)} BYN</td>
                <td className="p-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      sub.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : sub.status === "trial"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : sub.status === "grace"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-zinc-500">
                  {sub.renew_at ? new Date(sub.renew_at).toLocaleDateString("ru-RU") : "—"}
                </td>
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  Нет подписок
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

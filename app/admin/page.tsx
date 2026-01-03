import { neon } from "@neondatabase/serverless"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sql = neon(process.env.DATABASE_URL!)

export const dynamic = "force-dynamic"

async function checkAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin_auth")
  return authCookie?.value === process.env.ADMIN_PASSWORD
}

async function getStats() {
  try {
    const [users, activeSubscriptions, revenue, todayDeliveries] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM users`,
      sql`SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'`,
      sql`SELECT COALESCE(SUM(amount_byn), 0) as total FROM payments WHERE status = 'succeeded' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)`,
      sql`SELECT COUNT(*) as count FROM deliveries WHERE delivery_date = CURRENT_DATE`,
    ])
    return {
      totalUsers: Number(users[0].count),
      activeSubscriptions: Number(activeSubscriptions[0].count),
      monthlyRevenue: Number(revenue[0].total) / 100,
      todayDeliveries: Number(todayDeliveries[0].count),
    }
  } catch {
    return { totalUsers: 0, activeSubscriptions: 0, monthlyRevenue: 0, todayDeliveries: 0 }
  }
}

async function getRecentActivity() {
  try {
    return await sql`
      SELECT 'user' as type, created_at, zodiac_sign as detail FROM users ORDER BY created_at DESC LIMIT 5
      UNION ALL
      SELECT 'payment' as type, created_at, status::text as detail FROM payments ORDER BY created_at DESC LIMIT 5
      ORDER BY created_at DESC LIMIT 10
    `
  } catch {
    return []
  }
}

export default async function AdminDashboard() {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) redirect("/admin/login")

  const stats = await getStats()
  const activity = await getRecentActivity()

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Активные подписки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">{stats.activeSubscriptions}</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Выручка (месяц)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{stats.monthlyRevenue.toFixed(2)} BYN</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Доставлено сегодня</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.todayDeliveries}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Последняя активность</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length > 0 ? (
            <div className="space-y-2">
              {activity.map((item, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">{item.type === "user" ? "Новый пользователь" : "Платёж"}</span>
                  <span className="text-zinc-300">{item.detail}</span>
                  <span className="text-zinc-500">{new Date(item.created_at).toLocaleDateString("ru-RU")}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500">Нет данных</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

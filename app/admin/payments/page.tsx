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

async function getPayments() {
  try {
    return await sql`
      SELECT 
        p.id, p.order_id, p.amount_byn, p.status, p.created_at,
        u.telegram_id,
        pl.name as plan_name
      FROM payments p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN subscriptions s ON p.subscription_id = s.id
      LEFT JOIN plans pl ON s.plan_id = pl.id
      ORDER BY p.created_at DESC
      LIMIT 100
    `
  } catch {
    return []
  }
}

export default async function PaymentsPage() {
  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) redirect("/admin/login")

  const payments = await getPayments()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Платежи</h2>

      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-900">
            <tr className="text-left text-sm text-zinc-400">
              <th className="p-4">ID заказа</th>
              <th className="p-4">Пользователь</th>
              <th className="p-4">Тариф</th>
              <th className="p-4">Сумма</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Дата</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t border-zinc-800 hover:bg-zinc-900/50">
                <td className="p-4 font-mono text-xs text-zinc-400">{payment.order_id?.slice(0, 12)}...</td>
                <td className="p-4 font-medium">{payment.telegram_id}</td>
                <td className="p-4 capitalize text-cyan-400">{payment.plan_name || "—"}</td>
                <td className="p-4 font-medium text-green-400">{(payment.amount_byn / 100).toFixed(2)} BYN</td>
                <td className="p-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      payment.status === "succeeded"
                        ? "bg-green-500/20 text-green-400"
                        : payment.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : payment.status === "refunded"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-zinc-500">{new Date(payment.created_at).toLocaleString("ru-RU")}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  Нет платежей
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

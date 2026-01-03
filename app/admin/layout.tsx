import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Admin — Daily Astro",
  description: "Панель управления",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin_auth")
  const isAuthenticated = authCookie?.value === process.env.ADMIN_PASSWORD

  // Check if we're on the login page by looking at children
  // This is a workaround since we can't get pathname in layout
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {isAuthenticated ? (
        <>
          <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20">
                  <span className="text-cyan-400">✦</span>
                </div>
                <span className="text-xl font-semibold">Daily Astro</span>
              </Link>
              <nav className="flex items-center gap-6">
                <Link href="/admin" className="text-sm hover:text-cyan-400 transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="text-sm hover:text-cyan-400 transition-colors">
                  Пользователи
                </Link>
                <Link href="/admin/subscriptions" className="text-sm hover:text-cyan-400 transition-colors">
                  Подписки
                </Link>
                <Link href="/admin/payments" className="text-sm hover:text-cyan-400 transition-colors">
                  Платежи
                </Link>
                <Link href="/admin/forecasts" className="text-sm hover:text-cyan-400 transition-colors">
                  Прогнозы
                </Link>
                <Link href="/admin/bot" className="text-sm hover:text-cyan-400 transition-colors">
                  Бот
                </Link>
                <form action="/api/admin/logout" method="POST">
                  <button type="submit" className="text-sm text-red-400 hover:text-red-300 transition-colors">
                    Выйти
                  </button>
                </form>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">{children}</main>
        </>
      ) : (
        children
      )}
    </div>
  )
}

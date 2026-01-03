import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_auth")

  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_APP_URL || "https://dailyastro.site"), {
    status: 302,
  })
}

export async function GET() {
  return POST()
}

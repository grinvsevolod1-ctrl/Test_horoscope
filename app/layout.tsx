import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Daily Astro — Ежедневные гороскопы в Telegram",
  description:
    "Персональные гороскопы каждый день в Telegram. Любовь, деньги, настроение, совет дня. 7 дней бесплатно.",
  keywords: ["гороскоп", "астрология", "telegram", "ежедневный прогноз", "знак зодиака", "гороскоп на сегодня"],
  authors: [{ name: "Daily Astro" }],
  metadataBase: new URL("https://dailyastro.site"),
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Daily Astro — Ежедневные гороскопы в Telegram",
    description: "Персональные гороскопы каждый день. Коротко. Точно. Вовремя.",
    type: "website",
    locale: "ru_RU",
    siteName: "Daily Astro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Astro — Ежедневные гороскопы",
    description: "Персональные гороскопы каждый день в Telegram",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#0a0a14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.className} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

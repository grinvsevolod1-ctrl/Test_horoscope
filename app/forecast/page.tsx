import { neon } from "@neondatabase/serverless"
import { Heart, Wallet, Smile, Lightbulb, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export const dynamic = "force-dynamic"

const ZODIAC_SIGNS = [
  { id: "aries", name: "Овен", symbol: "♈" },
  { id: "taurus", name: "Телец", symbol: "♉" },
  { id: "gemini", name: "Близнецы", symbol: "♊" },
  { id: "cancer", name: "Рак", symbol: "♋" },
  { id: "leo", name: "Лев", symbol: "♌" },
  { id: "virgo", name: "Дева", symbol: "♍" },
  { id: "libra", name: "Весы", symbol: "♎" },
  { id: "scorpio", name: "Скорпион", symbol: "♏" },
  { id: "sagittarius", name: "Стрелец", symbol: "♐" },
  { id: "capricorn", name: "Козерог", symbol: "♑" },
  { id: "aquarius", name: "Водолей", symbol: "♒" },
  { id: "pisces", name: "Рыбы", symbol: "♓" },
]

async function getForecasts() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const forecasts = await sql`
      SELECT zodiac_sign, love, money, mood, advice 
      FROM forecasts 
      WHERE forecast_date = CURRENT_DATE
    `
    return forecasts
  } catch (error) {
    console.error("Error fetching forecasts:", error)
    return []
  }
}

export default async function ForecastPage({
  searchParams,
}: {
  searchParams: Promise<{ sign?: string }>
}) {
  const params = await searchParams
  const forecasts = await getForecasts()
  const selectedSign = params.sign || "leo"

  const forecast = forecasts.find((f) => f.zodiac_sign === selectedSign)
  const sign = ZODIAC_SIGNS.find((s) => s.id === selectedSign)!

  const today = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  const blocks = [
    { key: "love", icon: Heart, title: "Любовь", color: "text-rose-400", bg: "bg-rose-400/10" },
    { key: "money", icon: Wallet, title: "Деньги", color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { key: "mood", icon: Smile, title: "Настроение", color: "text-amber-400", bg: "bg-amber-400/10" },
    { key: "advice", icon: Lightbulb, title: "Совет дня", color: "text-primary", bg: "bg-primary/10" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Star className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif text-lg">Daily Astro</span>
          </Link>
          <Button size="sm" className="bg-primary text-primary-foreground" asChild>
            <Link href="/subscribe">Подписаться</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2">Прогноз на сегодня</h1>
          <p className="text-muted-foreground capitalize">{today}</p>
        </div>

        {/* Zodiac selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-4xl mx-auto">
          {ZODIAC_SIGNS.map((zodiac) => (
            <Link
              key={zodiac.id}
              href={`/forecast?sign=${zodiac.id}`}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                selectedSign === zodiac.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="mr-1">{zodiac.symbol}</span>
              <span className="hidden sm:inline">{zodiac.name}</span>
            </Link>
          ))}
        </div>

        {/* Forecast card */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-background/50 flex items-center justify-center">
                <span className="text-4xl">{sign.symbol}</span>
              </div>
              <div>
                <h2 className="text-2xl font-serif font-medium">{sign.name}</h2>
                <p className="text-muted-foreground text-sm">Прогноз на сегодня</p>
              </div>
            </div>

            <CardContent className="p-6">
              {forecast ? (
                <div className="space-y-6">
                  {blocks.map((block) => (
                    <div key={block.key} className="flex gap-4">
                      <div className={`w-12 h-12 rounded-xl ${block.bg} flex items-center justify-center shrink-0`}>
                        <block.icon className={`w-6 h-6 ${block.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{block.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {forecast[block.key as keyof typeof forecast]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Прогноз для этого знака ещё не готов</p>
                  <p className="text-sm text-muted-foreground">Попробуйте выбрать другой знак или зайдите позже</p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">Получайте прогнозы каждый день</p>
                    <p className="text-sm text-muted-foreground">Прямо в Telegram в удобное время</p>
                  </div>
                  <Button className="bg-primary text-primary-foreground whitespace-nowrap" asChild>
                    <Link href="/subscribe" className="flex items-center gap-2">
                      7 дней бесплатно
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Развлекательный и мотивационный контент. Не является советом по финансовым, медицинским или юридическим
            вопросам.
          </p>
        </div>
      </main>
    </div>
  )
}

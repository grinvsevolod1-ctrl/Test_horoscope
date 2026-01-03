"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Sparkles, Star, Crown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const ZODIAC_SIGNS = [
  { id: "aries", name: "Овен", symbol: "♈", dates: "21 мар - 19 апр" },
  { id: "taurus", name: "Телец", symbol: "♉", dates: "20 апр - 20 мая" },
  { id: "gemini", name: "Близнецы", symbol: "♊", dates: "21 мая - 20 июн" },
  { id: "cancer", name: "Рак", symbol: "♋", dates: "21 июн - 22 июл" },
  { id: "leo", name: "Лев", symbol: "♌", dates: "23 июл - 22 авг" },
  { id: "virgo", name: "Дева", symbol: "♍", dates: "23 авг - 22 сен" },
  { id: "libra", name: "Весы", symbol: "♎", dates: "23 сен - 22 окт" },
  { id: "scorpio", name: "Скорпион", symbol: "♏", dates: "23 окт - 21 ноя" },
  { id: "sagittarius", name: "Стрелец", symbol: "♐", dates: "22 ноя - 21 дек" },
  { id: "capricorn", name: "Козерог", symbol: "♑", dates: "22 дек - 19 янв" },
  { id: "aquarius", name: "Водолей", symbol: "♒", dates: "20 янв - 18 фев" },
  { id: "pisces", name: "Рыбы", symbol: "♓", dates: "19 фев - 20 мар" },
]

const PLANS = [
  {
    id: "basic",
    name: "Базовый",
    price: 3,
    features: ["Ежедневный прогноз", "4 сферы жизни", "Доставка в Telegram"],
    icon: Star,
  },
  {
    id: "plus",
    name: "Плюс",
    price: 6,
    features: ["Всё из Базового", "Совместимость дня", "Аффирмации", "Лунный календарь"],
    icon: Sparkles,
    popular: true,
  },
  {
    id: "premium",
    name: "Премиум",
    price: 12,
    features: ["Всё из Плюс", "Важные даты месяца", "Гибкое время", "Без рекламы"],
    icon: Crown,
  },
]

function SubscribeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    zodiacSign: "",
    telegramUsername: "",
    plan: "plus",
  })

  useEffect(() => {
    const planFromUrl = searchParams.get("plan")
    if (planFromUrl && PLANS.some((p) => p.id === planFromUrl)) {
      setFormData((prev) => ({ ...prev, plan: planFromUrl }))
    }
  }, [searchParams])

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to subscribe")

      const data = await response.json()

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        router.push("/checkout/success")
      }
    } catch (error) {
      console.error("Subscription error:", error)
      alert("Ошибка при оформлении подписки. Попробуйте снова.")
      setIsLoading(false)
    }
  }

  const selectedPlan = PLANS.find((p) => p.id === formData.plan)

  return (
    <main className="min-h-[100dvh] bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
          <span className="text-sm text-muted-foreground">Шаг {step}/3</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-8">
        {/* Step 1: Zodiac */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="font-serif text-2xl font-medium mb-2 text-center">Ваш знак зодиака</h1>
            <p className="text-sm text-muted-foreground text-center mb-8">Выберите свой знак</p>

            <div className="grid grid-cols-3 gap-3">
              {ZODIAC_SIGNS.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => setFormData({ ...formData, zodiacSign: sign.id })}
                  className={`p-4 rounded-2xl glass text-center transition-all active:scale-95 ${
                    formData.zodiacSign === sign.id ? "ring-2 ring-primary glow" : "hover:bg-muted/50"
                  }`}
                >
                  <span className="text-3xl block mb-1">{sign.symbol}</span>
                  <span className="text-xs font-medium">{sign.name}</span>
                </button>
              ))}
            </div>

            <Button
              onClick={() => formData.zodiacSign && setStep(2)}
              disabled={!formData.zodiacSign}
              className="w-full mt-8 py-6 rounded-2xl text-base glow"
            >
              Далее
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Telegram */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="font-serif text-2xl font-medium mb-2 text-center">Ваш Telegram</h1>
            <p className="text-sm text-muted-foreground text-center mb-8">Куда отправлять прогнозы</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Имя пользователя</label>
                <Input
                  placeholder="@username"
                  value={formData.telegramUsername}
                  onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                  className="h-14 rounded-xl text-base glass border-0"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 py-6 rounded-2xl glass border-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <Button
                onClick={() => formData.telegramUsername && setStep(3)}
                disabled={!formData.telegramUsername}
                className="flex-1 py-6 rounded-2xl glow"
              >
                Далее
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Plan */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="font-serif text-2xl font-medium mb-2 text-center">Выберите тариф</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">7 дней бесплатно на любом тарифе</p>

            <div className="space-y-3">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setFormData({ ...formData, plan: plan.id })}
                  className={`w-full p-4 rounded-2xl glass text-left transition-all active:scale-[0.99] ${
                    formData.plan === plan.id ? "ring-2 ring-primary glow" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? "bg-gradient-to-br from-primary to-accent" : "bg-muted"}`}
                      >
                        <plan.icon className={`w-5 h-5 ${plan.popular ? "text-white" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{plan.name}</span>
                          {plan.popular && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                              Популярный
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground"> BYN/мес</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-primary" />
                        {f}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl glass">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Тариф {selectedPlan?.name}</span>
                <span>{selectedPlan?.price} BYN/мес</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">7 дней бесплатно</span>
                <span className="text-green-400">-{selectedPlan?.price} BYN</span>
              </div>
              <div className="border-t border-border/50 mt-3 pt-3 flex justify-between font-medium">
                <span>Сегодня</span>
                <span className="text-green-400">0 BYN</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 py-6 rounded-2xl glass border-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="flex-1 py-6 rounded-2xl glow">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    Начать бесплатно
                    <Sparkles className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Нажимая кнопку, вы соглашаетесь с условиями сервиса
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function SubscribePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100dvh] bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      }
    >
      <SubscribeContent />
    </Suspense>
  )
}

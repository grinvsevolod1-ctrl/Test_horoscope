import { Suspense } from "react"
import { CheckCircle2, XCircle, Clock, Gift, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function CheckoutStatusContent({
  searchParams,
}: {
  searchParams: { status?: string; order_id?: string; subscription?: string }
}) {
  const status = searchParams.status || "pending"

  const statusConfig = {
    success: {
      icon: CheckCircle2,
      title: "Оплата прошла успешно!",
      description: "Ваша подписка активирована. Первый прогноз придёт завтра в 07:30.",
      iconColor: "text-emerald-400",
      showBot: true,
    },
    trial: {
      icon: Gift,
      title: "Пробный период активирован!",
      description: "У вас 7 дней бесплатного доступа. Напишите боту, чтобы получить первый прогноз.",
      iconColor: "text-primary",
      showBot: true,
    },
    failed: {
      icon: XCircle,
      title: "Оплата не прошла",
      description: "Попробуйте ещё раз или выберите другой способ оплаты.",
      iconColor: "text-destructive",
      showBot: false,
    },
    pending: {
      icon: Clock,
      title: "Обрабатываем платёж",
      description: "Это может занять несколько минут. Мы пришлём уведомление в бот.",
      iconColor: "text-amber-400",
      showBot: true,
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  const Icon = config.icon

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 relative">
          <Icon className={`w-20 h-20 mx-auto ${config.iconColor}`} />
          {status === "trial" && (
            <Sparkles className="w-6 h-6 text-yellow-400 absolute top-0 right-1/3 animate-pulse" />
          )}
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-medium mb-3">{config.title}</h1>

        <p className="text-muted-foreground mb-8">{config.description}</p>

        {status === "trial" && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6 text-left">
            <h3 className="font-medium mb-2">Что дальше:</h3>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li className="flex gap-2">
                <span className="text-primary font-medium">1.</span>
                Откройте бота @Dailyastrobelarusbot
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-medium">2.</span>
                Нажмите /start для активации
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-medium">3.</span>
                Получайте прогнозы каждое утро!
              </li>
            </ol>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {config.showBot && (
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <a href="https://t.me/Dailyastrobelarusbot" target="_blank" rel="noopener noreferrer">
                Открыть бота в Telegram
              </a>
            </Button>
          )}

          {status === "failed" && (
            <Button asChild variant="outline">
              <Link href="/subscribe">Попробовать снова</Link>
            </Button>
          )}

          <Button asChild variant="ghost">
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

export default async function CheckoutReturnPage(props: {
  searchParams: Promise<{ status?: string; order_id?: string; subscription?: string }>
}) {
  const searchParams = await props.searchParams

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Clock className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <CheckoutStatusContent searchParams={searchParams} />
    </Suspense>
  )
}

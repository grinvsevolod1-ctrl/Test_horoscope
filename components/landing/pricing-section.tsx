"use client"

import { Check, Crown, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const plans = [
  {
    id: "basic",
    name: "Базовый",
    price: 3,
    features: ["Прогноз каждый день", "4 блока прогноза", "Счётчик серии"],
    highlighted: false,
  },
  {
    id: "plus",
    name: "Плюс",
    price: 6,
    features: ["Всё из Базового", "Совместимость с партнёром", "Аффирмации дня"],
    highlighted: true,
    badge: "Популярный",
  },
  {
    id: "premium",
    name: "Премиум",
    price: 12,
    features: ["Всё из Плюс", "Календарь важных дат", "Гибкое время", "Без рекламы"],
    highlighted: false,
    icon: Crown,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-20 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm">7 дней бесплатно</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-2">Простые тарифы</h2>
          <p className="text-sm text-muted-foreground">Отмена в любой момент одним кликом</p>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative glass rounded-2xl p-5 transition-all active:scale-[0.99]",
                plan.highlighted && "ring-2 ring-primary glow",
              )}
            >
              {plan.badge && (
                <div className="absolute -top-2.5 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      plan.highlighted ? "bg-gradient-to-br from-primary to-accent" : "bg-muted",
                    )}
                  >
                    {plan.icon ? (
                      <plan.icon className="w-5 h-5 text-white" />
                    ) : (
                      <Sparkles className={cn("w-5 h-5", plan.highlighted ? "text-white" : "text-muted-foreground")} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.features.length} функций</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground"> BYN/мес</span>
                </div>
              </div>

              {/* Features - expandable on tap */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex flex-wrap gap-2">
                  {plan.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 text-xs"
                    >
                      <Check className="w-3 h-3 text-primary" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                className={cn(
                  "w-full mt-4 rounded-xl py-5",
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted hover:bg-muted/80",
                )}
                asChild
              >
                <Link href={`/subscribe?plan=${plan.id}`}>Начать бесплатно</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className="text-center text-xs text-muted-foreground mt-6">Безопасная оплата через bePaid</p>
      </div>
    </section>
  )
}

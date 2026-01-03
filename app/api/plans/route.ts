import { NextResponse } from "next/server"

// GET /api/plans - List active subscription plans
export async function GET() {
  // In production, fetch from database
  const plans = [
    {
      id: "plan_basic",
      name: "basic",
      display_name: "Базовый",
      price_byn: 3,
      price_byn_kopecks: 300,
      period: "month",
      features: {
        daily_forecast: true,
        compatibility: false,
        affirmations: false,
        important_dates: false,
        flexible_time: false,
        no_ads: false,
      },
      feature_list: [
        "Прогноз каждый день",
        "4 блока: любовь, деньги, настроение, совет",
        "Доставка в 07:30",
        "Счётчик серии",
      ],
    },
    {
      id: "plan_plus",
      name: "plus",
      display_name: "Плюс",
      price_byn: 6,
      price_byn_kopecks: 600,
      period: "month",
      popular: true,
      features: {
        daily_forecast: true,
        compatibility: true,
        affirmations: true,
        important_dates: false,
        flexible_time: false,
        no_ads: false,
      },
      feature_list: [
        "Всё из Базового",
        "Совместимость дня с партнёром",
        "Ежедневные аффирмации",
        "Приоритетная поддержка",
      ],
    },
    {
      id: "plan_premium",
      name: "premium",
      display_name: "Премиум",
      price_byn: 12,
      price_byn_kopecks: 1200,
      period: "month",
      features: {
        daily_forecast: true,
        compatibility: true,
        affirmations: true,
        important_dates: true,
        flexible_time: true,
        no_ads: true,
      },
      feature_list: [
        "Всё из Плюс",
        "Календарь важных дат",
        "Гибкое время доставки",
        "Без рекламы",
        "Эксклюзивный контент",
      ],
    },
  ]

  return NextResponse.json({ plans })
}

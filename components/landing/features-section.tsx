"use client"

import { Heart, Wallet, Smile, Lightbulb, Clock, Zap } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "Любовь",
    description: "Отношения и романтика",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Wallet,
    title: "Деньги",
    description: "Финансы и карьера",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Smile,
    title: "Настроение",
    description: "Энергия дня",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Lightbulb,
    title: "Совет",
    description: "Практические рекомендации",
    color: "from-indigo-500 to-purple-500",
  },
]

export function FeaturesSection() {
  return (
    <section className="relative py-20 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-3">4 блока каждый день</h2>
          <p className="text-muted-foreground">Всё важное — коротко и по делу</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass rounded-2xl p-5 text-center hover:scale-[1.02] transition-transform active:scale-[0.98]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Additional benefits */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>07:30 по вашему времени</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>30 секунд на чтение</span>
          </div>
        </div>
      </div>
    </section>
  )
}

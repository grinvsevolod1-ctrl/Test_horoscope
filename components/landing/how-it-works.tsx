import { UserCircle, CreditCard, MessageCircle, Sparkles } from "lucide-react"

const steps = [
  {
    icon: UserCircle,
    title: "Выберите знак",
    description: "Укажите ваш знак зодиака и дату рождения для точных прогнозов",
    highlight: "30 секунд",
  },
  {
    icon: CreditCard,
    title: "Подключите подписку",
    description: "Безопасная оплата через bePaid. 7 дней бесплатно.",
    highlight: "От 3 BYN/мес",
  },
  {
    icon: MessageCircle,
    title: "Получайте прогнозы",
    description: "Каждое утро в 07:30 по вашему времени — прямо в Telegram",
    highlight: "Каждый день",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Просто и быстро</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium mb-4">Как это работает</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Три простых шага до ежедневных персональных прогнозов
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-border via-primary/30 to-border" />
              )}

              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 border border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/30">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{step.description}</p>

                {/* Highlight badge */}
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {step.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

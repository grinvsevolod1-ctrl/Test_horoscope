"use client"

import { useState } from "react"
import { Heart, Wallet, Smile, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

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

const SAMPLE_FORECASTS: Record<string, { love: string; money: string; mood: string; advice: string }> = {
  aries: {
    love: "Сегодня звёзды благоприятствуют романтике. Марс в вашем знаке добавляет страсти.",
    money: "Хороший день для финансовых переговоров. Ваша уверенность поможет убедить партнёров.",
    mood: "Энергия бьёт ключом — направьте её в творчество или спорт.",
    advice: "Сделайте первый шаг в важном деле — сейчас идеальный момент.",
  },
  taurus: {
    love: "Венера делает вас особенно привлекательным. Время укреплять отношения.",
    money: "Стабильность — ваш козырь. Избегайте рискованных вложений.",
    mood: "Спокойствие и уверенность — ваши главные союзники сегодня.",
    advice: "Побалуйте себя чем-то приятным — вы это заслужили.",
  },
  gemini: {
    love: "Общение — ключ к сердцу партнёра. Ваше остроумие покоряет.",
    money: "Удачный день для коротких сделок и переговоров.",
    mood: "Любознательность ведёт к интересным открытиям.",
    advice: "Запишите свои идеи — среди них есть золотые.",
  },
  cancer: {
    love: "Луна усиливает интуицию в отношениях. Доверяйте чувствам.",
    money: "Время для накоплений и планирования бюджета.",
    mood: "Эмоциональная глубина — ваша сила сегодня.",
    advice: "Проведите вечер в кругу близких людей.",
  },
  leo: {
    love: "Ваша харизма на пике. Время для важных признаний.",
    money: "Щедрость вернётся сторицей. Не бойтесь инвестировать в себя.",
    mood: "Солнечная энергия наполняет вас оптимизмом.",
    advice: "Позвольте себе быть в центре внимания — это ваш день.",
  },
  virgo: {
    love: "Внимание к деталям укрепит доверие партнёра.",
    money: "Аналитический подход принесёт прибыль.",
    mood: "Порядок вокруг — порядок в душе.",
    advice: "Выделите 15 минут на планирование — результат превзойдёт ожидания.",
  },
  libra: {
    love: "Гармония в отношениях достигается через компромисс.",
    money: "Партнёрские проекты принесут выгоду обеим сторонам.",
    mood: "Стремление к красоте делает день особенным.",
    advice: "Найдите баланс между работой и отдыхом.",
  },
  scorpio: {
    love: "Глубина ваших чувств притягивает — будьте искренни.",
    money: "Интуиция подскажет выгодную сделку.",
    mood: "Трансформация начинается изнутри.",
    advice: "Отпустите то, что больше не служит вам.",
  },
  sagittarius: {
    love: "Оптимизм заразителен — делитесь им с партнёром.",
    money: "Смелые идеи принесут неожиданную прибыль.",
    mood: "Жажда приключений ведёт к интересным встречам.",
    advice: "Расширяйте горизонты — мир полон возможностей.",
  },
  capricorn: {
    love: "Надёжность — ваше главное достоинство в глазах партнёра.",
    money: "Долгосрочные инвестиции принесут плоды.",
    mood: "Целеустремлённость ведёт к успеху.",
    advice: "Поставьте одну важную цель и сделайте к ней шаг.",
  },
  aquarius: {
    love: "Оригинальность привлекает нестандартных партнёров.",
    money: "Инновационные идеи могут принести прибыль.",
    mood: "Свобода мысли открывает новые горизонты.",
    advice: "Не бойтесь быть собой — это ваша суперсила.",
  },
  pisces: {
    love: "Романтика витает в воздухе. Доверьтесь интуиции.",
    money: "Творческий подход к финансам откроет новые источники.",
    mood: "Мечтательность — не слабость, а дар.",
    advice: "Уделите время творчеству — оно наполнит душу.",
  },
}

const previewBlocks = [
  { key: "love", icon: Heart, title: "Любовь", color: "text-rose-400" },
  { key: "money", icon: Wallet, title: "Деньги", color: "text-emerald-400" },
  { key: "mood", icon: Smile, title: "Настроение", color: "text-amber-400" },
  { key: "advice", icon: Lightbulb, title: "Совет", color: "text-primary" },
]

export function ForecastPreview() {
  const [selectedSign, setSelectedSign] = useState("leo")
  const forecast = SAMPLE_FORECASTS[selectedSign]
  const sign = ZODIAC_SIGNS.find((s) => s.id === selectedSign)!

  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  })

  return (
    <section id="preview" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium mb-4">Что вы получаете каждый день</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Выберите свой знак и посмотрите пример прогноза</p>
        </div>

        {/* Zodiac selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-3xl mx-auto">
          {ZODIAC_SIGNS.map((zodiac) => (
            <button
              key={zodiac.id}
              onClick={() => setSelectedSign(zodiac.id)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm transition-all",
                selectedSign === zodiac.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="mr-1">{zodiac.symbol}</span>
              <span className="hidden sm:inline">{zodiac.name}</span>
            </button>
          ))}
        </div>

        {/* Phone mockup */}
        <div className="max-w-sm mx-auto">
          <div className="bg-card rounded-3xl border border-border p-4 shadow-2xl">
            {/* Phone header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-xs text-muted-foreground">Telegram</span>
              <span className="text-xs text-muted-foreground">07:30</span>
            </div>

            {/* Message */}
            <div className="bg-secondary rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xl">{sign.symbol}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Сегодня для {sign.name}</p>
                  <p className="text-xs text-muted-foreground">{today}</p>
                </div>
              </div>

              <div className="space-y-4">
                {previewBlocks.map((block) => (
                  <div key={block.key} className="flex gap-3">
                    <block.icon className={`w-5 h-5 ${block.color} shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">{block.title}</p>
                      <p className="text-sm">{forecast[block.key as keyof typeof forecast]}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Streak */}
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span>Вы читаете 7 дней подряд 🔥</span>
                <span className="text-primary cursor-pointer hover:underline">Изменить время</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 px-3 bg-muted/50 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors">
                Сохранить
              </button>
              <button className="flex-1 py-2 px-3 bg-muted/50 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors">
                Поделиться
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

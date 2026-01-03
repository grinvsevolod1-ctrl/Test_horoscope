const zodiacSigns = [
  { name: "Овен", symbol: "♈" },
  { name: "Телец", symbol: "♉" },
  { name: "Близнецы", symbol: "♊" },
  { name: "Рак", symbol: "♋" },
  { name: "Лев", symbol: "♌" },
  { name: "Дева", symbol: "♍" },
  { name: "Весы", symbol: "♎" },
  { name: "Скорпион", symbol: "♏" },
  { name: "Стрелец", symbol: "♐" },
  { name: "Козерог", symbol: "♑" },
  { name: "Водолей", symbol: "♒" },
  { name: "Рыбы", symbol: "♓" },
]

export function ZodiacWheel() {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-border/50" />

      {/* Inner glow */}
      <div className="absolute inset-8 rounded-full bg-primary/5 glow-sm" />

      {/* Zodiac signs */}
      {zodiacSigns.map((sign, index) => {
        const angle = (index * 30 - 90) * (Math.PI / 180)
        const radius = 45
        const x = 50 + radius * Math.cos(angle)
        const y = 50 + radius * Math.sin(angle)

        return (
          <div
            key={sign.name}
            className="absolute text-xl sm:text-2xl transition-all duration-300 hover:text-primary hover:scale-125 cursor-default"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: "translate(-50%, -50%)",
            }}
            title={sign.name}
          >
            {sign.symbol}
          </div>
        )
      })}

      {/* Center */}
      <div className="absolute inset-1/3 rounded-full bg-card border border-border flex items-center justify-center">
        <Star className="w-8 h-8 text-primary" />
      </div>
    </div>
  )
}

import { Star } from "lucide-react"

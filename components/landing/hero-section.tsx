"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Send, ChevronDown } from "lucide-react"
import { ZodiacIcons } from "./zodiac-icons"

const ZODIAC_SIGNS = [
  { sign: "aries" as const, name: "Овен" },
  { sign: "taurus" as const, name: "Телец" },
  { sign: "gemini" as const, name: "Близнецы" },
  { sign: "cancer" as const, name: "Рак" },
  { sign: "leo" as const, name: "Лев" },
  { sign: "virgo" as const, name: "Дева" },
  { sign: "libra" as const, name: "Весы" },
  { sign: "scorpio" as const, name: "Скорпион" },
  { sign: "sagittarius" as const, name: "Стрелец" },
  { sign: "capricorn" as const, name: "Козерог" },
  { sign: "aquarius" as const, name: "Водолей" },
  { sign: "pisces" as const, name: "Рыбы" },
]

function CosmicBackground() {
  const [stars, setStars] = useState<
    Array<{ id: number; x: number; y: number; size: number; opacity: number; delay: number; duration: number }>
  >([])

  useEffect(() => {
    const newStars = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }))
    setStars(newStars)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-[oklch(0.06_0.03_280)]" />
      <div className="absolute top-10 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[oklch(0.3_0.15_280/0.2)] rounded-full blur-[80px] animate-float-slow" />
      <div
        className="absolute bottom-1/3 right-0 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-[oklch(0.4_0.15_200/0.15)] rounded-full blur-[60px] animate-float"
        style={{ animationDelay: "2s" }}
      />
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export function HeroSection() {
  const [activeSign, setActiveSign] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveSign((prev) => (prev + 1) % ZODIAC_SIGNS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const currentSign = ZODIAC_SIGNS[activeSign]
  const ZodiacIcon = ZodiacIcons[currentSign.sign]

  if (!mounted) {
    return (
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-card animate-pulse" />
      </section>
    )
  }

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      <CosmicBackground />

      <div className="relative z-10 w-full max-w-lg mx-auto px-6 py-16 text-center">
        <div className="mb-8 relative">
          <div className="w-28 h-28 mx-auto rounded-full glass flex items-center justify-center animate-pulse-glow">
            <div className="w-14 h-14 text-primary transition-all duration-500">
              <ZodiacIcon />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground font-medium">{currentSign.name}</p>
        </div>

        {/* Main heading */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium leading-tight mb-4">
          <span className="text-cosmic">Звёзды</span> расскажут
          <br />о вашем дне
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
          Получайте персональный гороскоп каждое утро в Telegram
        </p>

        {/* Primary CTA */}
        <div className="space-y-4 mb-10">
          <Button
            size="lg"
            className="w-full text-lg py-7 bg-primary text-primary-foreground hover:bg-primary/90 glow rounded-2xl font-medium transition-all active:scale-[0.98]"
            asChild
          >
            <Link href="/subscribe" className="flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5" />
              Попробовать бесплатно
            </Link>
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="w-full text-base py-6 glass hover:bg-white/10 rounded-2xl transition-all"
            asChild
          >
            <Link href="https://t.me/Dailyastrobelarusbot" className="flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Открыть в Telegram
            </Link>
          </Button>
        </div>

        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />7 дней бесплатно • Отмена в один клик
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-soft">
        <ChevronDown className="w-6 h-6 text-muted-foreground/50" />
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Heart, Wallet, Smile, Lightbulb, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ZodiacIcons } from "./zodiac-icons"

const DEMO_FORECAST = {
  sign: "leo" as const,
  name: "Лев",
  blocks: [
    {
      icon: Heart,
      title: "Любовь",
      text: "Ваша харизма на пике. Время для важных признаний.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Wallet,
      title: "Деньги",
      text: "Щедрость вернётся сторицей. Инвестируйте в себя.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Smile,
      title: "Настроение",
      text: "Солнечная энергия наполняет вас оптимизмом.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Lightbulb,
      title: "Совет",
      text: "Позвольте себе быть в центре внимания — это ваш день.",
      color: "from-indigo-500 to-purple-500",
    },
  ],
}

export function DemoSection() {
  const [activeBlock, setActiveBlock] = useState(0)
  const [date, setDate] = useState("")

  useEffect(() => {
    setDate(new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" }))
    const interval = setInterval(() => {
      setActiveBlock((prev) => (prev + 1) % DEMO_FORECAST.blocks.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const ZodiacIcon = ZodiacIcons[DEMO_FORECAST.sign]

  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-transparent via-card/30 to-transparent">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-2">Пример прогноза</h2>
          <p className="text-sm text-muted-foreground">Так выглядит ваше утреннее сообщение</p>
        </div>

        {/* Phone mockup */}
        <div className="relative mx-auto max-w-[320px]">
          <div className="relative glass rounded-[2.5rem] p-3 shadow-2xl">
            <div className="bg-background rounded-[2rem] overflow-hidden">
              {/* Status bar */}
              <div className="flex items-center justify-between px-6 py-2 text-xs text-muted-foreground">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 border border-current rounded-sm">
                    <div className="w-2/3 h-full bg-current rounded-sm" />
                  </div>
                </div>
              </div>

              {/* Chat header */}
              <div className="px-4 py-3 border-b border-border/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">Daily Astro</p>
                  <p className="text-xs text-muted-foreground">онлайн</p>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 min-h-[360px]">
                <div className="glass rounded-2xl rounded-tl-sm p-4 max-w-[260px]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 text-primary">
                      <ZodiacIcon />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{DEMO_FORECAST.name}</p>
                      <p className="text-xs text-muted-foreground">{date}</p>
                    </div>
                  </div>

                  {/* Active block with animation */}
                  <div className="mb-4 min-h-[80px]">
                    {DEMO_FORECAST.blocks.map((block, index) => (
                      <div
                        key={block.title}
                        className={`transition-all duration-500 ${activeBlock === index ? "opacity-100 translate-y-0" : "opacity-0 absolute translate-y-2"}`}
                      >
                        {activeBlock === index && (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <div
                                className={`w-6 h-6 rounded-lg bg-gradient-to-br ${block.color} flex items-center justify-center`}
                              >
                                <block.icon className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="text-sm font-medium">{block.title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{block.text}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Block selector */}
                  <div className="flex gap-2">
                    {DEMO_FORECAST.blocks.map((block, index) => (
                      <button
                        key={block.title}
                        onClick={() => setActiveBlock(index)}
                        className={`flex-1 py-2 rounded-lg transition-all text-xs ${
                          activeBlock === index
                            ? "bg-primary/20 text-primary scale-105"
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        <block.icon className="w-4 h-4 mx-auto" />
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-muted-foreground mt-3 text-right">07:30</p>
                </div>
              </div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute -inset-10 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button
            size="lg"
            className="rounded-2xl py-6 px-8 bg-primary text-primary-foreground hover:bg-primary/90 glow active:scale-[0.98] transition-all"
            asChild
          >
            <Link href="/subscribe" className="flex items-center gap-2">
              Получить свой прогноз
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

import { Star } from "lucide-react"

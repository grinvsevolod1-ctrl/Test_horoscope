"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Анна М.",
    zodiac: "Лев",
    text: "Начала читать прогнозы каждое утро — теперь это мой маленький ритуал. Советы действительно полезные и помогают настроиться на день!",
    rating: 5,
  },
  {
    id: 2,
    name: "Дмитрий К.",
    zodiac: "Скорпион",
    text: "Скептически относился к гороскопам, но эти прогнозы приятно удивили. Никакой воды — только конкретные рекомендации.",
    rating: 5,
  },
  {
    id: 3,
    name: "Елена В.",
    zodiac: "Весы",
    text: "Очень удобно получать прогноз прямо в Telegram. Совместимость дня с мужем — отдельный плюс, помогает лучше понимать друг друга.",
    rating: 5,
  },
  {
    id: 4,
    name: "Максим Т.",
    zodiac: "Овен",
    text: "Подписался на премиум — доволен! Важные даты месяца помогают планировать встречи и переговоры. Рекомендую.",
    rating: 5,
  },
  {
    id: 5,
    name: "Ольга С.",
    zodiac: "Рыбы",
    text: "Аффирмации каждый день — моя любимая функция. Помогают сохранять позитивный настрой даже в сложные дни.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-medium mb-4">Что говорят наши подписчики</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Более 1000 пользователей уже получают ежедневные прогнозы
          </p>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.slice(0, 3).map((testimonial) => (
            <Card key={testimonial.id} className="bg-card border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <p className="text-sm mb-4 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.zodiac}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="md:hidden max-w-sm mx-auto">
          <Card className="bg-card border-border/50">
            <CardContent className="pt-6">
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-sm mb-4 leading-relaxed">{testimonials[currentIndex].text}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{testimonials[currentIndex].name}</p>
                  <p className="text-xs text-muted-foreground">{testimonials[currentIndex].zodiac}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prevTestimonial} className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i === currentIndex ? "bg-primary" : "bg-muted",
                  )}
                />
              ))}
            </div>
            <button onClick={nextTestimonial} className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

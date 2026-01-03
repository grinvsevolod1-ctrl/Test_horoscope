"use client"

import { useState } from "react"
import { ChevronDown, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const faqs = [
  {
    question: "Как отменить подписку?",
    answer: "Команда /cancel в боте или кнопка в личном кабинете. Доступ до конца периода.",
  },
  {
    question: "Когда приходят прогнозы?",
    answer: "В 07:30 по вашему времени. На Премиуме можно выбрать любое время.",
  },
  {
    question: "Как работает пробный период?",
    answer: "7 дней бесплатно. Отмените до окончания — ничего платить не нужно.",
  },
  {
    question: "Какие способы оплаты?",
    answer: "Visa, Mastercard, Белкарт через безопасный шлюз bePaid.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-2">Вопросы и ответы</h2>
          <p className="text-sm text-muted-foreground">Самое важное — коротко</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="glass rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-sm pr-4">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform shrink-0",
                    openIndex === index && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === index ? "max-h-40 pb-4" : "max-h-0",
                )}
              >
                <p className="px-5 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Support link */}
        <div className="mt-8 text-center">
          <Link
            href="https://t.me/Dailyastrobelarusbot"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Остались вопросы? Напишите в бота
          </Link>
        </div>
      </div>
    </section>
  )
}

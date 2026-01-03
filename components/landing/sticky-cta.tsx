"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, X, ChevronUp } from "lucide-react"

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (isDismissed || !isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 md:hidden safe-bottom">
      <div className="relative glass rounded-2xl p-4 flex items-center gap-3 shadow-2xl border border-border/30">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-muted flex items-center justify-center border border-border/50"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">7 дней бесплатно</p>
          <p className="text-xs text-muted-foreground truncate">Отмена в любой момент</p>
        </div>

        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0"
          aria-label="Наверх"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <Button
          size="sm"
          className="rounded-xl px-5 py-5 bg-primary text-primary-foreground glow flex-shrink-0"
          asChild
        >
          <Link href="/subscribe" className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Начать
          </Link>
        </Button>
      </div>
    </div>
  )
}

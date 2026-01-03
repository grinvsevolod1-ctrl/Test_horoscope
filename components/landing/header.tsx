"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.5_0.2_200)] to-[oklch(0.6_0.25_250)] flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif font-medium">Daily Astro</span>
        </Link>

        <div className="hidden sm:flex items-center gap-4">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Возможности
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Тарифы
          </a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
          <Button size="sm" className="rounded-xl" asChild>
            <Link href="/subscribe">Начать</Link>
          </Button>
        </div>

        <button className="sm:hidden p-2 -mr-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden glass border-t border-border/30 px-4 py-4 space-y-3">
          <a
            href="#features"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Возможности
          </a>
          <a
            href="#pricing"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Тарифы
          </a>
          <a
            href="#faq"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            FAQ
          </a>
          <Button className="w-full rounded-xl" asChild>
            <Link href="/subscribe" onClick={() => setIsMenuOpen(false)}>
              Начать бесплатно
            </Link>
          </Button>
        </div>
      )}
    </header>
  )
}

import type { ZodiacSign } from "@/lib/types/database"

export interface AstroEvent {
  date: string
  planet: string
  sign: ZodiacSign | null
  aspect: string | null
  magnitude: number
  source: string
}

export interface MoonPhase {
  phase:
    | "new_moon"
    | "waxing_crescent"
    | "first_quarter"
    | "waxing_gibbous"
    | "full_moon"
    | "waning_gibbous"
    | "last_quarter"
    | "waning_crescent"
  illumination: number
  sign: ZodiacSign
}

export interface DayContext {
  date: Date
  dayOfWeek: number // 0-6
  season: "winter" | "spring" | "summer" | "autumn"
  moonPhase: MoonPhase
  events: AstroEvent[]
}

export interface ForecastBlock {
  love: string
  money: string
  mood: string
  advice: string
}

export interface GeneratedForecast extends ForecastBlock {
  zodiacSign: ZodiacSign
  date: string
  source: {
    events: Array<{ planet: string; sign: string; aspect?: string }>
    moonPhase: string
    season: string
  }
}

export const ZODIAC_ELEMENTS: Record<ZodiacSign, "fire" | "earth" | "air" | "water"> = {
  aries: "fire",
  leo: "fire",
  sagittarius: "fire",
  taurus: "earth",
  virgo: "earth",
  capricorn: "earth",
  gemini: "air",
  libra: "air",
  aquarius: "air",
  cancer: "water",
  scorpio: "water",
  pisces: "water",
}

export const ZODIAC_MODALITY: Record<ZodiacSign, "cardinal" | "fixed" | "mutable"> = {
  aries: "cardinal",
  cancer: "cardinal",
  libra: "cardinal",
  capricorn: "cardinal",
  taurus: "fixed",
  leo: "fixed",
  scorpio: "fixed",
  aquarius: "fixed",
  gemini: "mutable",
  virgo: "mutable",
  sagittarius: "mutable",
  pisces: "mutable",
}

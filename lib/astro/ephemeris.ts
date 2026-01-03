/**
 * Ephemeris Calculator
 *
 * Calculates planetary positions and lunar phases.
 * Uses simplified algorithms for demo. In production,
 * integrate with astronomy APIs or libraries like astronomia.
 */

import type { ZodiacSign, AstroEvent, MoonPhase } from "./types"

const ZODIAC_SIGNS: ZodiacSign[] = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
]

// Simplified lunar cycle (29.5 days)
const LUNAR_CYCLE = 29.53059

// Known new moon reference point (Jan 6, 2000)
const NEW_MOON_REF = new Date("2000-01-06T18:14:00Z").getTime()

export function getMoonPhase(date: Date): MoonPhase {
  const diff = date.getTime() - NEW_MOON_REF
  const days = diff / (1000 * 60 * 60 * 24)
  const cycle = days % LUNAR_CYCLE
  const normalizedCycle = cycle < 0 ? cycle + LUNAR_CYCLE : cycle

  // Illumination percentage (0-100)
  const illumination = Math.round((1 - Math.cos((normalizedCycle / LUNAR_CYCLE) * 2 * Math.PI)) * 50)

  // Phase name
  let phase: MoonPhase["phase"]
  if (normalizedCycle < 1.85) phase = "new_moon"
  else if (normalizedCycle < 7.38) phase = "waxing_crescent"
  else if (normalizedCycle < 9.23) phase = "first_quarter"
  else if (normalizedCycle < 14.77) phase = "waxing_gibbous"
  else if (normalizedCycle < 16.61) phase = "full_moon"
  else if (normalizedCycle < 22.15) phase = "waning_gibbous"
  else if (normalizedCycle < 23.99) phase = "last_quarter"
  else phase = "waning_crescent"

  // Moon's zodiac sign (changes every ~2.5 days)
  const moonSignIndex = Math.floor((normalizedCycle / LUNAR_CYCLE) * 12) % 12
  const sign = ZODIAC_SIGNS[moonSignIndex]

  return { phase, illumination, sign }
}

// Simplified planetary positions (demo purposes)
// In production, use astronomia or JPL ephemeris
export function getPlanetaryPositions(date: Date): Array<{ planet: string; sign: ZodiacSign }> {
  const dayOfYear = getDayOfYear(date)
  const year = date.getFullYear()

  // Approximate positions based on orbital periods
  const positions: Array<{ planet: string; sign: ZodiacSign }> = []

  // Sun - moves through zodiac yearly
  const sunSignIndex = Math.floor(((dayOfYear + 80) % 365) / 30.4) % 12
  positions.push({ planet: "Sun", sign: ZODIAC_SIGNS[sunSignIndex] })

  // Mercury - ~88 day orbit, stays close to Sun
  const mercuryOffset = Math.sin((dayOfYear / 88) * 2 * Math.PI) * 1.5
  const mercurySignIndex = Math.floor((sunSignIndex + mercuryOffset + 12) % 12)
  positions.push({ planet: "Mercury", sign: ZODIAC_SIGNS[Math.round(mercurySignIndex)] })

  // Venus - ~225 day orbit
  const venusOffset = Math.sin((dayOfYear / 225) * 2 * Math.PI) * 2
  const venusSignIndex = Math.floor((sunSignIndex + venusOffset + 12) % 12)
  positions.push({ planet: "Venus", sign: ZODIAC_SIGNS[Math.round(venusSignIndex)] })

  // Mars - ~687 day orbit
  const marsSignIndex = Math.floor((dayOfYear + year * 365) / 57) % 12
  positions.push({ planet: "Mars", sign: ZODIAC_SIGNS[marsSignIndex] })

  // Jupiter - ~12 year orbit
  const jupiterSignIndex = Math.floor((year - 2000 + dayOfYear / 365) / 1) % 12
  positions.push({ planet: "Jupiter", sign: ZODIAC_SIGNS[jupiterSignIndex] })

  // Saturn - ~29 year orbit
  const saturnSignIndex = Math.floor((year - 2000 + dayOfYear / 365) / 2.5) % 12
  positions.push({ planet: "Saturn", sign: ZODIAC_SIGNS[saturnSignIndex] })

  return positions
}

// Check for Mercury retrograde (simplified)
export function isMercuryRetrograde(date: Date): boolean {
  const dayOfYear = getDayOfYear(date)
  // Mercury retrograde happens ~3 times per year for ~3 weeks
  // Simplified: check approximate windows
  const retrogradeWindows = [
    [1, 22],
    [95, 118],
    [190, 213],
    [285, 308], // approximate periods
  ]
  return retrogradeWindows.some(([start, end]) => dayOfYear >= start && dayOfYear <= end)
}

// Get aspects between planets (simplified)
export function getPlanetaryAspects(positions: Array<{ planet: string; sign: ZodiacSign }>): AstroEvent[] {
  const aspects: AstroEvent[] = []
  const today = new Date().toISOString().split("T")[0]

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i]
      const p2 = positions[j]

      const sign1Index = ZODIAC_SIGNS.indexOf(p1.sign)
      const sign2Index = ZODIAC_SIGNS.indexOf(p2.sign)
      const diff = Math.abs(sign1Index - sign2Index)

      let aspect: string | null = null
      let magnitude = 0

      if (diff === 0) {
        aspect = "conjunction"
        magnitude = 1.0
      } else if (diff === 4 || diff === 8) {
        aspect = "trine"
        magnitude = 0.8
      } else if (diff === 3 || diff === 9) {
        aspect = "square"
        magnitude = 0.7
      } else if (diff === 6) {
        aspect = "opposition"
        magnitude = 0.9
      } else if (diff === 2 || diff === 10) {
        aspect = "sextile"
        magnitude = 0.5
      }

      if (aspect) {
        aspects.push({
          date: today,
          planet: `${p1.planet}-${p2.planet}`,
          sign: p1.sign,
          aspect,
          magnitude,
          source: "calculated",
        })
      }
    }
  }

  return aspects
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function getSeason(date: Date): "winter" | "spring" | "summer" | "autumn" {
  const month = date.getMonth()
  if (month >= 2 && month <= 4) return "spring"
  if (month >= 5 && month <= 7) return "summer"
  if (month >= 8 && month <= 10) return "autumn"
  return "winter"
}

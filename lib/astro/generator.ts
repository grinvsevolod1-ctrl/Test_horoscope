/**
 * Forecast Generator
 *
 * Combines astronomical events with content templates
 * to generate personalized daily forecasts.
 */

import type { ZodiacSign } from "@/lib/types/database"
import type { DayContext, GeneratedForecast, ForecastBlock } from "./types"
import { ZODIAC_ELEMENTS, ZODIAC_MODALITY } from "./types"
import { getMoonPhase, getPlanetaryPositions, getPlanetaryAspects, getSeason, isMercuryRetrograde } from "./ephemeris"
import { getTemplatesForTrigger } from "./templates"

const ALL_ZODIAC_SIGNS: ZodiacSign[] = [
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

/**
 * Generate forecasts for all zodiac signs for a given date
 */
export async function generateDailyForecasts(date: Date = new Date()): Promise<GeneratedForecast[]> {
  // Build day context
  const context = buildDayContext(date)

  // Generate forecast for each sign
  const forecasts: GeneratedForecast[] = []

  for (const sign of ALL_ZODIAC_SIGNS) {
    const forecast = generateForecastForSign(sign, context)
    forecasts.push(forecast)
  }

  return forecasts
}

/**
 * Build context for the day based on astronomical events
 */
function buildDayContext(date: Date): DayContext {
  const moonPhase = getMoonPhase(date)
  const planetaryPositions = getPlanetaryPositions(date)
  const aspects = getPlanetaryAspects(planetaryPositions)
  const season = getSeason(date)

  // Convert positions to events
  const events = planetaryPositions.map((p) => ({
    date: date.toISOString().split("T")[0],
    planet: p.planet,
    sign: p.sign,
    aspect: null,
    magnitude: 0.5,
    source: "ephemeris",
  }))

  // Add aspects as events
  events.push(...aspects)

  // Add Mercury retrograde if applicable
  if (isMercuryRetrograde(date)) {
    events.push({
      date: date.toISOString().split("T")[0],
      planet: "Mercury",
      sign: null,
      aspect: "retrograde",
      magnitude: 0.9,
      source: "calculated",
    })
  }

  return {
    date,
    dayOfWeek: date.getDay(),
    season,
    moonPhase,
    events,
  }
}

/**
 * Generate forecast for a specific zodiac sign
 */
function generateForecastForSign(sign: ZodiacSign, context: DayContext): GeneratedForecast {
  const blocks: ForecastBlock = {
    love: "",
    money: "",
    mood: "",
    advice: "",
  }

  const usedEvents: Array<{ planet: string; sign: string; aspect?: string }> = []

  // 1. Moon sign influence (strongest daily factor)
  const moonTemplates = getTemplatesForTrigger("moon_in_sign", context.moonPhase.sign)
  for (const category of ["love", "money", "mood", "advice"] as const) {
    const template = moonTemplates.find((t) => t.category === category)
    if (template && !blocks[category]) {
      blocks[category] = personalizeText(template.text, sign, context)
    }
  }
  usedEvents.push({ planet: "Moon", sign: context.moonPhase.sign })

  // 2. Moon phase influence
  const phaseTemplates = getTemplatesForTrigger("moon_phase", context.moonPhase.phase)
  for (const category of ["love", "money", "mood", "advice"] as const) {
    if (!blocks[category]) {
      const template = phaseTemplates.find((t) => t.category === category)
      if (template) {
        blocks[category] = personalizeText(template.text, sign, context)
      }
    }
  }

  // 3. Planetary aspects
  for (const event of context.events.filter((e) => e.aspect)) {
    if (event.aspect === "retrograde" && event.planet === "Mercury") {
      const retroTemplates = getTemplatesForTrigger("planet_aspect", "mercury_retrograde")
      for (const category of ["love", "money", "advice"] as const) {
        if (!blocks[category]) {
          const template = retroTemplates.find((t) => t.category === category)
          if (template) {
            blocks[category] = personalizeText(template.text, sign, context)
            usedEvents.push({ planet: "Mercury", sign: "retrograde", aspect: "retrograde" })
          }
        }
      }
    }

    // Check trine/square aspects
    if (event.aspect === "trine" || event.aspect === "square") {
      const [planet1] = event.planet.split("-")
      const aspectKey = `${planet1.toLowerCase()}_${event.aspect}`
      const aspectTemplates = getTemplatesForTrigger("planet_aspect", aspectKey)

      for (const template of aspectTemplates) {
        if (!blocks[template.category as keyof ForecastBlock]) {
          blocks[template.category as keyof ForecastBlock] = personalizeText(template.text, sign, context)
          usedEvents.push({ planet: event.planet, sign: event.sign || "", aspect: event.aspect })
        }
      }
    }
  }

  // 4. Seasonal influence
  const seasonTemplates = getTemplatesForTrigger("season", context.season)
  for (const category of ["mood"] as const) {
    if (!blocks[category]) {
      const template = seasonTemplates.find((t) => t.category === category)
      if (template) {
        blocks[category] = personalizeText(template.text, sign, context)
      }
    }
  }

  // 5. Day of week
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
  const dayTemplates = getTemplatesForTrigger("day_of_week", dayNames[context.dayOfWeek])
  for (const template of dayTemplates) {
    if (!blocks[template.category as keyof ForecastBlock]) {
      blocks[template.category as keyof ForecastBlock] = personalizeText(template.text, sign, context)
    }
  }

  // 6. Fill remaining with element-based defaults
  fillMissingBlocks(blocks, sign, context)

  return {
    ...blocks,
    zodiacSign: sign,
    date: context.date.toISOString().split("T")[0],
    source: {
      events: usedEvents,
      moonPhase: context.moonPhase.phase,
      season: context.season,
    },
  }
}

/**
 * Personalize text based on zodiac sign characteristics
 */
function personalizeText(text: string, sign: ZodiacSign, context: DayContext): string {
  const element = ZODIAC_ELEMENTS[sign]
  const modality = ZODIAC_MODALITY[sign]

  // Add element-specific nuances
  let personalized = text

  // Replace placeholders if any
  personalized = personalized.replace("{element}", element)
  personalized = personalized.replace("{modality}", modality)

  return personalized
}

/**
 * Fill any missing blocks with element-based defaults
 */
function fillMissingBlocks(blocks: ForecastBlock, sign: ZodiacSign, context: DayContext): void {
  const element = ZODIAC_ELEMENTS[sign]

  const elementDefaults: Record<string, ForecastBlock> = {
    fire: {
      love: "Ваша энергия притягивает. Действуйте смело.",
      money: "Инициатива сегодня вознаграждается.",
      mood: "Энтузиазм — ваш главный ресурс.",
      advice: "Начните то, о чём давно думали.",
    },
    earth: {
      love: "Стабильность укрепляет связи.",
      money: "Практичный подход принесёт результат.",
      mood: "Спокойствие — ваша сила.",
      advice: "Завершите начатое.",
    },
    air: {
      love: "Общение сегодня важнее жестов.",
      money: "Новые идеи могут быть прибыльными.",
      mood: "Любопытство ведёт к открытиям.",
      advice: "Поделитесь мыслями с кем-то близким.",
    },
    water: {
      love: "Интуиция подскажет верный путь.",
      money: "Доверьтесь чутью в финансовых вопросах.",
      mood: "Эмоции глубоки — это нормально.",
      advice: "Найдите время для себя.",
    },
  }

  const defaults = elementDefaults[element]

  for (const category of ["love", "money", "mood", "advice"] as const) {
    if (!blocks[category]) {
      blocks[category] = defaults[category]
    }
  }
}

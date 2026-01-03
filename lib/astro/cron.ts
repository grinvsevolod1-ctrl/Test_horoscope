/**
 * Cron Worker for Forecast Generation
 *
 * Runs daily at 00:00 UTC to generate forecasts for all zodiac signs.
 * Can be triggered via Vercel Cron or external scheduler.
 */

import { neon } from "@neondatabase/serverless"
import { generateDailyForecasts } from "./generator"
import type { GeneratedForecast } from "./types"

const sql = neon(process.env.DATABASE_URL!)

/**
 * Main cron job: generate and store forecasts for tomorrow
 */
export async function runForecastGeneration(): Promise<{
  success: boolean
  forecastsGenerated: number
  errors: string[]
}> {
  const errors: string[] = []
  let forecastsGenerated = 0

  try {
    // Generate for tomorrow (so they're ready for morning delivery)
    const tomorrow = new Date()
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
    tomorrow.setUTCHours(0, 0, 0, 0)

    const dateStr = tomorrow.toISOString().split("T")[0]

    // Check if forecasts already exist for this date
    const existing = await sql`
      SELECT COUNT(*) as count FROM forecasts WHERE date = ${dateStr}
    `

    if (existing[0].count > 0) {
      console.log(`Forecasts for ${dateStr} already exist, skipping generation`)
      return { success: true, forecastsGenerated: 0, errors: [] }
    }

    // Generate forecasts
    console.log(`Generating forecasts for ${dateStr}...`)
    const forecasts = await generateDailyForecasts(tomorrow)

    // Store in database
    for (const forecast of forecasts) {
      try {
        await storeForecast(forecast, dateStr)
        forecastsGenerated++
      } catch (err) {
        const errorMsg = `Failed to store forecast for ${forecast.zodiacSign}: ${err}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    console.log(`Generated ${forecastsGenerated} forecasts for ${dateStr}`)

    return {
      success: errors.length === 0,
      forecastsGenerated,
      errors,
    }
  } catch (err) {
    const errorMsg = `Forecast generation failed: ${err}`
    console.error(errorMsg)
    return {
      success: false,
      forecastsGenerated,
      errors: [errorMsg, ...errors],
    }
  }
}

/**
 * Store a single forecast in the database
 */
async function storeForecast(forecast: GeneratedForecast, dateStr: string): Promise<void> {
  await sql`
    INSERT INTO forecasts (
      date,
      zodiac_sign,
      love,
      money,
      mood,
      advice,
      source,
      generated_at
    ) VALUES (
      ${dateStr},
      ${forecast.zodiacSign},
      ${forecast.love},
      ${forecast.money},
      ${forecast.mood},
      ${forecast.advice},
      ${JSON.stringify(forecast.source)},
      NOW()
    )
    ON CONFLICT (date, zodiac_sign) 
    DO UPDATE SET
      love = EXCLUDED.love,
      money = EXCLUDED.money,
      mood = EXCLUDED.mood,
      advice = EXCLUDED.advice,
      source = EXCLUDED.source,
      generated_at = NOW()
  `
}

/**
 * Get forecast for a specific date and zodiac sign
 */
export async function getForecast(date: string, zodiacSign: string): Promise<GeneratedForecast | null> {
  const result = await sql`
    SELECT * FROM forecasts 
    WHERE date = ${date} AND zodiac_sign = ${zodiacSign}
    LIMIT 1
  `

  if (result.length === 0) return null

  const row = result[0]
  return {
    date: row.date,
    zodiacSign: row.zodiac_sign,
    love: row.love,
    money: row.money,
    mood: row.mood,
    advice: row.advice,
    source: row.source,
  }
}

/**
 * Get all forecasts for a specific date
 */
export async function getAllForecasts(date: string): Promise<GeneratedForecast[]> {
  const result = await sql`
    SELECT * FROM forecasts WHERE date = ${date}
    ORDER BY zodiac_sign
  `

  return result.map((row) => ({
    date: row.date,
    zodiacSign: row.zodiac_sign,
    love: row.love,
    money: row.money,
    mood: row.mood,
    advice: row.advice,
    source: row.source,
  }))
}

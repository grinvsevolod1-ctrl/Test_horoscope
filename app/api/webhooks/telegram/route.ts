import { type NextRequest, Response } from "next/server"
import { neon } from "@neondatabase/serverless"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30
export const fetchCache = "force-no-store"

const sql = neon(process.env.DATABASE_URL!)
const BOT_TOKEN = process.env.BOT_TOKEN!

// Telegram API helper
async function sendMessage(chatId: number, text: string, options?: { reply_markup?: object }) {
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      ...options,
    }),
  })
  return response.json()
}

// Zodiac keyboard
const ZODIAC_KEYBOARD = {
  inline_keyboard: [
    [
      { text: "♈ Овен", callback_data: "zodiac_aries" },
      { text: "♉ Телец", callback_data: "zodiac_taurus" },
      { text: "♊ Близнецы", callback_data: "zodiac_gemini" },
    ],
    [
      { text: "♋ Рак", callback_data: "zodiac_cancer" },
      { text: "♌ Лев", callback_data: "zodiac_leo" },
      { text: "♍ Дева", callback_data: "zodiac_virgo" },
    ],
    [
      { text: "♎ Весы", callback_data: "zodiac_libra" },
      { text: "♏ Скорпион", callback_data: "zodiac_scorpio" },
      { text: "♐ Стрелец", callback_data: "zodiac_sagittarius" },
    ],
    [
      { text: "♑ Козерог", callback_data: "zodiac_capricorn" },
      { text: "♒ Водолей", callback_data: "zodiac_aquarius" },
      { text: "♓ Рыбы", callback_data: "zodiac_pisces" },
    ],
  ],
}

const ZODIAC_NAMES: Record<string, string> = {
  aries: "Овен",
  taurus: "Телец",
  gemini: "Близнецы",
  cancer: "Рак",
  leo: "Лев",
  virgo: "Дева",
  libra: "Весы",
  scorpio: "Скорпион",
  sagittarius: "Стрелец",
  capricorn: "Козерог",
  aquarius: "Водолей",
  pisces: "Рыбы",
}

const ZODIAC_SYMBOLS: Record<string, string> = {
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpio: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓",
}

// Get or create user
async function getOrCreateUser(telegramId: number, username?: string) {
  const users = await sql`
    SELECT u.*, s.status as sub_status, s.trial_ends_at, p.name as plan_name
    FROM users u
    LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status IN ('active', 'trial', 'grace')
    LEFT JOIN plans p ON p.id = s.plan_id
    WHERE u.telegram_id = ${telegramId}
    LIMIT 1
  `

  if (users.length > 0) {
    return users[0]
  }

  // Check if user registered via website
  const webUsers = await sql`
    SELECT u.*, s.status as sub_status, s.trial_ends_at, p.name as plan_name
    FROM users u
    LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status IN ('active', 'trial', 'grace')
    LEFT JOIN plans p ON p.id = s.plan_id
    WHERE u.email LIKE ${`%@telegram.web`} AND u.telegram_id IS NULL
    ORDER BY u.created_at DESC
    LIMIT 1
  `

  if (webUsers.length > 0 && username) {
    // Link telegram_id to web user
    await sql`UPDATE users SET telegram_id = ${telegramId}, updated_at = NOW() WHERE id = ${webUsers[0].id}`
    return { ...webUsers[0], telegram_id: telegramId }
  }

  return null
}

// Get today's forecast
async function getTodayForecast(zodiacSign: string) {
  const today = new Date().toISOString().split("T")[0]

  const forecasts = await sql`
    SELECT * FROM forecasts 
    WHERE zodiac_sign = ${zodiacSign} AND forecast_date = ${today}
    LIMIT 1
  `

  if (forecasts.length > 0) {
    return forecasts[0]
  }

  // Return template forecast if none generated
  return {
    love: "Сегодня звёзды благоприятствуют романтике. Будьте открыты к новым знакомствам.",
    money: "Хороший день для финансовых решений. Доверяйте интуиции.",
    mood: "Энергия дня направлена на творчество и самовыражение.",
    advice: "Найдите время для себя — даже 10 минут тишины зарядят вас силой.",
  }
}

// Handle /start command
async function handleStart(chatId: number, telegramId: number, username?: string) {
  const user = await getOrCreateUser(telegramId, username)

  if (user && user.zodiac_sign) {
    // Existing user with zodiac
    const sign = user.zodiac_sign
    const signName = ZODIAC_NAMES[sign] || sign
    const symbol = ZODIAC_SYMBOLS[sign] || "⭐"

    let statusText = ""
    if (user.sub_status === "active") {
      statusText = `\n\n✅ Подписка: <b>${user.plan_name || "Активна"}</b>`
    } else if (user.sub_status === "trial") {
      const trialEnd = user.trial_ends_at ? new Date(user.trial_ends_at).toLocaleDateString("ru-RU") : "скоро"
      statusText = `\n\n🎁 Пробный период до: <b>${trialEnd}</b>`
    }

    await sendMessage(
      chatId,
      `С возвращением! ${symbol}\n\nВаш знак: <b>${signName}</b>${statusText}\n\nИспользуйте /forecast чтобы получить прогноз на сегодня.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔮 Прогноз на сегодня", callback_data: "get_forecast" }],
            [{ text: "⚙️ Настройки", callback_data: "settings" }],
          ],
        },
      },
    )
  } else {
    // New user - start onboarding
    await sendMessage(
      chatId,
      `✨ <b>Добро пожаловать в Daily Astro!</b>\n\nЯ буду присылать вам персональный гороскоп каждое утро.\n\nВыберите ваш знак зодиака:`,
      { reply_markup: ZODIAC_KEYBOARD },
    )
  }
}

// Handle /forecast command
async function handleForecast(chatId: number, telegramId: number) {
  const user = await getOrCreateUser(telegramId)

  if (!user || !user.zodiac_sign) {
    await sendMessage(chatId, "Сначала выберите знак зодиака. Нажмите /start")
    return
  }

  const forecast = await getTodayForecast(user.zodiac_sign)
  const signName = ZODIAC_NAMES[user.zodiac_sign] || user.zodiac_sign
  const symbol = ZODIAC_SYMBOLS[user.zodiac_sign] || "⭐"
  const today = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" })

  const message = `${symbol} <b>Прогноз для ${signName}</b>
📅 ${today}

❤️ <b>Любовь</b>
${forecast.love}

💰 <b>Деньги</b>
${forecast.money}

🌟 <b>Настроение</b>
${forecast.mood}

💡 <b>Совет дня</b>
${forecast.advice}

━━━━━━━━━━━━━━━
🔔 Прогнозы приходят в 07:30 по вашему времени`

  await sendMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: [[{ text: "🔄 Изменить знак", callback_data: "change_zodiac" }]],
    },
  })
}

// Handle /plan command
async function handlePlan(chatId: number, telegramId: number) {
  const user = await getOrCreateUser(telegramId)

  let currentPlan = "Нет подписки"
  if (user?.sub_status === "active") {
    currentPlan = `✅ ${user.plan_name || "Активна"}`
  } else if (user?.sub_status === "trial") {
    const trialEnd = user.trial_ends_at ? new Date(user.trial_ends_at).toLocaleDateString("ru-RU") : "скоро"
    currentPlan = `🎁 Пробный период (до ${trialEnd})`
  }

  await sendMessage(
    chatId,
    `📋 <b>Ваш тариф:</b> ${currentPlan}\n\n<b>Доступные тарифы:</b>\n\n⭐ <b>Базовый</b> — 3 BYN/мес\nЕжедневный прогноз по 4 сферам\n\n💫 <b>Плюс</b> — 6 BYN/мес\n+ Совместимость дня + Аффирмации\n\n👑 <b>Премиум</b> — 12 BYN/мес\n+ Важные даты + Гибкое время`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "💳 Оформить подписку", url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe` }],
          [{ text: "❌ Отменить подписку", callback_data: "cancel_sub" }],
        ],
      },
    },
  )
}

// Handle /settings command
async function handleSettings(chatId: number, telegramId: number) {
  const user = await getOrCreateUser(telegramId)

  if (!user) {
    await sendMessage(chatId, "Сначала зарегистрируйтесь. Нажмите /start")
    return
  }

  const signName = ZODIAC_NAMES[user.zodiac_sign] || "Не выбран"
  const deliveryTime = user.delivery_time || "07:30"
  const isPaused = user.is_paused ? "⏸️ На паузе" : "▶️ Активна"

  await sendMessage(
    chatId,
    `⚙️ <b>Настройки</b>\n\n♈ Знак: <b>${signName}</b>\n⏰ Время доставки: <b>${deliveryTime}</b>\n📬 Доставка: <b>${isPaused}</b>`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "♈ Изменить знак", callback_data: "change_zodiac" }],
          [{ text: "⏰ Изменить время", callback_data: "change_time" }],
          [{ text: user.is_paused ? "▶️ Возобновить" : "⏸️ Пауза", callback_data: "toggle_pause" }],
        ],
      },
    },
  )
}

// Handle zodiac selection callback
async function handleZodiacSelection(chatId: number, telegramId: number, zodiacSign: string) {
  // Update or create user with zodiac
  const existing = await sql`SELECT id FROM users WHERE telegram_id = ${telegramId}`

  if (existing.length > 0) {
    await sql`
      UPDATE users SET zodiac_sign = ${zodiacSign}, updated_at = NOW() 
      WHERE telegram_id = ${telegramId}
    `
  } else {
    await sql`
      INSERT INTO users (id, telegram_id, zodiac_sign, timezone, locale, delivery_time, is_paused, created_at, updated_at)
      VALUES (gen_random_uuid(), ${telegramId}, ${zodiacSign}, 'Europe/Minsk', 'ru', '07:30:00', false, NOW(), NOW())
    `
  }

  const signName = ZODIAC_NAMES[zodiacSign]
  const symbol = ZODIAC_SYMBOLS[zodiacSign]

  await sendMessage(
    chatId,
    `${symbol} Отлично! Ваш знак — <b>${signName}</b>\n\nТеперь вы будете получать персональные прогнозы каждое утро в 07:30.\n\nНажмите кнопку ниже, чтобы получить первый прогноз!`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔮 Получить прогноз", callback_data: "get_forecast" }],
          [{ text: "💳 Оформить подписку", url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe` }],
        ],
      },
    },
  )
}

// Handle pause toggle
async function handleTogglePause(chatId: number, telegramId: number) {
  const user = await getOrCreateUser(telegramId)
  if (!user) return

  const newPaused = !user.is_paused
  await sql`UPDATE users SET is_paused = ${newPaused}, updated_at = NOW() WHERE telegram_id = ${telegramId}`

  await sendMessage(chatId, newPaused ? "⏸️ Доставка прогнозов приостановлена" : "▶️ Доставка прогнозов возобновлена")
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Telegram webhook received")

    // Handle callback queries (button clicks)
    if (body.callback_query) {
      const callback = body.callback_query
      const chatId = callback.message.chat.id
      const telegramId = callback.from.id
      const data = callback.data

      // Answer callback to remove loading state
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: callback.id }),
      })

      if (data.startsWith("zodiac_")) {
        const zodiac = data.replace("zodiac_", "")
        await handleZodiacSelection(chatId, telegramId, zodiac)
      } else if (data === "get_forecast") {
        await handleForecast(chatId, telegramId)
      } else if (data === "settings") {
        await handleSettings(chatId, telegramId)
      } else if (data === "change_zodiac") {
        await sendMessage(chatId, "Выберите новый знак зодиака:", { reply_markup: ZODIAC_KEYBOARD })
      } else if (data === "toggle_pause") {
        await handleTogglePause(chatId, telegramId)
      } else if (data === "cancel_sub") {
        await sendMessage(
          chatId,
          "Для отмены подписки напишите /cancel\n\nДоступ сохранится до конца оплаченного периода.",
        )
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      })
    }

    // Handle messages
    if (body.message) {
      const message = body.message
      const chatId = message.chat.id
      const telegramId = message.from.id
      const username = message.from.username
      const text = message.text?.trim() || ""

      // Command handlers
      if (text === "/start") {
        await handleStart(chatId, telegramId, username)
      } else if (text === "/forecast" || text === "/horoscope") {
        await handleForecast(chatId, telegramId)
      } else if (text === "/plan" || text === "/subscription") {
        await handlePlan(chatId, telegramId)
      } else if (text === "/settings") {
        await handleSettings(chatId, telegramId)
      } else if (text === "/pause") {
        await handleTogglePause(chatId, telegramId)
      } else if (text === "/cancel") {
        const user = await getOrCreateUser(telegramId)
        if (user?.sub_status) {
          await sql`
            UPDATE subscriptions SET status = 'canceled', canceled_at = NOW(), updated_at = NOW()
            WHERE user_id = ${user.id} AND status IN ('active', 'trial', 'grace')
          `
          await sendMessage(chatId, "✅ Подписка отменена. Доступ сохранится до конца оплаченного периода.")
        } else {
          await sendMessage(chatId, "У вас нет активной подписки.")
        }
      } else if (text === "/help") {
        await sendMessage(
          chatId,
          `📖 <b>Доступные команды:</b>\n\n/start — Начать работу с ботом\n/forecast — Прогноз на сегодня\n/plan — Информация о подписке\n/settings — Настройки\n/pause — Приостановить доставку\n/cancel — Отменить подписку\n/help — Эта справка\n\n💬 Поддержка: @dailyastro_support`,
        )
      } else {
        // Unknown message
        await sendMessage(chatId, "Используйте /forecast для получения прогноза или /help для списка команд.")
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("[v0] Telegram webhook error:", error)
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  }
}

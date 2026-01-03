import { type NextRequest, NextResponse } from "next/server"
import type { ZodiacSign } from "@/lib/types/database"

// Mock forecasts for demo
const MOCK_FORECASTS: Record<ZodiacSign, { love: string; money: string; mood: string; advice: string }> = {
  aries: {
    love: "Смелость сегодня награждается. Сделайте первый шаг.",
    money: "Энергия для новых проектов на пике — действуйте.",
    mood: "Огненный запал ведёт вперёд.",
    advice: "Начните то, что откладывали.",
  },
  taurus: {
    love: "Стабильность притягивает. Покажите надёжность.",
    money: "Практичные решения сегодня работают лучше всего.",
    mood: "Спокойствие — ваша сила.",
    advice: "Позаботьтесь о комфорте.",
  },
  gemini: {
    love: "Разговоры сегодня важнее жестов.",
    money: "Информация — ваш главный актив.",
    mood: "Любопытство ведёт к открытиям.",
    advice: "Напишите тому, о ком думали.",
  },
  cancer: {
    love: "Забота возвращается сторицей.",
    money: "Интуиция подскажет верное решение.",
    mood: "Дом — лучшее место сегодня.",
    advice: "Позвоните родным.",
  },
  leo: {
    love: "Честность сегодня притягивает.",
    money: "Закрепите договорённости письменно.",
    mood: "Уверенность заразительна.",
    advice: "Один звонок решит два вопроса.",
  },
  virgo: {
    love: "Внимание к деталям укрепит доверие.",
    money: "Проверьте документы и расчёты.",
    mood: "Порядок в делах — порядок в голове.",
    advice: "Составьте список дел.",
  },
  libra: {
    love: "Гармония требует компромисса.",
    money: "Партнёрство может быть выгодным.",
    mood: "Красота поднимает настроение.",
    advice: "Найдите баланс между «надо» и «хочу».",
  },
  scorpio: {
    love: "Глубина чувств требует доверия.",
    money: "Скрытые ресурсы могут проявиться.",
    mood: "Интенсивность — это нормально.",
    advice: "Отпустите то, что уже не нужно.",
  },
  sagittarius: {
    love: "Открытость привлекает — будьте искренни.",
    money: "Перспективы расширяются.",
    mood: "Оптимизм заразителен.",
    advice: "Запланируйте что-то новое.",
  },
  capricorn: {
    love: "Серьёзный разговор сблизит.",
    money: "Стратегическое мышление в приоритете.",
    mood: "Дисциплина приносит удовлетворение.",
    advice: "Поставьте конкретную цель на неделю.",
  },
  aquarius: {
    love: "Оригинальность привлекает внимание.",
    money: "Нестандартные идеи сработают.",
    mood: "Свобода мысли — ключ к хорошему дню.",
    advice: "Попробуйте что-то совершенно новое.",
  },
  pisces: {
    love: "Романтика в воздухе — ловите момент.",
    money: "Творческий подход к финансам поможет.",
    mood: "Мечтательность сегодня уместна.",
    advice: "Найдите время для тишины.",
  },
}

// GET /api/bot/forecast-today - Get today's forecast for user
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get("user_id")
  const telegramId = searchParams.get("telegram_id")

  if (!userId && !telegramId) {
    return NextResponse.json({ error: "Missing user_id or telegram_id" }, { status: 400 })
  }

  // In production, fetch user and their forecast from database
  /*
  const user = await db.users.findFirst({
    where: userId ? { id: userId } : { telegram_id: Number(telegramId) },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const today = new Date().toISOString().split('T')[0]
  const forecast = await db.forecasts.findUnique({
    where: {
      forecast_date_zodiac_sign: {
        forecast_date: today,
        zodiac_sign: user.zodiac_sign,
      },
    },
  })
  */

  // Mock response for demo
  const mockZodiac: ZodiacSign = "leo"
  const forecast = MOCK_FORECASTS[mockZodiac]
  const today = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  })

  return NextResponse.json({
    date: new Date().toISOString().split("T")[0],
    zodiac_sign: mockZodiac,
    title: `Сегодня для Льва — ${today}`,
    ...forecast,
    streak: 7,
    source: {
      events: [
        { planet: "Moon", sign: "Virgo" },
        { planet: "Mars", sign: "Sagittarius" },
      ],
    },
  })
}

/**
 * Content Templates Library
 *
 * Templates for generating forecast text based on triggers.
 * In production, these would be stored in database.
 */

export interface ContentTemplate {
  triggerType: string
  triggerValue: string
  category: string
  text: string
  weight: number
}

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  // Moon in Fire signs
  {
    triggerType: "moon_in_sign",
    triggerValue: "aries",
    category: "love",
    text: "Луна в Овне зажигает страсть — действуйте решительно.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "aries",
    category: "money",
    text: "Импульсивные траты лучше отложить на завтра.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "aries",
    category: "mood",
    text: "Энергия бьёт через край — направьте её в дело.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "aries",
    category: "advice",
    text: "Начните то, что давно откладывали.",
    weight: 1,
  },

  {
    triggerType: "moon_in_sign",
    triggerValue: "leo",
    category: "love",
    text: "Луна во Льве просит внимания — покажите чувства открыто.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "leo",
    category: "money",
    text: "Хороший день для презентаций и переговоров.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "leo",
    category: "mood",
    text: "Творческий подъём — используйте его по максимуму.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "leo",
    category: "advice",
    text: "Побалуйте себя чем-то приятным.",
    weight: 1,
  },

  {
    triggerType: "moon_in_sign",
    triggerValue: "sagittarius",
    category: "love",
    text: "Открытость привлекает — будьте искренни.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "sagittarius",
    category: "money",
    text: "Перспективы расширяются — смотрите дальше.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "sagittarius",
    category: "mood",
    text: "Оптимизм заразителен — делитесь им.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "sagittarius",
    category: "advice",
    text: "Запланируйте что-то новое.",
    weight: 1,
  },

  // Moon in Earth signs
  {
    triggerType: "moon_in_sign",
    triggerValue: "taurus",
    category: "love",
    text: "Луна в Тельце ценит стабильность — укрепляйте связи.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "taurus",
    category: "money",
    text: "Практичные решения принесут результат.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "taurus",
    category: "mood",
    text: "Спокойствие — ваша сила сегодня.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "taurus",
    category: "advice",
    text: "Позаботьтесь о комфорте.",
    weight: 1,
  },

  {
    triggerType: "moon_in_sign",
    triggerValue: "virgo",
    category: "love",
    text: "Внимание к деталям укрепит доверие.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "virgo",
    category: "money",
    text: "Проверьте документы и расчёты.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "virgo",
    category: "mood",
    text: "Порядок в делах — порядок в голове.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "virgo",
    category: "advice",
    text: "Составьте список дел на неделю.",
    weight: 1,
  },

  {
    triggerType: "moon_in_sign",
    triggerValue: "capricorn",
    category: "love",
    text: "Серьёзный разговор сблизит вас.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "capricorn",
    category: "money",
    text: "Стратегическое мышление в приоритете.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "capricorn",
    category: "mood",
    text: "Дисциплина приносит удовлетворение.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "capricorn",
    category: "advice",
    text: "Поставьте конкретную цель.",
    weight: 1,
  },

  // Moon in Air signs
  {
    triggerType: "moon_in_sign",
    triggerValue: "gemini",
    category: "love",
    text: "Разговоры сегодня важнее жестов.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "gemini",
    category: "money",
    text: "Информация — ваш главный актив.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "gemini",
    category: "mood",
    text: "Любопытство ведёт к открытиям.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "gemini",
    category: "advice",
    text: "Напишите тому, о ком давно думали.",
    weight: 1,
  },

  {
    triggerType: "moon_in_sign",
    triggerValue: "libra",
    category: "love",
    text: "Гармония в отношениях требует компромисса.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "libra",
    category: "money",
    text: "Партнёрство может быть выгодным.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "libra",
    category: "mood",
    text: "Красота вокруг поднимает настроение.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "libra",
    category: "advice",
    text: "Найдите баланс между делами и отдыхом.",
    weight: 1,
  },

  {
    triggerType: "moon_in_sign",
    triggerValue: "aquarius",
    category: "love",
    text: "Оригинальность привлекает внимание.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "aquarius",
    category: "money",
    text: "Нестандартные идеи могут сработать.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "aquarius",
    category: "mood",
    text: "Свобода мысли — ключ к хорошему дню.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "aquarius",
    category: "advice",
    text: "Попробуйте что-то совершенно новое.",
    weight: 1,
  },

  // Moon in Water signs
  {
    triggerType: "moon_in_sign",
    triggerValue: "cancer",
    category: "love",
    text: "Забота о близких возвращается сторицей.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "cancer",
    category: "money",
    text: "Интуиция подскажет верное решение.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "cancer",
    category: "mood",
    text: "Дом — лучшее место сегодня.",
    weight: 1,
  },
  { triggerType: "moon_in_sign", triggerValue: "cancer", category: "advice", text: "Позвоните родным.", weight: 1 },

  {
    triggerType: "moon_in_sign",
    triggerValue: "scorpio",
    category: "love",
    text: "Глубина чувств требует доверия.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "scorpio",
    category: "money",
    text: "Скрытые ресурсы могут проявиться.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "scorpio",
    category: "mood",
    text: "Интенсивность эмоций — это нормально.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "scorpio",
    category: "advice",
    text: "Отпустите то, что уже не нужно.",
    weight: 1,
  },

  {
    triggerType: "moon_in_sign",
    triggerValue: "pisces",
    category: "love",
    text: "Романтика в воздухе — ловите момент.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "pisces",
    category: "money",
    text: "Творческий подход к финансам поможет.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "pisces",
    category: "mood",
    text: "Мечтательность сегодня уместна.",
    weight: 1,
  },
  {
    triggerType: "moon_in_sign",
    triggerValue: "pisces",
    category: "advice",
    text: "Найдите время для тишины.",
    weight: 1,
  },

  // Moon phases
  {
    triggerType: "moon_phase",
    triggerValue: "new_moon",
    category: "love",
    text: "Новолуние — время для новых начинаний в отношениях.",
    weight: 1,
  },
  {
    triggerType: "moon_phase",
    triggerValue: "new_moon",
    category: "money",
    text: "Посадите семена будущих проектов.",
    weight: 1,
  },
  {
    triggerType: "moon_phase",
    triggerValue: "new_moon",
    category: "advice",
    text: "Поставьте намерение на лунный цикл.",
    weight: 1,
  },

  {
    triggerType: "moon_phase",
    triggerValue: "full_moon",
    category: "love",
    text: "Полнолуние усиливает эмоции — будьте мягче.",
    weight: 1,
  },
  {
    triggerType: "moon_phase",
    triggerValue: "full_moon",
    category: "mood",
    text: "Эмоции на пике — это временно.",
    weight: 1,
  },
  {
    triggerType: "moon_phase",
    triggerValue: "full_moon",
    category: "advice",
    text: "Завершите то, что начали две недели назад.",
    weight: 1,
  },

  {
    triggerType: "moon_phase",
    triggerValue: "first_quarter",
    category: "money",
    text: "Энергия роста — наращивайте усилия.",
    weight: 1,
  },
  {
    triggerType: "moon_phase",
    triggerValue: "first_quarter",
    category: "advice",
    text: "Принимайте решения — время действовать.",
    weight: 1,
  },

  {
    triggerType: "moon_phase",
    triggerValue: "last_quarter",
    category: "advice",
    text: "Время отпускать лишнее.",
    weight: 1,
  },
  {
    triggerType: "moon_phase",
    triggerValue: "last_quarter",
    category: "mood",
    text: "Рефлексия важнее активности.",
    weight: 1,
  },

  // Planet aspects
  {
    triggerType: "planet_aspect",
    triggerValue: "mars_trine",
    category: "love",
    text: "Энергия Марса даёт смелость в чувствах.",
    weight: 1,
  },
  {
    triggerType: "planet_aspect",
    triggerValue: "mars_trine",
    category: "money",
    text: "Активные действия принесут результат.",
    weight: 1,
  },
  {
    triggerType: "planet_aspect",
    triggerValue: "mars_square",
    category: "advice",
    text: "Избегайте конфликтов — они не стоят энергии.",
    weight: 1,
  },
  {
    triggerType: "planet_aspect",
    triggerValue: "mars_square",
    category: "mood",
    text: "Напряжение может возникнуть — дышите глубже.",
    weight: 1,
  },

  {
    triggerType: "planet_aspect",
    triggerValue: "venus_trine",
    category: "love",
    text: "Венера благоволит — любовь рядом.",
    weight: 1,
  },
  {
    triggerType: "planet_aspect",
    triggerValue: "venus_trine",
    category: "mood",
    text: "Красота и гармония наполняют день.",
    weight: 1,
  },
  {
    triggerType: "planet_aspect",
    triggerValue: "venus_square",
    category: "money",
    text: "Осторожнее с тратами на удовольствия.",
    weight: 1,
  },
  {
    triggerType: "planet_aspect",
    triggerValue: "venus_square",
    category: "love",
    text: "Мелкие недопонимания возможны — проявите терпение.",
    weight: 1,
  },

  {
    triggerType: "planet_aspect",
    triggerValue: "mercury_retrograde",
    category: "love",
    text: "Перечитайте сообщения перед отправкой.",
    weight: 1,
  },
  {
    triggerType: "planet_aspect",
    triggerValue: "mercury_retrograde",
    category: "money",
    text: "Отложите крупные сделки на неделю.",
    weight: 1,
  },
  {
    triggerType: "planet_aspect",
    triggerValue: "mercury_retrograde",
    category: "advice",
    text: "Проверяйте детали дважды.",
    weight: 1,
  },

  {
    triggerType: "planet_aspect",
    triggerValue: "jupiter_trine",
    category: "money",
    text: "Юпитер расширяет возможности — действуйте масштабно.",
    weight: 1,
  },
  {
    triggerType: "planet_aspect",
    triggerValue: "jupiter_trine",
    category: "mood",
    text: "Оптимизм оправдан — верьте в лучшее.",
    weight: 1,
  },

  {
    triggerType: "planet_aspect",
    triggerValue: "saturn_square",
    category: "money",
    text: "Сатурн требует дисциплины — следуйте плану.",
    weight: 1,
  },
  {
    triggerType: "planet_aspect",
    triggerValue: "saturn_square",
    category: "advice",
    text: "Терпение важнее скорости.",
    weight: 1,
  },

  // Seasons
  {
    triggerType: "season",
    triggerValue: "winter",
    category: "mood",
    text: "Зимняя энергия располагает к глубине и рефлексии.",
    weight: 1,
  },
  {
    triggerType: "season",
    triggerValue: "winter",
    category: "advice",
    text: "Берегите силы — они понадобятся весной.",
    weight: 1,
  },

  {
    triggerType: "season",
    triggerValue: "spring",
    category: "mood",
    text: "Весенняя энергия пробуждает — используйте подъём.",
    weight: 1,
  },
  {
    triggerType: "season",
    triggerValue: "spring",
    category: "love",
    text: "Новые знакомства особенно вероятны.",
    weight: 1,
  },

  {
    triggerType: "season",
    triggerValue: "summer",
    category: "mood",
    text: "Летняя энергия на пике — наслаждайтесь.",
    weight: 1,
  },
  {
    triggerType: "season",
    triggerValue: "summer",
    category: "advice",
    text: "Действуйте, пока энергия высока.",
    weight: 1,
  },

  {
    triggerType: "season",
    triggerValue: "autumn",
    category: "mood",
    text: "Осень — время подводить итоги.",
    weight: 1,
  },
  {
    triggerType: "season",
    triggerValue: "autumn",
    category: "money",
    text: "Соберите урожай прошлых усилий.",
    weight: 1,
  },

  // Days of week
  {
    triggerType: "day_of_week",
    triggerValue: "monday",
    category: "advice",
    text: "Понедельник задаёт тон неделе — начните правильно.",
    weight: 1,
  },
  {
    triggerType: "day_of_week",
    triggerValue: "tuesday",
    category: "money",
    text: "Вторник благоприятен для активных действий.",
    weight: 1,
  },
  {
    triggerType: "day_of_week",
    triggerValue: "wednesday",
    category: "advice",
    text: "Среда — идеальный день для переговоров.",
    weight: 1,
  },
  {
    triggerType: "day_of_week",
    triggerValue: "thursday",
    category: "money",
    text: "Четверг приносит расширение — думайте масштабно.",
    weight: 1,
  },
  {
    triggerType: "day_of_week",
    triggerValue: "friday",
    category: "love",
    text: "Пятница открыта для романтики.",
    weight: 1,
  },
  {
    triggerType: "day_of_week",
    triggerValue: "saturday",
    category: "mood",
    text: "Суббота — день восстановления и удовольствий.",
    weight: 1,
  },
  {
    triggerType: "day_of_week",
    triggerValue: "sunday",
    category: "advice",
    text: "Воскресенье — время для планирования недели.",
    weight: 1,
  },
]

/**
 * Get templates matching a specific trigger
 */
export function getTemplatesForTrigger(triggerType: string, triggerValue: string): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter(
    (t) => t.triggerType === triggerType && t.triggerValue.toLowerCase() === triggerValue.toLowerCase(),
  )
}

/**
 * Get random template from matching set
 */
export function getRandomTemplate(triggerType: string, triggerValue: string, category: string): ContentTemplate | null {
  const matching = CONTENT_TEMPLATES.filter(
    (t) =>
      t.triggerType === triggerType &&
      t.triggerValue.toLowerCase() === triggerValue.toLowerCase() &&
      t.category === category,
  )

  if (matching.length === 0) return null

  // Weighted random selection
  const totalWeight = matching.reduce((sum, t) => sum + t.weight, 0)
  let random = Math.random() * totalWeight

  for (const template of matching) {
    random -= template.weight
    if (random <= 0) return template
  }

  return matching[0]
}

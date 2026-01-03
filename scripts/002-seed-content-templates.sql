-- Seed content templates for forecast generation
-- These templates are combined based on astronomical events

-- Moon in signs templates
INSERT INTO content_templates (trigger_type, trigger_value, category, text_ru) VALUES
-- Moon in Fire signs
('moon_in_sign', 'aries', 'love', 'Луна в Овне зажигает страсть — действуйте решительно.'),
('moon_in_sign', 'aries', 'money', 'Импульсивные покупки сегодня лучше отложить.'),
('moon_in_sign', 'aries', 'mood', 'Энергия бьёт через край — направьте её в дело.'),
('moon_in_sign', 'aries', 'advice', 'Начните то, что давно откладывали.'),

('moon_in_sign', 'leo', 'love', 'Луна во Льве просит внимания — покажите чувства.'),
('moon_in_sign', 'leo', 'money', 'Хороший день для презентаций и переговоров.'),
('moon_in_sign', 'leo', 'mood', 'Творческий подъём — используйте его.'),
('moon_in_sign', 'leo', 'advice', 'Побалуйте себя чем-то приятным.'),

('moon_in_sign', 'sagittarius', 'love', 'Открытость привлекает — будьте искренни.'),
('moon_in_sign', 'sagittarius', 'money', 'Перспективы расширяются — смотрите дальше.'),
('moon_in_sign', 'sagittarius', 'mood', 'Оптимизм заразителен — делитесь им.'),
('moon_in_sign', 'sagittarius', 'advice', 'Запланируйте что-то новое на ближайшее время.'),

-- Moon in Earth signs
('moon_in_sign', 'taurus', 'love', 'Луна в Тельце ценит стабильность — укрепляйте связи.'),
('moon_in_sign', 'taurus', 'money', 'Практичные решения принесут результат.'),
('moon_in_sign', 'taurus', 'mood', 'Спокойствие — ваша сила сегодня.'),
('moon_in_sign', 'taurus', 'advice', 'Позаботьтесь о комфорте — это не лишнее.'),

('moon_in_sign', 'virgo', 'love', 'Внимание к деталям укрепит доверие.'),
('moon_in_sign', 'virgo', 'money', 'Проверьте документы и расчёты.'),
('moon_in_sign', 'virgo', 'mood', 'Порядок в делах — порядок в голове.'),
('moon_in_sign', 'virgo', 'advice', 'Составьте список дел — это поможет.'),

('moon_in_sign', 'capricorn', 'love', 'Серьёзный разговор сблизит вас.'),
('moon_in_sign', 'capricorn', 'money', 'Стратегическое мышление сегодня в приоритете.'),
('moon_in_sign', 'capricorn', 'mood', 'Дисциплина приносит удовлетворение.'),
('moon_in_sign', 'capricorn', 'advice', 'Поставьте конкретную цель на неделю.'),

-- Moon in Air signs
('moon_in_sign', 'gemini', 'love', 'Разговоры сегодня важнее жестов.'),
('moon_in_sign', 'gemini', 'money', 'Информация — ваш главный актив.'),
('moon_in_sign', 'gemini', 'mood', 'Любопытство ведёт к открытиям.'),
('moon_in_sign', 'gemini', 'advice', 'Напишите тому, о ком давно думали.'),

('moon_in_sign', 'libra', 'love', 'Гармония в отношениях требует компромисса.'),
('moon_in_sign', 'libra', 'money', 'Партнёрство может быть выгодным.'),
('moon_in_sign', 'libra', 'mood', 'Красота вокруг поднимает настроение.'),
('moon_in_sign', 'libra', 'advice', 'Найдите баланс между «надо» и «хочу».'),

('moon_in_sign', 'aquarius', 'love', 'Оригинальность привлекает внимание.'),
('moon_in_sign', 'aquarius', 'money', 'Нестандартные идеи могут сработать.'),
('moon_in_sign', 'aquarius', 'mood', 'Свобода мысли — ключ к хорошему дню.'),
('moon_in_sign', 'aquarius', 'advice', 'Попробуйте что-то совершенно новое.'),

-- Moon in Water signs
('moon_in_sign', 'cancer', 'love', 'Забота о близких возвращается сторицей.'),
('moon_in_sign', 'cancer', 'money', 'Интуиция подскажет верное решение.'),
('moon_in_sign', 'cancer', 'mood', 'Дом — лучшее место сегодня.'),
('moon_in_sign', 'cancer', 'advice', 'Позвоните родным — они ждут.'),

('moon_in_sign', 'scorpio', 'love', 'Глубина чувств требует доверия.'),
('moon_in_sign', 'scorpio', 'money', 'Скрытые ресурсы могут проявиться.'),
('moon_in_sign', 'scorpio', 'mood', 'Интенсивность эмоций — это нормально.'),
('moon_in_sign', 'scorpio', 'advice', 'Отпустите то, что уже не нужно.'),

('moon_in_sign', 'pisces', 'love', 'Романтика в воздухе — ловите момент.'),
('moon_in_sign', 'pisces', 'money', 'Творческий подход к финансам поможет.'),
('moon_in_sign', 'pisces', 'mood', 'Мечтательность сегодня уместна.'),
('moon_in_sign', 'pisces', 'advice', 'Найдите время для себя и тишины.'),

-- Planet aspects
('planet_aspect', 'mars_trine', 'love', 'Энергия Марса даёт смелость в чувствах.'),
('planet_aspect', 'mars_trine', 'money', 'Активные действия принесут результат.'),
('planet_aspect', 'mars_square', 'advice', 'Избегайте конфликтов — они не стоят энергии.'),

('planet_aspect', 'venus_trine', 'love', 'Венера благоволит — любовь рядом.'),
('planet_aspect', 'venus_trine', 'mood', 'Красота и гармония наполняют день.'),
('planet_aspect', 'venus_square', 'money', 'Осторожнее с тратами на удовольствия.'),

('planet_aspect', 'mercury_retrograde', 'love', 'Перечитайте сообщения перед отправкой.'),
('planet_aspect', 'mercury_retrograde', 'money', 'Отложите подписание важных документов.'),
('planet_aspect', 'mercury_retrograde', 'advice', 'Вернитесь к незавершённым делам.'),

('planet_aspect', 'jupiter_trine', 'money', 'Удача на вашей стороне — рискните.'),
('planet_aspect', 'jupiter_trine', 'mood', 'Оптимизм и расширение возможностей.'),

('planet_aspect', 'saturn_square', 'money', 'Терпение и дисциплина важнее скорости.'),
('planet_aspect', 'saturn_square', 'advice', 'Примите ограничения как временные.'),

-- Moon phases
('moon_phase', 'new_moon', 'love', 'Новолуние — время для новых начинаний в отношениях.'),
('moon_phase', 'new_moon', 'money', 'Посадите семена будущих проектов.'),
('moon_phase', 'new_moon', 'advice', 'Поставьте намерение на лунный цикл.'),

('moon_phase', 'full_moon', 'love', 'Полнолуние усиливает эмоции — будьте мягче.'),
('moon_phase', 'full_moon', 'mood', 'Эмоции на пике — это временно.'),
('moon_phase', 'full_moon', 'advice', 'Завершите то, что начали две недели назад.'),

('moon_phase', 'waxing', 'money', 'Энергия роста — наращивайте.'),
('moon_phase', 'waning', 'advice', 'Время отпускать лишнее.'),

-- Seasons
('season', 'winter', 'mood', 'Зима учит терпению и внутренней работе.'),
('season', 'spring', 'mood', 'Весна пробуждает — действуйте.'),
('season', 'summer', 'mood', 'Лето дарит энергию — используйте её.'),
('season', 'autumn', 'mood', 'Осень — время собирать урожай.'),

-- Days of week
('day_of_week', 'monday', 'advice', 'Начните неделю с главного.'),
('day_of_week', 'friday', 'mood', 'Конец недели — отпустите напряжение.'),
('day_of_week', 'sunday', 'advice', 'Восстановите силы перед новой неделей.');

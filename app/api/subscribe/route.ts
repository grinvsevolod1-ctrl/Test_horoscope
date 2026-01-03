import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { createCheckout } from "@/lib/bepaid"
import { v4 as uuidv4 } from "uuid"

const sql = neon(process.env.DATABASE_URL!)

// Plan configuration
const PLANS: Record<string, { name: string; price: number; dbName: string }> = {
  basic: { name: "Базовый", price: 300, dbName: "basic" },
  plus: { name: "Плюс", price: 600, dbName: "plus" },
  premium: { name: "Премиум", price: 1200, dbName: "premium" },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { telegram_username, zodiac_sign, birth_date, timezone, email, plan_id } = body

    // Validate required fields
    if (!telegram_username || !zodiac_sign || !plan_id) {
      return NextResponse.json({ error: "Заполните обязательные поля: Telegram и знак зодиака" }, { status: 400 })
    }

    const plan = PLANS[plan_id]
    if (!plan) {
      return NextResponse.json({ error: "Неверный тариф" }, { status: 400 })
    }

    // Check if user already exists by telegram username
    const existingUsers = await sql`
      SELECT id, telegram_id FROM users 
      WHERE email = ${`${telegram_username}@telegram.web`}
      LIMIT 1
    `

    let userId: string
    let isNewUser = false

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id
    } else {
      // Create new user (telegram_id will be linked when they message the bot)
      const newUser = await sql`
        INSERT INTO users (
          id,
          email,
          zodiac_sign,
          birth_date,
          timezone,
          locale,
          delivery_time,
          is_paused,
          created_at,
          updated_at
        ) VALUES (
          ${uuidv4()},
          ${`${telegram_username}@telegram.web`},
          ${zodiac_sign},
          ${birth_date || null},
          ${timezone || "Europe/Minsk"},
          'ru',
          '07:30:00',
          false,
          NOW(),
          NOW()
        )
        RETURNING id
      `
      userId = newUser[0].id
      isNewUser = true
    }

    // Get plan ID from database
    const dbPlans = await sql`
      SELECT id FROM plans WHERE name = ${plan.dbName} AND is_active = true LIMIT 1
    `

    let dbPlanId: string
    if (dbPlans.length === 0) {
      // Create plan if not exists
      const newPlan = await sql`
        INSERT INTO plans (id, name, price_byn_month, features, is_active, created_at)
        VALUES (
          ${uuidv4()},
          ${plan.dbName},
          ${plan.price},
          ${JSON.stringify({ tier: plan_id })},
          true,
          NOW()
        )
        RETURNING id
      `
      dbPlanId = newPlan[0].id
    } else {
      dbPlanId = dbPlans[0].id
    }

    // Check for existing active subscription
    const existingSubs = await sql`
      SELECT id, status FROM subscriptions 
      WHERE user_id = ${userId} AND status IN ('active', 'trial', 'grace')
      LIMIT 1
    `

    if (existingSubs.length > 0) {
      return NextResponse.json(
        {
          error: "У вас уже есть активная подписка. Напишите боту @Dailyastrobelarusbot для управления",
        },
        { status: 400 },
      )
    }

    // Create subscription with trial
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 7)

    const subscriptionId = uuidv4()
    await sql`
      INSERT INTO subscriptions (
        id,
        user_id,
        plan_id,
        status,
        start_at,
        trial_ends_at,
        renew_at,
        payment_provider,
        created_at,
        updated_at
      ) VALUES (
        ${subscriptionId},
        ${userId},
        ${dbPlanId},
        'trial',
        NOW(),
        ${trialEndsAt.toISOString()},
        ${trialEndsAt.toISOString()},
        'bepaid',
        NOW(),
        NOW()
      )
    `

    // Create checkout for payment after trial
    const orderId = uuidv4()

    try {
      const checkout = await createCheckout({
        orderId,
        amount: plan.price,
        description: `Daily Astro — ${plan.name} (месяц)`,
        email: email || undefined,
        telegramId: telegram_username,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/return?subscription=${subscriptionId}`,
        notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/bepaid`,
        recurring: true,
      })

      // Save pending payment
      await sql`
        INSERT INTO payments (
          id,
          user_id,
          subscription_id,
          order_id,
          amount_byn,
          currency,
          status,
          is_recurring,
          created_at
        ) VALUES (
          ${uuidv4()},
          ${userId},
          ${subscriptionId},
          ${orderId},
          ${plan.price},
          'BYN',
          'pending',
          true,
          NOW()
        )
      `

      return NextResponse.json({
        success: true,
        user_id: userId,
        subscription_id: subscriptionId,
        checkout_url: checkout.checkout.redirect_url,
        trial_ends_at: trialEndsAt.toISOString(),
        message: "Подписка создана. После оплаты напишите боту @Dailyastrobelarusbot",
      })
    } catch (checkoutError) {
      // If bePaid is not configured, still create trial
      console.error("Checkout error (bePaid may not be configured):", checkoutError)

      return NextResponse.json({
        success: true,
        user_id: userId,
        subscription_id: subscriptionId,
        trial_ends_at: trialEndsAt.toISOString(),
        message: "Пробный период активирован! Напишите боту @Dailyastrobelarusbot для получения прогнозов",
        checkout_url: null, // Trial without immediate payment
      })
    }
  } catch (error) {
    console.error("Subscribe error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Ошибка сервера" }, { status: 500 })
  }
}

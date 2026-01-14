import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyWebhookSignature, parseWebhookPayload } from "@/lib/bepaid"

const sql = neon(process.env.DATABASE_URL!)

// Idempotency store (в проде — Redis/DB)
const processedTransactions = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-bepaid-signature") || ""
    const rawBody = await request.text()

    // 🔐 Проверка подписи (если секрет задан)
    if (process.env.BEPAID_WEBHOOK_SECRET) {
      const valid = verifyWebhookSignature(rawBody, signature)
      if (!valid) {
        console.error("❌ Invalid webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    // 📦 Парсим payload
    const payload = parseWebhookPayload(rawBody)
    if (!payload) {
      console.error("❌ Invalid payload")
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const { transaction } = payload
    const transactionId = transaction.uid
    const orderId = transaction.tracking_id

    // 🔁 Idempotency
    if (processedTransactions.has(transactionId)) {
      console.log(`⚠️ Transaction ${transactionId} already processed`)
      return NextResponse.json({ status: "already_processed" })
    }

    console.log("📩 Incoming bePaid webhook:", {
      orderId,
      transactionId,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      hasToken: !!transaction.payment?.token,
    })
// --- Обработка статусов ---
    switch (transaction.status) {
      case "successful":
        await handleSuccessfulPayment({
          orderId,
          transactionId,
          amount: transaction.amount,
          currency: transaction.currency,
          paymentToken: transaction.payment?.token || null,
        })
        break

      case "failed":
        await handleFailedPayment({
          orderId,
          transactionId,
          amount: transaction.amount,
        })
        break

      case "pending":
        console.log(`⏳ Payment ${orderId} is pending`)
        break

      default:
        console.log(`⚠️ Unknown payment status: ${transaction.status}`)
    }

    processedTransactions.add(transactionId)
    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}


// ===============================
//   SUCCESSFUL PAYMENT HANDLER
// ===============================

async function handleSuccessfulPayment(params: {
  orderId: string
  transactionId: string
  amount: number
  currency: string
  paymentToken: string | null
}) {
  console.log(`💰 Payment successful for order ${params.orderId}`)

  // 1) Находим платеж
  const payments = await sql`
    SELECT * FROM payments
    WHERE order_id = ${params.orderId}
    LIMIT 1
  `

  if (payments.length === 0) {
    console.error("❌ Payment not found in DB")
    return
  }

  const payment = payments[0]

  // 2) Обновляем статус платежа
  await sql`
    UPDATE payments
    SET status = 'succeeded',
        provider_payment_id = ${params.transactionId},
        updated_at = NOW()
    WHERE id = ${payment.id}
  `

  // 3) Активируем подписку
  const renewAt = new Date()
  renewAt.setDate(renewAt.getDate() + 30)

  await sql`
    UPDATE subscriptions
    SET status = 'active',
        payment_token = ${params.paymentToken},
        renew_at = ${renewAt.toISOString()},
        last_payment_id = ${payment.id},
        updated_at = NOW()
    WHERE id = ${payment.subscription_id}
  `

  console.log(`🎉 Subscription ${payment.subscription_id} activated until ${renewAt.toISOString()}`)

  // 4) (опционально) уведомление бота
  // await notifyUser(payment.user_id, "payment_success")
}
// ===============================
//   FAILED PAYMENT HANDLER
// ===============================

async function handleFailedPayment(params: {
  orderId: string
  transactionId: string
  amount: number
}) {
  console.log(`❌ Payment failed for order ${params.orderId}`)

  // 1) Находим платеж
  const payments = await sql`
    SELECT * FROM payments
    WHERE order_id = ${params.orderId}
    LIMIT 1
  `

  if (payments.length === 0) {
    console.error("❌ Payment not found in DB")
    return
  }

  const payment = payments[0]

  // 2) Обновляем статус платежа
  await sql`
    UPDATE payments
    SET status = 'failed',
        provider_payment_id = ${params.transactionId},
        updated_at = NOW()
    WHERE id = ${payment.id}
  `

  // 3) Переводим подписку в grace‑period (3 дня)
  const graceUntil = new Date()
  graceUntil.setDate(graceUntil.getDate() + 3)

  await sql`
    UPDATE subscriptions
    SET status = 'grace',
        renew_at = ${graceUntil.toISOString()},
        updated_at = NOW()
    WHERE id = ${payment.subscription_id}
  `

  console.log(
    `⚠️ Subscription ${payment.subscription_id} moved to grace period until ${graceUntil.toISOString()}`
  )

  // 4) (опционально) уведомление бота
  // await notifyUser(payment.user_id, "payment_failed")
}

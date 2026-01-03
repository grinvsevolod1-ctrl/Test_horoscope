import { type NextRequest, NextResponse } from "next/server"
import { verifyWebhookSignature, parseWebhookPayload } from "@/lib/bepaid"

// Idempotency store (in production, use Redis or database)
const processedTransactions = new Set<string>()

// POST /api/webhooks/bepaid - Handle bePaid payment notifications
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-bepaid-signature") || ""
    const body = await request.text()

    // Verify webhook signature (skip in development if no secret)
    if (process.env.BEPAID_WEBHOOK_SECRET) {
      if (!verifyWebhookSignature(body, signature)) {
        console.error("Invalid webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    }

    const payload = parseWebhookPayload(body)
    if (!payload) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const { transaction } = payload
    const transactionId = transaction.uid
    const orderId = transaction.tracking_id

    // Idempotency check
    if (processedTransactions.has(transactionId)) {
      console.log(`Transaction ${transactionId} already processed`)
      return NextResponse.json({ status: "already_processed" })
    }

    console.log(`Processing webhook for order ${orderId}:`, {
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      hasToken: !!transaction.payment?.token,
    })

    switch (transaction.status) {
      case "successful":
        await handleSuccessfulPayment({
          orderId,
          transactionId,
          amount: transaction.amount,
          currency: transaction.currency,
          paymentToken: transaction.payment?.token,
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
        // Payment still processing, wait for final status
        console.log(`Payment ${orderId} is pending`)
        break

      default:
        console.log(`Unknown payment status: ${transaction.status}`)
    }

    // Mark as processed
    processedTransactions.add(transactionId)

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}

async function handleSuccessfulPayment(params: {
  orderId: string
  transactionId: string
  amount: number
  currency: string
  paymentToken?: string
}) {
  console.log(`Payment successful for order ${params.orderId}`)

  // In production:
  // 1. Find pending payment by orderId
  // 2. Update payment status to 'succeeded'
  // 3. Save payment_token for recurring charges
  // 4. Activate or extend subscription (renew_at = +30 days)
  // 5. Send confirmation to user via Telegram bot

  /*
  await db.transaction(async (tx) => {
    // Update payment
    const payment = await tx.payments.update({
      where: { order_id: params.orderId },
      data: {
        status: 'succeeded',
        provider_payment_id: params.transactionId,
      },
    })

    // Update subscription
    await tx.subscriptions.update({
      where: { id: payment.subscription_id },
      data: {
        status: 'active',
        payment_token: params.paymentToken,
        renew_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        last_payment_id: payment.id,
      },
    })

    // Notify user via bot
    await notifyUser(payment.user_id, 'payment_success')
  })
  */
}

async function handleFailedPayment(params: { orderId: string; transactionId: string; amount: number }) {
  console.log(`Payment failed for order ${params.orderId}`)

  // In production:
  // 1. Update payment status to 'failed'
  // 2. If subscription exists, set to 'grace' period (3 days)
  // 3. Notify user via Telegram bot

  /*
  await db.transaction(async (tx) => {
    const payment = await tx.payments.update({
      where: { order_id: params.orderId },
      data: {
        status: 'failed',
        provider_payment_id: params.transactionId,
      },
    })

    if (payment.subscription_id) {
      await tx.subscriptions.update({
        where: { id: payment.subscription_id },
        data: {
          status: 'grace',
        },
      })
    }

    await notifyUser(payment.user_id, 'payment_failed')
  })
  */
}

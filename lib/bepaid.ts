import crypto from "crypto"

// bePaid API configuration
const BEPAID_SHOP_ID = process.env.BEPAID_SHOP_ID!
const BEPAID_SECRET_KEY = process.env.BEPAID_SECRET_KEY!
const BEPAID_HPP_URL = process.env.BEPAID_HPP_URL || "https://checkout.bepaid.by/ctp/api/checkouts"
const BEPAID_WEBHOOK_SECRET = process.env.BEPAID_WEBHOOK_SECRET!

export interface CreateCheckoutParams {
  orderId: string
  amount: number // in kopecks
  currency?: string
  description: string
  email?: string
  telegramId: string
  returnUrl: string
  notifyUrl: string
  recurring?: boolean
}

export interface CheckoutResponse {
  checkout: {
    redirect_url: string
    token: string
  }
}

export interface WebhookPayload {
  transaction: {
    uid: string
    status: "successful" | "failed" | "pending" | "expired"
    type: string
    amount: number
    currency: string
    description: string
    tracking_id: string
    payment: {
      ref_id: string
      token?: string
    }
    customer: {
      email?: string
    }
  }
}

// Create a checkout session for Hosted Payment Page
export async function createCheckout(params: CreateCheckoutParams): Promise<CheckoutResponse> {
  const payload = {
    checkout: {
      test: process.env.NODE_ENV !== "production",
      transaction_type: "payment",
      attempts: 3,
      settings: {
        return_url: params.returnUrl,
        notification_url: params.notifyUrl,
        language: "ru",
        customer_fields: {
          read_only: ["email"],
        },
      },
      order: {
        amount: params.amount,
        currency: params.currency || "BYN",
        description: params.description,
        tracking_id: params.orderId,
        additional_data: {
          receipt: [],
        },
      },
      customer: {
        email: params.email || `user_${params.telegramId}@telegram.local`,
      },
      ...(params.recurring && {
        recurring: true,
      }),
    },
  }

  const auth = Buffer.from(`${BEPAID_SHOP_ID}:${BEPAID_SECRET_KEY}`).toString("base64")

  const response = await fetch(BEPAID_HPP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`bePaid API error: ${response.status} - ${error}`)
  }

  return response.json()
}

// Charge using saved payment token (for recurring payments)
export async function chargeRecurring(params: {
  paymentToken: string
  orderId: string
  amount: number
  currency?: string
  description: string
}): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  const payload = {
    request: {
      amount: params.amount,
      currency: params.currency || "BYN",
      description: params.description,
      tracking_id: params.orderId,
      credit_card: {
        token: params.paymentToken,
      },
    },
  }

  const auth = Buffer.from(`${BEPAID_SHOP_ID}:${BEPAID_SECRET_KEY}`).toString("base64")

  try {
    const response = await fetch("https://gateway.bepaid.by/transactions/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (data.transaction?.status === "successful") {
      return {
        success: true,
        transactionId: data.transaction.uid,
      }
    }

    return {
      success: false,
      error: data.transaction?.message || "Payment failed",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Verify webhook signature
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto.createHmac("sha256", BEPAID_WEBHOOK_SECRET).update(payload).digest("hex")

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}

// Parse and validate webhook payload
export function parseWebhookPayload(body: string): WebhookPayload | null {
  try {
    return JSON.parse(body)
  } catch {
    return null
  }
}

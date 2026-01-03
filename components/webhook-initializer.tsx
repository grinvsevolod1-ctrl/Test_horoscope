"use client"

import { useEffect, useState } from "react"

export function WebhookInitializer() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Only run once on client mount
    if (initialized) return

    const initWebhook = async () => {
      try {
        // Call init endpoint in background
        await fetch("/api/init", {
          method: "GET",
          cache: "no-store",
        })
        setInitialized(true)
        console.log("[v0] Webhook initialized")
      } catch (error) {
        console.error("[v0] Webhook init failed:", error)
      }
    }

    // Delay slightly to not block page render
    const timer = setTimeout(initWebhook, 1000)
    return () => clearTimeout(timer)
  }, [initialized])

  // This component renders nothing
  return null
}

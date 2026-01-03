"use client"

import { useEffect, useState, useRef } from "react"

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  delay: number
  duration: number
}

export function CosmicBackground() {
  const [stars, setStars] = useState<Star[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Generate stars
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    }))
    setStars(newStars)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-[oklch(0.06_0.03_280)]" />

      {/* Cosmic nebula effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[oklch(0.3_0.15_280/0.15)] rounded-full blur-[120px] animate-float-slow" />
      <div
        className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[oklch(0.4_0.15_200/0.1)] rounded-full blur-[100px] animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[oklch(0.35_0.15_320/0.08)] rounded-full blur-[80px] animate-float-slow"
        style={{ animationDelay: "4s" }}
      />

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Shooting star effect - occasional */}
      <div
        className="absolute top-20 right-10 w-1 h-1 bg-white rounded-full opacity-0 animate-[shooting_8s_ease-in-out_infinite]"
        style={{
          boxShadow: "0 0 6px 2px rgba(255,255,255,0.6)",
          animationDelay: "3s",
        }}
      />
    </div>
  )
}

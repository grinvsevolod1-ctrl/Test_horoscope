"use client"

interface Planet3DProps {
  size?: number
  color?: string
  ringColor?: string
  hasRing?: boolean
  glowColor?: string
  className?: string
}

export function Planet3D({
  size = 200,
  color = "#6B73FF",
  ringColor = "#B4A0FF",
  hasRing = false,
  glowColor = "oklch(0.7 0.18 200 / 0.5)",
  className = "",
}: Planet3DProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl animate-pulse-glow"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          transform: "scale(1.5)",
        }}
      />

      {/* Planet body */}
      <div
        className="absolute inset-0 rounded-full animate-spin-slow"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, ${color}ee 0%, ${color}88 50%, ${color}44 100%)
          `,
          boxShadow: `
            inset -20px -20px 40px rgba(0,0,0,0.6),
            inset 10px 10px 30px rgba(255,255,255,0.1),
            0 0 60px ${glowColor}
          `,
        }}
      />

      {/* Surface texture overlay */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.03) 10px,
              rgba(255,255,255,0.03) 20px
            )
          `,
        }}
      />

      {/* Ring (if enabled) */}
      {hasRing && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: size * 1.8,
            height: size * 0.4,
            border: `3px solid ${ringColor}`,
            borderRadius: "50%",
            transform: "translate(-50%, -50%) rotateX(75deg)",
            opacity: 0.7,
            boxShadow: `0 0 20px ${ringColor}40`,
          }}
        />
      )}
    </div>
  )
}

export function Moon3D({ size = 60, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `
            radial-gradient(circle at 35% 35%, #E8E8E8 0%, #B8B8B8 40%, #888888 100%)
          `,
          boxShadow: `
            inset -8px -8px 20px rgba(0,0,0,0.5),
            inset 4px 4px 15px rgba(255,255,255,0.3),
            0 0 30px oklch(0.8 0.05 270 / 0.3)
          `,
        }}
      />
      {/* Moon craters */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-gray-500/30" />
      <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-gray-500/20" />
      <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-gray-500/25" />
    </div>
  )
}

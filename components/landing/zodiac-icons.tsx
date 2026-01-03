"use client"

export const ZodiacIcons = {
  aries: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M4 21c0-8 4-14 8-14s8 6 8 14" />
      <path d="M12 7V3" />
    </svg>
  ),
  taurus: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <circle cx="12" cy="16" r="6" />
      <path d="M4 6c0 2 2 4 4 4h8c2 0 4-2 4-4" />
    </svg>
  ),
  gemini: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M6 3h12M6 21h12" />
      <path d="M8 3v18M16 3v18" />
    </svg>
  ),
  cancer: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="15" r="3" />
      <path d="M5 9c0 4 3 6 6 6M19 15c0-4-3-6-6-6" />
    </svg>
  ),
  leo: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <circle cx="10" cy="10" r="6" />
      <path d="M16 10c2 0 4 2 4 4s-2 4-4 4" />
      <path d="M16 14c0 4 2 6 2 6" />
    </svg>
  ),
  virgo: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M5 5v14M10 5v14M15 5v8c0 3 2 5 4 6" />
      <path d="M5 12h10" />
    </svg>
  ),
  libra: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M4 20h16" />
      <path d="M4 14c0-4 4-7 8-7s8 3 8 7" />
      <path d="M12 7V4" />
    </svg>
  ),
  scorpio: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M5 5v10c0 2 2 4 4 4h0c2 0 4-2 4-4V5" />
      <path d="M13 5v10c0 2 2 4 4 4l2-2" />
      <path d="M19 19l-2 2" />
    </svg>
  ),
  sagittarius: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M5 19L19 5" />
      <path d="M19 5h-6M19 5v6" />
      <path d="M9 15l-4 4" />
    </svg>
  ),
  capricorn: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M5 10c0-3 2-5 5-5s5 2 5 5v5c0 2 1 4 4 4" />
      <circle cx="19" cy="19" r="2" />
      <path d="M10 15v5" />
    </svg>
  ),
  aquarius: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M4 10l3-3 3 3 3-3 3 3 3-3 3 3" />
      <path d="M4 17l3-3 3 3 3-3 3 3 3-3 3 3" />
    </svg>
  ),
  pisces: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M5 5c3 4 3 10 0 14" />
      <path d="M19 5c-3 4-3 10 0 14" />
      <path d="M5 12h14" />
    </svg>
  ),
}

export type ZodiacSign = keyof typeof ZodiacIcons

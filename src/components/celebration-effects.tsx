"use client"

import { useEffect, useState } from "react"

interface CelebrationEffectsProps {
  trigger: boolean
  type?: "confetti" | "fireworks" | "sparkles"
  onComplete?: () => void
}

export function CelebrationEffects({ trigger, type = "confetti", onComplete }: CelebrationEffectsProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])

  useEffect(() => {
    if (trigger) {
      createCelebration()
      if (typeof window !== "undefined" && (window as any).playWinSound) {
        ;(window as any).playWinSound()
      }
    }
  }, [trigger])

  const createCelebration = () => {
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff"]
    const newParticles = []

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    setParticles(newParticles)

    // Clean up after animation
    setTimeout(() => {
      setParticles([])
      onComplete?.()
    }, 3000)
  }

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="celebration-confetti animate-confetti"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  )
}

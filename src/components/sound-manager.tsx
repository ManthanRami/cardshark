"use client"

import { useEffect, useRef } from "react"

interface SoundManagerProps {
  enabled?: boolean
}

export function SoundManager({ enabled = true }: SoundManagerProps) {
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (enabled && typeof window !== "undefined") {
      // Initialize Web Audio API
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (error) {
        console.warn("Web Audio API not supported")
      }
    }
  }, [enabled])

  const playSound = (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.1) => {
    if (!enabled || !audioContextRef.current) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
      oscillator.type = type

      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration)

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + duration)
    } catch (error) {
      console.warn("Error playing sound:", error)
    }
  }

  // Expose sound functions globally
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).playSuccessSound = () => {
        playSound(523.25, 0.2) // C5
        setTimeout(() => playSound(659.25, 0.2), 100) // E5
        setTimeout(() => playSound(783.99, 0.3), 200) // G5
      }
      ;(window as any).playErrorSound = () => {
        playSound(220, 0.3, "sawtooth", 0.05) // A3
      }
      ;(window as any).playClickSound = () => {
        playSound(800, 0.1, "square", 0.03)
      }
      ;(window as any).playWinSound = () => {
        const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5] // C major scale
        notes.forEach((note, index) => {
          setTimeout(() => playSound(note, 0.3), index * 100)
        })
      }
      ;(window as any).playMoonSound = () => {
        playSound(440, 0.2) // A4
        setTimeout(() => playSound(554.37, 0.2), 150) // C#5
        setTimeout(() => playSound(659.25, 0.2), 300) // E5
        setTimeout(() => playSound(880, 0.4), 450) // A5
      }
    }
  }, [enabled])

  return null
}

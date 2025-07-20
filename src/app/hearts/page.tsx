"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { HeartsSetup } from "@/components/hearts/hearts-setup"
import { HeartsScoreboard } from "@/components/hearts/hearts-scoreboard"
import { AdBanner } from "@/components/ad-banner"
import { ArrowLeft, RotateCcw, Heart } from "lucide-react"
import type { HeartsGameState } from "@/types/hearts"

export default function HeartsPage() {
  const [gameState, setGameState] = useState<HeartsGameState | null>(null)

  // Load saved game on mount
  useEffect(() => {
    const saved = localStorage.getItem("hearts-game")
    if (saved) {
      try {
        setGameState(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load saved game:", error)
      }
    }
  }, [])

  // Save game state whenever it changes
  useEffect(() => {
    if (gameState) {
      localStorage.setItem("hearts-game", JSON.stringify(gameState))
    }
  }, [])

  const handleGameStart = (newGameState: HeartsGameState) => {
    setGameState(newGameState)
  }

  const handleGameUpdate = (updatedGameState: HeartsGameState) => {
    setGameState(updatedGameState)
  }

  const handleNewGame = () => {
    localStorage.removeItem("hearts-game")
    setGameState(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950/20 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.3),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <Link href="/" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Hub</span>
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Hearts Scoreboard</h1>
                  <p className="text-sm text-slate-400">Avoid hearts and the Queen of Spades</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {gameState && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewGame}
                  className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        {!gameState ? (
          <HeartsSetup onGameStart={handleGameStart} />
        ) : (
          <HeartsScoreboard gameState={gameState} onGameUpdate={handleGameUpdate} />
        )}

        {/* Ad Banner */}
        {gameState && (
          <div className="mt-8">
            <AdBanner />
          </div>
        )}
      </main>
    </div>
  )
}

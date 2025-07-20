"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { KachufulSetup } from "@/components/kachuful/kachuful-setup"
import { KachufulScoreboard } from "@/components/kachuful/kachuful-scoreboard"
import { AdBanner } from "@/components/ad-banner"
import { ArrowLeft, RotateCcw, Spade } from "lucide-react"
import type { KachufulGameState } from "@/types/kachuful"

export default function KachufulPage() {
  const [gameState, setGameState] = useState<KachufulGameState | null>(null)

  // Load saved game on mount
  useEffect(() => {
    const saved = localStorage.getItem("kachuful-game")
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
      localStorage.setItem("kachuful-game", JSON.stringify(gameState))
    }
  }, [gameState])

  const handleGameStart = (newGameState: KachufulGameState) => {
    setGameState(newGameState)
  }

  const handleGameUpdate = (updatedGameState: KachufulGameState) => {
    setGameState(updatedGameState)
  }

  const handleNewGame = () => {
    localStorage.removeItem("kachuful-game")
    setGameState(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(106,90,205,0.3),transparent_50%)]" />
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
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
                  <Spade className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Kachuful Scoreboard</h1>
                  <p className="text-sm text-slate-400">Strategic bidding with trump suits</p>
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
          <KachufulSetup onGameStart={handleGameStart} />
        ) : (
          <KachufulScoreboard gameState={gameState} onGameUpdate={handleGameUpdate} />
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

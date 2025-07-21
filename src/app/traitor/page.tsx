"use client"

import { useState } from "react"
import { TraitorSetup } from "@/components/traitor/traitor-setup"
import { RoleReveal } from "@/components/traitor/role-reveal"
import { TraitorScoreboard } from "@/components/traitor/traitor-scoreboard"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdBanner } from "@/components/ad-banner"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Ghost } from "lucide-react"
import { useRouter } from "next/navigation"
import type { TraitorGameState } from "@/types/traitor"
import Link from "next/link"

export default function TraitorPage() {
  const router = useRouter()
  const [gameState, setGameState] = useState<TraitorGameState | null>(null)
  const [currentPhase, setCurrentPhase] = useState<"setup" | "roleReveal" | "game">("setup")
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)

  const handleGameStart = (state: TraitorGameState) => {
    setGameState(state)
    setCurrentPhase("roleReveal")
    setCurrentPlayerIndex(0)
  }

  const handleNextPlayer = () => {
    if (!gameState) return

    if (currentPlayerIndex < gameState.players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1)
    } else {
      setCurrentPhase("game")
    }
  }

  const handleGameUpdate = (state: TraitorGameState) => {
    setGameState(state)
  }

  const handleNewGame = () => {
    setGameState(null)
    setCurrentPhase("setup")
    setCurrentPlayerIndex(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-900 text-white">
      {currentPhase !== "roleReveal" && (
        <>
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
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-700 to-indigo-900 rounded-xl flex items-center justify-center">
                      <Ghost className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">Traitor Scoreboard</h1>
                      <p className="text-sm text-slate-400">Find the traitors among you</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {currentPhase === "game" && (
                    <Button
                      onClick={handleNewGame}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    >
                      New Game
                    </Button>
                  )}
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>

          <main className="relative z-10 container mx-auto px-6 py-8">
            {currentPhase === "setup" ? (
              <TraitorSetup onGameStart={handleGameStart} />
            ) : (
              gameState && (
                <TraitorScoreboard
                  gameState={gameState}
                  onGameUpdate={handleGameUpdate}
                  onNewGame={handleNewGame}
                />
              )
            )}

            <AdBanner className="mt-8" />
          </main>
        </>
      )}

      {currentPhase === "roleReveal" && gameState && (
        <RoleReveal
          player={gameState.players[currentPlayerIndex]}
          playerIndex={currentPlayerIndex}
          totalPlayers={gameState.players.length}
          onNext={handleNextPlayer}
        />
      )}
    </div>
  )
}

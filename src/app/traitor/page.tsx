"use client"

import { useState } from "react"
import { TraitorSetup } from "@/components/traitor/traitor-setup"
import { RoleReveal } from "@/components/traitor/role-reveal"
import { TraitorScoreboard } from "@/components/traitor/traitor-scoreboard"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdBanner } from "@/components/ad-banner"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import type { TraitorGameState } from "@/types/traitor"

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-slate-900 dark:to-slate-800">
      {currentPhase !== "roleReveal" && (
        <div className="container mx-auto px-4 py-8">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.push("/")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Traitor Scoreboard</h1>
                <p className="text-slate-600 dark:text-slate-400">Find the traitors among you</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentPhase === "game" && (
                <Button onClick={handleNewGame} variant="outline">
                  New Game
                </Button>
              )}
              <ThemeToggle />
            </div>
          </header>

          {currentPhase === "setup" ? (
            <TraitorSetup onGameStart={handleGameStart} />
          ) : (
            gameState && (
              <TraitorScoreboard gameState={gameState} onGameUpdate={handleGameUpdate} onNewGame={handleNewGame} />
            )
          )}

          <AdBanner className="mt-8" />
        </div>
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

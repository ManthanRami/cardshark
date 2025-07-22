
"use client"

import { useState, useEffect } from "react"
import { KachufulSetup } from "@/components/kachuful/kachuful-setup"
import { KachufulScoreboard } from "@/components/kachuful-scoreboard"
import { Spade } from "lucide-react"
import type { KachufulGameState } from "@/types/kachuful"
import { saveKachufulGame, loadKachufulGame } from "@/lib/storage"
import { GamePageLayout } from "@/components/game-page-layout"

export default function KachufulJudgmentPage() {
  const [gameState, setGameState] = useState<KachufulGameState | null>(null)
  const gameId = "kachuful-judgment-game" // Keep this for potential multi-game support

  useEffect(() => {
    setGameState(loadKachufulGame())
  }, [])

  useEffect(() => {
    if (gameState) {
      saveKachufulGame(gameState)
    }
  }, [gameState])

  const handleGameStart = (newGameState: KachufulGameState) => {
    setGameState(newGameState)
  }

  const handleGameUpdate = (updatedGameState: KachufulGameState) => {
    setGameState(updatedGameState)
  }

  const handleNewGame = () => {
    localStorage.removeItem(gameId) // This should be "kachuful-game" to match storage key
    localStorage.removeItem("kachuful-game")
    setGameState(null)
  }

  return (
    <GamePageLayout
      gameTitle="Kachuful / Judgment"
      gameDescription="Strategic bidding game"
      gameIcon={<Spade className="w-5 h-5 text-white" />}
      onNewGame={handleNewGame}
      isGameActive={!!gameState}
      showNewGameButton={!!gameState}
    >
      {!gameState ? (
        <KachufulSetup onGameStart={handleGameStart} />
      ) : (
        <KachufulScoreboard gameState={gameState} onGameUpdate={handleGameUpdate} />
      )}
    </GamePageLayout>
  )
}


"use client"

import { useState, useEffect } from "react"
import { HeartsSetup } from "@/components/hearts/hearts-setup"
import { HeartsScoreboard } from "@/components/hearts/hearts-scoreboard"
import { Heart } from "lucide-react"
import type { HeartsGameState } from "@/types/hearts"
import { GamePageLayout } from "@/components/game-page-layout"
import { saveHeartsGame, loadHeartsGame } from "@/lib/storage"

export default function HeartsPage() {
  const [gameState, setGameState] = useState<HeartsGameState | null>(null)

  useEffect(() => {
    setGameState(loadHeartsGame())
  }, [])

  useEffect(() => {
    if (gameState) {
      saveHeartsGame(gameState)
    }
  }, [gameState])

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
    <GamePageLayout
      gameTitle="Hearts Scoreboard"
      gameDescription="Avoid hearts and the Queen of Spades"
      gameIcon={<Heart className="w-5 h-5 text-white" />}
      onNewGame={handleNewGame}
      isGameActive={!!gameState}
      showNewGameButton={!!gameState}
    >
      {!gameState ? (
        <HeartsSetup onGameStart={handleGameStart} />
      ) : (
        <HeartsScoreboard gameState={gameState} onGameUpdate={handleGameUpdate} />
      )}
    </GamePageLayout>
  )
}

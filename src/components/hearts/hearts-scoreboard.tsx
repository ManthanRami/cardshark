"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Heart, Trophy, Target, Crown, Moon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { HeartsGameState, HeartsRound } from "@/types/hearts"

interface HeartsScoreboardProps {
  gameState: HeartsGameState
  onGameUpdate: (gameState: HeartsGameState) => void
}

export function HeartsScoreboard({ gameState, onGameUpdate }: HeartsScoreboardProps) {
  const [currentRoundData, setCurrentRoundData] = useState<{
    scores: { [playerIndex: number]: number }
    moonShooter: number | null
  }>({
    scores: {},
    moonShooter: null,
  })

  const maxRoundPoints = gameState.deckCount * 26

  const updateScore = (playerIndex: number, score: number) => {
    setCurrentRoundData((prev) => ({
      ...prev,
      scores: { ...prev.scores, [playerIndex]: score },
    }))
  }

  const setMoonShooter = (playerIndex: number | null) => {
    setCurrentRoundData((prev) => ({
      ...prev,
      moonShooter: playerIndex,
      scores: {}, // Clear manual scores when moon shooting
    }))
  }

  const addRound = () => {
    let finalScores = { ...currentRoundData.scores }

    // Handle shooting the moon
    if (currentRoundData.moonShooter !== null) {
      finalScores = {}
      gameState.players.forEach((_, index) => {
        if (index === currentRoundData.moonShooter) {
          finalScores[index] = 0
        } else {
          finalScores[index] = maxRoundPoints
        }
      })
    }

    const newRound: HeartsRound = {
      roundNumber: gameState.rounds.length + 1,
      playerScores: gameState.players.map((_, index) => finalScores[index] || 0),
      moonShooter: currentRoundData.moonShooter,
    }

    const updatedPlayers = gameState.players.map((player, index) => ({
      ...player,
      totalScore: player.totalScore + (finalScores[index] || 0),
      rounds: [...player.rounds, finalScores[index] || 0],
    }))

    // Check for game end
    const gameEnded = updatedPlayers.some((player) => player.totalScore >= gameState.maxPoints)
    const winner = gameEnded
      ? updatedPlayers.reduce((min, player) => (player.totalScore < min.totalScore ? player : min))
      : null

    const updatedGameState: HeartsGameState = {
      ...gameState,
      players: updatedPlayers,
      rounds: [...gameState.rounds, newRound],
      currentRound: gameState.currentRound + 1,
      gameEnded,
      winner,
    }

    onGameUpdate(updatedGameState)
    setCurrentRoundData({ scores: {}, moonShooter: null })
  }

  const canAddRound =
    currentRoundData.moonShooter !== null || Object.keys(currentRoundData.scores).length === gameState.players.length

  if (gameState.gameEnded && gameState.winner) {
    return (
      <div className="text-center space-y-8 max-w-4xl mx-auto animate-fade-in-scale">
        <Card className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border-yellow-500/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-yellow-400 animate-pulse-glow" />
              <span className="text-3xl font-bold text-yellow-400">Game Complete!</span>
              <Crown className="h-6 w-6 text-yellow-400" />
            </div>
            <p className="text-xl text-yellow-200">
              <strong>{gameState.winner.name}</strong> wins with {gameState.winner.totalScore} points!
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-center">Final Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...gameState.players]
                .sort((a, b) => a.totalScore - b.totalScore)
                .map((player, index) => (
                  <Card
                    key={player.name}
                    className={`${index === 0 ? "bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border-yellow-500/30" : "bg-slate-700/30 border-slate-600/50"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          {index === 0 && <Trophy className="h-5 w-5 text-yellow-400" />}
                          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium text-white">{player.name}</span>
                        </div>
                        <Badge
                          variant={index === 0 ? "default" : "secondary"}
                          className={`${index === 0 ? "bg-yellow-500 text-black" : "bg-slate-600 text-white"} px-3 py-1`}
                        >
                          {player.totalScore} pts
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-slide-in-up">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Round {gameState.currentRound}</CardTitle>
              <p className="text-slate-400">
                Playing with {gameState.deckCount} deck{gameState.deckCount > 1 ? "s" : ""} • Max {maxRoundPoints}{" "}
                points per round
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Card className="bg-purple-950/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Moon className="h-5 w-5 text-purple-400" />
                <div className="flex-1">
                  <span className="font-medium text-purple-200">Moon Shooter:</span>
                  <p className="text-sm text-purple-300">Select if someone shot the moon this round</p>
                </div>
                <Select
                  value={currentRoundData.moonShooter?.toString() || "none"}
                  onValueChange={(value) => setMoonShooter(value === "none" ? null : Number.parseInt(value))}
                >
                  <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="none" className="text-white hover:bg-slate-700">
                      No one shot the moon
                    </SelectItem>
                    {gameState.players.map((player, index) => (
                      <SelectItem key={index} value={index.toString()} className="text-white hover:bg-slate-700">
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {currentRoundData.moonShooter !== null ? (
            <Alert className="border-purple-500/20 bg-purple-950/20">
              <Moon className="h-5 w-5 text-purple-400" />
              <AlertDescription className="text-purple-200">
                <strong>{gameState.players[currentRoundData.moonShooter].name}</strong> shot the moon! They get 0
                points, everyone else gets {maxRoundPoints} points.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {gameState.players.map((player, index) => (
                <Card
                  key={index}
                  className="bg-slate-700/30 border-slate-600/50 animate-slide-in-left"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-white">{player.name}</span>
                        <p className="text-sm text-slate-400">Enter points for this round</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-400" />
                          <Input
                            type="number"
                            min="0"
                            max={maxRoundPoints}
                            value={currentRoundData.scores[index] || ""}
                            onChange={(e) => updateScore(index, Number.parseInt(e.target.value) || 0)}
                            className="w-20 text-center bg-slate-600/50 border-slate-500 text-white"
                            placeholder="0"
                          />
                          <span className="text-sm text-slate-400">/ {maxRoundPoints}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400">Total:</span>
                          <Badge
                            className={`${player.totalScore >= gameState.maxPoints ? "bg-red-600" : "bg-green-600"} text-white px-3 py-1`}
                          >
                            {player.totalScore}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button
            onClick={addRound}
            disabled={!canAddRound}
            className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Round
          </Button>
        </CardContent>
      </Card>

      {gameState.rounds.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Score History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="scoreboard-table w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-3 font-medium text-slate-300 bg-slate-800/50">Player</th>
                    {gameState.rounds.map((round, index) => (
                      <th key={index} className="text-center p-3 text-slate-300 bg-slate-800/50">
                        <div className="flex flex-col items-center gap-1">
                          <span>R{round.roundNumber}</span>
                          {round.moonShooter !== null && <Moon className="h-3 w-3 text-purple-400" />}
                        </div>
                      </th>
                    ))}
                    <th className="text-center p-3 font-medium text-slate-300 bg-slate-800/50">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {gameState.players.map((player, playerIndex) => (
                    <tr key={playerIndex} className="border-b border-slate-700/50">
                      <td className="p-3 bg-slate-800/50">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {playerIndex + 1}
                          </div>
                          <span className="font-medium text-white">{player.name}</span>
                        </div>
                      </td>
                      {gameState.rounds.map((round, roundIndex) => (
                        <td key={roundIndex} className="text-center p-3">
                          <Badge
                            className={`${round.playerScores[playerIndex] === 0 ? "bg-green-600" : "bg-red-600"} text-white text-xs`}
                          >
                            {round.playerScores[playerIndex]}
                          </Badge>
                        </td>
                      ))}
                      <td className="text-center p-3 bg-slate-800/50">
                        <Badge
                          className={`${player.totalScore >= gameState.maxPoints ? "bg-red-600" : "bg-green-600"} text-white font-medium`}
                        >
                          {player.totalScore}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

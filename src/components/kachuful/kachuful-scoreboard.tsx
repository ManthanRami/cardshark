
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Spade, Heart, Diamond, Club, Trophy, Target, Crown } from "lucide-react"
import type { KachufulGameState, KachufulRound, KachufulPlayerRound } from "@/types/kachuful"
import { RaceToVictoryChart } from "./race-to-victory-chart"

interface KachufulScoreboardProps {
  gameState: KachufulGameState
  onGameUpdate: (gameState: KachufulGameState) => void
}

const TRUMP_SUITS = [
  { value: "spades", label: "Spades", icon: Spade, color: "text-slate-400" },
  { value: "diamonds", label: "Diamonds", icon: Diamond, color: "text-red-400" },
  { value: "clubs", label: "Clubs", icon: Club, color: "text-slate-400" },
  { value: "hearts", label: "Hearts", icon: Heart, color: "text-red-400" },
] as const

export function KachufulScoreboard({ gameState, onGameUpdate }: KachufulScoreboardProps) {
  const [currentRoundData, setCurrentRoundData] = useState<{
    bids: { [playerIndex: number]: number | string }
    tricks: { [playerIndex: number]: number | string }
  }>({
    bids: {},
    tricks: {},
  })

  const maxCards = Math.floor((52 * gameState.deckCount) / gameState.players.length)

  const getCurrentRoundCards = (roundNumber: number) => {
    if (roundNumber <= maxCards) {
      return roundNumber
    } else {
      return maxCards - (roundNumber - maxCards)
    }
  }

  const getCurrentTrumpSuit = (roundNumber: number) => {
    const suitIndex = (roundNumber - 1) % 4
    return TRUMP_SUITS[suitIndex].value
  }

  const currentCards = getCurrentRoundCards(gameState.currentRound)
  const currentTrump = getCurrentTrumpSuit(gameState.currentRound)
  const currentTrumpSuit = TRUMP_SUITS.find((suit) => suit.value === currentTrump)!

  const updateBid = (playerIndex: number, bid: string) => {
    setCurrentRoundData((prev) => ({
      ...prev,
      bids: { ...prev.bids, [playerIndex]: bid },
    }))
  }

  const updateTricks = (playerIndex: number, tricks: string) => {
    setCurrentRoundData((prev) => ({
      ...prev,
      tricks: { ...prev.tricks, [playerIndex]: tricks },
    }))
  }

  const addRound = () => {
    const playerScores: KachufulPlayerRound[] = gameState.players.map((_, index) => {
      const bid = Number(currentRoundData.bids[index]) || 0
      const tricks = Number(currentRoundData.tricks[index]) || 0
      const score = bid === tricks ? 10 + bid : 0
      return { bid, tricks, score }
    })

    const newRound: KachufulRound = {
      roundNumber: gameState.currentRound,
      cards: currentCards,
      trumpSuit: currentTrump as any,
      playerScores,
    }

    const updatedPlayers = gameState.players.map((player, index) => ({
      ...player,
      totalScore: player.totalScore + playerScores[index].score,
      rounds: [...player.rounds, playerScores[index]],
    }))

    const gameEnded = gameState.currentRound >= gameState.maxRounds
    const winner = gameEnded
      ? updatedPlayers.reduce((max, player) => (player.totalScore > max.totalScore ? player : max))
      : undefined

    const updatedGameState: KachufulGameState = {
      ...gameState,
      players: updatedPlayers,
      rounds: [...gameState.rounds, newRound],
      currentRound: gameState.currentRound + 1,
      gameEnded,
      winner,
    }

    onGameUpdate(updatedGameState)
    setCurrentRoundData({ bids: {}, tricks: {} })
  }

  const canAddRound =
    Object.values(currentRoundData.bids).length === gameState.players.length &&
    Object.values(currentRoundData.tricks).length === gameState.players.length &&
    Object.values(currentRoundData.bids).every((bid) => bid !== "" && !isNaN(Number(bid))) &&
    Object.values(currentRoundData.tricks).every((trick) => trick !== "" && !isNaN(Number(trick)))

  const chartData = useMemo(() => {
    return gameState.players.map((player) => ({
      name: player.name,
      score: player.totalScore,
    }))
  }, [gameState.players])

  if (gameState.gameEnded && gameState.winner) {
    return (
      <div className="text-center space-y-8 max-w-4xl mx-auto animate-fade-in-scale">
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-purple-400 animate-pulse-glow" />
              <span className="text-3xl font-bold text-purple-400">Game Complete!</span>
              <Crown className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-xl text-purple-200">
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
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((player, index) => (
                  <Card
                    key={player.name}
                    className={`${index === 0 ? "bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30" : "bg-slate-700/30 border-slate-600/50"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          {index === 0 && <Trophy className="h-5 w-5 text-purple-400" />}
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium text-white">{player.name}</span>
                        </div>
                        <Badge
                          variant={index === 0 ? "default" : "secondary"}
                          className={`${index === 0 ? "bg-purple-500 text-white" : "bg-slate-600 text-white"} px-3 py-1`}
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
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                Round {gameState.currentRound} of {gameState.maxRounds}
              </CardTitle>
              <p className="text-slate-400">
                {currentCards} cards • Trump:{" "}
                <currentTrumpSuit.icon className={`inline w-4 h-4 ${currentTrumpSuit.color}`} />{" "}
                {currentTrumpSuit.label}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {gameState.players.map((player, index) => (
              <Card
                key={index}
                className="bg-slate-700/30 border-slate-600/50 animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-white">{player.name}</span>
                      <p className="text-sm text-slate-400">Enter bid and tricks taken</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Bid:</span>
                        <Input
                          type="number"
                          min="0"
                          max={currentCards}
                          value={currentRoundData.bids[index] ?? ""}
                          onChange={(e) => updateBid(index, e.target.value)}
                          className="w-16 text-center bg-slate-600/50 border-slate-500 text-white"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Tricks:</span>
                        <Input
                          type="number"
                          min="0"
                          max={currentCards}
                          value={currentRoundData.tricks[index] ?? ""}
                          onChange={(e) => updateTricks(index, e.target.value)}
                          className="w-16 text-center bg-slate-600/50 border-slate-500 text-white"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Total:</span>
                        <Badge className="bg-purple-600 text-white px-3 py-1">{player.totalScore}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={addRound}
            disabled={!canAddRound}
            className="w-full bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Round
          </Button>
        </CardContent>
      </Card>

      {gameState.rounds.length > 0 && (
        <>
          <RaceToVictoryChart data={chartData} />

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
                            <div className="flex items-center gap-1">
                              <span className="text-xs">{round.cards}</span>
                              {(() => {
                                const suit = TRUMP_SUITS.find((s) => s.value === round.trumpSuit)
                                if (!suit) return null
                                const Icon = suit.icon
                                return <Icon className={`h-3 w-3 ${suit.color}`} />
                              })()}
                            </div>
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
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {playerIndex + 1}
                            </div>
                            <span className="font-medium text-white">{player.name}</span>
                          </div>
                        </td>
                        {gameState.rounds.map((round, roundIndex) => (
                          <td key={roundIndex} className="text-center p-3">
                            <div className="flex flex-col items-center gap-1">
                              <Badge
                                className={`${round.playerScores[playerIndex].score > 0 ? "bg-green-600" : "bg-slate-600"} text-white text-xs`}
                              >
                                {round.playerScores[playerIndex].score}
                              </Badge>
                              <span className="text-xs text-slate-400">
                                {round.playerScores[playerIndex].bid}/{round.playerScores[playerIndex].tricks}
                              </span>
                            </div>
                          </td>
                        ))}
                        <td className="text-center p-3 bg-slate-800/50">
                          <Badge className="bg-purple-600 text-white font-medium">{player.totalScore}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

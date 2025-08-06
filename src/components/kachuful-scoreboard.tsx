
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Spade, Diamond, Club, Heart, Trophy, Crown, Pencil, Save } from "lucide-react"
import { CelebrationEffects } from "@/components/celebration-effects"
import type { KachufulGameState, KachufulRound, KachufulPlayerRound, TrumpSuit } from "@/types/kachuful"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface KachufulScoreboardProps {
  gameState: KachufulGameState
  onGameUpdate: (gameState: KachufulGameState) => void
}

const TRUMP_SUITS_ORDER: TrumpSuit[] = ["spades", "diamonds", "clubs", "hearts"]

const TrumpIcon = ({ suit }: { suit: TrumpSuit }) => {
  const iconProps = { className: "w-4 h-4" }
  switch (suit) {
    case "spades":
      return <Spade {...iconProps} />
    case "diamonds":
      return <Diamond {...iconProps} />
    case "clubs":
      return <Club {...iconProps} />
    case "hearts":
      return <Heart {...iconProps} />
  }
}

const calculateCardsForRound = (round: number, maxCards: number) => {
  if (round <= maxCards) {
    return round
  }
  return maxCards - (round - maxCards)
}

const calculateScore = (
  bid: number,
  tricks: number,
  zeroBidPoints: number,
  negativePointsEnabled: boolean,
): number => {
  if (bid === tricks) {
    return bid === 0 ? zeroBidPoints : 10 + bid
  }
  if (negativePointsEnabled) {
    if (bid > 0 && bid === 1 && tricks === 0) return -11
    if (bid === 0 && tricks > 0) return -zeroBidPoints
  }
  return 0
}

export function KachufulScoreboard({ gameState, onGameUpdate }: KachufulScoreboardProps) {
  const [currentRoundData, setCurrentRoundData] = useState<{
    [playerIndex: string]: { bid: string; tricks: string }
  }>(gameState.players.reduce((acc, _, index) => ({ ...acc, [index]: { bid: "0", tricks: "0" } }), {}))
  const [showCelebration, setShowCelebration] = useState(false)
  const [editingRound, setEditingRound] = useState<KachufulRound | null>(null)
  const [editedScores, setEditedScores] = useState<{ [playerIndex: string]: { bid: string; tricks: string } } | null>(
    null,
  )

  const maxCards = Math.floor((52 * gameState.deckCount) / gameState.players.length)
  const currentCards = calculateCardsForRound(gameState.currentRound, maxCards)
  const currentTrump = TRUMP_SUITS_ORDER[(gameState.currentRound - 1) % TRUMP_SUITS_ORDER.length]

  const updateRoundData = (playerIndex: number, field: "bid" | "tricks", value: string) => {
    if (value !== "" && !/^\d+$/.test(value)) {
      return
    }
    setCurrentRoundData((prev) => ({
      ...prev,
      [playerIndex]: {
        ...prev[playerIndex],
        [field]: value,
      },
    }))
  }

  const canAddRound = gameState.players.every((_, index) => {
    const data = currentRoundData[index]
    return data && data.bid !== "" && data.tricks !== ""
  })

  const addRound = () => {
    if (!canAddRound) return

    const newPlayerScores: KachufulPlayerRound[] = gameState.players.map((_, index) => {
      const bid = parseInt(currentRoundData[index].bid) || 0
      const tricks = parseInt(currentRoundData[index].tricks) || 0
      const score = calculateScore(bid, tricks, gameState.zeroBidPoints, gameState.negativePointsEnabled)
      return { bid, tricks, score }
    })

    const newRound: KachufulRound = {
      roundNumber: gameState.currentRound,
      cards: currentCards,
      trumpSuit: currentTrump,
      playerScores: newPlayerScores,
    }

    const updatedPlayers = gameState.players.map((player, index) => ({
      ...player,
      totalScore: player.totalScore + newPlayerScores[index].score,
      rounds: [...player.rounds, newPlayerScores[index]],
    }))

    const gameEnded = gameState.currentRound >= gameState.maxRounds
    const winner = gameEnded ? updatedPlayers.reduce((max, p) => (p.totalScore > max.totalScore ? p : max)) : undefined

    const updatedGameState: KachufulGameState = {
      ...gameState,
      players: updatedPlayers,
      rounds: [...gameState.rounds, newRound],
      currentRound: gameState.currentRound + 1,
      gameEnded,
      winner,
    }

    onGameUpdate(updatedGameState)
    if (winner) {
      setShowCelebration(true)
    }

    setCurrentRoundData(gameState.players.reduce((acc, _, index) => ({ ...acc, [index]: { bid: "0", tricks: "0" } }), {}))
  }

  const handleEditRound = (round: KachufulRound) => {
    setEditingRound(round)
    const scores = round.playerScores.reduce(
      (acc, p, index) => ({
        ...acc,
        [index]: { bid: p.bid.toString(), tricks: p.tricks.toString() },
      }),
      {},
    )
    setEditedScores(scores)
  }

  const handleCancelEdit = () => {
    setEditingRound(null)
    setEditedScores(null)
  }

  const handleUpdateEditedScore = (playerIndex: number, field: "bid" | "tricks", value: string) => {
    if (!editedScores) return
    if (value !== "" && !/^\d+$/.test(value)) {
      return
    }
    setEditedScores((prev) => ({
      ...prev!,
      [playerIndex]: {
        ...prev![playerIndex],
        [field]: value,
      },
    }))
  }

  const handleSaveEdit = () => {
    if (!editingRound || !editedScores) return

    const newRounds = [...gameState.rounds]
    const roundIndex = newRounds.findIndex((r) => r.roundNumber === editingRound.roundNumber)
    if (roundIndex === -1) return

    const newPlayerScores: KachufulPlayerRound[] = gameState.players.map((_, index) => {
      const bid = parseInt(editedScores[index].bid) || 0
      const tricks = parseInt(editedScores[index].tricks) || 0
      const score = calculateScore(bid, tricks, gameState.zeroBidPoints, gameState.negativePointsEnabled)
      return { bid, tricks, score }
    })
    newRounds[roundIndex] = { ...newRounds[roundIndex], playerScores: newPlayerScores }

    // Recalculate all scores from the edited round onwards
    const updatedPlayers = gameState.players.map((player) => ({
      ...player,
      totalScore: 0,
      rounds: [],
    }))

    for (const round of newRounds) {
      round.playerScores.forEach((pScore, pIndex) => {
        updatedPlayers[pIndex].totalScore += pScore.score
        updatedPlayers[pIndex].rounds.push(pScore)
      })
    }

    const updatedGameState: KachufulGameState = {
      ...gameState,
      players: updatedPlayers,
      rounds: newRounds,
    }

    onGameUpdate(updatedGameState)
    handleCancelEdit()
  }

  if (gameState.gameEnded && gameState.winner) {
    return (
      <div className="text-center space-y-8 max-w-4xl mx-auto animate-fade-in-scale">
        <CelebrationEffects trigger={showCelebration} onComplete={() => setShowCelebration(false)} />
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-purple-400 animate-pulse-glow" />
              <span className="text-3xl font-bold text-purple-400">Game Over!</span>
              <Crown className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-xl text-purple-200">
              <strong>{gameState.winner.name}</strong> wins with {gameState.winner.totalScore} points!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-slide-in-up">
      {editingRound && (
        <Alert className="border-purple-500/30 bg-purple-950/30">
          <Pencil className="w-4 h-4 text-purple-400" />
          <AlertDescription className="text-purple-300">
            You are editing Round {editingRound.roundNumber}. Saving will recalculate all total scores.
          </AlertDescription>
        </Alert>
      )}

      {!editingRound && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">
              Round {gameState.currentRound} of {gameState.maxRounds}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 text-slate-400">
              <span>Cards: {currentCards}</span>
              <span className="flex items-center gap-2">
                Trump: <TrumpIcon suit={currentTrump} />
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameState.players.map((player, index) => (
                <Card
                  key={player.name}
                  className="bg-slate-700/30 border-slate-600/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium text-white">{player.name}</span>
                      <Badge className="bg-slate-600 text-white">Total: {player.totalScore}</Badge>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-1">
                        <label className="text-xs text-slate-400">Bid</label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min="0"
                          max={currentCards}
                          value={currentRoundData[index]?.bid || ""}
                          onChange={(e) => updateRoundData(index, "bid", e.target.value)}
                          className="w-full text-center bg-slate-600/50 border-slate-500 text-white"
                          placeholder="0"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-xs text-slate-400">Tricks</label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min="0"
                          max={currentCards}
                          value={currentRoundData[index]?.tricks || ""}
                          onChange={(e) => updateRoundData(index, "tricks", e.target.value)}
                          className="w-full text-center bg-slate-600/50 border-slate-500 text-white"
                          placeholder="0"
                        />
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
      )}

      {gameState.rounds.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Score History</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto custom-scrollbar">
            <table className="scoreboard-table w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="p-3 text-left font-medium text-slate-300 bg-slate-800/50">Round</th>
                  {gameState.players.map((player) => (
                    <th key={player.name} className="p-3 text-center font-medium text-slate-300 bg-slate-800/50">
                      {player.name}
                    </th>
                  ))}
                  <th className="p-3 text-center font-medium text-slate-300 bg-slate-800/50"></th>
                </tr>
              </thead>
              <tbody>
                {gameState.rounds
                  .slice()
                  .reverse()
                  .map((round) =>
                    editingRound?.roundNumber === round.roundNumber ? (
                      <tr key={`${round.roundNumber}-editing`} className="border-b border-purple-700/50">
                        <td className="p-3 bg-purple-900/20">
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-white">R{round.roundNumber}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              ({round.cards}, <TrumpIcon suit={round.trumpSuit} />)
                            </span>
                          </div>
                        </td>
                        {round.playerScores.map((pScore, pIndex) => (
                          <td key={pIndex} className="text-center p-3 bg-purple-900/20">
                            <div className="flex flex-col items-center gap-1">
                              <Input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={editedScores?.[pIndex]?.bid || ""}
                                onChange={(e) => handleUpdateEditedScore(pIndex, "bid", e.target.value)}
                                className="h-8 w-16 text-center bg-slate-600/50 border-slate-500 text-white"
                              />
                              <Input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={editedScores?.[pIndex]?.tricks || ""}
                                onChange={(e) => handleUpdateEditedScore(pIndex, "tricks", e.target.value)}
                                className="h-8 w-16 text-center bg-slate-600/50 border-slate-500 text-white mt-1"
                              />
                            </div>
                          </td>
                        ))}
                        <td className="p-3 bg-purple-900/20">
                          <div className="flex flex-col gap-2">
                            <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={round.roundNumber} className="border-b border-slate-700/50">
                        <td className="p-3 bg-slate-800/50">
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-white">R{round.roundNumber}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              ({round.cards}, <TrumpIcon suit={round.trumpSuit} />)
                            </span>
                          </div>
                        </td>
                        {round.playerScores.map((pScore, pIndex) => (
                          <td key={pIndex} className="text-center p-3">
                            <div className="flex flex-col items-center gap-1">
                              <Badge
                                className={
                                  pScore.score > 0
                                    ? "bg-green-600/80 text-white"
                                    : pScore.score < 0
                                      ? "bg-red-600/80 text-white"
                                      : "bg-slate-600/80 text-white"
                                }
                              >
                                {pScore.score > 0 ? `+${pScore.score}` : pScore.score}
                              </Badge>
                              <span className="text-xs text-slate-400">
                                {pScore.bid}/{pScore.tricks}
                              </span>
                            </div>
                          </td>
                        ))}
                        <td className="p-3 text-center bg-slate-800/50">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditRound(round)}
                            className="hover:bg-slate-700"
                            disabled={!!editingRound}
                          >
                            <Pencil className="w-4 h-4 text-slate-400" />
                          </Button>
                        </td>
                      </tr>
                    ),
                  )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

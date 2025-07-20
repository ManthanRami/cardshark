
"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts"
import { Plus, Spade, Diamond, Club, Heart, Trophy, Crown } from "lucide-react"
import { CelebrationEffects } from "@/components/celebration-effects"
import type {
  KachufulGameState,
  KachufulPlayer,
  KachufulRound,
  KachufulPlayerRound,
  TrumpSuit,
} from "@/types/kachuful"

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

const calculateCardsForRound = (
  round: number,
  maxCards: number,
  maxRounds: number,
) => {
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
    if (bid === 0 && tricks > 0) return -zeroBidPoints
    if (bid > 0 && tricks !== bid) return -bid
  }
  return 0
}

export function KachufulScoreboard({
  gameState,
  onGameUpdate,
}: KachufulScoreboardProps) {
  const [currentRoundData, setCurrentRoundData] = useState<{
    [playerIndex: string]: { bid: string; tricks: string }
  }>(
    gameState.players.reduce(
      (acc, _, index) => ({ ...acc, [index]: { bid: "", tricks: "" } }),
      {},
    ),
  )
  const [showCelebration, setShowCelebration] = useState(false)

  const maxCards = Math.floor(
    (52 * gameState.deckCount) / gameState.players.length,
  )
  const currentCards = calculateCardsForRound(
    gameState.currentRound,
    maxCards,
    gameState.maxRounds,
  )
  const currentTrump =
    TRUMP_SUITS_ORDER[(gameState.currentRound - 1) % TRUMP_SUITS_ORDER.length]

  const updateRoundData = (
    playerIndex: number,
    field: "bid" | "tricks",
    value: string,
  ) => {
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
    return (
      data &&
      data.bid !== "" &&
      !isNaN(parseInt(data.bid)) &&
      data.tricks !== "" &&
      !isNaN(parseInt(data.tricks))
    )
  })

  const addRound = () => {
    if (!canAddRound) return

    const newPlayerScores: KachufulPlayerRound[] = gameState.players.map(
      (_, index) => {
        const bid = parseInt(currentRoundData[index].bid) || 0
        const tricks = parseInt(currentRoundData[index].tricks) || 0
        const score = calculateScore(
          bid,
          tricks,
          gameState.zeroBidPoints,
          gameState.negativePointsEnabled,
        )
        return { bid, tricks, score }
      },
    )

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
    const winner = gameEnded
      ? updatedPlayers.reduce((max, p) =>
          p.totalScore > max.totalScore ? p : max,
        )
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
    if (winner) {
      setShowCelebration(true)
    }

    // Reset for next round
    setCurrentRoundData(
      gameState.players.reduce(
        (acc, _, index) => ({ ...acc, [index]: { bid: "", tricks: "" } }),
        {},
      ),
    )
  }

  if (gameState.gameEnded && gameState.winner) {
    return (
      <div className="text-center space-y-8 max-w-4xl mx-auto animate-fade-in-scale">
        <CelebrationEffects
          trigger={showCelebration}
          onComplete={() => setShowCelebration(false)}
        />
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-purple-400 animate-pulse-glow" />
              <span className="text-3xl font-bold text-purple-400">
                Game Over!
              </span>
              <Crown className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-xl text-purple-200">
              <strong>{gameState.winner.name}</strong> wins with{" "}
              {gameState.winner.totalScore} points!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const raceData = gameState.players.map((player) => ({
    name: player.name,
    score: player.totalScore,
  }))

  const historyData = gameState.rounds.map((round) => {
    const roundEntry: { [key: string]: any } = {
      round: `R${round.roundNumber} (${round.cards})`,
    }
    gameState.players.forEach((player, pIndex) => {
      roundEntry[player.name] = round.playerScores[pIndex]?.score
    })
    return roundEntry
  })

  return (
    <div className="space-y-8 animate-slide-in-up">
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
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {index + 1}
                      </div>
                      {player.name}
                    </div>
                    <Badge className="bg-slate-600 text-white">
                      Total: {player.totalScore}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Enter bid and tricks taken
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-slate-400">Bid:</label>
                    <Input
                      type="number"
                      min="0"
                      max={currentCards}
                      value={currentRoundData[index]?.bid || ""}
                      onChange={(e) =>
                        updateRoundData(index, "bid", e.target.value)
                      }
                      className="w-full text-center bg-slate-600/50 border-slate-500 text-white"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-slate-400">Tricks:</label>
                    <Input
                      type="number"
                      min="0"
                      max={currentCards}
                      value={currentRoundData[index]?.tricks || ""}
                      onChange={(e) =>
                        updateRoundData(index, "tricks", e.target.value)
                      }
                      className="w-full text-center bg-slate-600/50 border-slate-500 text-white"
                      placeholder="0"
                    />
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
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Race to Victory</CardTitle>
              <CardDescription className="text-slate-400">
                Current total scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={raceData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--accent))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Score History</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto custom-scrollbar">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-transparent">
                    <TableHead className="text-slate-300">Round</TableHead>
                    {gameState.players.map((player) => (
                      <TableHead key={player.name} className="text-center text-slate-300">
                        {player.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gameState.rounds.map((round, rIndex) => (
                    <TableRow key={rIndex} className="border-slate-700/50">
                      <TableCell className="font-medium text-white">
                        <div className="flex flex-col">
                          <span>Round {round.roundNumber}</span>
                          <span className="text-xs text-slate-400">
                            ({round.cards} cards, <TrumpIcon suit={round.trumpSuit} />)
                          </span>
                        </div>
                      </TableCell>
                      {round.playerScores.map((pScore, pIndex) => (
                        <TableCell key={pIndex} className="text-center">
                          <div className="flex flex-col items-center">
                             <Badge className={pScore.score > 0 ? "bg-green-600/80 text-white" : pScore.score < 0 ? "bg-red-600/80 text-white" : "bg-slate-600/80 text-white"}>
                              {pScore.score > 0 ? `+${pScore.score}` : pScore.score}
                            </Badge>
                            <span className="text-xs text-slate-400 mt-1">
                              {pScore.bid}/{pScore.tricks}
                            </span>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

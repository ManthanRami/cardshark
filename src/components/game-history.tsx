"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Calendar, Users, Target, TrendingUp, History, Award } from "lucide-react"

interface GameRecord {
  id: string
  gameType: "kachuful" | "hearts"
  date: string
  players: string[]
  winner: string
  finalScores: { [player: string]: number }
  rounds: number
  duration?: number
}

interface PlayerStats {
  name: string
  gamesPlayed: number
  gamesWon: number
  winRate: number
  averageScore: number
  bestScore: number
  totalRounds: number
}

export function GameHistory() {
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([])
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    loadGameHistory()
  }, [])

  const loadGameHistory = () => {
    if (typeof window !== "undefined") {
      const history = localStorage.getItem("scoreboard-game-history")
      if (history) {
        const games = JSON.parse(history)
        setGameHistory(games)
        calculatePlayerStats(games)
      }
    }
  }

  const calculatePlayerStats = (games: GameRecord[]) => {
    const stats: { [player: string]: PlayerStats } = {}

    games.forEach((game) => {
      game.players.forEach((player) => {
        if (!stats[player]) {
          stats[player] = {
            name: player,
            gamesPlayed: 0,
            gamesWon: 0,
            winRate: 0,
            averageScore: 0,
            bestScore: game.gameType === "hearts" ? Number.POSITIVE_INFINITY : 0,
            totalRounds: 0,
          }
        }

        stats[player].gamesPlayed++
        stats[player].totalRounds += game.rounds

        if (game.winner === player) {
          stats[player].gamesWon++
        }

        const playerScore = game.finalScores[player] || 0
        if (game.gameType === "hearts") {
          stats[player].bestScore = Math.min(stats[player].bestScore, playerScore)
        } else {
          stats[player].bestScore = Math.max(stats[player].bestScore, playerScore)
        }
      })
    })

    // Calculate win rates and average scores
    Object.values(stats).forEach((stat) => {
      stat.winRate = (stat.gamesWon / stat.gamesPlayed) * 100
      stat.averageScore =
        games
          .filter((game) => game.players.includes(stat.name))
          .reduce((sum, game) => sum + (game.finalScores[stat.name] || 0), 0) / stat.gamesPlayed
    })

    setPlayerStats(Object.values(stats).sort((a, b) => b.winRate - a.winRate))
  }

  const saveGameRecord = (record: GameRecord) => {
    const updatedHistory = [...gameHistory, record]
    setGameHistory(updatedHistory)
    localStorage.setItem("scoreboard-game-history", JSON.stringify(updatedHistory))
    calculatePlayerStats(updatedHistory)
  }

  // Expose save function globally
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).saveGameRecord = saveGameRecord
    }
  }, [gameHistory])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getGameTypeColor = (gameType: string) => {
    return gameType === "hearts" ? "bg-red-500" : "bg-slate-600"
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fab bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white md-elevation-8 hover:md-elevation-4"
      >
        <History className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden md-elevation-8 border-0 bg-white dark:bg-slate-800 animate-fade-in-scale">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="md-headline-6 text-slate-800 dark:text-slate-100 font-medium">
                Game History & Stats
              </CardTitle>
            </div>
            <Button onClick={() => setIsOpen(false)} variant="outline" size="sm">
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Game History
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Player Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-4">
              {gameHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="md-body-1 text-slate-500">No games played yet</p>
                  <p className="md-caption text-slate-400">Start playing to build your history!</p>
                </div>
              ) : (
                gameHistory
                  .slice()
                  .reverse()
                  .map((game) => (
                    <Card key={game.id} className="md-elevation-2 border-0 bg-slate-50 dark:bg-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={`${getGameTypeColor(game.gameType)} text-white`}>
                              {game.gameType === "hearts" ? "Hearts" : "Kachuful"}
                            </Badge>
                            <span className="md-caption text-slate-500">{formatDate(game.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-purple-400" />
                            <span className="md-body-2 font-medium text-slate-800 dark:text-slate-100">
                              {game.winner}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.entries(game.finalScores).map(([player, score]) => (
                            <div
                              key={player}
                              className={`p-2 rounded text-center ${
                                player === game.winner
                                  ? "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900"
                                  : "bg-white dark:bg-slate-600"
                              }`}
                            >
                              <p className="md-caption text-slate-600 dark:text-slate-400">{player}</p>
                              <p className="md-body-2 font-medium text-slate-800 dark:text-slate-100">{score}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-slate-500 md-caption">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {game.players.length} players
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {game.rounds} rounds
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              {playerStats.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="md-body-1 text-slate-500">No player statistics yet</p>
                  <p className="md-caption text-slate-400">Play some games to see your stats!</p>
                </div>
              ) : (
                playerStats.map((player, index) => (
                  <Card
                    key={player.name}
                    className={`md-elevation-2 border-0 leaderboard-entry ${
                      index === 0
                        ? "bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950"
                        : "bg-slate-50 dark:bg-slate-700"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {index === 0 && <Trophy className="w-5 h-5 text-purple-400" />}
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {index + 1}
                          </div>
                          <span className="md-subtitle-1 font-medium text-slate-800 dark:text-slate-100">
                            {player.name}
                          </span>
                        </div>
                        <Badge
                          className={`${
                            index === 0 ? "bg-purple-500 text-white" : "bg-blue-500 text-white"
                          } md-caption px-3 py-1`}
                        >
                          {player.winRate.toFixed(1)}% Win Rate
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md-body-2 text-slate-600 dark:text-slate-400">
                        <div className="text-center">
                          <p className="font-medium text-slate-800 dark:text-slate-100">{player.gamesPlayed}</p>
                          <p className="md-caption">Games Played</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-slate-800 dark:text-slate-100">{player.gamesWon}</p>
                          <p className="md-caption">Games Won</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {player.averageScore.toFixed(1)}
                          </p>
                          <p className="md-caption">Avg Score</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {player.bestScore === Number.POSITIVE_INFINITY ? "N/A" : player.bestScore}
                          </p>
                          <p className="md-caption">Best Score</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, GripVertical, Info, Heart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { HeartsGameState } from "@/types/hearts"

interface HeartsSetupProps {
  onGameStart: (gameState: HeartsGameState) => void
}

export function HeartsSetup({ onGameStart }: HeartsSetupProps) {
  const [playerCount, setPlayerCount] = useState(4)
  const [players, setPlayers] = useState<string[]>(["Player 1", "Player 2", "Player 3", "Player 4"])
  const [deckCount, setDeckCount] = useState(1)
  const [maxPoints, setMaxPoints] = useState(100)

  const maxRoundPoints = deckCount * 26

  const addPlayer = () => {
    if (players.length < 5) {
      setPlayers([...players, `Player ${players.length + 1}`])
      setPlayerCount(players.length + 1)
    }
  }

  const removePlayer = (index: number) => {
    if (players.length > 3) {
      const newPlayers = players.filter((_, i) => i !== index)
      setPlayers(newPlayers)
      setPlayerCount(newPlayers.length)
    }
  }

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...players]
    newPlayers[index] = name
    setPlayers(newPlayers)
  }

  const movePlayer = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index > 0) || (direction === "down" && index < players.length - 1)) {
      const newPlayers = [...players]
      const targetIndex = direction === "up" ? index - 1 : index + 1
      ;[newPlayers[index], newPlayers[targetIndex]] = [newPlayers[targetIndex], newPlayers[index]]
      setPlayers(newPlayers)
    }
  }

  const startGame = () => {
    const gameState: HeartsGameState = {
      players: players.map((name) => ({
        name,
        totalScore: 0,
        rounds: [],
      })),
      currentRound: 1,
      rounds: [],
      deckCount,
      maxPoints,
      gameEnded: false,
      winner: null,
    }
    onGameStart(gameState)
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-scale">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Hearts Game Setup</CardTitle>
              <p className="text-slate-400">Configure your trick-taking game</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <Alert className="border-blue-500/20 bg-blue-950/20">
            <Info className="h-5 w-5 text-blue-400" />
            <AlertDescription className="text-blue-200">
              <strong>Hearts Rules:</strong> Avoid taking hearts (1 point each) and Queen(s) of Spades (13 points each).
              The player with the lowest score wins when someone reaches the point limit.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Number of Players</Label>
              <Select
                value={playerCount.toString()}
                onValueChange={(value) => {
                  const count = Number.parseInt(value)
                  setPlayerCount(count)
                  if (count > players.length) {
                    const newPlayers = [...players]
                    for (let i = players.length; i < count; i++) {
                      newPlayers.push(`Player ${i + 1}`)
                    }
                    setPlayers(newPlayers)
                  } else if (count < players.length) {
                    setPlayers(players.slice(0, count))
                  }
                }}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="3" className="text-white hover:bg-slate-700">
                    3 Players
                  </SelectItem>
                  <SelectItem value="4" className="text-white hover:bg-slate-700">
                    4 Players
                  </SelectItem>
                  <SelectItem value="5" className="text-white hover:bg-slate-700">
                    5 Players
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Number of Decks</Label>
              <Select value={deckCount.toString()} onValueChange={(value) => setDeckCount(Number.parseInt(value))}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="1" className="text-white hover:bg-slate-700">
                    1 Deck (26 pts max)
                  </SelectItem>
                  <SelectItem value="2" className="text-white hover:bg-slate-700">
                    2 Decks (52 pts max)
                  </SelectItem>
                  <SelectItem value="3" className="text-white hover:bg-slate-700">
                    3 Decks (78 pts max)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Game End Point Limit</Label>
              <Select value={maxPoints.toString()} onValueChange={(value) => setMaxPoints(Number.parseInt(value))}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="50" className="text-white hover:bg-slate-700">
                    50 Points
                  </SelectItem>
                  <SelectItem value="75" className="text-white hover:bg-slate-700">
                    75 Points
                  </SelectItem>
                  <SelectItem value="100" className="text-white hover:bg-slate-700">
                    100 Points (Classic)
                  </SelectItem>
                  <SelectItem value="150" className="text-white hover:bg-slate-700">
                    150 Points
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="bg-gradient-to-r from-slate-700/30 to-slate-600/30 border-slate-600/50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Game Configuration
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{playerCount}</div>
                  <div className="text-slate-400">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{deckCount}</div>
                  <div className="text-slate-400">Deck{deckCount > 1 ? "s" : ""}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{maxRoundPoints}</div>
                  <div className="text-slate-400">Max Points/Round</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{maxPoints}</div>
                  <div className="text-slate-400">Game End Limit</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300 font-medium text-lg">Player Names</Label>
              <Button
                onClick={addPlayer}
                disabled={players.length >= 5}
                size="sm"
                variant="outline"
                className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </div>

            <div className="space-y-3">
              {players.map((player, index) => (
                <Card key={index} className="bg-slate-700/30 border-slate-600/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => movePlayer(index, "up")}
                          disabled={index === 0}
                          className="h-6 w-6 p-0 hover:bg-slate-600/50 text-slate-400"
                        >
                          <GripVertical className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => movePlayer(index, "down")}
                          disabled={index === players.length - 1}
                          className="h-6 w-6 p-0 hover:bg-slate-600/50 text-slate-400"
                        >
                          <GripVertical className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {index + 1}
                      </div>
                      <Input
                        value={player}
                        onChange={(e) => updatePlayerName(index, e.target.value)}
                        placeholder={`Player ${index + 1}`}
                        className="flex-1 bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400"
                      />
                      <Button
                        onClick={() => removePlayer(index)}
                        disabled={players.length <= 3}
                        size="sm"
                        variant="outline"
                        className="bg-transparent border-slate-600 text-slate-400 hover:bg-red-900/20 hover:border-red-500/50 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Heart className="w-5 h-5 mr-2" />
            Start Hearts Game
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

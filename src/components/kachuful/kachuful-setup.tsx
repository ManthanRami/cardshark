
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, GripVertical, Info, Spade } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { KachufulGameState } from "@/types/kachuful"

interface KachufulSetupProps {
  onGameStart: (gameState: KachufulGameState) => void
}

export function KachufulSetup({ onGameStart }: KachufulSetupProps) {
  const [playerCount, setPlayerCount] = useState(4)
  const [players, setPlayers] = useState<string[]>(["Player 1", "Player 2", "Player 3", "Player 4"])
  const [deckCount, setDeckCount] = useState(1)

  const maxCards = Math.floor((52 * deckCount) / playerCount)
  const totalRounds = maxCards * 2 - 1

  const addPlayer = () => {
    if (players.length < 10) {
      setPlayers([...players, `Player ${players.length + 1}`])
      setPlayerCount(players.length + 1)
    }
  }

  const removePlayer = (index: number) => {
    if (players.length > 2) {
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
    const gameState: KachufulGameState = {
      players: players.map((name) => ({
        name,
        totalScore: 0,
        rounds: [],
      })),
      currentRound: 1,
      rounds: [],
      deckCount,
      maxRounds: totalRounds,
    }
    onGameStart(gameState)
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-scale">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
              <Spade className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Kachuful Game Setup</CardTitle>
              <p className="text-slate-400">Configure your strategic bidding game</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <Alert className="border-blue-500/20 bg-blue-950/20">
            <Info className="h-5 w-5 text-blue-400" />
            <AlertDescription className="text-blue-200">
              <strong>Kachuful Rules:</strong> Bid on the number of tricks you'll take each round. Score 10 + bid points
              if you make exactly your bid, 0 points if you don't. Trump suit rotates: Spades → Diamonds → Clubs →
              Hearts.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {Array.from({ length: 9 }, (_, i) => i + 2).map((num) => (
                    <SelectItem key={num} value={num.toString()} className="text-white hover:bg-slate-700">
                      {num} Players
                    </SelectItem>
                  ))}
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
                    1 Deck
                  </SelectItem>
                  <SelectItem value="2" className="text-white hover:bg-slate-700">
                    2 Decks
                  </SelectItem>
                  <SelectItem value="3" className="text-white hover:bg-slate-700">
                    3 Decks
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="border-0 bg-slate-700/50 border-slate-600/50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
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
                  <div className="text-2xl font-bold text-white">{maxCards}</div>
                  <div className="text-slate-400">Max Cards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totalRounds}</div>
                  <div className="text-slate-400">Total Rounds</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300 font-medium text-lg">Player Names</Label>
              <Button
                onClick={addPlayer}
                disabled={players.length >= 10}
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
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
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
                        disabled={players.length <= 2}
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
            className="w-full bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Spade className="w-5 h-5 mr-2" />
            Start Kachuful Game
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, GripVertical, X, Info, Users, UserX, Shield, Heart, Ghost, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { TraitorGameState, TraitorRole } from "@/types/traitor"

interface TraitorSetupProps {
  onGameStart: (gameState: TraitorGameState) => void
}

const getRecommendedRoles = (playerCount: number) => {
  if (playerCount < 5) {
    return { mafia: 0, detective: 0, doctor: 0 }
  }

  let mafia = 1
  if (playerCount >= 6) mafia = 2
  if (playerCount >= 9) mafia = 3
  if (playerCount >= 12) mafia = 4
  if (playerCount >= 15) mafia = 5
  if (playerCount >= 18) mafia = 6

  const detective = playerCount >= 5 ? 1 : 0
  const doctor = playerCount >= 7 ? 1 : 0
  
  return { mafia, detective, doctor }
}

export function TraitorSetup({ onGameStart }: TraitorSetupProps) {
  const [playerCount, setPlayerCount] = useState(7)
  const [players, setPlayers] = useState<string[]>([
    "Player 1",
    "Player 2",
    "Player 3",
    "Player 4",
    "Player 5",
    "Player 6",
    "Player 7",
  ])
  const [roleConfig, setRoleConfig] = useState(getRecommendedRoles(7))

  const civilianCount = playerCount - roleConfig.mafia - roleConfig.detective - roleConfig.doctor
  const totalRolesAssigned = roleConfig.mafia + roleConfig.detective + roleConfig.doctor + civilianCount
  const isRoleConfigValid = totalRolesAssigned === playerCount && civilianCount >= 0

  useEffect(() => {
    setRoleConfig(getRecommendedRoles(playerCount))
  }, [playerCount])

  const handleRoleChange = (role: 'mafia' | 'detective' | 'doctor', count: number) => {
    const newCount = Math.max(0, count)
    setRoleConfig(prev => ({ ...prev, [role]: newCount }))
  }

  const addPlayer = () => {
    if (players.length < 20) {
      const newCount = players.length + 1
      setPlayers([...players, `Player ${newCount}`])
      setPlayerCount(newCount)
    }
  }

  const removePlayer = (index: number) => {
    if (players.length > 5) {
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
    if (!isRoleConfigValid) return
    
    const roles: TraitorRole[] = [
      ...Array(roleConfig.mafia).fill("mafia"),
      ...Array(roleConfig.detective).fill("detective"),
      ...Array(roleConfig.doctor).fill("doctor"),
      ...Array(civilianCount).fill("civilian"),
    ]

    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[roles[i], roles[j]] = [roles[j], roles[i]]
    }

    const gameState: TraitorGameState = {
      players: players.map((name, index) => ({
        id: `player-${index}`,
        name,
        role: roles[index],
        isAlive: true,
        isProtected: false,
        eliminationReason: undefined,
        eliminatedRound: undefined,
      })),
      rounds: [],
      currentRound: 1,
      currentPhase: "night",
      gameEnded: false,
      winner: null,
      roleConfig: {...roleConfig, civilian: civilianCount},
      gameStarted: true,
    }

    onGameStart(gameState)
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-scale">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-indigo-900 rounded-xl flex items-center justify-center">
              <Ghost className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Traitor Game Setup</CardTitle>
              <p className="text-slate-400">Configure your social deduction game</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <Alert className="border-blue-500/20 bg-blue-950/20">
            <Info className="h-5 w-5 text-blue-400" />
            <AlertDescription className="text-blue-200">
              <strong>Traitor Rules:</strong> Mafia members try to eliminate all other players. Town (Detective + Doctor
              + Civilians) wins by eliminating all Mafia. Detective can investigate one player each night. Doctor can
              protect one player each night.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label className="font-medium text-slate-300">Number of Players</Label>
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
                {Array.from({ length: 16 }, (_, i) => i + 5).map((num) => (
                  <SelectItem key={num} value={num.toString()} className="text-white hover:bg-slate-700">
                    {num} Players
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="border-0 bg-slate-700/50 border-slate-600/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  Role Configuration
                </h3>
                <Button variant="outline" size="sm" className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50 text-xs" onClick={() => setRoleConfig(getRecommendedRoles(playerCount))}>
                  Use Recommended
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-200">
                <div className="space-y-2">
                   <Label className="flex items-center gap-2 text-red-400"><UserX className="w-4 h-4" /> Mafia</Label>
                   <Input type="number" value={roleConfig.mafia} onChange={e => handleRoleChange('mafia', parseInt(e.target.value))} className="bg-slate-600/50 border-slate-500 text-white" />
                </div>
                 <div className="space-y-2">
                   <Label className="flex items-center gap-2 text-blue-400"><Shield className="w-4 h-4" /> Detective</Label>
                   <Input type="number" value={roleConfig.detective} onChange={e => handleRoleChange('detective', parseInt(e.target.value))} className="bg-slate-600/50 border-slate-500 text-white" />
                </div>
                 <div className="space-y-2">
                   <Label className="flex items-center gap-2 text-green-400"><Heart className="w-4 h-4" /> Doctor</Label>
                   <Input type="number" value={roleConfig.doctor} onChange={e => handleRoleChange('doctor', parseInt(e.target.value))} className="bg-slate-600/50 border-slate-500 text-white" />
                </div>
                 <div className="space-y-2">
                   <Label className="flex items-center gap-2 text-slate-400"><Users className="w-4 h-4" /> Civilians</Label>
                   <Input type="number" value={civilianCount} readOnly className="bg-slate-800/50 border-slate-600 text-slate-300" />
                </div>
              </div>
              {!isRoleConfigValid && (
                <Alert variant="destructive" className="mt-4 bg-red-950/30 border-red-500/30 text-red-300">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription>
                    Total roles ({totalRolesAssigned}) must equal player count ({playerCount}). Please adjust roles.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300 font-medium text-lg">Player Names</Label>
              <Button
                onClick={addPlayer}
                disabled={players.length >= 20}
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
                        disabled={players.length <= 5}
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
            disabled={!isRoleConfigValid}
            className="w-full bg-gradient-to-r from-purple-700 to-indigo-900 hover:opacity-90 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Ghost className="w-5 h-5 mr-2" />
            Start Traitor Game
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

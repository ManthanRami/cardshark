"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, GripVertical, X, Info, Users, Eye, Shield, UserX, Heart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { TraitorGameState, TraitorRole } from "@/types/traitor"

interface TraitorSetupProps {
  onGameStart: (gameState: TraitorGameState) => void
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
  const [roleConfig, setRoleConfig] = useState({
    mafia: 2,
    detective: 1,
    doctor: 1,
    civilian: 3,
  })

  const addPlayer = () => {
    if (players.length < 20) {
      setPlayers([...players, `Player ${players.length + 1}`])
      setPlayerCount(players.length + 1)
      setRoleConfig((prev) => ({ ...prev, civilian: prev.civilian + 1 }))
    }
  }

  const removePlayer = (index: number) => {
    if (players.length > 5) {
      const newPlayers = players.filter((_, i) => i !== index)
      setPlayers(newPlayers)
      setPlayerCount(newPlayers.length)
      const totalRoles = roleConfig.mafia + roleConfig.detective + roleConfig.doctor + roleConfig.civilian
      if (totalRoles > newPlayers.length) {
        setRoleConfig((prev) => ({ ...prev, civilian: Math.max(0, prev.civilian - 1) }))
      }
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

  const updateRoleCount = (role: keyof typeof roleConfig, count: number) => {
    setRoleConfig((prev) => ({ ...prev, [role]: count }))
  }

  const totalRoles = roleConfig.mafia + roleConfig.detective + roleConfig.doctor + roleConfig.civilian
  const isValidConfig = totalRoles === players.length && roleConfig.mafia >= 1 && roleConfig.mafia < players.length / 2

  const startGame = () => {
    // Shuffle and assign roles
    const roles: TraitorRole[] = [
      ...Array(roleConfig.mafia).fill("mafia"),
      ...Array(roleConfig.detective).fill("detective"),
      ...Array(roleConfig.doctor).fill("doctor"),
      ...Array(roleConfig.civilian).fill("civilian"),
    ]

    // Fisher-Yates shuffle
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
        eliminatedBy: undefined,
        eliminatedRound: undefined,
      })),
      rounds: [],
      currentRound: 1,
      currentPhase: "night",
      gameEnded: false,
      winner: null,
      roleConfig,
      gameStarted: false,
    }

    onGameStart(gameState)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="md-elevation-4 border-0 bg-white dark:bg-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="md-headline-5 text-slate-800 dark:text-slate-100 font-medium">
              Traitor Game Setup
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <Alert className="border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 md-elevation-1">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertDescription className="md-body-2 text-blue-800 dark:text-blue-200">
              <strong>Traitor Rules:</strong> Mafia members try to eliminate all other players. Town (Detective + Doctor
              + Civilians) wins by eliminating all Mafia. Detective can investigate one player each night. Doctor can
              protect one player each night. Game alternates between Day (discussion), Voting (eliminate someone), and
              Night (special actions) phases.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="space-y-2">
              <Label className="md-subtitle-2 text-slate-700 dark:text-slate-300">Total Players</Label>
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
                    setRoleConfig((prev) => ({ ...prev, civilian: prev.civilian + (count - players.length) }))
                  } else if (count < players.length) {
                    setPlayers(players.slice(0, count))
                    const diff = players.length - count
                    setRoleConfig((prev) => ({ ...prev, civilian: Math.max(0, prev.civilian - diff) }))
                  }
                }}
              >
                <SelectTrigger className="md-elevation-1 border-0 bg-slate-50 dark:bg-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="md-elevation-8">
                  {Array.from({ length: 16 }, (_, i) => i + 5).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Players
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="md-subtitle-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <UserX className="w-4 h-4 text-red-500" />
                Mafia
              </Label>
              <Select
                value={roleConfig.mafia.toString()}
                onValueChange={(value) => updateRoleCount("mafia", Number.parseInt(value))}
              >
                <SelectTrigger className="md-elevation-1 border-0 bg-slate-50 dark:bg-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="md-elevation-8">
                  {Array.from({ length: Math.floor(players.length / 2) }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="md-subtitle-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                Detective
              </Label>
              <Select
                value={roleConfig.detective.toString()}
                onValueChange={(value) => updateRoleCount("detective", Number.parseInt(value))}
              >
                <SelectTrigger className="md-elevation-1 border-0 bg-slate-50 dark:bg-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="md-elevation-8">
                  {Array.from({ length: 3 }, (_, i) => i).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="md-subtitle-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Heart className="w-4 h-4 text-green-500" />
                Doctor
              </Label>
              <Select
                value={roleConfig.doctor.toString()}
                onValueChange={(value) => updateRoleCount("doctor", Number.parseInt(value))}
              >
                <SelectTrigger className="md-elevation-1 border-0 bg-slate-50 dark:bg-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="md-elevation-8">
                  {Array.from({ length: 3 }, (_, i) => i).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="md-subtitle-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-500" />
                Civilian
              </Label>
              <Select
                value={roleConfig.civilian.toString()}
                onValueChange={(value) => updateRoleCount("civilian", Number.parseInt(value))}
              >
                <SelectTrigger className="md-elevation-1 border-0 bg-slate-50 dark:bg-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="md-elevation-8">
                  {Array.from({ length: players.length }, (_, i) => i).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card
            className={`border-0 md-elevation-1 ${
              isValidConfig
                ? "bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950"
                : "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950"
            }`}
          >
            <CardContent className="p-6">
              <h3 className="md-subtitle-1 font-medium text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isValidConfig ? "bg-green-500" : "bg-red-500"}`}></div>
                Role Configuration Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md-body-2 text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <UserX className="w-4 h-4 text-red-500" />
                  <span>{roleConfig.mafia} Mafia members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>
                    {roleConfig.detective} Detective{roleConfig.detective !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-green-500" />
                  <span>
                    {roleConfig.doctor} Doctor{roleConfig.doctor !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span>
                    {roleConfig.civilian} Civilian{roleConfig.civilian !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>Total: {totalRoles} players</span>
                </div>
              </div>
              {!isValidConfig && (
                <Alert className="mt-4 border-red-500/20 bg-red-50/50 dark:bg-red-950/20">
                  <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                    {totalRoles !== players.length &&
                      `Role count (${totalRoles}) must equal player count (${players.length}). `}
                    {roleConfig.mafia >= players.length / 2 && "Mafia cannot be half or more of total players. "}
                    {roleConfig.mafia < 1 && "Must have at least 1 Mafia member."}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="md-subtitle-1 font-medium text-slate-700 dark:text-slate-300">Player Names</Label>
              <Button
                onClick={addPlayer}
                disabled={players.length >= 20}
                size="sm"
                variant="outline"
                className="md-button md-ripple md-elevation-1 hover:md-elevation-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
            </div>

            <div className="space-y-3">
              {players.map((player, index) => (
                <Card key={index} className="md-elevation-1 border-0 bg-slate-50 dark:bg-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => movePlayer(index, "up")}
                          disabled={index === 0}
                          className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600"
                        >
                          <GripVertical className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => movePlayer(index, "down")}
                          disabled={index === players.length - 1}
                          className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600"
                        >
                          <GripVertical className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {index + 1}
                      </div>
                      <Input
                        value={player}
                        onChange={(e) => updatePlayerName(index, e.target.value)}
                        placeholder={`Player ${index + 1}`}
                        className="flex-1 border-0 bg-white dark:bg-slate-600 md-elevation-1"
                      />
                      <Button
                        onClick={() => removePlayer(index)}
                        disabled={players.length <= 5}
                        size="sm"
                        variant="outline"
                        className="md-ripple hover:bg-red-50 hover:border-red-200 hover:text-red-600"
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
            disabled={!isValidConfig}
            className="w-full md-button bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white py-4 rounded-xl md-ripple md-elevation-2 hover:md-elevation-4 transition-all duration-200"
          >
            <Users className="w-5 h-5 mr-2" />
            Start Traitor Game
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

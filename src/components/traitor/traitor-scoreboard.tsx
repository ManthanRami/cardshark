
"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Shield, UserX, Users, Moon, Sun, Vote, RotateCcw, Trophy, Heart } from "lucide-react"
import { CelebrationEffects } from "@/components/celebration-effects"
import type { TraitorGameState, TraitorPlayer } from "@/types/traitor"

interface TraitorScoreboardProps {
  onNewGame: () => void
  onGameUpdate: (state: TraitorGameState) => void
  gameState: TraitorGameState
}

const roleInfo = {
  mafia: {
    icon: UserX,
    color: "bg-red-800/80",
    borderColor: "border-red-500/30",
    textColor: "text-red-300",
  },
  detective: {
    icon: Eye,
    color: "bg-blue-800/80",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-300",
  },
  doctor: {
    icon: Heart,
    color: "bg-green-800/80",
    borderColor: "border-green-500/30",
    textColor: "text-green-300",
  },
  civilian: {
    icon: Users,
    color: "bg-slate-700/80",
    borderColor: "border-slate-500/30",
    textColor: "text-slate-300",
  },
}

export function TraitorScoreboard({ gameState, onGameUpdate, onNewGame }: TraitorScoreboardProps) {
  const [showRoles, setShowRoles] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Night Actions State
  const [mafiaTarget, setMafiaTarget] = useState<string | null>(null)
  const [doctorSave, setDoctorSave] = useState<string | null>(null)
  const [detectiveCheck, setDetectiveCheck] = useState<string | null>(null)
  const [lastInvestigation, setLastInvestigation] = useState<{ player: string; role: string } | null>(null)

  const alivePlayers = gameState.players.filter((p) => p.isAlive)
  const mafiaPlayers = alivePlayers.filter((p) => p.role === "mafia")
  const townPlayers = alivePlayers.filter((p) => p.role !== "mafia")
  const doctorPlayer = alivePlayers.find((p) => p.role === "doctor")
  const detectivePlayer = alivePlayers.find((p) => p.role === "detective")

  const checkWinCondition = (players: TraitorPlayer[]): "mafia" | "town" | null => {
    const aliveMafia = players.filter((p) => p.isAlive && p.role === "mafia").length
    const aliveTown = players.filter((p) => p.isAlive && p.role !== "mafia").length

    if (aliveMafia === 0) return "town"
    if (aliveMafia >= aliveTown) return "mafia"
    return null
  }

  const handleElimination = (playerId: string) => {
    const newPlayers = gameState.players.map((p) =>
      p.id === playerId ? { ...p, isAlive: false, eliminatedRound: gameState.currentRound } : p,
    )
    const winner = checkWinCondition(newPlayers)
    onGameUpdate({ ...gameState, players: newPlayers, winner, currentPhase: "night" })
    if (winner) setShowCelebration(true)
  }

  const handleNightEnd = () => {
    let eliminatedPlayerId: string | null = null
    if (mafiaTarget && mafiaTarget !== doctorSave) {
      eliminatedPlayerId = mafiaTarget
    }

    const newPlayers = gameState.players.map((p) => {
      if (p.id === eliminatedPlayerId) {
        return { ...p, isAlive: false, eliminatedRound: gameState.currentRound }
      }
      return p
    })

    if (detectiveCheck) {
      const target = newPlayers.find((p) => p.id === detectiveCheck)
      if (target) {
        setLastInvestigation({ player: target.name, role: target.role })
      }
    } else {
      setLastInvestigation(null)
    }

    const winner = checkWinCondition(newPlayers)
    onGameUpdate({
      ...gameState,
      players: newPlayers,
      winner,
      currentPhase: "day",
      currentRound: gameState.currentRound + 1,
    })
    if (winner) setShowCelebration(true)

    // Reset night actions
    setMafiaTarget(null)
    setDoctorSave(null)
    setDetectiveCheck(null)
  }

  if (gameState.winner) {
    return (
      <div className="text-center space-y-8 max-w-4xl mx-auto animate-fade-in-scale">
        {showCelebration && (
          <CelebrationEffects
            trigger={showCelebration}
            onComplete={() => setShowCelebration(false)}
          />
        )}
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-purple-400 animate-pulse-glow" />
              <span className="text-3xl font-bold text-purple-400">
                {gameState.winner === "mafia" ? "Mafia Wins!" : "Town Wins!"}
              </span>
            </div>
            <p className="text-xl text-purple-200">The game has ended.</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-center">Final Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gameState.players.map((player) => {
                const info = roleInfo[player.role]
                const RoleIcon = info.icon
                return (
                  <Card key={player.id} className={`p-4 text-center ${info.color} ${info.borderColor}`}>
                    <RoleIcon className={`w-8 h-8 mx-auto mb-2 ${info.textColor}`} />
                    <p className={`font-bold ${!player.isAlive ? "line-through" : ""}`}>{player.name}</p>
                    <p className="text-xs capitalize text-slate-300">{player.role}</p>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
        <Button
          onClick={onNewGame}
          className="mt-6 bg-gradient-to-r from-purple-700 to-indigo-900 hover:opacity-90 text-white"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Play Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-3">
              {gameState.currentPhase === "day" ? (
                <Sun className="h-6 w-6 text-purple-400" />
              ) : (
                <Moon className="h-6 w-6 text-purple-400" />
              )}
              <span>
                Round {gameState.currentRound} - {gameState.currentPhase === "day" ? "Day Phase" : "Night Phase"}
              </span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="show-roles" className="text-sm text-slate-300">
                Show Roles
              </Label>
              <Switch id="show-roles" checked={showRoles} onCheckedChange={setShowRoles} />
            </div>
          </div>
          <CardDescription className="text-slate-400 pt-2">
            {mafiaPlayers.length} Mafia vs. {townPlayers.length} Town members remain.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player List */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Players</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alivePlayers.map((player) => {
              const info = roleInfo[player.role]
              const RoleIcon = info.icon
              return (
                <Card
                  key={player.id}
                  className={`p-4 flex items-center justify-between transition-all ${info.color} ${info.borderColor} ${
                    gameState.currentPhase === "day"
                      ? "hover:bg-slate-700/50 cursor-pointer"
                      : "cursor-default"
                  }`}
                  onClick={() => gameState.currentPhase === "day" && handleElimination(player.id)}
                >
                  <div className="flex items-center gap-3">
                    {showRoles ? (
                      <RoleIcon className={`w-5 h-5 ${info.textColor}`} />
                    ) : (
                      <div className="w-5 h-5 bg-slate-600 rounded-full" />
                    )}
                    <span className="font-medium">{player.name}</span>
                  </div>
                  {gameState.currentPhase === "day" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleElimination(player.id)
                      }}
                    >
                      <Vote className="w-4 h-4 mr-2" />
                      Vote Out
                    </Button>
                  )}
                </Card>
              )
            })}
          </CardContent>
        </Card>

        {/* Actions Panel */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            {gameState.currentPhase === "night" ? (
              <div className="space-y-6">
                {mafiaPlayers.length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-red-400">
                      <UserX className="w-4 h-4" /> Mafia's Target
                    </Label>
                    <Select onValueChange={setMafiaTarget} value={mafiaTarget || ""}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select target..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600 text-white">
                        {townPlayers.map((p) => (
                          <SelectItem key={p.id} value={p.id} className="hover:bg-slate-700">
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {doctorPlayer && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-green-400">
                      <Heart className="w-4 h-4" /> Doctor's Save
                    </Label>
                    <Select onValueChange={setDoctorSave} value={doctorSave || ""}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select player to save..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600 text-white">
                        {alivePlayers.map((p) => (
                          <SelectItem key={p.id} value={p.id} className="hover:bg-slate-700">
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {detectivePlayer && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-blue-400">
                      <Eye className="w-4 h-4" /> Detective's Check
                    </Label>
                    <Select onValueChange={setDetectiveCheck} value={detectiveCheck || ""}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select player to investigate..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600 text-white">
                        {alivePlayers
                          .filter((p) => p.role !== "detective")
                          .map((p) => (
                            <SelectItem key={p.id} value={p.id} className="hover:bg-slate-700">
                              {p.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-400">
                <p>Day phase in progress. Discuss and decide who to vote out.</p>
                {lastInvestigation && (
                  <p className="mt-4 text-sm bg-blue-900/50 p-3 rounded-lg border border-blue-500/30">
                    Last night's investigation: <strong>{lastInvestigation.player}</strong> is a{" "}
                    <strong>{lastInvestigation.role}</strong>.
                  </p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={
                gameState.currentPhase === "night"
                  ? handleNightEnd
                  : () => onGameUpdate({ ...gameState, currentPhase: "night" })
              }
              className="w-full bg-gradient-to-r from-purple-700 to-indigo-900 hover:opacity-90 text-white"
            >
              {gameState.currentPhase === "night" ? (
                <>
                  <Sun className="mr-2 h-4 w-4" /> End Night
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" /> End Day
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {gameState.players.filter((p) => !p.isAlive).length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Eliminated Players</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {gameState.players
              .filter((p) => !p.isAlive)
              .map((player) => (
                <Badge key={player.id} variant="secondary" className="p-2 text-base">
                  <span className="line-through">{player.name}</span>
                  {showRoles && <span className="ml-2 capitalize opacity-70">({player.role})</span>}
                </Badge>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

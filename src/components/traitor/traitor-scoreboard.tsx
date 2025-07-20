"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Shield, Zap, Users, Moon, Sun, Vote, RotateCcw, Trophy } from "lucide-react"
import { CelebrationEffects } from "@/components/celebration-effects"
import type { TraitorGameState, TraitorPlayer } from "@/types/traitor"

interface TraitorScoreboardProps {
  gameState: TraitorGameState
  onUpdateGameState: (newState: TraitorGameState) => void
  onRestart: () => void
}

const roleIcons = {
  mafia: Zap,
  detective: Eye,
  doctor: Shield,
  civilian: Users,
}

const roleColors = {
  mafia: "bg-red-500",
  detective: "bg-blue-500",
  doctor: "bg-green-500",
  civilian: "bg-gray-500",
}

export function TraitorScoreboard({ gameState, onUpdateGameState, onRestart }: TraitorScoreboardProps) {
  /* ------------------------------------------------------------------ */
  /* State                                                               */
  /* ------------------------------------------------------------------ */
  const [showRoles, setShowRoles] = useState(true)
  const [mafiaTarget, setMafiaTarget] = useState<string>("")
  const [doctorProtection, setDoctorProtection] = useState<string>("")
  const [detectiveInvestigation, setDetectiveInvestigation] = useState<string>("")
  const [showCelebration, setShowCelebration] = useState(false)

  /* ------------------------------------------------------------------ */
  /* Safe defaults for first render                                      */
  /* ------------------------------------------------------------------ */
  const phase: "day" | "voting" | "night" = gameState.phase ?? "day"
  const round: number = gameState.round ?? 1
  const nightActions = gameState.nightActions ?? {}
  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  const alivePlayers = gameState.players.filter((p) => p.isAlive)
  const mafiaCount = alivePlayers.filter((p) => p.role === "mafia").length
  const townCount = alivePlayers.filter((p) => p.role !== "mafia").length

  const checkWinCondition = (players: TraitorPlayer[]): "mafia" | "town" | null => {
    const alive = players.filter((p) => p.isAlive)
    const aliveMafia = alive.filter((p) => p.role === "mafia").length
    const aliveTown = alive.filter((p) => p.role !== "mafia").length

    if (aliveMafia === 0) return "town"
    if (aliveMafia >= aliveTown) return "mafia"
    return null
  }

  const eliminatePlayer = (playerId: string, reason: "voted" | "mafia") => {
    const newPlayers = gameState.players.map((p) =>
      p.id === playerId ? { ...p, isAlive: false, eliminationReason: reason, isProtected: false } : p,
    )

    const winner = checkWinCondition(newPlayers)
    const newState = { ...gameState, players: newPlayers, winner }

    if (winner) setShowCelebration(true)
    onUpdateGameState(newState)
  }

  const advancePhase = () => {
    let newPhase: "day" | "voting" | "night"
    let newRound = round

    if (phase === "day") newPhase = "voting"
    else if (phase === "voting") newPhase = "night"
    else {
      newPhase = "day"
      newRound += 1
    }

    onUpdateGameState({
      ...gameState,
      phase: newPhase,
      round: newRound,
      nightActions: {},
    })
  }

  const executeNightActions = () => {
    let newPlayers = [...gameState.players]

    // Reset protection
    newPlayers = newPlayers.map((p) => ({ ...p, isProtected: false }))

    // Doctor protection
    if (doctorProtection) {
      newPlayers = newPlayers.map((p) => (p.id === doctorProtection ? { ...p, isProtected: true } : p))
    }

    // Mafia elimination
    if (mafiaTarget) {
      const target = newPlayers.find((p) => p.id === mafiaTarget)
      if (target && !target.isProtected) {
        newPlayers = newPlayers.map((p) =>
          p.id === mafiaTarget ? { ...p, isAlive: false, eliminationReason: "mafia" as const } : p,
        )
      }
    }

    // Detective investigation
    let investigationResult
    if (detectiveInvestigation) {
      const target = newPlayers.find((p) => p.id === detectiveInvestigation)
      if (target) {
        investigationResult = {
          playerId: target.id,
          role: target.role,
        }
      }
    }

    const winner = checkWinCondition(newPlayers)
    if (winner) setShowCelebration(true)

    onUpdateGameState({
      ...gameState,
      players: newPlayers,
      winner,
      nightActions: {
        mafiaTarget,
        doctorProtection,
        detectiveInvestigation,
        investigationResult,
      },
    })

    // Reset selections
    setMafiaTarget("")
    setDoctorProtection("")
    setDetectiveInvestigation("")
  }

  /* ------------------------------------------------------------------ */
  /* Game finished screen                                                */
  /* ------------------------------------------------------------------ */
  if (gameState.winner) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        {showCelebration && (
          <CelebrationEffects
            message={`${gameState.winner === "mafia" ? "Mafia" : "Town"} Wins!`}
            onComplete={() => setShowCelebration(false)}
          />
        )}

        <Card>
          <CardContent className="space-y-6 p-8 text-center">
            <Trophy className="mx-auto h-16 w-16 text-yellow-500" />
            <h2 className="text-3xl font-bold">{gameState.winner === "mafia" ? "Mafia" : "Town"} Wins!</h2>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Final Roles:</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {gameState.players.map((player) => {
                  const RoleIcon = roleIcons[player.role]
                  return (
                    <div key={player.id} className="space-y-2 text-center">
                      <div
                        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${roleColors[player.role]}`}
                      >
                        <RoleIcon className="h-6 w-6 text-white" />
                      </div>
                      <p className="font-medium">{player.name}</p>
                      <Badge variant={player.isAlive ? "default" : "secondary"}>{player.role}</Badge>
                    </div>
                  )
                })}
              </div>
            </div>

            <Button onClick={onRestart} size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  /* ------------------------------------------------------------------ */
  /* Main scoreboard                                                     */
  /* ------------------------------------------------------------------ */
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Game Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {phase === "day" && <Sun className="h-5 w-5 text-yellow-500" />}
              {phase === "voting" && <Vote className="h-5 w-5 text-blue-500" />}
              {phase === "night" && <Moon className="h-5 w-5 text-purple-500" />}
              {`Round ${round} – ${phase.charAt(0).toUpperCase() + phase.slice(1)}`}
            </CardTitle>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="show-roles">Show Roles</Label>
                <Switch id="show-roles" checked={showRoles} onCheckedChange={setShowRoles} />
              </div>
              <Button variant="outline" onClick={onRestart}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-red-500">{mafiaCount}</p>
              <p className="text-sm text-muted-foreground">Mafia Alive</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">{townCount}</p>
              <p className="text-sm text-muted-foreground">Town Alive</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{alivePlayers.length}</p>
              <p className="text-sm text-muted-foreground">Total Alive</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players */}
      <Card>
        <CardHeader>
          <CardTitle>Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {gameState.players.map((player) => {
              const RoleIcon = roleIcons[player.role]
              return (
                <div
                  key={player.id}
                  className={`rounded-lg border p-4 ${
                    player.isAlive ? "bg-card" : "bg-muted opacity-60"
                  } ${player.isProtected ? "ring-2 ring-green-500" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    {showRoles && (
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${roleColors[player.role]}`}
                      >
                        <RoleIcon className="h-4 w-4 text-white" />
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="font-medium">{player.name}</p>
                      <div className="mt-1 flex gap-2">
                        <Badge variant={player.isAlive ? "default" : "secondary"}>
                          {player.isAlive ? "Alive" : "Dead"}
                        </Badge>
                        {showRoles && <Badge variant="outline">{player.role}</Badge>}
                        {player.isProtected && <Badge variant="secondary">Protected</Badge>}
                      </div>
                    </div>

                    {player.isAlive && phase === "voting" && (
                      <Button size="sm" variant="destructive" onClick={() => eliminatePlayer(player.id, "voted")}>
                        Eliminate
                      </Button>
                    )}
                  </div>

                  {player.eliminationReason && (
                    <p className="mt-2 text-xs text-muted-foreground">Eliminated by: {player.eliminationReason}</p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Night Actions */}
      {phase === "night" && (
        <Card>
          <CardHeader>
            <CardTitle>Night Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mafia */}
            {alivePlayers.some((p) => p.role === "mafia") && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-red-500" />
                  Mafia Target
                </Label>
                <Select value={mafiaTarget} onValueChange={setMafiaTarget}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target to eliminate" />
                  </SelectTrigger>
                  <SelectContent>
                    {alivePlayers
                      .filter((p) => p.role !== "mafia")
                      .map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Doctor */}
            {alivePlayers.some((p) => p.role === "doctor") && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  Doctor Protection
                </Label>
                <Select value={doctorProtection} onValueChange={setDoctorProtection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select player to protect" />
                  </SelectTrigger>
                  <SelectContent>
                    {alivePlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Detective */}
            {alivePlayers.some((p) => p.role === "detective") && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  Detective Investigation
                </Label>
                <Select value={detectiveInvestigation} onValueChange={setDetectiveInvestigation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select player to investigate" />
                  </SelectTrigger>
                  <SelectContent>
                    {alivePlayers
                      .filter((p) => p.role !== "detective")
                      .map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={executeNightActions} className="w-full">
              Execute Night Actions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Investigation Result */}
      {nightActions.investigationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Investigation Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>
                {gameState.players.find((p) => p.id === nightActions.investigationResult?.playerId)?.name}
              </strong>{" "}
              is a <strong className="capitalize">{nightActions.investigationResult.role}</strong>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Phase Control */}
      <Card>
        <CardContent className="p-4">
          <Button onClick={advancePhase} size="lg" className="w-full">
            {phase === "day" && "Start Voting Phase"}
            {phase === "voting" && "Start Night Phase"}
            {phase === "night" && "Start Next Day"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

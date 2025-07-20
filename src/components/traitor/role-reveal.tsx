"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, UserX, Shield, Users, ArrowRight, Heart } from "lucide-react"
import type { TraitorPlayer } from "@/types/traitor"

interface RoleRevealProps {
  player: TraitorPlayer
  playerIndex: number
  totalPlayers: number
  onNext: () => void
}

const ROLE_INFO = {
  mafia: {
    icon: UserX,
    color: "bg-red-600",
    textColor: "text-red-600",
    title: "Mafia Member",
    description: "You are part of the Mafia! Work with your fellow Mafia members to eliminate all other players.",
    objective: "Win by eliminating all Town members (Detective + Doctor + Civilians)",
    abilities: [
      "During Night phase, vote with other Mafia to eliminate someone",
      "During Day phase, blend in and avoid suspicion",
      "You know who the other Mafia members are",
    ],
  },
  detective: {
    icon: Shield,
    color: "bg-blue-600",
    textColor: "text-blue-600",
    title: "Detective",
    description: "You are the Detective! Use your investigation skills to find the Mafia members.",
    objective: "Win by helping eliminate all Mafia members",
    abilities: [
      "During Night phase, investigate one player to learn their role",
      "During Day phase, use your information to guide discussions",
      "You are part of the Town team",
    ],
  },
  doctor: {
    icon: Heart,
    color: "bg-green-600",
    textColor: "text-green-600",
    title: "Doctor",
    description: "You are the Doctor! Use your medical skills to protect players from elimination.",
    objective: "Win by helping eliminate all Mafia members",
    abilities: [
      "During Night phase, protect one player from being eliminated",
      "During Day phase, participate in discussions and voting",
      "You are part of the Town team",
    ],
  },
  civilian: {
    icon: Users,
    color: "bg-gray-600",
    textColor: "text-gray-600",
    title: "Civilian",
    description: "You are a Civilian! Work with the Detective and Doctor to find and eliminate the Mafia.",
    objective: "Win by helping eliminate all Mafia members",
    abilities: [
      "During Day phase, participate in discussions and voting",
      "Use logic and observation to identify suspicious behavior",
      "You are part of the Town team",
    ],
  },
}

export function RoleReveal({ player, playerIndex, totalPlayers, onNext }: RoleRevealProps) {
  const [roleRevealed, setRoleRevealed] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const roleInfo = ROLE_INFO[player.role]
  const RoleIcon = roleInfo.icon

  const handlePressStart = () => {
    setIsPressed(true)
    setRoleRevealed(true)
  }

  const handlePressEnd = () => {
    setIsPressed(false)
    setRoleRevealed(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-2xl md-elevation-8 border-0 bg-white dark:bg-slate-800">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {playerIndex + 1}
            </div>
            <CardTitle className="md-headline-5 text-slate-800 dark:text-slate-100 font-medium">
              {player.name}
            </CardTitle>
          </div>
          <p className="md-body-2 text-slate-600 dark:text-slate-400">
            Player {playerIndex + 1} of {totalPlayers}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="md-body-1 text-slate-700 dark:text-slate-300 mb-6">
              Press and hold the button below to reveal your secret role. Make sure no one else is looking!
            </p>

            <Button
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              size="lg"
              className={`md-button ${isPressed ? roleInfo.color : "bg-slate-600"} hover:opacity-90 text-white py-4 px-8 rounded-xl md-ripple md-elevation-2 hover:md-elevation-4 transition-all duration-200 select-none`}
            >
              {roleRevealed ? <EyeOff className="w-5 h-5 mr-2" /> : <Eye className="w-5 h-5 mr-2" />}
              {roleRevealed ? "Release to Hide" : "Press & Hold to Reveal"}
            </Button>
          </div>

          {roleRevealed && (
            <Card
              className={`border-0 md-elevation-2 animate-fade-in-scale bg-gradient-to-r ${
                player.role === "mafia"
                  ? "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900"
                  : player.role === "detective"
                    ? "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
                    : player.role === "doctor"
                      ? "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
                      : "from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900"
              }`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${roleInfo.color} rounded-full flex items-center justify-center`}>
                    <RoleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="md-headline-6 font-medium text-slate-800 dark:text-slate-100">{roleInfo.title}</h3>
                    <Badge className={`${roleInfo.color} text-white mt-1`}>Your Role</Badge>
                  </div>
                </div>

                <p className="md-body-1 text-slate-700 dark:text-slate-300 text-center">{roleInfo.description}</p>

                <div className="space-y-3">
                  <h4 className="md-subtitle-1 font-medium text-slate-800 dark:text-slate-100">Your Objective:</h4>
                  <p className="md-body-2 text-slate-600 dark:text-slate-400">{roleInfo.objective}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="md-subtitle-1 font-medium text-slate-800 dark:text-slate-100">Your Abilities:</h4>
                  <ul className="space-y-2">
                    {roleInfo.abilities.map((ability, index) => (
                      <li key={index} className="md-body-2 text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                        {ability}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center pt-4">
            <Button
              onClick={onNext}
              size="lg"
              className="md-button bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-4 px-8 rounded-xl md-ripple md-elevation-2 hover:md-elevation-4 transition-all duration-200"
            >
              {playerIndex === totalPlayers - 1 ? "Pass to Moderator" : "Next Player"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="md-caption text-slate-500 dark:text-slate-400 mt-3">
              {playerIndex === totalPlayers - 1
                ? "Please pass the phone back to the Moderator"
                : `Pass the device to the next player`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

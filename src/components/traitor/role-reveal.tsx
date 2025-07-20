
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-2xl border-0 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {playerIndex + 1}
            </div>
            <CardTitle className="text-xl font-bold text-white">
              {player.name}
            </CardTitle>
          </div>
          <p className="text-sm text-slate-400">
            Player {playerIndex + 1} of {totalPlayers}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-base text-slate-300 mb-6">
              Press and hold the button below to reveal your secret role. Make sure no one else is looking!
            </p>

            <Button
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              size="lg"
              className={`w-48 ${isPressed ? roleInfo.color : "bg-slate-600"} hover:opacity-90 text-white py-4 px-8 rounded-xl transition-all duration-200 select-none`}
            >
              {roleRevealed ? <EyeOff className="w-5 h-5 mr-2" /> : <Eye className="w-5 h-5 mr-2" />}
              {roleRevealed ? "Release to Hide" : "Press & Hold"}
            </Button>
          </div>

          {roleRevealed && (
            <Card
              className={`border-0 animate-fade-in-scale bg-slate-700/30 border-slate-600/50`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${roleInfo.color} rounded-full flex items-center justify-center`}>
                    <RoleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white">{roleInfo.title}</h3>
                    <Badge className={`${roleInfo.color} text-white mt-1`}>Your Role</Badge>
                  </div>
                </div>

                <p className="text-base text-slate-300 text-center">{roleInfo.description}</p>

                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-white">Your Objective:</h4>
                  <p className="text-sm text-slate-400">{roleInfo.objective}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-white">Your Abilities:</h4>
                  <ul className="space-y-2">
                    {roleInfo.abilities.map((ability, index) => (
                      <li key={index} className="text-sm text-slate-400 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mt-1.5 flex-shrink-0"></div>
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
              className="bg-gradient-to-r from-purple-600 to-blue-700 hover:opacity-90 text-white py-4 px-8 rounded-xl transition-all duration-200"
            >
              {playerIndex === totalPlayers - 1 ? "Pass to Moderator" : "Next Player"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-xs text-slate-500 mt-3">
              {playerIndex === totalPlayers - 1
                ? "Please pass the device back to the Moderator"
                : `Pass the device to the next player`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

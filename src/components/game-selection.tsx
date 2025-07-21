"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Spade, Users, Trophy, Play, Clock } from "lucide-react"
import Link from "next/link"

const games = [
  {
    id: "kachuful",
    title: "Kachuful",
    description: "Strategic bidding card game with trump suits. Track bids, tricks, and scores with precision.",
    icon: Spade,
    color: "from-slate-600 to-slate-800",
    players: "2-10 Players",
    duration: "30-60 min",
    difficulty: "Advanced",
    href: "/kachuful",
  },
  {
    id: "hearts",
    title: "Hearts",
    description: "Classic trick-taking game. Avoid hearts and the Queen of Spades to achieve the lowest score.",
    icon: Heart,
    color: "from-red-500 to-red-700",
    players: "3-5 Players",
    duration: "20-45 min",
    difficulty: "Intermediate",
    href: "/hearts",
  },
  {
    id: "traitor",
    title: "Traitor",
    description: "Social deduction game where Mafia members try to eliminate all other players while staying hidden.",
    icon: Users,
    color: "from-red-600 to-red-800",
    players: "5-20 Players",
    duration: "20-45 min",
    difficulty: "Easy",
    href: "/traitor",
  },
]

export function GameSelection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {games.map((game, index) => {
        const IconComponent = game.icon
        return (
          <Card
            key={game.id}
            className="game-card bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500 animate-fade-in-scale"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Difficulty</div>
                  <div className="text-sm font-medium text-slate-200">{game.difficulty}</div>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">{game.title}</CardTitle>
              <CardDescription className="text-slate-300 text-base leading-relaxed">{game.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Game Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>{game.players}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>{game.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <Trophy className="w-4 h-4" />
                  <span>Score Tracking</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                asChild
                className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
              >
                <Link href={game.href} className="flex items-center justify-center space-x-3">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Start {game.title}</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

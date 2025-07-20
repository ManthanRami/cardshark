"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdBanner } from "@/components/ad-banner"
import { Heart, Spade, Play, Trophy, Users, Gamepad2, Ghost } from "lucide-react" // Added Shield and Ghost for Traitor game
import Link from "next/link"

const games = [
  {
    id: "kachuful",
    title: "Kachuful",
    description: "Strategic bidding card game with trump suits. Track bids, tricks, and scores with precision.",
    icon: Spade,
    color: "from-slate-600 to-slate-800",
    players: "2-10 Players",
    difficulty: "Advanced",
    href: "/kachuful",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "hearts",
    title: "Hearts",
    description: "Classic trick-taking game. Avoid hearts and the Queen of Spades to achieve the lowest score.",
    icon: Heart,
    color: "from-red-500 to-red-700",
    players: "3-5 Players",
    difficulty: "Intermediate",
    href: "/hearts",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "traitor",
    title: "Traitor",
    description: "A social deduction game of hidden roles, deception, and strategy. Unmask the traitors!",
    icon: Ghost, // Using Ghost icon for Traitor
    color: "from-purple-700 to-indigo-900", // A darker, more mysterious color
    players: "5-20 Players",
    difficulty: "Intermediate",
    href: "/traitor",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(106,90,205,0.3),transparent_50%)]" />
        {/* Replaced yellow with a subtle purple/blue gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,90,220,0.1)_50%,transparent_75%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Scoreboard Hub
                </h1>
                <p className="text-sm text-slate-400">Digital scoreboards for card games</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-scale">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Choose Your Game
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Experience the ultimate digital scoreboard for your favorite card games. Track scores, manage players, and
            enhance your game night with our modern interface.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {games.map((game, index) => {
            const IconComponent = game.icon
            return (
              <Card
                key={game.id}
                className="game-card bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-500"
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
                  <CardDescription className="text-slate-300 text-base leading-relaxed">
                    {game.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Game Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>{game.players}</span>
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

        {/* Ad Banner */}
        <div className="mb-12">
          <AdBanner className="max-w-4xl mx-auto" />
        </div>

        {/* Features Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">Why Choose Scoreboard Hub?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-white mb-3 text-lg">Fast & Intuitive</h4>
              <p className="text-slate-300 leading-relaxed">
                Quick setup and seamless score tracking for uninterrupted gameplay
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-white mb-3 text-lg">Multi-Player Support</h4>
              <p className="text-slate-300 leading-relaxed">
                Support for 2-10 players with customizable game configurations
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-white mb-3 text-lg">Game Night Ready</h4>
              <p className="text-slate-300 leading-relaxed">
                Perfect for family gatherings and competitive tournaments
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-slate-400">
            <p className="mb-2">© 2024 Scoreboard Hub. Built for game night enthusiasts.</p>
            <p className="text-sm">Made with ❤️ for card game lovers everywhere</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

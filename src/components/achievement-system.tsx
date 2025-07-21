"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Zap, Star, Crown, Award } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

interface AchievementSystemProps {
  gameType: "kachuful" | "hearts"
  playerStats: {
    gamesPlayed: number
    gamesWon: number
    perfectRounds: number
    totalScore: number
    moonShots?: number
    perfectBids?: number
  }
}

export function AchievementSystem({ gameType, playerStats }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [newUnlocks, setNewUnlocks] = useState<Achievement[]>([])

  useEffect(() => {
    const baseAchievements: Achievement[] = [
      {
        id: "first-game",
        title: "Getting Started",
        description: "Play your first game",
        icon: <Star className="w-5 h-5" />,
        unlocked: playerStats.gamesPlayed >= 1,
      },
      {
        id: "first-win",
        title: "Victory!",
        description: "Win your first game",
        icon: <Trophy className="w-5 h-5" />,
        unlocked: playerStats.gamesWon >= 1,
      },
      {
        id: "veteran",
        title: "Veteran Player",
        description: "Play 10 games",
        icon: <Award className="w-5 h-5" />,
        unlocked: playerStats.gamesPlayed >= 10,
        progress: Math.min(playerStats.gamesPlayed, 10),
        maxProgress: 10,
      },
      {
        id: "champion",
        title: "Champion",
        description: "Win 5 games",
        icon: <Crown className="w-5 h-5" />,
        unlocked: playerStats.gamesWon >= 5,
        progress: Math.min(playerStats.gamesWon, 5),
        maxProgress: 5,
      },
    ]

    if (gameType === "hearts") {
      baseAchievements.push(
        {
          id: "moon-shooter",
          title: "Moon Shooter",
          description: "Successfully shoot the moon",
          icon: <Target className="w-5 h-5" />,
          unlocked: (playerStats.moonShots || 0) >= 1,
        },
        {
          id: "lunar-master",
          title: "Lunar Master",
          description: "Shoot the moon 3 times",
          icon: <Zap className="w-5 h-5" />,
          unlocked: (playerStats.moonShots || 0) >= 3,
          progress: Math.min(playerStats.moonShots || 0, 3),
          maxProgress: 3,
        },
      )
    }

    if (gameType === "kachuful") {
      baseAchievements.push(
        {
          id: "perfect-bidder",
          title: "Perfect Bidder",
          description: "Make 5 perfect bids in a row",
          icon: <Target className="w-5 h-5" />,
          unlocked: (playerStats.perfectBids || 0) >= 5,
          progress: Math.min(playerStats.perfectBids || 0, 5),
          maxProgress: 5,
        },
        {
          id: "bid-master",
          title: "Bid Master",
          description: "Score over 100 points in a single game",
          icon: <Zap className="w-5 h-5" />,
          unlocked: playerStats.totalScore >= 100,
        },
      )
    }

    // Check for new unlocks
    const previousAchievements = achievements
    const newlyUnlocked = baseAchievements.filter(
      (achievement) =>
        achievement.unlocked && !previousAchievements.find((prev) => prev.id === achievement.id && prev.unlocked),
    )

    if (newlyUnlocked.length > 0) {
      setNewUnlocks(newlyUnlocked)
      setTimeout(() => setNewUnlocks([]), 5000)
    }

    setAchievements(baseAchievements)
  }, [playerStats, gameType])

  return (
    <>
      {/* Achievement Notifications */}
      {newUnlocks.map((achievement, index) => (
        <div
          key={achievement.id}
          className="fixed top-4 right-4 z-50 animate-slide-in-down"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <Card className="md-elevation-8 border-0 bg-gradient-to-r from-green-900/30 to-blue-900/30 achievement-badge">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white">
                  {achievement.icon}
                </div>
                <div>
                  <p className="md-subtitle-2 font-medium text-green-200">Achievement Unlocked!</p>
                  <p className="md-body-2 text-green-300">{achievement.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Achievement Progress (can be shown in a modal or sidebar) */}
      <div className="hidden">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="flex items-center gap-3 p-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                achievement.unlocked
                  ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400"
              }`}
            >
              {achievement.icon}
            </div>
            <div className="flex-1">
              <p className="md-body-2 font-medium">{achievement.title}</p>
              <p className="md-caption text-slate-500">{achievement.description}</p>
              {achievement.maxProgress && (
                <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%` }}
                  />
                </div>
              )}
            </div>
            {achievement.unlocked && <Badge className="bg-green-500 text-white">Unlocked</Badge>}
          </div>
        ))}
      </div>
    </>
  )
}

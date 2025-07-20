"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"

interface ChartData {
  name: string
  score: number
}

interface RaceToVictoryChartProps {
  data: ChartData[]
}

export function RaceToVictoryChart({ data }: RaceToVictoryChartProps) {
  const maxScore = Math.max(...data.map((d) => d.score), 100)
  const sortedData = [...data].sort((a, b) => b.score - a.score)

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-purple-400" />
          Race to Victory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedData.map((player, index) => {
            const percentage = maxScore > 0 ? (player.score / maxScore) * 100 : 0
            const isLeader = index === 0 && player.score > 0

            return (
              <div key={player.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                        isLeader
                          ? "bg-gradient-to-r from-purple-500 to-blue-600"
                          : "bg-gradient-to-r from-slate-500 to-slate-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="font-medium text-white">{player.name}</span>
                    {isLeader && <Trophy className="w-4 h-4 text-purple-400" />}
                  </div>
                  <span className="font-bold text-white">{player.score}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      isLeader
                        ? "bg-gradient-to-r from-purple-500 to-blue-600"
                        : "bg-gradient-to-r from-slate-500 to-slate-600"
                    }`}
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

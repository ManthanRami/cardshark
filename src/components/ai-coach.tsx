"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Brain, Loader2 } from "lucide-react"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

interface AICoachProps {
  playerName: string
  gameType: "kachuful" | "hearts"
  playerData: {
    totalScore: number
    rounds: any[]
    currentRound: number
  }
}

export function AICoach({ playerName, gameType, playerData }: AICoachProps) {
  const [advice, setAdvice] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const getAdvice = async () => {
    setIsLoading(true)
    try {
      const gameContext =
        gameType === "kachuful"
          ? `Kachuful is a bidding game where players bid on tricks they think they can take. If bid equals tricks taken, score = 10 + bid, otherwise score = 0.`
          : `Hearts is a trick-avoidance game where players try to avoid hearts (1 point each) and Queen of Spades (13 points). Lowest score wins. Game ends at 100 points.`

      const prompt = `You are an AI coach for card games. Analyze ${playerName}'s performance in ${gameType}:

Game Rules: ${gameContext}

Player Stats:
- Current Total Score: ${playerData.totalScore}
- Current Round: ${playerData.currentRound}
- Round History: ${JSON.stringify(playerData.rounds.slice(-5))} (last 5 rounds)

Provide a brief, helpful tip (2-3 sentences) based on their performance pattern. Be encouraging and specific.`

      const { text } = await generateText({
        model: xai("grok-3"),
        prompt,
        system: "You are a helpful card game coach. Keep advice concise, encouraging, and actionable.",
      })

      setAdvice(text)
    } catch (error) {
      setAdvice("Unable to generate advice at the moment. Keep playing strategically!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && !advice && !isLoading) {
      getAdvice()
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2 bg-transparent">
          <Brain className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-sm">AI Coach for {playerName}</span>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing your gameplay...
              </div>
            ) : advice ? (
              <div className="text-sm text-slate-700 dark:text-slate-300">{advice}</div>
            ) : (
              <div className="text-sm text-slate-500">Click to get personalized advice!</div>
            )}

            {advice && !isLoading && (
              <Button onClick={getAdvice} variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                Get New Advice
              </Button>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

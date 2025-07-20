"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdBanner } from "@/components/ad-banner"
import { ArrowLeft, Spade, Construction } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SpadesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Spades Scoreboard</h1>
              <p className="text-slate-600 dark:text-slate-400">Partnership bidding game</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <div className="max-w-2xl mx-auto">
          <Card className="md-elevation-4 border-0 bg-white dark:bg-slate-800">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-black rounded-2xl flex items-center justify-center mb-4 mx-auto md-elevation-2">
                <Spade className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="md-headline-5 text-slate-800 dark:text-slate-100 font-medium">
                Coming Soon!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <Construction className="w-12 h-12 text-slate-400 mx-auto" />
              <div className="space-y-4">
                <p className="md-body-1 text-slate-600 dark:text-slate-400">
                  The Spades scoreboard is currently under development. We're working hard to bring you the best
                  partnership bidding experience!
                </p>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 md-elevation-1">
                  <h3 className="md-subtitle-1 font-medium text-slate-800 dark:text-slate-100 mb-2">
                    Planned Features:
                  </h3>
                  <ul className="md-body-2 text-slate-600 dark:text-slate-400 space-y-1 text-left">
                    <li>• Partnership play (North/South vs East/West)</li>
                    <li>• Bidding and trick tracking</li>
                    <li>• Bag penalty system</li>
                    <li>• Nil and blind nil bids</li>
                    <li>• Score to 500 points</li>
                  </ul>
                </div>
              </div>
              <Button
                onClick={() => router.push("/")}
                className="md-button bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-3 px-6 rounded-xl md-ripple md-elevation-2 hover:md-elevation-4"
              >
                Back to Game Selection
              </Button>
            </CardContent>
          </Card>
        </div>

        <AdBanner className="mt-8" />
      </div>
    </div>
  )
}


"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { AdBanner } from "@/components/ad-banner"
import { ArrowLeft, RotateCcw } from "lucide-react"

interface GamePageLayoutProps {
  children: React.ReactNode
  gameTitle: string
  gameDescription: string
  gameIcon: React.ReactNode
  showNewGameButton: boolean
  onNewGame: () => void
  isGameActive: boolean
}

export function GamePageLayout({
  children,
  gameTitle,
  gameDescription,
  gameIcon,
  onNewGame,
  isGameActive,
}: GamePageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800/20 to-slate-900 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,90,220,0.2),transparent_50%)]" />
      </div>

      <header className="relative z-10 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                <Link href="/" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Hub</span>
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center">
                  {gameIcon}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{gameTitle}</h1>
                  <p className="text-sm text-slate-400">{gameDescription}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isGameActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNewGame}
                  className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8">
        {children}
        {isGameActive && (
          <div className="mt-8">
            <AdBanner />
          </div>
        )}
      </main>
    </div>
  )
}

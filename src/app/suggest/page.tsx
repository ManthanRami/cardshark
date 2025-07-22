"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Lightbulb, Send } from "lucide-react"

export default function SuggestPage() {
  const [gameName, setGameName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameName, description }),
      })

      if (response.ok) {
        toast({
          title: "Suggestion sent!",
          description: "Thanks for your feedback. We'll take a look at your suggestion.",
        })
        setGameName("")
        setDescription("")
      } else {
        throw new Error("Failed to submit suggestion")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-950/20 to-slate-900 text-white">
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
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-700 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Suggest a Game</h1>
                  <p className="text-sm text-slate-400">Help us expand our collection</p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">What game should we add next?</CardTitle>
              <CardDescription className="text-slate-400">
                We're always looking for new and exciting card games to add to the hub. If you have a favorite that's
                not on our list, please let us know!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="game-name" className="text-slate-300">
                    Game Name
                  </Label>
                  <Input
                    id="game-name"
                    placeholder="e.g., Euchre, Canasta, etc."
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    required
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">
                    Brief Description or Rules Link
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe how the game is played or scored, or provide a link to the rules."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[120px]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-700 hover:opacity-90 text-white py-4 text-lg font-semibold rounded-xl"
                >
                  {isSubmitting ? "Submitting..." : "Send Suggestion"}
                  {!isSubmitting && <Send className="w-5 h-5 ml-2" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

import type { HeartsGameState } from "@/types/hearts"
import type { KachufulGameState } from "@/types/kachuful"
import type { TraitorGameState } from "@/types/traitor"
import type { SpadesGameState } from "@/types/spades"
import type { BridgeGameState } from "@/types/bridge"
import type { CribbageGameState } from "@/types/cribbage"

export type GameType = "hearts" | "kachuful" | "traitor" | "spades" | "bridge" | "cribbage"
export type GameState =
  | HeartsGameState
  | KachufulGameState
  | TraitorGameState
  | SpadesGameState
  | BridgeGameState
  | CribbageGameState

export interface StoredGame {
  id: string
  type: GameType
  name: string
  state: GameState
  createdAt: Date
  updatedAt: Date
}

export interface GameStats {
  gamesPlayed: number
  wins: number
  averageScore: number
  bestScore: number
  lastPlayed: Date
}

export interface PlayerStats {
  [playerName: string]: {
    [gameType in GameType]?: GameStats
  }
}

const STORAGE_KEYS = {
  GAMES: "scoreboard-hub-games",
  STATS: "scoreboard-hub-stats",
  SETTINGS: "scoreboard-hub-settings",
} as const

export function saveGame(game: StoredGame): void {
  try {
    const games = getStoredGames()
    const existingIndex = games.findIndex((g) => g.id === game.id)

    if (existingIndex >= 0) {
      games[existingIndex] = { ...game, updatedAt: new Date() }
    } else {
      games.push(game)
    }

    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games))
  } catch (error) {
    console.error("Failed to save game:", error)
  }
}

export function getStoredGames(): StoredGame[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GAMES)
    if (!stored) return []

    const games = JSON.parse(stored)
    return games.map((game: any) => ({
      ...game,
      createdAt: new Date(game.createdAt),
      updatedAt: new Date(game.updatedAt),
    }))
  } catch (error) {
    console.error("Failed to load games:", error)
    return []
  }
}

export function deleteGame(gameId: string): void {
  try {
    const games = getStoredGames().filter((g) => g.id !== gameId)
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games))
  } catch (error) {
    console.error("Failed to delete game:", error)
  }
}

export function updatePlayerStats(
  playerName: string,
  gameType: GameType,
  gameResult: {
    score: number
    won: boolean
  },
): void {
  try {
    const stats = getPlayerStats()

    if (!stats[playerName]) {
      stats[playerName] = {}
    }

    if (!stats[playerName][gameType]) {
      stats[playerName][gameType] = {
        gamesPlayed: 0,
        wins: 0,
        averageScore: 0,
        bestScore: gameType === "hearts" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY,
        lastPlayed: new Date(),
      }
    }

    const playerGameStats = stats[playerName][gameType]!
    const newGamesPlayed = playerGameStats.gamesPlayed + 1
    const newWins = playerGameStats.wins + (gameResult.won ? 1 : 0)
    const newAverageScore =
      (playerGameStats.averageScore * playerGameStats.gamesPlayed + gameResult.score) / newGamesPlayed

    let newBestScore = playerGameStats.bestScore
    if (gameType === "hearts") {
      // Lower is better for Hearts
      newBestScore = Math.min(newBestScore, gameResult.score)
    } else {
      // Higher is better for other games
      newBestScore = Math.max(newBestScore, gameResult.score)
    }

    stats[playerName][gameType] = {
      gamesPlayed: newGamesPlayed,
      wins: newWins,
      averageScore: newAverageScore,
      bestScore: newBestScore,
      lastPlayed: new Date(),
    }

    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats))
  } catch (error) {
    console.error("Failed to update player stats:", error)
  }
}

export function getPlayerStats(): PlayerStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS)
    if (!stored) return {}

    const stats = JSON.parse(stored)
    // Convert date strings back to Date objects
    Object.keys(stats).forEach((playerName) => {
      Object.keys(stats[playerName]).forEach((gameType) => {
        if (stats[playerName][gameType].lastPlayed) {
          stats[playerName][gameType].lastPlayed = new Date(stats[playerName][gameType].lastPlayed)
        }
      })
    })

    return stats
  } catch (error) {
    console.error("Failed to load player stats:", error)
    return {}
  }
}

// -----------------------------------------------------------------------------
// Legacy helpers kept for backward-compatibility with older components
// -----------------------------------------------------------------------------

export function saveHeartsGame(gameState: HeartsGameState) {
  if (typeof window !== "undefined") {
    localStorage.setItem("hearts-game", JSON.stringify(gameState))
  }
}

export function loadHeartsGame(): HeartsGameState | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("hearts-game")
    return saved ? (JSON.parse(saved) as HeartsGameState) : null
  }
  return null
}

export function saveKachufulGame(gameState: KachufulGameState) {
  if (typeof window !== "undefined") {
    localStorage.setItem("kachuful-game", JSON.stringify(gameState))
  }
}

export function loadKachufulGame(): KachufulGameState | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("kachuful-game")
    return saved ? (JSON.parse(saved) as KachufulGameState) : null
  }
  return null
}

export function clearAllData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error("Failed to clear data:", error)
  }
}

export function exportData(): string {
  try {
    const data = {
      games: getStoredGames(),
      stats: getPlayerStats(),
      exportedAt: new Date().toISOString(),
    }
    return JSON.stringify(data, null, 2)
  } catch (error) {
    console.error("Failed to export data:", error)
    return ""
  }
}

export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData)

    if (data.games) {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(data.games))
    }

    if (data.stats) {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(data.stats))
    }

    return true
  } catch (error) {
    console.error("Failed to import data:", error)
    return false
  }
}

export type TrumpSuit = "spades" | "diamonds" | "clubs" | "hearts"

export interface KachufulPlayerRound {
  bid: number
  tricks: number
  score: number
}

export interface KachufulPlayer {
  name: string
  totalScore: number
  rounds: KachufulPlayerRound[]
}

export interface KachufulRound {
  roundNumber: number
  cards: number
  trumpSuit: TrumpSuit
  playerScores: KachufulPlayerRound[]
}

export interface KachufulGameState {
  players: KachufulPlayer[]
  currentRound: number
  rounds: KachufulRound[]
  deckCount: number
  maxRounds: number
  gameEnded?: boolean
  winner?: KachufulPlayer
}

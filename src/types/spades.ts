export interface SpadesPlayer {
  name: string
  totalScore: number
  bags: number
  rounds: SpadesPlayerRound[]
}

export interface SpadesPlayerRound {
  bid: number
  tricks: number
  score: number
  bags: number
}

export interface SpadesRound {
  roundNumber: number
  playerScores: SpadesPlayerRound[]
}

export interface SpadesGameState {
  players: SpadesPlayer[]
  currentRound: number
  rounds: SpadesRound[]
  targetScore: number
  gameEnded: boolean
  winner: SpadesPlayer | null
}

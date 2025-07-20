export interface HeartsPlayer {
  name: string
  totalScore: number
  rounds: number[]
}

export interface HeartsRound {
  roundNumber: number
  playerScores: number[]
  moonShooter: number | null
}

export interface HeartsGameState {
  players: HeartsPlayer[]
  currentRound: number
  rounds: HeartsRound[]
  deckCount: number
  maxPoints: number
  gameEnded: boolean
  winner: HeartsPlayer | null
}

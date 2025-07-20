export type TraitorRole = "mafia" | "detective" | "doctor" | "civilian"

export interface TraitorPlayer {
  id: string
  name: string
  role: TraitorRole
  isAlive: boolean
  isProtected: boolean
  eliminatedBy?: "vote" | "kill"
  eliminatedRound?: number
}

export interface TraitorRound {
  roundNumber: number
  phase: "day" | "voting" | "night"
  eliminatedPlayer: string | null
  eliminationType: "vote" | "kill" | null
  votes: { [playerId: string]: string }
  nightActions: {
    detectiveInvestigation?: {
      detective: string
      target: string
      result: TraitorRole
    }
    doctorProtection?: {
      doctor: string
      target: string
    }
    mafiaTarget?: {
      target: string
    }
  }
}

export interface TraitorGameState {
  players: TraitorPlayer[]
  rounds: TraitorRound[]
  currentRound: number
  currentPhase: "day" | "voting" | "night"
  gameEnded: boolean
  winner: "mafia" | "town" | null
  roleConfig: {
    mafia: number
    detective: number
    doctor: number
    civilian: number
  }
  gameStarted: boolean
}

export interface TraitorSetup {
  totalPlayers: number
  playerNames: string[]
  roleCount: {
    mafia: number
    detective: number
    doctor: number
    civilian: number
  }
}

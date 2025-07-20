export interface Player {
  id: string;
  name: string;
}

// Hearts types
export interface HeartsPlayer extends Player {
  scores: number[];
  totalScore: number;
}
export interface HeartsGameState {
  players: HeartsPlayer[];
  gameStage: 'setup' | 'playing' | 'finished';
  winner?: HeartsPlayer;
}

// Kachuful types
export interface KachufulPlayer extends Player {
    scores: number[];
    totalScore: number;
}
export interface KachufulRound {
    bids: Record<string, number | null>;
    wins: Record<string, number | null>;
    isComplete: boolean;
}
export interface KachufulGameState {
    players: KachufulPlayer[];
    rounds: KachufulRound[];
    gameStage: 'setup' | 'playing' | 'finished';
    winner?: KachufulPlayer;
    currentRound: number;
}

// Traitor types
export type PlayerRole = 'Faithful' | 'Traitor';
export type PlayerStatus = 'Alive' | 'Murdered' | 'Banished';
export interface TraitorPlayer extends Player {
  role: PlayerRole;
  status: PlayerStatus;
}
export interface TraitorGameState {
  players: TraitorPlayer[];
  gameStage: 'setup' | 'playing'| 'finished';
}

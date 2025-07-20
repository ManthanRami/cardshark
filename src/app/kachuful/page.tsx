'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { KachufulGameState, KachufulPlayer, KachufulRound } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, UserPlus, Crown, Trash2, CheckCircle, ArrowRightCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const MAX_ROUNDS = 5;

const initialGameState: KachufulGameState = {
  players: [],
  rounds: Array(MAX_ROUNDS).fill(null).map(() => ({ bids: {}, wins: {}, isComplete: false })),
  gameStage: 'setup',
  winner: undefined,
  currentRound: 0,
};

export default function KachufulPage() {
  const [gameState, setGameState, isLoaded] = useLocalStorage<KachufulGameState>(
    'kachufulGameState',
    initialGameState
  );
  const [newPlayerName, setNewPlayerName] = useState('');

  const { players, rounds, gameStage, winner, currentRound } = gameState;

  const handleAddPlayer = () => {
    if (newPlayerName.trim() && players.length < 8) {
      const newPlayer: KachufulPlayer = {
        id: crypto.randomUUID(),
        name: newPlayerName.trim(),
        scores: Array(MAX_ROUNDS).fill(0),
        totalScore: 0,
      };
      setGameState(prev => ({ ...prev, players: [...prev.players, newPlayer] }));
      setNewPlayerName('');
    }
  };

  const handleStartGame = () => {
    if (players.length >= 2) {
      setGameState(prev => ({ ...prev, gameStage: 'playing' }));
    }
  };

  const handleScoreRound = () => {
    const roundData = rounds[currentRound];
    const updatedPlayers = [...players];
    let roundComplete = true;

    players.forEach(p => {
        const bid = roundData.bids[p.id];
        const win = roundData.wins[p.id];
        if (bid === null || win === null || bid === undefined || win === undefined) {
            roundComplete = false;
        }
    });

    if (!roundComplete) {
        alert("Please fill in all bids and wins for the current round.");
        return;
    }

    updatedPlayers.forEach(p => {
      const bid = roundData.bids[p.id]!;
      const win = roundData.wins[p.id]!;
      let roundScore = 0;
      if (bid === win) {
        roundScore = 10 + win;
      } else {
        roundScore = win;
      }
      p.scores[currentRound] = roundScore;
      p.totalScore = p.scores.reduce((a, b) => a + b, 0);
    });

    const updatedRounds = [...rounds];
    updatedRounds[currentRound].isComplete = true;
    
    const nextRound = currentRound + 1;
    let newGameStage = gameStage;
    let gameWinner;

    if (nextRound >= MAX_ROUNDS) {
        newGameStage = 'finished';
        gameWinner = [...updatedPlayers].sort((a,b) => b.totalScore - a.totalScore)[0];
    }
    
    setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        rounds: updatedRounds,
        currentRound: nextRound,
        gameStage: newGameStage,
        winner: gameWinner,
    }));
  };

  const updateRoundData = (playerId: string, type: 'bids' | 'wins', value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    const updatedRounds = [...rounds];
    updatedRounds[currentRound][type][playerId] = numValue;
    setGameState(prev => ({ ...prev, rounds: updatedRounds }));
  };

  const resetGame = () => {
    setGameState({
        ...initialGameState,
        players: [],
    });
  };

  if (!isLoaded) {
    return <div className="container mx-auto p-4"><Skeleton className="w-full h-96" /></div>;
  }

  const renderSetup = () => (
    <Card>
      <CardHeader><CardTitle>Game Setup</CardTitle></CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Input type="text" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} placeholder="Enter player name" onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()} className="max-w-xs"/>
          <Button onClick={handleAddPlayer} disabled={players.length >= 8}><UserPlus className="h-4 w-4 mr-2" />Add Player</Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{players.length}/8 players added.</p>
        <div className="space-y-2">
            {players.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                <span className="font-medium">{p.name}</span>
            </div>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartGame} disabled={players.length < 2} size="lg">Start Game</Button>
      </CardFooter>
    </Card>
  );

  const renderGame = () => (
    <>
      {winner && (
        <Alert className="mb-6 border-accent bg-accent/10">
          <Crown className="h-4 w-4 text-accent" />
          <AlertTitle className="text-accent font-bold">Game Over!</AlertTitle>
          <AlertDescription>Congratulations <span className="font-bold">{winner.name}</span>, you are the winner!</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader><CardTitle>Scoreboard</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Player</TableHead>
                  {Array.from({ length: MAX_ROUNDS }).map((_, i) => (
                    <TableHead key={i} className={`text-center ${currentRound === i && gameStage === 'playing' ? 'text-primary font-bold' : ''}`}>R{i + 1}</TableHead>
                  ))}
                  <TableHead className="text-right font-bold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map(p => (
                  <TableRow key={p.id} className={winner?.id === p.id ? 'bg-accent/20' : ''}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    {p.scores.map((score, i) => (
                      <TableCell key={i} className="text-center">{rounds[i].isComplete ? score : '-'}</TableCell>
                    ))}
                    <TableCell className="text-right font-bold text-lg">{p.totalScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {gameStage === 'playing' && (
        <Card>
          <CardHeader><CardTitle>Round {currentRound + 1} of {MAX_ROUNDS}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {players.map(p => (
              <div key={p.id} className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <label className="font-medium">{p.name}</label>
                <Input type="number" placeholder="Bid" value={rounds[currentRound]?.bids[p.id] ?? ''} onChange={(e) => updateRoundData(p.id, 'bids', e.target.value)} />
                <Input type="number" placeholder="Won" value={rounds[currentRound]?.wins[p.id] ?? ''} onChange={(e) => updateRoundData(p.id, 'wins', e.target.value)} />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={handleScoreRound}>
              {currentRound === MAX_ROUNDS - 1 ? 'Finish Game' : 'Score and Next Round'}
              {currentRound === MAX_ROUNDS - 1 ? <CheckCircle className="h-4 w-4 ml-2" /> : <ArrowRightCircle className="h-4 w-4 ml-2" />}
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Link href="/" className="inline-flex items-center gap-2 text-primary mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" />Back to Game Selection
      </Link>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold font-headline">Kachuful Scoreboard</h1>
        <Button onClick={resetGame} variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-2" />Reset Game</Button>
      </div>
      {gameStage === 'setup' ? renderSetup() : renderGame()}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HeartsGameState, HeartsPlayer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, UserPlus, Crown, Trash2, Moon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const initialGameState: HeartsGameState = {
  players: [],
  gameStage: 'setup',
};

export default function HeartsPage() {
  const [gameState, setGameState, isLoaded] = useLocalStorage<HeartsGameState>(
    'heartsGameState',
    initialGameState
  );
  const [newPlayerName, setNewPlayerName] = useState('');

  const { players, gameStage, winner } = gameState;
  const [roundScores, setRoundScores] = useState<Record<string, string>>({});
  const [moonShooterId, setMoonShooterId] = useState<string | null>(null);

  const handleAddPlayer = () => {
    if (newPlayerName.trim() && players.length < 4) {
      const newPlayer: HeartsPlayer = {
        id: crypto.randomUUID(),
        name: newPlayerName.trim(),
        scores: [],
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

  const handleAddRound = () => {
    const currentRoundScores: Record<string, number> = {};
    let totalPoints = 0;
    let isValid = true;

    players.forEach(p => {
        const score = parseInt(roundScores[p.id] || '0', 10);
        if (isNaN(score)) isValid = false;
        currentRoundScores[p.id] = score;
        totalPoints += score;
    });

    if (!isValid) {
      alert('Please enter valid scores for all players.');
      return;
    }

    if (moonShooterId) {
        // Shoot the moon logic
    } else if (totalPoints !== 26) {
        alert('Total points for a round must be 26.');
        return;
    }

    const updatedPlayers = players.map(p => {
      let scoreForRound = currentRoundScores[p.id];
      if(moonShooterId) {
        scoreForRound = moonShooterId === p.id ? 0 : 26;
      }
      
      const newScores = [...p.scores, scoreForRound];
      const newTotalScore = newScores.reduce((sum, s) => sum + s, 0);
      return { ...p, scores: newScores, totalScore: newTotalScore };
    });

    const newGameState = { ...gameState, players: updatedPlayers };
    
    const potentialWinner = updatedPlayers.find(p => p.totalScore >= 100);
    if(potentialWinner) {
        const sortedPlayers = [...updatedPlayers].sort((a,b) => a.totalScore - b.totalScore);
        newGameState.winner = sortedPlayers[0];
        newGameState.gameStage = 'finished';
    }

    setGameState(newGameState);
    setRoundScores({});
    setMoonShooterId(null);
  };
  
  const resetGame = () => {
    setGameState(initialGameState);
    setRoundScores({});
    setMoonShooterId(null);
  };

  if (!isLoaded) {
    return <div className="container mx-auto p-4"><Skeleton className="w-full h-96" /></div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Link href="/" className="inline-flex items-center gap-2 text-primary mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Game Selection
      </Link>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold font-headline">Hearts Scoreboard</h1>
        <Button onClick={resetGame} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" /> Reset Game
        </Button>
      </div>

      {gameStage === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle>Game Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Input
                type="text"
                value={newPlayerName}
                onChange={e => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                className="max-w-xs"
              />
              <Button onClick={handleAddPlayer} disabled={players.length >= 4}>
                <UserPlus className="h-4 w-4 mr-2" /> Add Player
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{players.length}/4 players added.</p>
            <div className="space-y-2">
              {players.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                  <span className="font-medium">{p.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartGame} disabled={players.length < 2} size="lg">
              Start Game
            </Button>
          </CardFooter>
        </Card>
      )}

      {gameStage !== 'setup' && (
        <>
            {gameStage === 'finished' && winner && (
                <Alert className="mb-6 border-accent bg-accent/10">
                    <Crown className="h-4 w-4 text-accent" />
                    <AlertTitle className="text-accent font-bold">Game Over!</AlertTitle>
                    <AlertDescription>
                        Congratulations <span className="font-bold">{winner.name}</span>, you are the winner with the lowest score!
                    </AlertDescription>
                </Alert>
            )}

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Scoreboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-bold">Player</TableHead>
                                    {players.length > 0 && players[0].scores.map((_, i) => (
                                        <TableHead key={i} className="text-center">R{i + 1}</TableHead>
                                    ))}
                                    <TableHead className="text-right font-bold">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {players.map(p => (
                                    <TableRow key={p.id} className={winner?.id === p.id ? 'bg-accent/20' : ''}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        {p.scores.map((s, i) => (
                                            <TableCell key={i} className="text-center">{s}</TableCell>
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
                    <CardHeader>
                        <CardTitle>Enter Round Scores</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {players.map(p => (
                            <div key={p.id} className="flex items-center gap-4">
                                <label htmlFor={`score-${p.id}`} className="w-1/3 font-medium">{p.name}</label>
                                <Input
                                    id={`score-${p.id}`}
                                    type="number"
                                    value={roundScores[p.id] || ''}
                                    onChange={e => setRoundScores({...roundScores, [p.id]: e.target.value})}
                                    placeholder="Points taken"
                                    disabled={!!moonShooterId && moonShooterId !== p.id}
                                />
                                <Button 
                                    variant={moonShooterId === p.id ? 'default' : 'outline'} 
                                    size="icon" 
                                    onClick={() => setMoonShooterId(moonShooterId === p.id ? null : p.id)}
                                    aria-label={`Shoot the moon for ${p.name}`}
                                >
                                    <Moon className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleAddRound}>Add Round</Button>
                    </CardFooter>
                </Card>
            )}
        </>
      )}
    </div>
  );
}

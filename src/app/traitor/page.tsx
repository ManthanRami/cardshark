'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { TraitorGameState, TraitorPlayer, PlayerRole, PlayerStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserPlus, Trash2, Swords, Shield, Skull, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const initialGameState: TraitorGameState = {
  players: [],
  gameStage: 'setup',
};

export default function TraitorPage() {
  const [gameState, setGameState, isLoaded] = useLocalStorage<TraitorGameState>(
    'traitorGameState',
    initialGameState
  );
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showRoles, setShowRoles] = useState(false);

  const { players, gameStage } = gameState;

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: TraitorPlayer = {
        id: crypto.randomUUID(),
        name: newPlayerName.trim(),
        role: 'Faithful', // Default role
        status: 'Alive',
      };
      setGameState(prev => ({ ...prev, players: [...prev.players, newPlayer] }));
      setNewPlayerName('');
    }
  };

  const handleStartGame = () => {
    if (players.length < 3) {
        alert('You need at least 3 players to start.');
        return;
    }
    // Assign roles: ~20-25% traitors
    const numTraitors = Math.max(1, Math.floor(players.length / 4));
    let assignedTraitors = 0;
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const playersWithRoles = shuffledPlayers.map(p => {
        if (assignedTraitors < numTraitors) {
            assignedTraitors++;
            return { ...p, role: 'Traitor' as PlayerRole, status: 'Alive' as PlayerStatus };
        }
        return { ...p, role: 'Faithful' as PlayerRole, status: 'Alive' as PlayerStatus };
    }).sort((a, b) => a.name.localeCompare(b.name));

    setGameState({
        players: playersWithRoles,
        gameStage: 'playing'
    });
    setShowRoles(true);
  };
  
  const updatePlayerStatus = (playerId: string, status: PlayerStatus) => {
    setGameState(prev => ({
        ...prev,
        players: prev.players.map(p => p.id === playerId ? {...p, status} : p)
    }));

    const alivePlayers = gameState.players.filter(p => p.status === 'Alive' && p.id !== playerId);
    const aliveTraitors = alivePlayers.filter(p => p.role === 'Traitor');
    const aliveFaithfuls = alivePlayers.filter(p => p.role === 'Faithful');
    
    if (aliveTraitors.length === 0) {
        setGameState(prev => ({...prev, gameStage: 'finished'}));
    } else if (aliveTraitors.length >= aliveFaithfuls.length) {
        setGameState(prev => ({...prev, gameStage: 'finished'}));
    }
  };

  const resetGame = () => {
    setGameState(initialGameState);
    setShowRoles(false);
  };

  const renderPlayerBadge = (player: TraitorPlayer) => {
    const roleVisible = showRoles || player.status !== 'Alive';
    if(player.status === 'Murdered') return <Badge variant="destructive"><Skull className="h-3 w-3 mr-1"/>Murdered</Badge>;
    if(player.status === 'Banished') return <Badge variant="secondary"><Shield className="h-3 w-3 mr-1"/>Banished</Badge>;
    if(!roleVisible) return <Badge variant="outline">Hidden</Badge>;
    return player.role === 'Traitor' ? 
      <Badge variant="destructive"><Swords className="h-3 w-3 mr-1"/>Traitor</Badge> : 
      <Badge variant="default" className="bg-blue-600 hover:bg-blue-700"><Shield className="h-3 w-3 mr-1"/>Faithful</Badge>;
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
          <Button onClick={handleAddPlayer}><UserPlus className="h-4 w-4 mr-2" /> Add Player</Button>
        </div>
        <div className="space-y-2">
            {players.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-secondary p-2 rounded-md font-medium">
                {p.name}
            </div>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartGame} disabled={players.length < 3} size="lg">Assign Roles & Start</Button>
      </CardFooter>
    </Card>
  );

  const renderGame = () => {
    const alivePlayers = players.filter(p => p.status === 'Alive');
    const traitorsWon = alivePlayers.filter(p => p.role === 'Traitor').length >= alivePlayers.filter(p => p.role === 'Faithful').length;
    const faithfulsWon = alivePlayers.filter(p => p.role === 'Traitor').length === 0;

    return (
    <>
      {(gameStage === 'finished') && (
        <Alert className="mb-6 border-accent bg-accent/10">
          <Crown className="h-4 w-4 text-accent" />
          <AlertTitle className="text-accent font-bold">Game Over!</AlertTitle>
          <AlertDescription>
            {traitorsWon && "The Traitors have won by achieving a majority!"}
            {faithfulsWon && "The Faithful have won by banishing all Traitors!"}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => setShowRoles(!showRoles)}>
          {showRoles ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {showRoles ? 'Hide Roles' : 'Show Roles'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players.map(p => (
            <Card key={p.id} className={cn("transition-all", p.status !== 'Alive' && 'opacity-50 bg-muted')}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{p.name}</CardTitle>
                    {renderPlayerBadge(p)}
                </CardHeader>
                <CardContent>
                {p.status === 'Alive' && gameStage==='playing' && (
                    <div className="flex gap-2 mt-2">
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="outline" size="sm" className="w-full"><Shield className="h-4 w-4 mr-2"/>Banish</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Banish {p.name}?</AlertDialogTitle></AlertDialogHeader>
                                <AlertDialogDescription>This will reveal their role and remove them from the game. This action cannot be undone.</AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => updatePlayerStatus(p.id, 'Banished')}>Confirm Banishment</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="destructive" size="sm" className="w-full"><Skull className="h-4 w-4 mr-2"/>Murder</Button>
                            </AlertDialogTrigger>
                             <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Murder {p.name}?</AlertDialogTitle></AlertDialogHeader>
                                <AlertDialogDescription>This action should be done by Traitors in secret. This cannot be undone.</AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => updatePlayerStatus(p.id, 'Murdered')} className="bg-destructive hover:bg-destructive/90">Confirm Murder</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
                </CardContent>
            </Card>
        ))}
      </div>
    </>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Link href="/" className="inline-flex items-center gap-2 text-primary mb-4 hover:underline">
        <ArrowLeft className="h-4 w-4" />Back to Game Selection
      </Link>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold font-headline">Traitor Moderator</h1>
        <Button onClick={resetGame} variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-2" />Reset Game</Button>
      </div>
      {gameStage === 'setup' ? renderSetup() : renderGame()}
    </div>
  );
}

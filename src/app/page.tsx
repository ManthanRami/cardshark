import { GameCard } from '@/components/game-card';
import { Heart, Spade, Mask } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl font-headline">
          Choose Your Game
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Select a card game to start tracking scores. All your progress is saved automatically.
        </p>
      </div>
      <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <GameCard
          title="Kachuful"
          description="A strategic trick-taking game. Track your bids and scores with ease."
          href="/kachuful"
          Icon={Spade}
        />
        <GameCard
          title="Hearts"
          description="The classic card game of taking tricks and avoiding hearts. Don't get shot!"
          href="/hearts"
          Icon={Heart}
        />
        <GameCard
          title="Traitor"
          description="A game of deception and deduction. A dashboard for moderators to run the game."
          href="/traitor"
          Icon={Mask}
        />
      </div>
    </div>
  );
}

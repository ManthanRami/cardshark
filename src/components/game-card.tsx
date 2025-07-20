import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
}

export function GameCard({ title, description, href, Icon }: GameCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="flex flex-col h-full transition-all duration-300 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <Icon className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          <CardDescription className="pt-2">{description}</CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto">
          <div className="flex items-center text-sm font-semibold text-primary">
            Start Playing
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

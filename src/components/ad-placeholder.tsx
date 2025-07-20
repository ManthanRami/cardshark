import { Megaphone } from 'lucide-react';

export function AdPlaceholder() {
  return (
    <div className="flex w-full max-w-2xl items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-6 text-center text-muted-foreground">
      <Megaphone className="h-6 w-6 mr-4" />
      <p className="text-sm font-medium">Ad Placeholder - Support CardShark!</p>
    </div>
  );
}

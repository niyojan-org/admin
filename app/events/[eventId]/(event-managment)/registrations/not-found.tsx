import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-lg w-full p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Registrations not found</h2>
          <p className="text-sm text-muted-foreground">The registrations list could not be loaded for this event.</p>
        </div>
        <Button asChild>
          <Link href="/events">Back to events</Link>
        </Button>
      </Card>
    </div>
  );
}

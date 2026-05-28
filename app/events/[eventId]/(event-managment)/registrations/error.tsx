'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-lg w-full p-6 space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Unable to load registrations</h2>
          <p className="text-sm text-muted-foreground">{error?.message || 'Please try again.'}</p>
        </div>
        <Button onClick={() => reset()}>Try again</Button>
      </Card>
    </div>
  );
}

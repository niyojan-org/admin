'use client';

import Icon500 from '@/assets/svg/500';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-dvh items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Icon500 />
            <Button onClick={() => reset()}>Try again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}

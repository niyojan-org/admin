'use client';
import Icon500 from '@/assets/svg/500';
import { Button } from '@/components/ui/button';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center w-full">
      <Icon500 className="sm:h-150 w-full" />
      <div className="bg-card px-5 py-1 font-semibold text-lg rounded-md ">Internal Server Error</div>
      <Button variant="outline" onClick={() => reset()} className="mt-4">
        Try Reseting
      </Button>
    </div>
  );
}

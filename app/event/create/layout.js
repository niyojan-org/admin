import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="h-dvh overflow-hidden pt-10 sm:pt-0 w-full">
      <ScrollArea className="h-full overflow-hidden w-full">
        <div className="flex items-center justify-center py-5 overflow-hidden w-full h-dvh mx-auto px-4">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}

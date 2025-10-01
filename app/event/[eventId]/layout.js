import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function Layout({ children }) {
    return (
        <div className="h-dvh overflow-hidden pt-10 sm:pt-0">
            <ScrollArea className="h-full overflow-hidden">
                <div className="flex items-center justify-center min-h-dvh py-5 overflow-hidden">
                    {children}
                </div>
            </ScrollArea>
        </div>
    );
}

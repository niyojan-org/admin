import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function ContactLayout({ children }) {
    return (
        <div className="h-dvh overflow-hidden pt-10 sm:pt-0">
            <ScrollArea className="h-full px-4 md:px-10 overflow-hidden">
                <div className="flex items-center justify-center min-h-dvh py-5 overflow-hidden">
                    {children}
                </div>
            </ScrollArea>
        </div>
    );
}

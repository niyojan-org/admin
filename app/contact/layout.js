import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function ContactLayout({ children }) {
    return (
        <div className="h-dvh overflow-hidden w-full">
            <ScrollArea className="h-full px-4 md:px-20 overflow-hidden">
                <div className="flex items-center justify-center min-h-dvh overflow-hidden mt-16">
                    {children}
                </div>
            </ScrollArea>
        </div>
    );
}

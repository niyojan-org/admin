import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function ContactLayout({ children }) {
    return (
        <div className="h-dvh overflow-hidden w-full">
            <ScrollArea className="h-full overflow-hidden w-full" innerClassName='px-4'>
                <div className="flex items-center justify-center min-h-dvh overflow-hidden ">
                    {children}
                </div>
            </ScrollArea>
        </div>
    );
}

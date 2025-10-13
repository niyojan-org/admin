import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function Layout({ children }) {
    return (
        <div className="h-dvh overflow-hidden pt-10 sm:pt-0 w-full ">
            <ScrollArea className="h-full overflow-hidden w-full mt-5">
                <div className="flex-1 justify-center px-2 sm:px-10 h-dvh overflow-hidden w-full mx-auto h-full">
                    {children}
                </div>
            </ScrollArea>
        </div>
    );
}

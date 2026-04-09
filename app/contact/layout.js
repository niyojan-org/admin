import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function ContactLayout({ children }) {
    return (
        <div className="h-full overflow-hidden w-full flex items-center justify-center px-5">
            {children}
        </div>
    );
}

'use client';
import { useBanner } from '@/components/banner/banner';
import React, { useEffect } from 'react';

export default function Layout({ children }) {
    const banner = useBanner();
    useEffect(() => {
        banner.clear();
    });

    return (
        <div className="h-full">
            {children}
        </div>
    );
}

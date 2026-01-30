'use client';
import { useBanner } from '@/components/banner/banner';
import ProtectedRoute from '@/components/ProtectedRoute';
import React, { useEffect } from 'react';

export default function Layout({ children }) {
    const banner = useBanner();
    useEffect(() => {
        banner.clear();
    });

    return (
        <ProtectedRoute>
            <div className="h-full">
                {children}
            </div>
        </ProtectedRoute>
    );
}

"use client";

import ProtectedRoute from '@/components/ProtectedRoute';
import { Suspense } from 'react';

export default function MembersLayout({ children }) {
  return (
    <div className="h-full w-full">
      <ProtectedRoute roles={['owner', 'admin']}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          {children}
        </Suspense>
      </ProtectedRoute>
    </div>
  );
}

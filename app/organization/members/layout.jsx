"use client";

import { Suspense } from 'react';

export default function MembersLayout({ children }) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        {children}
      </Suspense>
    </div>
  );
}

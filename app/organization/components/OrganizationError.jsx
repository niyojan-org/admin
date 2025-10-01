'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function OrganizationError({ message = "Failed to load organization data. Please try refreshing the page." }) {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Alert>
        <IconAlertTriangle className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}

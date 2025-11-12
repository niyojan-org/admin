"use client";
import { useOrgStore } from '@/store/orgStore';
import React from 'react';
import Link from 'next/link';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Layout({ children }) {
  const { organization, isVerified } = useOrgStore();
  const router = useRouter();

  if (!organization || !isVerified) {
    return (
      <div className="flex items-center justify-center py-5 overflow-hidden w-full min-h-dvh mx-auto px-4">
        <div className="text-center max-w-md">
          <IconAlertTriangle className="w-14 h-14 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Organization Not Verified</h2>
          <p className="text-muted-foreground">
            Your organization details are incomplete or your organization hasn't been verified yet.
            To create events you must finish the verification process.
          </p>

          <div className="mt-4 flex justify-center gap-3">
            <Button
              asChild
            >
              <Link
                href="/organization"
                className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90"
              >
                Complete Organization Details
              </Link>
            </Button>
            <Button
              onClick={() => router.refresh()}
              variant={'outline'}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-5 overflow-hidden w-full min-h-dvh mx-auto px-4">
      {children}
    </div>
  );
}

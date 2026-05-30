'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ReferralTrackingData {
  _id: string;
  referralCode: string;
  eventId: string;
  userId?: string;
  viewedAt: string;
  registered: boolean;
  registrationId?: string;
}

interface ReferralTrackingModalProps {
  referralCode: string;
  isOpen: boolean;
  onClose: () => void;
  tracking: ReferralTrackingData[];
  isLoading?: boolean;
}

export function ReferralTrackingModal({
  referralCode,
  isOpen,
  onClose,
  tracking,
  isLoading = false,
}: ReferralTrackingModalProps) {
  if (!isOpen) return null;

  const registrationCount = tracking.filter((t) => t.registered).length;
  const viewCount = tracking.length;
  const conversionRate =
    viewCount > 0 ? ((registrationCount / viewCount) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            Tracking Details - {referralCode}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{viewCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {registrationCount}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Registrations
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {conversionRate}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Conversion Rate
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : tracking.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tracking data available yet
            </div>
          ) : (
            <div className="space-y-3">
              {tracking.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      User: {item.userId || 'Anonymous'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.viewedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.registered ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Registered
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Viewed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}

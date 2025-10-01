'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IconBuilding,
  IconMail,
  IconPhone,
  IconMapPin,
  IconStar,
  IconWorld
} from '@tabler/icons-react';

export default function OverviewTab({ orgData }) {
  if (!orgData) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBuilding className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <IconMail className="h-4 w-4" />
            <span className="text-sm">{orgData.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <IconPhone className="h-4 w-4" />
            <span className="text-sm">{orgData.phone}</span>
          </div>
          {orgData.alternativePhone && (
            <div className="flex items-center gap-3">
              <IconPhone className="h-4 w-4" />
              <span className="text-sm">{orgData.alternativePhone}</span>
            </div>
          )}
          {orgData.website && (
            <div className="flex items-center gap-3">
              <IconWorld className="h-4 w-4" />
              <a 
                href={orgData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm hover:text-primary hover:underline"
              >
                {orgData.website}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconMapPin className="h-5 w-5" />
            Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orgData.address ? (
            <div className="text-sm space-y-1">
              <p>{orgData.address.street}</p>
              <p>{orgData.address.city}, {orgData.address.state}</p>
              <p>{orgData.address.country} - {orgData.address.zipCode}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Address not provided</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconStar className="h-5 w-5" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">Events Hosted</span>
            <span className="font-semibold">{orgData.stats?.totalEventsHosted || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Tickets Sold</span>
            <span className="font-semibold">{orgData.stats?.totalTicketsSold || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Revenue</span>
            <span className="font-semibold">₹{orgData.stats?.totalRevenueGenerated || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Rating</span>
            <span className="font-semibold">
              {orgData.rating?.averageRating || 0}/5 ({orgData.rating?.totalRatings || 0})
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

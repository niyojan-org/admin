'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IconCalendar,
  IconUsers,
  IconCurrencyRupee,
  IconShield
} from '@tabler/icons-react';

export default function StatisticsTab({ orgData }) {
  if (!orgData) return null;

  const statsCards = [
    {
      title: "Total Events",
      value: orgData.stats?.totalEventsHosted || 0,
      description: "Events hosted",
      icon: IconCalendar
    },
    {
      title: "Tickets Sold",
      value: orgData.stats?.totalTicketsSold || 0,
      description: "Total registrations",
      icon: IconUsers
    },
    {
      title: "Revenue",
      value: `₹${orgData.stats?.totalRevenueGenerated || 0}`,
      description: "Total earnings",
      icon: IconCurrencyRupee
    },
    {
      title: "Trust Score",
      value: `${orgData.trustScore}/100`,
      description: `Risk level: ${orgData.riskLevel}`,
      icon: IconShield
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

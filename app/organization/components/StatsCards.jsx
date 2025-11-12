"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconCalendarEvent,
  IconTicket,
  IconCash,
  IconTrophy,
} from "@tabler/icons-react";

const StatsCards = ({ stats, trustScore, riskLevel }) => {
  const statsData = [
    {
      title: "Total Events",
      value: stats?.totalEventsHosted || 0,
      description: "Events hosted",
      icon: IconCalendarEvent,
    },
    {
      title: "Tickets Sold",
      value: stats?.totalTicketsSold || 0,
      description: "Total registrations",
      icon: IconTicket,
    },
    {
      title: "Revenue",
      value: `₹${stats?.totalRevenueGenerated || 0}`,
      description: "Total generated",
      icon: IconCash,
    },
    {
      title: "Trust Score",
      value: trustScore || 0,
      description: `Risk: ${riskLevel || "N/A"}`,
      icon: IconTrophy,
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className={'p-0 gap-0'}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-lg sm:text-2xl font-bold truncate">{stat.value}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;

"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const StatsTab = ({ organization }) => {
  const stats = organization.stats || {};

  const statsData = [
    {
      title: "Events Hosted",
      description: "Total events created",
      value: stats.totalEventsHosted || 0,
      color: "text-foreground",
    },
    {
      title: "Tickets Sold",
      description: "Total registrations",
      value: stats.totalTicketsSold || 0,
      color: "text-foreground",
    },
    {
      title: "Revenue Generated",
      description: "Total earnings",
      value: `₹${stats.totalRevenueGenerated || 0}`,
      color: "text-foreground",
    },
    {
      title: "Blocked Events",
      description: "Events blocked by admin",
      value: stats.totalBlockedEvents || 0,
      color: "text-destructive",
    },
    {
      title: "Warnings",
      description: "Total warnings received",
      value: stats.totalWarnings || 0,
      color: "text-orange-500",
    },
    {
      title: "Rating",
      description: `${organization.rating?.totalRatings || 0} ratings`,
      value: (
        <>
          {organization.rating?.averageRating?.toFixed(1) || "0.0"}
          <span className="text-xl text-muted-foreground">/5</span>
        </>
      ),
      color: "text-foreground",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">{stat.title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{stat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatsTab;

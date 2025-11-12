"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const TrustScoreCard = ({ organization }) => {
  const stats = organization.stats || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trust Score</CardTitle>
        <CardDescription>Your organization&apos;s reliability rating</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Trust Score</span>
            <span className="text-2xl font-bold">{organization.trustScore || 0}/100</span>
          </div>
          <Progress value={organization.trustScore || 0} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-sm text-muted-foreground">Risk Level</p>
            <Badge variant={organization.riskLevel === "low" ? "default" : "destructive"}>
              {organization.riskLevel || "N/A"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Warnings</p>
            <p className="text-lg font-semibold">{stats.totalWarnings || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustScoreCard;

"use client";

import React from "react";
import StatsCards from "./StatsCards";
import TrustScoreCard from "./TrustScoreCard";
import EventPreferencesCard from "./EventPreferencesCard";
import SupportContactCard from "./SupportContactCard";

const OverviewTab = ({ organization }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <StatsCards
        stats={organization.stats}
        trustScore={organization.trustScore}
        riskLevel={organization.riskLevel}
      />

      {/* Trust & Verification */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <TrustScoreCard organization={organization} />
        <EventPreferencesCard organization={organization} />
      </div>

      {/* Contact & Support */}
      <SupportContactCard organization={organization} />
    </div>
  );
};

export default OverviewTab;

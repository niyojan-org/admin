"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/store/userStore";
import { useOrganization } from './hooks/useOrganization';
import {
  OrganizationHeader,
  ProfileCompletion,
  OverviewTab,
  DetailsTab,
  StatisticsTab,
  DocumentsTab,
  OrganizationLoading,
  OrganizationError
} from './components';

export default function ProfilePage() {
  const { user } = useUserStore();
  const { orgData, loading, error } = useOrganization();

  if (loading) {
    return <OrganizationLoading />;
  }

  if (error || !orgData) {
    return <OrganizationError message={error} />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      {/* Header Section */}
      <OrganizationHeader orgData={orgData} />

      {/* Profile Completion */}
      <ProfileCompletion orgData={orgData} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab orgData={orgData} />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <DetailsTab orgData={orgData} />
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <StatisticsTab orgData={orgData} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentsTab orgData={orgData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconAlertCircle } from "@tabler/icons-react";

// Import components
import ResponsiveNavigation from "./components/ResponsiveNavigation";
import NoOrganizationFound from "./components/NoOrganizationFound";
import OverviewTab from "./components/OverviewTab";
import DetailsTab from "./components/DetailsTab";
import BankDetailsTab from "./components/BankDetailsTab";
import StatsTab from "./components/StatsTab";
import DocumentsTab from "./components/DocumentsTab";
import SettingsTab from "./components/SettingsTab";

const OrganizationPage = () => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/org/me");

      if (response.data.success && response.data.org) {
        setOrganization(response.data.org);
      } else {
        setError("Organization not found");
      }
    } catch (err) {
      console.error("Error fetching organization:", err);
      if (err.response?.status === 404) {
        setError("not_found");
      } else {
        setError(err.response?.data?.message || "Failed to fetch organization");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error === "not_found" || !organization) {
    return <NoOrganizationFound />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <IconAlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 w-full min-h-dvh pb-8 pt-2">
      {/* Header */}

      {/* Responsive Navigation */}
      <ResponsiveNavigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        organization={organization}
      />

      {/* Content Sections */}
      {activeSection === "overview" && <OverviewTab organization={organization} />}
      {activeSection === "details" && <DetailsTab organization={organization} />}
      {activeSection === "bank" && <BankDetailsTab organization={organization} />}
      {activeSection === "stats" && <StatsTab organization={organization} />}
      {activeSection === "documents" && <DocumentsTab organization={organization} />}
      {activeSection === "settings" && <SettingsTab organization={organization} />}
    </div>
  );
};

export default OrganizationPage;

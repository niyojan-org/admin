"use client";
import { useState } from "react";
import { useOrgStore } from "@/store/orgStore";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  IconBuildingBank,
  IconMapPin,
  IconPhone,
  IconMail,
  IconWorld,
  IconCalendarEvent,
  IconBuildingStore,
  IconId,
  IconFileText,
  IconChartBar,
  IconCategory,
  IconInfoCircle,
  IconLoader2,
  IconShieldCheck,
} from "@tabler/icons-react";

// Component imports
import { InfoSection, InfoItem } from "./components/InfoSection";
import { DocumentsSection } from "./components/DocumentsSection";
import { SocialLinksSection } from "./components/SocialLinksSection";
import { AddressSection } from "./components/AddressSection";
import { BankDetailsSection } from "./components/BankDetailsSection";
import { EventPreferencesSection } from "./components/EventPreferencesSection";
import { VerificationDialog } from "./components/VerificationDialog";
import { StatusBanner } from "./components/StatusBanner";
import { StatCard } from "./components/StatCard";
import { VerificationStateGate } from "./components/VerificationStateGate";
import Image from "next/image";

export default function VerificationPage() {
  const { organization, setOrganization } = useOrgStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerificationRequest = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post(
        "/organizations/admin/verification/raise",
      );
      toast.success(
        response.data.message || "Verification request submitted successfully!",
      );
      setOrganization({ ...organization, reqForVerification: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit verification request.",
        {
          description: error.response?.data?.error?.details,
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="text-center space-y-4">
          <IconLoader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            Loading organization details...
          </p>
        </div>
      </div>
    );
  }

  const isRequestPending = organization.reqForVerification === true;
  const isVerified = organization.verified === true;
  const verifiedDocumentsCount =
    organization?.documents?.filter((doc) => doc.verified).length || 0;
  const totalDocumentsCount = organization?.documents?.length || 0;
  const statusLabel = isVerified
    ? "Verified"
    : isRequestPending
      ? "Pending"
      : "Not Verified";

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
              <IconShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Verification Center</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Organization Verification
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Review your organization profile, confirm compliance data, and
              request verification when everything is complete.
            </p>
          </div>
          <Badge
            variant={
              isVerified
                ? "success"
                : isRequestPending
                  ? "warning"
                  : "destructive"
            }
            className="w-fit"
          >
            {statusLabel}
          </Badge>
        </div>
      </div>

      <StatusBanner
        isVerified={isVerified}
        isRequestPending={isRequestPending}
      />
      <VerificationStateGate organization={organization} />

      {isVerified && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="Trust Score"
            value={`${organization?.trustScore || 0}/100`}
            icon={IconShieldCheck}
            variant="success"
          />
          <StatCard
            title="Documents Verified"
            value={`${verifiedDocumentsCount}/${totalDocumentsCount}`}
            icon={IconFileText}
            variant="default"
          />
          <StatCard
            title="Total Events Hosted"
            value={organization?.stats?.totalEventsHosted || 0}
            icon={IconCalendarEvent}
            variant="default"
          />
        </div>
      )}

      {!isVerified && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <InfoSection title="Basic Information" icon={IconBuildingStore}>
              {organization.logo && (
                <div className="flex items-center gap-3 pb-2">
                  <Image
                    src={organization.logo}
                    alt={organization.name}
                    width={100}
                    height={100}
                    className="h-16 w-16 rounded-lg border-2 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {organization.name}
                    </h3>
                    <Badge variant="outline" className="mt-1 capitalize">
                      {organization.category}
                    </Badge>
                  </div>
                </div>
              )}

              {!organization.logo && (
                <InfoItem
                  label="Organization Name"
                  value={organization.name}
                  icon={IconId}
                />
              )}

              <Separator />

              <InfoItem
                label="Email"
                value={organization.email}
                icon={IconMail}
              />
              <InfoItem
                label="Phone"
                value={organization.phone}
                icon={IconPhone}
              />

              {organization.category && !organization.logo && (
                <InfoItem
                  label="Category"
                  value={
                    <Badge variant="outline" className="capitalize">
                      {organization.category}
                    </Badge>
                  }
                  icon={IconCategory}
                />
              )}

              {organization.subCategory && (
                <InfoItem
                  label="Sub Category"
                  value={organization.subCategory}
                  icon={IconCategory}
                />
              )}

              {organization.description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IconInfoCircle className="h-4 w-4" />
                      <p className="text-sm font-medium">Description</p>
                    </div>
                    <p className="pl-6 text-sm leading-relaxed text-muted-foreground">
                      {organization.description}
                    </p>
                  </div>
                </>
              )}
            </InfoSection>

            <InfoSection title="Address & Contact" icon={IconMapPin}>
              <AddressSection
                address={organization.address}
                supportContact={organization.supportContact}
              />
            </InfoSection>

            <InfoSection title="Payment Information" icon={IconBuildingBank}>
              <BankDetailsSection
                bankDetails={organization.bankDetails}
                allowsPaidEvents={organization.allowsPaidEvents}
              />
            </InfoSection>

            <InfoSection title="Online Presence" icon={IconWorld}>
              <SocialLinksSection
                socialLinks={organization.socialLinks}
                website={
                  organization.website || organization.socialLinks?.website
                }
              />
            </InfoSection>

            <InfoSection title="Event Preferences" icon={IconCalendarEvent}>
              <EventPreferencesSection
                eventPreferences={organization.eventPreferences}
              />
            </InfoSection>

            <InfoSection title="Organization Statistics" icon={IconChartBar}>
              {organization.stats ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-linear-to-br from-primary/5 to-primary/10 p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {organization.stats.totalEventsHosted || 0}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Events Hosted
                    </p>
                  </div>
                  <div className="rounded-lg border bg-linear-to-br from-primary/5 to-primary/10 p-4 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {organization.stats.totalTicketsSold || 0}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Tickets Sold
                    </p>
                  </div>
                  {organization.stats.totalRevenueGenerated !== undefined && (
                    <div className="rounded-lg border bg-linear-to-br from-primary/5 to-primary/10 p-4 text-center">
                      <p className="text-2xl font-bold text-primary">
                        ₹
                        {organization.stats.totalRevenueGenerated?.toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Revenue
                      </p>
                    </div>
                  )}
                  {organization.rating?.averageRating && (
                    <div className="rounded-lg border bg-linear-to-br from-primary/5 to-primary/10 p-4 text-center">
                      <p className="text-2xl font-bold text-primary">
                        {organization.rating.averageRating}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Avg Rating
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Statistics not available
                </p>
              )}
            </InfoSection>
          </div>

          {organization.documents && organization.documents.length > 0 && (
            <InfoSection title="Uploaded Documents" icon={IconFileText}>
              <DocumentsSection documents={organization.documents} />
            </InfoSection>
          )}

          {!isRequestPending && (
            <VerificationDialog
              onSubmit={handleVerificationRequest}
              isSubmitting={isSubmitting}
            />
          )}
        </>
      )}
    </div>
  );
}

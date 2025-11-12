"use client";
import React, { useState, useEffect } from "react";
import { useOrgStore } from "@/store/orgStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  IconBuildingBank,
  IconMapPin,
  IconPhone,
  IconMail,
  IconWorld,
  IconUser,
  IconCoin,
  IconCalendarEvent,
  IconShield,
  IconBuildingStore,
  IconId,
  IconFileText,
  IconCheck,
  IconClock,
  IconExternalLink,
  IconChartBar,
  IconFlag,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconCategory,
  IconInfoCircle,
  IconAlertCircle,
  IconSparkles,
} from "@tabler/icons-react";

export default function VerificationPage() {
  const { organization, setOrganization } = useOrgStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Redirect if organization is not found or steps not completed
    if (!organization) {
      return;
    }

    const allStepsCompleted =
      organization.stepsCompleted?.basicDetails &&
      organization.stepsCompleted?.addressDetails &&
      organization.stepsCompleted?.bankDetails &&
      organization.stepsCompleted?.documents &&
      organization.stepsCompleted?.socialLinks &&
      organization.stepsCompleted?.eventPreferences;

    if (!allStepsCompleted) {
      window.location.href = "/register";
      return;
    }
  }, [organization]);

  const handleVerificationRequest = async () => {
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/org/register/verify");
      toast.success("Verification request submitted successfully!");
      setOrganization(response.data.org);
      setShowConfirmDialog(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit verification request. Please try again.",
        {
          description:
            error.response?.data?.error?.details ||
            "An error occurred while submitting your request.",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSocialIcon = (platform) => {
    const icons = {
      facebook: IconBrandFacebook,
      twitter: IconBrandTwitter,
      instagram: IconBrandInstagram,
      linkedin: IconBrandLinkedin,
      youtube: IconBrandYoutube,
    };
    const Icon = icons[platform.toLowerCase()] || IconWorld;
    return <Icon className="w-4 h-4" />;
  };

  if (!organization) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading organization details...</p>
        </div>
      </div>
    );
  }

  const isRequestPending = organization.reqForVerification === true;
  const isVerified = organization.verified === true;

  const getRiskVariant = (level) => {
    if (level === "low") return "default";
    if (level === "medium") return "secondary";
    return "destructive";
  };

  return (
    <div className="container mx-auto px-4 space-y-8 pb-10 w-full">
      {/* Header with gradient background */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-primary/10">
            <IconShield className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Organization Verification</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Review your organization details and submit for verification
        </p>
      </div>

      {/* Status Banner */}
      {isVerified ? (
        <Alert className="border-2">
          <IconCheck className="h-5 w-5" />
          <AlertDescription className="ml-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">Organization Verified</p>
                <p className="text-sm mt-1">Your organization has been successfully verified!</p>
              </div>
              <Button
                size="lg"
                className="ml-4"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Go to Dashboard
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : isRequestPending ? (
        <Alert className="border-2 border-yellow-500/50 bg-yellow-500/5">
          <IconClock className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="ml-2">
            <p className="font-semibold text-lg">Verification Pending</p>
            <p className="text-sm mt-1">Your request is being reviewed by our team. We'll notify you via email.</p>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-2 border-primary/50 bg-primary/5">
          <IconSparkles className="h-5 w-5 text-primary" />
          <AlertDescription className="ml-2">
            <p className="font-semibold text-lg">Ready for Verification</p>
            <p className="text-sm mt-1">Please review your details below and submit your request.</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Organization Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Trust Score</p>
                <p className="text-3xl font-bold">{organization.trustScore || 0}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <IconShield className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                <Badge variant={getRiskVariant(organization.riskLevel)} className="mt-2">
                  {organization.riskLevel || "Unknown"}
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <IconFlag className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={organization.active ? "default" : "secondary"} className="mt-2">
                  {organization.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <IconBuildingStore className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Details */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBuildingStore className="w-5 h-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconId className="w-4 h-4" />
                <p className="text-sm font-medium">Organization Name</p>
              </div>
              <p className="text-lg font-semibold pl-6">{organization.name}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconMail className="w-4 h-4" />
                <p className="text-sm font-medium">Email</p>
              </div>
              <p className="pl-6">{organization.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconPhone className="w-4 h-4" />
                <p className="text-sm font-medium">Phone</p>
              </div>
              <p className="pl-6">{organization.phone}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <IconCategory className="w-4 h-4" />
                <p className="text-sm font-medium">Category</p>
              </div>
              <Badge variant="outline" className="ml-6 capitalize">{organization.category}</Badge>
            </div>

            {organization.description && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IconInfoCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">Description</p>
                  </div>
                  <p className="pl-6 text-sm text-muted-foreground leading-relaxed">
                    {organization.description}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Address Details */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconMapPin className="w-5 h-5 text-primary" />
              Address Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {organization.address ? (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Street Address</p>
                  <p className="font-medium">{organization.address.street}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">City</p>
                    <p className="font-medium">{organization.address.city}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">State</p>
                    <p className="font-medium">{organization.address.state}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Country</p>
                    <p className="font-medium">{organization.address.country}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Zip Code</p>
                    <p className="font-medium">{organization.address.zipCode}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Address details not available</p>
            )}

            {organization.supportContact && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <IconUser className="w-5 h-5 text-primary" />
                    Support Contact
                  </h4>
                  <div className="space-y-3 pl-7">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p className="font-medium">{organization.supportContact.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="font-medium">{organization.supportContact.phone}</p>
                    </div>
                    {organization.supportContact.email && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="font-medium">{organization.supportContact.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBuildingBank className="w-5 h-5 text-primary" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {organization.bankDetails ? (
              organization.eventPreferences?.allowsPaidEvents === false ? (
                <Alert>
                  <IconCoin className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    <p className="font-medium">Free Events Only</p>
                    <p className="text-sm mt-1">This organization is set up for free events only</p>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Account Holder</p>
                    <p className="font-medium">{organization.bankDetails.accountHolderName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                    <p className="font-medium">{organization.bankDetails.bankName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">UPI ID</p>
                    <p className="font-medium font-mono">{organization.bankDetails.upiId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                    <p className="font-medium font-mono">
                      ****{organization.bankDetails.accountNumber?.slice(-4)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">IFSC Code</p>
                    <p className="font-medium font-mono">{organization.bankDetails.ifscCode}</p>
                  </div>
                </div>
              )
            ) : (
              <p className="text-muted-foreground">Payment details not available</p>
            )}
          </CardContent>
        </Card>

        {/* Online Presence */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconWorld className="w-5 h-5 text-primary" />
              Online Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {organization.website && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Website</p>
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  {organization.website}
                  <IconExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {organization.socialLinks && Object.keys(organization.socialLinks).length > 0 && (
              <>
                {organization.website && <Separator />}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Social Media</p>
                  <div className="space-y-2">
                    {Object.entries(organization.socialLinks).map(
                      ([platform, url]) =>
                        url && (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                          >
                            <div className="p-1.5 rounded-md bg-primary/10">
                              {getSocialIcon(platform)}
                            </div>
                            <span className="capitalize font-medium">{platform}</span>
                            <IconExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                          </a>
                        )
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Event Preferences & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Preferences */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCalendarEvent className="w-5 h-5 text-primary" />
              Event Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {organization.eventPreferences ? (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 rounded-lg bg-accent">
                    <p className="text-3xl font-bold">{organization.eventPreferences.maxEventsPerMonth}</p>
                    <p className="text-sm text-muted-foreground mt-1">Max Events/Month</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent">
                    <Badge
                      variant={organization.eventPreferences.allowsPaidEvents ? "default" : "secondary"}
                      className="text-sm px-3 py-1"
                    >
                      {organization.eventPreferences.allowsPaidEvents ? "Paid" : "Free"}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">Event Type</p>
                  </div>
                </div>
                {organization.eventPreferences.preferredEventTypes?.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">Preferred Event Types</p>
                      <div className="flex flex-wrap gap-2">
                        {organization.eventPreferences.preferredEventTypes.map((type, index) => (
                          <Badge key={index} variant="outline" className="capitalize">
                            {type.replace(/-/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Event preferences not available</p>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconChartBar className="w-5 h-5 text-primary" />
              Organization Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {organization.stats ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-lg bg-accent">
                  <p className="text-3xl font-bold">{organization.stats.totalEventsHosted}</p>
                  <p className="text-sm text-muted-foreground mt-1">Events Hosted</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent">
                  <p className="text-3xl font-bold">{organization.stats.totalTicketsSold}</p>
                  <p className="text-sm text-muted-foreground mt-1">Tickets Sold</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent">
                  <p className="text-3xl font-bold">₹{organization.stats.totalRevenueGenerated?.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">Revenue</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent">
                  <p className="text-3xl font-bold">{organization.rating?.averageRating || 0}</p>
                  <p className="text-sm text-muted-foreground mt-1">Avg Rating</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Statistics not available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      {organization.documents && organization.documents.length > 0 && (
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText className="w-5 h-5 text-primary" />
              Uploaded Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organization.documents.map((doc, index) => (
                <div
                  key={index}
                  className="border-2 rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <IconFileText className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-medium flex-1">{doc.type}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={doc.verified ? "default" : "secondary"}>
                      {doc.verified ? (
                        <><IconCheck className="w-3 h-3 mr-1" /> Verified</>
                      ) : (
                        <><IconClock className="w-3 h-3 mr-1" /> Pending</>
                      )}
                    </Badge>
                    {doc.url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <IconExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terms and Agreement */}
      {!isVerified && !isRequestPending && (
        <Card className="border-2">
          <CardContent className="">
            <div className="flex items-start gap-4">
              <Checkbox
                id="terms"
                onCheckedChange={setTermsAccepted}
                checked={termsAccepted}
                className="mt-1"
              />
              <label className="text-sm leading-relaxed cursor-pointer flex-1" htmlFor="terms">
                I agree to the{" "}
                <a
                  className="text-primary hover:underline font-medium"
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms and conditions
                </a>{" "}
                and confirm that all provided information is accurate and up-to-date.
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Verification Request */}
      {!isVerified && !isRequestPending && (
        <div className="flex justify-center pt-4">
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="px-8"
                disabled={!termsAccepted}
              >
                <IconShield className="w-5 h-5 mr-2" />
                Submit Verification Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <IconAlertCircle className="w-6 h-6 text-primary" />
                  Confirm Verification Request
                </DialogTitle>
                <DialogDescription>
                  Please review the information below before submitting your verification request.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Alert>
                  <IconInfoCircle className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    <ul className="space-y-2 text-sm">
                      <li>• Ensure all details are accurate and complete</li>
                      <li>• Changes may not be possible during review</li>
                      <li>• Verification typically takes 2-3 business days</li>
                      <li>• You'll receive email updates on your status</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleVerificationRequest} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <IconClock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <IconCheck className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
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
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  IconStar,
  IconTrendingUp,
  IconShield,
  IconBuildingStore,
  IconId,
  IconFileText,
  IconCheck,
  IconClock,
  IconAlertTriangle,
  IconExternalLink,
  IconPhoto,
  IconSettings,
  IconTicket,
  IconChartBar,
  IconFlag,
  IconExclamationMark,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconCategory,
  IconInfoCircle,
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
      router.push("/");
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
    switch (platform.toLowerCase()) {
      case "facebook":
        return <IconBrandFacebook size={16} />;
      case "twitter":
        return <IconBrandTwitter size={16} />;
      case "instagram":
        return <IconBrandInstagram size={16} />;
      case "linkedin":
        return <IconBrandLinkedin size={16} />;
      case "youtube":
        return <IconBrandYoutube size={16} />;
      default:
        return <IconWorld size={16} />;
    }
  };

  if (!organization) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading organization details...</p>
        </div>
      </div>
    );
  }

  const isRequestPending = organization.reqForVerification === true;
  const isVerified = organization.verified === true;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <IconShield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Organization Verification</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Review your organization details and submit for verification
        </p>
      </div>

      {/* Status Banner */}
      {isVerified ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <IconCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-green-800">Organization Verified</h2>
                <p className="text-green-700 text-sm">
                  Your organization has been successfully verified!
                </p>
              </div>
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="bg-green-600 hover:bg-green-700"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : isRequestPending ? (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <IconClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-yellow-800">Verification Pending</h2>
                <p className="text-yellow-700 text-sm">
                  Your request is being reviewed by our team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-blue-800">Ready for Verification</h2>
              <p className="text-blue-700 text-sm">
                Please review your details below and submit your request.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <IconShield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Trust Score</p>
                <p className="text-2xl font-bold">{organization.trustScore || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <IconFlag className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <Badge
                  variant={
                    organization.riskLevel === "low"
                      ? "default"
                      : organization.riskLevel === "medium"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {organization.riskLevel || "Unknown"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <IconBuildingStore className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={organization.active ? "default" : "secondary"}>
                  {organization.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBuildingStore className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconId className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium">Organization Name</p>
              </div>
              <p className="text-lg font-semibold pl-6">{organization.name}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconMail className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium">Email</p>
              </div>
              <p className="pl-6">{organization.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconPhone className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium">Phone</p>
              </div>
              <p className="pl-6">{organization.phone}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IconCategory className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium">Category</p>
              </div>
              <p className="pl-6 capitalize">{organization.category}</p>
            </div>

            {organization.description && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IconInfoCircle className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Description</p>
                </div>
                <p className="pl-6 text-sm text-muted-foreground">{organization.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Address Details */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconMapPin className="w-6 h-6 mr-3" />
              Address Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {organization.address ? (
              <>
                <div className="space-y-2">
                  <p className="font-medium text-gray-700">Street Address</p>
                  <p className="text-gray-900">{organization.address.street}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-700">City</p>
                    <p className="text-gray-900">{organization.address.city}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">State</p>
                    <p className="text-gray-900">{organization.address.state}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-700">Country</p>
                    <p className="text-gray-900">{organization.address.country}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Zip Code</p>
                    <p className="text-gray-900">{organization.address.zipCode}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Address details not available</p>
            )}

            {/* Support Contact */}
            {organization.supportContact && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <IconUser className="w-5 h-5 mr-2" />
                  Support Contact
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-gray-700">Name</p>
                    <p className="text-gray-900">{organization.supportContact.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Phone</p>
                    <p className="text-gray-900">{organization.supportContact.phone}</p>
                  </div>
                  {organization.supportContact.email && (
                    <div>
                      <p className="font-medium text-gray-700">Email</p>
                      <p className="text-gray-900">{organization.supportContact.email}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconBuildingBank className="w-6 h-6 mr-3" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {organization.bankDetails ? (
              <div className="space-y-4">
                {organization.eventPreferences?.allowsPaidEvents === false ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <IconCoin className="w-5 h-5 text-gray-500 mr-2" />
                      <p className="font-medium text-gray-700">Free Events Only</p>
                    </div>
                    <p className="text-gray-600 text-sm">
                      This organization is set up for free events only
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium text-gray-700">Account Holder</p>
                      <p className="text-gray-900">{organization.bankDetails.accountHolderName}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Bank Name</p>
                      <p className="text-gray-900">{organization.bankDetails.bankName}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">UPI ID</p>
                      <p className="text-gray-900">{organization.bankDetails.upiId}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Account Number</p>
                      <p className="text-gray-900">
                        ****{organization.bankDetails.accountNumber?.slice(-4)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">IFSC Code</p>
                      <p className="text-gray-900">{organization.bankDetails.ifscCode}</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Payment details not available</p>
            )}
          </CardContent>
        </Card>

        {/* Online Presence */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconWorld className="w-6 h-6 mr-3" />
              Online Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {organization.website && (
              <div className="flex items-center">
                <IconExternalLink className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-700">Website</p>
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {organization.website}
                  </a>
                </div>
              </div>
            )}

            {organization.socialLinks && Object.keys(organization.socialLinks).length > 0 && (
              <div>
                <p className="font-medium text-gray-700 mb-3 flex items-center">
                  <IconBrandFacebook className="w-5 h-5 mr-2" />
                  Social Media
                </p>
                <div className="space-y-2">
                  {Object.entries(organization.socialLinks).map(
                    ([platform, url]) =>
                      url && (
                        <div key={platform} className="flex items-center">
                          {getSocialIcon(platform)}
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 text-blue-600 hover:text-blue-800 hover:underline capitalize text-sm"
                          >
                            {platform}
                          </a>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Event Preferences & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Event Preferences */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconCalendarEvent className="w-6 h-6 mr-3" />
              Event Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {organization.eventPreferences ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-700">Max Events/Month</p>
                    <p className="text-2xl font-bold text-teal-600">
                      {organization.eventPreferences.maxEventsPerMonth}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Paid Events</p>
                    <Badge
                      variant={
                        organization.eventPreferences.allowsPaidEvents ? "success" : "secondary"
                      }
                    >
                      {organization.eventPreferences.allowsPaidEvents ? "Allowed" : "Free Only"}
                    </Badge>
                  </div>
                </div>
                {organization.eventPreferences.preferredEventTypes?.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-3">Preferred Event Types</p>
                    <div className="flex flex-wrap gap-2">
                      {organization.eventPreferences.preferredEventTypes.map((type, index) => (
                        <Badge key={index} variant="outline">
                          {type.replace(/-/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">Event preferences not available</p>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconChartBar className="w-6 h-6 mr-3" />
              Organization Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {organization.stats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {organization.stats.totalEventsHosted}
                  </p>
                  <p className="text-sm text-gray-600">Events Hosted</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {organization.stats.totalTicketsSold}
                  </p>
                  <p className="text-sm text-gray-600">Tickets Sold</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{organization.stats.totalRevenueGenerated}
                  </p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {organization.rating?.averageRating || 0}
                  </p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Statistics not available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      {organization.documents && organization.documents.length > 0 && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconFileText className="w-6 h-6 mr-3" />
              Uploaded Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organization.documents.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center mb-2">
                    <IconFileText className="w-5 h-5 text-gray-400 mr-2" />
                    <p className="font-medium text-gray-700">{doc.type}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={doc.verified ? "success" : "secondary"}>
                      {doc.verified ? "Verified" : "Pending"}
                    </Badge>
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <IconExternalLink className="w-4 h-4" />
                      </a>
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
        <div className="bg-gray-50 rounded-xl p-6 border">
          <div className="flex items-center justify-center space-x-3">
            <Checkbox id="terms" onCheckedChange={setTermsAccepted} checked={termsAccepted} />
            <label className="text-sm text-gray-700 cursor-pointer" htmlFor="terms">
              I agree to the{" "}
              <a
                className="text-blue-600 hover:text-blue-800 underline"
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                terms and conditions
              </a>{" "}
              and confirm that all provided information is accurate
            </label>
          </div>
        </div>
      )}

      {/* Submit Verification Request */}
      {!isVerified && !isRequestPending && (
        <div className="text-center pt-8">
          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogTrigger asChild>
              <Button
                className={`px-12 py-4 text-lg rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  termsAccepted ? "" : "cursor-not-allowed"
                }`}
                disabled={!termsAccepted}
              >
                <IconShield className="w-6 h-6 inline mr-2" />
                Submit Verification Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-800 flex items-center">
                  <IconShield className="w-6 h-6 mr-3 text-blue-600" />
                  Confirm Verification Request
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="p-4 rounded-lg">
                  <p className="font-medium mb-2">Before you submit:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Ensure all details are accurate</li>
                    <li>• Changes may not be possible during review</li>
                    <li>• Verification typically takes 2-3 business days</li>
                    <li>• You'll receive email updates on status</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleVerificationRequest}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <IconClock className="w-4 h-4 inline mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <IconCheck className="w-4 h-4 inline mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

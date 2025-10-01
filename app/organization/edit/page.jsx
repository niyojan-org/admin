"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  IconBuilding,
  IconMapPin, 
  IconCreditCard, 
  IconWorld, 
  IconSettings,
  IconUpload,
  IconEye,
  IconCircleCheck,
  IconAlertTriangle,
  IconEdit,
  IconCamera,
  IconFileText
} from "@tabler/icons-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Enhanced Step Components
import BasicDetailsStep from "./components/BasicDetailsStep";
import AddressDetailsStep from "./components/AddressDetailsStep";
import BankDetailsStep from "./components/BankDetailsStep";
import SocialLinksStep from "./components/SocialLinksStep";
import EventPreferencesStep from "./components/EventPreferencesStep";
import DataCompletionStep from "./components/DataCompletionStep";
import DocumentsStep from "./components/DocumentsStep";

export default function EditProfilePage() {
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeDialog, setActiveDialog] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      const response = await api.get("/org/me");
      if (response.data.success) {
        setOrgData(response.data.org);
      }
    } catch (error) {
      toast.error("Failed to fetch organization data");
      console.error("Error fetching org data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionEdit = (sectionKey) => {
    // Map section keys to dialog names
    const sectionDialogMap = {
      basicDetails: 'basic',
      addressDetails: 'address', 
      bankDetails: 'bank',
      socialLinks: 'social',
      eventPreferences: 'preferences',
      documents: 'documents'
    };
    
    const dialogName = sectionDialogMap[sectionKey];
    if (dialogName) {
      setActiveDialog(dialogName);
    }
  };

  const handleSaveSection = async (section, data) => {
    setSaving(true);
    try {
      let endpoint = "";
      switch (section) {
        case "basic":
          endpoint = "/org/update/basic";
          break;
        case "address":
          endpoint = "/org/update/address";
          break;
        case "bank":
          endpoint = "/org/update/bank";
          break;
        case "social":
          endpoint = "/org/update/social";
          break;
        case "preferences":
          endpoint = "/org/update/preferences";
          break;
        case "documents":
          endpoint = "/org/update/documents";
          break;
        default:
          throw new Error("Invalid section");
      }

      const response = await api.put(endpoint, data);
      if (response.data.success) {
        setOrgData(response.data.org);
        toast.success("Settings updated successfully");
        setActiveDialog(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const calculateCompletion = () => {
    if (!orgData?.stepsCompleted) return 0;
    const total = Object.keys(orgData.stepsCompleted).length;
    const completed = Object.values(orgData.stepsCompleted).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!orgData) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load organization data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Organization Settings</h1>
          <p className="text-muted-foreground">
            Manage your organization profile and preferences
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/organization")}>
          <IconEye className="h-4 w-4 mr-2" />
          View Organization
        </Button>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6">
        {/* Data Completion Section */}
        <DataCompletionStep 
          orgData={orgData} 
          onSectionEdit={handleSectionEdit}
        />

        {/* Organization Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCamera className="h-5 w-5" />
              Organization Logo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={orgData.logo} alt={orgData.name} />
                <AvatarFallback className="text-lg">
                  {orgData.name?.substring(0, 2)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Upload a logo to represent your organization
                </p>
                <Button variant="outline" size="sm">
                  <IconUpload className="h-4 w-4 mr-2" />
                  Change Logo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconBuilding className="h-5 w-5" />
                Basic Details
              </CardTitle>
              <CardDescription>
                Organization name, contact information, and category
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {orgData.stepsCompleted?.basicDetails ? (
                <Badge variant="default" className="gap-1">
                  <IconCircleCheck className="h-3 w-3" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <IconAlertTriangle className="h-3 w-3" />
                  Incomplete
                </Badge>
              )}
              <Dialog open={activeDialog === 'basic'} onOpenChange={(open) => setActiveDialog(open ? 'basic' : null)}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Basic Details</DialogTitle>
                    <DialogDescription>
                      Update your organization's basic information
                    </DialogDescription>
                  </DialogHeader>
                  <BasicDetailsStep
                    orgData={orgData}
                    onSave={(data) => handleSaveSection('basic', data)}
                    saving={saving}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Organization Name</Label>
                <p className="font-medium">{orgData.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{orgData.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Phone</Label>
                <p className="font-medium">{orgData.phone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Category</Label>
                <p className="font-medium capitalize">{orgData.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconMapPin className="h-5 w-5" />
                Address Details
              </CardTitle>
              <CardDescription>
                Organization's physical address information
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {orgData.stepsCompleted?.addressDetails ? (
                <Badge variant="default" className="gap-1">
                  <IconCircleCheck className="h-3 w-3" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <IconAlertTriangle className="h-3 w-3" />
                  Incomplete
                </Badge>
              )}
              <Dialog open={activeDialog === 'address'} onOpenChange={(open) => setActiveDialog(open ? 'address' : null)}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Address Details</DialogTitle>
                    <DialogDescription>
                      Update your organization's address information
                    </DialogDescription>
                  </DialogHeader>
                  <AddressDetailsStep
                    orgData={orgData}
                    onSave={(data) => handleSaveSection('address', data)}
                    saving={saving}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {orgData.address ? (
              <div className="text-sm space-y-1">
                <p className="font-medium">{orgData.address.street}</p>
                <p>{orgData.address.city}, {orgData.address.state}</p>
                <p>{orgData.address.country} - {orgData.address.zipCode}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No address provided</p>
            )}
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconCreditCard className="h-5 w-5" />
                Bank Details
              </CardTitle>
              <CardDescription>
                Banking information for payments and payouts
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {orgData.stepsCompleted?.bankDetails ? (
                <Badge variant="default" className="gap-1">
                  <IconCircleCheck className="h-3 w-3" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <IconAlertTriangle className="h-3 w-3" />
                  Incomplete
                </Badge>
              )}
              <Dialog open={activeDialog === 'bank'} onOpenChange={(open) => setActiveDialog(open ? 'bank' : null)}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Bank Details</DialogTitle>
                    <DialogDescription>
                      Update your banking information for secure transactions
                    </DialogDescription>
                  </DialogHeader>
                  <BankDetailsStep
                    orgData={orgData}
                    onSave={(data) => handleSaveSection('bank', data)}
                    saving={saving}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {orgData.bankDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Account Holder</Label>
                  <p className="font-medium">{orgData.bankDetails.accountHolderName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Bank Name</Label>
                  <p className="font-medium">{orgData.bankDetails.bankName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Account Number</Label>
                  <p className="font-mono">****{orgData.bankDetails.accountNumber?.slice(-4)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">IFSC Code</Label>
                  <p className="font-mono">{orgData.bankDetails.ifscCode}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No bank details provided</p>
            )}
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconWorld className="h-5 w-5" />
                Social Links & Website
              </CardTitle>
              <CardDescription>
                Connect your social media and website
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {orgData.stepsCompleted?.socialLinks ? (
                <Badge variant="default" className="gap-1">
                  <IconCircleCheck className="h-3 w-3" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <IconAlertTriangle className="h-3 w-3" />
                  Incomplete
                </Badge>
              )}
              <Dialog open={activeDialog === 'social'} onOpenChange={(open) => setActiveDialog(open ? 'social' : null)}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Social Links</DialogTitle>
                    <DialogDescription>
                      Add your social media profiles and website
                    </DialogDescription>
                  </DialogHeader>
                  <SocialLinksStep
                    orgData={orgData}
                    onSave={(data) => handleSaveSection('social', data)}
                    saving={saving}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {orgData.website && (
                <div>
                  <Label className="text-muted-foreground">Website</Label>
                  <p className="font-medium text-blue-600">{orgData.website}</p>
                </div>
              )}
              {orgData.socialLinks?.facebook && (
                <div>
                  <Label className="text-muted-foreground">Facebook</Label>
                  <p className="font-medium text-blue-600">{orgData.socialLinks.facebook}</p>
                </div>
              )}
              {orgData.socialLinks?.instagram && (
                <div>
                  <Label className="text-muted-foreground">Instagram</Label>
                  <p className="font-medium text-pink-600">{orgData.socialLinks.instagram}</p>
                </div>
              )}
              {!orgData.website && !orgData.socialLinks?.facebook && !orgData.socialLinks?.instagram && (
                <p className="text-sm text-muted-foreground">No social links provided</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Event Preferences */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconSettings className="h-5 w-5" />
                Event Preferences
              </CardTitle>
              <CardDescription>
                Configure your event hosting preferences
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {orgData.stepsCompleted?.eventPreferences ? (
                <Badge variant="default" className="gap-1">
                  <IconCircleCheck className="h-3 w-3" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <IconAlertTriangle className="h-3 w-3" />
                  Incomplete
                </Badge>
              )}
              <Dialog open={activeDialog === 'preferences'} onOpenChange={(open) => setActiveDialog(open ? 'preferences' : null)}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconEdit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Event Preferences</DialogTitle>
                    <DialogDescription>
                      Configure your event hosting settings
                    </DialogDescription>
                  </DialogHeader>
                  <EventPreferencesStep
                    orgData={orgData}
                    onSave={(data) => handleSaveSection('preferences', data)}
                    saving={saving}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {orgData.eventPreferences ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Max Events/Month</Label>
                  <p className="font-medium">{orgData.eventPreferences.maxEventsPerMonth}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Paid Events</Label>
                  <Badge variant={orgData.eventPreferences.allowsPaidEvents ? "default" : "secondary"}>
                    {orgData.eventPreferences.allowsPaidEvents ? "Allowed" : "Not Allowed"}
                  </Badge>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">Preferred Event Types</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {orgData.eventPreferences.preferredEventTypes?.map((type, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {type.replace(/-/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No preferences set</p>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconFileText className="h-5 w-5" />
                Documents
              </CardTitle>
              <CardDescription>
                Upload verification documents for your organization
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {orgData.stepsCompleted?.documents ? (
                <Badge variant="default" className="gap-1">
                  <IconCircleCheck className="h-3 w-3" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <IconAlertTriangle className="h-3 w-3" />
                  Incomplete
                </Badge>
              )}
              <Dialog open={activeDialog === 'documents'} onOpenChange={(open) => setActiveDialog(open ? 'documents' : null)}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconEdit className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Manage Documents</DialogTitle>
                    <DialogDescription>
                      Upload and manage your organization's verification documents
                    </DialogDescription>
                  </DialogHeader>
                  <DocumentsStep
                    orgData={orgData}
                    onSave={(data) => handleSaveSection('documents', data)}
                    saving={saving}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {orgData.documents && orgData.documents.length > 0 ? (
              <div className="space-y-2">
                {orgData.documents.slice(0, 3).map((doc, index) => (
                  <div key={doc._id || index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <IconFileText className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{doc.type}</span>
                    </div>
                    <Badge variant={doc.verified ? "default" : "secondary"} className="text-xs">
                      {doc.verified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                ))}
                {orgData.documents.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{orgData.documents.length - 3} more documents
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No documents uploaded</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

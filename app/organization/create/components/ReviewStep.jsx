"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrganizationCreationStore, CATEGORY_OPTIONS, ORGANIZATION_STEPS } from "@/store/organizationCreationStore";
import {
  Building2,
  MapPin,
  Headphones,
  Link2,
  FileText,
  Landmark,
  Pencil,
  Mail,
  Phone,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  BookOpen,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Section wrapper component
function ReviewSection({ title, icon: Icon, step, children, onEdit }) {
  return (
    <Card className={'gap-2'}>
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="size-4" />
            {title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(step)}
            className="h-8 gap-1 text-xs"
          >
            <Pencil className="size-3" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

// Field display component
function FieldDisplay({ label, value, icon: Icon }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-2 py-1">
      {Icon && <Icon className="size-4 mt-0.5 text-muted-foreground shrink-0" />}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium overflow-wrap-anywhere">{value}</p>
      </div>
    </div>
  );
}

// Social link display
function SocialLinkDisplay({ label, url, icon: Icon }) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-md border p-2 text-sm hover:bg-accent transition-colors"
    >
      <Icon className="size-4 text-muted-foreground" />
      <span className="flex-1 truncate">{label}</span>
      <ExternalLink className="size-3 text-muted-foreground" />
    </a>
  );
}

// Get social icon by key
const SOCIAL_ICONS = {
  website: Globe,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  blog: BookOpen,
};

export default function ReviewStep() {
  const { organizationDraft, editFromReview, stepErrors, completedSteps } = useOrganizationCreationStore();

  const getCategoryLabel = (value) => {
    const category = CATEGORY_OPTIONS.find((c) => c.value === value);
    return category?.label || value;
  };

  const handleEdit = (step) => {
    editFromReview(step);
  };

  // Check if all required steps have data
  const isBasicInfoComplete = organizationDraft.name && organizationDraft.email && organizationDraft.phone && organizationDraft.category;
  const isAddressComplete = organizationDraft.address.locality && organizationDraft.address.city && organizationDraft.address.state && organizationDraft.address.country && organizationDraft.address.zipCode;
  const isSupportContactComplete = organizationDraft.supportContact.name && organizationDraft.supportContact.email && organizationDraft.supportContact.phone;
  const isSocialLinksComplete = Object.values(organizationDraft.socialLinks).some((v) => v && v.trim());
  const isDocumentsComplete = organizationDraft.documents.length > 0;

  const allRequiredComplete = isBasicInfoComplete && isAddressComplete && isSupportContactComplete && isSocialLinksComplete && isDocumentsComplete;

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {allRequiredComplete ? (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <CheckCircle className="size-5 text-primary" />
          <div>
            <p className="font-medium text-primary">Ready to Submit</p>
            <p className="text-sm text-muted-foreground">
              All required information has been provided. Please review and submit.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <AlertCircle className="size-5 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Missing Information</p>
            <p className="text-sm text-muted-foreground">
              Please complete all required fields before submitting.
            </p>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <ReviewSection
        title="Basic Information"
        icon={Building2}
        step={1}
        onEdit={handleEdit}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-3">
              {organizationDraft.logo && (
                <img
                  src={organizationDraft.logo}
                  alt="Organization Logo"
                  className="size-16 rounded-lg border object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div>
                <h3 className="text-lg font-semibold">{organizationDraft.name || "—"}</h3>
                <Badge variant="outline">{getCategoryLabel(organizationDraft.category) || "No category"}</Badge>
                {organizationDraft.subCategory && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({organizationDraft.subCategory})
                  </span>
                )}
              </div>
            </div>
          </div>
          <FieldDisplay label="Email" value={organizationDraft.email} icon={Mail} />
          <FieldDisplay label="Phone" value={organizationDraft.phone} icon={Phone} />
          {organizationDraft.description && (
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm mt-1">{organizationDraft.description}</p>
            </div>
          )}
        </div>
        {!isBasicInfoComplete && (
          <p className="mt-3 text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="size-3" />
            Missing required information
          </p>
        )}
      </ReviewSection>

      {/* Address Details */}
      <ReviewSection
        title="Address Details"
        icon={MapPin}
        step={2}
        onEdit={handleEdit}
      >
        <div className="space-y-2">
          <p className="text-sm">
            {organizationDraft.address.locality || "—"}
          </p>
          <p className="text-sm text-muted-foreground">
            {[
              organizationDraft.address.city,
              organizationDraft.address.state,
              organizationDraft.address.zipCode,
            ]
              .filter(Boolean)
              .join(", ") || "—"}
          </p>
          <p className="text-sm text-muted-foreground">
            {organizationDraft.address.country || "—"}
          </p>
        </div>
        {!isAddressComplete && (
          <p className="mt-3 text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="size-3" />
            Missing required information
          </p>
        )}
      </ReviewSection>

      {/* Support Contact */}
      <ReviewSection
        title="Support Contact"
        icon={Headphones}
        step={3}
        onEdit={handleEdit}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldDisplay label="Name" value={organizationDraft.supportContact.name} />
          <FieldDisplay label="Email" value={organizationDraft.supportContact.email} icon={Mail} />
          <FieldDisplay label="Phone" value={organizationDraft.supportContact.phone} icon={Phone} />
        </div>
        {!isSupportContactComplete && (
          <p className="mt-3 text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="size-3" />
            Missing required information
          </p>
        )}
      </ReviewSection>

      {/* Social Links */}
      <ReviewSection
        title="Social Links"
        icon={Link2}
        step={4}
        onEdit={handleEdit}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(organizationDraft.socialLinks).map(([key, value]) => {
            if (!value) return null;
            const Icon = SOCIAL_ICONS[key] || Globe;
            return (
              <SocialLinkDisplay
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                url={value}
                icon={Icon}
              />
            );
          })}
        </div>
        {!isSocialLinksComplete && (
          <p className="mt-3 text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="size-3" />
            At least one social link is required
          </p>
        )}
      </ReviewSection>

      {/* Documents */}
      <ReviewSection
        title="Documents"
        icon={FileText}
        step={5}
        onEdit={handleEdit}
      >
        {organizationDraft.documents.length > 0 ? (
          <div className="space-y-2">
            {organizationDraft.documents.map((doc, index) => (
              <a
                key={index}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent transition-colors"
              >
                <FileText className="size-4 text-muted-foreground" />
                <span className="flex-1 font-medium text-sm">{doc.type}</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No documents added</p>
        )}
        {!isDocumentsComplete && (
          <p className="mt-3 text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="size-3" />
            At least one document is required
          </p>
        )}
      </ReviewSection>

      {/* Bank Details (Optional) */}
      <ReviewSection
        title="Bank Details"
        icon={Landmark}
        step={6}
        onEdit={handleEdit}
      >
        {Object.values(organizationDraft.bankDetails).some((v) => v && v.trim()) ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldDisplay
              label="Account Holder"
              value={organizationDraft.bankDetails.accountHolderName}
            />
            <FieldDisplay
              label="Bank Name"
              value={organizationDraft.bankDetails.bankName}
            />
            <FieldDisplay
              label="Branch"
              value={organizationDraft.bankDetails.branchName}
            />
            <FieldDisplay
              label="Account Number"
              value={
                organizationDraft.bankDetails.accountNumber
                  ? "••••" + organizationDraft.bankDetails.accountNumber.slice(-4)
                  : null
              }
            />
            <FieldDisplay
              label="IFSC Code"
              value={organizationDraft.bankDetails.ifscCode}
            />
            <FieldDisplay
              label="UPI ID"
              value={organizationDraft.bankDetails.upiId}
            />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Badge variant="secondary">Optional</Badge>
            No bank details provided
          </div>
        )}
      </ReviewSection>
    </div>
  );
}

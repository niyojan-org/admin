"use client";

import { useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-number-input";
import { useOrganizationCreationStore } from "@/store/organizationCreationStore";
import { Headphones, User, Mail, Phone } from "lucide-react";

export default function SupportContactStep() {
  const {
    organizationDraft,
    updateNestedField,
    stepErrors,
    setStepErrors,
    clearStepErrors,
  } = useOrganizationCreationStore();

  const errors = stepErrors[3] || {};
  const supportContact = organizationDraft.supportContact;

  // Validate fields
  const validateField = useCallback((field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case "name":
        if (!value || value.trim().length < 2) {
          newErrors.name = "Support contact name is required";
        } else {
          delete newErrors.name;
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "phone":
        if (!value || value.length < 10) {
          newErrors.phone = "Please enter a valid phone number";
        } else {
          delete newErrors.phone;
        }
        break;
      default:
        break;
    }

    if (Object.keys(newErrors).length > 0) {
      setStepErrors(3, newErrors);
    } else {
      clearStepErrors(3);
    }
  }, [errors, setStepErrors, clearStepErrors]);

  const handleChange = (field, value) => {
    updateNestedField("supportContact", field, value);
    validateField(field, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="size-5" />
          Support Contact
        </CardTitle>
        <CardDescription>
          Enter the primary support contact details for your organization. This person will be the main point of contact for any queries.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Contact Name */}
        <div className="space-y-2">
          <Label htmlFor="supportName" className="flex items-center gap-1">
            <User className="size-4" />
            Contact Person Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="supportName"
            placeholder="Enter contact person's full name"
            value={supportContact.name}
            onChange={(e) => handleChange("name", e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Contact Email */}
        <div className="space-y-2">
          <Label htmlFor="supportEmail" className="flex items-center gap-1">
            <Mail className="size-4" />
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="supportEmail"
            type="email"
            placeholder="support@organization.com"
            value={supportContact.email}
            onChange={(e) => handleChange("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Contact Phone */}
        <div className="space-y-2">
          <Label htmlFor="supportPhone" className="flex items-center gap-1">
            <Phone className="size-4" />
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <PhoneInput
            id="supportPhone"
            defaultCountry="IN"
            value={supportContact.phone}
            onChange={(value) => handleChange("phone", value || "")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Info card */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> The support contact will be displayed publicly and may be contacted by users for queries related to your organization and events.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

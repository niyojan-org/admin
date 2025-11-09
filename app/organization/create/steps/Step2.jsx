"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useOrgStore } from "@/store/orgStore";
import api from "@/lib/api";
import { toast } from "sonner";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function Step2({ goNext, goBack }) {
  const { organization, setOrganization } = useOrgStore();

  // State for guidelines dialog
  const [showGuidelinesDialog, setShowGuidelinesDialog] = useState(false);

  // Initialize form data with organization data if available
  const [formData, setFormData] = useState({
    street: organization?.address?.street || "",
    city: organization?.address?.city || "",
    state: organization?.address?.state || "",
    country: organization?.address?.country || "",
    zipCode: organization?.address?.zipCode || "",
    supportContact: {
      name: organization?.supportContact?.name || "",
      phone: organization?.supportContact?.phone || "",
      email: organization?.supportContact?.email || "",
    },
  });

  // Update form data when organization changes
  useEffect(() => {
    if (organization?.addressDetails) {
      setFormData({
        street: organization.addressDetails.street || "",
        city: organization.addressDetails.city || "",
        state: organization.addressDetails.state || "",
        country: organization.addressDetails.country || "",
        zipCode: organization.addressDetails.zipCode || "",
        supportContact: {
          name: organization.supportContact?.name || "",
          phone: organization.supportContact?.phone || "",
          email: organization.supportContact?.email || "",
        },
      });
    }
  }, [organization]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("supportContact.")) {
      const contactField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        supportContact: {
          ...prevData.supportContact,
          [contactField]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("/org/register/address", { ...formData });
      toast.success(response.data.message || "Address details have been successfully saved!");
      setOrganization(response.data.org);
      goNext();
    } catch (error) {
      if (error.response?.data.error?.code === "ADDRESS_EXISTS") {
        toast.info("Let's move to next step");
        goNext();
        return;
      }
      toast.error(
        error.response?.data?.message || "Failed to save address details. Please try again.",
        {
          description:
            error.response.data.error.details ||
            "An error occurred while saving your address details.",
        }
      );
    }
  };

  return (
    <div className="h-full bg-background rounded border border-border shadow flex flex-col justify-between py-2 sm:py-4 md:py-8 space-y-4 w-full px-2 sm:px-4 md:px-10">
      <div className="flex gap-4 justify-between">
        <p className="text-foreground text-sm sm:text-lg">
          Please provide your organization's address details and support contact
        </p>
        <div className="text-sm text-muted-foreground text-center flex items-start">
          <span className="text-destructive">*</span> Required fields
        </div>
        {/* Info Button */}
        <Dialog open={showGuidelinesDialog} onOpenChange={setShowGuidelinesDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              title="Address Guidelines"
              variant={'icon'}
            >
              <IconInfoSquareRounded />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">
                Address Information Guidelines
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {/* General Guidelines */}
              <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                <h3 className="font-semibold text-primary mb-2">📍 General Guidelines</h3>
                <ul className="text-sm text-primary space-y-1">
                  <li>• Provide the complete and accurate address of your organization</li>
                  <li>• Use official address as registered with government authorities</li>
                  <li>• Ensure the address can receive postal mail and packages</li>
                  <li>
                    • This address will be used for official communications and verification
                  </li>
                </ul>
              </div>

              {/* Field Requirements */}
              <div className="p-4 bg-success/5 rounded-lg border-l-4 border-success">
                <h3 className="font-semibold text-success mb-2">✓ Field Requirements</h3>
                <ul className="text-sm text-success space-y-1">
                  <li>
                    • <strong>Street Address:</strong> Include building number, street name, and
                    any suite/unit details
                  </li>
                  <li>
                    • <strong>City:</strong> Enter the complete city name where your organization
                    is located
                  </li>
                  <li>
                    • <strong>State:</strong> Provide the state/province name or abbreviation
                  </li>
                  <li>
                    • <strong>Country:</strong> Enter the full country name or standard
                    abbreviation
                  </li>
                  <li>
                    • <strong>Zip/Postal Code:</strong> Must be 5-6 digits for proper verification
                  </li>
                  <li>
                    • <strong>Support Contact:</strong> Person who will guide participants through
                    events and provide assistance
                  </li>
                </ul>
              </div>

              {/* Support Contact Guidelines */}
              <div className="p-4 bg-secondary/5 rounded-lg border-l-4 border-secondary">
                <h3 className="font-semibold text-secondary mb-2">
                  👤 Support Contact Requirements
                </h3>
                <ul className="text-sm text-secondary space-y-1">
                  <li>
                    • <strong>Name:</strong> Full name of the person who will assist participants
                    (Required)
                  </li>
                  <li>
                    • <strong>Phone:</strong> Direct contact number for immediate assistance
                    (Required)
                  </li>
                  <li>
                    • <strong>Email:</strong> Professional email for event-related communications
                    (Optional)
                  </li>
                  <li>
                    • This person should be knowledgeable about your events and available during
                    event times
                  </li>
                  <li>• Participants will use this contact for event guidance and support</li>
                </ul>
              </div>

              {/* Tips */}
              <div className="p-4 bg-warning/5 rounded-lg border-l-4 border-warning">
                <h3 className="font-semibold text-warning mb-2">💡 Tips</h3>
                <ul className="text-sm text-warning space-y-1">
                  <li>• Double-check spelling and formatting to avoid delivery issues</li>
                  <li>• Use standard postal abbreviations when applicable</li>
                  <li>
                    • If your organization has multiple locations, use the headquarters address
                  </li>
                  <li>
                    • Avoid using P.O. Box addresses unless it's your primary business address
                  </li>
                </ul>
              </div>

              {/* Important Notes */}
              <div className="p-4 bg-destructive/10 rounded-lg border-l-4 border-destructive">
                <h3 className="font-semibold text-destructive mb-2">⚠️ Important</h3>
                <ul className="text-sm text-destructive space-y-1">
                  <li>• This address will be used for legal and official purposes</li>
                  <li>
                    • Ensure you have authorization to use this address for business purposes
                  </li>
                  <li>• Address verification may be required during the approval process</li>
                  <li>• Incorrect address information may delay your registration</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>

      <Card className="shadow-sm bg-background py-1 border-0 p-0">
        <CardContent className="py-2 sm:py-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3 sm:gap-x-4 sm:gap-y-4 space-y-2">
            {/* Street Address */}
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="street" className="text-foreground font-semibold text-base">
                Street Address *
              </Label>
              <Input
                type="text"
                id="street"
                name="street"
                value={formData.street || ""}
                onChange={handleChange}
                placeholder="Enter street address"
                className="h-11 border-border focus:border-primary focus:ring-primary"
                required
              />
              {formData.street && formData.street.length < 3 && (
                <p className="text-sm text-destructive mt-1">
                  Street must be at least 3 characters long
                </p>
              )}
            </div>

            {/* City */}
            <div className="space-y-1 w-full">
              <Label htmlFor="city" className="text-foreground font-semibold text-base">
                City *
              </Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                placeholder="Enter your city"
                className="h-11 border-border focus:border-primary focus:ring-primary"
                required
              />
            </div>

            {/* State */}
            <div className="space-y-1 w-full">
              <Label htmlFor="state" className="text-foreground font-semibold text-base">
                State *
              </Label>
              <Input
                type="text"
                id="state"
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                placeholder="Enter your state"
                className="h-11 border-border focus:border-primary focus:ring-primary"
                required
              />
            </div>

            {/* Country */}
            <div className="space-y-1">
              <Label htmlFor="country" className="text-foreground font-semibold text-base">
                Country *
              </Label>
              <Input
                type="text"
                id="country"
                name="country"
                value={formData.country || ""}
                onChange={handleChange}
                placeholder="Enter your country"
                className="h-11 border-border focus:border-primary focus:ring-primary"
                required
              />
              {formData.country !== undefined &&
                formData.country.length > 0 &&
                formData.country.length < 2 && (
                  <p className="text-sm text-destructive mt-1">Enter a valid country name</p>
                )}
            </div>

            {/* Zip Code */}
            <div className="space-y-1">
              <Label htmlFor="zipCode" className="text-foreground font-semibold text-base">
                Zip/Postal Code *
              </Label>
              <Input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode || ""}
                onChange={handleChange}
                placeholder="Enter your zip/postal code"
                className="h-11 border-border focus:border-primary focus:ring-primary"
                required
              />
              {formData.zipCode && !/^\d{5,6}$/.test(formData.zipCode) && (
                <p className="text-sm text-destructive mt-1">Zip Code must be 5–6 digits</p>
              )}
            </div>
          </div>

          {/* Support Contact Section */}
          <div className="mt-4 border-t border-border">
            <h3 className="text-foreground font-semibold text-lg">Support Contact Information</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Provide details of the person who will guide participants through events and provide assistance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-0 sm:gap-x-6 sm:gap-y-4 gap-y-2">
              {/* Support Contact Name */}
              <div className="space-y-1">
                <Label htmlFor="supportContactName" className="text-foreground font-semibold text-base">
                  Support Contact Name *
                </Label>
                <Input
                  type="text"
                  id="supportContactName"
                  name="supportContact.name"
                  value={formData.supportContact?.name || ""}
                  onChange={handleChange}
                  placeholder="Enter support contact name"
                  className="h-11 border-border focus:border-primary focus:ring-primary"
                  required
                />
                {formData.supportContact?.name && formData.supportContact.name.length < 2 && (
                  <p className="text-sm text-destructive mt-1">
                    Name must be at least 2 characters long
                  </p>
                )}
              </div>

              {/* Support Contact Phone */}
              <div className="space-y-1">
                <Label htmlFor="supportContactPhone" className="text-foreground font-semibold text-base">
                  Support Contact Phone *
                </Label>
                <Input
                  type="tel"
                  id="supportContactPhone"
                  name="supportContact.phone"
                  value={formData.supportContact?.phone || ""}
                  onChange={handleChange}
                  placeholder="Enter support contact phone"
                  className="h-11 border-border focus:border-primary focus:ring-primary"
                  required
                />
                {formData.supportContact?.phone &&
                  !/^\+?[\d\s-]{10,}$/.test(formData.supportContact.phone) && (
                    <p className="text-sm text-destructive mt-1">Please enter a valid phone number</p>
                  )}
              </div>

              {/* Support Contact Email */}
              <div className="space-y-1 sm:col-span-2">
                <Label htmlFor="supportContactEmail" className="text-foreground font-semibold text-base">
                  Support Contact Email *
                </Label>
                <Input
                  type="email"
                  id="supportContactEmail"
                  name="supportContact.email"
                  value={formData.supportContact?.email || ""}
                  onChange={handleChange}
                  placeholder="Enter support contact email"
                  className="h-11 border-border focus:border-primary focus:ring-primary"
                />
                {formData.supportContact?.email &&
                  formData.supportContact.email.length > 0 &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supportContact.email) && (
                    <p className="text-sm text-destructive mt-1">Please enter a valid email address</p>
                  )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end mt-1 sm:mt-4 gap-2 sm:gap-4">
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => goBack()}>
          Back
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            if (
              !formData.street ||
              formData.street.length < 3 ||
              !formData.city ||
              !formData.state ||
              !formData.country ||
              !formData.zipCode ||
              (formData.zipCode && !/^\d{5,6}$/.test(formData.zipCode)) ||
              !formData.supportContact?.name ||
              formData.supportContact.name.length < 2 ||
              !formData.supportContact?.phone ||
              !/^\+?[\d\s-]{10,}$/.test(formData.supportContact.phone) ||
              (formData.supportContact?.email &&
                formData.supportContact.email.length > 0 &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supportContact.email))
            ) {
              toast.error("Please fill all required fields correctly before proceeding.");
              return;
            }
            handleSubmit();
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

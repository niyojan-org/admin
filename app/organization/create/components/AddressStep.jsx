"use client";

import { useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganizationCreationStore } from "@/store/organizationCreationStore";
import { MapPin, Building, Map, Globe, Hash } from "lucide-react";

export default function AddressStep() {
  const {
    organizationDraft,
    updateNestedField,
    stepErrors,
    setStepErrors,
    clearStepErrors,
  } = useOrganizationCreationStore();

  const errors = stepErrors[2] || {};
  const address = organizationDraft.address;

  // Validate fields
  const validateField = useCallback((field, value) => {
    const newErrors = { ...errors };

    const requiredFields = ["locality", "city", "state", "country", "zipCode"];
    
    if (requiredFields.includes(field)) {
      if (!value || value.trim().length < 2) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      } else {
        delete newErrors[field];
      }
    }

    if (field === "zipCode" && value) {
      const zipRegex = /^[0-9]{5,10}$/;
      if (!zipRegex.test(value.replace(/\s/g, ""))) {
        newErrors.zipCode = "Please enter a valid zip/postal code";
      } else {
        delete newErrors.zipCode;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setStepErrors(2, newErrors);
    } else {
      clearStepErrors(2);
    }
  }, [errors, setStepErrors, clearStepErrors]);

  const handleChange = (field, value) => {
    updateNestedField("address", field, value);
    validateField(field, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="size-5" />
          Address Details
        </CardTitle>
        <CardDescription>
          Enter your organization&apos;s physical address. All fields are required.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Locality / Street Address */}
        <div className="space-y-2">
          <Label htmlFor="locality" className="flex items-center gap-1">
            <Building className="size-4" />
            Locality / Street Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="locality"
            placeholder="Enter street address, sector, or locality"
            value={address.locality}
            onChange={(e) => handleChange("locality", e.target.value)}
            aria-invalid={!!errors.locality}
          />
          {errors.locality && (
            <p className="text-sm text-destructive">{errors.locality}</p>
          )}
        </div>

        {/* City and State - Two columns on larger screens */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center gap-1">
              City <span className="text-destructive">*</span>
            </Label>
            <Input
              id="city"
              placeholder="Enter city"
              value={address.city}
              onChange={(e) => handleChange("city", e.target.value)}
              aria-invalid={!!errors.city}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city}</p>
            )}
          </div>

          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="state" className="flex items-center gap-1">
              <Map className="size-4" />
              State / Province <span className="text-destructive">*</span>
            </Label>
            <Input
              id="state"
              placeholder="Enter state or province"
              value={address.state}
              onChange={(e) => handleChange("state", e.target.value)}
              aria-invalid={!!errors.state}
            />
            {errors.state && (
              <p className="text-sm text-destructive">{errors.state}</p>
            )}
          </div>
        </div>

        {/* Country and Zip Code - Two columns on larger screens */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center gap-1">
              <Globe className="size-4" />
              Country <span className="text-destructive">*</span>
            </Label>
            <Input
              id="country"
              placeholder="Enter country"
              value={address.country}
              onChange={(e) => handleChange("country", e.target.value)}
              aria-invalid={!!errors.country}
            />
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country}</p>
            )}
          </div>

          {/* Zip Code */}
          <div className="space-y-2">
            <Label htmlFor="zipCode" className="flex items-center gap-1">
              <Hash className="size-4" />
              Zip / Postal Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="zipCode"
              placeholder="Enter zip or postal code"
              value={address.zipCode}
              onChange={(e) => handleChange("zipCode", e.target.value)}
              aria-invalid={!!errors.zipCode}
            />
            {errors.zipCode && (
              <p className="text-sm text-destructive">{errors.zipCode}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

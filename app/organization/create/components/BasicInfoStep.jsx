"use client";

import { useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-number-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useOrganizationCreationStore, CATEGORY_OPTIONS } from "@/store/organizationCreationStore";
import { Building2, Mail, Phone, Tag, FileText } from "lucide-react";
import { ImageCropUpload } from "@/components/ui/image-crop-upload";
import { uploadOrganizationLogo } from "@/lib/api/resources";
import { toast } from "sonner";

export default function BasicInfoStep() {
    const {
        organizationDraft,
        updateField,
        stepErrors,
        setStepErrors,
        clearStepErrors,
    } = useOrganizationCreationStore();

    const errors = stepErrors[1] || {};

    // Validate fields
    const validateField = useCallback((field, value) => {
        const newErrors = { ...errors };

        switch (field) {
            case "name":
                if (!value || value.trim().length < 3) {
                    newErrors.name = "Organization name must be at least 3 characters";
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
            case "category":
                if (!value) {
                    newErrors.category = "Please select a category";
                } else {
                    delete newErrors.category;
                }
                break;
            case "description":
                if (!value || value.trim().length === 0) {
                    newErrors.description = "Description is required";
                } else {
                    const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
                    if (wordCount < 10) {
                        newErrors.description = `Description must be at least 10 words (current: ${wordCount})`;
                    } else {
                        delete newErrors.description;
                    }
                }
                break;
            default:
                break;
        }

        if (Object.keys(newErrors).length > 0) {
            setStepErrors(1, newErrors);
        } else {
            clearStepErrors(1);
        }
    }, [errors, setStepErrors, clearStepErrors]);

    const handleChange = (field, value) => {
        updateField(field, value);
        validateField(field, value);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="size-5" />
                    Basic Information
                </CardTitle>
                <CardDescription>
                    Enter your organization&apos;s basic details. Fields marked with * are required.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 grid grid-cols-1 sm:grid-cols-2 space-x-2">
                {/* Organization Name */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-1">
                        Organization Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="name"
                        placeholder="Enter organization name"
                        value={organizationDraft.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                        <Mail className="size-4" />
                        Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="contact@organization.com"
                        value={organizationDraft.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1">
                        <Phone className="size-4" />
                        Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <PhoneInput
                        id="phone"
                        defaultCountry="IN"
                        value={organizationDraft.phone}
                        onChange={(value) => handleChange("phone", value || "")}
                        aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center gap-1">
                        <Tag className="size-4" />
                        Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={organizationDraft.category}
                        onValueChange={(value) => handleChange("category", value)}
                    >
                        <SelectTrigger className="w-full" aria-invalid={!!errors.category}>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORY_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && (
                        <p className="text-sm text-destructive">{errors.category}</p>
                    )}
                </div>

                {/* Sub Category (Optional) */}
                <div className="space-y-2">
                    <Label htmlFor="subCategory">
                        Sub Category <span className="text-muted-foreground text-xs">(Optional)</span>
                    </Label>
                    <Input
                        id="subCategory"
                        placeholder="e.g., Software Development, Education"
                        value={organizationDraft.subCategory}
                        onChange={(e) => updateField("subCategory", e.target.value)}
                    />
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description" className="flex items-center gap-1">
                        <FileText className="size-4" />
                        Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        id="description"
                        placeholder="Describe your organization... (minimum 10 words)"
                        value={organizationDraft.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="min-h-24"
                        aria-invalid={!!errors.description}
                    />
                    {errors.description && (
                        <p className="text-sm text-destructive">{errors.description}</p>
                    )}
                </div>

                {/* Logo Upload */}
                <div className="space-y-2 col-span-full">
                    <ImageCropUpload
                        label="Organization Logo"
                        placeholder="Upload your organization logo"
                        value={organizationDraft.logo}
                        onChange={(url) => updateField("logo", url)}
                        uploadFn={async (file) => {
                            try {
                                const result = await uploadOrganizationLogo(
                                    file,
                                    organizationDraft.name || "Organization Logo"
                                );
                                toast.success("Logo uploaded successfully");
                                return result;
                            } catch (error) {
                                toast.error("Failed to upload logo");
                                throw error;
                            }
                        }}
                        aspectRatio={1}
                        maxSize={5 * 1024 * 1024}
                    />
                    <p className="text-xs text-muted-foreground">
                        Upload a square image for best results. The image will be cropped to fit.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

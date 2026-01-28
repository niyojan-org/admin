"use client";

import { useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganizationCreationStore } from "@/store/organizationCreationStore";
import {
    Globe,
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
    BookOpen,
    Link2
} from "lucide-react";

const SOCIAL_LINK_CONFIG = [
    {
        key: "website",
        label: "Website",
        placeholder: "https://www.yourorganization.com",
        icon: Globe,
        required: true,
    },
    {
        key: "facebook",
        label: "Facebook",
        placeholder: "https://facebook.com/yourorganization",
        icon: Facebook,
        required: false,
    },
    {
        key: "instagram",
        label: "Instagram",
        placeholder: "https://instagram.com/yourorganization",
        icon: Instagram,
        required: false,
    },
    {
        key: "linkedin",
        label: "LinkedIn",
        placeholder: "https://linkedin.com/company/yourorganization",
        icon: Linkedin,
        required: false,
    },
    {
        key: "twitter",
        label: "Twitter / X",
        placeholder: "https://twitter.com/yourorganization",
        icon: Twitter,
        required: false,
    },
    {
        key: "youtube",
        label: "YouTube",
        placeholder: "https://youtube.com/yourorganization",
        icon: Youtube,
        required: false,
    },
    {
        key: "blog",
        label: "Blog",
        placeholder: "https://blog.yourorganization.com",
        icon: BookOpen,
        required: false,
    },
];

export default function SocialLinksStep() {
    const {
        organizationDraft,
        updateNestedField,
        stepErrors,
        setStepErrors,
        clearStepErrors,
    } = useOrganizationCreationStore();

    const errors = stepErrors[4] || {};
    const socialLinks = organizationDraft.socialLinks;

    // Validate URL
    const isValidUrl = (url) => {
        if (!url) return true; // Empty is valid for optional fields
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Validate fields
    const validateField = useCallback((field, value) => {
        const newErrors = { ...errors };
        const config = SOCIAL_LINK_CONFIG.find((c) => c.key === field);

        // Check if at least one social link is provided
        const hasAnySocialLink = Object.entries(socialLinks).some(
            ([key, val]) => key !== field && val && val.trim()
        );

        if (field === "website") {
            if (!value && !hasAnySocialLink) {
                newErrors.website = "At least one social link (preferably website) is required";
            } else if (value && !isValidUrl(value)) {
                newErrors.website = "Please enter a valid URL";
            } else {
                delete newErrors.website;
            }
        } else if (value && !isValidUrl(value)) {
            newErrors[field] = "Please enter a valid URL";
        } else {
            delete newErrors[field];
        }

        if (Object.keys(newErrors).length > 0) {
            setStepErrors(4, newErrors);
        } else {
            clearStepErrors(4);
        }
    }, [errors, socialLinks, setStepErrors, clearStepErrors]);

    const handleChange = (field, value) => {
        updateNestedField("socialLinks", field, value);
        validateField(field, value);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link2 className="size-5" />
                    Social Links
                </CardTitle>
                <CardDescription>
                    Add your organization&apos;s website and social media profiles. At least one link is required.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 grid grid-cols-1 sm:grid-cols-2 sm:space-x-3">
                {SOCIAL_LINK_CONFIG.map((config) => {
                    const Icon = config.icon;
                    return (
                        <div key={config.key} className="space-y-2">
                            <Label htmlFor={config.key} className="flex items-center gap-2">
                                <Icon className="size-4" />
                                {config.label}
                                {config.required && (
                                    <span className="text-destructive">*</span>
                                )}
                                {!config.required && (
                                    <span className="text-muted-foreground text-xs">(Optional)</span>
                                )}
                            </Label>
                            <Input
                                id={config.key}
                                type="url"
                                placeholder={config.placeholder}
                                value={socialLinks[config.key]}
                                onChange={(e) => handleChange(config.key, e.target.value)}
                                aria-invalid={!!errors[config.key]}
                            />
                            {errors[config.key] && (
                                <p className="text-sm text-destructive">{errors[config.key]}</p>
                            )}
                        </div>
                    );
                })}

                {/* Info card */}
                <div className="rounded-lg border bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                        <strong>Tip:</strong> Having a complete social media presence helps build trust with your audience and increases your organization&apos;s visibility.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

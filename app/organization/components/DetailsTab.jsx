"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconBuilding,
  IconMail,
  IconPhone,
  IconWorld,
  IconFileText,
  IconMapPin,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { Edit, ExternalLink } from "lucide-react";
import Image from "next/image";

const DetailsTab = ({ organization }) => {
  const router = useRouter();

  const socialPlatforms = [
    { key: "facebook", icon: IconBrandFacebook, color: "text-blue-600", label: "Facebook" },
    { key: "instagram", icon: IconBrandInstagram, color: "text-pink-600", label: "Instagram" },
    { key: "linkedin", icon: IconBrandLinkedin, color: "text-blue-700", label: "LinkedIn" },
    { key: "twitter", icon: IconBrandTwitter, color: "text-sky-500", label: "Twitter/X" },
    { key: "youtube", icon: IconBrandYoutube, color: "text-red-600", label: "YouTube" },
  ];

  const activeSocialLinks = socialPlatforms.filter(
    (platform) => organization.socialLinks?.[platform.key]
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Action */}
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push("/organization/edit")}
        >
          <Edit className="size-4 mr-2" />
          Edit Organization
        </Button>
      </div>

      {/* Logo & Cover */}
      {(organization.logo || organization.coverImage) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Branding</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Organization logo and cover image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {organization.logo && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Logo</p>
                  <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={organization.logo}
                      alt={`${organization.name} logo`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
              {organization.coverImage && (
                <div className="space-y-2 sm:col-span-2">
                  <p className="text-sm font-medium">Cover Image</p>
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={organization.coverImage}
                      alt={`${organization.name} cover`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Core organization details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <IconBuilding className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Organization Name</p>
                <p className="text-sm text-muted-foreground">{organization.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IconMail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{organization.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IconPhone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{organization.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IconWorld className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Website</p>
                {organization.website || organization.socialLinks?.website ? (
                  <a
                    href={organization.website || organization.socialLinks?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Visit website
                    <ExternalLink className="size-3" />
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">N/A</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Category</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="secondary" className="capitalize">
                    {organization.category}
                  </Badge>
                  {organization.subCategory && (
                    <Badge variant="outline" className="capitalize">
                      {organization.subCategory}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Slug</p>
                <p className="text-sm text-muted-foreground font-mono">{organization.slug}</p>
              </div>
            </div>
          </div>

          {organization.description && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Description</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {organization.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Address</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Physical location details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <IconMapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1 space-y-1">
              {organization.address?.locality && (
                <p className="text-sm">{organization.address.locality}</p>
              )}
              {organization.address?.street && (
                <p className="text-sm">{organization.address.street}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {organization.address?.city}, {organization.address?.state}{" "}
                {organization.address?.zipCode}
              </p>
              <p className="text-sm text-muted-foreground">{organization.address?.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Contact */}
      {organization.supportContact && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Support Contact</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Get in touch with support team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <IconBuilding className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {organization.supportContact.name}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IconMail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href={`mailto:${organization.supportContact.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {organization.supportContact.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IconPhone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Phone</p>
                  <a
                    href={`tel:${organization.supportContact.phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {organization.supportContact.phone}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Links */}
      {activeSocialLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Social Media</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Connect with us on social platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeSocialLinks.map((platform) => {
                const Icon = platform.icon;
                return (
                  <a
                    key={platform.key}
                    href={organization.socialLinks[platform.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors group"
                  >
                    <Icon className={`h-5 w-5 ${platform.color}`} />
                    <div>
                      <p className="text-sm font-medium">{platform.label}</p>
                      <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        Visit profile
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailsTab;

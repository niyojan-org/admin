"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconBuilding,
  IconMail,
  IconPhone,
  IconWorld,
  IconFileText,
  IconMapPin,
  IconBrandFacebook,
  IconBrandInstagram,
} from "@tabler/icons-react";

const DetailsTab = ({ organization }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Core organization details</CardDescription>
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
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {organization.website || "N/A"}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {organization.category} - {organization.subCategory}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Slug</p>
                <p className="text-sm text-muted-foreground">{organization.slug}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Address</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Physical location details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <IconMapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm">{organization.address?.street}</p>
              <p className="text-sm text-muted-foreground">
                {organization.address?.city}, {organization.address?.state} {organization.address?.zipCode}
              </p>
              <p className="text-sm text-muted-foreground">{organization.address?.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Social Media</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Connect with us on social platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {organization.socialLinks?.facebook && (
              <a
                href={organization.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <IconBrandFacebook className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Facebook</p>
                  <p className="text-xs text-muted-foreground">Visit our page</p>
                </div>
              </a>
            )}
            {organization.socialLinks?.instagram && (
              <a
                href={organization.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <IconBrandInstagram className="h-5 w-5 text-pink-600" />
                <div>
                  <p className="text-sm font-medium">Instagram</p>
                  <p className="text-xs text-muted-foreground">Follow us</p>
                </div>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsTab;

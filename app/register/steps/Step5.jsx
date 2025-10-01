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

export default function Step5({ goNext, goBack }) {
  const { organization, setOrganization } = useOrgStore();

  // Initialize form data with organization data if available
  const [formData, setFormData] = useState({
    facebook: organization?.socialLinks?.facebook || "",
    instagram: organization?.socialLinks?.instagram || "",
    linkedin: organization?.socialLinks?.linkedin || "",
    twitter: organization?.socialLinks?.twitter || "",
    youtube: organization?.socialLinks?.youtube || "",
    blog: organization?.socialLinks?.blog || "",
    website: organization?.website || "",
  });

  // State for logo upload
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(organization?.logo || null);
  const [logoUrl, setLogoUrl] = useState(organization?.logo || "");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // State for guidelines dialog
  const [showGuidelinesDialog, setShowGuidelinesDialog] = useState(false);

  // Update form data when organization changes
  useEffect(() => {
    if (organization?.socialMediaLinks) {
      setFormData({
        facebook: organization.socialLinks.facebook || "",
        instagram: organization.socialLinks.instagram || "",
        linkedin: organization.socialLinks.linkedin || "",
        twitter: organization.socialLinks.twitter || "",
        youtube: organization.socialLinks.youtube || "",
        blog: organization.socialLinks.blog || "",
        website: organization.website || "",
      });
      setLogoPreview(organization.logo || null);
      setLogoUrl(organization.logo || "");
    }
  }, [organization]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle logo file upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Logo file size must be less than 5MB");
        return;
      }

      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo upload to server
  const handleLogoUpload = async () => {
    if (!logoFile) {
      toast.error("Please select a logo file first");
      return;
    }

    setIsUploadingLogo(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", logoFile);
      uploadData.append("title", `${organization?.slug || "Organization"} Logo`);
      uploadData.append("folder", "organization-logos");

      const response = await api.post("/util/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        setLogoUrl(response.data.file.url);
        toast.success("Logo uploaded successfully!");
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (error) {
      toast.error("Failed to upload logo. Please try again.");
      console.error("Logo upload error:", error);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // URL validation function
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Validation function
  const validateForm = () => {
    // Check if at least one social media link is provided OR website is provided
    const hasAnyLink = Object.values(formData).some((value) => value && value.trim() !== "");
    const hasWebsite = formData.website && formData.website.trim() !== "";

    if (!hasAnyLink && !hasWebsite) {
      toast.error("Please provide at least one social media link or your organization website.");
      return false;
    }

    // Validate URL formats for filled fields
    for (const [key, value] of Object.entries(formData)) {
      if (value && value.trim() !== "") {
        if (!isValidUrl(value)) {
          toast.error(`Please enter a valid URL for ${key}.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      // Prepare social links (filter out empty values and website)
      const socialLinks = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) => key !== "website" && value && value.trim() !== ""
        )
      );

      // Prepare submission data
      const submitData = {
        website: formData.website || "",
        logo: logoUrl || "",
        social_links: socialLinks,
      };

      const response = await api.post("/org/register/social", submitData);

      toast.success(
        response.data.message || "Social media links and website have been successfully saved!"
      );
      setOrganization(response.data.org);
      goNext();
    } catch (error) {
      if (error.response?.data.error?.code === "SOCIAL_MEDIA_EXISTS") {
        toast.info("Let's move to next step");
        goNext();
        return;
      }
      toast.error(
        error.response?.data?.message || "Failed to save social media links. Please try again.",
        {
          description:
            error.response?.data?.error?.details ||
            "An error occurred while saving your social media links.",
        }
      );
    }
  };
  return (
    <div className="h-full bg-white rounded border shadow-navy border-navy px-10 flex flex-col justify-between py-2 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-navy text-lg">Connect your organization's online presence</p>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray text-center">
            <span className="text-red">*</span> At least one link or website required
          </div>
          {/* Info Button */}
          <Dialog open={showGuidelinesDialog} onOpenChange={setShowGuidelinesDialog}>
            <DialogTrigger asChild>
              <button
                className="w-8 h-8 cursor-pointer rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-300 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors"
                type="button"
                title="View Guidelines"
              >
                <IconInfoSquareRounded />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-navy">Social Media Guidelines</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Enter complete URLs including https://</li>
                    <li>• At least one social media link or organization website is required</li>
                    <li>• Make sure all links are publicly accessible</li>
                    <li>• Upload your organization logo (JPEG, PNG, or GIF, max 5MB)</li>
                    <li>• These links will be used to verify your organization's presence</li>
                    <li>• Links help establish credibility and authenticity</li>
                    <li>• You can update these links later in your organization settings</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Tips</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Add your official website first if available</li>
                    <li>• LinkedIn is highly recommended for professional organizations</li>
                    <li>• Include platforms where you're most active</li>
                    <li>• Ensure all profiles are up-to-date and professional</li>
                    <li>• Use consistent branding across all platforms</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-2 border-navy shadow-sm bg-white py-2">
        <CardContent className="px-6 py-1">
          <div className="space-y-2">
            {/* Organization Website and Logo Section */}
            <div className="space-y-3">
              <div className="border-b pb-2">
                <h3 className="text-navy font-semibold text-lg">Organization Details</h3>
                <p className="text-sm text-gray-600">
                  Add your official website and organization logo
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Website */}
                <div className="space-y-2">
                  <Label
                    htmlFor="website"
                    className="text-navy font-semibold text-base flex items-center gap-2"
                  >
                    <span className="text-blue-600">🌐</span> Organization Website *
                  </Label>
                  <Input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleChange}
                    placeholder="https://www.yourorganization.com"
                    className="h-11 border-gray-300 focus:border-navy focus:ring-navy"
                  />
                  {formData.website && !isValidUrl(formData.website) && (
                    <p className="text-sm text-red-500 mt-1">Please enter a valid website URL</p>
                  )}
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label className="text-navy font-semibold text-base flex items-center gap-2">
                    <span className="text-orange-600">🎨</span> Organization Logo
                  </Label>
                  <div className="space-y-2">
                    {/* File Selection */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          id="logo"
                          accept="image/jpeg,image/jpg,image/png,image/gif"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="logo"
                          className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-300 rounded hover:bg-blue-100 cursor-pointer transition-colors text-sm"
                        >
                          Choose Logo
                        </label>
                        {logoFile && (
                          <button
                            type="button"
                            onClick={handleLogoUpload}
                            disabled={isUploadingLogo}
                            className="px-4 py-2 bg-green-50 text-green-600 border border-green-300 rounded hover:bg-green-100 cursor-pointer transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isUploadingLogo ? "Uploading..." : "Upload Logo"}
                          </button>
                        )}
                      </div>

                      {/* Logo Preview */}
                      {logoPreview && (
                        <div className="flex items-center gap-3">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-16 h-16 object-cover rounded border shadow-sm"
                          />
                          <div className="flex flex-col gap-1">
                            {logoUrl && (
                              <span className="text-xs text-green-600 font-medium">
                                ✓ Logo uploaded successfully
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setLogoFile(null);
                                setLogoPreview(null);
                                setLogoUrl("");
                              }}
                              className="text-red-500 hover:text-red-700 text-xs text-left"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload JPEG, PNG, or GIF. Max size: 5MB. Click "Upload Logo" after selecting
                    file.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-2">
              <div className="border-b pb-2">
                <h3 className="text-navy font-semibold text-lg">Social Media & Online Presence</h3>
                <p className="text-sm text-gray-600">Add your organization's social media links</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 space-x-6 space-y-2">
                {/* Facebook */}
                <div className="space-y-1">
                  <Label
                    htmlFor="facebook"
                    className="text-navy font-semibold text-base flex items-center gap-1"
                  >
                    <span className="text-blue-600">📘</span> Facebook
                  </Label>
                  <Input
                    type="url"
                    id="facebook"
                    name="facebook"
                    value={formData.facebook || ""}
                    onChange={handleChange}
                    placeholder="https://facebook.com/yourorganization"
                    className="h-11 border-gray-300 focus:border-navy focus:ring-navy"
                  />
                  {formData.facebook && !isValidUrl(formData.facebook) && (
                    <p className="text-sm text-red-500 mt-1">Please enter a valid Facebook URL</p>
                  )}
                </div>

                {/* Instagram */}
                <div className="space-y-1">
                  <Label
                    htmlFor="instagram"
                    className="text-navy font-semibold text-base flex items-center gap-1"
                  >
                    <span className="text-pink-500">📷</span> Instagram
                  </Label>
                  <Input
                    type="url"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram || ""}
                    onChange={handleChange}
                    placeholder="https://instagram.com/yourorganization"
                    className="h-11 border-gray-300 focus:border-navy focus:ring-navy"
                  />
                  {formData.instagram && !isValidUrl(formData.instagram) && (
                    <p className="text-sm text-red-500 mt-1">Please enter a valid Instagram URL</p>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="space-y-1">
                  <Label
                    htmlFor="linkedin"
                    className="text-navy font-semibold text-base flex items-center gap-1"
                  >
                    <span className="text-blue-700">💼</span> LinkedIn
                  </Label>
                  <Input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin || ""}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/company/yourorganization"
                    className="h-11 border-gray-300 focus:border-navy focus:ring-navy"
                  />
                  {formData.linkedin && !isValidUrl(formData.linkedin) && (
                    <p className="text-sm text-red-500 mt-1">Please enter a valid LinkedIn URL</p>
                  )}
                </div>

                {/* Twitter/X */}
                <div className="space-y-1">
                  <Label
                    htmlFor="twitter"
                    className="text-navy font-semibold text-base flex items-center gap-1"
                  >
                    <span className="text-black">🐦</span> Twitter/X
                  </Label>
                  <Input
                    type="url"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter || ""}
                    onChange={handleChange}
                    placeholder="https://twitter.com/yourorganization"
                    className="h-11 border-gray-300 focus:border-navy focus:ring-navy"
                  />
                  {formData.twitter && !isValidUrl(formData.twitter) && (
                    <p className="text-sm text-red-500 mt-1">Please enter a valid Twitter/X URL</p>
                  )}
                </div>

                {/* YouTube */}
                <div className="space-y-1">
                  <Label
                    htmlFor="youtube"
                    className="text-navy font-semibold text-base flex items-center gap-1"
                  >
                    <span className="text-red-600">📺</span> YouTube
                  </Label>
                  <Input
                    type="url"
                    id="youtube"
                    name="youtube"
                    value={formData.youtube || ""}
                    onChange={handleChange}
                    placeholder="https://youtube.com/@yourorganization"
                    className="h-11 border-gray-300 focus:border-navy focus:ring-navy"
                  />
                  {formData.youtube && !isValidUrl(formData.youtube) && (
                    <p className="text-sm text-red-500 mt-1">Please enter a valid YouTube URL</p>
                  )}
                </div>

                {/* Blog */}
                <div className="space-y-1">
                  <Label
                    htmlFor="blog"
                    className="text-navy font-semibold text-base flex items-center gap-1"
                  >
                    <span className="text-orange-600">📝</span> Blog
                  </Label>
                  <Input
                    type="url"
                    id="blog"
                    name="blog"
                    value={formData.blog || ""}
                    onChange={handleChange}
                    placeholder="https://blog.yourorganization.com"
                    className="h-11 border-gray-300 focus:border-navy focus:ring-navy"
                  />
                  {formData.blog && !isValidUrl(formData.blog) && (
                    <p className="text-sm text-red-500 mt-1">Please enter a valid blog URL</p>
                  )}
                </div>
              </div>
            </div>

            {/* Removed inline Guidelines - now shown in dialog */}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-2 space-x-4">
        <Button variant="outline" onClick={() => goBack()}>
          Back
        </Button>
        <Button
          onClick={() => {
            if (!validateForm()) {
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

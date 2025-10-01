"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";

export default function BasicDetailsStep({ eventData, handleInputChange }) {
  // Banner upload state
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Handle banner upload
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload only JPEG or PNG images.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB.");
        return;
      }

      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setBannerPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadBanner = async () => {
    if (!bannerFile) return;
    setUploadingBanner(true);
    try {
      const formData = new FormData();
      formData.append("file", bannerFile);
      formData.append("folder", "event-banners");
      formData.append("title", `${eventData.title} - Banner`);

      const response = await api.post("/util/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Response:", response);

      if (response.data) {
        handleInputChange("bannerImage", response.data.file.url);
        toast.success("Banner uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload banner");
    } finally {
      setUploadingBanner(false);
    }
  };

  return (
    <Card className={"flex-1"}>
      <CardContent className="px-6 space-y-2 h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy">Basic Event Details</h2>
          <Dialog >
            <DialogTrigger asChild>
              <button className="text-navy hover:text-blue-700">
                <IconInfoSquareRounded className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Basic Details Guidelines</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>• Choose a clear and descriptive event title</p>
                <p>• Write a detailed description explaining what attendees can expect</p>
                <p>• Upload a high-quality banner image (recommended size: 1200x630px)</p>
                <p>• Keep descriptions concise but informative</p>
                <p>• Use professional language and proper grammar</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Event Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            value={eventData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter event title"
          />
        </div>

        {/* Event Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Event Description *</Label>
          <Textarea
            id="description"
            value={eventData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe your event in detail"
            className=""
            rows={4}
          />
        </div>

        {/* Banner Image */}
        <div className="space-y-2">
          <Label htmlFor="banner">Banner Image</Label>
          <div className="space-y-4">
            {eventData.bannerImage ? (
              <div className="relative">
                <img
                  src={eventData.bannerImage}
                  alt="Banner preview"
                  className="w-full max-w-md h-48 object-cover rounded-md border shadow-sm"
                />
                <div className="mt-2">
                  <Button variant="outline" onClick={() => handleInputChange("bannerImage", "")}>Edit Banner</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="flex-1"
                  />
                  {bannerFile && !uploadingBanner && (
                    <Button onClick={uploadBanner} variant="outline">
                      Upload Banner
                    </Button>
                  )}
                  {uploadingBanner && <p className="text-sm text-gray-500">Uploading...</p>}
                </div>
                {bannerPreview && (
                  <div className="relative">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full max-w-md h-48 object-cover rounded-md border shadow-sm"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateTimeInput } from "@/components/ui/date-time-input";
import { EVENT_CATEGORIES, EVENT_MODES, EVENT_TYPES } from "../constants/eventConstants";

export default function BasicDetailsStep({ event, setEvent }) {
  // Form state - manage internally
  const [formData, setFormData] = useState({
    title: "",
    mode: "",
    type: "",
    category: "",
    description: "",
    registrationStart: new Date().toISOString(),
    registrationEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    bannerImage: ""
  });

  // Banner upload state
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      return newData;
    });
  };

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
      const formDataUpload = new FormData();
      formDataUpload.append("file", bannerFile);
      formDataUpload.append("folder", "event-banners");
      formDataUpload.append("title", `${formData.title || 'Event'} - Banner`);

      const response = await api.post("/util/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        handleInputChange("bannerImage", response.data.file.url);
        toast.success("Banner uploaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to upload banner");
      console.error("Banner upload error:", error);
    } finally {
      setUploadingBanner(false);
    }
  };

  // Submit form data to API
  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.mode || !formData.type || !formData.category ||
        !formData.description || !formData.registrationStart || !formData.registrationEnd) {
        toast.error("Please fill in all required fields");
        return;
      }

      const response = await api.post("/event/admin/create", formData);

      if (response.data) {
        // Only call setEvent after successful API call
        setEvent(response.data.data.event);
        toast.success("Event details saved successfully!");
      }
    } catch (error) {
      toast.error("Failed to save event details");
      console.error("Submit error:", error);
    }
  };

  return (
    <Card className={"flex-1"}>
      <ScrollArea className="h-[500px]">
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
                  <p>• Select appropriate event mode, type, and category</p>
                  <p>• Set registration start and end dates</p>
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
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter event title"
            />
          </div>

          {/* Event Mode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="w-full">
              <Label htmlFor="mode">Event Mode *</Label>
              <Select value={formData.mode} onValueChange={(value) => handleInputChange("mode", value)}>
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder="Select event mode" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_MODES.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Type */}
            <div className="w-full">
              <Label htmlFor="type">Event Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Category */}
            <div className="w-full">
              <Label htmlFor="category">Event Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className={'w-full'}>
                  <SelectValue placeholder="Select event category" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Event Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Event Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your event in detail"
              className=""
              rows={4}
            />
          </div>

          {/* Registration Start Date */}
          <div className="space-y-2">
            <Label htmlFor="registrationStart">Registration Start Date *</Label>
            <DateTimeInput
              value={formData.registrationStart}
              onChange={(value) => handleInputChange("registrationStart", value)}
              minDateTime={new Date().toISOString()}
            />
          </div>

          {/* Registration End Date */}
          <div className="space-y-2">
            <Label htmlFor="registrationEnd">Registration End Date *</Label>
            <DateTimeInput
              value={formData.registrationEnd}
              onChange={(value) => handleInputChange("registrationEnd", value)}
              minDateTime={formData.registrationStart}
            />
          </div>

          {/* Banner Image */}
          <div className="space-y-2">
            <Label htmlFor="banner">Banner Image</Label>
            <div className="space-y-4">
              {formData.bannerImage ? (
                <div className="relative">
                  <img
                    src={formData.bannerImage}
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
      </ScrollArea>
      <div className="">
        <Button onClick={handleSubmit} className="w-full">
          Save Event Details
        </Button>
      </div>
    </Card>
  );
}

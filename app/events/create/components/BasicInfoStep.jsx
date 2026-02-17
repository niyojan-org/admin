"use client";
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconX, IconUpload, IconPhoto, IconTrash } from "@tabler/icons-react";
import { useEventForm } from "../hooks/useEventForm";
import { EVENT_CATEGORIES, EVENT_MODES } from "../constants/eventConstants";
import { toast } from "sonner";

export default function BasicInfoStep() {
    const { eventDraft, updateField, updateFields } = useEventForm();
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [bannerPreview, setBannerPreview] = useState(eventDraft.bannerImage || "");
    const fileInputRef = useRef(null);

    const handleTagsInput = (e) => {
        if (e.key === "Enter" && e.target.value.trim()) {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (!eventDraft.tags.includes(newTag)) {
                updateField("tags", [...eventDraft.tags, newTag]);
            }
            e.target.value = "";
        }
    };

    const removeTag = (tagToRemove) => {
        updateField("tags", eventDraft.tags.filter(tag => tag !== tagToRemove));
    };

    const validateImage = (file) => {
        return new Promise((resolve, reject) => {
            // Check file size (5MB = 5 * 1024 * 1024 bytes)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                reject("Image size must be under 5MB");
                return;
            }

            // Check file type
            if (!file.type.startsWith("image/")) {
                reject("Please upload an image file");
                return;
            }

            // Check aspect ratio
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            
            img.onload = () => {
                const aspectRatio = img.width / img.height;
                const targetRatio = 16 / 9;
                const tolerance = 0.1; // Allow 10% tolerance

                if (Math.abs(aspectRatio - targetRatio) > tolerance) {
                    URL.revokeObjectURL(objectUrl);
                    reject("Image must have a 16:9 aspect ratio (recommended: 1920x1080 or 1280x720)");
                    return;
                }

                URL.revokeObjectURL(objectUrl);
                resolve(true);
            };

            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject("Failed to load image");
            };

            img.src = objectUrl;
        });
    };

    const handleBannerUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingBanner(true);

            // Validate image
            await validateImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setBannerPreview(base64String);
                updateField("bannerImage", base64String);
                toast.success("Banner uploaded successfully!");
            };
            reader.onerror = () => {
                toast.error("Failed to read image file");
            };
            reader.readAsDataURL(file);

        } catch (error) {
            toast.error(error);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } finally {
            setUploadingBanner(false);
        }
    };

    const handleRemoveBanner = () => {
        setBannerPreview("");
        updateField("bannerImage", "");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        toast.info("Banner removed");
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Event Information</CardTitle>
                    <CardDescription>Basic details about your event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Tech Conference 2026"
                            value={eventDraft.title}
                            onChange={(e) => updateField("title", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your event..."
                            value={eventDraft.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={eventDraft.category}
                                onValueChange={(value) => updateField("category", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EVENT_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mode">Event Mode *</Label>
                            <Select
                                value={eventDraft.mode}
                                onValueChange={(value) => updateField("mode", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select mode" />
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bannerImage">Event Banner</Label>
                        <p className="text-xs text-muted-foreground">
                            Upload an image with 16:9 aspect ratio (e.g., 1920x1080 or 1280x720) under 5MB
                        </p>

                        {/* Banner Preview */}
                        {(bannerPreview || eventDraft.bannerImage) && (
                            <div className="relative w-full rounded-lg overflow-hidden border group">
                                <div className="relative aspect-video">
                                    <img
                                        src={bannerPreview || eventDraft.bannerImage}
                                        alt="Banner preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://placehold.co/1920x1080?text=Invalid+Image";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleRemoveBanner}
                                            className="gap-2"
                                        >
                                            <IconTrash className="w-4 h-4" />
                                            Remove
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="gap-2"
                                        >
                                            <IconUpload className="w-4 h-4" />
                                            Replace
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Upload Button */}
                        {!bannerPreview && !eventDraft.bannerImage && (
                            <div
                                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <IconPhoto className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Click to upload banner</p>
                                        <p className="text-sm text-muted-foreground">
                                            16:9 aspect ratio, max 5MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            className="hidden"
                        />

                        {uploadingBanner && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                Uploading and validating image...
                            </div>
                        )}

                        {/* Or provide URL */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or provide URL</span>
                            </div>
                        </div>

                        <Input
                            id="bannerImageUrl"
                            type="url"
                            placeholder="https://example.com/banner.jpg"
                            value={eventDraft.bannerImage?.startsWith("data:") ? "" : eventDraft.bannerImage}
                            onChange={(e) => {
                                const url = e.target.value;
                                setBannerPreview(url);
                                updateField("bannerImage", url);
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            id="tags"
                            placeholder="Press Enter to add tags"
                            onKeyDown={handleTagsInput}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {eventDraft.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="pl-3 pr-1">
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                                    >
                                        <IconX className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Registration Period</CardTitle>
                    <CardDescription>Set when participants can register</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Registration Start *</Label>
                            <DateTimePicker
                                value={eventDraft.registrationStart ? new Date(eventDraft.registrationStart) : null}
                                onChange={(date) => updateField("registrationStart", date?.toISOString())}
                                use12HourFormat={true}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Registration End *</Label>
                            <DateTimePicker
                                value={eventDraft.registrationEnd ? new Date(eventDraft.registrationEnd) : null}
                                onChange={(date) => updateField("registrationEnd", date?.toISOString())}
                                use12HourFormat={true}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Event Settings</CardTitle>
                    <CardDescription>Configure event features and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Public Event</Label>
                            <p className="text-sm text-muted-foreground">Make event visible to everyone</p>
                        </div>
                        <Switch
                            checked={eventDraft.visibility === "public"}
                            onCheckedChange={(checked) => updateField("visibility", checked ? "public" : "private")}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Allow Multiple Sessions</Label>
                            <p className="text-sm text-muted-foreground">Participants can register for multiple sessions</p>
                        </div>
                        <Switch
                            checked={eventDraft.allowMultipleSessions}
                            onCheckedChange={(checked) => updateField("allowMultipleSessions", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Auto Approve Participants</Label>
                            <p className="text-sm text-muted-foreground">Automatically approve registrations</p>
                        </div>
                        <Switch
                            checked={eventDraft.autoApproveParticipants}
                            onCheckedChange={(checked) => updateField("autoApproveParticipants", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Allow Coupons</Label>
                            <p className="text-sm text-muted-foreground">Enable discount coupons</p>
                        </div>
                        <Switch
                            checked={eventDraft.allowCoupons}
                            onCheckedChange={(checked) => updateField("allowCoupons", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Allow Referrals</Label>
                            <p className="text-sm text-muted-foreground">Enable referral system</p>
                        </div>
                        <Switch
                            checked={eventDraft.allowReferrals}
                            onCheckedChange={(checked) => updateField("allowReferrals", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Send email notifications to participants</p>
                        </div>
                        <Switch
                            checked={eventDraft.enableEmailNotifications}
                            onCheckedChange={(checked) => updateField("enableEmailNotifications", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>WhatsApp Notifications</Label>
                            <p className="text-sm text-muted-foreground">Send WhatsApp notifications</p>
                        </div>
                        <Switch
                            checked={eventDraft.enableWhatsappNotifications}
                            onCheckedChange={(checked) => updateField("enableWhatsappNotifications", checked)}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

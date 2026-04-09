"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Building2,
    MapPin,
    Globe,
    Loader2,
    Save,
    X,
    ImageIcon,
    AlertCircle,
    ArrowLeft
} from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-number-input";
import { ImageCropUpload } from "@/components/ui/image-crop-upload";
import api from "@/lib/api";
import { uploadOrganizationLogo, uploadOrganizationCover } from "@/lib/api/resources";

export default function EditOrganizationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        description: "",
        logo: "",
        coverImage: "",
        website: "",
        address: {
            locality: "",
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
        },
        socialMedia: {
            facebook: "",
            twitter: "",
            linkedin: "",
            instagram: "",
            youtube: "",
            blog: "",
        },
    });
    const [errors, setErrors] = useState({});
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchOrganization();
    }, []);

    const fetchOrganization = async () => {
        try {
            setLoading(true);
            const response = await api.get("/organizations/admin");

            if (response.data.success && response.data.organization) {
                const org = response.data.organization;
                setOrganization(org);

                // Initialize form data
                setFormData({
                    name: org.name || "",
                    email: org.email || "",
                    phone: org.phone || "",
                    description: org.description || "",
                    logo: org.logo || "",
                    coverImage: org.coverImage || "",
                    website: org.socialLinks?.website || org.website || "",
                    address: {
                        locality: org.address?.locality || "",
                        street: org.address?.street || "",
                        city: org.address?.city || "",
                        state: org.address?.state || "",
                        country: org.address?.country || "",
                        zipCode: org.address?.zipCode || "",
                    },
                    socialMedia: {
                        facebook: org.socialLinks?.facebook || "",
                        twitter: org.socialLinks?.twitter || "",
                        linkedin: org.socialLinks?.linkedin || "",
                        instagram: org.socialLinks?.instagram || "",
                        youtube: org.socialLinks?.youtube || "",
                        blog: org.socialLinks?.blog || "",
                    },
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch organization");
            router.push("/organization");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
        // Clear error for this field
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleNestedChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value,
            },
        }));
        setHasChanges(true);
        setErrors(prev => ({ ...prev, [`${parent}.${field}`]: undefined }));
    };

    const handleLogoUpload = async (file) => {
        try {
            toast.loading("Uploading logo...");
            const response = await uploadOrganizationLogo(file);
            if (response.data.success) {
                handleInputChange("logo", response.data.url);
                toast.dismiss();
                toast.success("Logo uploaded successfully");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to upload logo");
            console.error(error);
        }
    };

    const handleCoverUpload = async (file) => {
        try {
            toast.loading("Uploading cover image...");
            const response = await uploadOrganizationCover(file);
            if (response.data.success) {
                handleInputChange("coverImage", response.data.url);
                toast.dismiss();
                toast.success("Cover image uploaded successfully");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to upload cover image");
            console.error(error);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.description || formData.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters";
        }

        if (formData.phone && formData.phone.length < 10) {
            newErrors.phone = "Invalid phone number";
        }

        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = "Invalid email address";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors before submitting");
            return;
        }

        setSaving(true);

        try {
            const updateData = {
                description: formData.description,
                website: formData.website,
                logo: formData.logo,
                coverImage: formData.coverImage,
                address: formData.address,
                socialMedia: formData.socialMedia,
            };

            const response = await api.patch("/organizations/admin/update", updateData);

            if (response.data.success) {
                toast.success("Organization updated successfully!");
                setHasChanges(false);
                router.push("/organization");
            } else {
                toast.error(response.data.message || "Failed to update organization");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update organization");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
                router.push("/organization");
            }
        } else {
            router.push("/organization");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Loader2 className="size-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading organization details...</p>
                </div>
            </div>
        );
    }

    if (!organization) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Organization not found</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/organization")}
                        className="mb-2"
                    >
                        <ArrowLeft className="size-4 mr-2" />
                        Back to Organization
                    </Button>
                    <h1 className="text-3xl font-bold">Edit Organization</h1>
                    <p className="text-muted-foreground mt-1">
                        Update your organization information
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="address">Address</TabsTrigger>
                        <TabsTrigger value="social">Social Links</TabsTrigger>
                        <TabsTrigger value="media">Images</TabsTrigger>
                    </TabsList>

                    {/* Basic Information Tab */}
                    <TabsContent value="basic" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="size-5" />
                                    Basic Information
                                </CardTitle>
                                <CardDescription>
                                    Update your organization's core information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Name (Read-only) */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Organization Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        disabled
                                        className="bg-muted cursor-not-allowed"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Organization name cannot be changed
                                    </p>
                                </div>

                                {/* Email (Read-only) */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="bg-muted cursor-not-allowed"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Primary email cannot be changed
                                    </p>
                                </div>

                                {/* Phone (Read-only) */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        disabled
                                        className="bg-muted cursor-not-allowed"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Phone number cannot be changed
                                    </p>
                                </div>

                                <Separator />

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your organization..."
                                        value={formData.description}
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        rows={5}
                                        className={errors.description ? "border-destructive" : ""}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">{errors.description}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        {formData.description.length} characters
                                    </p>
                                </div>

                                {/* Website */}
                                <div className="space-y-2">
                                    <Label htmlFor="website">
                                        <Globe className="size-4 inline mr-1" />
                                        Website URL
                                    </Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={formData.website}
                                        onChange={(e) => handleInputChange("website", e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Address Tab */}
                    <TabsContent value="address" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="size-5" />
                                    Address Details
                                </CardTitle>
                                <CardDescription>
                                    Update your organization's physical address
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="locality">Locality / Street Address</Label>
                                        <Input
                                            id="locality"
                                            placeholder="Street address, sector, or locality"
                                            value={formData.address.locality}
                                            onChange={(e) => handleNestedChange("address", "locality", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="street">Street (Optional)</Label>
                                        <Input
                                            id="street"
                                            placeholder="Additional street information"
                                            value={formData.address.street}
                                            onChange={(e) => handleNestedChange("address", "street", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            placeholder="City"
                                            value={formData.address.city}
                                            onChange={(e) => handleNestedChange("address", "city", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state">State / Province</Label>
                                        <Input
                                            id="state"
                                            placeholder="State or Province"
                                            value={formData.address.state}
                                            onChange={(e) => handleNestedChange("address", "state", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            placeholder="Country"
                                            value={formData.address.country}
                                            onChange={(e) => handleNestedChange("address", "country", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode">Zip / Postal Code</Label>
                                        <Input
                                            id="zipCode"
                                            placeholder="Zip or Postal Code"
                                            value={formData.address.zipCode}
                                            onChange={(e) => handleNestedChange("address", "zipCode", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Social Links Tab */}
                    <TabsContent value="social" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="size-5" />
                                    Social Media Links
                                </CardTitle>
                                <CardDescription>
                                    Add your organization's social media profiles
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="facebook">Facebook</Label>
                                        <Input
                                            id="facebook"
                                            type="url"
                                            placeholder="https://facebook.com/yourpage"
                                            value={formData.socialMedia.facebook}
                                            onChange={(e) => handleNestedChange("socialMedia", "facebook", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="twitter">Twitter / X</Label>
                                        <Input
                                            id="twitter"
                                            type="url"
                                            placeholder="https://twitter.com/yourhandle"
                                            value={formData.socialMedia.twitter}
                                            onChange={(e) => handleNestedChange("socialMedia", "twitter", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin">LinkedIn</Label>
                                        <Input
                                            id="linkedin"
                                            type="url"
                                            placeholder="https://linkedin.com/company/yourcompany"
                                            value={formData.socialMedia.linkedin}
                                            onChange={(e) => handleNestedChange("socialMedia", "linkedin", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="instagram">Instagram</Label>
                                        <Input
                                            id="instagram"
                                            type="url"
                                            placeholder="https://instagram.com/yourhandle"
                                            value={formData.socialMedia.instagram}
                                            onChange={(e) => handleNestedChange("socialMedia", "instagram", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="youtube">YouTube</Label>
                                        <Input
                                            id="youtube"
                                            type="url"
                                            placeholder="https://youtube.com/@yourchannel"
                                            value={formData.socialMedia.youtube}
                                            onChange={(e) => handleNestedChange("socialMedia", "youtube", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="blog">Blog</Label>
                                        <Input
                                            id="blog"
                                            type="url"
                                            placeholder="https://blog.example.com"
                                            value={formData.socialMedia.blog}
                                            onChange={(e) => handleNestedChange("socialMedia", "blog", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Images Tab */}
                    <TabsContent value="media" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="size-5" />
                                    Organization Images
                                </CardTitle>
                                <CardDescription>
                                    Update your logo and cover image
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Logo */}
                                <div className="space-y-2">
                                    <Label>Organization Logo</Label>
                                    <ImageCropUpload
                                        onImageCropped={handleLogoUpload}
                                        currentImage={formData.logo}
                                        aspect={1}
                                        label="Upload Logo (Square)"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Recommended: Square image, at least 400x400px
                                    </p>
                                </div>

                                <Separator />

                                {/* Cover Image */}
                                <div className="space-y-2">
                                    <Label>Cover Image</Label>
                                    <ImageCropUpload
                                        onImageCropped={handleCoverUpload}
                                        currentImage={formData.coverImage}
                                        aspect={16 / 9}
                                        label="Upload Cover (16:9)"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Recommended: 16:9 ratio, at least 1600x900px
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        <X className="size-4 mr-2" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={saving || !hasChanges}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="size-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="size-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
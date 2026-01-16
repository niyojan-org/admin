"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, X, User, Mail, Phone, MapPin, Users, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { IconMapPin } from "@tabler/icons-react";
import { PhoneInput } from "../ui/phone-number-input";

export function PersonalInfoEdit({ user, onSave, onCancel, className }) {
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        gender: user?.gender || "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name?.trim()) {
            newErrors.name = "Full name is required";
        }

        if (!formData.email?.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast.error("Please fix the errors before saving");
            return;
        }

        setIsLoading(true);
        try {
            await onSave(formData);
            // toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
            gender: user?.gender || "",
        });
        setErrors({});
        onCancel();
    };

    return (
        <Card className={cn("gap-2", className)}>
            <CardHeader className="border-b pb-2 flex items-center justify-between">
                <CardTitle className="hidden sm:flex items-center gap-2 text-sm">
                    <User className="h-5 w-5" />
                    Edit Personal Information
                </CardTitle>
                <CardAction >
                    <div className="flex gap-2 justify-between">
                        <Button size="sm" onClick={handleSave} disabled={isLoading}>
                            <Save className="h-4 w-4" />
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel} disabled={isLoading}>
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                    </div>
                </CardAction>
            </CardHeader>
            <CardContent className="">

                <form className="grid sm:grid-cols-2 gap-2" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Enter your full name"
                            className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="Enter your email address"
                            className={errors.email ? "border-destructive" : ""}
                            disabled // Email is usually not editable
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            Phone Number
                        </Label>
                        <PhoneInput
                            id="phone"
                            type="tel"
                            defaultCountry="IN"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e)}
                            placeholder="Enter your phone number"
                            className={errors.phone ? "border-destructive" : ""}
                        />
                        {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
                            <IconMapPin className="h-4 w-4 text-muted-foreground" />
                            Address
                        </Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            placeholder="Enter your address"
                        />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <Label htmlFor="gender" className="flex items-center gap-2 text-sm font-medium">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            Gender
                        </Label>
                        <Select
                            value={formData.gender}
                            onValueChange={(value) => handleInputChange("gender", value)}
                        >
                            <SelectTrigger className={'w-full'}>
                                <SelectValue placeholder="Select your gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Form Actions */}
                    <div className=" flex flex-col items-end justify-end text-start md:text-end">
                        <p className="text-xs text-muted-foreground">
                            Update your personal information. Fields marked with * are required.
                        </p>
                        <p className="text-xs text-red-500">
                            Email cannot be changed. Contact support if you need to update it.
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
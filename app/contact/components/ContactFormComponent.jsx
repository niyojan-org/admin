"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconAlertCircle, IconLoader2 } from "@tabler/icons-react";
import { AttachmentDialog } from "./AttachmentDialog";
import { cn } from "@/lib/utils";

const CATEGORIES = [
    { value: "general", label: "General Inquiry" },
    { value: "support", label: "Support Request" },
    { value: "sales", label: "Sales Inquiry" },
    { value: "project-inquiry", label: "Project Inquiry" },
    { value: "collaboration", label: "Collaboration" },
    { value: "feedback", label: "Feedback" },
    { value: "complaint", label: "Complaint" },
    { value: "bug-report", label: "Bug Report" },
    { value: "feature-request", label: "Feature Request" },
    { value: "other", label: "Other" },
];

export const ContactFormComponent = ({
    formData,
    files,
    loading,
    errors,
    onSubmit,
    onChange,
    onFileChange,
    onRemoveFile,
}) => {
    const hasErrors = Object.keys(errors).length > 0;

    return (
        <Card className="shadow-none p-0">
            <CardContent className="p-2 sm:p-6 md:p-8">
                <form onSubmit={onSubmit} className="space-y-2">
                    {/* Show general error message */}
                    {hasErrors && (
                        <Alert variant="destructive">
                            <IconAlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Please fix the errors below before submitting
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Name & Email Row */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Full Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={onChange}
                                className={cn(
                                    "h-10 shadow-none",
                                    errors.name && "border-destructive focus-visible:ring-destructive"
                                )}
                                disabled={loading}
                                maxLength={100}
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email Address <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={onChange}
                                className={cn(
                                    "h-10 shadow-none",
                                    errors.email && "border-destructive focus-visible:ring-destructive"
                                )}
                                disabled={loading}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Phone & Category Row */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Phone Field */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number (Optional)</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={onChange}
                                className={cn(
                                    "h-10 shadow-none",
                                    errors.phone && "border-destructive focus-visible:ring-destructive"
                                )}
                                disabled={loading}
                            />
                            {errors.phone && (
                                <p className="text-xs text-destructive">{errors.phone}</p>
                            )}
                        </div>

                        {/* Category Field */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) =>
                                    onChange({ target: { name: "category", value } })
                                }
                                disabled={loading}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="subject">Subject (Optional)</Label>
                            {formData.subject && (
                                <p className="text-xs text-muted-foreground text-right">
                                    {formData.subject.length}/200
                                </p>
                            )}
                        </div>

                        <Input
                            id="subject"
                            name="subject"
                            placeholder="Brief description of your inquiry"
                            value={formData.subject}
                            onChange={onChange}
                            className={cn(
                                "h-10 shadow-none",
                                errors.subject && "border-destructive focus-visible:ring-destructive"
                            )}
                            disabled={loading}
                            maxLength={200}
                        />
                        {errors.subject && (
                            <p className="text-xs text-destructive">{errors.subject}</p>
                        )}
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                        <Label htmlFor="message">
                            Message <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Tell us how we can help you..."
                            value={formData.message}
                            onChange={onChange}
                            className={cn(
                                "shadow-none min-h-[120px] resize-y",
                                errors.message && "border-destructive focus-visible:ring-destructive"
                            )}
                            disabled={loading}
                            rows={6}
                            maxLength={5000}
                        />
                        {errors.message && (
                            <p className="text-xs text-destructive">{errors.message}</p>
                        )}
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">
                                Be as detailed as possible
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formData.message.length}/5000
                            </p>
                        </div>
                    </div>

                    {/* File Upload - Dialog Button */}
                    <div className="space-y-2">
                        <Label>Attachments (Optional)</Label>
                        <AttachmentDialog
                            files={files}
                            onFileChange={onFileChange}
                            onRemoveFile={onRemoveFile}
                            disabled={loading}
                        />
                    </div>

                    {/* Privacy Notice */}
                    <div>
                        <p className="text-xs">
                            By submitting this form, you agree to our{" "}
                            <a
                                href="/terms-and-conditions"
                                className="underline font-medium hover:text-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                terms and conditions
                            </a>{" "}
                            and{" "}
                            <a
                                href="/privacy-policy"
                                className="underline font-medium hover:text-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                privacy policy
                            </a>
                            . We'll send an acknowledgment email and respond within 24-48 hours.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={loading || hasErrors}
                    >
                        {loading ? (
                            <>
                                <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                                Sending Message...
                            </>
                        ) : (
                            "Send Message"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

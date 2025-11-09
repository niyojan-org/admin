"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconCheck, IconCopy, IconMail, IconSend } from "@tabler/icons-react";
import { toast } from "sonner";

export const SuccessModal = ({ open, onClose, data, onSendAnother }) => {
    const [copied, setCopied] = useState(false);

    if (!data) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(data.id);
        setCopied(true);
        toast.success("Reference ID copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const getExpectedResponseTime = () => {
        const categoryTimes = {
            general: "24-48 hours",
            support: "12-24 hours",
            sales: "4-8 hours",
            "project-inquiry": "24 hours",
            collaboration: "48 hours",
            feedback: "48 hours",
            complaint: "8-12 hours",
            "bug-report": "12-24 hours",
            "feature-request": "48-72 hours",
            other: "24-48 hours",
        };

        return categoryTimes[data.category] || "24-48 hours";
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <IconCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-2xl">
                        Message Sent Successfully!
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        We've received your message and will respond as soon as possible.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Reference ID Card */}
                    <Card className="p-4 bg-muted/50">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <IconMail className="h-4 w-4" />
                                <span className="font-medium">Your Reference ID</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-sm font-mono bg-background px-3 py-2 rounded border break-all">
                                    {data.id}
                                </code>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopy}
                                    className="flex-shrink-0"
                                >
                                    {copied ? (
                                        <IconCheck className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <IconCopy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Save this ID to track your submission status
                            </p>
                        </div>
                    </Card>

                    {/* Info Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="p-3">
                            <div className="text-center space-y-1">
                                <p className="text-xs text-muted-foreground">Status</p>
                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    {data.status || "New"}
                                </p>
                            </div>
                        </Card>

                        <Card className="p-3">
                            <div className="text-center space-y-1">
                                <p className="text-xs text-muted-foreground">Response Time</p>
                                <p className="text-sm font-semibold">
                                    {getExpectedResponseTime()}
                                </p>
                            </div>
                        </Card>
                    </div>

                    {data.attachmentCount > 0 && (
                        <Card className="p-3">
                            <div className="text-center space-y-1">
                                <p className="text-xs text-muted-foreground">
                                    Attachments Uploaded
                                </p>
                                <p className="text-sm font-semibold">
                                    {data.attachmentCount} file{data.attachmentCount > 1 ? "s" : ""}
                                </p>
                            </div>
                        </Card>
                    )}

                    {/* Confirmation Email Notice */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="flex gap-2">
                            <IconMail className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    Confirmation Email Sent
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    We've sent an acknowledgment to <strong>{data.email}</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                onClose();
                                onSendAnother();
                            }}
                        >
                            <IconSend className="h-4 w-4 mr-2" />
                            Send Another
                        </Button>
                        <Button className="flex-1" onClick={onClose}>
                            Done
                        </Button>
                    </div>

                    {/* Additional Info */}
                    <p className="text-xs text-center text-muted-foreground">
                        You'll receive a notification email when we respond to your message
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

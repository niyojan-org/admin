"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    IconDeviceLaptop,
    IconDeviceMobile,
    IconFingerprint,
    IconEdit,
    IconCheck,
    IconX,
    IconTrash,
    IconClock,
    IconCalendarEvent,
    IconCloud,
    IconDevices,
} from "@tabler/icons-react";

export function PasskeyCard({
    passkey,
    onDelete,
    onUpdateName,
    isUpdating
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(passkey.name || "");

    const handleSave = () => {
        if (editName.trim()) {
            onUpdateName(passkey.id, editName.trim());
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditName(passkey.name || getDefaultName());
        setIsEditing(false);
    };

    const getDefaultName = () => {
        const type = passkey.deviceType || "Unknown";
        return `${type.charAt(0).toUpperCase() + type.slice(1)} Device`;
    };

    const getDeviceIcon = () => {
        const type = passkey.deviceType?.toLowerCase() || "";
        if (type.includes("mobile") || type === "singledevice") {
            return IconDeviceMobile;
        }
        if (type.includes("laptop") || type.includes("desktop") || type === "multidevice") {
            return IconDeviceLaptop;
        }
        return IconFingerprint;
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const getRelativeTime = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDateTime(dateString);
    };

    const DeviceIcon = getDeviceIcon();

    return (
        <Card className="group hover:shadow-md transition-shadow p-0 sm:px-0 px-0">
            <CardContent className="w-full px-0 p-2 flex items-start justify-center">
                {/* Content */}
                <div className="space-y-2 w-full">
                    {/* Name with Edit */}
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-8 text-sm"
                                placeholder="Device name"
                                autoFocus
                                disabled={isUpdating}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSave();
                                    if (e.key === "Escape") handleCancel();
                                }}
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                onClick={handleSave}
                                disabled={isUpdating || !editName.trim()}
                            >
                                <IconCheck className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={handleCancel}
                                disabled={isUpdating}
                            >
                                <IconX className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 w-full">
                            <div>
                                <DeviceIcon className="size-10 text-muted-foreground" />
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <h3 className="font-medium text-sm truncate">
                                    {passkey.name || getDefaultName()}
                                </h3>
                            </div>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="secondary" className="text-xs font-normal gap-1">
                            <IconDevices className="h-3 w-3" />
                            {passkey.deviceType === "multiDevice" ? "Multi-device" : "Single device"}
                        </Badge>
                        {passkey.backedUp && (
                            <Badge variant="outline" className="text-xs font-normal gap-1">
                                <IconCloud className="h-3 w-3" />
                                Synced
                            </Badge>
                        )}
                    </div>

                    {/* Timestamps */}
                    <div className="space-y-0.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <IconCalendarEvent className="h-3 w-3" />
                            <span>Added {formatDateTime(passkey.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <IconClock className="h-3 w-3" />
                            {passkey.lastUsedAt ? (
                                <span>Last used {getRelativeTime(passkey.lastUsedAt)}</span>
                            ) : (
                                <span className="text-amber-600">Never used</span>
                            )}
                        </div>
                    </div>
                </div>

                {!isEditing && <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                        setEditName(passkey.name || getDefaultName());
                        setIsEditing(true);
                    }}
                >
                    <IconEdit className="h-3 w-3" />
                </Button>}

                {/* Delete Button */}
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDelete(passkey)}
                >
                    <IconTrash className="h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
}

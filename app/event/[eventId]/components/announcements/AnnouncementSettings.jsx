"use client";
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, AlertTriangle, Users } from "lucide-react";

const AnnouncementSettings = ({ 
    messageType, 
    priority, 
    selectedCount, 
    onMessageTypeChange, 
    onPriorityChange 
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Message Type */}
            <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-3 w-3" />
                    Channel
                </Label>
                <Select value={messageType} onValueChange={onMessageTypeChange}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="whatsapp">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-3 w-3" />
                                WhatsApp Only
                            </div>
                        </SelectItem>
                        <SelectItem value="email">
                            <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                Email Only
                            </div>
                        </SelectItem>
                        <SelectItem value="both">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    <Mail className="h-3 w-3" />
                                </div>
                                Both Channels
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3" />
                    Priority
                </Label>
                <Select value={priority} onValueChange={onPriorityChange}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                Low Priority
                            </div>
                        </SelectItem>
                        <SelectItem value="normal">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Normal Priority
                            </div>
                        </SelectItem>
                        <SelectItem value="high">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                High Priority
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Participant Count */}
            <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    Recipients
                </Label>
                <div className="flex items-center h-9 px-3 border rounded-md bg-muted/30">
                    <Badge variant="secondary" className="text-xs">
                        {selectedCount} selected
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementSettings;

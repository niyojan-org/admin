"use client";
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Users, Clock, MessageSquare } from "lucide-react";

const AnnouncementPreview = ({ data, open, onClose }) => {
    if (!data) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Announcement Preview
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Event Info */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Event Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-gray-600">
                                <strong>Event:</strong> {data.eventTitle}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Original Message */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Original Message</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h4 className="font-medium text-sm text-gray-600 mb-1">Title</h4>
                                <p className="text-sm">{data.originalMessage.title}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-sm text-gray-600 mb-1">
                                    Message ({data.originalMessage.characterCount} characters)
                                </h4>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm whitespace-pre-wrap">{data.originalMessage.message}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Placeholders Info */}
                    {data.placeholders && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Placeholders</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {data.placeholders.detected.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-600 mb-2">Detected in Message</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {data.placeholders.detected.map((placeholder, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {placeholder}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-medium text-sm text-gray-600 mb-2">Available Placeholders</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {data.placeholders.available.map((placeholder, index) => (
                                            <Badge key={index} variant="outline">
                                                {placeholder}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Preview Samples */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Preview Samples</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.previews.map((preview, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-sm">
                                            Sample {index + 1}: {preview.participant.name}
                                        </h4>
                                        <Badge variant="outline" className="text-xs">
                                            {preview.participant.email}
                                        </Badge>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-xs font-medium text-gray-600">Title:</span>
                                            <p className="text-sm mt-1">{preview.personalizedMessage.title}</p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <span className="text-xs font-medium text-gray-600">Message:</span>
                                            <div className="mt-1 p-2 bg-white rounded border">
                                                <p className="text-sm whitespace-pre-wrap">
                                                    {preview.personalizedMessage.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Statistics */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Users className="h-4 w-4 text-blue-600" />
                                        <span className="text-lg font-semibold text-blue-600">
                                            {data.statistics.totalParticipants}
                                        </span>
                                    </div>
                                    <div className="text-xs text-blue-500">Total Recipients</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Clock className="h-4 w-4 text-green-600" />
                                        <span className="text-lg font-semibold text-green-600">
                                            {data.statistics.estimatedDuration}
                                        </span>
                                    </div>
                                    <div className="text-xs text-green-500">Est. Duration</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tips */}
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-2">
                                <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-1">Tips for better engagement:</p>
                                    <ul className="text-xs space-y-1 list-disc list-inside">
                                        <li>Personalized messages have higher open rates</li>
                                        <li>Keep messages concise and clear</li>
                                        <li>Include a clear call-to-action if needed</li>
                                        <li>Test with a small group first for important announcements</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AnnouncementPreview;

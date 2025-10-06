"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
    Clock, CheckCircle, XCircle, AlertCircle, Calendar,
    Users, MessageSquare, RefreshCw, Eye, RotateCcw
} from "lucide-react";
import { toast } from 'sonner';
import api from '@/lib/api';
import moment from 'moment';

const AnnouncementDetails = ({ eventId, announcement }) => {
    const [detailedData, setDetailedData] = useState(null);
    const [jobStatus, setJobStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (announcement) {
            fetchAnnouncementDetails();
        }
    }, [announcement]);

    const fetchAnnouncementDetails = async () => {
        try {
            const [detailsResponse, statusResponse] = await Promise.all([
                api.get(`/event/admin/announcement/${eventId}/${announcement._id}`),
                api.get(`/event/admin/announcement/${eventId}/${announcement._id}/status`)
            ]);

            if (detailsResponse.data.success) {
                setDetailedData(detailsResponse.data.announcement);
            }

            if (statusResponse.data.success) {
                setJobStatus(statusResponse.data.jobStatus);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch announcement details";
            const errorDetails = error.response?.data?.error?.details;
            toast.error(errorMessage);
            if (errorDetails) {
                toast.error(errorDetails);
            }
            console.error("Error fetching announcement details:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <Clock className="h-4 w-4 text-yellow-500" />,
            scheduled: <Calendar className="h-4 w-4 text-blue-500" />,
            sent: <CheckCircle className="h-4 w-4 text-green-500" />,
            failed: <XCircle className="h-4 w-4 text-red-500" />,
            partial: <AlertCircle className="h-4 w-4 text-orange-500" />,
            cancelled: <XCircle className="h-4 w-4 text-gray-500" />
        };
        return icons[status] || icons.pending;
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "text-yellow-600 bg-yellow-50",
            scheduled: "text-blue-600 bg-blue-50",
            sent: "text-green-600 bg-green-50",
            failed: "text-red-600 bg-red-50",
            partial: "text-orange-600 bg-orange-50",
            cancelled: "text-gray-600 bg-gray-50"
        };
        return colors[status] || colors.pending;
    };

    const handleRetry = async () => {
        try {
            const response = await api.post(`/event/admin/announcement/${eventId}/${announcement._id}/retry`);
            if (response.data.success) {
                toast.success("Announcement retry initiated");
                fetchAnnouncementDetails(); // Refresh data
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to retry announcement";
            const errorDetails = error.response?.data?.error?.details;
            toast.error(errorMessage);
            if (errorDetails) {
                toast.error(errorDetails);
            }
            console.error("Retry error:", error);
        }
    };

    if (!announcement) return null;

    if (loading) {
        return (
            <div className="space-y-4">
                <DialogHeader>
                    <DialogTitle>Loading...</DialogTitle>
                </DialogHeader>
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    const data = detailedData || announcement;
    const deliveryStats = data.deliveryStats || {};

    return (
        <div className="space-y-6">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    {getStatusIcon(data.status)}
                    {data.title}
                </DialogTitle>
            </DialogHeader>

            {/* Status Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Status & Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${getStatusColor(data.status)}`}>
                        {getStatusIcon(data.status)}
                        <span className="font-medium">
                            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                        </span>
                    </div>

                    {jobStatus && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{jobStatus.progress}%</span>
                            </div>
                            <Progress value={jobStatus.progress} className="h-2" />
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="text-center">
                                    <div className="font-medium text-green-600">{jobStatus.processedCount || 0}</div>
                                    <div className="text-gray-500">Processed</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-medium text-red-600">{jobStatus.failedCount || 0}</div>
                                    <div className="text-gray-500">Failed</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-medium text-blue-600">{jobStatus.remainingCount || 0}</div>
                                    <div className="text-gray-500">Remaining</div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Message Content */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Message Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.description && (
                        <div>
                            <h4 className="font-medium text-sm text-gray-600 mb-1">Description</h4>
                            <p className="text-sm">{data.description}</p>
                        </div>
                    )}
                    
                    <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">Message</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm whitespace-pre-wrap">{data.message}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delivery Statistics */}
            {Object.keys(deliveryStats).length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Delivery Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-lg font-semibold text-blue-600">
                                    {deliveryStats.total || data.participantCount || 0}
                                </div>
                                <div className="text-xs text-blue-500">Total</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-lg font-semibold text-green-600">
                                    {deliveryStats.sent || 0}
                                </div>
                                <div className="text-xs text-green-500">Sent</div>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <div className="text-lg font-semibold text-yellow-600">
                                    {deliveryStats.delivered || 0}
                                </div>
                                <div className="text-xs text-yellow-500">Delivered</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="text-lg font-semibold text-purple-600">
                                    {deliveryStats.read || 0}
                                </div>
                                <div className="text-xs text-purple-500">Read</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Details */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Message Type:</span>
                            <Badge variant="outline" className="ml-2">
                                {data.messageType}
                            </Badge>
                        </div>
                        <div>
                            <span className="text-gray-600">Priority:</span>
                            <Badge variant="secondary" className="ml-2">
                                {data.priority}
                            </Badge>
                        </div>
                        <div>
                            <span className="text-gray-600">Participants:</span>
                            <span className="ml-2 font-medium">{data.participantCount}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Created:</span>
                            <span className="ml-2">
                                {moment(data.createdAt).fromNow()}
                            </span>
                        </div>
                    </div>

                    {data.isScheduled && data.scheduleDateTime && (
                        <div className="pt-2 border-t">
                            <span className="text-gray-600">Scheduled for:</span>
                            <span className="ml-2 font-medium">
                                {moment(data.scheduleDateTime).format('MMM DD, YYYY [at] HH:mm')}
                            </span>
                        </div>
                    )}

                    {data.sentAt && (
                        <div className="pt-2 border-t">
                            <span className="text-gray-600">Sent at:</span>
                            <span className="ml-2 font-medium">
                                {moment(data.sentAt).format('MMM DD, YYYY [at] HH:mm')}
                            </span>
                        </div>
                    )}

                    {data.error && (
                        <div className="pt-2 border-t">
                            <span className="text-red-600">Error:</span>
                            <div className="mt-1 p-2 bg-red-50 rounded text-sm text-red-700">
                                {data.error}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={fetchAnnouncementDetails} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
                
                {(data.status === 'failed' || data.status === 'partial') && (
                    <Button onClick={handleRetry} className="flex-1">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AnnouncementDetails;

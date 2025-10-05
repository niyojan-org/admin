"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    BarChart3, TrendingUp, Users, MessageSquare,
    RefreshCw, Calendar, CheckCircle, XCircle, Clock
} from "lucide-react";
import { toast } from 'sonner';
import api from '@/lib/api';
import moment from 'moment';

const AnnouncementAnalytics = ({ eventId }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('7d');

    useEffect(() => {
        fetchAnalytics();
    }, [eventId, period]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/event/admin/announcement/${eventId}/delivery-analytics?period=${period}`);
            if (response.data.success) {
                setAnalytics(response.data.analytics);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch analytics";
            const errorDetails = error.response?.data?.error?.details;
            toast.error(errorMessage);
            if (errorDetails) {
                toast.error(errorDetails);
            }
            console.error("Analytics error:", error);
        } finally {
            setLoading(false);
        }
    };

    const getSuccessRate = (stats) => {
        if (!stats || !stats.total || stats.total === 0) return 0;
        return Math.round((stats.sent / stats.total) * 100);
    };

    const getAvgSuccessRate = (eventStats) => {
        if (!eventStats || typeof eventStats.avgSuccessRate !== 'number' || isNaN(eventStats.avgSuccessRate)) {
            return 0;
        }
        return Math.round(eventStats.avgSuccessRate);
    };

    const getBadgeVariant = (rate) => {
        if (rate >= 90) return "secondary";
        if (rate >= 70) return "outline";
        return "destructive";
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'sent': return "secondary";
            case 'failed': return "destructive";
            case 'pending': return "outline";
            case 'scheduled': return "default";
            default: return "outline";
        }
    };

    if (loading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-2">
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                            <div className="h-6 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!analytics) {
        return (
            <Card>
                <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">No analytics data available</p>
                    <Button onClick={fetchAnalytics} className="mt-2 h-8 text-xs">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h3 className="font-medium text-sm">Analytics</h3>
                    <p className="text-xs text-muted-foreground">
                        {moment(analytics.dateRange?.from).format('MMM D')} - {moment(analytics.dateRange?.to).format('MMM D')}
                    </p>
                </div>
                <div className="flex gap-1">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-16 h-6 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">24h</SelectItem>
                            <SelectItem value="7d">7d</SelectItem>
                            <SelectItem value="30d">30d</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={fetchAnalytics} className="h-6 px-1">
                        <RefreshCw className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-1">
                {/* Announcements Overview */}
                <Card className={'gap-1'}>
                    <CardTitle className="flex items-center gap-1 text-xs pb-0">
                        <MessageSquare className="h-3 w-3" />
                        Announcements
                    </CardTitle>
                    <CardContent className="">
                        <div className="space-y-0.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total:</span>
                                <span className="font-medium">{analytics.summary?.totalAnnouncements || analytics.eventStats?.totalAnnouncements || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Sent:</span>
                                <Badge variant="secondary" className="h-4 text-xs">{analytics.eventStats?.sentAnnouncements || 0}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Pending:</span>
                                <Badge variant="outline" className="h-4 text-xs">{analytics.eventStats?.pendingAnnouncements || 0}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Failed:</span>
                                <Badge variant="destructive" className="h-4 text-xs">{analytics.eventStats?.failedAnnouncements || 0}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Stats */}
                <Card className={'gap-1'}>
                    <CardTitle className="flex items-center gap-1 text-xs">
                        <Users className="h-3 w-3" />
                        Delivery
                    </CardTitle>
                    <CardContent className="p-1.5">
                        <div className="space-y-0.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Participants:</span>
                                <span className="font-medium">{analytics.eventStats?.totalParticipants || analytics.summary?.totalParticipants || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Sent:</span>
                                <Badge variant="default" className="h-4 text-xs">{analytics.summary?.totalSent || 0}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivered:</span>
                                <Badge variant="secondary" className="h-4 text-xs">{analytics.summary?.totalDelivered || 0}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Read:</span>
                                <Badge variant="outline" className="h-4 text-xs">{analytics.summary?.totalRead || 0}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Success Rates */}
                <Card className={'gap-1'}>
                    <CardTitle className="flex items-center gap-1 text-xs">
                        <TrendingUp className="h-3 w-3" />
                        Rates
                    </CardTitle>
                    <CardContent className="p-1.5">
                        <div className="space-y-0.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Success:</span>
                                <Badge variant="secondary" className="h-4 text-xs">{analytics.summary?.successRate || 0}%</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery:</span>
                                <Badge variant="default" className="h-4 text-xs">{analytics.summary?.deliveryRate || 0}%</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Read:</span>
                                <Badge variant="outline" className="h-4 text-xs">{analytics.summary?.readRate || 0}%</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Failure:</span>
                                <Badge variant="destructive" className="h-4 text-xs">{analytics.summary?.failureRate || 0}%</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance & Priority */}
                <Card className={'gap-1'}>
                    <CardTitle className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        Performance
                    </CardTitle>
                    <CardContent className="p-1.5">
                        <div className="space-y-0.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Time:</span>
                                <span className="font-medium">{analytics.summary?.avgProcessingTime || 0}ms</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Length:</span>
                                <span className="font-medium">{analytics.summary?.avgMessageLength || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Scheduled:</span>
                                <Badge variant="default" className="h-4 text-xs">{analytics.summary?.scheduledCount || 0}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">High Priority:</span>
                                <Badge variant="outline" className="h-4 text-xs">{analytics.summary?.highPriorityCount || 0}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Trends */}
            {analytics.trends && analytics.trends.length > 0 && (
                <Card className={'gap-1'}>
                    <CardTitle className="flex items-center gap-1 text-xs">
                        <BarChart3 className="h-3 w-3" />
                        Recent Activity
                    </CardTitle>
                    <CardContent className="p-1">
                        <div className="space-y-0.5">
                            {analytics.trends.slice(0, 2).map((trend, index) => (
                                <div key={index} className="flex items-center justify-between p-1 bg-gray-50 rounded text-xs">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-2 w-2 text-gray-400" />
                                        <span className="font-medium">{moment(trend.date).format('MMM D')}</span>
                                        <span className="text-muted-foreground">({trend.announcements})</span>
                                    </div>
                                    <Badge variant={getBadgeVariant(getSuccessRate(trend))} className="h-4 text-xs">
                                        {getSuccessRate(trend)}%
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Status Overview */}
            {analytics.summary?.statusDistribution && (
                <Card className={'gap-1'}>
                    <CardTitle className="text-xs">Status</CardTitle>

                    <CardContent className="p-1">
                        <div className="grid grid-cols-2 gap-0.5 text-xs">
                            {Object.entries(analytics.summary.statusDistribution).slice(0, 4).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between p-1 bg-gray-50 rounded">
                                    <div className="flex items-center gap-1">
                                        {status === 'sent' && <CheckCircle className="h-2 w-2 text-green-500" />}
                                        {status === 'failed' && <XCircle className="h-2 w-2 text-red-500" />}
                                        {status === 'pending' && <Clock className="h-2 w-2 text-yellow-500" />}
                                        {status === 'scheduled' && <Calendar className="h-2 w-2 text-blue-500" />}
                                        <span className="capitalize text-xs">{status}</span>
                                    </div>
                                    <Badge variant={getStatusBadgeVariant(status)} className="h-4 text-xs">{count}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AnnouncementAnalytics;

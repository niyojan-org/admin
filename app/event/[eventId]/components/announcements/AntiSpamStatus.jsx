"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    Shield, RefreshCw, AlertTriangle, CheckCircle, XCircle,
    Clock, Users, MessageSquare, Calendar, AlertCircle
} from "lucide-react";
import moment from 'moment';

const AntiSpamStatus = ({ eventId, status, onRefresh }) => {
    if (!status) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Unable to load anti-spam status</p>
                    <Button onClick={onRefresh} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const isNextAllowedTimePast = moment().isAfter(moment(status.nextAllowedTime));
    const canSendNow = status.canSendNow || isNextAllowedTimePast;

    const getHourlyUsagePercentage = () => {
        if (!status.limits?.hourlyLimit) return 0;
        return Math.round((status.currentUsage?.recentMessagesInHour / status.limits.hourlyLimit) * 100);
    };

    const getDailyUsagePercentage = () => {
        if (!status.limits?.dailyLimitPerParticipant) return 0;
        return Math.round((status.currentUsage?.dailyMessages / status.limits.dailyLimitPerParticipant) * 100);
    };

    const getScheduledUsagePercentage = () => {
        if (!status.limits?.maxPendingScheduled) return 0;
        return Math.round((status.currentUsage?.pendingScheduledMessages / status.limits.maxPendingScheduled) * 100);
    };

    const hourlyPercentage = getHourlyUsagePercentage();
    const dailyPercentage = getDailyUsagePercentage();
    const scheduledPercentage = getScheduledUsagePercentage();

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Anti-Spam Status
                </h3>
                <Button variant="outline" size="sm" onClick={onRefresh}>
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            {/* Current Status */}
            <Card className={`border-2 gap-1 ${canSendNow ? 'border-green-500/20 bg-green-50/50' : 'border-destructive/20 bg-destructive/5'}`}>
                <CardContent className="">
                    <div className="flex items-center gap-2">
                        {canSendNow ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <div className="flex-1">
                            <p className={`font-medium ${canSendNow ? 'text-green-700' : 'text-destructive'}`}>
                                {canSendNow ? 'Ready to Send' : 'Sending Blocked'}
                            </p>
                            <div className="text-sm mt-1">
                                {!canSendNow && status.reasonBlocked && (
                                    <p className="text-destructive">
                                        {status.reasonBlocked}
                                    </p>
                                )}
                                {status.nextAllowedTime && !isNextAllowedTimePast && (
                                    <p className="text-muted-foreground">
                                        Next allowed: {moment(status.nextAllowedTime).format('MMM D, YYYY [at] HH:mm')}
                                        <span className="ml-1 text-xs">
                                            ({moment(status.nextAllowedTime).fromNow()})
                                        </span>
                                    </p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={status.isWithinBusinessHours ? "secondary" : "outline"} className="text-xs">
                                        {status.isWithinBusinessHours ? 'Business Hours' : 'Off Hours'}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {status.limits?.businessHours}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Usage Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hourly Limit */}
                <Card className="gap-1">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Hourly Usage
                    </CardTitle>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Messages this hour</span>
                            <Badge variant={hourlyPercentage >= 90 ? "destructive" : hourlyPercentage >= 70 ? "outline" : "secondary"} className="text-xs">
                                {status.currentUsage?.recentMessagesInHour || 0} / {status.limits?.hourlyLimit || 0}
                            </Badge>
                        </div>
                        <Progress value={hourlyPercentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                            {hourlyPercentage}% used • {(status.limits?.hourlyLimit || 0) - (status.currentUsage?.recentMessagesInHour || 0)} remaining
                        </div>
                    </CardContent>
                </Card>

                {/* Daily Limit Per Participant */}
                <Card className="gap-1">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Daily Usage
                    </CardTitle>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Messages today</span>
                            <Badge variant={dailyPercentage >= 90 ? "destructive" : dailyPercentage >= 70 ? "outline" : "secondary"} className="text-xs">
                                {status.currentUsage?.dailyMessages || 0} / {status.limits?.dailyLimitPerParticipant || 0}
                            </Badge>
                        </div>
                        <Progress value={dailyPercentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                            {dailyPercentage}% used • {(status.limits?.dailyLimitPerParticipant || 0) - (status.currentUsage?.dailyMessages || 0)} remaining
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Scheduled Messages */}
                <Card className="gap-1">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Scheduled Messages
                    </CardTitle>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Pending scheduled</span>
                            <Badge variant={scheduledPercentage >= 90 ? "destructive" : scheduledPercentage >= 70 ? "outline" : "secondary"} className="text-xs">
                                {status.currentUsage?.pendingScheduledMessages || 0} / {status.limits?.maxPendingScheduled || 0}
                            </Badge>
                        </div>
                        <Progress value={scheduledPercentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                            {scheduledPercentage}% used • {(status.limits?.maxPendingScheduled || 0) - (status.currentUsage?.pendingScheduledMessages || 0)} remaining
                        </div>
                    </CardContent>
                </Card>

                {/* Participants Limit */}
                <Card className="gap-1">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Participant Limit
                    </CardTitle>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Max per message</span>
                            <Badge variant="outline" className="text-xs">
                                {status.limits?.maxParticipantsPerMessage || 0}
                            </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Split large lists into smaller batches
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Emergency Keywords */}
            {status.emergencyKeywords && status.emergencyKeywords.length > 0 && (
                <Card className="gap-1">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Emergency Keywords
                    </CardTitle>
                    <CardContent>
                        <div className="flex flex-wrap gap-1">
                            {status.emergencyKeywords.map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {keyword}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Messages containing these keywords may bypass rate limits
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Last Activity */}
            {status.lastAnnouncementAt && (
                <Card className="gap-1">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Last announcement sent:</span>
                            <span className="font-medium">
                                {moment(status.lastAnnouncementAt).format('MMM D, YYYY [at] HH:mm')}
                                <span className="ml-1 text-xs text-muted-foreground">
                                    ({moment(status.lastAnnouncementAt).fromNow()})
                                </span>
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Best Practices */}
            <Card className="border-primary/20 bg-primary/5 gap-1">
                <CardContent className="">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-primary mt-0.5" />
                        <div className="text-sm text-primary">
                            <p className="font-medium mb-1">Anti-Spam Guidelines:</p>
                            <ul className="text-xs space-y-1 list-disc list-inside">
                                <li>Respect business hours: {status.limits?.businessHours}</li>
                                <li>Stay within hourly limit: {status.limits?.hourlyLimit} message(s) per hour</li>
                                <li>Daily limit per participant: {status.limits?.dailyLimitPerParticipant} message(s)</li>
                                <li>Use emergency keywords for urgent messages: {status.emergencyKeywords?.join(', ')}</li>
                                <li>Schedule messages to spread load throughout the day</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AntiSpamStatus;

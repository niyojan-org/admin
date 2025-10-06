"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Plus, Send, Calendar, BarChart3, Settings, MessageSquare,
    List, ArrowLeft, TrendingUp, Users, AlertCircle
} from "lucide-react";
import AnnouncementForm from './components/AnnouncementForm';
import AnnouncementList from './components/AnnouncementList';
import AnnouncementAnalytics from './components/AnnouncementAnalytics';
import AntiSpamStatus from './components/AntiSpamStatus';
import api from '@/lib/api';
import { toast } from 'sonner';

function AnnouncementManagement({ eventId }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState("list");
    const [antiSpamStatus, setAntiSpamStatus] = useState(null);

    useEffect(() => {
        fetchAnnouncements();
        fetchAntiSpamStatus();
    }, [eventId]);

    const fetchAnnouncements = async () => {
        try {
            const response = await api.get(`/event/admin/announcement/${eventId}`);
            if (response.data.success) {
                setAnnouncements(response.data.announcements);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch announcements";
            const errorDetails = error.response?.data?.error?.details;
            toast.error(errorMessage);
            if (errorDetails) {
                toast.error(errorDetails);
            }
            console.error("Error fetching announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAntiSpamStatus = async () => {
        try {
            const response = await api.get(`/event/admin/announcement/${eventId}/anti-spam/status`);
            if (response.data.success) {
                setAntiSpamStatus(response.data.status);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch anti-spam status";
            const errorDetails = error.response?.data?.error?.details;
            if (errorDetails) {
                toast.error(errorDetails);
            }
            console.error("Error fetching anti-spam status:", error);
        }
    };

    const handleAnnouncementCreated = (newAnnouncement) => {
        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setShowForm(false);
        setActiveTab("list");
        fetchAntiSpamStatus();
        toast.success("Announcement created successfully!");
    };

    const getQuickStats = () => {
        const pending = announcements.filter(a => a.status === 'pending').length;
        const sent = announcements.filter(a => a.status === 'sent').length;
        const scheduled = announcements.filter(a => a.status === 'scheduled').length;
        const failed = announcements.filter(a => a.status === 'failed').length;

        return { pending, sent, scheduled, failed, total: announcements.length };
    };

    const stats = getQuickStats();

    // If form is shown, render full-page form
    if (showForm) {
        return (
            <div className="w-full space-y-4">
                {/* Header */}
                <Card className="border-0 border-b p-2">
                    <CardContent className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowForm(false)}
                                    className="gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to List
                                </Button>
                                <Separator orientation="vertical" className="h-6" />
                                <div>
                                    <h1 className="text-2xl font-bold flex items-center gap-2">
                                        <Send className="h-6 w-6 text-primary" />
                                        Create Announcement
                                    </h1>
                                    <p className="text-sm text-muted-foreground">
                                        Compose and send announcements to participants
                                    </p>
                                </div>
                            </div>
                            <Badge variant="outline" className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {antiSpamStatus?.canSendNow ? 'Ready to Send' : 'Sending Blocked'}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Content */}
                <div className="container mx-auto w-full">
                    <div className="mx-auto">
                        <Card>
                            <CardContent className="p-6">
                                <AnnouncementForm
                                    eventId={eventId}
                                    onAnnouncementCreated={handleAnnouncementCreated}
                                    antiSpamStatus={antiSpamStatus}
                                    isFullPage={true}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Main announcement management page
    return (
        <div className="w-full space-y-4">
            {/* Header */}
            <Card className="border-b bg-card sticky top-0 z-10 p-0">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <MessageSquare className="h-6 w-6 text-primary" />
                                Announcement Management
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Send and manage announcements for your event
                            </p>
                        </div>
                        <Button onClick={() => setShowForm(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Announcement
                        </Button>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 ">
                        <Card className="border-l-4 border-l-primary">
                            <CardContent className="">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total</p>
                                        <p className="text-2xl font-bold">{stats.total}</p>
                                    </div>
                                    <MessageSquare className="h-8 w-8 text-primary opacity-20" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                            <CardContent className="">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Sent</p>
                                        <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
                                    </div>
                                    <Send className="h-8 w-8 text-green-500 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-yellow-500">
                            <CardContent className="">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Pending</p>
                                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                    </div>
                                    <AlertCircle className="h-8 w-8 text-yellow-500 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                            <CardContent className="">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Scheduled</p>
                                        <p className="text-2xl font-bold text-purple-600">{stats.scheduled}</p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-purple-500 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-destructive">
                            <CardContent className="">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Failed</p>
                                        <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
                                    </div>
                                    <AlertCircle className="h-8 w-8 text-destructive opacity-20" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Card>
            <Card className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className={'gap-0'}>
                    <CardHeader className="">
                        <CardTitle className="text-base flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            Quick Analytics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <AnnouncementAnalytics eventId={eventId} />
                    </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Settings className="h-4 w-4 text-primary" />
                            Anti-Spam Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            {antiSpamStatus && (
                                <>
                                    <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                                        <span className="text-sm font-medium">Status</span>
                                        <Badge variant={antiSpamStatus.canSendNow ? "secondary" : "destructive"}>
                                            {antiSpamStatus.canSendNow ? 'Active' : 'Blocked'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                                        <span className="text-sm font-medium">Hourly Limit</span>
                                        <span className="text-sm">
                                            {antiSpamStatus.currentUsage?.recentMessagesInHour || 0} / {antiSpamStatus.limits?.hourlyLimit || 0}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                                        <span className="text-sm font-medium">Daily Limit</span>
                                        <span className="text-sm">
                                            {antiSpamStatus.currentUsage?.dailyMessages || 0} / {antiSpamStatus.limits?.dailyLimitPerParticipant || 0}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => setActiveTab("settings")}
                                    >
                                        View Details
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </Card>
            {/* Main Content Area */}
            <div className="">
                <Card>
                    <CardHeader className="pb-3">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="list" className="gap-2">
                                    <List className="h-4 w-4" />
                                    <span className="hidden sm:inline">Announcements</span>
                                </TabsTrigger>

                                <TabsTrigger value="settings" className="gap-2">
                                    <Settings className="h-4 w-4" />
                                    <span className="hidden sm:inline">Anti-Spam</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>

                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsContent value="list" className="mt-0">
                                <AnnouncementList
                                    eventId={eventId}
                                    announcements={announcements}
                                    loading={loading}
                                    onRefresh={fetchAnnouncements}
                                />
                            </TabsContent>

                            <TabsContent value="settings" className="mt-0">
                                <ScrollArea className="h-[600px]">
                                    <AntiSpamStatus
                                        eventId={eventId}
                                        status={antiSpamStatus}
                                        onRefresh={fetchAntiSpamStatus}
                                    />
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}

export default AnnouncementManagement;

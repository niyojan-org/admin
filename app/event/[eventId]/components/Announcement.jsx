"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Send, Calendar, BarChart3, Settings, MessageSquare } from "lucide-react";
import AnnouncementForm from './announcements/AnnouncementForm';
import AnnouncementList from './announcements/AnnouncementList';
import AnnouncementAnalytics from './announcements/AnnouncementAnalytics';
import AntiSpamStatus from './announcements/AntiSpamStatus';
import api from '@/lib/api';
import { toast } from 'sonner';

function Announcement({ eventId }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
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
        setIsFormOpen(false);
        fetchAntiSpamStatus(); // Refresh anti-spam status
        toast.success("Announcement created successfully!");
    };

    const getQuickStats = () => {
        const pending = announcements.filter(a => a.status === 'pending').length;
        const sent = announcements.filter(a => a.status === 'sent').length;
        const scheduled = announcements.filter(a => a.status === 'scheduled').length;

        return { pending, sent, scheduled, total: announcements.length };
    };

    const stats = getQuickStats();

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <MessageSquare className="h-4 w-4" />
                        Announcements
                    </CardTitle>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-7 px-2 text-xs">
                                <Plus className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">New</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto p-3 sm:p-6">
                            <AnnouncementForm
                                eventId={eventId}
                                onAnnouncementCreated={handleAnnouncementCreated}
                                antiSpamStatus={antiSpamStatus}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-1 sm:gap-2 mt-2">
                    <div className="text-center p-1.5 sm:p-2 bg-blue-50 rounded-md">
                        <div className="text-sm sm:text-lg font-semibold text-blue-600">{stats.total}</div>
                        <div className="text-xs text-blue-500">Total</div>
                    </div>
                    <div className="text-center p-1.5 sm:p-2 bg-green-50 rounded-md">
                        <div className="text-sm sm:text-lg font-semibold text-green-600">{stats.sent}</div>
                        <div className="text-xs text-green-500">Sent</div>
                    </div>
                    <div className="text-center p-1.5 sm:p-2 bg-yellow-50 rounded-md">
                        <div className="text-sm sm:text-lg font-semibold text-yellow-600">{stats.pending}</div>
                        <div className="text-xs text-yellow-500">Pending</div>
                    </div>
                    <div className="text-center p-1.5 sm:p-2 bg-purple-50 rounded-md">
                        <div className="text-sm sm:text-lg font-semibold text-purple-600">{stats.scheduled}</div>
                        <div className="text-xs text-purple-500">Scheduled</div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="list" className="text-xs h-7 px-1">
                            <Send className="h-3 w-3 mr-1" />
                            <span className="inline">List</span>
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="text-xs h-7 px-1">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            <span className="inline">Analytics</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="text-xs h-7 px-1">
                            <Settings className="h-3 w-3 mr-1" />
                            <span className="inline">Anti Spam</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="">
                        <AnnouncementList
                            eventId={eventId}
                            announcements={announcements}
                            loading={loading}
                            onRefresh={fetchAnnouncements}
                        />
                    </TabsContent>

                    <TabsContent value="analytics" className="px-2 sm:px-4 pb-2 sm:pb-4 mt-0">
                        <AnnouncementAnalytics eventId={eventId} />
                    </TabsContent>

                    <TabsContent value="settings" className="px-2 sm:px-4 pb-2 sm:pb-4 mt-0">
                        <AntiSpamStatus
                            eventId={eventId}
                            status={antiSpamStatus}
                            onRefresh={fetchAntiSpamStatus}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

export default Announcement;
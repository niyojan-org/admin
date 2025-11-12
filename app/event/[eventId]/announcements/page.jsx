'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconSpeakerphone, IconRefresh } from '@tabler/icons-react';
import { toast } from 'sonner';

// Hooks
import { useAnnouncementLimits } from './hooks/useAnnouncementLimits';
import { useAnnouncements } from './hooks/useAnnouncements';
import { useAnnouncementDashboard } from './hooks/useAnnouncementDashboard';

// Components
import { AnnouncementStats } from './components/AnnouncementStats';
import { LimitsCard } from './components/LimitsCard';
import { InsightsCard } from './components/InsightsCard';
import { CreateAnnouncementDialog } from './components/CreateAnnouncementDialog';
import { AnnouncementList } from './components/AnnouncementList';
import { AnnouncementDetails } from './components/AnnouncementDetails';
import { DeliveryTrendsChart } from './components/DeliveryTrendsChart';
import { StatusBreakdownChart } from './components/StatusBreakdownChart';
import { PerformanceMetrics } from './components/PerformanceMetrics';

/**
 * Main Announcements Management Page
 */
export default function AnnouncementsPage() {
    const params = useParams();
    const eventId = params.eventId;

    // State
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [timeRange, setTimeRange] = useState(7);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Hooks
    const { limits, loading: limitsLoading, refetch: refetchLimits } = useAnnouncementLimits(eventId, false);
    const {
        announcements,
        pagination,
        filters,
        loading: announcementsLoading,
        refetch: refetchAnnouncements,
        cancelAnnouncement,
        changePage,
        changeFilters,
    } = useAnnouncements(eventId);
    const { dashboard, loading: dashboardLoading, refetch: refetchDashboard } = useAnnouncementDashboard(
        eventId,
        timeRange
    );

    // Handlers
    const handleCreateClick = () => {
        if (!limits?.canSend) {
            const waitTime = limits?.limits?.rateLimit?.waitTimeMinutes || 0;
            const remaining = limits?.limits?.dailyLimit?.remainingToday || 0;

            if (waitTime > 0) {
                toast.error('Rate limit active', {
                    description: `Please wait ${waitTime} more minute(s) before sending another announcement.`,
                });
            } else if (remaining === 0) {
                toast.error('Daily limit reached', {
                    description: 'You have reached the maximum limit of 5 announcements per day.',
                });
            } else {
                toast.error('Cannot send announcement', {
                    description: 'Please check rate limits.',
                });
            }
            return;
        }

        setCreateDialogOpen(true);
    };

    const handleCreateSuccess = async () => {
        await Promise.all([
            refetchAnnouncements(),
            refetchLimits(),
            refetchDashboard(),
        ]);
    };

    const handleViewDetails = (announcement) => {
        setSelectedAnnouncement(announcement);
        setDetailsDialogOpen(true);
    };

    const handleCancel = async (announcement) => {
        if (!confirm(`Are you sure you want to cancel "${announcement.title}"?`)) {
            return;
        }

        try {
            await cancelAnnouncement(announcement._id);
            toast.success('Announcement cancelled successfully');
            await refetchDashboard();
        } catch (error) {
            toast.error('Failed to cancel announcement', {
                description: error.message,
            });
        }
    };

    const handleFilterChange = (key, value) => {
        changeFilters({ [key]: value });
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                refetchAnnouncements(),
                refetchLimits(),
                refetchDashboard(),
            ]);
            toast.success('Data refreshed successfully');
        } catch (error) {
            toast.error('Failed to refresh data', {
                description: error.message,
            });
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
                    <p className="text-muted-foreground">
                        Send messages to participants via WhatsApp, Email, or both
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        onClick={handleRefresh} 
                        disabled={isRefreshing}
                        variant="outline"
                        className="gap-2"
                    >
                        <IconRefresh className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={handleCreateClick} disabled={limitsLoading} className="gap-2">
                        <IconSpeakerphone className="h-4 w-4" />
                        Create Announcement
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="dashboard" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="announcements">Announcements</TabsTrigger>
                </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="space-y-6">
                    {/* Stats Overview */}
                    <AnnouncementStats
                        stats={dashboard?.summary}
                        loading={dashboardLoading}
                    />

                    {/* Limits and Insights */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <LimitsCard limits={limits} loading={limitsLoading} />
                        <InsightsCard
                            insights={dashboard?.insights}
                            loading={dashboardLoading}
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <DeliveryTrendsChart
                            data={dashboard?.deliveryTrends}
                            loading={dashboardLoading}
                        />
                        <StatusBreakdownChart
                            data={dashboard?.statusBreakdown}
                            loading={dashboardLoading}
                        />
                    </div>

                    {/* Recent Activity */}
                    {dashboard?.recentActivity && dashboard.recentActivity.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Recent Activity</h2>
                            <AnnouncementList
                                announcements={dashboard.recentActivity}
                                loading={dashboardLoading}
                                onViewDetails={handleViewDetails}
                                onCancel={handleCancel}
                            />
                        </div>
                    )}
                </TabsContent>

                {/* Announcements Tab */}
                <TabsContent value="announcements" className="space-y-6">
                    {/* Filters */}
                    <div className="flex gap-4">
                        <Select
                            value={filters.status || 'all'}
                            onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="partial">Partial</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.priority || 'all'}
                            onValueChange={(value) => handleFilterChange('priority', value === 'all' ? '' : value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priorities</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Announcements List */}
                    <AnnouncementList
                        announcements={announcements}
                        loading={announcementsLoading}
                        pagination={pagination}
                        onPageChange={changePage}
                        onViewDetails={handleViewDetails}
                        onCancel={handleCancel}
                    />
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <CreateAnnouncementDialog
                eventId={eventId}
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleCreateSuccess}
                limits={limits}
            />

            <AnnouncementDetails
                eventId={eventId}
                announcementId={selectedAnnouncement?._id}
                open={detailsDialogOpen}
                onOpenChange={setDetailsDialogOpen}
            />
        </div>
    );
}

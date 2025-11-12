"use client"

import React from 'react'
import useSWR from 'swr'
import { fetcher } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Calendar, TrendingUp, Users, DollarSign, Activity, Clock, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
// Using a simple styled div for the vertical separator to avoid rendering issues

function Page() {
    const { data: eventsData, error: eventsError } = useSWR('/org/dashboard/events/summary', fetcher, { refreshInterval: 180000, revalidateOnFocus: true })
    const { data: revenueData, error: revenueError } = useSWR('/org/dashboard/revenue/total', fetcher, { refreshInterval: 180000, revalidateOnFocus: true })

    const loadingEvents = !eventsData && !eventsError
    const loadingRevenue = !revenueData && !revenueError

    const MetricCard = ({ icon: Icon, title, value, description, loading, error, iconColor, className }) => {
        return (
            <div className={cn("transition-shadow p-0 h-full gap-0 border-0 rounded-none -space-y-2", className)}>
                <div className="flex flex-row items-center justify-between">
                    <p className="text-sm font-medium">{title}</p>
                    {/* <Icon className={`h-4 w-4 ${iconColor || 'text-muted-foreground'}`} /> */}
                </div>

                <div>
                    {loading && (
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-20" />
                            {description && <Skeleton className="h-4 w-32" />}
                        </div>
                    )}

                    {error && (
                        <div className="space-y-2">
                            <p className="text-sm text-destructive">Error loading data</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            <div className="text-xl font-bold">{value}</div>
                            {description && (
                                <p className="text-xs text-muted-foreground">{description}</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Card className="w-full h-full flex flex-col sm:flex-row justify-between p-0 px-2 sm:px-2 pb-0 items-center py-2">
            {/* Events Summary Section */}
            <div className="w-full h-full">
                <div className='pb-2'>
                    <h2 className="text-2xl font-semibold tracking-tight">Event Overview</h2>
                    <p className="text-sm text-muted-foreground -mt-2">
                        Summary of your events and their status
                    </p>
                </div>


                <div className="grid grid-cols-2 gap-2 justify-between">
                    <MetricCard
                        icon={Activity}
                        title="Total Events"
                        value={eventsData?.data?.totalEvents || '-'}
                        description="All events created"
                        loading={loadingEvents}
                        error={eventsError}
                        iconColor="text-blue-600"
                    />
                    <MetricCard
                        icon={Eye}
                        title="Published"
                        value={eventsData?.data?.publishedEvents || '-'}
                        description="Live and visible"
                        loading={loadingEvents}
                        error={eventsError}
                        iconColor="text-green-600"
                    />
                    <MetricCard
                        icon={Clock}
                        title="Upcoming"
                        value={eventsData?.data?.upcomingEvents || '-'}
                        description="Scheduled events"
                        loading={loadingEvents}
                        error={eventsError}
                        iconColor="text-orange-600"
                    />
                    <MetricCard
                        icon={EyeOff}
                        title="Unpublished"
                        value={eventsData?.data?.unpublishedEvents || '-'}
                        description="Draft events"
                        loading={loadingEvents}
                        error={eventsError}
                        iconColor="text-gray-600"
                    />
                </div>
            </div>

            {/* <Separator orientation='vertical' className={''} /> */}

            {/* Revenue Summary Section */}
            <div className="w-full">
                <div className="pb-2">
                    <h2 className="text-2xl font-semibold tracking-tight">Revenue Overview</h2>
                    <p className="text-sm text-muted-foreground -mt-2">
                        Financial summary and transaction details
                    </p>
                </div>

                <div className="grid gap-2 grid-cols-2">
                    <MetricCard
                        icon={DollarSign}
                        title="Total Revenue"
                        value={revenueData?.data?.totalRevenue ? `₹${revenueData.data.totalRevenue.toLocaleString()}` : '-'}
                        description="Gross revenue"
                        loading={loadingRevenue}
                        error={revenueError}
                        iconColor="text-emerald-600"
                    />
                    <MetricCard
                        icon={TrendingUp}
                        title="Organizer Share"
                        value={revenueData?.data?.organizerShare ? `₹${revenueData.data.organizerShare.toLocaleString()}` : '-'}
                        description="Your earnings"
                        loading={loadingRevenue}
                        error={revenueError}
                        iconColor="text-green-600"
                    />
                    <MetricCard
                        icon={DollarSign}
                        title="Platform Share"
                        value={revenueData?.data?.platformShare ? `₹${revenueData.data.platformShare.toLocaleString()}` : '-'}
                        description="Platform fees"
                        loading={loadingRevenue}
                        error={revenueError}
                        iconColor="text-blue-600"
                    />
                    <MetricCard
                        icon={Users}
                        title="Transactions"
                        value={revenueData?.data?.totalTransactions || '-'}
                        description="Total orders"
                        loading={loadingRevenue}
                        error={revenueError}
                        iconColor="text-purple-600"
                    />
                </div>
            </div>
        </Card>
    )
}

export default Page
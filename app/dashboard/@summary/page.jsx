'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUserStore } from "@/store/userStore"
import {
    IconArrowUpRight,
    IconCalendarEvent,
    IconCurrencyRupee,
    IconTrendingUp,
    IconTriangleFilled,
    IconUsers,
    IconUsersGroup,
    IconInfoCircle,
    IconPlus
} from "@tabler/icons-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { fetcher } from "@/lib/api"
import useSWR from 'swr'


// Loading Skeleton for StatCard
function StatCardSkeleton() {
    return (
        <Card className="border-0 shadow-sm p-2 sm:px-3 gap-3">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-9 w-24 mb-2" />
                <Skeleton className="h-4 w-full" />
            </CardContent>
        </Card>
    );
}

// Reusable StatCard Component
function StatCard({
    title,
    icon: Icon,
    value,
    prefix = null,
    changePercentage,
    changeDirection,
    comparisonPeriod,
    detailsLink
}) {
    const hasChange = changePercentage !== null && changePercentage !== undefined;
    const isPositive = changeDirection === 'up';
    const isEmpty = value === 0 || value === null || value === undefined;

    return (
        <Card className="border-0 shadow-sm p-2 sm:px-3 gap-3">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg font-normal text-card-foreground/80">
                    <p>{title}</p>
                    <div className="bg-accent/10 p-1 rounded-full">
                        <Icon size={20} />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold flex items-center">
                    {prefix && prefix}
                    {isEmpty ? (
                        <span className="text-muted-foreground">0</span>
                    ) : (
                        typeof value === 'number' ? value.toLocaleString() : value
                    )}
                </p>
                <div className="text-xs flex items-center justify-between mt-1">
                    <div className="flex items-center">
                        {hasChange && !isEmpty && (
                            <>
                                <IconTriangleFilled
                                    className={isPositive ? "text-green-600" : "text-red-600 rotate-180"}
                                    size={10}
                                />
                                <span className={`ml-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                                    {changePercentage}%
                                </span>
                                <span className="ml-1 text-muted-foreground">
                                    vs {comparisonPeriod?.replace('_', ' ')}
                                </span>
                            </>
                        )}
                        {isEmpty && (
                            <span className="text-muted-foreground text-xs">No data yet</span>
                        )}
                    </div>

                    {detailsLink && (
                        <Link
                            href={detailsLink}
                            className="bg-muted-f text-muted-foreground rounded-full px-0.5 hover:underline"
                        >
                            Details <IconArrowUpRight size={12} className="inline-block ml-0.5" />
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Utility function to get greeting based on time
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
}

function DashboardSummary() {
    const { user } = useUserStore();
    const [greeting, setGreeting] = useState("");
    
    // Use SWR for data fetching
    const { data, error, isLoading } = useSWR('/organization/dashboard/summary', fetcher, {
        refreshInterval: 180000,
        revalidateOnFocus: true
    });

    const summaryData = data?.data;

    useEffect(() => {
        setGreeting(getGreeting());
    }, []);

    // Check if organization is new (all metrics are 0 except maybe members)
    const isNewOrganization = summaryData &&
        summaryData.totalRevenue?.current === 0 &&
        summaryData.totalParticipants?.current === 0 &&
        summaryData.totalEvents?.current === 0;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2 mb-2">
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <IconInfoCircle className="h-4 w-4" />
                <AlertDescription>
                    Failed to load dashboard summary. Please try again later.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2 mb-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {greeting}
                        {user?.name && (
                            <span className="text-primary">, {user.name}</span>
                        )}
                    </h1>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                    {isNewOrganization
                        ? "Welcome! Get started by creating your first event."
                        : "Here's what's happening in your organization today."
                    }
                </p>
            </div>

            {isNewOrganization && (
                <div className="col-span-2">
                    <Alert className="bg-primary/5 border-primary/20">
                        <IconInfoCircle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                            <span>Your organization is ready! Start by creating your first event to see insights here.</span>
                            <Button asChild size="sm" className="ml-4">
                                <Link href="/events/create">
                                    <IconPlus size={16} className="mr-1" />
                                    Create Event
                                </Link>
                            </Button>
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            <StatCard
                title="Total Revenue"
                icon={IconTrendingUp}
                value={summaryData?.totalRevenue?.current ?? 0}
                prefix={<IconCurrencyRupee />}
                changePercentage={summaryData?.totalRevenue?.changePercentage}
                changeDirection={summaryData?.totalRevenue?.changeDirection}
                comparisonPeriod={summaryData?.totalRevenue?.comparisonPeriod}
                detailsLink="/payments"
            />

            <StatCard
                title="Total Participants"
                icon={IconUsersGroup}
                value={summaryData?.totalParticipants?.current ?? 0}
                changePercentage={summaryData?.totalParticipants?.changePercentage}
                changeDirection={summaryData?.totalParticipants?.changeDirection}
                comparisonPeriod={summaryData?.totalParticipants?.comparisonPeriod}
                detailsLink="/events"
            />

            <StatCard
                title="Total Events"
                icon={IconCalendarEvent}
                value={summaryData?.totalEvents?.current ?? 0}
                changePercentage={summaryData?.totalEvents?.changePercentage}
                changeDirection={summaryData?.totalEvents?.changeDirection}
                comparisonPeriod={summaryData?.totalEvents?.comparisonPeriod}
                detailsLink="/events"
            />

            <StatCard
                title="Total Members"
                icon={IconUsers}
                value={summaryData?.totalMembers?.current ?? 0}
                changePercentage={summaryData?.totalMembers?.changePercentage}
                changeDirection={summaryData?.totalMembers?.changeDirection}
                comparisonPeriod={summaryData?.totalMembers?.comparisonPeriod}
                detailsLink="/organization/members"
            />
        </div>
    )
}

export default DashboardSummary

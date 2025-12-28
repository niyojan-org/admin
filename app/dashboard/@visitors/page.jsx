"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import useSWR from 'swr'
import { fetcher } from "@/lib/api"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconInfoCircle } from "@tabler/icons-react"

export const description = "A radar chart with dots"

const chartConfig = {
    totalViews: {
        label: "Total Views",
        color: "var(--chart-1)",
    },
}

function Visitors() {
    // Fetch analytics data using SWR
    const { data, error, isLoading } = useSWR('/organization/dashboard/analytics', fetcher, {
        refreshInterval: 300000, // Refresh every 5 minutes
        revalidateOnFocus: true
    });

    const analyticsData = data?.data;
    const summary = analyticsData?.summary;
    const monthlyData = analyticsData?.monthlyData || [];
    const dateRange = analyticsData?.dateRange;

    // Transform monthlyData for the chart
    const chartData = monthlyData.map(item => ({
        month: item.month,
        totalViews: item.totalViews
    }));

    const isPositiveTrend = summary?.trend?.direction === 'up';
    const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

    if (isLoading) {
        return (
            <Card className="h-full flex flex-col border-0 gap-0">
                <CardHeader className="items-center shrink-0">
                    <Skeleton className="h-7 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </CardHeader>
                <CardContent className="pb-0 flex-1 flex items-center justify-center min-h-0">
                    <Skeleton className="w-full h-[300px]" />
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm shrink-0">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                </CardFooter>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="h-full flex flex-col border-0 gap-0">
                <CardHeader className="items-center shrink-0">
                    <CardTitle>Total visitors in your events</CardTitle>
                </CardHeader>
                <CardContent className="pb-0 flex-1 flex items-center justify-center min-h-0">
                    <Alert variant="destructive" className="w-full">
                        <IconInfoCircle className="h-4 w-4" />
                        <AlertDescription>
                            Failed to load analytics data. Please try again later.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    if (!chartData.length) {
        return (
            <Card className="h-full flex flex-col border-0 gap-0">
                <CardHeader className="items-center shrink-0">
                    <CardTitle>Total visitors in your events</CardTitle>
                    <CardDescription>
                        Track the number of visitors to your events over time.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-0 flex-1 flex items-center justify-center min-h-0">
                    <div className="text-center text-muted-foreground">
                        <p>No visitor data available yet.</p>
                        <p className="text-sm mt-2">Create events to start tracking visitors.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col border-0 gap-0">
            <CardHeader className="items-center shrink-0">
                <CardTitle>Total visitors in your events</CardTitle>
                <CardDescription>
                    {summary?.totalViews?.toLocaleString() || 0} total views across {summary?.totalEvents || 0} events
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-0 flex-1 flex items-center justify-center min-h-0">
                <ChartContainer
                    config={chartConfig}
                    className="w-full h-full"
                >
                    <RadarChart data={chartData} outerRadius="80%">
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarAngleAxis dataKey="month" />
                        <PolarGrid />
                        <Radar
                            dataKey="totalViews"
                            fill="var(--color-totalViews)"
                            fillOpacity={0.6}
                            dot={{
                                r: 4,
                                fillOpacity: 1,
                            }}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm shrink-0">
                {summary?.trend && (
                    <div className={`flex items-center gap-2 leading-none font-medium ${
                        isPositiveTrend ? 'text-green-600' : 'text-red-600'
                    }`}>
                        Trending {isPositiveTrend ? 'up' : 'down'} by {summary.trend.percentage}% 
                        <TrendIcon className="h-4 w-4" />
                    </div>
                )}
                {dateRange && (
                    <div className="text-muted-foreground flex items-center gap-2 leading-none">
                        {new Date(dateRange.from).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - {new Date(dateRange.to).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                )}
                {summary?.peakMonth && (
                    <div className="text-muted-foreground flex items-center gap-2 leading-none text-xs">
                        Peak: {summary.peakMonth.month} ({summary.peakMonth.views.toLocaleString()} views)
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}

export default Visitors

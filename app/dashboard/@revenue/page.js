"use client"

"use client"

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { fetcher } from '@/lib/api'
import useSWR from 'swr'
import RevenueChart from '@/components/dashboard/RevenueChart'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { IconRefresh, IconArrowUp, IconArrowDown, IconMinus } from '@tabler/icons-react'

const timeRangeToDays = {
    '7days': 7,
    '14days': 14,
    '30days': 30,
    '90days': 90,
    '1year': 365,
}

function Page() {
    const [timeRange, setTimeRange] = useState('7days')
    const [interval, setInterval] = useState('day')

    const lastDays = timeRangeToDays[timeRange] || 30

    const swrKey = `/org/dashboard/revenue/trends?lastDays=${lastDays}&interval=${interval}`

    const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
        refreshInterval: 180000, // Refresh every 5 minutes
        revalidateOnFocus: true, // refresh when window gets focused
    })

    // Transform API trends -> chart data shape expected by RevenueChart
    const chartData = useMemo(() => {
        if (!data || !data.data || !Array.isArray(data.data.trends)) return null
        return data.data.trends.map((t) => ({
            date: typeof t.period === 'string' ? t.period.split('T')[0] : (t.period?.period || ''),
            revenue: t.totalRevenue || 0,
        }))
    }, [data])

    // total revenue: prefer server summary if present, otherwise sum chartData
    const totalRevenue = useMemo(() => {
        if (data && data.data && data.data.summary && typeof data.data.summary.totalRevenue === 'number') {
            return data.data.summary.totalRevenue
        }
        if (chartData && Array.isArray(chartData)) {
            return chartData.reduce((s, i) => s + (i.revenue || 0), 0)
        }
        return 0
    }, [data, chartData])

    const summary = data && data.data ? data.data.summary : null

    return (
        <Card className={'w-full h-full p-0 sm:px-0'}>
            <div className="flex items-center justify-between pt-4 px-4">
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:space-x-3">
                    <Select value={timeRange} onValueChange={(v) => setTimeRange(v)}>
                        <SelectTrigger className="w-[140px]">{timeRange}</SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7days">Last 7 days</SelectItem>
                            <SelectItem value="14days">Last 14 days</SelectItem>
                            <SelectItem value="30days">Last 30 days</SelectItem>
                            <SelectItem value="90days">Last 90 days</SelectItem>
                            <SelectItem value="1year">Last year</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={interval} onValueChange={(v) => setInterval(v)}>
                        <SelectTrigger className="w-[140px]">{interval}</SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day">Day</SelectItem>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between h-full">
                    <div className="flex items-baseline space-x-3">
                        <div>
                            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                        </div>
                        {summary && (
                            <div className="flex items-center text-sm text-muted-foreground">
                                {summary.overallTrend === 'up' && <IconArrowUp className="h-4 w-4 text-green-600 mr-1" />}
                                {summary.overallTrend === 'down' && <IconArrowDown className="h-4 w-4 text-red-600 mr-1" />}
                                {summary.overallTrend === 'same' && <IconMinus className="h-4 w-4 text-gray-500 mr-1" />}
                                <div>
                                    <div className="text-xs">{summary.overallChangePercent != null ? `${summary.overallChangePercent}%` : ''}</div>
                                    <div className="text-xs">{summary.overallChangeAmount ? `₹${summary.overallChangeAmount.toLocaleString()}` : ''}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => mutate()}>
                        <IconRefresh className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                </div>
            </div>

            <div className="">
                {/* Top summary row: total revenue + trend */}
                {error && <div className="p-4 text-red-600">Failed to load revenue trends</div>}
                {!data && !error && <div className="p-4">Loading...</div>}
                {data && (
                    <RevenueChart timeRange={timeRange} remoteData={chartData} />
                )}
            </div>
        </Card>
    )
}

export default Page
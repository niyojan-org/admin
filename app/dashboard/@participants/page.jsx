"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetcher } from '@/lib/api'
import React from 'react'
import useSWR from 'swr'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { IconUsers, IconTrendingUp } from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'

function page() {
    const { data, error } = useSWR('/org/dashboard/events/participant-summary', fetcher, { refreshInterval: 180000, revalidateOnFocus: true })
    console.log(error?.response?.data)
    const participantData = data?.data
    const loading = !data && !error

    const chartConfig = {
        count: {
            label: "Participants",
            color: "hsl(var(--chart-1))",
        },
    }

    return (
        <Card className="flex flex-col h-80 p-0 sm:px-0 gap-2 w-full">
            <CardHeader className="py-2 px-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={'/events'} className='text-2xl font-semibold cursor-pointer flex items-center gap-2'>
                                    <IconUsers className="h-6 w-6" />
                                    Participants
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side='bottom' sideOffset={-2}>
                                Click here to view participant details
                            </TooltipContent>
                        </Tooltip>
                    </CardTitle>
                    <Separator orientation="vertical" className="h-full w-full" />
                    {participantData && (
                        <div className="flex flex-col items-center text-sm">
                            <span className="text-4xl font-bold">{participantData.totalParticipants}</span>
                            <span className="text-muted-foreground">total</span>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-4 px-0 p-0">
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-sm text-muted-foreground">Loading...</div>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-sm text-destructive">{error?.response?.data?.message || "Failed to load data"}</p>
                        <p>{error?.response?.data?.error?.details}</p>
                    </div>
                )}

                {participantData && participantData.dayWiseData && participantData.dayWiseData.length > 0 && (
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <BarChart
                            data={participantData.dayWiseData}
                            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                                allowDecimals={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                                dataKey="count"
                                fill="var(--color-count)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={60}
                            >
                                <LabelList
                                    dataKey="count"
                                    position="top"
                                    fontSize={12}
                                    fontWeight="bold"
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card >
    )
}

export default page
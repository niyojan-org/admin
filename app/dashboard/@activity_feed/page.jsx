"use client"

import React, { useState, useMemo } from 'react'
import useSWR from 'swr'
import { fetcher } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { IconMaximize, IconUser, IconMail, IconCalendar, IconArrowsDiagonal } from '@tabler/icons-react'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const ActivityItem = ({ activity, compact = false }) => {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffInHours = (now - date) / (1000 * 60 * 60)

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        } else if (diffInHours < 168) {
            return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <Link href={`/events/${activity.eventSlug}`} className="block group">
            <div className={`flex items-center gap-2.5 ${compact ? 'p-1.5' : 'p-3'} hover:bg-accent/50 rounded-lg transition-all border border-transparent hover:border-border/50 hover:shadow-sm`}>
                <Badge
                    variant={activity.status === 'confirmed' ? 'default' : 'destructive'}
                    className={`${compact ? 'h-5 w-5' : 'h-6 w-6'} rounded-full p-0 flex items-center justify-center`}
                >
                    <IconUser className={`${compact ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
                </Badge>

                <div className="flex-1 min-w-0 grid gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                        <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium truncate group-hover:text-primary transition-colors`}>
                            {activity.participantName}
                        </span>
                        <span className={`${compact ? 'text-[10px]' : 'text-xs'} text-muted-foreground flex items-center gap-1 whitespace-nowrap`}>
                            <IconCalendar className="h-3 w-3" />
                            {formatTime(activity.timestamp)}
                        </span>
                    </div>

                    {!compact && (
                        <span className="text-xs text-muted-foreground truncate flex items-center gap-1">
                            <IconMail className="h-3 w-3" />
                            {activity.participantEmail}
                        </span>
                    )}

                    <span className={`${compact ? 'text-[10px]' : 'text-xs'} text-muted-foreground/80 truncate`}>
                        {activity.eventTitle}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default function Page() {
    const [limit, setLimit] = useState(8)
    const [dialogLimit, setDialogLimit] = useState(50)
    const { data, error, mutate } = useSWR(`/org/dashboard/events/activity-feed?limit=${limit}`, fetcher, { refreshInterval: 180000, revalidateOnFocus: true })
    const { data: dialogData } = useSWR(`/org/dashboard/events/activity-feed?limit=${dialogLimit}`, fetcher, { refreshInterval: 180000, revalidateOnFocus: true })

    const events = data && data.data ? data.data : []
    const dialogEvents = dialogData && dialogData.data ? dialogData.data : []
    console.log(data);

    const loading = !data && !error

    return (
        <Card className="flex flex-col h-full p-0 py-3 px-3 gap-0">
            <div className="flex items-center justify-between pb-3 px-1">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <IconArrowsDiagonal className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
                        <DialogHeader className="px-6 pt-6 pb-4 border-b">
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-2xl">Activity Feed</DialogTitle>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="limit" className="text-sm text-muted-foreground">Limit:</Label>
                                    <Input
                                        id="limit"
                                        type="number"
                                        value={dialogLimit}
                                        onChange={(e) => setDialogLimit(Number(e.target.value))}
                                        className="w-20 h-8"
                                        min="1"
                                        max="200"
                                    />
                                </div>
                            </div>
                        </DialogHeader>
                        <ScrollArea className="flex-1 px-6 py-4">
                            <div className="space-y-1.5">
                                {dialogEvents.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No activities found
                                    </div>
                                ) : (
                                    dialogEvents.map((activity, index) => (
                                        <ActivityItem key={index} activity={activity} />
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>

            {loading && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-sm text-muted-foreground">Loading...</div>
                </div>
            )}

            {error && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-sm text-destructive">Failed to load</div>
                </div>
            )}

            {!loading && !error && events.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-sm text-muted-foreground">No activities yet</div>
                </div>
            )}

            {!loading && !error && events.length > 0 && (
                <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full">
                        <div className="space-y-1 pr-3 ">
                            {events.map((activity, index) => (
                                <ActivityItem key={index} activity={activity} compact />
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </Card>
    )
}

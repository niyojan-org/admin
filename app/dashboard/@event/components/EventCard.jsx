import {
    IconCalendar,
    IconUsers,
    IconTicket,
    IconCurrencyRupee,
    IconMapPin,
    IconClock,
    IconTrendingUp,
    IconWorld,
    IconBuilding,
    IconVideo,
    IconSettings,
    IconDownload
} from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { calculateEventMetrics, getEventStatus } from "../utils/eventHelpers"
import Gauge from "./Gauge"

const modeConfig = {
    online: {
        icon: IconWorld,
        label: "Online",
        color: "text-cyan-600 dark:text-cyan-400"
    },
    offline: {
        icon: IconBuilding,
        label: "Offline",
        color: "text-orange-600 dark:text-orange-400"
    },
    hybrid: {
        icon: IconVideo,
        label: "Hybrid",
        color: "text-purple-600 dark:text-purple-400"
    }
}

export function EventCard({ event }) {
    const {
        title,
        slug,
        status,
        sessions = [],
        tickets = [],
        totalRegistrations = 0,
        mode,
        type,
        viewCount = 0
    } = event

    const metrics = calculateEventMetrics(event)
    const statusInfo = getEventStatus(status)
    const firstSession = sessions[0]
    const eventDate = firstSession ? new Date(firstSession.startTime) : null
    const ModeIcon = modeConfig[mode]?.icon || IconWorld
    const showParticipants = ['published', 'ongoing', 'completed'].includes(status)

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Compact Banner */}


            <div className="flex-1 p-3 flex flex-col gap-1.5">
                {/* Title & Type */}
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-semibold text-sm line-clamp-1 ">{title}</h3>
                        <div className="flex items-center gap-1.5 text-[10px]">
                            <ModeIcon className={cn("h-3 w-3", modeConfig[mode]?.color)} />
                            <span className="text-muted-foreground">{modeConfig[mode]?.label}</span>
                            {type && (
                                <>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-muted-foreground capitalize">{type}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <Badge variant={statusInfo.variant} className="text-xs h-4 px-1.5">
                        {statusInfo.label}
                    </Badge>
                </div>

                {/* Date & Location */}
                {eventDate && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <IconCalendar className="h-3 w-3" />
                            <span>{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        {firstSession?.venue?.city && (
                            <div className="flex items-center gap-1">
                                <IconMapPin className="h-3 w-3" />
                                <span className="line-clamp-1">{firstSession.venue.city}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Compact Stats Grid */}
                <div className="grid grid-cols-5 gap-2">
                    {/* Registrations */}
                    <div className="text-center">
                        <div className="text-sm font-bold leading-none">{totalRegistrations}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Joined</div>
                    </div>

                    {/* Sessions */}
                    <div className="text-center">
                        <div className="text-sm font-bold leading-none">{sessions.length}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Sessions</div>
                    </div>

                    {/* Tickets or Capacity */}
                    <div className="text-center">
                        <div className="text-sm font-bold leading-none">
                            {metrics.totalCapacity > 0 ? metrics.totalCapacity - metrics.totalTicketsSold : metrics.totalTicketsSold}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                            {metrics.totalCapacity > 0 ? 'Slots' : 'Sold'}
                        </div>
                    </div>

                    {/* Revenue (if paid event) */}
                    {metrics.isPaidEvent && (
                        <div className="text-center">
                            <div className="text-sm font-bold leading-none">
                                {metrics.totalRevenue >= 1000 ? `${(metrics.totalRevenue / 1000).toFixed(1)}k` : metrics.totalRevenue}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">Revenue</div>
                        </div>
                    )}
                    <div className="text-center">
                        <div className="text-sm font-bold leading-none">{viewCount}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Views</div>
                    </div>
                </div>

                {/* Additional Info Pills */}
                <div className="flex flex-wrap gap-1 text-[8px]">
                    {event.allowCoupons && event.coupons?.length > 0 && (
                        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            {event.coupons.filter(c => c.isActive).length} Coupons
                        </span>
                    )}
                    {event.certificate && (
                        <span className="bg-accent/20 text-accent-foreground px-1.5 py-0.5 rounded">
                            Certificate
                        </span>
                    )}
                    {event.inputFields?.length > 0 && (
                        <span className="bg-secondary/50 text-secondary-foreground px-1.5 py-0.5 rounded">
                            {event.inputFields.length} Custom Fields
                        </span>
                    )}
                    {event.guestSpeakers?.length > 0 && (
                        <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium">
                            {event.guestSpeakers.length} Speakers
                        </span>
                    )}
                    {event.isPrivate && (
                        <span className="bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
                            Private
                        </span>
                    )}
                </div>

                {/* Event Features Strip */}
                <div className="flex flex-wrap gap-1 text-[8px]">
                    {event.allowReferrals && (
                        <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                            Referrals Enabled
                        </span>
                    )}
                    {}
                    {event.feedbackEnabled && (
                        <span className="bg-accent/30 text-accent-foreground px-1.5 py-0.5 rounded">
                            Feedback
                        </span>
                    )}
                    {event.mediaGallery?.length > 0 && (
                        <span className="bg-secondary/40 text-secondary-foreground px-1.5 py-0.5 rounded">
                            {event.mediaGallery.length} Media
                        </span>
                    )}
                    {event.benefits?.length > 0 && (
                        <span className="bg-muted/80 text-muted-foreground px-1.5 py-0.5 rounded font-medium">
                            {event.benefits.length} Benefits
                        </span>
                    )}
                    {event.autoApproveParticipants && (
                        <span className="bg-primary/15 text-primary px-1.5 py-0.5 rounded">
                            Auto-Approve
                        </span>
                    )}
                </div>

                {/* Sales Progress */}
                <div>
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-muted-foreground">Ticket Sales</span>
                        <span className="text-[9px] font-medium">{metrics.salesPercentage}%</span>
                    </div>
                    <Progress value={parseInt(metrics.salesPercentage)} className="h-1" />
                </div>

                {/* Mini Ticket Breakdown */}
                {tickets.length > 0 && (
                    <div className="flex gap-1">
                        {tickets.slice(0, 4).map((ticket, idx) => (
                            <div
                                key={idx}
                                className="flex-1 flex flex-col items-center relative"
                                title={`${ticket.type}: ${ticket.sold}/${ticket.capacity}`}
                            >
                                <div className="w-full flex justify-center">
                                    <Gauge sold={ticket.sold} total={ticket.capacity} />
                                </div>
                                <p className="absolute text-xs bottom-0 text-center font-semibold truncate">
                                    {ticket.type}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-auto pt-1 space-y-1">
                    {status === 'draft' ? (
                        <Link href={`/events/${slug}`} className="block">
                            <Button size="sm" variant="outline" className="w-full h-7 text-[11px]">
                                <IconSettings className="h-3 w-3 mr-1" />
                                Manage Event
                            </Button>
                        </Link>
                    ) : status === 'completed' ? (
                        event.completionReport?.reportUrl ? (
                            <a href={event.completionReport.reportUrl} download className="block">
                                <Button size="sm" className="w-full h-7 text-[11px]">
                                    <IconDownload className="h-3 w-3 mr-1" />
                                    Download Report
                                </Button>
                            </a>
                        ) : (
                            <Button size="sm" variant="outline" className="w-full h-7 text-[11px]" disabled>
                                <IconDownload className="h-3 w-3 mr-1" />
                                Report Not Available
                            </Button>
                        )
                    ) : (
                        <>
                            <Link href={`/events/${slug}/participants`} className="block">
                                <Button size="sm" className="w-full h-7 text-[11px]">
                                    <IconUsers className="h-3 w-3 mr-1" />
                                    View Participants
                                </Button>
                            </Link>
                            <Link href={`/events/${slug}`} className="block">
                                <Button size="sm" variant="outline" className="w-full h-7 text-[11px]">
                                    <IconSettings className="h-3 w-3 mr-1" />
                                    Manage Event
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
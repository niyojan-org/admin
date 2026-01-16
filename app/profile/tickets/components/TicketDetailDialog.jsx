"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
    Calendar,
    MapPin,
    User,
    Mail,
    Phone,
    Ticket,
    Users,
    CreditCard,
    CheckCircle2,
    Download,
    Clock,
    Tag,
    Building2,
    IndianRupee,
    FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TicketDetailDialog({ ticket, open, onOpenChange, onDownload }) {
    if (!ticket) return null;

    const formatDateTime = (dateString) => {
        if (!dateString) return { date: "TBA", time: "TBA", day: "" };
        const date = new Date(dateString);
        return {
            day: date.toLocaleDateString("en-US", { weekday: "long" }),
            date: date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            time: date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return "bg-green-500 hover:bg-green-600 text-white";
            case "pending":
                return "bg-yellow-500 hover:bg-yellow-600 text-white";
            case "cancelled":
                return "bg-red-500 hover:bg-red-600 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    const hasCheckedIn = ticket.sessionCheckIn?.some(s => s.checkedIn);

    // Get dynamic fields excluding the standard ones
    const getDynamicFields = () => {
        if (!ticket.dynamicFields || typeof ticket.dynamicFields !== 'object') return [];

        const standardFields = ['name', 'email', 'phone'];
        return Object.entries(ticket.dynamicFields)
            .filter(([key]) => !standardFields.includes(key.toLowerCase()))
            .map(([key, value]) => ({
                key,
                label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
                value: value
            }));
    };

    const dynamicFields = getDynamicFields();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl p-0 overflow-hidden bg-card">
                <ScrollArea className="sm:h-[95vh] h-[80vh] w-full">
                    {/* Banner Header */}
                    <div className="relative h-48 md:h-64 w-full overflow-hidden">
                        <img
                            src={ticket.event?.bannerImage}
                            alt={ticket.event?.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                        {/* Header Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 lg:p-8">
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    <Badge className={cn("text-sm", getStatusColor(ticket.status))}>
                                        {ticket.status}
                                    </Badge>
                                    {hasCheckedIn && (
                                        <Badge className="bg-green-500 text-white gap-1.5 text-sm">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Checked In
                                        </Badge>
                                    )}
                                    <Badge variant="secondary" className="text-sm">
                                        {ticket.event?.category}
                                    </Badge>
                                </div>

                                <DialogTitle className="text-white text-2xl md:text-3xl lg:text-4xl font-bold line-clamp-2">
                                    {ticket.event?.title}
                                </DialogTitle>

                                <p className="text-white/90 text-sm md:text-base line-clamp-2 max-w-4xl">
                                    {ticket.event?.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-3 md:p-4 lg:p-6 space-y-4 w-full">
                        {/* Ticket Info Cards - Hero Section */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* Ticket Code */}
                            <Card className="border-border p-0">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                                            <Ticket className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-muted-foreground font-medium mb-0.5">
                                                Ticket Code
                                            </p>
                                            <p className="font-mono font-bold text-xs tracking-wide truncate">
                                                {ticket.ticket?.code}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Price */}
                            <Card className="border-border p-0">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                                            <IndianRupee className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-muted-foreground font-medium mb-0.5">
                                                Price
                                            </p>
                                            <p className="font-bold text-base text-primary">
                                                ₹{ticket.ticket?.price}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Ticket Type */}
                            <Card className="border-border p-0">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                                            <Tag className="h-4 w-4 text-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-muted-foreground font-medium mb-0.5">
                                                Type
                                            </p>
                                            <p className="font-bold text-xs truncate">
                                                {ticket.ticket?.type}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Event Mode */}
                            <Card className="border-border p-0">
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                                            <Building2 className="h-4 w-4 text-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-muted-foreground font-medium mb-0.5">
                                                Mode
                                            </p>
                                            <p className="font-bold text-xs capitalize truncate">
                                                {ticket.event?.mode}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Booking Info - Compact Inline */}
                        <div className="flex flex-wrap items-center  p-3 gap-1 bg-muted rounded-lg border">
                            <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                <div>
                                    <span className="text-[10px] text-muted-foreground">Booked on</span>
                                    <p className="font-semibold text-xs">
                                        {formatDateTime(ticket.createdAt).date} at {formatDateTime(ticket.createdAt).time}
                                    </p>
                                </div>
                            </div>
                            {ticket.updatedAt !== ticket.createdAt && (
                                <>
                                    <Separator orientation="vertical" className="h-6" />
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <div>
                                            <span className="text-[10px] text-muted-foreground">Last updated</span>
                                            <p className="font-semibold text-xs">
                                                {formatDateTime(ticket.updatedAt).date}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <Separator />

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Left Column - Main Info */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Sessions Section */}
                                {ticket.sessionCheckIn && ticket.sessionCheckIn.length > 0 && (
                                    <Card className="border-border p-2">
                                        <CardContent className="w-full p-0">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-primary" />
                                                Sessions ({ticket.sessionCheckIn.length})
                                            </h3>

                                            <div className="space-y-4 w-full">
                                                {ticket.sessionCheckIn.map((session) => {
                                                    const startTime = formatDateTime(session.sessionDetails?.startTime);
                                                    const endTime = formatDateTime(session.sessionDetails?.endTime);

                                                    return (
                                                        <div
                                                            key={session.sessionId}
                                                            className={cn(
                                                                "rounded-lg p-1 w-full border-1 transition-all",
                                                                session.checkedIn
                                                                    ? "bg-green-50 dark:bg-green-950/20 border-green-500/50"
                                                                    : "bg-muted/30 border-border hover:border-primary/50"
                                                            )}
                                                        >
                                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-bold text-base mb-1">
                                                                        {session.sessionDetails?.title}
                                                                    </h4>
                                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                                        {session.sessionDetails?.description}
                                                                    </p>
                                                                </div>
                                                                {session.checkedIn && (
                                                                    <Badge className="bg-green-600 text-white gap-1 flex-shrink-0">
                                                                        <CheckCircle2 className="h-3 w-3" />
                                                                        Checked In
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">Start</p>
                                                                        <p className="font-semibold">{startTime.day}</p>
                                                                        <p className="text-xs">{startTime.time}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">End</p>
                                                                        <p className="font-semibold">{endTime.time}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {session.sessionDetails?.venue && (
                                                                <div className="mt-3 pt-3 border-t">
                                                                    <div className="flex items-start gap-2 text-sm">
                                                                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                                                        <div>
                                                                            <p className="font-semibold">{session.sessionDetails.venue.name}</p>
                                                                            <p className="text-muted-foreground text-xs">
                                                                                {session.sessionDetails.venue.address}, {session.sessionDetails.venue.city},{" "}
                                                                                {session.sessionDetails.venue.state} {session.sessionDetails.venue.zipCode}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {session.checkedIn && (
                                                                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                                                                    Checked in: {formatDateTime(session.checkedInAt).date} at{" "}
                                                                    {formatDateTime(session.checkedInAt).time}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Group Information */}
                                {ticket.groupInfo?.groupName && (
                                    <Card className="border-primary/30 bg-primary/5 p-2">
                                        <CardContent className="p-0">
                                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                                <Users className="h-5 w-5 text-primary" />
                                                Group Registration
                                            </h3>

                                            <div className="space-y-1">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                                                    <div className="px-3 py-2 bg-background border rounded-lg">
                                                        <p className="text-xs text-muted-foreground mb-1">Group Name</p>
                                                        <p className="font-bold">
                                                            {ticket.groupInfo.groupName}
                                                        </p>
                                                    </div>

                                                    <div className="px-3 py-2 bg-background border rounded-lg">
                                                        <p className="text-xs text-muted-foreground mb-1">Total Members</p>
                                                        <p className="font-bold">
                                                            {ticket.groupInfo.totalMembers}
                                                        </p>
                                                    </div>

                                                    <div className="px-3 py-2 bg-background border rounded-lg">
                                                        <p className="text-xs text-muted-foreground mb-1">Your Position</p>
                                                        <p className="font-bold">
                                                            #{ticket.groupInfo.memberIndex}
                                                        </p>
                                                    </div>
                                                </div>

                                                {ticket.isGroupLeader && (
                                                    <Badge className="w-full justify-center bg-primary hover:bg-primary/90">
                                                        👑 Group Leader
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Payment Information */}
                                {ticket.payment?.amount && (
                                    <Card className="border-border p-2">
                                        <CardContent className="p-0">
                                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                                <CreditCard className="h-5 w-5 text-primary" />
                                                Payment Information
                                            </h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="px-4 py-2 bg-muted/50 rounded-lg">
                                                    <p className="text-xs text-muted-foreground mb-1">Amount</p>
                                                    <p className="font-bold text-xl">₹{ticket.payment.amount / 100}</p>
                                                </div>

                                                <div className="px-4 py-2 bg-muted/50 rounded-lg">
                                                    <p className="text-xs text-muted-foreground mb-1">Currency</p>
                                                    <p className="font-bold">{ticket.payment.currency}</p>
                                                </div>

                                                <div className="px-4 py-2 bg-muted/50 rounded-lg">
                                                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                                                    <Badge variant={ticket.payment.status === 'success' ? 'default' : 'secondary'}>
                                                        {ticket.payment.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Additional Information (Dynamic Fields) */}
                                {dynamicFields.length > 0 && (
                                    <Card className="border-border p-2">
                                        <CardContent className="p-0">
                                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-primary" />
                                                Additional Information
                                            </h3>

                                            <div className="grid grid-cols-1 gap-2">
                                                {dynamicFields.map((field) => (
                                                    <div key={field.key} className="px-3 py-1 bg-muted/50 rounded-lg">
                                                        <p className="text-xs text-muted-foreground capitalize mb-1">
                                                            {field.label}
                                                        </p>
                                                        <p className="font-semibold text-sm truncate">
                                                            {field.value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Right Column - Participant & Event Info */}
                            <div className="space-y-4">
                                {/* Participant Information */}
                                <Card className="border-border p-2">
                                    <CardContent className="p-0">
                                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                            <User className="h-5 w-5 text-primary" />
                                            Participant
                                        </h3>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 px-3 py-1 bg-muted/50 rounded-lg">
                                                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-muted-foreground">Name</p>
                                                    <p className="font-semibold truncate">
                                                        {ticket.dynamicFields?.name || ticket.name}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 px-3 py-1 bg-muted/50 rounded-lg">
                                                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-muted-foreground">Email</p>
                                                    <p className="font-medium text-sm truncate">
                                                        {ticket.dynamicFields?.email || ticket.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 px-3 py-1 bg-muted/50 rounded-lg">
                                                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-muted-foreground">Phone</p>
                                                    <p className="font-medium">
                                                        {ticket.dynamicFields?.phone || ticket.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Event Details */}
                                <Card className="border-border p-2">
                                    <CardContent className="p-0">
                                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                            <Tag className="h-5 w-5 text-primary" />
                                            Event Details
                                        </h3>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-lg">
                                                <span className="text-sm text-muted-foreground">Type</span>
                                                <Badge variant="secondary" className="capitalize">{ticket.event?.type}</Badge>
                                            </div>

                                            <div className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-lg">
                                                <span className="text-sm text-muted-foreground">Status</span>
                                                <Badge variant="outline" className="capitalize">{ticket.event?.status}</Badge>
                                            </div>

                                            {ticket.event?.tags && ticket.event.tags.length > 0 && (
                                                <div className="px-3 py-2 bg-muted/50 rounded-lg">
                                                    <p className="text-xs text-muted-foreground mb-2">Tags</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {ticket.event.tags.map((tag, idx) => (
                                                            <Badge key={idx} variant="outline" className="text-xs">
                                                                #{tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>
                        </div>

                        {/* Download Button */}
                        <div className="sticky bottom-0 pt-1 pb-2 bg-background/95 backdrop-blur">
                            <Button
                                size="lg"
                                className="w-full gap-2 text-base"
                                onClick={() => onDownload(ticket.ticket.code)}
                            >
                                <Download className="h-5 w-5" />
                                Download Ticket
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
    IconTicket, 
    IconUsers, 
    IconCurrencyRupee, 
    IconCalendar,
    IconTrendingUp,
    IconLink,
    IconShieldCheck,
    IconShieldX
} from '@tabler/icons-react';
import moment from 'moment';

export function TicketDetailsDialog({ 
    open, 
    onOpenChange, 
    ticket, 
    loading,
    userRole 
}) {
    // Show loader when loading or when no ticket data is available yet
    if (loading || (!ticket && open)) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <IconTicket className="w-5 h-5" />
                            Ticket Details
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-20 w-full" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!ticket) return null;

    // Role-based field visibility
    const canSeePrice = ['owner', 'admin'].includes(userRole);
    const canSeeCapacity = ['owner', 'admin', 'manager'].includes(userRole);
    const canSeeRevenue = ['owner', 'admin'].includes(userRole);

    const calculateStats = (ticket) => {
        if (!ticket) return {};
        
        return {
            salesPercentage: ticket.capacity > 0 ? Math.round((ticket.sold / ticket.capacity) * 100) : 0,
            availableCount: Math.max(0, ticket.capacity - ticket.sold),
            revenue: ticket.sold * ticket.price,
            isSoldOut: ticket.sold >= ticket.capacity
        };
    };

    const stats = ticket ? calculateStats(ticket) : {};

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconTicket className="w-5 h-5" />
                        Ticket Details
                    </DialogTitle>
                </DialogHeader>
                
                {ticket ? (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">{ticket.type}</h3>
                                <p className="text-sm text-muted-foreground">
                                    ID: {ticket._id}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge variant={ticket.isActive ? 'default' : 'secondary'}>
                                    {ticket.isActive ? (
                                        <IconShieldCheck className="w-3 h-3 mr-1" />
                                    ) : (
                                        <IconShieldX className="w-3 h-3 mr-1" />
                                    )}
                                    {ticket.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                {stats.isSoldOut && (
                                    <Badge variant="destructive">Sold Out</Badge>
                                )}
                            </div>
                        </div>

                        {/* Sales Statistics */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-sm">Sales Statistics</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <IconUsers className="w-3 h-3" />
                                        <span className="text-xs">Tickets Sold</span>
                                    </div>
                                    <div className="font-semibold">{ticket.sold}</div>
                                </div>

                                {canSeeCapacity && (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <IconTicket className="w-3 h-3" />
                                            <span className="text-xs">Total Capacity</span>
                                        </div>
                                        <div className="font-semibold">{ticket.capacity}</div>
                                    </div>
                                )}

                                {canSeePrice && (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <IconCurrencyRupee className="w-3 h-3" />
                                            <span className="text-xs">Price</span>
                                        </div>
                                        <div className="font-semibold">₹{ticket.price}</div>
                                    </div>
                                )}

                                {canSeeRevenue && (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <IconTrendingUp className="w-3 h-3" />
                                            <span className="text-xs">Total Revenue</span>
                                        </div>
                                        <div className="font-semibold">₹{stats.revenue.toLocaleString()}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Availability */}
                        {canSeeCapacity && (
                            <div className="space-y-3">
                                <h4 className="font-medium text-sm">Availability</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Sales Progress</span>
                                        <span className="font-medium">{stats.salesPercentage}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div 
                                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${Math.min(100, stats.salesPercentage)}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{ticket.sold} sold</span>
                                        <span>{stats.availableCount} remaining</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timestamp Information */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-sm">Information</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <IconCalendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Created:</span>
                                    <span>{moment(ticket.createdAt).format('MMM DD, YYYY HH:mm')}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <IconCalendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Last Updated:</span>
                                    <span>{moment(ticket.updatedAt).format('MMM DD, YYYY HH:mm')}</span>
                                </div>

                                {ticket.templateUrl && (
                                    <div className="flex items-start gap-2">
                                        <IconLink className="w-4 h-4 text-muted-foreground mt-0.5" />
                                        <div className="space-y-1">
                                            <span className="text-muted-foreground">Template URL:</span>
                                            <a 
                                                href={ticket.templateUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline text-xs break-all"
                                            >
                                                {ticket.templateUrl}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Summary */}
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2 text-sm">
                                <IconShieldCheck className="w-4 h-4 text-primary" />
                                <span className="font-medium">Status:</span>
                                <span className={
                                    ticket.isActive 
                                        ? stats.isSoldOut 
                                            ? 'text-orange-600' 
                                            : 'text-green-600'
                                        : 'text-muted-foreground'
                                }>
                                    {ticket.isActive 
                                        ? stats.isSoldOut 
                                            ? 'Active but sold out' 
                                            : 'Active and available'
                                        : 'Inactive'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No ticket details available</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

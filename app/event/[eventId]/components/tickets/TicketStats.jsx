'use client'
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    IconUsers,
    IconTicket,
    IconCurrencyRupee,
    IconTrendingUp
} from '@tabler/icons-react';

export function TicketStats({ ticket, userRole }) {
    // For volunteers, don't show any stats
    if (userRole === 'volunteer') {
        return null;
    }

    const salesPercentage = ticket.capacity > 0 ? Math.round((ticket.sold / ticket.capacity) * 100) : 0;
    const availableCount = Math.max(0, ticket.capacity - ticket.sold);
    const grossRevenue = ticket.sold * ticket.price;
    const platformFee = grossRevenue * 0.05; // 5% platform fee
    const revenue = grossRevenue - platformFee; // Net revenue after platform fee

    // Role-based field visibility
    const canSeePrice = ['owner', 'admin'].includes(userRole);
    const canSeeRevenue = ['owner', 'admin'].includes(userRole);
    const canSeeCapacity = ['owner', 'admin', 'manager'].includes(userRole);

    return (
        <div className="space-y-1">
            {/* Sales Progress - Only show if we have capacity data */}
            {ticket.sold !== undefined && ticket.capacity !== undefined && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Sales Progress</span>
                        <span className="font-medium">{salesPercentage}%</span>
                    </div>
                    <Progress
                        value={salesPercentage}
                        className="h-2"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{ticket.sold} sold</span>
                        {canSeeCapacity && <span>{availableCount} remaining</span>}
                    </div>
                </div>
            )}

            {/* Stats Grid - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {ticket.sold !== undefined && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <IconUsers className="w-3 h-3 flex-shrink-0" />
                            <span className="text-xs truncate">Sold</span>
                        </div>
                        <div className="font-semibold text-sm sm:text-base">{ticket.sold}</div>
                    </div>
                )}

                {canSeeCapacity && ticket.capacity !== undefined && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <IconTicket className="w-3 h-3 flex-shrink-0" />
                            <span className="text-xs truncate">Capacity</span>
                        </div>
                        <div className="font-semibold text-sm sm:text-base">{ticket.capacity}</div>
                    </div>
                )}

                {canSeePrice && ticket.price !== undefined && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <IconCurrencyRupee className="w-3 h-3 flex-shrink-0" />
                            <span className="text-xs truncate">Price</span>
                        </div>
                        <div className="font-semibold text-sm sm:text-base">₹{ticket.price}</div>
                    </div>
                )}

                {canSeeRevenue && ticket.sold !== undefined && ticket.price !== undefined && (
                    <div className="space-y-0">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <IconTrendingUp className="w-3 h-3 flex-shrink-0" />
                            <span className="text-xs truncate">Net Revenue</span>
                        </div>
                        <div className="font-semibold text-sm sm:text-base">₹{revenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                            After 5% platform fee
                        </div>
                    </div>
                )}
            </div>

            {/* Status Indicators - Mobile Friendly */}
            {ticket.sold !== undefined && ticket.capacity !== undefined && (
                <div className="flex flex-wrap items-center gap-2">
                    {ticket.sold === 0 && (
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                            No Sales Yet
                        </Badge>
                    )}

                    {ticket.sold >= ticket.capacity && (
                        <Badge variant="destructive" className="text-xs flex-shrink-0">
                            Sold Out
                        </Badge>
                    )}

                    {salesPercentage >= 80 && salesPercentage < 100 && (
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                            Almost Full
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}

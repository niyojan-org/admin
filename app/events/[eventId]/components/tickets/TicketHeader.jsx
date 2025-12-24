'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
    IconEdit, 
    IconTrash, 
    IconEye, 
    IconCurrencyRupee,
    IconPercentage
} from '@tabler/icons-react';

export function TicketHeader({ 
    ticket, 
    onToggle, 
    onEdit, 
    onDelete, 
    onViewDetails,
    toggleLoading,
    userRole 
}) {
    const getSoldOutStatus = () => {
        return ticket.sold !== undefined && ticket.capacity !== undefined && ticket.sold >= ticket.capacity;
    };

    const getAvailableCount = () => {
        if (ticket.sold === undefined || ticket.capacity === undefined) return 0;
        return Math.max(0, ticket.capacity - ticket.sold);
    };

    // Role-based field visibility
    const canSeePrice = ['owner', 'admin'].includes(userRole);
    const canEdit = ['owner', 'admin'].includes(userRole);

    return (
        <div className="space-y-3">
            {/* Mobile Layout - Stacked */}
            <div className="block sm:hidden">
                {/* Title and Status Row */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">{ticket.type}</h3>
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                            <Badge 
                                variant={ticket.isActive ? 'default' : 'secondary'}
                                className="text-xs"
                            >
                                {ticket.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            {getSoldOutStatus() && (
                                <Badge variant="destructive" className="text-xs">
                                    Sold Out
                                </Badge>
                            )}
                        </div>
                    </div>
                    
                    {/* Mobile Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        {canEdit && (
                            <div className="flex items-center gap-1">
                                <Switch
                                    checked={ticket.isActive}
                                    onCheckedChange={() => onToggle(ticket)}
                                    disabled={toggleLoading}
                                    className="data-[state=checked]:bg-primary scale-75"
                                />
                                {toggleLoading && (
                                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                )}
                            </div>
                        )}
                        
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetails(ticket._id)}
                            className="h-8 w-8 p-0"
                        >
                            <IconEye className="w-3 h-3" />
                        </Button>
                        
                        {canEdit && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(ticket)}
                                    className="h-8 w-8 p-0"
                                >
                                    <IconEdit className="w-3 h-3" />
                                </Button>
                                
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(ticket)}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                    <IconTrash className="w-3 h-3" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Mobile Stats Grid - Only show for roles with access */}
                {userRole !== 'volunteer' && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {canSeePrice && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <IconCurrencyRupee className="w-3 h-3" />
                                <span>₹{ticket.price}</span>
                            </div>
                        )}
                        {ticket.sold !== undefined && ticket.capacity !== undefined && (
                            <div className="text-muted-foreground">
                                Sold: <span className="font-medium">{ticket.sold}/{ticket.capacity}</span>
                            </div>
                        )}
                        {ticket.sold !== undefined && ticket.capacity !== undefined && (
                            <div className="text-muted-foreground col-span-1">
                                Available: <span className="font-medium">{getAvailableCount()}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Desktop Layout - Horizontal */}
            <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg truncate">{ticket.type}</h3>
                            <Badge 
                                variant={ticket.isActive ? 'default' : 'secondary'}
                                className="text-xs flex-shrink-0"
                            >
                                {ticket.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            {getSoldOutStatus() && (
                                <Badge variant="destructive" className="text-xs flex-shrink-0">
                                    Sold Out
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            {canSeePrice && ticket.price !== undefined && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <IconCurrencyRupee className="w-3 h-3" />
                                    <span>₹{ticket.price}</span>
                                </div>
                            )}
                            
                            {ticket.sold !== undefined && ticket.capacity !== undefined && userRole !== 'volunteer' && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <span>Sold: {ticket.sold}/{ticket.capacity}</span>
                                </div>
                            )}
                            
                            {ticket.sold !== undefined && ticket.capacity !== undefined && userRole !== 'volunteer' && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <span>Available: {getAvailableCount()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Desktop Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(ticket._id)}
                        className="hidden md:flex items-center gap-1"
                    >
                        <IconEye className="w-3 h-3" />
                        <span className="hidden lg:inline">Details</span>
                    </Button>
                    
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(ticket._id)}
                        className="md:hidden h-8 w-8 p-0"
                    >
                        <IconEye className="w-3 h-3" />
                    </Button>
                    
                    {canEdit && (
                        <>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={ticket.isActive}
                                    onCheckedChange={() => onToggle(ticket)}
                                    disabled={toggleLoading}
                                    className="data-[state=checked]:bg-primary"
                                />
                                {toggleLoading && (
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                )}
                            </div>
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(ticket)}
                                className="hidden md:flex items-center gap-1"
                            >
                                <IconEdit className="w-3 h-3" />
                                <span className="hidden lg:inline">Edit</span>
                            </Button>
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(ticket)}
                                className="md:hidden h-8 w-8 p-0"
                            >
                                <IconEdit className="w-3 h-3" />
                            </Button>
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(ticket)}
                                className="hidden md:flex items-center gap-1 text-destructive hover:text-destructive"
                            >
                                <IconTrash className="w-3 h-3" />
                                <span className="hidden lg:inline">Delete</span>
                            </Button>
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(ticket)}
                                className="md:hidden h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                                <IconTrash className="w-3 h-3" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

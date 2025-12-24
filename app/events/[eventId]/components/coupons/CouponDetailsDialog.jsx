import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { IconUsers, IconClock, IconPercentage } from '@tabler/icons-react';
import moment from 'moment';

export function CouponDetailsDialog({
    open,
    onOpenChange,
    coupon,
    loading
}) {
    // Show loader when loading or when no coupon data is available yet
    if (loading || (!coupon && open)) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle>Coupon Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!coupon) return null;

    const isExpired = coupon.expiresAt && moment(coupon.expiresAt).isBefore(moment());
    const usagePercentage = coupon.maxUsage ? Math.round((coupon.usedCount || 0) / coupon.maxUsage * 100) : 0;
    
    const getStatus = () => {
        if (!coupon.isActive) return { text: 'Inactive', variant: 'secondary' };
        if (isExpired) return { text: 'Expired', variant: 'destructive' };
        if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) return { text: 'Used Up', variant: 'destructive' };
        return { text: 'Active', variant: 'default' };
    };

    const status = getStatus();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                    <DialogTitle>Coupon Details</DialogTitle>
                </DialogHeader>

                {coupon ? (
                    <div className="space-y-4">
                        {/* Header - Mobile Optimized */}
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <code className="bg-muted px-3 py-2 rounded text-sm font-mono font-bold break-all">
                                    {coupon.code}
                                </code>
                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant={status.variant} className="text-xs">
                                        {status.text}
                                    </Badge>
                                    <Badge variant={coupon.discountType === 'percent' ? 'default' : 'secondary'} className="text-xs">
                                        {coupon.discountType === 'percent'
                                            ? `${coupon.discountValue}% OFF`
                                            : `₹${coupon.discountValue} OFF`}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Usage Info */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <IconUsers className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Usage</span>
                                </div>
                                <span className="font-medium">
                                    {coupon.usedCount || 0}{coupon.maxUsage ? ` / ${coupon.maxUsage}` : ''}
                                </span>
                            </div>

                            {coupon.maxUsage && (
                                <div className="space-y-1">
                                    <Progress value={usagePercentage} className="h-2" />
                                    <div className="text-xs text-muted-foreground text-right">
                                        {usagePercentage}% used
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Expiry Info */}
                        {coupon.expiresAt && (
                            <div className="flex items-center justify-between text-sm py-2 border-t">
                                <div className="flex items-center gap-2">
                                    <IconClock className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Expires</span>
                                </div>
                                <span className={isExpired ? 'text-destructive font-medium' : 'text-foreground'}>
                                    {moment(coupon.expiresAt).format('MMM DD, YYYY')}
                                </span>
                            </div>
                        )}

                        {/* Additional Info */}
                        {(coupon.description || coupon.minimumAmount) && (
                            <div className="space-y-2 pt-2 border-t">
                                {coupon.description && (
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Description:</span>
                                        <p className="mt-1 text-foreground">{coupon.description}</p>
                                    </div>
                                )}
                                {coupon.minimumAmount && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Minimum Amount</span>
                                        <span className="font-medium">₹{coupon.minimumAmount}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-6 text-muted-foreground">
                        <p>No coupon details available</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

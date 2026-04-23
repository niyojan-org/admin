'use client'
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { IconTicket, IconUsers, IconShieldCheck, IconShieldX, IconSettings } from '@tabler/icons-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export function CouponAllowanceDialog({ eventId, open, onOpenChange, onAllowanceChange, trigger }) {
    const [allowCoupons, setAllowCoupons] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toggleLoading, setToggleLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch current coupon allowance status
    const fetchCouponAllowance = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/events/admin/coupon/${eventId}/allow-coupons`);
            const allowanceStatus = response.data.allowCoupons || false;
            setAllowCoupons(allowanceStatus);
            
            // Update parent component state
            if (onAllowanceChange) {
                onAllowanceChange(allowanceStatus);
            }
        } catch (error) {
            console.error('Error fetching coupon allowance:', error);
            setError(error.response?.data?.message || 'Failed to fetch coupon allowance status');

            // Don't show toast for role access denied errors
            if (error.response?.data?.error?.code !== 'ROLE_ACCESS_DENIED') {
                toast.error('Failed to fetch coupon allowance status');
            }
        } finally {
            setLoading(false);
        }
    };

    // Toggle coupon allowance
    const handleToggleAllowance = async (newStatus) => {
        try {
            setToggleLoading(true);

            // Optimistic update
            setAllowCoupons(newStatus);
            // Update parent component state
            if (onAllowanceChange) {
                onAllowanceChange(newStatus);
            }

            await api.patch(`/events/admin/coupon/${eventId}/allow-coupons`, {
                allowCoupons: newStatus
            });

            toast.success(
                newStatus
                    ? 'Coupons enabled for participant registration'
                    : 'Coupons disabled for participant registration'
            );
        } catch (error) {
            console.error('Error updating coupon allowance:', error);

            // Revert optimistic update
            setAllowCoupons(!newStatus);
            // Revert parent component state
            if (onAllowanceChange) {
                onAllowanceChange(!newStatus);
            }

            // Don't show toast for role access denied errors
            if (error.response?.data?.error?.code !== 'ROLE_ACCESS_DENIED') {
                toast.error('Failed to update coupon allowance status');
            }
        } finally {
            setToggleLoading(false);
        }
    };

    // Fetch data when dialog opens
    useEffect(() => {
        if (open && eventId) {
            fetchCouponAllowance();
        }
    }, [open, eventId]);

    // Don't render if there's an error
    if (error && !loading) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconSettings className="w-5 h-5" />
                        Registration Settings
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-64" />
                                </div>
                                <Skeleton className="h-6 w-12" />
                            </div>
                            <Skeleton className="h-20 w-full" />
                        </div>
                    ) : (
                        <>
                            {/* Toggle Section */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <IconTicket className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-sm">
                                                Allow Coupons in Registration
                                            </h4>
                                            <Badge
                                                variant={allowCoupons ? 'default' : 'destructive'}
                                                className="flex items-center gap-1 text-xs"
                                            >
                                                {allowCoupons ? (
                                                    <IconShieldCheck className="w-3 h-3" />
                                                ) : (
                                                    <IconShieldX className="w-3 h-3" />
                                                )}
                                                {allowCoupons ? 'Enabled' : 'Disabled'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {allowCoupons
                                                ? 'Participants can apply coupon codes during registration'
                                                : 'Coupon codes are disabled for participant registration'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {toggleLoading && (
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    )}
                                    <Switch
                                        checked={allowCoupons}
                                        onCheckedChange={handleToggleAllowance}
                                        disabled={toggleLoading}
                                        className="data-[state=checked]:bg-primary"
                                    />
                                </div>
                            </div>

                            {/* Information Section */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-sm flex items-center gap-2">
                                    <IconUsers className="w-4 h-4" />
                                    How it Works
                                </h4>

                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <p>
                                            When <strong>enabled</strong>, participants will see a coupon code field during event registration
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <p>
                                            Only <strong>active and non-expired</strong> coupons will be accepted during registration
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <p>
                                            Coupon usage limits will be automatically enforced and tracked
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <p>
                                            When <strong>disabled</strong>, the coupon field will be hidden from registration forms
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Summary */}
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-2 text-sm">
                                    <IconShieldCheck className="w-4 h-4 text-primary-foreground" />
                                    <span className="font-medium">Current Status:</span>
                                    <span className={allowCoupons ? 'text-secondary' : 'text-destructive'}>
                                        {allowCoupons
                                            ? 'Participants can use coupons during registration'
                                            : 'Coupon usage is disabled for registration'
                                        }
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

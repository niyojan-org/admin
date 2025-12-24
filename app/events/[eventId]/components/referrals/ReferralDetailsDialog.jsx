'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
    IconUser,
    IconCalendar,
    IconClock,
    IconChartBar,
    IconShare,
    IconInfinity,
    IconMail,
    IconShield
} from '@tabler/icons-react';

export function ReferralDetailsDialog({
    open,
    onOpenChange,
    referral,
    loading,
    userRole
}) {
    const canViewAll = ['owner', 'admin', 'manager'].includes(userRole);
    
    if (!referral && !loading) return null;

    const usagePercentage = referral?.maxUsage > 0 ? 
        Math.round((referral.usageCount / referral.maxUsage) * 100) : 0;

    const isExpired = referral?.expiresAt && new Date(referral.expiresAt) < new Date();
    const isLimitReached = referral?.usageCount >= referral?.maxUsage;
    const isUsable = referral?.isActive && !isExpired && !isLimitReached;

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconShare className="w-5 h-5" />
                        Referral Code Details
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-32" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-24" />
                            <Skeleton className="h-24" />
                        </div>
                        <Skeleton className="h-32" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Header Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <code className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-mono text-lg font-bold">
                                        {referral.code}
                                    </code>
                                    <Badge variant={isUsable ? 'default' : 'secondary'}>
                                        {referral.isActive ? (isExpired ? 'Expired' : isLimitReached ? 'Limit Reached' : 'Active') : 'Inactive'}
                                    </Badge>
                                </div>
                                {isUsable && (
                                    <Badge variant="outline" className="text-green-600 border-green-200">
                                        Ready to Use
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* User Information */}
                        {canViewAll && referral.whose && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={referral.whose.avatar} />
                                            <AvatarFallback>
                                                {referral.whose.name?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="font-semibold text-lg">{referral.whose.name}</div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <IconMail className="w-3 h-3" />
                                                    {referral.whose.email}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <IconShield className="w-3 h-3" />
                                                    {referral.whose.orgRole}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Usage Statistics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <IconChartBar className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-semibold">Usage Statistics</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Current Usage</span>
                                            <span className="font-bold text-2xl">{referral.usageCount || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Maximum Allowed</span>
                                            <span className="font-bold text-lg">
                                                {referral.maxUsage || <IconInfinity className="w-5 h-5" />}
                                            </span>
                                        </div>
                                        {referral.maxUsage > 0 && (
                                            <>
                                                <Progress value={usagePercentage} className="h-2" />
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <span>{usagePercentage}% used</span>
                                                    <span>{referral.maxUsage - referral.usageCount} remaining</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <IconClock className="w-5 h-5 text-purple-600" />
                                        <h3 className="font-semibold">Timeline</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-sm text-muted-foreground">Created</div>
                                            <div className="font-medium">{formatDate(referral.createdAt)}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Last Updated</div>
                                            <div className="font-medium">{formatDate(referral.updatedAt)}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Expires</div>
                                            <div className="font-medium">
                                                {referral.expiresAt ? formatDate(referral.expiresAt) : 'Never'}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Status Overview */}
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-3">Status Overview</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${referral.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        <div className="text-xs text-muted-foreground">Active Status</div>
                                        <div className="font-medium">{referral.isActive ? 'Active' : 'Inactive'}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${isExpired ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                        <div className="text-xs text-muted-foreground">Expiration</div>
                                        <div className="font-medium">{isExpired ? 'Expired' : 'Valid'}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${isLimitReached ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                        <div className="text-xs text-muted-foreground">Usage Limit</div>
                                        <div className="font-medium">{isLimitReached ? 'Reached' : 'Available'}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${isUsable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <div className="text-xs text-muted-foreground">Usability</div>
                                        <div className="font-medium">{isUsable ? 'Usable' : 'Blocked'}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info */}
                        <div className="text-xs text-muted-foreground space-y-1">
                            <div>Referral ID: {referral._id}</div>
                            {referral.usageCount > 0 && (
                                <div className="text-amber-600">
                                    ⚠️ This referral has usage history and cannot be fully deleted
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ReferralDetailsDialog;

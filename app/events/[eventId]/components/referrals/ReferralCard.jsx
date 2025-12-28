'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
    IconEdit,
    IconTrash,
    IconEye,
    IconCopy,
    IconClock
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export function ReferralCard({ 
    referral, 
    onEdit, 
    onDelete, 
    onToggle, 
    onViewDetails,
    toggleLoading = false,
    userRole = 'volunteer'
}) {
    const canEdit = ['owner', 'admin', 'manager'].includes(userRole);
    const canDelete = ['owner', 'admin'].includes(userRole);
    const canToggle = ['owner', 'admin', 'manager'].includes(userRole);
    
    const usagePercentage = referral.maxUsage ? 
        ((referral.usageCount || 0) / referral.maxUsage) * 100 : 0;
    
    const isExpired = referral.expiresAt && new Date(referral.expiresAt) < new Date();
    const isNearExpiry = referral.expiresAt && 
        new Date(referral.expiresAt) < new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(referral.code);
            toast.success('Referral code copied to clipboard');
        } catch (error) {
            toast.error('Failed to copy code');
        }
    };

    return (
        <div className="group relative border rounded-xl p-3 sm:p-4 bg-card hover:shadow-lg transition-all duration-200 hover:border-primary/20">
            {/* Header */}
            <div className="flex items-start justify-between mb-3 gap-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <button
                            onClick={handleCopyCode}
                            className="font-mono cursor-pointer text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md hover:bg-primary/20 transition-colors shrink-0"
                            title="Click to copy"
                        >
                            {referral.code}
                        </button>
                        <Badge 
                            variant={referral.isActive && !isExpired ? "default" : "secondary"}
                            className="text-xs shrink-0"
                        >
                            {isExpired ? 'Expired' : referral.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {isNearExpiry && !isExpired && (
                            <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 shrink-0">
                                <IconClock className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">Soon</span>
                            </Badge>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground ">
                        <Avatar className="w-5 h-5 shrink-0">
                            <AvatarImage src={referral.whose?.avatar} />
                            <AvatarFallback className="text-xs">
                                {referral.whose?.name?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <span className="truncate min-w-0">
                            {referral.whose?.name || 'Unknown User'}
                        </span>
                    </div>
                </div>

                {/* Actions - Always visible on mobile */}
                <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(referral)}
                        className="w-8 h-8 p-0"
                        title="View details"
                    >
                        <IconEye className="w-4 h-4" />
                    </Button>
                    
                    {canEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(referral)}
                            className="w-8 h-8 p-0"
                            title="Edit referral"
                        >
                            <IconEdit className="w-4 h-4" />
                        </Button>
                    )}
                    
                    {canDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(referral)}
                            className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                            title="Delete referral"
                        >
                            <IconTrash className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Usage Progress */}
            <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="font-medium">
                        {referral.usageCount || 0}
                        <span className="hidden sm:inline">/{referral.maxUsage || '∞'}</span>
                        <span className="sm:hidden">/{referral.maxUsage || '∞'}</span>
                    </span>
                </div>
                <Progress 
                    value={usagePercentage} 
                    className="h-2"
                    color={usagePercentage >= 80 ? 'destructive' : 'primary'}
                />
            </div>

            {/* Footer - Mobile optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-border/50">
                <div className="text-xs text-muted-foreground flex-1 min-w-0">
                    {referral.expiresAt ? (
                        <span className={`${isExpired ? 'text-destructive' : isNearExpiry ? 'text-orange-600' : ''} line-clamp-1`}>
                            <span className="hidden sm:inline">Expires </span>
                            <span className="sm:hidden">Exp </span>
                            {formatDistanceToNow(new Date(referral.expiresAt), { addSuffix: true })}
                        </span>
                    ) : (
                        <span>
                            <span className="hidden sm:inline">No expiration</span>
                            <span className="sm:hidden">No exp</span>
                        </span>
                    )}
                </div>

                {canToggle && (
                    <div className="flex items-center gap-2 shrink-0">
                        {toggleLoading ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Switch
                                checked={referral.isActive && !isExpired}
                                onCheckedChange={() => onToggle(referral)}
                                disabled={isExpired}
                                size="sm"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReferralCard;

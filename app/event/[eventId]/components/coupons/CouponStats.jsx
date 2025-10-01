import { Progress } from '@/components/ui/progress';
import { IconUsers, IconCalendar } from '@tabler/icons-react';
import moment from 'moment';

export function CouponStats({ coupon }) {
    const getUsagePercentage = (used, max) => {
        return Math.round((used / max) * 100);
    };

    const getTimeRemaining = (expiresAt) => {
        if (!expiresAt) return 'No expiry';
        const now = moment();
        const expiry = moment(expiresAt);

        if (expiry.isBefore(now)) return 'Expired';

        const duration = moment.duration(expiry.diff(now));
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();

        if (days > 0) {
            return `${days}d ${hours}h left`;
        } else if (hours > 0) {
            return `${hours}h left`;
        } else {
            return `${duration.minutes()}m left`;
        }
    };

    return (
        <div className="grid grid-cols-1 gap-4 mb-2">
            <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                    <IconUsers className="w-3 h-3" />
                    {coupon.usedCount || 0}/{coupon.maxUsage} used
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                    <IconCalendar className="w-3 h-3" />
                    {getTimeRemaining(coupon.expiresAt)}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Progress
                    value={getUsagePercentage(coupon.usedCount || 0, coupon.maxUsage)}
                    className="h-1.5 flex-1"
                />
                <span className="text-xs text-muted-foreground min-w-[30px]">
                    {getUsagePercentage(coupon.usedCount || 0, coupon.maxUsage)}%
                </span>
            </div>
        </div>
    );
}

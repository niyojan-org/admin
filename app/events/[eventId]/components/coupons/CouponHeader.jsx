import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconCopy, IconEye } from '@tabler/icons-react';
import moment from 'moment';

export function CouponHeader({ coupon, onCopy, onViewDetails }) {
    const formatDiscount = (coupon) => {
        return coupon.discountType === 'percentage'
            ? `${coupon.discountValue}% OFF`
            : `₹${coupon.discountValue} OFF`;
    };

    const isExpired = (expiresAt) => {
        return expiresAt && moment(expiresAt).isBefore(moment());
    };

    return (
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-xs font-mono font-semibold">
                    {coupon.code}
                </code>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onCopy(coupon.code)}
                    title="Copy code"
                >
                    <IconCopy className="w-3 h-3" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onViewDetails(coupon._id)}
                    title="View details"
                >
                    <IconEye className="w-3 h-3" />
                </Button>
                <Badge
                    variant={coupon.discountType === 'percentage' ? 'default' : 'secondary'}
                    className="text-xs"
                >
                    {formatDiscount(coupon)}
                </Badge>
            </div>

            <div className="flex items-center gap-1">
                <Badge variant={coupon.isActive ? 'default' : 'secondary'} className="text-xs">
                    {coupon.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {isExpired(coupon.expiresAt) && (
                    <Badge variant="destructive" className="text-xs">Expired</Badge>
                )}
            </div>
        </div>
    );
}

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { IconEdit, IconLoader2 } from '@tabler/icons-react';
import { DeleteCouponDialog } from './DeleteCouponDialog';
import { CouponFormDialog } from './CouponFormDialog';
import moment from 'moment';

export function CouponActions({ coupon, onToggle, onEdit, onDelete, toggleLoading = new Set(), deleteLoading = new Set(), updateLoading = false }) {
    const isExpired = (expiresAt) => {
        return expiresAt && moment(expiresAt).isBefore(moment());
    };

    const isToggleLoading = toggleLoading?.has?.(coupon._id) || false;

    return (
        <div className="flex justify-between items-center pt-2 border-t">
            <div className="flex items-center gap-2">
                {isToggleLoading ? (
                    <IconLoader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                ) : (
                    <Switch
                        checked={coupon.isActive}
                        onCheckedChange={() => onToggle(coupon)}
                        disabled={isExpired(coupon.expiresAt) || isToggleLoading}
                        size="sm"
                    />
                )}
                <span className="text-xs text-muted-foreground">
                    {coupon.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            <div className="flex gap-1">
                <CouponFormDialog
                    isCreateMode={false}
                    coupon={coupon}
                    onUpdate={onEdit}
                    updateLoading={updateLoading}
                    trigger={
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            title="Edit coupon"
                        >
                            <IconEdit className="w-3 h-3" />
                        </Button>
                    }
                />

                <DeleteCouponDialog
                    coupon={coupon}
                    onDelete={onDelete}
                    deleteLoading={deleteLoading}
                />
            </div>
        </div>
    );
}

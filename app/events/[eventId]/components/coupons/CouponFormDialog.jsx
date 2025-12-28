import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateTimeInput } from '@/components/ui/date-time-input';
import { IconPlus, IconLoader2, IconRefresh } from '@tabler/icons-react';

export function CouponFormDialog({
    isCreateMode = true,
    trigger,
    coupon = null,
    onCreate,
    onUpdate,
    createLoading,
    updateLoading
}) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percent',
        discountValue: '',
        maxUsage: '',
        expiresAt: ''
    });

    // Generate random coupon code
    const generateCouponCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({ ...prev, code: result }));
    };

    // Reset form when dialog opens/closes or when switching between create/edit
    useEffect(() => {
        if (open) {
            if (isCreateMode) {
                setFormData({
                    code: '',
                    discountType: 'percent',
                    discountValue: '',
                    maxUsage: '',
                    expiresAt: ''
                });
            } else if (coupon) {
                setFormData({
                    code: coupon.code || '',
                    discountType: coupon.discountType || 'percent',
                    discountValue: coupon.discountValue?.toString() || '',
                    maxUsage: coupon.maxUsage?.toString() || '',
                    expiresAt: coupon.expiresAt || ''
                });
            }
        }
    }, [open, isCreateMode, coupon]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = {
            code: formData.code,
            discountType: formData.discountType,
            discountValue: formData.discountValue ? Number(formData.discountValue) : 0,
            maxUsage: formData.maxUsage ? Math.max(1, parseInt(formData.maxUsage)) : null,
            expiresAt: formData.expiresAt || null,
            isActive: true
        };

        if (isCreateMode) {
            await onCreate(submitData);
        } else {
            await onUpdate(coupon._id, submitData);
        }

        setOpen(false);
    };

    const isLoading = isCreateMode ? createLoading : updateLoading;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="sm" className="flex items-center gap-1">
                        <IconPlus className="w-3 h-3" />
                        Add Coupon
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isCreateMode ? 'Create New Coupon' : 'Edit Coupon'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">Coupon Code</Label>
                        <div className="flex gap-2">
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                placeholder="SAVE20"
                                required
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={generateCouponCode}
                                disabled={isLoading}
                                title="Generate random code"
                            >
                                <IconRefresh className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="discountType">Type</Label>
                        <Select
                            value={formData.discountType}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, discountType: value }))}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percent">Percentage</SelectItem>
                                <SelectItem value="flat">Fixed Amount</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="discountValue">
                                {formData.discountType === 'percent' ? 'Percentage' : 'Amount'}
                            </Label>
                            <Input
                                id="discountValue"
                                type="number"
                                value={formData.discountValue}
                                onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                                placeholder={formData.discountType === 'percent' ? '20' : '100'}
                                min="0"
                                max={formData.discountType === 'percent' ? '100' : undefined}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxUsage">Usage Limit</Label>
                            <Input
                                id="maxUsage"
                                type="number"
                                value={formData.maxUsage}
                                onChange={(e) => setFormData(prev => ({ ...prev, maxUsage: e.target.value }))}
                                placeholder="100"
                                min="1"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="expiresAt">Expiry Date & Time</Label>
                            <DateTimeInput
                                value={formData.expiresAt}
                                onChange={(value) => setFormData(prev => ({ ...prev, expiresAt: value }))}
                                minDateTime={new Date().toISOString()}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <IconLoader2 className="w-3 h-3 animate-spin mr-1" />
                                    {isCreateMode ? 'Creating...' : 'Updating...'}
                                </>
                            ) : (
                                isCreateMode ? 'Create Coupon' : 'Update Coupon'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

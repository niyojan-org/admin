'use client'
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IconCheck, IconLoader2, IconRefresh } from '@tabler/icons-react';
import moment from 'moment';
import { DateTimeInput } from '@/components/ui/date-time-input';

// Generate 6-digit alphanumeric uppercase code
const generateCheckInCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
};

export default function EnableCheckInDialog({
    open,
    onOpenChange,
    session,
    onConfirm,
    loading = false
}) {
    const [formData, setFormData] = useState({
        checkInCode: '',
        checkInStartTime: session?.startTime || '',
        checkInEndTime: session?.endTime || ''
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.checkInCode.trim()) {
            newErrors.checkInCode = 'Check-in code is required';
        }

        if (!formData.checkInStartTime) {
            newErrors.checkInStartTime = 'Check-in start time is required';
        }

        if (!formData.checkInEndTime) {
            newErrors.checkInEndTime = 'Check-in end time is required';
        }

        if (formData.checkInStartTime && formData.checkInEndTime) {
            if (moment(formData.checkInStartTime).isAfter(moment(formData.checkInEndTime))) {
                newErrors.checkInEndTime = 'End time must be after start time';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        const payload = {
            checkInCode: formData.checkInCode,
            checkInStartTime: moment(formData.checkInStartTime).toISOString(),
            checkInEndTime: moment(formData.checkInEndTime).toISOString()
        };

        await onConfirm(payload);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Enable Check-in</DialogTitle>
                    <DialogDescription>
                        Configure check-in settings for "{session?.title}". Participants will use the check-in code to mark their attendance.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Check-in Code */}
                    <div className="space-y-2">
                        <Label htmlFor="checkInCode">
                            Check-in Code <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="checkInCode"
                                placeholder="e.g., ABC123"
                                value={formData.checkInCode}
                                onChange={(e) => handleChange('checkInCode', e.target.value.toUpperCase())}
                                disabled={loading}
                                className={errors.checkInCode ? 'border-destructive' : ''}
                                maxLength={6}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleChange('checkInCode', generateCheckInCode())}
                                disabled={loading}
                                title="Generate random code"
                            >
                                <IconRefresh className="w-4 h-4" />
                            </Button>
                        </div>
                        {errors.checkInCode && (
                            <p className="text-xs text-destructive">{errors.checkInCode}</p>
                        )}
                    </div>

                    {/* Check-in Start Time */}
                    <div className="space-y-2">
                        <Label htmlFor="checkInStartTime">
                            Check-in Start Time <span className="text-destructive">*</span>
                        </Label>
                        <DateTimeInput
                            value={formData.checkInStartTime}
                            onChange={(value) => handleChange('checkInStartTime', value)}
                            minDateTime={moment(formData.checkInStartTime).subtract(2, 'hours').toISOString()}
                            disabled={loading}
                            className={errors.checkInStartTime ? 'border-destructive' : ''}
                        />
                        {errors.checkInStartTime && (
                            <p className="text-xs text-destructive">{errors.checkInStartTime}</p>
                        )}
                    </div>

                    {/* Check-in End Time */}
                    <div className="space-y-2">
                        <Label htmlFor="checkInEndTime">
                            Check-in End Time <span className="text-destructive">*</span>
                        </Label>
                        <DateTimeInput
                            value={formData.checkInEndTime}
                            onChange={(value) => handleChange('checkInEndTime', value)}
                            minDateTime={formData.checkInStartTime}
                            disabled={loading}
                            className={errors.checkInEndTime ? 'border-destructive' : ''}
                        />
                        {errors.checkInEndTime && (
                            <p className="text-xs text-destructive">{errors.checkInEndTime}</p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enabling...
                            </>
                        ) : (
                            <>
                                <IconCheck className="w-4 h-4 mr-2" />
                                Enable Check-in
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

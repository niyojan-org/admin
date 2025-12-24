import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateTimeInput } from '@/components/ui/date-time-input';

export function UsageConfigSection({
    formData,
    setFormData,
    errors,
    setErrors,
    hasExistingUsage,
    referral
}) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Usage Configuration</CardTitle>
                <CardDescription>
                    Set usage limits and validity period
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="maxUsage">Maximum Usage *</Label>
                    <Input
                        id="maxUsage"
                        type="number"
                        min="1"
                        max="1000"
                        value={formData.maxUsage}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, maxUsage: e.target.value }));
                            setErrors(prev => ({ ...prev, maxUsage: undefined }));
                        }}
                        placeholder="100"
                        className={errors.maxUsage ? 'border-destructive' : ''}
                    />
                    {hasExistingUsage && referral?.usageCount > 0 && (
                        <p className="text-xs text-muted-foreground">
                            Cannot be reduced below current usage ({referral.usageCount})
                        </p>
                    )}
                    {errors.maxUsage && (
                        <p className="text-sm text-destructive">{errors.maxUsage}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Expiry Date & Time (Optional)</Label>
                    <DateTimeInput
                        value={formData.expiresAt}
                        onChange={(isoString) => {
                            setFormData(prev => ({ ...prev, expiresAt: isoString }));
                            setErrors(prev => ({ ...prev, expiresAt: undefined }));
                        }}
                        minDateTime={new Date().toISOString()}
                        className={errors.expiresAt ? 'border-destructive' : ''}
                    />
                    {errors.expiresAt && (
                        <p className="text-sm text-destructive">{errors.expiresAt}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Leave empty for no expiration.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconAlertCircle } from '@tabler/icons-react';

export function StatusSection({ formData, setFormData, hasExistingUsage, referral }) {
    return (
        <>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                <div className="space-y-1">
                    <Label htmlFor="isActive">Active Status</Label>
                    <p className="text-xs text-muted-foreground">
                        Only active codes can be used by participants
                    </p>
                </div>
                <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
            </div>

            {hasExistingUsage && (
                <Alert>
                    <IconAlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        This referral code has {referral.usageCount} usage(s). Some fields cannot be modified.
                    </AlertDescription>
                </Alert>
            )}
        </>
    );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconRefresh, IconCopy } from '@tabler/icons-react';

export function ReferralCodeSection({
    formData,
    errors,
    hasExistingUsage,
    onFieldChange,
    onGenerate,
    onCopy
}) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Referral Code</CardTitle>
                <CardDescription>
                    Generate or enter a unique referral code
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label htmlFor="code">Code *</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => onFieldChange('code', e.target.value.toUpperCase())}
                            placeholder="Enter referral code..."
                            className={`font-mono flex-1 ${errors.code ? 'border-destructive' : ''}`}
                            disabled={hasExistingUsage}
                        />
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onGenerate}
                                disabled={hasExistingUsage}
                                className="flex-1 sm:flex-none"
                            >
                                <IconRefresh className="w-4 h-4 mr-2" />
                                Generate
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={onCopy}
                                disabled={!formData.code}
                            >
                                <IconCopy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    {errors.code && (
                        <p className="text-sm text-destructive">{errors.code}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

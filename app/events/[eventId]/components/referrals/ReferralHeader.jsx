'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
    IconShare,
    IconPlus,
    IconTrendingUp,
    IconUsers,
    IconClock,
    IconToggleLeft,
    IconToggleRight
} from '@tabler/icons-react';

export function ReferralHeader({ 
    referrals, 
    systemEnabled, 
    onCreateReferral, 
    onToggleSystem, 
    userRole,
    loading 
}) {
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter(r => r.isActive).length;
    const totalUsage = referrals.reduce((sum, r) => sum + (r.usageCount || 0), 0);

    const canManage = ['owner', 'admin'].includes(userRole);

    return (
        <div className="space-y-4">
            {/* Main Header */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-2">
                                <IconShare className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">
                                    Referral System
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Manage referral codes and track performance
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* System Toggle */}
                            {canManage && (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background">
                                    <span className="text-sm font-medium">System</span>
                                    <Switch
                                        checked={systemEnabled}
                                        onCheckedChange={onToggleSystem}
                                        disabled={loading}
                                    />
                                    {systemEnabled ? (
                                        <IconToggleRight className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <IconToggleLeft className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </div>
                            )}

                            {/* Create Button */}
                            {canManage && systemEnabled && (
                                <Button 
                                    onClick={onCreateReferral}
                                    disabled={loading}
                                    className="flex items-center gap-2"
                                >
                                    <IconPlus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Create Referral</span>
                                    <span className="sm:hidden">Create</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <IconShare className="w-4 h-4" />
                                <span className="text-sm">Total Codes</span>
                            </div>
                            <div className="text-2xl font-bold">{totalReferrals}</div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <IconClock className="w-4 h-4" />
                                <span className="text-sm">Active</span>
                            </div>
                            <div className="text-2xl font-bold text-green-600">{activeReferrals}</div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <IconUsers className="w-4 h-4" />
                                <span className="text-sm">Total Uses</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">{totalUsage}</div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <IconTrendingUp className="w-4 h-4" />
                                <span className="text-sm">Avg. Usage</span>
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                                {totalReferrals > 0 ? Math.round(totalUsage / totalReferrals) : 0}
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">System Status:</span>
                                <Badge variant={systemEnabled ? 'default' : 'secondary'}>
                                    {systemEnabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                            </div>
                            {!systemEnabled && (
                                <p className="text-sm text-muted-foreground">
                                    Enable system to allow referral code usage
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

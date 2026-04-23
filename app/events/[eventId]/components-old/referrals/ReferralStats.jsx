'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    IconShare,
    IconPlus,
    IconSettings,
    IconUsers,
    IconActivity,
    IconTrendingUp,
    IconInfoCircle
} from '@tabler/icons-react';

export function ReferralStats({
    stats,
    systemEnabled,
    onToggleSystem,
    onCreateReferral,
    userRole,
    systemToggleLoading
}) {
    return (
        <div className="space-y-4">
            {/* Title and Actions */}
            <div className="flex flex-col sm:justify-between gap-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">Referral System</h3>
                        {!systemEnabled && (
                            <Badge variant="secondary" className="text-xs">
                                Disabled
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Manage and track referral codes for your event
                    </p>
                </div>

                {/* Action Buttons - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {/* System Toggle - Only for admin/owner */}
                    {['owner', 'admin'].includes(userRole) && (
                        <div className="flex items-center justify-between sm:px-3 gap-2 p-3 sm:p-0.5 w-full rounded-lg border bg-muted/30">
                            <div className="flex items-center gap-2">
                                <IconSettings className="w-4 h-4" />
                                <span className="text-sm font-medium">System</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={systemEnabled}
                                    onCheckedChange={onToggleSystem}
                                    disabled={systemToggleLoading}
                                />
                                {/* Info Button */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
                                        >
                                            <IconInfoCircle className="w-4 h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80" side="bottom" align="end">
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <h4 className="font-medium text-sm">Referral System</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Allow participants to register using referral codes and track referral performance.
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                    <span className="text-xs font-medium">System Enabled</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground ml-4">
                                                    Participants can use referral codes during registration. Referral tracking is active.
                                                </p>

                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                                    <span className="text-xs font-medium">System Disabled</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground ml-4">
                                                    Referral codes cannot be used. No new referral tracking occurs.
                                                </p>
                                            </div>

                                            <div className="pt-2 border-t space-y-1">
                                                <p className="text-xs font-medium">Features:</p>
                                                <ul className="text-xs text-muted-foreground space-y-1">
                                                    <li>• Create unique referral codes</li>
                                                    <li>• Assign codes to team members</li>
                                                    <li>• Track usage and performance</li>
                                                    <li>• Set usage limits and expiry dates</li>
                                                    <li>• Monitor referral analytics</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    )}

                    {/* Create Button */}
                    {['owner', 'admin', 'manager'].includes(userRole) && (
                        <Button
                            onClick={onCreateReferral}
                            disabled={!systemEnabled}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto"
                            size="default"
                        >
                            <IconPlus className="w-4 h-4" />
                            <span>Create Referral</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards - Mobile Optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <IconShare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{stats.total}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <IconActivity className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{stats.active}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <IconTrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{stats.totalUsage}</p>
                        <p className="text-xs text-muted-foreground">Usage</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <IconUsers className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{stats.expired}</p>
                        <p className="text-xs text-muted-foreground">Expired</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReferralStats;

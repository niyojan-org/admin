'use client'
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
    IconPlus, 
    IconSettings, 
    IconCalendar,
    IconInfoCircle 
} from '@tabler/icons-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function SessionHeader({
    sessionCount = 0,
    allowMultipleSessions = false,
    onAddSession,
    onToggleMultipleSessions,
    userRole = 'volunteer',
    loading = false
}) {
    const canManage = ['owner', 'admin'].includes(userRole);
    const canAdd = canManage && (allowMultipleSessions || sessionCount === 0);

    return (
        <CardHeader className="pb-1">
            <div className="space-y-3">
                {/* Main Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <IconCalendar className="w-4 h-4 text-primary" />
                        <CardTitle className="text-lg">Sessions</CardTitle>
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {sessionCount}
                        </Badge>
                    </div>

                    {/* Add Session Button */}
                    {canAdd && (
                        <Button
                            onClick={onAddSession}
                            disabled={loading}
                            size="sm"
                            className="flex items-center gap-1.5 h-8"
                        >
                            <IconPlus className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Add Session</span>
                            <span className="sm:hidden">Add</span>
                        </Button>
                    )}
                </div>

                {/* Multiple Sessions Toggle - Compact */}
                {canManage && (
                    <div className="flex sm:items-center justify-between gap-2 p-2.5 rounded-md border bg-muted/20">
                        <div className="flex items-center gap-2">
                            <IconSettings className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium">Multiple Sessions</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-transparent">
                                        <IconInfoCircle className="h-3 w-3 text-muted-foreground" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-72" side="bottom" align="start">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm">Multiple Sessions Setting</h4>
                                        <div className="space-y-1.5 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                <span className="font-medium">Enabled:</span>
                                                <span>Event can have multiple sessions</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                                <span className="font-medium">Disabled:</span>
                                                <span>Event limited to single session</span>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                checked={allowMultipleSessions}
                                onCheckedChange={onToggleMultipleSessions}
                                disabled={loading}
                                className="scale-90"
                            />
                            <Badge 
                                variant={allowMultipleSessions ? 'default' : 'secondary'}
                                className="text-xs px-1.5 py-0"
                            >
                                {allowMultipleSessions ? 'On' : 'Off'}
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Info Message for Non-Managers */}
                {!canManage && sessionCount === 0 && (
                    <p className="text-xs text-muted-foreground">
                        No sessions configured yet.
                    </p>
                )}
            </div>
        </CardHeader>
    );
}

export default SessionHeader;

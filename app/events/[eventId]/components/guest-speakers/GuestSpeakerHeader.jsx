'use client'
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    IconPlus,
    IconUsers,
    IconInfoCircle
} from '@tabler/icons-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function GuestSpeakerHeader({
    speakerCount = 0,
    onAddSpeaker,
    loading = false,
    userRole = 'volunteer'
}) {
    const canManage = ['owner', 'admin'].includes(userRole);
    const isAtLimit = speakerCount >= 10;

    return (
        <CardHeader className="">
            <div className="flex gap-4 items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <IconUsers className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg sm:text-xl">Guest Speakers</CardTitle>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs px-2.5 py-1 font-medium">
                            {speakerCount}/10
                        </Badge>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-muted">
                                    <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 sm:w-96" side="bottom" align="start">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm">Guest Speaker Management</h4>
                                    <div className="space-y-2.5 text-xs text-muted-foreground">
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></div>
                                            <span>Add notable speakers to attract participants and boost event credibility</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5"></div>
                                            <span>Include comprehensive bio, professional photo, and social links</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 mt-1.5"></div>
                                            <span>Maximum 10 speakers per event to maintain quality</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0 mt-1.5"></div>
                                            <span>Speaker names must be unique within the event</span>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {canManage && (
                    <Button
                        onClick={onAddSpeaker}
                        disabled={loading || isAtLimit}
                        size="sm"
                        className="flex items-center gap-2 h-9 px-4 self-start sm:self-auto"
                    >
                        <IconPlus className="w-4 h-4" />
                        <span className="hidden xs:inline">Add Speaker</span>
                        <span className="xs:hidden">Add</span>
                    </Button>
                )}
            </div>

            {isAtLimit && (
                <div className="mt-4 text-xs text-amber-700 bg-amber-50 px-4 py-3 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-2">
                        <IconInfoCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                        <div>
                            <p className="font-medium">Maximum limit reached</p>
                            <p className="text-amber-600 mt-1">You can have up to 10 guest speakers per event. Consider removing existing speakers to add new ones.</p>
                        </div>
                    </div>
                </div>
            )}
        </CardHeader>
    );
}

export default GuestSpeakerHeader;

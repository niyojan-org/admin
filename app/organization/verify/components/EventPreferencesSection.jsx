"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function EventPreferencesSection({ eventPreferences }) {
    if (!eventPreferences) {
        return <p className="text-muted-foreground text-sm">Event preferences not available</p>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-linear-to-br from-primary/5 to-primary/10 border">
                    <p className="text-3xl font-bold text-primary mb-1">
                        {eventPreferences.maxEventsPerMonth || 'Unlimited'}
                    </p>
                    <p className="text-xs text-muted-foreground">Max Events/Month</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-linear-to-br from-primary/5 to-primary/10 border">
                    <Badge
                        variant={eventPreferences.allowsPaidEvents ? "default" : "secondary"}
                        className="text-sm px-3 py-1.5 mb-1"
                    >
                        {eventPreferences.allowsPaidEvents ? "Paid" : "Free"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">Event Type</p>
                </div>
            </div>

            {eventPreferences.preferredEventTypes?.length > 0 && (
                <>
                    <Separator />
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">Preferred Event Types</p>
                        <div className="flex flex-wrap gap-2">
                            {eventPreferences.preferredEventTypes.map((type, index) => (
                                <Badge key={index} variant="outline" className="capitalize">
                                    {type.replace(/-/g, " ")}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

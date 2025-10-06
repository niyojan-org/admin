"use client";
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import moment from 'moment';

const ScheduleSection = ({ 
    isScheduled, 
    scheduleDateTime, 
    error,
    onScheduleToggle, 
    onScheduleTimeChange 
}) => {
    return (
        <Card className="border-dashed">
            <CardContent className="p-4">
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="schedule"
                            checked={isScheduled}
                            onCheckedChange={onScheduleToggle}
                        />
                        <Label htmlFor="schedule" className="flex items-center gap-2 text-sm font-medium">
                            <Clock className="h-3 w-3" />
                            Schedule for later
                        </Label>
                    </div>

                    {isScheduled && (
                        <div className="space-y-2">
                            <Input
                                type="datetime-local"
                                value={scheduleDateTime}
                                onChange={(e) => onScheduleTimeChange(e.target.value)}
                                min={moment().format('YYYY-MM-DDTHH:mm')}
                                className={error ? 'border-destructive' : ''}
                            />
                            {error && (
                                <p className="text-xs text-destructive">{error}</p>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ScheduleSection;

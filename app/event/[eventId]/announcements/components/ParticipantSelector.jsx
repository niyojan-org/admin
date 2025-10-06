"use client";
import React from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

const ParticipantSelector = ({ 
    participants, 
    selectedParticipantIds, 
    selectedAll, 
    loading,
    error,
    onParticipantSelect, 
    onSelectAll 
}) => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Select Participants *
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                        {participants.length} available
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="selectAll"
                        checked={selectedAll}
                        onCheckedChange={onSelectAll}
                    />
                    <Label htmlFor="selectAll" className="text-sm">
                        Select All Participants
                    </Label>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <ScrollArea className="h-40 border rounded-md p-2">
                        <div className="space-y-2">
                            {participants.map((participant) => (
                                <div
                                    key={participant._id}
                                    className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50"
                                >
                                    <Checkbox
                                        id={participant._id}
                                        checked={selectedParticipantIds.includes(participant._id)}
                                        onCheckedChange={(checked) =>
                                            onParticipantSelect(participant._id, checked)
                                        }
                                    />
                                    <Label
                                        htmlFor={participant._id}
                                        className="text-sm flex-1 cursor-pointer"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {participant.name || participant.email}
                                            </p>
                                            {participant.name && participant.email && (
                                                <p className="text-xs text-muted-foreground">
                                                    {participant.email}
                                                </p>
                                            )}
                                        </div>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}

                {error && (
                    <p className="text-xs text-destructive">{error}</p>
                )}
            </CardContent>
        </Card>
    );
};

export default ParticipantSelector;

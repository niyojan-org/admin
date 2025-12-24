'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, AlertCircle, Lock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return format(new Date(dateString), 'MMM dd, yyyy • hh:mm a');
    } catch {
        return 'Invalid date';
    }
};

export default function SessionSelectionCard({ 
    availableSessions = [],
    currentSession,
    selectedSession,
    onSessionChange,
    onUnlockSession,
    isSessionUnlocked
}) {
    const getSelectedSessionDetails = () => {
        if (!selectedSession) return null;
        return availableSessions.find(s => s._id === selectedSession);
    };

    const sessionDetails = getSelectedSessionDetails();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Select Session</CardTitle>
                <CardDescription>
                    Choose the session for participant check-in
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {availableSessions.length > 0 ? (
                    <>
                        <Select
                            value={selectedSession}
                            onValueChange={onSessionChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a session" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableSessions.map((session) => (
                                    <SelectItem key={session._id} value={session._id}>
                                        <div className="flex items-center gap-2">
                                            <span>{session.title}</span>
                                            {currentSession?._id === session._id && (
                                                <Badge variant="default" className="ml-2">Current</Badge>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Unlock Session Button */}
                        {selectedSession && !isSessionUnlocked && (
                            <Button 
                                onClick={onUnlockSession}
                                className="w-full gap-2"
                                size="lg"
                            >
                                <Lock className="w-4 h-4" />
                                Unlock Session to Start Check-In
                            </Button>
                        )}

                        {/* Session Details */}
                        {sessionDetails && (
                            <div className="space-y-3 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-sm">Session Details</h4>
                                    {isSessionUnlocked && (
                                        <Badge variant="default" className="bg-green-600">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            Unlocked
                                        </Badge>
                                    )}
                                </div>
                                
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-medium">Date & Time</p>
                                            <p className="text-muted-foreground break-words">
                                                {formatDateTime(sessionDetails.startTime)}
                                            </p>
                                            <p className="text-muted-foreground break-words">
                                                to {formatDateTime(sessionDetails.endTime)}
                                            </p>
                                        </div>
                                    </div>

                                    {sessionDetails.venue && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-medium">Venue</p>
                                                <p className="text-muted-foreground break-words">
                                                    {sessionDetails.venue.name}
                                                </p>
                                                <p className="text-muted-foreground text-xs break-words">
                                                    {sessionDetails.venue.address}, {sessionDetails.venue.city}, {sessionDetails.venue.state} {sessionDetails.venue.zipCode}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-2">
                                        <Clock className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-medium">Check-in Period</p>
                                            <p className="text-muted-foreground break-words">
                                                Started: {formatDateTime(sessionDetails.checkInStartedAt || sessionDetails.checkInStartTime)}
                                            </p>
                                            <p className="text-muted-foreground break-words">
                                                Valid Until: {formatDateTime(sessionDetails.checkInValidUntil || sessionDetails.checkInEndTime)}
                                            </p>
                                        </div>
                                    </div>

                                    {sessionDetails.description && (
                                        <div>
                                            <p className="font-medium">Description</p>
                                            <p className="text-muted-foreground break-words">
                                                {sessionDetails.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
        )}
    </>
                ) : (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            No sessions available for check-in
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Import custom components
import ErrorDisplay from './components/ErrorDisplay';
import EventInfoBanner from './components/EventInfoBanner';
import SessionSelectionCard from './components/SessionSelectionCard';
import CheckInScanner from './components/CheckInScanner';
import CheckInOTPDialog from './components/CheckInOTPDialog';

const CheckInPage = () => {
    const params = useParams();
    const eventId = params.eventId;
    const bottomRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventData, setEventData] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [isSessionUnlocked, setIsSessionUnlocked] = useState(false);
    const [unlockedSessionData, setUnlockedSessionData] = useState(null);
    const [showOTPDialog, setShowOTPDialog] = useState(false);
    const [checkInResult, setCheckInResult] = useState(null);

    // Fetch event and session data
    const fetchCheckInData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/events/admin/checkin/${eventId}`);

            if (response.data.success) {
                setEventData(response.data.data);
                // Auto-select current session if available
                if (response.data.data.currentSession) {
                    setSelectedSession(response.data.data.currentSession._id);
                } else if (response.data.data.availableSessions?.length > 0) {
                    // Select first available session
                    setSelectedSession(response.data.data.availableSessions[0]._id);
                }
            }
        } catch (err) {
            const errorData = err.response?.data;
            setError({
                message: errorData?.message || 'Failed to load check-in data',
                code: errorData?.error?.code,
                details: errorData?.error?.details
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchCheckInData();
        }
    }, [eventId]);

    // Auto-scroll to bottom when checkInResult changes
    useEffect(() => {
        if (checkInResult && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [checkInResult]);

    // Handle session change
    const handleSessionChange = (sessionId) => {
        setSelectedSession(sessionId);
        setIsSessionUnlocked(false);
        setUnlockedSessionData(null);
        setCheckInResult(null);
    };

    // Handle unlock session button click
    const handleUnlockSession = () => {
        setShowOTPDialog(true);
    };

    // Handle successful OTP verification
    const handleOTPSuccess = (data) => {
        console.log('OTP Success Data:', data);
        setIsSessionUnlocked(true);
        setUnlockedSessionData(data);
        setShowOTPDialog(false);
    };

    // Validate if string is a valid MongoDB ObjectId
    const isValidObjectId = (id) => {
        return /^[a-f\d]{24}$/i.test(id);
    };

    // Handle QR scan result
    const handleScanResult = useCallback(async (data) => {
        console.log('Scan Data:', data);
        console.log('Selected Session:', selectedSession);
        console.log('Unlocked Session Data:', unlockedSessionData);

        if (!data) {
            setCheckInResult({
                success: false,
                message: 'No scan data received',
                error: { details: 'Please scan a valid QR code or enter ticket code' }
            });
            return;
        }

        if (!selectedSession) {
            setCheckInResult({
                success: false,
                message: 'No session selected',
                error: { details: 'Please select a session first' }
            });
            return;
        }

        if (!unlockedSessionData) {
            setCheckInResult({
                success: false,
                message: 'Session not unlocked',
                error: { details: 'Please unlock the session first' }
            });
            return;
        }

        // Try to find the code in the unlocked session data
        const checkInCode = unlockedSessionData.code || unlockedSessionData.session?.checkInCode;

        if (!checkInCode) {
            console.error('No check-in code found in:', unlockedSessionData);
            setCheckInResult({
                success: false,
                message: 'Check-in code not found',
                error: { details: 'Session data is invalid. Please try unlocking again.' }
            });
            return;
        }

        // Check if scanned data is a valid MongoDB ObjectId
        const isObjectId = isValidObjectId(data);

        // Check if data is a valid 8-character ticket code (alphanumeric)
        const isValidTicketCode = /^[A-Z0-9]{8}$/i.test(data);

        // Validate data format before making API call
        if (!isObjectId && !isValidTicketCode) {
            setCheckInResult({
                success: false,
                message: 'Invalid ticket format',
                error: {
                    details: isObjectId === false && data.length === 24
                        ? 'Invalid participant ID format'
                        : 'Ticket code must be exactly 8 alphanumeric characters'
                }
            });
            return;
        }

        try {
            const payload = isObjectId
                ? { participantId: data }
                : { ticketCode: data };

            console.log('Making API call with:', {
                eventId,
                sessionId: selectedSession,
                code: checkInCode,
                payload,
                isObjectId,
                isValidTicketCode
            });

            const response = await api.post(
                `/events/admin/checkin/${eventId}/${selectedSession}/${checkInCode}`,
                payload
            );
            console.log('Check-in response:', response.data);
            if (response.data.success) {
                const { participant, checkIn } = response.data.data;
                setCheckInResult({
                    success: true,
                    participantName: participant.name,
                    message: checkIn.alreadyCheckedIn
                        ? 'Participant was already checked in'
                        : 'Participant checked in successfully',
                    code: response.data.code,
                    participantData: participant,
                    checkInData: checkIn
                });
            }
        } catch (err) {
            const errorData = err.response?.data;
            setCheckInResult({
                success: false,
                message: errorData?.error?.message || 'Check-in failed',
                code: errorData?.error?.code,
                error: {
                    details: errorData?.error?.details || 'An error occurred during check-in'
                }
            });
        }
    }, [eventId, selectedSession, unlockedSessionData]);

    // Handle clearing check-in result to scan next participant
    const handleClearCheckIn = useCallback(() => {
        setCheckInResult(null);
    }, []);

    // Get selected session details
    const getSelectedSessionDetails = () => {
        if (!selectedSession || !eventData) return null;
        return eventData.availableSessions?.find(s => s._id === selectedSession);
    };

    const selectedSessionDetails = getSelectedSessionDetails();

    if (loading) {
        return (
            <div className="min-h-dvh h-full w-full p-4 sm:p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="space-y-4">
                        <Skeleton className="h-8 sm:h-12 w-48 sm:w-64" />
                        <Skeleton className="h-4 w-64 sm:w-96" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <Skeleton className="h-64 w-full" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <Skeleton className="h-64 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Error state - display specific error messages
    if (error) {
        return (
            <div className="min-h-dvh h-full w-full p-4 sm:p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">Event Check-In</h1>
                    <ErrorDisplay error={error} onRetry={fetchCheckInData} />
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <div className="mx-auto space-y-2">
                {/* Event Info Banner */}
                <EventInfoBanner
                    event={eventData?.event}
                    serverTime={eventData?.serverTime}
                    checkInStatus={unlockedSessionData?.checkInStatus}
                />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Left Column: Session Selection */}
                    <div className="space-y-4 sm:space-y-6">
                        <SessionSelectionCard
                            availableSessions={eventData?.availableSessions || []}
                            currentSession={eventData?.currentSession}
                            selectedSession={selectedSession}
                            onSessionChange={handleSessionChange}
                            onUnlockSession={handleUnlockSession}
                            isSessionUnlocked={isSessionUnlocked}
                        />
                    </div>

                    {/* Right Column: Check-in Scanner */}
                    <div className="space-y-4 sm:space-y-6">
                        <CheckInScanner
                            isSessionUnlocked={isSessionUnlocked}
                            sessionTitle={selectedSessionDetails?.title}
                            onScanResult={handleScanResult}
                            checkInResult={checkInResult}
                            onClearCheckIn={handleClearCheckIn}
                        />
                    </div>
                </div>

                {/* OTP Dialog */}
                <CheckInOTPDialog
                    open={showOTPDialog}
                    onOpenChange={setShowOTPDialog}
                    eventId={eventId}
                    sessionId={selectedSession}
                    sessionTitle={selectedSessionDetails?.title}
                    onSuccess={handleOTPSuccess}
                />

                {/* Bottom reference for auto-scroll */}
                <div ref={bottomRef} className="h-1" />
            </div>
        </div>
    );
};

export default CheckInPage;
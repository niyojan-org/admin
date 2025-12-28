'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import QRScanner from '@/components/QRScanner';
import ManualTicketEntry from './ManualTicketEntry';
import { AlertCircle, CheckCircle2, XCircle, RefreshCw, Keyboard, Loader2, AlertTriangle } from 'lucide-react';

export default function CheckInScanner({
    isSessionUnlocked,
    sessionTitle,
    onScanResult,
    checkInResult,
    onClearCheckIn
}) {
    const [scannedData, setScannedData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);

    const handleScanResult = useCallback(async (data) => {
        setScannedData(data);
        setIsProcessing(true);
        await onScanResult(data);
        setIsProcessing(false);
    }, [onScanResult]);

    const handleManualEntry = useCallback(async (ticketCode) => {
        setScannedData(ticketCode);
        setIsProcessing(true);
        await onScanResult(ticketCode);
        setIsProcessing(false);
        setShowManualEntry(false);
    }, [onScanResult]);

    const handleClear = useCallback(() => {
        setScannedData(null);
        setShowManualEntry(false);
        if (onClearCheckIn) {
            onClearCheckIn();
        }
    }, [onClearCheckIn]);

    const toggleManualEntry = () => {
        setShowManualEntry(!showManualEntry);
    };

    if (!isSessionUnlocked) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Please unlock the session to start scanning
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Scanner Card */}
            <Card className={'gap-0'}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Scan Participant Ticket</CardTitle>
                            <CardDescription>
                                Scan the QR code on the participant's ticket
                            </CardDescription>
                        </div>
                        {sessionTitle && (
                            <Badge variant="outline" className="hidden sm:flex">
                                {sessionTitle}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                {!checkInResult && (
                    <CardContent className="flex flex-col items-center gap-4">
                        {/* Show either QR Scanner or Manual Entry, not both */}
                        {!showManualEntry ? (
                            <QRScanner
                                onResult={handleScanResult}
                                frameSize={300}
                                className="border-none shadow-none w-full"
                            />
                        ) : (
                            <div className="w-full text-center py-8 text-muted-foreground">
                                <Keyboard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Use manual entry below to enter ticket code</p>
                            </div>
                        )}
                        
                        {/* Toggle Manual Entry Button */}
                        <Button
                            onClick={toggleManualEntry}
                            variant={showManualEntry ? "secondary" : "outline"}
                            className="w-full gap-2"
                        >
                            <Keyboard className="w-4 h-4" />
                            {showManualEntry ? 'Switch to QR Scanner' : 'Enter Ticket Code Manually'}
                        </Button>
                    </CardContent>
                )}
            </Card>

            {/* Manual Ticket Entry */}
            {!checkInResult && showManualEntry && (
                <ManualTicketEntry 
                    onSubmit={handleManualEntry}
                    disabled={isProcessing}
                />
            )}

            {/* Loading State */}
            {isProcessing && !checkInResult && (
                <Card className="border-blue-500 bg-blue-50 dark:bg-blue-900/10">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                                    Processing Check-In...
                                </h3>
                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                                    Please wait while we verify the ticket
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Check-in Result Display */}
            {checkInResult && (
                <Card className={
                    checkInResult.success
                        ? (checkInResult.checkInData?.alreadyCheckedIn 
                            ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
                            : "border-green-500 bg-green-50 dark:bg-green-900/10")
                        : "border-red-500 bg-red-50 dark:bg-red-900/10"
                }>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                            {checkInResult.success ? (
                                checkInResult.checkInData?.alreadyCheckedIn ? (
                                    <>
                                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                                            <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-yellow-900 dark:text-yellow-100">
                                                Already Checked In
                                            </h3>
                                            {checkInResult.participantName && (
                                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                                    {checkInResult.participantName}
                                                </p>
                                            )}
                                            {checkInResult.message && (
                                                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                                                    {checkInResult.message}
                                                </p>
                                            )}
                                            {checkInResult.checkInData?.checkedInAt && (
                                                <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                                                    Previously checked in at {new Date(checkInResult.checkInData.checkedInAt).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                                            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-green-900 dark:text-green-100">
                                                Check-In Successful!
                                            </h3>
                                            {checkInResult.participantName && (
                                                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                                    {checkInResult.participantName}
                                                </p>
                                            )}
                                            {checkInResult.message && (
                                                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                                    {checkInResult.message}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )
                            ) : (
                                <>
                                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                                        <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-red-900 dark:text-red-100">
                                            Check-In Failed
                                        </h3>
                                        {checkInResult.message && (
                                            <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                                                {checkInResult.message}
                                            </p>
                                        )}
                                        {checkInResult.error?.details && (
                                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                {checkInResult.error.details}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            <Button
                                onClick={handleClear}
                                variant={
                                    checkInResult.success 
                                        ? (checkInResult.checkInData?.alreadyCheckedIn ? "secondary" : "default")
                                        : "destructive"
                                }
                                className="w-full gap-2 mt-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Scan Next Participant
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import api from '@/lib/api';

export default function CheckInOTPDialog({ 
    open, 
    onOpenChange, 
    eventId, 
    sessionId, 
    sessionTitle,
    onSuccess 
}) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [verified, setVerified] = useState(false);
    const inputRefs = useRef([]);

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter a 6-character code');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await api.get(
                `/event/admin/checkin/${eventId}/${sessionId}/${code.toUpperCase()}`
            );

            if (response.data.success) {
                setVerified(true);
                setError(null);
                
                // Wait a moment to show success, then call onSuccess
                setTimeout(() => {
                    // Include the code in the data being passed back
                    onSuccess({
                        ...response.data.data,
                        code: code.toUpperCase()
                    });
                    handleClose();
                }, 1500);
            }
        } catch (err) {
            const errorData = err.response?.data;
            setError(errorData?.message || 'Verification failed');
            setOtp(['', '', '', '', '', '']); // Clear OTP on error
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOtp(['', '', '', '', '', '']);
        setError(null);
        setVerified(false);
        setLoading(false);
        onOpenChange(false);
    };

    const handleChange = (index, value) => {
        // Only allow alphanumeric characters
        const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        if (sanitized.length > 1) {
            // Handle paste
            const chars = sanitized.slice(0, 6).split('');
            const newOtp = [...otp];
            chars.forEach((char, i) => {
                if (index + i < 6) {
                    newOtp[index + i] = char;
                }
            });
            setOtp(newOtp);
            setError(null);
            
            // Focus last filled input or next empty
            const nextIndex = Math.min(index + chars.length, 5);
            inputRefs.current[nextIndex]?.focus();
            
            // Auto-verify if complete
            if (newOtp.every(char => char !== '')) {
                setTimeout(() => handleVerify(), 300);
            }
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = sanitized;
        setOtp(newOtp);
        setError(null);

        // Move to next input if character entered
        if (sanitized && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all 6 characters entered
        if (newOtp.every(char => char !== '')) {
            setTimeout(() => handleVerify(), 300);
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const sanitized = pastedData.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const chars = sanitized.slice(0, 6).split('');
        
        const newOtp = [...otp];
        chars.forEach((char, i) => {
            if (i < 6) {
                newOtp[i] = char;
            }
        });
        setOtp(newOtp);
        setError(null);
        
        // Focus last filled input
        const lastIndex = Math.min(chars.length, 5);
        inputRefs.current[lastIndex]?.focus();

        // Auto-verify if complete
        if (newOtp.every(char => char !== '')) {
            setTimeout(() => handleVerify(), 300);
        }
    };

    // Auto-focus first input when dialog opens
    useEffect(() => {
        if (open && inputRefs.current[0]) {
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                    <DialogTitle>Enter Check-In Code</DialogTitle>
                    <DialogDescription>
                        Enter the 6-character code for <strong>{sessionTitle}</strong> to enable check-in scanning
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Custom OTP Input */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-2 justify-center">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    disabled={loading || verified}
                                    className="w-11 h-11 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold uppercase 
                                             border-2 rounded-lg
                                             transition-all duration-200
                                             focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             bg-background text-foreground
                                             border-input
                                             hover:border-ring/50"
                                    autoComplete="off"
                                />
                            ))}
                        </div>

                        <p className="text-xs text-muted-foreground text-center">
                            Enter 6-character alphanumeric code (A-Z, 0-9)
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Success Alert */}
                    {verified && (
                        <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-900/10 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertDescription>
                                Code verified! Starting check-in...
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading || verified}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleVerify}
                            disabled={otp.some(char => char === '') || loading || verified}
                            className="flex-1 gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {verified ? 'Verified' : 'Verify Code'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

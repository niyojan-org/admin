'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Keyboard, X } from 'lucide-react';

export default function ManualTicketEntry({ onSubmit, disabled }) {
    const [ticketCode, setTicketCode] = useState(['', '', '', '', '', '', '', '']);
    const inputRefs = useRef([]);

    useEffect(() => {
        // Focus first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        // Only allow uppercase letters and numbers
        const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        if (sanitized.length > 1) {
            // Handle paste or multiple characters
            const chars = sanitized.split('').slice(0, 8);
            const newTicketCode = [...ticketCode];
            
            chars.forEach((char, i) => {
                if (index + i < 8) {
                    newTicketCode[index + i] = char;
                }
            });
            
            setTicketCode(newTicketCode);
            
            // Focus the next empty box or last box
            const nextIndex = Math.min(index + chars.length, 7);
            inputRefs.current[nextIndex]?.focus();
        } else if (sanitized.length === 1) {
            const newTicketCode = [...ticketCode];
            newTicketCode[index] = sanitized;
            setTicketCode(newTicketCode);
            
            // Auto-focus next input
            if (index < 7) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (ticketCode[index] === '') {
                // Move to previous input if current is empty
                if (index > 0) {
                    inputRefs.current[index - 1]?.focus();
                }
            } else {
                // Clear current input
                const newTicketCode = [...ticketCode];
                newTicketCode[index] = '';
                setTicketCode(newTicketCode);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 7) {
            inputRefs.current[index + 1]?.focus();
        } else if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        const code = ticketCode.join('');
        if (code.length === 8) {
            onSubmit(code);
        }
    };

    const handleClear = () => {
        setTicketCode(['', '', '', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
    };

    const isComplete = ticketCode.every(char => char !== '');

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Keyboard className="w-5 h-5" />
                            Manual Entry
                        </CardTitle>
                        <CardDescription>
                            Enter 8-character ticket code
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 8 Input Boxes */}
                <div className="flex justify-center gap-2">
                    {ticketCode.map((char, index) => (
                        <Input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={char}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            disabled={disabled}
                            className="w-12 h-14 text-center text-xl font-bold uppercase"
                            placeholder="-"
                        />
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={handleClear}
                        variant="outline"
                        className="flex-1"
                        disabled={disabled || ticketCode.every(c => c === '')}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={disabled || !isComplete}
                        className="flex-1"
                    >
                        Submit
                    </Button>
                </div>

                {/* Helper Text */}
                <p className="text-xs text-muted-foreground text-center">
                    Enter ticket code or scan QR code above
                </p>
            </CardContent>
        </Card>
    );
}

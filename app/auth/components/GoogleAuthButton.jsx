'use client';

import { Button } from '@/components/ui/button';
import { IconBrandGoogle, IconLoader2 } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function GoogleAuthButton({ variant = "outline", className = "", disabled = false }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleAuth = () => {
        try {
            setIsLoading(true);
            if (!process.env.NEXT_PUBLIC_API_URL) {
                toast.error('Google authentication not available at this time.');
                setIsLoading(false);
                return;
            }
            // Direct redirect to backend Google OAuth endpoint
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';
            window.location.href = `${baseUrl}/auth/google`;
        } catch (error) {
            console.error('Google auth error:', error);
            toast.error('Failed to authenticate with Google');
            setIsLoading(false);
        }
    };

    return (
        <Button
            type="button"
            variant={variant}
            onClick={handleGoogleAuth}
            disabled={disabled || isLoading}
            className={`w-full rounded-full cursor-pointer`}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <IconLoader2 className="animate-spin" size={20} />
                    Connecting...
                </span>
            ) : (
                <span className="flex items-center justify-center gap-3">
                    <IconBrandGoogle size={20} className="text-primary" />
                    <span className="dark:text-foreground">Continue with Google</span>
                </span>
            )}
        </Button>
    );
}
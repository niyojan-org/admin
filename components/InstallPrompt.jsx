'use client';
import { useEffect } from "react";
import { useState } from "react";

function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        // Detect iOS
        setIsIOS(
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window).MSStream
        );

        // Detect Android
        setIsAndroid(/Android/.test(navigator.userAgent));

        // Check if already installed
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

        // Listen for the beforeinstallprompt event (Android)
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User response to the install prompt: ${outcome}`);

        // Clear the deferredPrompt so it can only be used once
        setDeferredPrompt(null);
    };

    if (isStandalone) {
        return null; // Don't show install button if already installed
    }

    return (
        <div>
            <h3>Install App</h3>
            {deferredPrompt && (
                <button onClick={handleInstallClick}>Add to Home Screen</button>
            )}
            {isIOS && (
                <p>
                    To install this app on your iOS device, tap the share button
                    <span role="img" aria-label="share icon">
                        {' '}
                        ⎋{' '}
                    </span>
                    and then "Add to Home Screen"
                    <span role="img" aria-label="plus icon">
                        {' '}
                        ➕{' '}
                    </span>
                    .
                </p>
            )}
            {isAndroid && !deferredPrompt && (
                <p>
                    To install this app, open the browser menu and select "Add to Home Screen" or "Install App".
                </p>
            )}
        </div>
    );
}

export default function Page() {
    return (
        <div>
            {/* <PushNotificationManager /> */}
            <InstallPrompt />
        </div>
    );
}
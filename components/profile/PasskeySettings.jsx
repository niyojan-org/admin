"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    IconKey,
    IconPlus,
    IconTrash,
    IconShieldCheck,
    IconDeviceLaptop,
    IconDeviceMobile,
    IconFingerprint,
    IconEdit,
    IconCheck,
    IconX,
    IconClock,
    IconCalendarEvent,
    IconCloud,
    IconDevices,
    IconLoader2,
    IconPasswordFingerprint,
    IconFingerprintScan,
} from "@tabler/icons-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { startRegistration } from "@simplewebauthn/browser";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PasskeyCard } from "./PasskeyCard";

export function PasskeySettings({ className }) {
    const [passkeys, setPasskeys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPasskey, setSelectedPasskey] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isUpdatingName, setIsUpdatingName] = useState(false);

    // Fetch user's passkeys
    const fetchPasskeys = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/auth/passkeys/list");
            setPasskeys(response.data.passkeys || []);
        } catch (error) {
            toast.error("Failed to load passkeys");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (dialogOpen) {
            fetchPasskeys();
        }
    }, [dialogOpen]);

    // Register a new passkey
    const handleRegisterPasskey = async () => {
        setIsRegistering(true);
        try {
            // Step 1: Get registration options from server
            const optionsResponse = await api.post("/auth/passkeys/register/options");

            // Extract the options from the response
            const { options } = optionsResponse.data;

            if (!options) {
                throw new Error("Invalid response from server: missing options");
            }

            // Step 2: Start registration with browser WebAuthn API
            const registrationResponse = await startRegistration({
                optionsJSON: options
            });

            // Step 3: Verify registration with server

            const verifyResponse = await api.post("/auth/passkeys/register/verify",
                registrationResponse
            );

            toast.success(verifyResponse.data.message || "Passkey registered successfully!");

            // Refresh the list
            await fetchPasskeys();
        } catch (error) {
            if (error.name === "NotAllowedError" || error.message?.includes("not allowed")) {
                toast.error("Registration was cancelled. Please try again and complete the authentication prompt.");
            } else if (error.name === "InvalidStateError") {
                toast.error("This passkey is already registered.");
            } else if (error.message?.includes("timed out") || error.message?.includes("timeout")) {
                toast.error("Registration timed out. Please try again and complete the prompt within 2 minutes.");
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error(error.response?.data?.message || "Failed to register passkey. Please try again.");
            }
        } finally {
            setIsRegistering(false);
        }
    };

    // Delete a passkey
    const handleDeletePasskey = async () => {
        if (!selectedPasskey) return;

        setIsDeleting(true);
        try {
            await api.delete(`/auth/passkeys/${selectedPasskey.id}`);
            toast.success("Passkey removed successfully!");
            setDeleteDialogOpen(false);
            setSelectedPasskey(null);
            await fetchPasskeys();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete passkey");
        } finally {
            setIsDeleting(false);
        }
    };

    // Update passkey name
    const handleUpdateName = async (passkeyId, newName) => {
        if (!newName.trim()) {
            toast.error("Device name cannot be empty");
            return;
        }

        setIsUpdatingName(true);
        try {
            await api.patch(`/auth/passkeys/${passkeyId}/name`, {
                name: newName.trim()
            });
            toast.success("Device name updated!");
            await fetchPasskeys();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update name");
        } finally {
            setIsUpdatingName(false);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className={cn("gap-2", className)}>
                    <IconKey className="h-4 w-4" />
                    Manage Passkeys
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className='flex gap-2'>
                    <DialogTitle className="flex items-center gap-2">
                        <IconShieldCheck className="h-5 w-5 text-primary" />
                        Passkey Management
                    </DialogTitle>
                    <DialogDescription className='flex items-center gap-2'>
                        Secure, passwordless login with your device
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {/* Info Section */}
                    <Card className="border-primary/20 bg-primary/5 p-0">
                        <CardContent className="p-4">
                            <div className="flex gap-3">
                                <div className="shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <IconFingerprint className="h-4 w-4 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p className="font-medium">What are passkeys?</p>
                                    <p className="text-muted-foreground text-xs">
                                        Log in instantly with your fingerprint, face, or device PIN. No passwords needed.{" "}
                                        <Link
                                            href="https://fidoalliance.org/passkeys"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            Learn more →
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Add Button */}
                    <Button
                        onClick={handleRegisterPasskey}
                        disabled={isRegistering}
                        className="w-full gap-2"
                        size="lg"
                    >
                        {isRegistering ? (
                            <>
                                <IconLoader2 className="h-4 w-4 animate-spin" />
                                Registering passkey...
                            </>
                        ) : (
                            <>
                                <IconFingerprintScan className="size-5" />
                                Add New Passkey
                            </>
                        )}
                    </Button>

                    <Separator />

                    {/* Passkeys List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold">Your Passkeys</h3>
                            <Badge variant="secondary">{passkeys.length}</Badge>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <IconLoader2 className="h-8 w-8 animate-spin mb-3" />
                                <p className="text-sm">Loading passkeys...</p>
                            </div>
                        ) : passkeys.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                        <IconKey className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="font-medium mb-1">No passkeys yet</p>
                                    <p className="text-sm text-muted-foreground">
                                        Add your first passkey to get started
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-2">
                                {passkeys.map((passkey) => (
                                    <PasskeyCard
                                        key={passkey.id}
                                        passkey={passkey}
                                        onDelete={(pk) => {
                                            setSelectedPasskey(pk);
                                            setDeleteDialogOpen(true);
                                        }}
                                        onUpdateName={handleUpdateName}
                                        isUpdating={isUpdatingName}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Passkey?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You won't be able to use this passkey to log in anymore. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setSelectedPasskey(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeletePasskey}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? (
                                <>
                                    <IconLoader2 className="h-4 w-4 animate-spin mr-2" />
                                    Removing...
                                </>
                            ) : (
                                "Remove Passkey"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
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
import { IconTrash, IconAlertTriangle } from "@tabler/icons-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useUserStore } from "@/store/userStore";

export function DangerZoneSection({ user }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { logout } = useUserStore();

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== "DELETE") {
            toast.error("Please type 'DELETE' to confirm account deletion.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.delete("/user/me");
            toast.success(response.data.message || "Account deleted successfully.");
            setDeleteDialogOpen(false);
            await logout();
            router.push("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getDeleteAccountMessage = () => {
        if (user?.organization) {
            const isOwner = user.organization.role === 'owner';

            if (isOwner) {
                return "As you are the owner of an organization, you cannot delete your account. Please transfer ownership or delete the organization first.";
            } else {
                return "You are part of an organization. If you delete your account, you will be removed from the organization. Your personal data will be deleted, but any events you have participated in will remain as part of the organization's records.";
            }
        }

        return "Your personal data will be permanently deleted. Note that events you have participated in will remain as part of organization records, as they are managed by event organizers.";
    };

    const canDeleteAccount = !user?.organization || user.organization.role !== 'owner';

    return (
        <>
            <Card className="border-destructive">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <IconAlertTriangle className="w-5 h-5 text-destructive" />
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    </div>
                    <CardDescription>
                        Irreversible and destructive actions
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert variant="destructive">
                        <IconAlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Deleting your account is permanent and cannot be undone. All your data will be permanently removed.
                        </AlertDescription>
                    </Alert>

                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h4 className="font-medium text-destructive">Delete Account</h4>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all associated data
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={isLoading || !canDeleteAccount}
                            className="gap-2"
                        >
                            <IconTrash className="h-4 w-4" />
                            {isLoading ? "Deleting..." : "Delete Account"}
                        </Button>
                    </div>

                    {!canDeleteAccount && user?.organization?.role === 'owner' && (
                        <Alert>
                            <IconAlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                You cannot delete your account while you are the owner of an organization. 
                                Please transfer ownership first.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Delete Account Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <IconAlertTriangle className="h-5 w-5" />
                            Delete Account
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-4">
                                <div className="text-foreground font-medium">
                                    {getDeleteAccountMessage()}
                                </div>

                                {canDeleteAccount && (
                                    <>
                                        <div className="text-sm">
                                            This action cannot be undone. Please type <span className="font-bold">DELETE</span> to confirm:
                                        </div>
                                        <Input
                                            type="text"
                                            placeholder="Type DELETE to confirm"
                                            value={deleteConfirmation}
                                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                                            className="mt-2"
                                        />
                                    </>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setDeleteConfirmation("");
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        {canDeleteAccount && (
                            <AlertDialogAction
                                onClick={handleDeleteAccount}
                                disabled={isLoading || deleteConfirmation !== "DELETE"}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isLoading ? "Deleting..." : "Delete Account"}
                            </AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

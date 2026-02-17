"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
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
  IconSettings,
  IconLogout,
  IconShield,
  IconMail,
  IconTrash,
  IconDownload,
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { PasskeySettings } from "@/components/profile/PasskeySettings";

export function AccountSettings({ user, onLogout, className }) {
  const [isLoading, setIsLoading] = useState({
    resendVerification: false,
    downloadData: false,
    deleteAccount: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const router = useRouter();

  const handleResendVerification = async () => {
    setIsLoading(prev => ({ ...prev, resendVerification: true }));
    try {

      const response = await api.post("/auth/resend-verification", { email: user.email });

      toast.success(response.data.message || "Verification email sent! Check your inbox.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, resendVerification: false }));
    }
  };

  const handleDownloadData = async () => {
    setIsLoading(prev => ({ ...prev, downloadData: true }));
    try {
      // Here you would call your API to generate and download user data
      // await downloadUserData();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success("Your data download will be ready shortly. Check your email.");
    } catch (error) {
      toast.error("Failed to initiate data download. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, downloadData: false }));
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm account deletion.");
      return;
    }

    setIsLoading(prev => ({ ...prev, deleteAccount: true }));
    try {
      // Here you would call your API to delete the account
      // await deleteAccount();

      const response = await api.delete("/user/me");

      toast.success(response.data.message || "Account deleted successfully.");
      setDeleteDialogOpen(false);
      setIsOpen(false);
      onLogout();
      router.push("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, deleteAccount: false }));
    }
  };

  // Determine the delete account message based on organization status
  const getDeleteAccountMessage = () => {
    if (user.organization) {
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

  const accountSettings = [
    {
      title: "Email Verification",
      description: "Verify your email address to secure your account",
      icon: IconMail,
      content: (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user?.isVerified ? (
              <>
                <IconCircleCheck className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Verified</span>
              </>
            ) : (
              <>
                <IconCircleX className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">Not verified</span>
              </>
            )}
          </div>
          {!user?.isVerified && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleResendVerification}
              disabled={isLoading.resendVerification}
            >
              {isLoading.resendVerification ? "Sending..." : "Resend"}
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "Two-Step Verification",
      description: "Add passkeys for secure, passwordless authentication",
      icon: IconShield,
      content: (
        <PasskeySettings />
      ),
    },
    {
      title: "Account Status",
      description: "Current status of your account",
      icon: IconShield,
      content: (
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs">Active Account</Badge>
          <Badge variant="outline" className="text-xs">User</Badge>
        </div>
      ),
    },
    // {
    //   title: "Data Export",
    //   description: "Download a copy of your account data",
    //   icon: IconDownload,
    //   content: (
    //     <Button
    //       size="sm"
    //       variant="outline"
    //       onClick={handleDownloadData}
    //       disabled={isLoading.downloadData}
    //     >
    //       {isLoading.downloadData ? "Preparing..." : "Download Data"}
    //     </Button>
    //   ),
    // },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2 cursor-pointer", className)}>
          <IconSettings className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconSettings className="h-5 w-5" />
            Account Settings
          </DialogTitle>
          <DialogDescription>
            Manage your account preferences and security settings.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Account Settings List */}
            <div className="space-y-4">
              {accountSettings.map((setting, index) => {
                const Icon = setting.icon;
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="font-medium">{setting.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                        {setting.content}
                      </div>
                    </div>
                    {index < accountSettings.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>

            <Separator />

            {/* Logout Section */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900">
                  <IconLogout className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="font-medium">Sign Out</h4>
                    <p className="text-sm text-muted-foreground">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                    className="gap-2"
                  >
                    <IconLogout className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Danger Zone */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>

              <Alert variant="destructive">
                <IconAlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Deleting your account is permanent and cannot be undone. All your data will be permanently removed.
                </AlertDescription>
              </Alert>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10">
                  <IconTrash className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={isLoading.deleteAccount}
                    className="gap-2"
                  >
                    <IconTrash className="h-4 w-4" />
                    {isLoading.deleteAccount ? "Deleting..." : "Delete Account"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>

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
                disabled={isLoading.deleteAccount || deleteConfirmation !== "DELETE"}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isLoading.deleteAccount ? "Deleting..." : "Delete Account"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
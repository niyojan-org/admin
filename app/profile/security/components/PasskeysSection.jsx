"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IconKey, IconPlus, IconLoader2 } from "@tabler/icons-react";
import { PasskeyRegister } from "./PasskeyRegister";
import { PasskeyCard } from "@/components/profile/PasskeyCard";
import { toast } from "sonner";
import api from "@/lib/api";
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

export function PasskeysSection({ onCountChange }) {
  const [passkeys, setPasskeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPasskey, setSelectedPasskey] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Fetch passkeys
  const fetchPasskeys = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/auth/passkeys/list");
      const fetchedPasskeys = response.data.passkeys || [];
      setPasskeys(fetchedPasskeys);
      onCountChange?.(fetchedPasskeys.length);
    } catch (error) {
      toast.error("Failed to load passkeys");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPasskeys();
  }, []);

  // Handle successful registration
  const handlePasskeyAdded = async () => {
    await fetchPasskeys();
    setShowRegister(false);
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
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <IconKey className="w-5 h-5" stroke={1.5} />
              Passkeys
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in quickly and securely with passkeys
            </p>
          </div>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowRegister(true)}>
            <IconPlus className="w-4 h-4" stroke={1.5} />
            Add Passkey
          </Button>
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <IconLoader2 className="h-6 w-6 animate-spin mb-2" />
              <p className="text-sm">Loading passkeys...</p>
            </div>
          ) : passkeys.length === 0 ? (
            <div className="border border-dashed rounded-md p-8 text-center">
              <IconKey className="h-8 w-8 mx-auto mb-2 text-muted-foreground" stroke={1.5} />
              <p className="font-medium mb-1">No passkeys yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first passkey to get started
              </p>
            </div>
          ) : (
            passkeys.map((passkey) => (
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
            ))
          )}
        </div>
      </div>

      <PasskeyRegister 
        open={showRegister} 
        onOpenChange={setShowRegister} 
        onSuccess={handlePasskeyAdded} 
      />

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
    </>
  );
}

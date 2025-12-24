'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconAlertTriangle } from "@tabler/icons-react";

export function DeleteFieldDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  fieldName 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconAlertTriangle className="w-5 h-5 text-destructive" />
            Delete Field
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this registration field?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="bg-destructive/10 border-destructive/20">
            <AlertDescription>
              <strong>"{fieldName}"</strong> will be permanently deleted. 
              This action cannot be undone and will affect future registrations.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
          >
            Delete Field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

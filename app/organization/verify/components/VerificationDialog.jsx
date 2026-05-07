"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IconShield,
  IconAlertCircle,
  IconInfoCircle,
  IconCheck,
  IconClock,
} from "@tabler/icons-react";

export function VerificationDialog({ onSubmit, isSubmitting }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async () => {
    await onSubmit();
    setShowConfirmDialog(false);
    setTermsAccepted(false);
  };

  return (
    <div className="space-y-6">
      {/* Terms Checkbox */}
      <div className="flex items-start gap-4 p-4 rounded-lg border-2 bg-muted/30">
        <Checkbox
          id="terms"
          onCheckedChange={setTermsAccepted}
          checked={termsAccepted}
          className="mt-1"
        />
        <label
          className="text-sm leading-relaxed cursor-pointer flex-1"
          htmlFor="terms"
        >
          I agree to the{" "}
          <a
            className="text-primary hover:underline font-medium"
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            terms and conditions
          </a>{" "}
          and confirm that all provided information is accurate and up-to-date.
        </label>
      </div>

      {/* Submit Button with Dialog */}
      <div className="flex justify-center">
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogTrigger asChild>
            <Button size="lg" className="px-8" disabled={!termsAccepted}>
              <IconShield className="w-5 h-5 mr-2" />
              Submit Verification Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <IconAlertCircle className="w-6 h-6 text-primary" />
                Confirm Verification Request
              </DialogTitle>
              <DialogDescription>
                Please review the information below before submitting your
                verification request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert>
                <IconInfoCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Ensure all details are accurate and complete</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Changes may not be possible during review</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Verification typically takes 2-3 business days</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>You'll receive email updates on your status</span>
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <IconClock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <IconCheck className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

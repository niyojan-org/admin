"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useOrganizationCreationStore,
  ORGANIZATION_STEPS,
} from "@/store/organizationCreationStore";
import api from "@/lib/api";
import {
  Building2,
  MapPin,
  Headphones,
  Link2,
  FileText,
  Landmark,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  Trash2,
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Step components
import BasicInfoStep from "./components/BasicInfoStep";
import AddressStep from "./components/AddressStep";
import SupportContactStep from "./components/SupportContactStep";
import SocialLinksStep from "./components/SocialLinksStep";
import DocumentsStep from "./components/DocumentsStep";
import BankDetailsStep from "./components/BankDetailsStep";
import ReviewStep from "./components/ReviewStep";

// Step icons mapping
const STEP_ICONS = {
  1: Building2,
  2: MapPin,
  3: Headphones,
  4: Link2,
  5: FileText,
  6: Landmark,
  7: ClipboardCheck,
};

// Step component mapping
const STEP_COMPONENTS = {
  1: BasicInfoStep,
  2: AddressStep,
  3: SupportContactStep,
  4: SocialLinksStep,
  5: DocumentsStep,
  6: BankDetailsStep,
  7: ReviewStep,
};

export default function CreateOrganizationPage() {
  const router = useRouter();
  const {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    organizationDraft,
    stepErrors,
    completedSteps,
    markStepComplete,
    isDraftSaved,
    lastSavedAt,
    hasDraft,
    saveDraft,
    clearDraft,
    editingFromReview,
    returnToReview,
    cancelEditFromReview,
    getSubmissionData,
    isSubmitting,
    setIsSubmitting,
  } = useOrganizationCreationStore();

  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Auto-save draft on changes (debounced)
  useEffect(() => {
    if (!hasDraft) return;

    const timeoutId = setTimeout(() => {
      setIsAutoSaving(true);
      saveDraft();
      setTimeout(() => setIsAutoSaving(false), 500);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [organizationDraft, hasDraft, saveDraft]);

  // Validate current step
  const validateCurrentStep = useCallback(() => {
    const errors = stepErrors[currentStep] || {};
    const draft = organizationDraft;

    switch (currentStep) {
      case 1: // Basic Info
        return !!(
          draft.name &&
          draft.email &&
          draft.phone &&
          draft.category &&
          Object.keys(errors).length === 0
        );
      case 2: // Address
        return !!(
          draft.address.locality &&
          draft.address.city &&
          draft.address.state &&
          draft.address.country &&
          draft.address.zipCode &&
          Object.keys(errors).length === 0
        );
      case 3: // Support Contact
        return !!(
          draft.supportContact.name &&
          draft.supportContact.email &&
          draft.supportContact.phone &&
          Object.keys(errors).length === 0
        );
      case 4: // Social Links
        const hasAnySocialLink = Object.values(draft.socialLinks).some(
          (v) => v && v.trim()
        );
        return hasAnySocialLink && Object.keys(errors).length === 0;
      case 5: // Documents
        return draft.documents.length > 0 && Object.keys(errors).length === 0;
      case 6: // Bank Details (optional)
        return Object.keys(errors).length === 0;
      case 7: // Review
        return true;
      default:
        return false;
    }
  }, [currentStep, stepErrors, organizationDraft]);

  // Check if all required steps are complete
  const isAllRequiredComplete = useCallback(() => {
    const draft = organizationDraft;

    const isBasicComplete = !!(draft.name && draft.email && draft.phone && draft.category);
    const isAddressComplete = !!(draft.address.locality && draft.address.city && draft.address.state && draft.address.country && draft.address.zipCode);
    const isSupportComplete = !!(draft.supportContact.name && draft.supportContact.email && draft.supportContact.phone);
    const isSocialComplete = Object.values(draft.socialLinks).some((v) => v && v.trim());
    const isDocsComplete = draft.documents.length > 0;

    return isBasicComplete && isAddressComplete && isSupportComplete && isSocialComplete && isDocsComplete;
  }, [organizationDraft]);

  // Handle next step
  const handleNext = () => {
    if (validateCurrentStep()) {
      markStepComplete(currentStep);
      nextStep();
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  // Handle previous step
  const handlePrev = () => {
    prevStep();
  };

  // Handle step click
  const handleStepClick = (step) => {
    // Allow navigation to completed steps or current step
    if (completedSteps.includes(step) || step <= currentStep) {
      setCurrentStep(step);
    }
  };

  // Handle save and return from review edit
  const handleSaveAndReturn = () => {
    if (validateCurrentStep()) {
      markStepComplete(currentStep);
      returnToReview();
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  // Handle cancel edit from review
  const handleCancelEdit = () => {
    cancelEditFromReview();
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isAllRequiredComplete()) {
      toast.error("Please complete all required fields before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = getSubmissionData();
      const response = await api.post("/organizations/admin/create", data);

      if (response.data.success) {
        toast.success("Organization created successfully!");
        clearDraft();
        router.push("/organization");
      } else {
        toast.error(response.data.message || "Failed to create organization");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to create organization";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle clear draft
  const handleClearDraft = () => {
    clearDraft();
    setShowClearDialog(false);
    toast.success("Draft cleared successfully");
  };

  // Format last saved time
  const formatLastSaved = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get current step component
  const CurrentStepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="mx-auto sm:px-4 h-full pb-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-col sm:flex-row">
          <div>
            <h1 className="text-2xl font-bold">Create Organization</h1>
            <p className="text-muted-foreground mt-1">
              Set up your organization profile to start creating events
            </p>
          </div>
          <div className="flex items-center gap-2 flex-1 w-full justify-end">
            {/* Auto-save indicator */}
            {(isAutoSaving || lastSavedAt) && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {isAutoSaving ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-3 text-primary" />
                    <span>Saved {formatLastSaved(lastSavedAt)}</span>
                  </>
                )}
              </div>
            )}

            {/* Clear Draft Button */}
            {hasDraft && (
              <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="size-4 mr-1" />
                    Clear Draft
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Draft?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your progress. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearDraft}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear Draft
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      {/* Stepper - Horizontal on desktop, simplified on mobile */}
      <div className="mb-8 hidden sm:block">
        <Stepper value={currentStep} className="w-full">
          {ORGANIZATION_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[step.id];
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;

            return (
              <StepperItem
                key={step.id}
                step={step.id}
                completed={isCompleted}
                className="flex-1"
              >
                <StepperTrigger
                  onClick={() => handleStepClick(step.id)}
                  className="flex flex-col items-center gap-2"
                  disabled={!isCompleted && step.id > currentStep}
                >
                  <StepperIndicator>
                    <Icon className="size-3" />
                  </StepperIndicator>
                  <div className="text-center">
                    <StepperTitle className="text-xs">{step.title}</StepperTitle>
                  </div>
                </StepperTrigger>
                {index < ORGANIZATION_STEPS.length - 1 && <StepperSeparator />}
              </StepperItem>
            );
          })}
        </Stepper>
      </div>

      {/* Mobile Step Indicator */}
      <div className="mb-6 sm:hidden">
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {currentStep}
            </div>
            <div>
              <p className="font-medium">{ORGANIZATION_STEPS[currentStep - 1].title}</p>
              <p className="text-xs text-muted-foreground">
                Step {currentStep} of {ORGANIZATION_STEPS.length}
              </p>
            </div>
          </div>
          <Badge variant={validateCurrentStep() ? "default" : "secondary"}>
            {validateCurrentStep() ? "Complete" : "In Progress"}
          </Badge>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6">
        <CurrentStepComponent />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t">
        <div>
          {currentStep > 1 && !editingFromReview && (
            <Button variant="outline" onClick={handlePrev}>
              <ChevronLeft className="size-4 mr-1" />
              Previous
            </Button>
          )}
          {editingFromReview && (
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {editingFromReview ? (
            <Button onClick={handleSaveAndReturn}>
              <Save className="size-4 mr-1" />
              Save & Return to Review
            </Button>
          ) : currentStep === ORGANIZATION_STEPS.length ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isAllRequiredComplete()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-1 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-1" />
                  Create Organization
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="size-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      {/* <div className="mt-6 pt-4 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{Math.round((completedSteps.length / (ORGANIZATION_STEPS.length - 1)) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${(completedSteps.length / (ORGANIZATION_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div> */}
    </div>
  );
}
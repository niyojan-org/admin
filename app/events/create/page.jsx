"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  IconCheck, IconChevronRight, IconDeviceFloppy,
  IconRocket, IconInfoCircle, IconCalendar, IconTicket,
  IconForms, IconDiscount, IconEye
} from "@tabler/icons-react";
import { Progress } from "@/components/ui/progress";
import { useEventForm } from "./hooks/useEventForm";
import { useEventStore } from "@/store/eventStore";
import { useOrgStore } from "@/store/orgStore";

// Import step components
import BasicInfoStep from "./components/BasicInfoStep";
import SessionsStep from "./components/SessionsStep";
import TicketsStep from "./components/TicketsStep";
import CustomFieldsStep from "./components/CustomFieldsStep";
import CouponsStep from "./components/CouponsStep";
import ReviewStep from "./components/ReviewStep";

const steps = [
  {
    id: 0,
    key: "basic-info",
    title: "Basic Info",
    description: "Event information and settings",
    icon: IconInfoCircle,
    component: BasicInfoStep,
  },
  {
    id: 1,
    key: "sessions",
    title: "Sessions",
    description: "Event sessions and schedule",
    icon: IconCalendar,
    component: SessionsStep,
  },
  {
    id: 2,
    key: "tickets",
    title: "Tickets",
    description: "Ticket types and pricing",
    icon: IconTicket,
    component: TicketsStep,
  },
  {
    id: 3,
    key: "custom-fields",
    title: "Custom Fields",
    description: "Additional registration fields",
    icon: IconForms,
    component: CustomFieldsStep,
  },
  {
    id: 4,
    key: "coupons",
    title: "Coupons",
    description: "Discount codes and promotions",
    icon: IconDiscount,
    component: CouponsStep,
  },
  {
    id: 5,
    key: "review",
    title: "Review",
    description: "Review and publish event",
    icon: IconEye,
    component: ReviewStep,
  },
];

export default function CreateEventPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { organization } = useOrgStore();
  const { createEvent } = useEventStore();
  const {
    eventDraft,
    updateField,
    saveDraft,
    clearDraft,
    hasUnsavedChanges,
    validateDraft,
    lastSavedAt,
    isDraftSaved,
  } = useEventForm();

  // Prevent hydration mismatch by only showing draft-dependent UI after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set organization ID when component mounts
  useEffect(() => {
    if (organization?._id && !eventDraft.organizationId) {
      updateField("organizationId", organization._id);
    }
  }, [organization, eventDraft.organizationId, updateField]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveDraft = () => {
    saveDraft();
  };

  const handleSubmit = async () => {
    const validation = validateDraft();

    if (!validation.isValid) {
      toast.error("Please fix all errors before publishing");
      validation.errors.forEach((error) => {
        toast.error(error, { duration: 5000 });
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create event using the event store
      console.log(eventDraft)
      console.log("All good")
      const createdEvent = await createEvent(eventDraft);

      if (createdEvent) {
        toast.success("Event created successfully!");
        clearDraft();
        router.push(`/events/${createdEvent._id}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="container max-w-6xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
            <p className="text-muted-foreground">
              Set up your event in {steps.length} simple steps
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={!isMounted || !hasUnsavedChanges}
              className="gap-2"
            >
              <IconDeviceFloppy className="w-4 h-4" />
              {isDraftSaved ? "Saved" : "Save Draft"}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {lastSavedAt && (
          <p className="text-xs text-muted-foreground">
            Last saved: {new Date(lastSavedAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* Step Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = currentStep === step.id;
          const isAccessible = step.id <= currentStep || completedSteps.has(step.id);

          return (
            <button
              key={step.id}
              onClick={() => isAccessible && handleStepClick(step.id)}
              disabled={!isAccessible}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all",
                isCurrent && "border-primary bg-primary/5 shadow-sm",
                isCompleted && !isCurrent && "border-green-500/50 bg-green-500/5",
                !isCurrent && !isCompleted && "border-border hover:border-primary/50",
                !isAccessible && "opacity-50 cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                  isCurrent && "bg-primary text-primary-foreground",
                  isCompleted && !isCurrent && "bg-green-500 text-white",
                  !isCurrent && !isCompleted && "bg-muted"
                )}
              >
                {isCompleted && !isCurrent ? (
                  <IconCheck className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="text-center">
                <p className={cn(
                  "text-xs font-medium",
                  isCurrent && "text-primary"
                )}>
                  {step.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Step Description */}
      <div className="bg-muted/50 rounded-lg p-4 border">
        <div className="flex items-start gap-3">
          {React.createElement(steps[currentStep].icon, {
            className: "w-5 h-5 text-primary mt-0.5"
          })}
          <div>
            <h3 className="font-semibold">{steps[currentStep].title}</h3>
            <p className="text-sm text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        <CurrentStepComponent />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="gap-2"
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !validateDraft().isValid}
              className="gap-2"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Event...
                </>
              ) : (
                <>
                  <IconRocket className="w-5 h-5" />
                  Publish Event
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="gap-2"
            >
              Next Step
              <IconChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

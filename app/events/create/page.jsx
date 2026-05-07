"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  IconCheck,
  IconChevronRight,
  IconDeviceFloppy,
  IconRocket,
  IconInfoCircle,
  IconCalendar,
  IconTicket,
  IconForms,
  IconDiscount,
  IconEye,
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
    const stepValidation = validateStep(currentStep, true);

    if (!stepValidation.isValid) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
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
    if (stepId > currentStep) {
      const stepValidation = validateStep(currentStep, true);
      if (!stepValidation.isValid) {
        return;
      }
    }

    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateStep = (stepId, showToast = false) => {
    const errors = [];
    const isVenueRequired = ["hybrid", "offline"].includes(eventDraft.mode);

    if (stepId === 0) {
      if (!eventDraft.title?.trim()) {
        errors.push("Event title is required");
      }
      if (!eventDraft.description?.trim()) {
        errors.push("Event description is required");
      }
      if (!eventDraft.category?.trim()) {
        errors.push("Event category is required");
      }
      if (!eventDraft.mode?.trim()) {
        errors.push("Event mode is required");
      }
      if (!eventDraft.registrationStart) {
        errors.push("Registration start date is required");
      }
      if (!eventDraft.registrationEnd) {
        errors.push("Registration end date is required");
      }
      if (
        eventDraft.registrationStart &&
        eventDraft.registrationEnd &&
        new Date(eventDraft.registrationStart) >=
          new Date(eventDraft.registrationEnd)
      ) {
        errors.push("Registration end date must be after start date");
      }
    }

    if (stepId === 1) {
      if (eventDraft.sessions.length === 0) {
        errors.push("Add at least one session");
      }

      eventDraft.sessions.forEach((session, index) => {
        if (!session.title?.trim()) {
          errors.push(`Session ${index + 1}: title is required`);
        }
        if (!session.startTime) {
          errors.push(`Session ${index + 1}: start time is required`);
        }
        if (!session.endTime) {
          errors.push(`Session ${index + 1}: end time is required`);
        }
        if (
          session.startTime &&
          session.endTime &&
          new Date(session.startTime) >= new Date(session.endTime)
        ) {
          errors.push(
            `Session ${index + 1}: end time must be after start time`,
          );
        }
        if (isVenueRequired && !session.venue?.name?.trim()) {
          errors.push(
            `Session ${index + 1}: venue name is required for ${eventDraft.mode} events`,
          );
        }
      });
    }

    if (stepId === 2) {
      if (eventDraft.tickets.length === 0) {
        errors.push("Add at least one ticket type");
      }

      eventDraft.tickets.forEach((ticket, index) => {
        if (!ticket.type?.trim()) {
          errors.push(`Ticket ${index + 1}: type is required`);
        }
        if ((ticket.price ?? 0) < 0) {
          errors.push(`Ticket ${index + 1}: price cannot be negative`);
        }
        if ((ticket.capacity ?? 0) <= 0) {
          errors.push(`Ticket ${index + 1}: capacity must be greater than 0`);
        }
        if (ticket.isGroupTicket) {
          const minParticipants = ticket.groupSettings?.minParticipants ?? 2;
          const maxParticipants = ticket.groupSettings?.maxParticipants ?? 10;
          if (minParticipants < 2) {
            errors.push(
              `Ticket ${index + 1}: minimum group participants must be at least 2`,
            );
          }
          if (maxParticipants < minParticipants) {
            errors.push(
              `Ticket ${index + 1}: maximum group participants must be greater than or equal to minimum`,
            );
          }
        }
      });
    }

    if (stepId === 3) {
      eventDraft.customFields.forEach((field, index) => {
        if (!field.label?.trim()) {
          errors.push(`Custom field ${index + 1}: label is required`);
        }
        if (!field.name?.trim()) {
          errors.push(`Custom field ${index + 1}: name is required`);
        }
        if (!field.type?.trim()) {
          errors.push(`Custom field ${index + 1}: type is required`);
        }

        const needsOptions = ["dropdown", "radio", "checkbox"].includes(
          field.type,
        );
        if (needsOptions) {
          if (!field.options || field.options.length === 0) {
            errors.push(`Custom field ${index + 1}: add at least one option`);
          } else {
            field.options.forEach((option, optionIndex) => {
              if (!option.label?.trim() || !option.value?.trim()) {
                errors.push(
                  `Custom field ${index + 1}, option ${optionIndex + 1}: label and value are required`,
                );
              }
            });
          }
        }
      });
    }

    if (stepId === 4 && eventDraft.allowCoupons) {
      eventDraft.coupons.forEach((coupon, index) => {
        const code = (coupon.code || "").trim();
        if (!code) {
          errors.push(`Coupon ${index + 1}: code is required`);
        } else if (!/^[A-Z0-9]{5,}$/.test(code)) {
          errors.push(
            `Coupon ${index + 1}: code must be at least 5 uppercase alphanumeric characters`,
          );
        }

        if ((coupon.discountValue ?? 0) <= 0) {
          errors.push(
            `Coupon ${index + 1}: discount value must be greater than 0`,
          );
        }

        if (
          coupon.discountType === "percentage" &&
          (coupon.discountValue ?? 0) > 100
        ) {
          errors.push(
            `Coupon ${index + 1}: percentage discount cannot exceed 100`,
          );
        }

        if ((coupon.maxUsage ?? 0) < 0) {
          errors.push(`Coupon ${index + 1}: max usage cannot be negative`);
        }

        if (
          coupon.startsAt &&
          coupon.endsAt &&
          new Date(coupon.startsAt) >= new Date(coupon.endsAt)
        ) {
          errors.push(
            `Coupon ${index + 1}: valid until must be after valid from`,
          );
        }
      });
    }

    if (showToast && errors.length > 0) {
      toast.error("Complete required fields before moving to the next step");
      errors.slice(0, 3).forEach((error) => {
        toast.error(error, { duration: 5000 });
      });
      if (errors.length > 3) {
        toast.error(`And ${errors.length - 3} more issue(s)`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
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
      const createdEvent = await createEvent(eventDraft);
      if (createdEvent) {
        // toast.success("Event created successfully!");
        clearDraft();
        router.replace(`/events/${createdEvent.slug}`);
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
  const canProceedToNext = validateStep(currentStep).isValid;

  return (
    <div className="container max-w-6xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Event
            </h1>
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
          const isAccessible =
            step.id <= currentStep || completedSteps.has(step.id);

          return (
            <button
              key={step.id}
              onClick={() => isAccessible && handleStepClick(step.id)}
              disabled={!isAccessible}
              className={cn(
                "relative flex sm:flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all",
                isCurrent && "border-primary bg-primary/5 shadow-sm",
                isCompleted &&
                  !isCurrent &&
                  "border-green-500/50 bg-green-500/5",
                !isCurrent &&
                  !isCompleted &&
                  "border-border hover:border-primary/50",
                !isAccessible && "opacity-50 cursor-not-allowed",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                  isCurrent && "bg-primary text-primary-foreground",
                  isCompleted && !isCurrent && "bg-green-500 text-white",
                  !isCurrent && !isCompleted && "bg-muted",
                )}
              >
                {isCompleted && !isCurrent ? (
                  <IconCheck className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-xs font-medium",
                    isCurrent && "text-primary",
                  )}
                >
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
            className: "w-5 h-5 text-primary mt-0.5",
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
      <div className="min-h-100">
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
                  Draft an Event
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="gap-2"
              disabled={!canProceedToNext}
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

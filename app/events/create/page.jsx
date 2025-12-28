"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/eventStore";
import { useRouter } from "next/navigation";
import { CheckCircle, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Step Components
import BasicDetailsStep from "./steps/BasicDetailsStep";
import SessionsStep from "./steps/SessionsStep";
import TicketsStep from "./steps/TicketsStep";
import CustomFieldsStep from "./steps/CustomFieldsStep";
import { IconCircleCheck, IconCurrentLocation, IconLock, IconLockOpen2, IconSquareRoundedCheck } from "@tabler/icons-react";
import GuestStep from "./steps/GuestStep";
import BenefitsStep from "./steps/BenefitsStep";

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent, loading: storeLoading } = useEventStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [visitedSteps, setVisitedSteps] = useState(new Set([0])); // Track visited steps, start with step 0

  // Step configuration
  const steps = [
    {
      key: "basicDetails",
      label: "Basic Details",
      required: true,
      description: "Event information and details"
    },
    {
      key: "sessions",
      label: "Sessions",
      required: false,
      description: "Event sessions and schedule"
    },
    {
      key: "tickets",
      label: "Tickets",
      required: false,
      description: "Ticket types and pricing"
    },
    {
      key: "customFields",
      label: "Custom Fields",
      required: false,
      description: "Additional registration fields"
    },
    {
      key: "guest",
      label: "Guest List",
      required: false,
      description: "Manage your event guest list"
    },
    {
      key: "benefits",
      label: "Benefits",
      required: false,
      description: "Add benefits for your event attendees"
    }
  ];

  // Check if a step is accessible
  const isStepAccessible = (stepIndex) => {
    if (stepIndex === 0) return true; // Basic details always accessible
    return event && event._id; // Other steps require event to be created
  };

  // Check if a step is completed
  const isStepCompleted = (stepIndex) => {
    return completedSteps.has(stepIndex);
  };

  // Check if a step has been visited
  const isStepVisited = (stepIndex) => {
    return visitedSteps.has(stepIndex);
  };

  // Handle step completion (called from BasicDetailsStep when event is created)
  const handleStepComplete = (stepIndex) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
  };

  // Handle step click
  const handleStepClick = (stepIndex) => {
    if (!isStepAccessible(stepIndex)) {
      toast.error("Please complete Basic Details first to access this step");
      return;
    }

    // Mark step as visited
    setVisitedSteps(prev => new Set([...prev, stepIndex]));
    setCurrentStep(stepIndex);
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      if (isStepAccessible(nextStep)) {
        // Mark next step as visited
        setVisitedSteps(prev => new Set([...prev, nextStep]));
        setCurrentStep(nextStep);
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      // Mark previous step as visited (it should already be visited, but ensure it)
      setVisitedSteps(prev => new Set([...prev, prevStep]));
      setCurrentStep(prevStep);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Final submission logic here
      toast.success("Event created successfully!");
      router.push(`/events/${event._id}`);
    } catch (error) {
      toast.error("Failed to create event");
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto justify-between flex flex-col w-full h-full">
      {/* Header */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-navy">Create New Event</h1>
        <p className="text-gray-600">
          Fill the details below to create your event and start accepting registrations
        </p>
      </div>

      {/* Progress Steps */}
      <div className="">
        <div className="flex flex-wrap gap-2 mb-4">
          {steps.map((step, index) => {
            const isAccessible = isStepAccessible(index);
            const isCompleted = isStepCompleted(index);
            const isVisited = isStepVisited(index);
            const isCurrent = index === currentStep;
            const isBasicStepCompleted = isStepCompleted(0);

            // Determine button variant
            let variant = "outline";
            if (isCurrent) {
              variant = "default";
            } else if (isCompleted) {
              variant = "secondary";
            } else if (isVisited && isBasicStepCompleted && index > 0) {
              variant = "secondary";
            }

            return (
              <Button
                key={step.key}
                onClick={() => handleStepClick(index)}
                disabled={!isAccessible}
                variant={variant}
                className={cn(
                  "flex transition-all",
                  !isAccessible && "opacity-50 cursor-not-allowed",
                  isCurrent && "ring-2 ring-primary ring-offset-2",
                  isVisited && !isCurrent && !isCompleted && isBasicStepCompleted && index > 0 && "bg-secondary/50"
                )}
              >
                <span className="flex items-center gap-2">
                  {!isAccessible ? (
                    <IconLock className="w-4 h-4" />
                  ) : isCompleted ? (
                    <IconCircleCheck className="w-4 h-4" />
                  ) : isVisited ? (
                    <IconSquareRoundedCheck className="w-4 h-4" />
                  ) : (
                    <IconLockOpen2 className="w-4 h-4" />
                  )}
                  <span>{index + 1}. {step.label}</span>
                  {step.required && <span className="text-red-500">*</span>}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Current step description */}
        <p className="text-sm text-gray-500">
          {steps[currentStep].description}
        </p>
      </div>

      {/* Form Content */}
      <div className="flex-1">
        {/* Step 0: Basic Details */}
        {currentStep === 0 && (
          <BasicDetailsStep
            event={event}
            setEvent={(eventData) => {
              setEvent(eventData);
              console.log(eventData);
              if (eventData && eventData._id) {
                handleStepComplete(0);
                // Mark next step as visited when automatically moving to it
                setVisitedSteps(prev => new Set([...prev, 1]));
                setCurrentStep(1); // Move to next step automatically
              }
            }}
          />
        )}

        {/* Step 1: Sessions */}
        {currentStep === 1 && (
          <SessionsStep
            event={event}
            setEvent={setEvent}
            onComplete={() => handleStepComplete(1)}
          />
        )}

        {/* Step 2: Tickets */}
        {currentStep === 2 && (
          <TicketsStep
            event={event}
            setEvent={setEvent}
            onComplete={() => handleStepComplete(2)}
          />
        )}

        {/* Step 3: Custom Fields */}
        {currentStep === 3 && (
          <CustomFieldsStep
            event={event}
            setEvent={setEvent}
            onComplete={() => handleStepComplete(3)}
          />
        )}

        {/* Step 4: Guest List */}
        {currentStep === 4 && (
          <GuestStep event={event} setEvent={setEvent} onComplete={() => handleStepComplete(4)} />
        )}

        {/* Step 5: Benefits */}
        {currentStep === 5 && (
          <BenefitsStep
            event={event}
            setEvent={setEvent}
            onComplete={() => handleStepComplete(5)}
          />
        )}
      </div>

      {/* Navigation Controls */}
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepAccessible(currentStep + 1)}
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !event || !event._id}
            >
              {loading ? "Creating..." : "Complete Event Creation"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

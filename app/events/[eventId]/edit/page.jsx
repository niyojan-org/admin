"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import steps from "./steps";

// Step Components (reuse from create)
import BasicInfoStep from "../../create/components/BasicInfoStep";
import SessionsStep from "../../create/components/SessionsStep";
import TicketsStep from "../../create/components/TicketsStep";
import CustomFieldsStep from "../../create/components/CustomFieldsStep";
import api from "@/lib/api";
import { toast } from "sonner";
import { RegistrationDashboard } from "../components-old/registration";
import { Spinner } from "@/components/ui/spinner";
import Coupons from "../components-old/Coupons";

const getStepIndex = (stepKey) => {
  const stepIndex = steps.findIndex((item) => item.key === stepKey);
  return stepIndex >= 0 ? stepIndex : 0;
};

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params.eventId;

  const [step, setStep] = useState(() => getStepIndex(searchParams.get("step")));
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  // Load existing event data
  useEffect(() => {
    const loadEventData = async () => {
      if (eventId && !initialDataLoaded) {
        try {
          const response = await api.get("/events/admin/" + eventId + "/edit");
          setCurrentEvent(response.data.data.event);
          setInitialDataLoaded(true);
        } catch (error) {
          toast.error("Failed to load event data.");
        }
      }
    };
    loadEventData();
  }, [eventId, initialDataLoaded, router]);

  useEffect(() => {
    setStep(getStepIndex(searchParams.get("step")));
  }, [searchParams]);

  const goToStep = (stepIndex) => {
    // Validate current step before moving
    if (stepIndex > step && steps[step]?.validate && !steps[step].validate()) {
      return;
    }
    setStep(stepIndex);
  };

  const goNext = () => {
    if (step < steps.length - 1) {
      goToStep(step + 1);
    } else {
      router.push(`/events/${eventId}`); // Go to event management page after last step
    }
  };

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Show loading while fetching event data
  if (!initialDataLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  // Show error if event not found
  if (initialDataLoaded && !currentEvent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">
          Event not found or you don't have permission to edit it.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto justify-between min-h-dvh px-2 flex flex-col py-5">
      {/* Header */}
      <div className="mb-1 flex flex-col">
        <h1 className="text-2xl font-bold text-navy">Edit Event</h1>
        <p className="text-gray">Update your event details</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-2 flex flex-wrap gap-2">
        {steps.map((s, index) => (
          <Button
            key={s.key}
            onClick={() => goToStep(index)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              index === step ? "text-white bg-accent" : index < step ? "" : ""
            }`}
          >
            {index + 1}. {s.label}
          </Button>
        ))}
      </div>

      {/* Form Content */}
      <>
        {/* Step 0: Basic Details */}
        {step === 0 && <BasicInfoStep eventId={eventId} onNext={goNext} />}

        {/* Step 1: Registration Details */}
        {step === 1 && <RegistrationDashboard eventId={eventId} />}

        {/* Step 2: Sessions */}
        {step === 2 && <SessionsStep event={{ _id: eventId }} />}

        {/* Step 3: Tickets */}
        {step === 3 && <TicketsStep event={{ _id: eventId }} />}

        {step === 4 && <CustomFieldsStep event={{ _id: eventId }} />}

        {/* Step 5: Coupons */}
        {step === 5 && <Coupons eventId={eventId} />}
      </>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-3 border-t">
        <Button
          onClick={goBack}
          variant="outline"
          className="cursor-pointer"
          disabled={step === 0}
        >
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/events")}
            variant="ghost"
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button onClick={goNext} className="cursor-pointer">
            {step === steps.length - 1 ? "Update Event" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

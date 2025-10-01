"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/eventStore";
import { useRouter } from "next/navigation";
import { useEventForm } from "./hooks/useEventForm";
import {
  EVENT_CATEGORIES,
  EVENT_TYPES,
  EVENT_MODES,
  FIELD_TYPES,
} from "./constants/eventConstants";

// Step Components
import BasicDetailsStep from "./steps/BasicDetailsStep";
import RegistrationStep from "./steps/RegistrationStep";
import SessionsStep from "./steps/SessionsStep";
import TicketsStep from "./steps/TicketsStep";
import CustomFieldsStep from "./steps/CustomFieldsStep";
import SettingsStep from "./steps/SettingsStep";

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent, loading: storeLoading } = useEventStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Use the custom hook for event form management
  const {
    eventData,
    setEventData,
    handleInputChange,
    // Session methods
    addSession,
    updateSession,
    updateSessionVenue,
    removeSession,
    // Ticket methods
    addTicket,
    updateTicket,
    removeTicket,
    // Input field methods
    addInputField,
    updateInputField,
    addFieldOption,
    removeFieldOption,
    removeInputField,
    // Validation methods
    validateBasicDetails,
    validateRegistration,
    validateSessions,
    validateTickets,
  } = useEventForm();

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all sections
    if (
      !validateBasicDetails() ||
      !validateRegistration() ||
      !validateSessions() ||
      !validateTickets()
    ) {
      return;
    }

    setLoading(true);
    try {
      // Prepare event data
      const formattedEventData = {
        ...eventData,
        registrationStart: new Date(eventData.registrationStart).toISOString(),
        registrationEnd: new Date(eventData.registrationEnd).toISOString(),
        sessions: eventData.sessions.map((session) => ({
          ...session,
          startTime: new Date(session.startTime).toISOString(),
          endTime: new Date(session.endTime).toISOString(),
        })),
      };

      // Submit event data using store
      const createdEvent = await createEvent(formattedEventData);

      if (createdEvent) {
        router.push("/event");
      }
    } catch (error) {
      console.error("Event creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Step configuration
  const steps = [
    {
      key: "basicDetails",
      label: "Basic Details",
      validate: validateBasicDetails,
    },
    {
      key: "registration",
      label: "Registration",
      validate: validateRegistration,
    },
    {
      key: "sessions",
      label: "Sessions",
      validate: validateSessions,
    },
    {
      key: "tickets",
      label: "Tickets",
      validate: validateTickets,
    },
    {
      key: "customFields",
      label: "Custom Fields",
      validate: () => true,
    },
    {
      key: "settings",
      label: "Settings",
      validate: () => true,
    },
  ];

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
      handleSubmit();
    }
  };

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="mx-auto px-10 justify-between min-h-screen pr-20 flex flex-col py-5 ">
      {/* Header */}
      <div className="mb-1 flex flex-col">
        <h1 className="text-2xl font-bold text-navy">Create New Event</h1>
        <p className="text-gray">
          Fill in the details below to create your event and start accepting registrations
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-2 flex flex-wrap gap-2">
        {steps.map((s, index) => (
          <Button
            key={s.key}
            onClick={() => goToStep(index)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${index === step ? "" : index < step ? " text-accent" : "  "
              }`}
          >
            {index + 1}. {s.label}
          </Button>
        ))}
      </div>
      {/* Form Content */}
      <>
        {/* Step 0: Basic Details */}
        {step === 0 && (
          <BasicDetailsStep eventData={eventData} handleInputChange={handleInputChange} />
        )}

        {/* Step 1: Registration Details */}
        {step === 1 && (
          <RegistrationStep
            eventData={eventData}
            handleInputChange={handleInputChange}
            eventCategories={EVENT_CATEGORIES}
            eventTypes={EVENT_TYPES}
            eventModes={EVENT_MODES}
          />
        )}

        {/* Step 2: Sessions */}
        {step === 2 && (
          <SessionsStep
            eventData={eventData}
            updateSession={updateSession}
            updateSessionVenue={updateSessionVenue}
            addSession={addSession}
            removeSession={removeSession}
          />
        )}

        {/* Step 3: Tickets */}
        {step === 3 && (
          <TicketsStep
            eventData={eventData}
            updateTicket={updateTicket}
            addTicket={addTicket}
            removeTicket={removeTicket}
          />
        )}

        {/* Step 4: Custom Input Fields */}
        {step === 4 && (
          <CustomFieldsStep
            eventData={eventData}
            fieldTypes={FIELD_TYPES}
            addInputField={addInputField}
            updateInputField={updateInputField}
            removeInputField={removeInputField}
            addFieldOption={addFieldOption}
            removeFieldOption={removeFieldOption}
          />
        )}

        {/* Step 5: Event Settings */}
        {step === 5 && <SettingsStep eventData={eventData} handleInputChange={handleInputChange} />}
      </>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-3">
        <Button
          onClick={goBack}
          variant="outline"
          className={"cursor-pointer"}
          disabled={step === 0}
        >
          Back
        </Button>

        <Button
          onClick={goNext}
          disabled={loading || storeLoading}
          className="cursor-pointer"
        >
          {loading || storeLoading
            ? "Creating..."
            : step === steps.length - 1
              ? "Create Event"
              : "Next"}
        </Button>
      </div>
    </div>
  );
}

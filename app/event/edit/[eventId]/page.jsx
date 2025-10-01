"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { useEventForm } from "../../create/hooks/useEventForm";
import {
  EVENT_CATEGORIES,
  EVENT_TYPES,
  EVENT_MODES,
  FIELD_TYPES,
} from "../../create/constants/eventConstants";

// Step Components (reuse from create)
import BasicDetailsStep from "../../create/steps/BasicDetailsStep";
import RegistrationStep from "../../create/steps/RegistrationStep";
import SessionsStep from "../../create/steps/SessionsStep";
import TicketsStep from "../../create/steps/TicketsStep";
import CustomFieldsStep from "../../create/steps/CustomFieldsStep";
import SettingsStep from "../../create/steps/SettingsStep";

// New Coupon Management Component
import CouponManagementStep from "./steps/CouponManagementStep";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { IconBan } from "@tabler/icons-react";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.eventId;

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [allowedField, setAllowedField] = useState(null);

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

  // Load existing event data
  useEffect(() => {
    const loadEventData = async () => {
      if (eventId && !initialDataLoaded) {
        try {
          const response = await api.get("/event/admin/" + eventId + "/edit");
          setCurrentEvent(response.data.data.event);
          setAllowedField(response.data.data.editPermissions.editable);
          setInitialDataLoaded(true);
        } catch (error) {
          toast.error("Failed to load event data.");
        }
      }
    };
    loadEventData();
  }, [eventId, initialDataLoaded, router]);

  // Populate form data when current event is loaded
  useEffect(() => {
    if (currentEvent && initialDataLoaded) {
      // Transform backend data to form format
      const transformedData = {
        title: currentEvent.title || "",
        description: currentEvent.description || "",
        bannerImage: currentEvent.bannerImage || "",
        tags: currentEvent.tags || [],
        category: currentEvent.category || "",
        type: currentEvent.type || "",
        mode: currentEvent.mode || "online",
        registrationStart: currentEvent.registrationStart || "",
        registrationEnd: currentEvent.registrationEnd || "",
        sessions:
          currentEvent.sessions?.map((session) => ({
            id: session._id || Math.random().toString(36).substr(2, 9),
            title: session.title || "",
            description: session.description || "",
            startTime: session.startTime || "",
            endTime: session.endTime || "",
            venue: session.venue || {
              name: "",
              address: "",
              city: "",
              state: "",
              country: "",
              zipCode: "",
            },
          })) || [],
        tickets:
          currentEvent.tickets?.map((ticket) => ({
            id: ticket._id || Math.random().toString(36).substr(2, 9),
            type: ticket.type || "",
            price: ticket.price || 0,
            capacity: ticket.capacity || 1,
            sold: ticket.sold || 0,
            templateUrl: ticket.templateUrl || "",
          })) || [],
        inputFields:
          currentEvent.inputFields?.map((field) => ({
            id: field._id || Math.random().toString(36).substr(2, 9),
            label: field.label || "",
            name: field.name || "",
            type: field.type || "text",
            required: field.required || false,
            options: field.options || [],
          })) || [],
        coupons:
          currentEvent.coupons?.map((coupon) => ({
            id: coupon._id || Math.random().toString(36).substr(2, 9),
            code: coupon.code || "",
            discountType: coupon.discountType || "percent",
            discountValue: coupon.discountValue || 0,
            maxUsage: coupon.maxUsage || 1,
            usedCount: coupon.usedCount || 0,
            expiresAt: coupon.expiresAt || "",
            isActive: coupon.isActive !== false,
          })) || [],
        // Settings
        isPrivate: currentEvent.isPrivate || false,
        allowMultipleSessions: currentEvent.allowMultipleSessions !== false,
        allowCoupons: currentEvent.allowCoupons !== false,
        autoApproveParticipants: currentEvent.autoApproveParticipants !== false,
        enableEmailNotifications: currentEvent.enableEmailNotifications !== false,
        enableSmsNotifications: currentEvent.enableSmsNotifications || false,
        feedbackEnabled: currentEvent.feedbackEnabled || false,
      };

      setEventData(transformedData);
    }
  }, [currentEvent, initialDataLoaded, setEventData]);

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Submit event data using store
      const response = await api.put(`/event/admin/${eventId}`, eventData);

      if (response.data) {
        router.push("/event");
      }
    } catch (error) {
      console.error("Event update error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Step configuration - now includes coupon management
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
      key: "coupons",
      label: "Coupons",
      validate: () => true,
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

  // Show loading while fetching event data
  if (!initialDataLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading event data...</div>
      </div>
    );
  }

  // Show error if event not found
  if (initialDataLoaded && !currentEvent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Event not found or you don't have permission to edit it.</div>
      </div>
    );
  }

  if (currentEvent.isPublished) {
    return (
      <Card className="flex flex-col items-center justify-center h-64 max-w-md mx-auto gap-4 p-8 text-center">
        <IconBan size={48} className="text-destructive mb-2" />
        <div className="font-semibold text-lg text-destructive">Event is published and cannot be edited.</div>
        <div className="text-muted-foreground mb-4">You can manage this event from the event management page.</div>
        <Button
          variant="default"
          className="mt-2"
          onClick={() => router.push(`/event/${currentEvent._id}`)}
        >
          Go to Manage Event
        </Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto justify-between min-h-screen px-2 flex flex-col py-5">
      {/* Header */}
      <div className="mb-1 flex flex-col">
        <h1 className="text-2xl font-bold text-navy">Edit Event</h1>
        <p className="text-gray">Update your event details and manage coupons</p>
        {currentEvent && (
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Event: <span className="font-semibold text-foreground">{currentEvent.title}</span>
            </span>
            <Badge
              variant={
                currentEvent.status === "published"
                  ? "success"
                  : currentEvent.status === "draft"
                    ? "secondary"
                    : "destructive"
              }
              className="text-xs px-2 py-1 rounded-full"
            >
              {currentEvent.status?.toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-2 flex flex-wrap gap-2">
        {steps.map((s, index) => (
          <Button
            key={s.key}
            onClick={() => goToStep(index)}
            // disabled={index > step}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${index === step
              ? "text-white bg-accent"
              : index < step
                ? "bg-green-100 text-green-800 border border-green-200"
                : ""
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

        {/* Step 4: Coupon Management (NEW) */}
        {step === 4 && (
          <CouponManagementStep
            eventData={eventData}
            setEventData={setEventData}
            currentEvent={currentEvent}
          />
        )}

        {/* Step 5: Custom Input Fields */}
        {step === 5 && (
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

        {/* Step 6: Event Settings */}
        {step === 6 && <SettingsStep eventData={eventData} handleInputChange={handleInputChange} />}
      </>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-3 border-t">
        <Button onClick={goBack} variant="outline" className="cursor-pointer" disabled={step === 0}>
          Back
        </Button>

        <div className="flex gap-2">
          <Button onClick={() => router.push("/event")} variant="ghost" className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={goNext} disabled={loading} className="cursor-pointer">
            {loading
              ? "Updating..."
              : step === steps.length - 1
                ? "Update Event"
                : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

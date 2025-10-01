"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useOrgStore } from "@/store/orgStore";
import api from "@/lib/api";
import { toast } from "sonner";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function Step6({ goNext, goBack }) {
  const { organization, setOrganization } = useOrgStore();

  // Available event types
  const eventTypes = [
    "seminar",
    "workshop",
    "conference",
    "webinar",
    "training",
    "networking",
    "competition",
    "hackathon",
    "panel discussion",
    "product launch",
    "meetup",
    "exhibition",
    "career fair",
    "cultural event",
    "sports event",
  ];

  // Initialize form data with organization data if available
  const [formData, setFormData] = useState({
    maxEventsPerMonth: organization?.eventPreferences?.maxEventsPerMonth || 1,
    preferredEventTypes: organization?.eventPreferences?.preferredEventTypes || [],
  });

  // State for custom event type input
  const [customEventType, setCustomEventType] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showGuidelinesDialog, setShowGuidelinesDialog] = useState(false);

  // Update form data when organization changes
  useEffect(() => {
    if (organization?.eventPreferences) {
      setFormData({
        maxEventsPerMonth: organization.eventPreferences.maxEventsPerMonth || 1,
        preferredEventTypes: organization.eventPreferences.preferredEventTypes || [],
      });
    }
  }, [organization]);

  // Handle max events change
  const handleMaxEventsChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setFormData((prevData) => ({
        ...prevData,
        maxEventsPerMonth: "", // Allow empty value for editing
      }));
      return;
    }

    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setFormData((prevData) => ({
        ...prevData,
        maxEventsPerMonth: Math.max(1, Math.min(20, value)), // Limit between 1-20
      }));
    }
  };

  // Handle event type selection
  const handleEventTypeToggle = (eventType) => {
    setFormData((prevData) => {
      const isSelected = prevData.preferredEventTypes.includes(eventType);
      const newEventTypes = isSelected
        ? prevData.preferredEventTypes.filter((type) => type !== eventType)
        : [...prevData.preferredEventTypes, eventType];

      return {
        ...prevData,
        preferredEventTypes: newEventTypes,
      };
    });
  };

  // Handle custom event type addition
  const handleAddCustomEventType = () => {
    const trimmedCustomType = customEventType.trim().toLowerCase();

    if (!trimmedCustomType) {
      toast.error("Please enter a custom event type.");
      return;
    }

    if (trimmedCustomType.length < 2) {
      toast.error("Custom event type must be at least 2 characters long.");
      return;
    }

    if (trimmedCustomType.length > 30) {
      toast.error("Custom event type must be less than 30 characters.");
      return;
    }

    // Check if already exists (case insensitive)
    const allEventTypes = [...eventTypes, ...formData.preferredEventTypes];
    const exists = allEventTypes.some((type) => type.toLowerCase() === trimmedCustomType);

    if (exists) {
      toast.error("This event type already exists.");
      return;
    }

    // Add to preferred event types
    setFormData((prevData) => ({
      ...prevData,
      preferredEventTypes: [...prevData.preferredEventTypes, trimmedCustomType],
    }));

    // Reset custom input
    setCustomEventType("");
    setShowCustomInput(false);
    toast.success("Custom event type added successfully!");
  };

  // Handle custom event type input
  const handleCustomEventTypeChange = (e) => {
    setCustomEventType(e.target.value);
  };

  // Handle key press in custom input
  const handleCustomInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomEventType();
    }
    if (e.key === "Escape") {
      setShowCustomInput(false);
      setCustomEventType("");
    }
  };

  // Validation function
  const validateForm = () => {
    if (formData.maxEventsPerMonth < 1 || formData.maxEventsPerMonth > 20) {
      toast.error("Maximum events per month should be between 1 and 20.");
      return false;
    }

    if (formData.preferredEventTypes.length === 0) {
      toast.error("Please select at least one preferred event type.");
      return false;
    }

    if (formData.preferredEventTypes.length > 10) {
      toast.error("Please select at most 10 preferred event types.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("/org/register/preferences", formData);
      toast.success(response.data.message || "Event preferences have been successfully saved!");
      setOrganization(response.data.org);
    } catch (error) {
      if (error.response?.data.error?.code === "EVENT_PREFERENCES_EXISTS") {
        toast.info("Let's move to next step");
        return;
      }
      toast.error(
        error.response?.data?.message || "Failed to save event preferences. Please try again.",
        {
          description:
            error.response?.data?.error?.details ||
            "An error occurred while saving your event preferences.",
        }
      );
      console.log("Error saving event preferences:", error);
    }
  };
  return (
    <Card className="h-full rounded border shadow-navy border-navy px-10 flex py-6 flex-col justify-between space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-navy text-lg">Set your organization's event hosting preferences</p>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray text-center">
            <span className="text-red">*</span> Required fields
          </div>
          {/* Info Button */}
          <Dialog open={showGuidelinesDialog} onOpenChange={setShowGuidelinesDialog}>
            <DialogTrigger asChild>
              <button
                className="w-8 h-8 cursor-pointer rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-300 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors"
                type="button"
                title="View Guidelines"
              >
                <IconInfoSquareRounded />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-navy">Event Preferences Guidelines</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• Set a realistic maximum number of events based on your capacity</li>
                    <li>• Choose event types that align with your organization's mission</li>
                    <li>• You can add custom event types by clicking the "Add Custom" button</li>
                    <li>• Custom event types are marked with ✨ sparkle icon</li>
                    <li>• You can modify these preferences later in your organization settings</li>
                    <li>• These preferences help us match you with suitable event opportunities</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Tips</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Start with 1-3 events per month if you're new to hosting</li>
                    <li>• Select 3-5 event types that match your expertise</li>
                    <li>• Consider your team size and available resources</li>
                    <li>• Think about your target audience preferences</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-2 border-navy shadow-sm py-1">
        <CardContent className="px-6 py-1 space-y-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="border-b pb-2">
                  <h3 className="text-navy font-semibold text-lg">Event Hosting Preferences</h3>
                  <p className="text-sm text-gray-600">
                    Configure your organization's event hosting capacity and preferences
                  </p>
                </div>

                {/* Maximum Events Per Month */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label
                      htmlFor="maxEventsPerMonth"
                      className="text-navy font-semibold text-base"
                    >
                      Maximum Events Per Month *
                    </Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        id="maxEventsPerMonth"
                        name="maxEventsPerMonth"
                        value={formData.maxEventsPerMonth}
                        onChange={handleMaxEventsChange}
                        min="1"
                        max="20"
                        className="h-11 border-gray-300 focus:border-navy focus:ring-navy w-32"
                        required
                      />
                      <div className="text-sm text-gray-600">
                        Events your organization can host per month (1-20)
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Currently set to:{" "}
                      <span className="font-semibold text-navy">
                        {formData.maxEventsPerMonth} events per month
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {formData.preferredEventTypes.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
                  <h4 className="font-medium text-green-900 mb-2">Summary</h4>
                  <div className="text-sm text-green-800">
                    <p>
                      Your organization can host up to{" "}
                      <strong>{formData.maxEventsPerMonth} events per month</strong>
                    </p>
                    <p>
                      Preferred event types:{" "}
                      <strong>{formData.preferredEventTypes.join(", ")}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Preferred Event Types */}
            <div className="space-y-1">
              <div className="space-y-1">
                <Label className="text-navy font-semibold text-base">Preferred Event Types *</Label>
                <p className="text-sm text-gray-600">
                  Select the types of events your organization prefers to host (select at least 1,
                  maximum 10)
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 space-x-3 space-y-2">
                {eventTypes.map((eventType) => (
                  <div
                    key={eventType}
                    onClick={() => handleEventTypeToggle(eventType)}
                    className={`
                      px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center
                      ${
                        formData.preferredEventTypes.includes(eventType)
                          ? "border-secondary bg-primary text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-navy hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="font-medium text-sm capitalize">{eventType}</div>
                  </div>
                ))}

                {/* Custom Event Types that were added */}
                {formData.preferredEventTypes
                  .filter((type) => !eventTypes.includes(type))
                  .map((customType) => (
                    <div
                      key={customType}
                      onClick={() => handleEventTypeToggle(customType)}
                      className="px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center border-border bg-primary text-white relative group"
                    >
                      <div className="font-medium text-sm capitalize">{customType}</div>
                      <div className="absolute top-1 right-1 text-xs opacity-70 group-hover:opacity-100">
                        ✨
                      </div>
                    </div>
                  ))}

                {/* Add Custom Event Type Button/Input */}
                {!showCustomInput ? (
                  <div
                    onClick={() => setShowCustomInput(true)}
                    className="px-3 py-2 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-400 cursor-pointer transition-all duration-200 text-center hover:border-navy hover:bg-gray/20"
                  >
                    <div className="text-2xl text-gray">+</div>
                    <div className="text-xs text-gray">Add Custom</div>
                  </div>
                ) : (
                  <div className="p-2 rounded-lg border-2 border-navy bg-white">
                    <Input
                      type="text"
                      value={customEventType}
                      onChange={handleCustomEventTypeChange}
                      onKeyDown={handleCustomInputKeyPress}
                      placeholder="Enter custom event type"
                      className="h-4 border-none p-1 text-sm focus:ring-0 focus:border-none"
                      autoFocus
                    />
                    <div className="flex justify-between mt-1">
                      <button
                        onClick={handleAddCustomEventType}
                        className="text-xs bg-navy text-white px-2 py-1 rounded hover:bg-blue-700"
                        type="button"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowCustomInput(false);
                          setCustomEventType("");
                        }}
                        className="text-xs text-gray-500 px-2 py-1 rounded hover:text-gray-700"
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500 flex items-center space-x-2">
                Selected:{" "}
                <span className="font-semibold text-navy">
                  {formData.preferredEventTypes.length} event types
                </span>
                {formData.preferredEventTypes.length > 0 && (
                  <div className="">
                    {formData.preferredEventTypes.map((type, index) => (
                      <span key={type} className="inline-flex items-center">
                        {type}
                        {!eventTypes.includes(type) && <span className="text-xs">✨</span>}
                        {index < formData.preferredEventTypes.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Removed inline Guidelines - now shown in dialog */}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-2 space-x-4">
        <Button variant="outline" onClick={() => goBack()}>
          Back
        </Button>
        <Button
          onClick={() => {
            if (!validateForm()) {
              return;
            }
            handleSubmit();
          }}
        >
          Submit
        </Button>
      </div>
    </Card>
  );
}

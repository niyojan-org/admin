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
    <div className="h-full bg-background rounded border border-border shadow flex flex-col justify-between py-4 sm:py-6 md:py-8 space-y-4 w-full px-2 sm:px-4 md:px-10">
      <div className="flex gap-4 justify-between items-start flex-wrap">
        <p className="text-foreground text-sm sm:text-lg flex-1">Set your organization's event hosting preferences</p>
        <div className="text-sm text-muted-foreground text-center flex items-start">
          <span className="text-destructive">*</span> Required fields
        </div>
        <Dialog open={showGuidelinesDialog} onOpenChange={setShowGuidelinesDialog}>
          <DialogTrigger asChild>
            <Button type="button" title="View Guidelines" variant={'icon'}>
              <IconInfoSquareRounded />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">Event Preferences Guidelines</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                <ul className="text-sm text-primary space-y-1">
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


      <Card className="shadow-sm bg-background py-1 border-0 p-0 flex-1 overflow-y-auto">
        <CardContent className="py-2 sm:py-4 sm:space-y-6">
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-primary font-semibold text-lg">Event Hosting Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Configure your organization's event hosting capacity and preferences
              </p>
            </div>

            {/* Maximum Events Per Month */}
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="maxEventsPerMonth" className="text-foreground font-semibold text-base">
                  Maximum Events Per Month *
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    id="maxEventsPerMonth"
                    name="maxEventsPerMonth"
                    value={formData.maxEventsPerMonth}
                    onChange={handleMaxEventsChange}
                    min="1"
                    max="20"
                    className="h-11 border-border focus:border-primary focus:ring-primary w-32"
                    required
                  />
                  <div className="text-sm text-muted-foreground">
                    Events your organization can host per month (1-20)
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Currently set to: <span className="font-semibold text-primary">{formData.maxEventsPerMonth} events per month</span>
                </div>
              </div>
            </div>

            {/* Summary */}
            {formData.preferredEventTypes.length > 0 && (
              <div className="bg-success/5 border-l-4 border-success rounded-lg p-4 max-w-md">
                <h4 className="font-medium text-success mb-2">Summary</h4>
                <div className="text-sm text-success">
                  <p>
                    Your organization can host up to <strong>{formData.maxEventsPerMonth} events per month</strong>
                  </p>
                  <p>
                    Preferred event types: <strong>{formData.preferredEventTypes.join(", ")}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Preferred Event Types */}
            <div className="space-y-1">
              <div className="space-y-1">
                <Label className="text-foreground font-semibold text-base">Preferred Event Types *</Label>
                <p className="text-sm text-muted-foreground">
                  Select the types of events your organization prefers to host (select at least 1, maximum 10)
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-2">
                {eventTypes.map((eventType) => (
                  <div
                    key={eventType}
                    onClick={() => handleEventTypeToggle(eventType)}
                    className={`
                      px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center
                      ${formData.preferredEventTypes.includes(eventType)
                        ? "border-secondary bg-primary text-white"
                        : "border-border bg-background text-muted-foreground hover:border-primary hover:bg-primary/5"
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
                    className="px-3 py-2 flex items-center justify-center rounded-lg border-2 border-dashed border-border cursor-pointer transition-all duration-200 text-center hover:border-primary hover:bg-primary/10"
                  >
                    <div className="text-2xl text-muted-foreground">+</div>
                    <div className="text-xs text-muted-foreground">Add Custom</div>
                  </div>
                ) : (
                  <div className="p-2 rounded-lg border-2 border-primary bg-background">
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
                        className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary/80"
                        type="button"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowCustomInput(false);
                          setCustomEventType("");
                        }}
                        className="text-xs text-muted-foreground px-2 py-1 rounded hover:text-primary"
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground flex items-center gap-2 flex-col sm:flex-row">
                <p>Selected: <span className="font-semibold text-primary">{formData.preferredEventTypes.length} event types</span></p>
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
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end mt-4 gap-2 sm:gap-4">
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => goBack()}>
          Back
        </Button>
        <Button
          className="w-full sm:w-auto"
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
    </div>
  );
}

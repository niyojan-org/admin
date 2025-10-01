"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { IconLoader2, IconSettings, IconInfoCircle, IconX } from "@tabler/icons-react";

export default function EventPreferencesStep({ orgData, onSave, saving }) {
  const [formData, setFormData] = useState({
    maxEventsPerMonth: orgData?.eventPreferences?.maxEventsPerMonth || 3,
    allowsPaidEvents: orgData?.eventPreferences?.allowsPaidEvents || false,
    autoApproveEvents: orgData?.eventPreferences?.autoApproveEvents || false,
    preferredEventTypes: orgData?.eventPreferences?.preferredEventTypes || [],
  });

  const [newEventType, setNewEventType] = useState("");
  const [errors, setErrors] = useState({});

  const eventTypeOptions = [
    "workshop", "seminar", "conference", "webinar", "hackathon", 
    "networking", "panel discussion", "training", "meetup", "competition",
    "exhibition", "fair", "festival", "concert", "sports", "cultural"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const addEventType = (type) => {
    if (!formData.preferredEventTypes.includes(type)) {
      setFormData(prev => ({
        ...prev,
        preferredEventTypes: [...prev.preferredEventTypes, type]
      }));
    }
    setNewEventType("");
  };

  const removeEventType = (type) => {
    setFormData(prev => ({
      ...prev,
      preferredEventTypes: prev.preferredEventTypes.filter(t => t !== type)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.maxEventsPerMonth || formData.maxEventsPerMonth < 1) {
      newErrors.maxEventsPerMonth = "Maximum events per month must be at least 1";
    } else if (formData.maxEventsPerMonth > 50) {
      newErrors.maxEventsPerMonth = "Maximum events per month cannot exceed 50";
    }
    
    if (formData.preferredEventTypes.length === 0) {
      newErrors.preferredEventTypes = "Please select at least one preferred event type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ eventPreferences: formData });
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          Configure your event hosting preferences to streamline event management and improve attendee experience.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Max Events Per Month */}
          <div className="space-y-2">
            <Label htmlFor="maxEventsPerMonth">Maximum Events Per Month *</Label>
            <Input
              id="maxEventsPerMonth"
              name="maxEventsPerMonth"
              type="number"
              min="1"
              max="50"
              value={formData.maxEventsPerMonth}
              onChange={handleChange}
              className={errors.maxEventsPerMonth ? "border-red-500" : ""}
            />
            {errors.maxEventsPerMonth && (
              <p className="text-sm text-red-500">{errors.maxEventsPerMonth}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Set a limit to manage your organization's event hosting capacity
            </p>
          </div>

          {/* Allow Paid Events */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Paid Events</Label>
              <p className="text-sm text-muted-foreground">
                Enable hosting events with ticket fees
              </p>
            </div>
            <Switch
              checked={formData.allowsPaidEvents}
              onCheckedChange={(checked) => handleSwitchChange('allowsPaidEvents', checked)}
            />
          </div>

          {/* Auto Approve Events */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Approve Events</Label>
              <p className="text-sm text-muted-foreground">
                Automatically approve events without manual review
              </p>
            </div>
            <Switch
              checked={formData.autoApproveEvents}
              onCheckedChange={(checked) => handleSwitchChange('autoApproveEvents', checked)}
            />
          </div>

          {/* Preferred Event Types */}
          <div className="space-y-4">
            <div>
              <Label>Preferred Event Types *</Label>
              <p className="text-sm text-muted-foreground">
                Select the types of events your organization typically hosts
              </p>
            </div>
            
            {/* Selected Event Types */}
            {formData.preferredEventTypes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.preferredEventTypes.map((type) => (
                  <Badge key={type} variant="default" className="gap-1">
                    {type.replace(/-/g, ' ')}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => removeEventType(type)}
                    >
                      <IconX className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Event Type */}
            <div className="flex flex-wrap gap-2">
              {eventTypeOptions
                .filter(type => !formData.preferredEventTypes.includes(type))
                .map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => addEventType(type)}
                    className="capitalize"
                  >
                    + {type.replace(/-/g, ' ')}
                  </Button>
                ))}
            </div>

            {/* Custom Event Type */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom event type"
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newEventType.trim()) {
                    addEventType(newEventType.trim().toLowerCase());
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (newEventType.trim()) {
                    addEventType(newEventType.trim().toLowerCase());
                  }
                }}
                disabled={!newEventType.trim()}
              >
                Add
              </Button>
            </div>

            {errors.preferredEventTypes && (
              <p className="text-sm text-red-500">{errors.preferredEventTypes}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { toast } from "sonner";
// import { DateTimeInput } from "@/components/ui/date-time-input";
import { Badge } from "@/components/ui/badge";

export default function RegistrationStep({
  eventData,
  handleInputChange,
  eventCategories,
  eventTypes,
  eventModes,
}) {
  // Tag input state
  const [tagInput, setTagInput] = useState("");

  // Helper to extract date and time from ISO string
  const getDateAndTime = (isoString, defaultTime) => {
    if (!isoString) return { date: null, time: defaultTime };
    const dateObj = new Date(isoString);
    // Format time as HH:mm
    const time = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    // Format date as Date object
    return { date: dateObj, time: time };
  };

  // Handle registration start and end changes
  const handleRegistrationStartChange = (isoString) => {
    const dateObj = new Date(isoString);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (dateObj < now) {
      toast.error("Registration start cannot be in the past");
      return;
    }
    handleInputChange("registrationStart", isoString);
  };

  const handleRegistrationEndChange = (isoString) => {
    const start = eventData.registrationStart ? new Date(eventData.registrationStart) : null;
    const end = new Date(isoString);
    if (start && end <= start) {
      toast.error("Registration end must be after start");
      return;
    }
    // Minimum 1 hour
    if (start && end.getTime() - start.getTime() < 60 * 60 * 1000) {
      toast.error("Registration period must be at least 1 hour");
      return;
    }
    // Maximum 6 months
    if (start && end.getTime() - start.getTime() > 180 * 24 * 60 * 60 * 1000) {
      toast.error("Registration period cannot exceed 6 months");
      return;
    }
    handleInputChange("registrationEnd", isoString);
  };

  const { date: initialStartDate, time: initialStartTime } = getDateAndTime(
    eventData.registrationStart,
    "09:00"
  );
  const { date: initialEndDate, time: initialEndTime } = getDateAndTime(
    eventData.registrationEnd,
    "23:59"
  );

  // Date picker states
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  // Handle tag management
  const addTag = () => {
    if (tagInput.trim() && !eventData.tags.includes(tagInput.trim())) {
      const newTags = [...eventData.tags, tagInput.trim()];
      handleInputChange("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = eventData.tags.filter((tag) => tag !== tagToRemove);
    handleInputChange("tags", newTags);
  };

  // Date validation helpers
  const isDateInPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const validateDateTime = (date, time, fieldName, isEndDate = false) => {
    if (!date) {
      toast.error(`${fieldName} date is required`);
      return false;
    }

    if (!time) {
      toast.error(`${fieldName} time is required`);
      return false;
    }

    const dateTime = new Date(date);
    const [hours, minutes] = time.split(":");
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Check if date is in the past
    if (isDateInPast(dateTime)) {
      toast.error(`${fieldName} cannot be in the past`);
      return false;
    }

    // If this is end date, check if it's after start date
    if (isEndDate && startDate && startTime) {
      const startDateTime = new Date(startDate);
      const [startHours, startMinutes] = startTime.split(":");
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

      if (dateTime <= startDateTime) {
        toast.error("Registration end date must be after start date");
        return false;
      }

      // Check minimum duration (at least 1 hour)
      const timeDiff = dateTime.getTime() - startDateTime.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      if (hoursDiff < 1) {
        toast.error("Registration period must be at least 1 hour");
        return false;
      }

      // Check maximum duration (6 months)
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      if (daysDiff > 180) {
        toast.error("Registration period cannot exceed 6 months");
        return false;
      }
    }

    return true;
  };

  const handleEndDateChange = (date) => {
    if (date && validateDateTime(date, endTime, "Registration end", true)) {
      setEndDate(date);
      const dateTime = new Date(date);
      const [hours, minutes] = endTime.split(":");
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      handleInputChange("registrationEnd", dateTime.toISOString());
    }
  };

  const handleEndTimeChange = (time) => {
    if (endDate && validateDateTime(endDate, time, "Registration end", true)) {
      setEndTime(time);
      const dateTime = new Date(endDate);
      const [hours, minutes] = time.split(":");
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      handleInputChange("registrationEnd", dateTime.toISOString());
    } else {
      setEndTime(time);
    }
  };

  return (
    <Card className={"flex-1"}>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy">Event Registration & Details</h2>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-navy hover:text-blue-700">
                <IconInfoSquareRounded className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registration Guidelines</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>• Set registration start and end dates carefully</p>
                <p>• Registration should close before the event starts</p>
                <p>• Consider time zones when setting dates</p>
                <p>• Leave enough buffer time for event preparation</p>
                <p>• Registration period must be at least 1 hour</p>
                <p>• Registration period cannot exceed 6 months</p>
                <p>• All dates must be in the future</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Event Category, Type & Mode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="space-y-2 w-full">
            <Label>Category *</Label>
            <Select
              value={eventData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {eventCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 w-full">
            <Label>Type *</Label>
            <Select
              value={eventData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 w-full">
            <Label>Mode *</Label>
            <Select
              value={eventData.mode}
              onValueChange={(value) => handleInputChange("mode", value)}
            >
              <SelectTrigger className={"w-full"}>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {eventModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {eventData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {eventData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-destructive font-semibold ml-2 cursor-pointer">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Registration Dates */}
        {/* <div className="space-y-4">
          <div>
            <Label className={"mb-2 text-base"}>Registration Start Date</Label>
            <DateTimeInput
              onChange={handleRegistrationStartChange}
              value={eventData.registrationStart}
            />
          </div>

          <div>
            <Label className={"mb-2 text-base"}>Registration End Date</Label>
            <DateTimeInput
              onChange={handleRegistrationEndChange}
              value={eventData.registrationEnd}
              minDateTime={eventData.registrationStart}
            />
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { CalendarIcon, Clock, ChevronUp, ChevronDown } from "lucide-react";
import { format, parseISO, isSameDay, isBefore } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Badge } from "./badge";
import { Separator } from "./separator";

import { cn } from "@/lib/utils";

export function DateTimeInput({ value, onChange, minDateTime, className }) {
  const minDate = minDateTime ? parseISO(minDateTime) : undefined;
  const initialDate = value ? parseISO(value) : minDate || new Date();

  const [date, setDate] = useState(initialDate);
  const [hour, setHour] = useState(() => value ? format(parseISO(value), "hh") : "12");
  const [minute, setMinute] = useState(() => value ? format(parseISO(value), "mm") : "00");
  const [period, setPeriod] = useState(() => value ? format(parseISO(value), "a") : "AM");
  const [open, setOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize component only once when value prop changes
  useEffect(() => {
    if (value && !initialized) {
      const parsedValue = parseISO(value);
      setDate(parsedValue);
      setHour(format(parsedValue, "hh"));
      setMinute(format(parsedValue, "mm"));
      setPeriod(format(parsedValue, "a"));
      setInitialized(true);
    }
  }, [value, initialized]);

  // Check if current time selection is disabled
  const isTimeDisabled = useMemo(() => {
    if (!minDate) return false;

    let h = parseInt(hour);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(h, parseInt(minute), 0, 0);

    if (isSameDay(selectedDateTime, minDate)) {
      return isBefore(selectedDateTime, minDate);
    }
    return isBefore(date, minDate);
  }, [hour, minute, period, date, minDate]);

  // Memoize onChange to prevent infinite loops
  const handleChange = useCallback((isoString) => {
    if (onChange && typeof onChange === 'function') {
      onChange(isoString);
    }
  }, [onChange]);

  // Update parent when time changes
  useEffect(() => {
    if (!hour || !minute || !period || !initialized) return;

    let h = parseInt(hour);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(h, parseInt(minute), 0, 0);

    if (!isTimeDisabled) {
      const isoString = selectedDateTime.toISOString();
      if (value !== isoString) {
        handleChange(isoString);
      }
    }
  }, [date, hour, minute, period, isTimeDisabled, initialized, value, handleChange]);

  const handleDateSelect = (newDate) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  // Enhanced time increment/decrement functions
  const adjustTime = (field, increment) => {
    if (field === "hour") {
      const currentHour = parseInt(hour);
      let newHour = currentHour + increment;
      if (newHour > 12) newHour = 1;
      if (newHour < 1) newHour = 12;
      setHour(newHour.toString().padStart(2, "0"));
    } else if (field === "minute") {
      const currentMinute = parseInt(minute);
      let newMinute = currentMinute + increment;
      if (newMinute >= 60) newMinute = 0;
      if (newMinute < 0) newMinute = 59;
      setMinute(newMinute.toString().padStart(2, "0"));
    }
  };

  const handleInputChange = (field, value) => {
    // Only allow numeric input
    const numericValue = value.replace(/\D/g, '');

    // Allow empty string for better typing experience
    if (numericValue === "") {
      if (field === "hour") setHour("");
      else if (field === "minute") setMinute("");
      return;
    }

    const numValue = parseInt(numericValue);
    if (isNaN(numValue)) return;

    if (field === "hour") {
      // Allow any numeric input up to 2 digits, validate range 1-12
      if (numericValue.length <= 2) {
        if (numValue >= 1 && numValue <= 12) {
          setHour(numericValue); // Don't pad while typing
        } else if (numericValue.length === 1) {
          // Allow single digit 1-9 while typing
          setHour(numericValue);
        } else if (numValue > 12) {
          // If typed value exceeds 12, cap it at 12
          setHour("12");
        }
      }
    } else if (field === "minute") {
      // Allow any numeric input up to 2 digits, validate range 0-59
      if (numericValue.length <= 2) {
        if (numValue >= 0 && numValue <= 59) {
          setMinute(numericValue); // Don't pad while typing
        } else if (numericValue.length === 1) {
          // Allow single digit 0-9 while typing
          setMinute(numericValue);
        } else if (numValue > 59) {
          // If typed value exceeds 59, cap it at 59
          setMinute("59");
        }
      }
    }
  };

  const handleInputBlur = (field, value) => {
    const numericValue = value.replace(/\D/g, '');

    if (numericValue === "") {
      // Set default values when empty
      if (field === "hour") setHour("12");
      else if (field === "minute") setMinute("00");
      return;
    }

    const numValue = parseInt(numericValue);
    if (isNaN(numValue)) {
      // Reset to default values if invalid
      if (field === "hour") setHour("12");
      else if (field === "minute") setMinute("00");
      return;
    }

    if (field === "hour") {
      if (numValue >= 1 && numValue <= 12) {
        setHour(numValue.toString().padStart(2, "0"));
      } else if (numValue === 0) {
        setHour("12"); // Convert 0 to 12 for 12-hour format
      } else if (numValue > 12) {
        setHour("12"); // Cap at 12
      } else {
        setHour("01"); // Default to 01 for invalid values
      }
    } else if (field === "minute") {
      if (numValue >= 0 && numValue <= 59) {
        setMinute(numValue.toString().padStart(2, "0"));
      } else {
        setMinute("00"); // Reset to 00 for invalid values
      }
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      adjustTime(field, 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      adjustTime(field, -1);
    }
  };

  const displayValue = `${format(date, "MMM d, yyyy")} • ${hour}:${minute} ${period}`;

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal h-10 px-3",
              "hover:bg-accent hover:text-accent-foreground",
              !hour && "text-muted-foreground",
              isTimeDisabled && "bg-destructive/10 border-destructive/50 hover:bg-destructive/20"
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="truncate">{displayValue}</span>
            </div>
            <Clock className="h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-r-none border-r"
              disabled={[
                { before: new Date() },
              ]}
            />
            <div className="w-72 p-4 space-y-4">
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">
                  {format(date, "EEE, MMM d, yyyy")}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Time Selection</Label>

                <div className="grid grid-cols-7 gap-2 items-center">
                  {/* Hour */}
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">Hour</Label>

                  </div>
                  {/* Colon */}
                  <div className="flex justify-center">

                  </div>
                  {/* Minute */}
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">Min</Label>
                  </div>

                  {/* Period */}
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">Period</Label>
                  </div>
                </div>


                <div className="grid grid-cols-7 gap-2 items-center py-2">
                  {/* Hour */}
                  <div className="col-span-2">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -top-3 left-1/2 -translate-x-1/2 h-4 w-4 p-0"
                        onClick={() => adjustTime("hour", 1)}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Input
                        value={hour}
                        onChange={(e) => handleInputChange("hour", e.target.value)}
                        onBlur={(e) => handleInputBlur("hour", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "hour")}
                        className={cn(
                          "text-center font-mono text-lg h-10",
                          isTimeDisabled && "bg-destructive/10 border-destructive/50 focus-visible:ring-destructive"
                        )}
                        maxLength={2}
                        placeholder="12"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-4 w-4 p-0"
                        onClick={() => adjustTime("hour", -1)}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Colon */}
                  <div className="flex justify-center">
                    <span className={cn(
                      "text-lg font-bold",
                      isTimeDisabled && "text-destructive"
                    )}>:</span>
                  </div>

                  {/* Minute */}
                  <div className="col-span-2">
                    <div className="relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -top-3 left-1/2 -translate-x-1/2 h-4 w-4 p-0"
                        onClick={() => adjustTime("minute", 1)}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Input
                        value={minute}
                        onChange={(e) => handleInputChange("minute", e.target.value)}
                        onBlur={(e) => handleInputBlur("minute", e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "minute")}
                        className={cn(
                          "text-center font-mono text-lg h-10",
                          isTimeDisabled && "bg-destructive/10 border-destructive/50 focus-visible:ring-destructive"
                        )}
                        maxLength={2}
                        placeholder="00"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-4 w-4 p-0"
                        onClick={() => adjustTime("minute", -1)}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Period */}
                  <div className="col-span-2">
                    <Select value={period} onValueChange={setPeriod}>
                      <SelectTrigger className={cn(
                        "h-10",
                        isTimeDisabled && "bg-destructive/10 border-destructive/50"
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isTimeDisabled && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2">
                    <p className="text-xs text-destructive text-center">
                      Time must be after {format(minDate, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setOpen(false)}
                    className="flex-1"
                    disabled={isTimeDisabled}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

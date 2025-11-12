"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export function DateTimeInput({ value, onChange, minDateTime, className, label }) {
  // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
  const [localValue, setLocalValue] = useState(() => {
    if (value) {
      const date = parseISO(value);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    }
    return "";
  });

  useEffect(() => {
    if (value) {
      const date = parseISO(value);
      setLocalValue(format(date, "yyyy-MM-dd'T'HH:mm"));
    }
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    if (newValue && onChange) {
      // Convert datetime-local format to ISO string
      const date = new Date(newValue);
      onChange(date.toISOString());
    }
  };

  // Convert minDateTime to datetime-local format
  const minValue = minDateTime ? format(parseISO(minDateTime), "yyyy-MM-dd'T'HH:mm") : undefined;

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          {label}
        </Label>
      )}
      <div className="relative">
        <input
          type="datetime-local"
          value={localValue}
          onChange={handleChange}
          min={minValue}
          className={cn(
            "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200"
          )}
        />
        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
      {value && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" />
          {format(parseISO(value), "EEEE, MMMM d, yyyy 'at' h:mm a")}
        </p>
      )}
    </div>
  );
}

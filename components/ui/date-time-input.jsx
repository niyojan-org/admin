"use client";

import { useState, useEffect, useMemo } from "react";
import { CalendarIcon } from "lucide-react";
import { format, parseISO, isSameDay, isBefore } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Label } from "./label";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

import { cn } from "@/lib/utils";

export function DateTimeInput({ value, onChange, minDateTime, className }) {
  const minDate = minDateTime ? parseISO(minDateTime) : undefined;
  const initialDate = value ? parseISO(value) : minDate || new Date();

  const [date, setDate] = useState(initialDate);
  // Store time as { hour, minute, period }
  const initialHour = format(initialDate, "hh");
  const initialMinute = format(initialDate, "mm");
  const initialPeriod = format(initialDate, "a");
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [period, setPeriod] = useState(initialPeriod);

  const isSameAsMinDate = useMemo(
    () => (minDate ? isSameDay(date, minDate) : false),
    [date, minDate]
  );

  // Disable past time if same day
  const isTimeDisabled = useMemo(() => {
    if (!minDate || !isSameAsMinDate) return false;
    let h = Number(hour);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    const m = Number(minute);
    const selected = new Date(date);
    selected.setHours(h, m, 0, 0);
    return isBefore(selected, minDate);
  }, [hour, minute, period, date, minDate]);

  useEffect(() => {
    let hours = Number(hour);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    const minutes = Number(minute);
    const updated = new Date(date);
    updated.setHours(hours, minutes, 0, 0);
    onChange(updated.toISOString());
  }, [date, hour, minute, period]);

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4 items-end", className)}>
      {/* Date Picker */}
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              disabled={(d) => {
                if (!minDate) return false;
                // Only disable days before minDate, not the same day
                return isBefore(d, minDate) && !isSameDay(d, minDate);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Picker */}
      <div className="space-y-2">
        <Label>Time</Label>
        <div className="flex gap-2 items-center">
          <Select value={hour} onValueChange={setHour}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const h = (i + 1).toString().padStart(2, "0");
                return (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          <span className="text-muted-foreground">:</span>
          
          <Select value={minute} onValueChange={setMinute}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, i) => {
                const m = i.toString().padStart(2, "0");
                return (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isTimeDisabled && (
          <p className="text-xs text-destructive mt-1">
            Time must be after {format(minDate, "hh:mm a")}
          </p>
        )}
      </div>
    </div>
  );
}

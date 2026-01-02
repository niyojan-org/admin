"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const DatePicker = ({ onChange, className, value }) => {
  const [date, setDate] = useState(value || undefined);
  const [month, setMonth] = useState(value || new Date());
  const [open, setOpen] = useState(false);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    setMonth(selectedDate || new Date());
    onChange && onChange(selectedDate ? selectedDate.toISOString() : null);
    setOpen(false);
  };

  const handleCalendarChange = (value, event) => {
    const newEvent = {
      target: {
        value: String(value),
      },
    };
    event(newEvent);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          variant="outline"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2 sm:px-4">
        <Calendar
          captionLayout="dropdown"
          components={{
            MonthCaption: (props) => <>{props.children}</>,
            DropdownNav: (props) => (
              <div className="flex w-full items-center gap-2">{props.children}</div>
            ),
            Dropdown: (props) => (
              <Select
                onValueChange={(value) => {
                  if (props.onChange) {
                    handleCalendarChange(value, props.onChange);
                  }
                }}
                value={String(props.value)}
              >
                <SelectTrigger className="first:flex-1 last:shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {props.options?.map((option) => (
                    <SelectItem
                      disabled={option.disabled}
                      key={option.value}
                      value={String(option.value)}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          }}
          hideNavigation
          mode="single"
          month={month}
          onMonthChange={setMonth}
          onSelect={handleDateSelect}
          selected={date}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;

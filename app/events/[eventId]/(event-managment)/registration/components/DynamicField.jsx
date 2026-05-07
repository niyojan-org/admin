"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-number-input";
import { cn } from "@/lib/utils";
import DatePicker from "@/components/ui/date-picker";

export default function DynamicField({ field, value, onChange, onFocus, error }) {
  const { name, label, type, required, placeholder, min, max, options = [] } = field;

  const Req = required ? <span className="text-destructive">*</span> : null;

  const handleFocus = () => {
    if (onFocus) {
      onFocus(name);
    }
  };

  // -------- Inputs --------
  if (["text", "email", "url"].includes(type)) {
    return (
      <div className="space-y-0.5">
        <Label htmlFor={name} className="font-medium pb-1">
          {label} {Req}
        </Label>
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder || ""}
          required={required}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          onFocus={handleFocus}
          className={cn(
            "shadow-sm focus-visible:ring-2 focus-visible:ring-primary",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {error && <p className="text-xs text-destructive pl-1">{error}</p>}
      </div>
    );
  }

  if (type === "date") {
    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="font-medium">
          {label} {Req}
        </Label>
        <DatePicker onChange={(e) => onChange(name, e)} />
      </div>
    );
  }

  if (type === "number") {
    return (
      <div className="space-y-0.5">
        <Label htmlFor={name} className="font-medium pb-1">
          {label} {Req}
        </Label>
        <Input
          id={name}
          name={name}
          placeholder={placeholder}
          type={type}
          required={required}
          value={value || ""}
          min={min}
          max={max}
          onChange={(e) => onChange(name, e.target.value)}
          onFocus={handleFocus}
          className={cn(
            "shadow-sm focus-visible:ring-2 focus-visible:ring-primary",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {error && <p className="text-xs text-destructive pl-1">{error}</p>}
      </div>
    );
  }

  if (type === "tel") {
    return (
      <div className="space-y-0.5">
        <Label htmlFor={name} className="font-medium pb-1">
          {label} {Req}
        </Label>
        <PhoneInput
          id={name}
          name={name}
          placeholder={placeholder || "123-456-7890"}
          required={required}
          value={value || ""}
          onChange={(val) => onChange(name, val)}
          onFocus={handleFocus}
          className={cn(
            "",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          defaultCountry="IN"
        />
        {error && <p className="text-xs text-destructive pl-1">{error}</p>}
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="space-y-0.5">
        <Label htmlFor={name} className="font-medium pb-1">
          {label} {Req}
        </Label>
        <Textarea
          id={name}
          name={name}
          placeholder={placeholder || ""}
          required={required}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          onFocus={handleFocus}
          className={cn(
            "shadow-sm focus-visible:ring-2 focus-visible:ring-primary min-h-px",
            error && "border-destructive focus-visible:ring-destructive pl-2"
          )}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  if (type === "dropdown") {
    return (
      <div className="space-y-2">
        <Label className="font-medium">
          {label} {Req}
        </Label>
        <Select value={value || ""} onValueChange={(val) => onChange(name, val)}>
          <SelectTrigger
            onFocus={handleFocus}
            className={cn(
              "rounded-lg shadow-sm",
              error && "border-destructive focus-visible:ring-destructive"
            )}
          >
            <SelectValue placeholder={placeholder || `Select ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  if (type === "radio") {
    return (
      <div className="space-y-2">
        <Label className="font-medium">
          {label} {Req}
        </Label>
        <RadioGroup
          value={value || ""}
          onValueChange={(val) => onChange(name, val)}
          className="flex flex-wrap gap-3"
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 shadow-sm hover:border-primary/50 cursor-pointer",
                error && "border-destructive"
              )}
            >
              <RadioGroupItem
                id={`${name}-${opt.value}`}
                value={opt.value}
                className="border-primary text-primary"
              />
              <Label htmlFor={`${name}-${opt.value}`} className="cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  if (type === "checkbox") {
    return (
      <div className="space-y-2">
        <Label className="font-medium">
          {label} {Req}
        </Label>
        <div className="flex flex-wrap gap-3">
          {options.map((opt) => {
            const checked = Array.isArray(value) && value.includes(opt.value);
            return (
              <div
                key={opt.value}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 shadow-sm hover:border-primary/50"
              >
                <Checkbox
                  id={`${name}-${opt.value}`}
                  checked={checked}
                  onCheckedChange={(c) => {
                    let newVal = Array.isArray(value) ? [...value] : [];
                    if (c) newVal.push(opt.value);
                    else newVal = newVal.filter((v) => v !== opt.value);
                    onChange(name, newVal);
                  }}
                />
                <Label htmlFor={`${name}-${opt.value}`} className="cursor-pointer">
                  {opt.label}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
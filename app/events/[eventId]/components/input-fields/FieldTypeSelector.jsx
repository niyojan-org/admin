'use client'
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFieldTypeIcon, fieldTypes } from "./utils/fieldTypeUtils";

export function FieldTypeSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="type" className="text-sm font-medium">
        Field Type *
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select field type" />
        </SelectTrigger>
        <SelectContent>
          {fieldTypes.map((type) => {
            const Icon = getFieldTypeIcon(type.value);
            return (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

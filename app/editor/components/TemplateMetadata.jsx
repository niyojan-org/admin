import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TEMPLATE_TYPES } from "../constants";

export default function TemplateMetadata({ templateName, templateType, onNameChange, onTypeChange }) {
  return (
    <div className="space-y-3 p-3 bg-card border rounded-md">
      <h4 className="font-semibold text-sm">Template Settings</h4>
      
      <div className="space-y-1.5">
        <Label htmlFor="template-name" className="text-xs">Template Name</Label>
        <Input
          id="template-name"
          type="text"
          value={templateName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., Event Certificate Template"
          className="h-9"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="template-type" className="text-xs">Template Type</Label>
        <Select value={templateType} onValueChange={onTypeChange}>
          <SelectTrigger id="template-type" className="h-9">
            <SelectValue placeholder="Select template type" />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATE_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

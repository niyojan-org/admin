'use client'
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getFieldTypeIcon } from "./utils/fieldTypeUtils";

export function FieldPreview({ fieldForm }) {
  const FieldTypeIcon = getFieldTypeIcon(fieldForm.type);
  
  return (
    <div className="space-y-3 p-3 sm:p-4 border rounded-lg bg-muted/30">
      <div>
        <Label className="text-sm font-medium">Field Preview</Label>
        <p className="text-xs text-muted-foreground mt-1">
          How this field will appear to users
        </p>
      </div>
      
      <div className="p-3 sm:p-4 bg-background border rounded-lg space-y-3">
        {/* Field Label */}
        <div className="flex items-center gap-2">
          <FieldTypeIcon className="w-4 h-4 text-muted-foreground" />
          <Label className="text-sm font-medium">
            {fieldForm.label || "Field Label"}
            {fieldForm.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </Label>
        </div>

        {/* Field Details */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <span>Type:</span>
              <Badge variant="secondary" className="text-xs">
                {fieldForm.type}
              </Badge>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <span>Name:</span>
              <code className="bg-muted px-1 py-0.5 rounded text-xs truncate max-w-[120px] sm:max-w-none">
                {fieldForm.name || "field_name"}
              </code>
            </div>
          </div>
          
          {fieldForm.placeholder && (
            <div className="flex items-start gap-1 flex-wrap">
              <span className="flex-shrink-0">Placeholder:</span>
              <span className="italic break-words">"{fieldForm.placeholder}"</span>
            </div>
          )}
          
          {fieldForm.options && fieldForm.options.length > 0 && (
            <div className="space-y-1">
              <span>Options ({fieldForm.options.length}):</span>
              <div className="flex gap-1 flex-wrap">
                {fieldForm.options.slice(0, 3).map((option, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs py-0 max-w-[100px] truncate">
                    {typeof option === 'object' ? option.label || option.value : option}
                  </Badge>
                ))}
                {fieldForm.options.length > 3 && (
                  <Badge variant="outline" className="text-xs py-0">
                    +{fieldForm.options.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

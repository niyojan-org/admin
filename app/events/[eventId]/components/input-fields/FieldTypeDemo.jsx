'use client'
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFieldTypeIcon } from "./utils/fieldTypeUtils";

/**
 * Demo component showcasing the new field type indicators
 * This can be removed in production
 */
export function FieldTypeDemo() {
  const [selectedType, setSelectedType] = useState("text");
  
  const fieldTypes = [
    { value: "text", label: "Text Input", description: "Single line text" },
    { value: "textarea", label: "Text Area", description: "Multi-line text" },
    { value: "number", label: "Number", description: "Numeric input" },
    { value: "email", label: "Email", description: "Email validation" },
    { value: "tel", label: "Phone", description: "Phone number" },
    { value: "url", label: "URL", description: "Website link" },
    { value: "date", label: "Date", description: "Date picker" },
    { value: "dropdown", label: "Dropdown", description: "Select from options" },
    { value: "radio", label: "Radio Group", description: "Single choice" },
    { value: "checkbox", label: "Checkbox", description: "Multiple choice" },
    { value: "file", label: "File Upload", description: "File attachment" },
  ];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Field Types Demo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {fieldTypes.map((type) => {
            const Icon = getFieldTypeIcon(type.value);
            const isSelected = selectedType === type.value;
            
            return (
              <div
                key={type.value}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedType(type.value)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{type.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{type.description}</p>
                {isSelected && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Selected
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Selected Type: {selectedType}</h4>
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = getFieldTypeIcon(selectedType);
              return <Icon className="w-5 h-5 text-primary" />;
            })()}
            <span className="text-sm">
              {fieldTypes.find(t => t.value === selectedType)?.description}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

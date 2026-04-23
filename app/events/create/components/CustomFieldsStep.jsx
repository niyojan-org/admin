"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { IconPlus, IconTrash, IconForms, IconX } from "@tabler/icons-react";
import { useEventForm } from "../hooks/useEventForm";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const FIELD_TYPES = [
  { value: "text", label: "Text Input" },
  { value: "textarea", label: "Text Area" },
  { value: "dropdown", label: "Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkboxes" },
];

export default function CustomFieldsStep() {
  const { eventDraft, customFields } = useEventForm();
  const [expandedField, setExpandedField] = useState(null);

  const isFieldComplete = (field) => {
    if (!field?.label?.trim() || !field?.name?.trim() || !field?.type?.trim()) {
      return false;
    }

    if (needsOptions(field.type)) {
      if (!field.options || field.options.length === 0) {
        return false;
      }

      return field.options.every(
        (option) => option?.label?.trim() && option?.value?.trim(),
      );
    }

    return true;
  };

  const handleAddField = () => {
    const fields = eventDraft.customFields;
    const lastFieldIndex = fields.length - 1;

    if (lastFieldIndex >= 0 && !isFieldComplete(fields[lastFieldIndex])) {
      setExpandedField(lastFieldIndex);
      toast.error(
        "Complete the current custom field details before adding another one",
      );
      return;
    }

    customFields.add();
    setExpandedField(fields.length);
  };

  const addOption = (fieldIndex) => {
    const field = eventDraft.customFields[fieldIndex];
    const options = field.options || [];
    customFields.update(fieldIndex, {
      options: [...options, { label: "", value: "" }],
    });
  };

  const updateOption = (fieldIndex, optionIndex, key, value) => {
    const field = eventDraft.customFields[fieldIndex];
    const updatedOptions = [...field.options];
    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [key]: value,
    };
    customFields.update(fieldIndex, { options: updatedOptions });
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const field = eventDraft.customFields[fieldIndex];
    customFields.update(fieldIndex, {
      options: field.options.filter((_, idx) => idx !== optionIndex),
    });
  };

  const needsOptions = (type) => {
    return ["dropdown", "radio", "checkbox"].includes(type);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom Fields</h2>
          <p className="text-muted-foreground">
            Add additional fields to registration form
          </p>
        </div>
        <Button onClick={handleAddField} className="gap-2">
          <IconPlus className="w-4 h-4" />
          Add Field
        </Button>
      </div>

      {eventDraft.customFields.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <IconForms className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No custom fields added yet</p>
            <Button
              onClick={handleAddField}
              variant="outline"
              className="mt-4 gap-2"
            >
              <IconPlus className="w-4 h-4" />
              Add Your First Field
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {eventDraft.customFields.map((field, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Field {index + 1}
                      {isFieldComplete(field) ? (
                        <Badge variant="secondary" className="text-xs">
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Incomplete
                        </Badge>
                      )}
                      {field.required && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </CardTitle>
                    {field.label && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {field.label}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedField(expandedField === index ? null : index)
                      }
                    >
                      {expandedField === index ? "Collapse" : "Expand"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => customFields.remove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <IconTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedField === index && (
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Field Label *</Label>
                      <Input
                        placeholder="e.g., Dietary Preferences"
                        value={field.label || ""}
                        onChange={(e) =>
                          customFields.update(index, { label: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Field Name *</Label>
                      <Input
                        placeholder="e.g., dietary_preferences"
                        value={field.name || ""}
                        onChange={(e) =>
                          customFields.update(index, {
                            name: e.target.value
                              .toLowerCase()
                              .replace(/\s+/g, "_"),
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Unique identifier (use lowercase and underscores)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Field Type *</Label>
                    <Select
                      value={field.type || "text"}
                      onValueChange={(value) =>
                        customFields.update(index, { type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Placeholder Text</Label>
                    <Input
                      placeholder="e.g., Select your dietary preference"
                      value={field.placeholder || ""}
                      onChange={(e) =>
                        customFields.update(index, {
                          placeholder: e.target.value,
                        })
                      }
                    />
                  </div>

                  {needsOptions(field.type) && (
                    <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Options</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(index)}
                          className="gap-2"
                        >
                          <IconPlus className="w-4 h-4" />
                          Add Option
                        </Button>
                      </div>

                      {field.options?.map((option, optionIdx) => (
                        <div key={optionIdx} className="flex gap-2 items-start">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Label (e.g., Vegetarian)"
                              value={option.label || ""}
                              onChange={(e) =>
                                updateOption(
                                  index,
                                  optionIdx,
                                  "label",
                                  e.target.value,
                                )
                              }
                            />
                            <Input
                              placeholder="Value (e.g., vegetarian)"
                              value={option.value || ""}
                              onChange={(e) =>
                                updateOption(
                                  index,
                                  optionIdx,
                                  "value",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(index, optionIdx)}
                            className="text-destructive"
                          >
                            <IconX className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      {(!field.options || field.options.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          No options added yet
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="space-y-0.5">
                      <Label>Required Field</Label>
                      <p className="text-sm text-muted-foreground">
                        Make this field mandatory
                      </p>
                    </div>
                    <Switch
                      checked={field.required || false}
                      onCheckedChange={(checked) =>
                        customFields.update(index, { required: checked })
                      }
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconInfoSquareRounded, IconPlus, IconTrash } from "@tabler/icons-react";

export default function CustomFieldsStep({ 
  eventData, 
  fieldTypes,
  addInputField,
  updateInputField,
  removeInputField,
  addFieldOption,
  removeFieldOption
}) {
  // Default required fields that cannot be removed
  const defaultFields = [
    {
      label: "Full Name",
      name: "full_name",
      type: "text",
      required: true,
      isDefault: true,
      placeholder: "Enter your full name"
    },
    {
      label: "Email Address",
      name: "email",
      type: "email",
      required: true,
      isDefault: true,
      placeholder: "Enter your email address"
    }
  ];

  // Define field type colors for better visual distinction
  const getFieldTypeColor = (type) => {
    const colors = {
      text: "bg-blue-50 border-blue-200",
      email: "bg-green-50 border-green-200", 
      number: "bg-purple-50 border-purple-200",
      tel: "bg-orange-50 border-orange-200",
      textarea: "bg-indigo-50 border-indigo-200",
      dropdown: "bg-pink-50 border-pink-200",
      radio: "bg-yellow-50 border-yellow-200",
      checkbox: "bg-teal-50 border-teal-200",
      date: "bg-rose-50 border-rose-200"
    };
    return colors[type] || "bg-gray-50 border-gray-200";
  };

  return (
    <Card className={"flex-1"}>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy">Custom Registration Fields</h2>
          <div className="flex gap-2">
            <Button onClick={addInputField} variant="outline" size="sm">
              <IconPlus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-navy hover:text-blue-700">
                  <IconInfoSquareRounded className="h-5 w-5" />
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Custom Fields Guidelines</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-gray-600">
                  <p>• Add fields to collect additional information from attendees</p>
                  <p>• Use clear, descriptive labels for fields</p>
                  <p>• Mark essential fields as required</p>
                  <p>• For dropdown/radio fields, provide all necessary options</p>
                  <p>• Field names should be unique and URL-friendly</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Default Required Fields */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-navy">Required Registration Fields</h3>
            <span className="text-xs bg-navy/10 text-navy px-2 py-1 rounded-full">Cannot be removed</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defaultFields.map((field, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getFieldTypeColor(field.type)}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-navy">{field.label}</h4>
                    <span className="text-xs bg-white/80 px-2 py-1 rounded-full border">
                      {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Field Name:</strong> {field.name}</p>
                    <p><strong>Required:</strong> Yes</p>
                    <p><strong>Placeholder:</strong> {field.placeholder}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Fields Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-navy">Additional Custom Fields</h3>
            <span className="text-sm text-gray-500">
              {eventData.inputFields.length} custom field{eventData.inputFields.length !== 1 ? 's' : ''} added
            </span>
          </div>

          {eventData.inputFields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="space-y-2">
                <IconPlus className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="text-gray-500 font-medium">No additional fields added yet</p>
                <p className="text-sm text-gray-400">Click "Add Field" to create custom registration fields for specific information</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {eventData.inputFields.map((field, index) => {
                const colorClass = getFieldTypeColor(field.type);
                
                return (
                  <div key={index} className={`border rounded-lg p-4 space-y-4 ${colorClass}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-navy">Custom Field {index + 1}</h4>
                        <span className="text-xs bg-white/80 px-2 py-1 rounded-full border">
                          {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                        </span>
                        {field.required && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Required</span>
                        )}
                      </div>
                      <Button
                        onClick={() => removeInputField(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Field Label *</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateInputField(index, "label", e.target.value)}
                          placeholder="e.g., Dietary Preferences"
                          className="bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Field Name *</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => updateInputField(index, "name", e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_'))}
                          placeholder="e.g., dietary_preferences"
                          className="bg-white font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500">Auto-formatted for database use</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Field Type *</Label>
                        <Select 
                          value={field.type} 
                          onValueChange={(value) => updateInputField(index, "type", value)}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${getFieldTypeColor(type.value).split(' ')[0]} border`}></div>
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Placeholder Text</Label>
                        <Input
                          value={field.placeholder || ""}
                          onChange={(e) => updateInputField(index, "placeholder", e.target.value)}
                          placeholder="Enter placeholder text for this field"
                          className="bg-white"
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`required-${index}`}
                            checked={field.required}
                            onChange={(e) => updateInputField(index, "required", e.target.checked)}
                            className="rounded border-gray-300 h-4 w-4"
                          />
                          <Label htmlFor={`required-${index}`} className="text-sm">Required field</Label>
                        </div>
                      </div>
                    </div>

                    {/* Options for dropdown, radio, checkbox fields */}
                    {(field.type === "dropdown" || field.type === "radio" || field.type === "checkbox") && (
                      <div className="space-y-3 border-t pt-4">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">Field Options</Label>
                          <span className="text-xs text-gray-500">
                            {field.options?.length || 0} option{(field.options?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {field.options?.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2 items-center p-2 bg-white/50 rounded border">
                              <span className="text-sm font-mono text-gray-600">#{optionIndex + 1}</span>
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(field.options || [])];
                                  newOptions[optionIndex] = e.target.value;
                                  updateInputField(index, "options", newOptions);
                                }}
                                className="flex-1 bg-white"
                                placeholder="Option text"
                              />
                              <Button
                                onClick={() => removeFieldOption(index, optionIndex)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <div className="flex gap-2 p-2 border-2 border-dashed border-gray-300 rounded bg-gray-50">
                            <Input
                              placeholder="Enter new option"
                              className="flex-1 bg-white"
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && e.target.value.trim()) {
                                  e.preventDefault();
                                  addFieldOption(index, e.target.value.trim());
                                  e.target.value = "";
                                }
                              }}
                            />
                            <Button
                              onClick={(e) => {
                                const input = e.target.closest('.flex').querySelector('input');
                                if (input.value.trim()) {
                                  addFieldOption(index, input.value.trim());
                                  input.value = "";
                                }
                              }}
                              variant="outline"
                              size="sm"
                              className="bg-white"
                            >
                              <IconPlus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                          
                          {(!field.options || field.options.length === 0) && (
                            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                              ⚠️ This field type requires at least one option to function properly.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Field Preview */}
                    <div className="border-t pt-4">
                      <Label className="font-medium mb-2 block">Field Preview</Label>
                      <div className="p-3 bg-white/70 border rounded">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            {field.label || "Field Label"} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          <div className="text-xs text-gray-500">
                            Type: {field.type} | Name: {field.name || "field_name"}
                            {field.placeholder && ` | Placeholder: "${field.placeholder}"`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconPlus, IconTrash, IconAlertCircle } from "@tabler/icons-react";

export function FieldOptions({ 
  options = [], 
  newOption = '', 
  onOptionsChange, 
  onNewOptionChange,
  fieldType 
}) {
  const handleAddOption = () => {
    if (newOption && newOption.trim()) {
      const updatedOptions = [...options, {
        label: newOption.trim(),
        value: newOption.trim()
      }];
      onOptionsChange(updatedOptions);
      onNewOptionChange('');
    }
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = options.filter((_, idx) => idx !== index);
    onOptionsChange(updatedOptions);
  };

  const handleUpdateOption = (index, value) => {
    const updatedOptions = [...options];
    // Ensure we maintain object format
    if (typeof updatedOptions[index] === 'object') {
      updatedOptions[index] = {
        ...updatedOptions[index],
        label: value,
        value: value
      };
    } else {
      updatedOptions[index] = {
        label: value,
        value: value
      };
    }
    onOptionsChange(updatedOptions);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">Field Options</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Add options for {fieldType} field
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {options.length} option{options.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Existing Options */}
      {options.length > 0 && (
        <div className="space-y-2">
          {options.map((option, index) => {
            // Handle both string and object formats
            const optionValue = typeof option === 'object' ? option.label || option.value : option;
            
            return (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-background rounded-lg border"
              >
                <Badge variant="outline" className="text-xs font-mono min-w-0">
                  #{index + 1}
                </Badge>
                <Input
                  value={optionValue}
                  onChange={(e) => handleUpdateOption(index, e.target.value)}
                  className="flex-1"
                  placeholder="Option text"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(index)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <IconTrash className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Option */}
      <div className="flex gap-2 p-3 border-2 border-dashed border-border rounded-lg bg-background/50">
        <Input
          placeholder="Enter new option"
          value={newOption}
          onChange={(e) => onNewOptionChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          onClick={handleAddOption}
          disabled={!newOption || !newOption.trim()}
          variant="outline"
          size="sm"
        >
          <IconPlus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Warning for empty options */}
      {options.length === 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <IconAlertCircle className="w-4 h-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            This field type requires at least one option to function properly.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

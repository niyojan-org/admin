'use client'
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IconPlus, IconEdit, IconEye, IconEyeOff } from "@tabler/icons-react";
import { FieldTypeSelector } from "./FieldTypeSelector";
import { FieldOptions } from "./FieldOptions";
import { FieldPreview } from "./FieldPreview";

export function FieldFormDialog({
  open,
  onOpenChange,
  fieldForm,
  setFieldForm,
  onSubmit,
  title,
  isEdit = false
}) {
  const [showPreview, setShowPreview] = useState(false);
  
  const handleSubmit = async () => {
    await onSubmit();
  };

  const handleFieldChange = (field, value) => {
    setFieldForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNameChange = (value) => {
    const formattedName = value
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');
    handleFieldChange('name', formattedName);
  };

  const isChoiceField = ['dropdown', 'checkbox', 'radio'].includes(fieldForm.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              <>
                <IconEdit className="w-5 h-5" />
                {title}
              </>
            ) : (
              <>
                <IconPlus className="w-5 h-5" />
                {title}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Basic Field Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label" className="text-sm font-medium">
                Field Label *
              </Label>
              <Input
                id="label"
                value={fieldForm.label}
                onChange={(e) => handleFieldChange('label', e.target.value)}
                placeholder="e.g., Dietary Preferences"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Field Name *
              </Label>
              <Input
                id="name"
                value={fieldForm.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., dietary_preferences"
                className="bg-background font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Auto-formatted for database use
              </p>
            </div>
          </div>

          {/* Field Type & Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldTypeSelector
              value={fieldForm.type}
              onChange={(type) => {
                handleFieldChange('type', type);
                // Reset options when changing to non-choice field
                if (!['dropdown', 'checkbox', 'radio'].includes(type)) {
                  handleFieldChange('options', []);
                  handleFieldChange('newOption', '');
                }
              }}
            />

            <div className="space-y-2">
              <Label htmlFor="placeholder" className="text-sm font-medium">
                Placeholder Text
              </Label>
              <Input
                id="placeholder"
                value={fieldForm.placeholder}
                onChange={(e) => handleFieldChange('placeholder', e.target.value)}
                placeholder="Enter placeholder text"
                className="bg-background"
              />
            </div>
          </div>

          {/* Additional Field Properties */}
          {(fieldForm.type === 'text' || fieldForm.type === 'textarea') && (
            <div className="space-y-2">
              <Label htmlFor="maxLength" className="text-sm font-medium">
                Maximum Length
              </Label>
              <Input
                id="maxLength"
                type="number"
                value={fieldForm.maxLength}
                onChange={(e) => handleFieldChange('maxLength', e.target.value)}
                placeholder="e.g., 100"
                className="bg-background"
                min="1"
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of characters allowed
              </p>
            </div>
          )}

          {fieldForm.type === 'number' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min" className="text-sm font-medium">
                  Minimum Value
                </Label>
                <Input
                  id="min"
                  type="number"
                  value={fieldForm.min}
                  onChange={(e) => handleFieldChange('min', e.target.value)}
                  placeholder="e.g., 0"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max" className="text-sm font-medium">
                  Maximum Value
                </Label>
                <Input
                  id="max"
                  type="number"
                  value={fieldForm.max}
                  onChange={(e) => handleFieldChange('max', e.target.value)}
                  placeholder="e.g., 100"
                  className="bg-background"
                />
              </div>
            </div>
          )}

          {/* Required Field Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Required Field</Label>
              <p className="text-xs text-muted-foreground">
                Users must fill this field to complete registration
              </p>
            </div>
            <Switch
              checked={fieldForm.required}
              onCheckedChange={(checked) => handleFieldChange('required', checked)}
            />
          </div>

          {/* Field Options for choice fields */}
          {isChoiceField && (
            <FieldOptions
              options={fieldForm.options || []}
              newOption={fieldForm.newOption || ''}
              onOptionsChange={(options) => handleFieldChange('options', options)}
              onNewOptionChange={(value) => handleFieldChange('newOption', value)}
              fieldType={fieldForm.type}
            />
          )}

          {/* Preview Toggle Button */}
          <div className="flex items-center justify-between py-2">
            <Label className="text-sm font-medium">Field Preview</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="h-8 px-2"
            >
              {showPreview ? (
                <>
                  <IconEyeOff className="w-4 h-4 mr-1" />
                  Hide
                </>
              ) : (
                <>
                  <IconEye className="w-4 h-4 mr-1" />
                  Show
                </>
              )}
            </Button>
          </div>

          {/* Field Preview */}
          {showPreview && <FieldPreview fieldForm={fieldForm} />}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEdit ? 'Update Field' : 'Add Field'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

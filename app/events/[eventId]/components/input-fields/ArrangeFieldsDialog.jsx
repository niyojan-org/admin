'use client'
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconChevronUp, IconChevronDown, IconGripVertical } from "@tabler/icons-react";
import { getFieldTypeIcon } from "./utils/fieldTypeUtils";

export function ArrangeFieldsDialog({ 
  open, 
  onOpenChange, 
  fields = [], 
  onArrange 
}) {
  const [localFields, setLocalFields] = useState([...fields]);
  const [isLoading, setIsLoading] = useState(false);

  // Update local fields when fields prop changes or dialog opens
  useEffect(() => {
    if (open && fields.length > 0) {
      setLocalFields([...fields]);
    }
  }, [open, fields]);
  // Reset local state when dialog opens
  const handleOpenChange = (isOpen) => {
    if (isOpen && fields.length > 0) {
      setLocalFields([...fields]);
    }
    onOpenChange(isOpen);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    
    const newFields = [...localFields];
    const temp = newFields[index];
    newFields[index] = newFields[index - 1];
    newFields[index - 1] = temp;
    setLocalFields(newFields);
  };

  const moveDown = (index) => {
    if (index === localFields.length - 1) return;
    
    const newFields = [...localFields];
    const temp = newFields[index];
    newFields[index] = newFields[index + 1];
    newFields[index + 1] = temp;
    setLocalFields(newFields);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const newOrder = localFields.map(field => field._id);
      await onArrange(newOrder);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to arrange fields:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = JSON.stringify(localFields.map(f => f._id)) !== JSON.stringify(fields.map(f => f._id));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconGripVertical className="w-5 h-5" />
            Arrange Fields
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {localFields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <IconGripVertical className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No fields to arrange</p>
            </div>
          ) : (
            localFields.map((field, index) => {
              const FieldTypeIcon = getFieldTypeIcon(field.type);
              
              return (
                <div
                  key={field._id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                >
                  {/* Field Info */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FieldTypeIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {field.label}
                          {field.required && (
                            <span className="text-destructive ml-1">*</span>
                          )}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {field.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {field.name}
                      </div>
                    </div>
                  </div>

                  {/* Move Controls */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                      title="Move up"
                    >
                      <IconChevronUp className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDown(index)}
                      disabled={index === localFields.length - 1}
                      className="h-6 w-6 p-0"
                      title="Move down"
                    >
                      <IconChevronDown className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Position Indicator */}
                  <div className="flex items-center justify-center w-8 text-xs text-muted-foreground font-mono">
                    #{index + 1}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            {localFields.length} field{localFields.length !== 1 ? 's' : ''}
            {hasChanges && <span className="text-amber-600 ml-2">• Changes pending</span>}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleSave}
              disabled={!hasChanges || isLoading}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              )}
              Save Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

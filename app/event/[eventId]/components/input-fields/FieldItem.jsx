'use client'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconEdit, IconTrash, IconGripVertical } from "@tabler/icons-react";
import { getFieldTypeIcon, getFieldTypeColor } from "./utils/fieldTypeUtils";

export function FieldItem({ 
  field, 
  index, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragEnd,
  isDragging,
  isDragOver,
  enableDrag = true
}) {
  const FieldTypeIcon = getFieldTypeIcon(field.type);

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Edit button clicked for field:', field.label);
    onEdit();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Delete button clicked for field:', field.label);
    onDelete();
  };

  const handleDragStart = (e) => {
    console.log('Drag started for field:', field.label);
    onDragStart(e);
  };

  return (
    <div
      className={`group border rounded-lg p-4 bg-card transition-all duration-200 ${
        isDragging 
          ? 'opacity-50 shadow-lg scale-[0.98] bg-primary/5 border-primary/30' 
          : 'hover:shadow-md'
      } ${
        isDragOver ? 'border-primary bg-primary/5' : ''
      }`}
      draggable={enableDrag}
      onDragStart={enableDrag ? handleDragStart : undefined}
      onDragEnd={enableDrag ? onDragEnd : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Section - Drag Handle & Content */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {enableDrag && (
            <div 
              className={`mt-0.5 p-2 -m-2 rounded hover:bg-muted/50 transition-colors ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              title="Drag to reorder fields"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <IconGripVertical className={`w-5 h-5 transition-all ${
                isDragging 
                  ? 'text-primary' 
                  : 'text-muted-foreground opacity-50 group-hover:opacity-100 hover:text-primary'
              }`} />
            </div>
          )}
          
          <div className="flex-1 min-w-0 space-y-2">
            {/* Field Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <FieldTypeIcon className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-base leading-none">
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </h3>
              </div>
              
              <Badge 
                variant="secondary" 
                className={`text-xs ${getFieldTypeColor(field.type)}`}
              >
                {field.type}
              </Badge>
            </div>

            {/* Field Details */}
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  {field.name}
                </span>
                {field.placeholder && (
                  <span className="truncate">"{field.placeholder}"</span>
                )}
              </div>
              
              {field.options && field.options.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs font-medium">Options:</span>
                  <div className="flex gap-1 flex-wrap">
                    {field.options.slice(0, 3).map((option, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs py-0">
                        {typeof option === 'object' ? option.label || option.value : option}
                      </Badge>
                    ))}
                    {field.options.length > 3 && (
                      <Badge variant="outline" className="text-xs py-0">
                        +{field.options.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0 hover:bg-primary/10"
            title="Edit field"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <IconEdit className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            title="Delete field"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <IconTrash className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

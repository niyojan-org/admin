"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconEdit,
  IconTrash,
  IconGripVertical,
  IconLock,
} from "@tabler/icons-react";
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
  enableDrag = true,
}) {
  const FieldTypeIcon = getFieldTypeIcon(field.type);
  const isSystem = field.system;
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Edit button clicked for field:", field.label);
    onEdit();
    if (!isSystem) onEdit();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Delete button clicked for field:", field.label);
    onDelete();
    if (!isSystem) onDelete();
  };

  const handleDragStart = (e) => {
    console.log("Drag started for field:", field.label);
    onDragStart(e);
    if (!isSystem && onDragStart) onDragStart(e);
  };

  return (
    <div
      className={`min-h-fit p-2 group border rounded-lg px-4 bg-card transition-all duration-200 w-full 
        ${
          isDragging
            ? "opacity-50 shadow-lg scale-[0.98] bg-primary/5 border-primary/30"
            : "hover:shadow-md"
        }
        ${isDragOver ? "border-primary bg-primary/5" : ""}
    `}
      //   draggable={enableDrag}
      //   onDragStart={enableDrag ? handleDragStart : undefined}
      //   onDragEnd={enableDrag ? onDragEnd : undefined}
      // draggable={enableDrag && !isSystem}
      // onDragStart={enableDrag && !isSystem ? handleDragStart : undefined}
      // onDragEnd={enableDrag && !isSystem ? onDragEnd : undefined}
    >
      {/* Allow horizontal scrolling if overflow happens */}
      <div
        className={`flex items-start justify-between gap-3 w-full overflow-x-auto ${
          isSystem ? "opacity-50" : ""
        }`}
      >
        {/* Left Content */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {enableDrag && !isSystem && (
            <div
              className={`mt-0.5 p-2 -m-2 rounded hover:bg-muted/50 transition-colors ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {/* <IconGripVertical className="w-5 h-5 text-muted-foreground" /> */}
            </div>
          )}

          <div className="flex-1 min-w-0 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <h3 className="font-semibold text-base leading-none truncate max-w-[200px] flex items-center gap-1">
                {isSystem && (
                  <IconLock className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </h3>

              {isSystem && (
                <Badge variant="outline" className="text-xs">
                  Default
                </Badge>
              )}

              <Badge
                variant="secondary"
                className={`text-xs shrink-0 ${getFieldTypeColor(field.type)}`}
              >
                {field.type}
              </Badge>
            </div>

            {/* Metadata */}
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded truncate max-w-[150px]">
                  {field.name}
                </span>
                {field.placeholder && (
                  <span className="truncate max-w-[200px]">
                    "{field.placeholder}"
                  </span>
                )}
              </div>

              {field.options?.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs font-medium shrink-0">Options:</span>
                  <div className="flex gap-1 flex-wrap">
                    {field.options.slice(0, 3).map((option, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs py-0 truncate max-w-[100px]"
                      >
                        {typeof option === "object"
                          ? option.label || option.value
                          : option}
                      </Badge>
                    ))}
                    {field.options.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs py-0 shrink-0"
                      >
                        +{field.options.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="grid-cols-1 sm:flex items-center gap-1 shrink-0">
          {!isSystem && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-6 w-6 p-0"
              >
                <IconEdit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <IconTrash className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

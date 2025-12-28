'use client'
import { useState, useEffect } from "react";
import { FieldItem } from "./FieldItem";
import { DropZoneIndicator } from "./DropZoneIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function FieldsList({ fields, onEdit, onDelete, onArrange }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index.toString());
    setTimeout(() => {
      if (e.target) e.target.style.opacity = "0.5";
    }, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return resetDragState();

    if (draggedIndex === dropIndex) return resetDragState();

    try {
      const newFields = [...fields];
      const draggedField = newFields[draggedIndex];
      newFields.splice(draggedIndex, 1);

      let insertIndex = dropIndex;
      if (dropIndex > draggedIndex) insertIndex = dropIndex - 1;

      newFields.splice(insertIndex, 0, draggedField);
      const newOrder = newFields.map((f) => f._id);

      await onArrange(newOrder);
    } catch (err) {
      console.error("Reordering failed:", err);
    } finally {
      resetDragState();
    }
  };

  const handleDragEnd = (e) => {
    if (e.target) e.target.style.opacity = "1";
    resetDragState();
  };

  const resetDragState = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (!fields || fields.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
        <p className="text-lg font-medium">No registration fields yet</p>
        <p className="text-sm">Click "Add Field" to create your first field.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full h-full pr-2">
      <div className="space-y-3 w-full">
        {fields.map((field, index) => (
          <div key={field._id} className="w-full">
            <DropZoneIndicator 
              isVisible={dragOverIndex === index && draggedIndex > index}
              position="top"
            />
            <div
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              <FieldItem
                field={field}
                index={index}
                onEdit={() => onEdit(index)}
                onDelete={() => onDelete(index)}
                onDragStart={!isMobile ? (e) => handleDragStart(e, index) : undefined}
                onDragEnd={!isMobile ? handleDragEnd : undefined}
                isDragging={!isMobile && draggedIndex === index}
                isDragOver={!isMobile && dragOverIndex === index}
                enableDrag={!isMobile}
              />
            </div>
            <DropZoneIndicator 
              isVisible={dragOverIndex === index && draggedIndex < index}
              position="bottom"
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

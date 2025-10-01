'use client'
import { useState, useEffect } from "react";
import { FieldItem } from "./FieldItem";
import { DropZoneIndicator } from "./DropZoneIndicator";

export function FieldsList({ fields, onEdit, onDelete, onArrange }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
    
    // Add some visual feedback
    setTimeout(() => {
      if (e.target) {
        e.target.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
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
    e.preventDefault();
    // Only clear if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null) {
      resetDragState();
      return;
    }

    // If dropping at the same position, do nothing
    if (draggedIndex === dropIndex || 
        (draggedIndex === dropIndex - 1 && dropIndex < fields.length)) {
      resetDragState();
      return;
    }

    try {
      // Create new order array
      const newFields = [...fields];
      const draggedField = newFields[draggedIndex];
      
      // Remove dragged item
      newFields.splice(draggedIndex, 1);
      
      // Calculate insert position
      let insertIndex = dropIndex;
      if (dropIndex > draggedIndex) {
        insertIndex = dropIndex - 1;
      }
      
      // Handle dropping at the end
      if (insertIndex >= newFields.length) {
        newFields.push(draggedField);
      } else {
        newFields.splice(insertIndex, 0, draggedField);
      }
      
      // Create order array of IDs
      const newOrder = newFields.map(field => field._id);
      
      console.log('Reordering from index', draggedIndex, 'to', dropIndex, 'final order:', newOrder);
      
      // Call the arrange function
      await onArrange(newOrder);
    } catch (error) {
      console.error('Failed to arrange fields:', error);
    } finally {
      resetDragState();
    }
  };

  const handleDragEnd = (e) => {
    // Reset visual state
    if (e.target) {
      e.target.style.opacity = '1';
    }
    resetDragState();
  };

  const resetDragState = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (!fields || fields.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
        <div className="space-y-2">
          <p className="text-lg font-medium">No registration fields yet</p>
          <p className="text-sm">Click "Add Field" to create your first registration field.</p>
          <p className="text-xs">You can then drag and drop to reorder them.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field._id}>
          {/* Drop zone indicator at the top of each item */}
          <DropZoneIndicator 
            isVisible={dragOverIndex === index && draggedIndex !== null && draggedIndex > index}
            position="top"
          />
          
          <div
            className={`transition-all duration-200`}
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
          
          {/* Drop zone indicator at the bottom of each item */}
          <DropZoneIndicator 
            isVisible={dragOverIndex === index && draggedIndex !== null && draggedIndex < index}
            position="bottom"
          />
          
          {/* Final drop zone at the end */}
          {index === fields.length - 1 && (
            <div
              className="h-4 flex items-center"
              onDragOver={(e) => handleDragOver(e, fields.length)}
              onDragEnter={(e) => handleDragEnter(e, fields.length)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, fields.length)}
            >
              <DropZoneIndicator 
                isVisible={dragOverIndex === fields.length && draggedIndex !== null}
                position="bottom"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

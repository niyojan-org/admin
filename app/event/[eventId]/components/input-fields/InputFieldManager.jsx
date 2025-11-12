'use client'
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconPlus, IconArrowsSort, IconAlertHexagon, IconLoader } from "@tabler/icons-react";
import { FieldsList } from "./FieldsList";
import { FieldFormDialog } from "./FieldFormDialog";
import { DeleteFieldDialog } from "./DeleteFieldDialog";
import { ArrangeFieldsDialog } from "./ArrangeFieldsDialog";
import { useFieldOperations } from "./hooks/useFieldOperations";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function InputFieldManager({ eventId, className }) {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArrangeDialog, setShowArrangeDialog] = useState(false);

  // Fetch fields on component mount
  useEffect(() => {
    if (eventId) {
      fetchFields();
    }
  }, [eventId]);

  const fetchFields = async () => {
    try {
      setLoading(true);
      let response;
      try {
        // Try new endpoint first
        response = await api.get(`/event/admin/dynamic-field/${eventId}`);
        setFields(response.data.dynamicFields || []);
      } catch (newApiError) {
        // Fallback to old endpoint
        response = await api.get(`/event/admin/${eventId}`);
        setFields(response.data.event?.inputFields || []);
      }
    } catch (error) {
      console.error('Failed to fetch fields:', error);
      toast.error("Failed to load fields");
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  const {
    fieldForm,
    setFieldForm,
    handleAddField,
    handleEditField,
    handleDeleteField,
    handleArrangeFields,
    resetForm
  } = useFieldOperations(eventId, {
    onFieldAdded: (data) => {
      setOperationLoading(false);
      // Update local fields state
      if (data.dynamicFields) {
        setFields(data.dynamicFields);
      } else if (data.event?.inputFields) {
        setFields(data.event.inputFields);
      } else {
        fetchFields(); // Fallback to refetch
      }
      setOpenDialog(false);
      resetForm();
    },
    onFieldUpdated: (data) => {
      setOperationLoading(false);
      // Update local fields state
      if (data.dynamicFields) {
        setFields(data.dynamicFields);
      } else if (data.event?.inputFields) {
        setFields(data.event.inputFields);
      } else {
        fetchFields(); // Fallback to refetch
      }
      setEditDialog(false);
      setEditIndex(null);
      resetForm();
    },
    onFieldDeleted: (data) => {
      setOperationLoading(false);
      // Update local fields state
      if (data.dynamicFields) {
        setFields(data.dynamicFields);
      } else if (data.event?.inputFields) {
        setFields(data.event.inputFields);
      } else {
        fetchFields(); // Fallback to refetch
      }
      setShowDeleteDialog(false);
      setDeleteIndex(null);
    },
    onFieldsArranged: (data) => {
      setOperationLoading(false);
      // Update local fields state
      if (data.dynamicFields) {
        setFields(data.dynamicFields);
      } else if (data.event?.inputFields) {
        setFields(data.event.inputFields);
      } else {
        fetchFields(); // Fallback to refetch
      }
      setShowArrangeDialog(false);
    }
  });

  const openEdit = (index) => {
    const field = fields[index];
    setEditIndex(index);
    setFieldForm({
      label: field.label,
      name: field.name,
      type: field.type,
      required: field.required,
      options: field.options || [],
      placeholder: field.placeholder || "",
      maxLength: field.maxLength || "",
      min: field.min || "",
      max: field.max || ""
    });
    setEditDialog(true);
  };

  const openAdd = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleAddFieldWithLoading = async () => {
    setOperationLoading(true);
    try {
      await handleAddField();
    } catch (error) {
      setOperationLoading(false);
    }
  };

  const handleEditFieldWithLoading = async () => {
    setOperationLoading(true);
    try {
      const fieldId = fields[editIndex]?._id;
      if (fieldId) {
        await handleEditField(fieldId);
      }
    } catch (error) {
      setOperationLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteIndex !== null) {
      setOperationLoading(true);
      try {
        const fieldId = fields[deleteIndex]?._id;
        if (fieldId) {
          await handleDeleteField(fieldId);
        }
      } catch (error) {
        setOperationLoading(false);
      }
    }
  };

  const handleArrangeWithLoading = async (newOrder) => {
    setOperationLoading(true);
    try {
      await handleArrangeFields(newOrder);
    } catch (error) {
      setOperationLoading(false);
    }
  };

  if (!eventId) {
    return (
      <Card className={cn("w-full h-full my-auto items-center flex-col justify-center", className)}>
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-2">
            <IconAlertHexagon className='h-20 w-20' />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">No Event Selected</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Please select an event to view and manage its tickets
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full h-[480px] flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          Registration Fields ({fields.length || 0})
        </CardTitle>

        <div className="flex items-center gap-2">
          {/* Arrange Button - Show only if there are 2+ fields */}
          {fields && fields.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArrangeDialog(true)}
              className="hidden sm:flex"
              disabled={loading || operationLoading}
            >
              {operationLoading ? (
                <IconLoader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <IconArrowsSort className="w-4 h-4 mr-2" />
              )}
              Arrange
            </Button>
          )}

          {/* Mobile Arrange Button */}
          {fields && fields.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArrangeDialog(true)}
              className="sm:hidden"
              title="Arrange fields"
              disabled={loading || operationLoading}
            >
              {operationLoading ? (
                <IconLoader className="w-4 h-4 animate-spin" />
              ) : (
                <IconArrowsSort className="w-4 h-4" />
              )}
            </Button>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            onClick={openAdd}
            disabled={loading || operationLoading}
          >
            {operationLoading ? (
              <IconLoader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <IconPlus className="w-4 h-4 mr-2" />
            )}
            Add Field
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {loading ? (
          <div className="space-y-4 px-6">
            {/* Loading skeleton for fields */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : operationLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <IconLoader className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Processing...</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full w-full">
            <div className="pb-6 space-y-3">
              <FieldsList
                fields={fields}
                onEdit={openEdit}
                onDelete={(index) => {
                  setDeleteIndex(index);
                  setShowDeleteDialog(true);
                }}
                onArrange={handleArrangeFields}
              />
            </div>
          </ScrollArea>
        )}

        {/* Add Field Dialog */}
        <FieldFormDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          fieldForm={fieldForm}
          setFieldForm={setFieldForm}
          onSubmit={handleAddFieldWithLoading}
          title="Add Registration Field"
          isEdit={false}
          loading={operationLoading}
        />

        {/* Edit Field Dialog */}
        <FieldFormDialog
          open={editDialog}
          onOpenChange={setEditDialog}
          fieldForm={fieldForm}
          setFieldForm={setFieldForm}
          onSubmit={handleEditFieldWithLoading}
          title="Edit Registration Field"
          isEdit={true}
          loading={operationLoading}
        />

        {/* Delete Field Dialog */}
        <DeleteFieldDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmDelete}
          fieldName={deleteIndex !== null ? fields[deleteIndex]?.label : ""}
          loading={operationLoading}
        />

        {/* Arrange Fields Dialog */}
        <ArrangeFieldsDialog
          open={showArrangeDialog}
          onOpenChange={setShowArrangeDialog}
          fields={fields}
          onArrange={handleArrangeWithLoading}
          loading={operationLoading}
        />
      </CardContent>
    </Card>
  );
}

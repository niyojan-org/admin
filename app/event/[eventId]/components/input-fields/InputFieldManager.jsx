'use client'
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus, IconArrowsSort } from "@tabler/icons-react";
import { FieldsList } from "./FieldsList";
import { FieldFormDialog } from "./FieldFormDialog";
import { DeleteFieldDialog } from "./DeleteFieldDialog";
import { ArrangeFieldsDialog } from "./ArrangeFieldsDialog";
import { useFieldOperations } from "./hooks/useFieldOperations";
import api from "@/lib/api";
import { toast } from "sonner";

export function InputFieldManager({ eventId }) {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArrangeDialog, setShowArrangeDialog] = useState(false);

  // Fetch fields on component mount
  useEffect(() => {
    fetchFields();
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

  const confirmDelete = async () => {
    if (deleteIndex !== null) {
      const fieldId = fields[deleteIndex]?._id;
      if (fieldId) {
        await handleDeleteField(fieldId);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
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
            >
              <IconArrowsSort className="w-4 h-4 mr-2" />
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
            >
              <IconArrowsSort className="w-4 h-4" />
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={openAdd}>
            <IconPlus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading fields...</div>
          </div>
        ) : (
          <FieldsList
            fields={fields}
            onEdit={openEdit}
            onDelete={(index) => {
              setDeleteIndex(index);
              setShowDeleteDialog(true);
            }}
            onArrange={handleArrangeFields}
          />
        )}

        {/* Add Field Dialog */}
        <FieldFormDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          fieldForm={fieldForm}
          setFieldForm={setFieldForm}
          onSubmit={handleAddField}
          title="Add Registration Field"
          isEdit={false}
        />

        {/* Edit Field Dialog */}
        <FieldFormDialog
          open={editDialog}
          onOpenChange={setEditDialog}
          fieldForm={fieldForm}
          setFieldForm={setFieldForm}
          onSubmit={() => {
            const fieldId = fields[editIndex]?._id;
            if (fieldId) {
              handleEditField(fieldId);
            }
          }}
          title="Edit Registration Field"
          isEdit={true}
        />

        {/* Delete Field Dialog */}
        <DeleteFieldDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmDelete}
          fieldName={deleteIndex !== null ? fields[deleteIndex]?.label : ""}
        />

        {/* Arrange Fields Dialog */}
        <ArrangeFieldsDialog
          open={showArrangeDialog}
          onOpenChange={setShowArrangeDialog}
          fields={fields}
          onArrange={handleArrangeFields}
        />
      </CardContent>
    </Card>
  );
}

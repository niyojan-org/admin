import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconDownload, IconQrcode, IconTrash, IconTypography, IconPhoto, IconLoader2 } from "@tabler/icons-react";
import ImageUpload from "./ImageUpload";
import HistoryControls from "./HistoryControls";
import FieldSelector from "./FieldSelector";
import FieldEditor from "./FieldEditor";
import TemplateMetadata from "./TemplateMetadata";
import VariableReference from "./VariableReference";

export default function EditorSidebar({
  onImageUpload,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  selectedField,
  onFieldChange,
  onAddField,
  fields,
  editingField,
  onUpdateField,
  onDeleteField,
  onCloseEditor,
  onExport,
  selectedId,
  onSelectField,
  templateName,
  templateType,
  onTemplateNameChange,
  onTemplateTypeChange,
  isExporting
}) {
  const getFieldIcon = (field) => {
    if (field.isQR) return <IconQrcode className="w-5 h-5" />;
    if (field.isImage) return <IconPhoto className="w-5 h-5" />;
    return <IconTypography className="w-5 h-5" />;
  };

  const getFieldLabel = (field) => {
    if (field.isQR) return "QR Code";
    if (field.isImage) return "Image";
    return field.key;
  };

  return (
    <div className="w-full lg:w-96 flex flex-col gap-2 min-h-0">
      {/* Header */}

      <div className="flex justify-between">
        <div className="">
          <p className="text-2xl font-semibold tracking-wide">Template Editor</p>
          <p className="text-xs text-muted-foreground">Design your {templateType || 'template'}</p>
        </div>
        <Button className="" size="sm" onClick={onExport} disabled={isExporting}>
          {isExporting ? (
            <>
              <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <IconDownload className="w-4 h-4 mr-2" />
              Export
            </>
          )}
        </Button>
      </div>

      {/* Template Metadata */}
      <TemplateMetadata
        templateName={templateName}
        templateType={templateType}
        onNameChange={onTemplateNameChange}
        onTypeChange={onTemplateTypeChange}
      />

      {/* Placed Elements */}
      <div className="shrink-0 p-2 sm:px-2 bg-card border rounded-md">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Placed Elements</p>
          <FieldSelector
            selectedField={selectedField}
            onFieldChange={onFieldChange}
            onAddField={onAddField}
            existingFields={fields}
          />
        </div>
        <ScrollArea className="py-2 h-36">
          <div className="flex flex-col gap-1.5">
            {fields.length === 0 ? (
              <p className="text-xs text-muted-foreground">No elements added</p>
            ) : (
              fields.map((f) => (
                <div className="flex items-center h-full gap-4" key={f.id}>
                  <div
                    variant={selectedId === f.id ? "default" : "outline"}
                    className={`flex w-full h-full py-1.5 items-center gap-2 hover:bg-accent cursor-pointer px-2 hover:rounded-md ${selectedId === f.id ? "bg-accent rounded-md" : ""}`}
                    onClick={() => onSelectField(f)}
                  >
                    {getFieldIcon(f)}
                    <span className="capitalize">{getFieldLabel(f)}</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="ml-auto"
                    onClick={() => onDeleteField(f.id)}
                  >
                    <IconTrash className="w-5 h-5" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Controls */}
      <Card className="flex-1 overflow-hidden p-0 sm:px-0 rounded-md min-h-0">
        <ScrollArea className="h-full">
          <CardContent className="space-y-3 p-3">
            {/* Change Background */}
            <ImageUpload onImageUpload={onImageUpload} />
            <Separator />

            {/* History */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-medium text-muted-foreground">History</h4>
              <HistoryControls
                onUndo={onUndo}
                onRedo={onRedo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </div>

            {/* Edit Selected */}
            {editingField && (
              <>
                <Separator />
                <div className="space-y-1.5">
                  <h4 className="text-xs font-medium text-muted-foreground">Edit Selected</h4>
                  <FieldEditor
                    field={editingField}
                    onUpdate={onUpdateField}
                    onDelete={onDeleteField}
                    onClose={onCloseEditor}
                  />
                </div>
              </>
            )}

            {/* Variable Reference */}
            <Separator />
            <VariableReference />
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}

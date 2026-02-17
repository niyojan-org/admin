import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { IconPlus, IconQrcode, IconTypography } from "@tabler/icons-react";
import { FIELD_LIBRARY } from "../constants";

export default function FieldSelector({ selectedField, onFieldChange, onAddField, existingFields }) {
  const [open, setOpen] = useState(false);
  const [localSelected, setLocalSelected] = useState(selectedField || "");
  const selectedMeta = useMemo(() => FIELD_LIBRARY.find(f => f.key === localSelected), [localSelected]);
  const [qrSize, setQrSize] = useState(150);

  const handleOpen = () => {
    setLocalSelected(selectedField || "");
    setOpen(true);
  };

  const handleAdd = () => {
    if (!localSelected) return;
    const overrides = selectedMeta?.isQR ? { size: qrSize, width: qrSize, height: qrSize } : {};
    onAddField(localSelected, overrides);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="" onClick={handleOpen}>
          <IconPlus className="w-4 h-4 mr-2" />
          Add Element
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Element</DialogTitle>
          <DialogDescription>Select a field to add to the template.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            {FIELD_LIBRARY.map(f => {
              const disabled = false;
              const active = localSelected === f.key;
              return (
                <Button
                  key={f.key}
                  variant={active ? "default" : "outline"}
                  disabled={disabled}
                  size="sm"
                  className="justify-start"
                  onClick={() => setLocalSelected(f.key)}
                >
                  {f.isQR ? <IconQrcode className="w-4 h-4 mr-2" /> : <IconTypography className="w-4 h-4 mr-2" />}
                  <span className="text-sm">
                    {f.label} {f.mandatory && <span className="text-destructive">*</span>}
                  </span>
                </Button>
              );
            })}
          </div>

          {selectedMeta?.isQR && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <Label className="text-xs">Size</Label>
                <span className="text-muted-foreground">{qrSize}px</span>
              </div>
              <Slider
                value={[qrSize]}
                onValueChange={([size]) => setQrSize(size)}
                min={50}
                max={300}
                step={10}
                className="py-1"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!localSelected}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

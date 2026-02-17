import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  IconTrash,
  IconX,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconQrcode,
  IconTypography,
  IconPhoto
} from "@tabler/icons-react";
import { FONTS, FONT_WEIGHTS, QR_ERROR_CORRECTION_LEVELS } from "../constants";

export default function FieldEditor({ field, onUpdate, onDelete, onClose }) {
  if (!field) return null;

  // Image Field Editor
  if (field.isImage) {
    return (
      <div className="space-y-3 p-2.5 bg-muted/50 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <IconPhoto className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Image</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={onClose}
          >
            <IconX className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Image URL</Label>
          <Input
            type="text"
            value={field.imageUrl || ""}
            onChange={(e) => onUpdate(field.id, { imageUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
            className="h-8 text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Width</Label>
            <Input
              type="number"
              value={field.width || 150}
              onChange={(e) => onUpdate(field.id, { width: parseInt(e.target.value) || 150 })}
              min={10}
              max={1000}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Height</Label>
            <Input
              type="number"
              value={field.height || 80}
              onChange={(e) => onUpdate(field.id, { height: parseInt(e.target.value) || 80 })}
              min={10}
              max={1000}
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Opacity</Label>
            <Slider
              value={[(field.opacity || 1) * 100]}
              onValueChange={([val]) => onUpdate(field.id, { opacity: val / 100 })}
              min={0}
              max={100}
              step={5}
              className="py-1"
            />
            <span className="text-[10px] text-muted-foreground">{Math.round((field.opacity || 1) * 100)}%</span>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Rotation</Label>
            <Input
              type="number"
              value={field.rotation || 0}
              onChange={(e) => onUpdate(field.id, { rotation: parseInt(e.target.value) || 0 })}
              min={0}
              max={360}
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="text-[10px] text-muted-foreground">
          Position: ({Math.round(field.x)}, {Math.round(field.y)})
        </div>

        <Button
          variant="destructive"
          size="sm"
          className="w-full h-7 text-xs"
          onClick={() => onDelete(field.id)}
        >
          <IconTrash className="w-3 h-3 mr-1.5" />
          Remove
        </Button>
      </div>
    );
  }

  // QR Code Field Editor
  if (field.isQR) {
    return (
      <div className="space-y-3 p-2.5 bg-muted/50 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <IconQrcode className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">QR Code</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={onClose}
          >
            <IconX className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <Label className="text-xs">Size</Label>
            <span className="text-muted-foreground">{field.size}px</span>
          </div>
          <Slider
            value={[field.size]}
            onValueChange={([size]) => {
              onUpdate(field.id, { size, width: size, height: size });
            }}
            min={50}
            max={300}
            step={10}
            className="py-1"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Error Correction Level</Label>
          <Select
            value={field.errorCorrectionLevel || "M"}
            onValueChange={(val) => onUpdate(field.id, { errorCorrectionLevel: val })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QR_ERROR_CORRECTION_LEVELS.map(level => (
                <SelectItem key={level.value} value={level.value} className="text-xs">
                  <div className="flex flex-col">
                    <span>{level.label}</span>
                    <span className="text-[10px] text-muted-foreground">{level.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Opacity</Label>
            <Slider
              value={[(field.opacity || 1) * 100]}
              onValueChange={([val]) => onUpdate(field.id, { opacity: val / 100 })}
              min={0}
              max={100}
              step={5}
              className="py-1"
            />
            <span className="text-[10px] text-muted-foreground">{Math.round((field.opacity || 1) * 100)}%</span>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Rotation</Label>
            <Input
              type="number"
              value={field.rotation || 0}
              onChange={(e) => onUpdate(field.id, { rotation: parseInt(e.target.value) || 0 })}
              min={0}
              max={360}
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="text-[10px] text-muted-foreground">
          Position: ({Math.round(field.x)}, {Math.round(field.y)})
        </div>

        <Button
          variant="destructive"
          size="sm"
          className="w-full h-7 text-xs"
          onClick={() => onDelete(field.id)}
        >
          <IconTrash className="w-3 h-3 mr-1.5" />
          Remove
        </Button>
      </div>
    );
  }

  // Text Field Editor
  return (
    <div className="space-y-3 p-2.5 bg-muted/50 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <IconTypography className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm capitalize">{field.key}</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-5 w-5"
          onClick={onClose}
        >
          <IconX className="h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <Label className="text-xs">Font Size</Label>
          <span className="text-muted-foreground">{field.fontSize}px</span>
        </div>
        <Slider
          value={[field.fontSize]}
          onValueChange={([fontSize]) => onUpdate(field.id, { fontSize })}
          min={12}
          max={120}
          step={1}
          className="py-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={field.color}
              onChange={(e) => onUpdate(field.id, { color: e.target.value })}
              className="w-8 h-8 p-0.5 cursor-pointer"
            />
            <Input
              type="text"
              value={field.color}
              onChange={(e) => onUpdate(field.id, { color: e.target.value })}
              className="flex-1 font-mono text-xs h-8"
              placeholder="#000000"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Font</Label>
          <Select
            value={field.fontFamily}
            onValueChange={(val) => onUpdate(field.id, { fontFamily: val })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map(font => (
                <SelectItem key={font} value={font} className="text-xs">
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Font Weight</Label>
          <Select
            value={field.fontWeight || "normal"}
            onValueChange={(val) => onUpdate(field.id, { fontWeight: val })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_WEIGHTS.map(weight => (
                <SelectItem key={weight.value} value={weight.value} className="text-xs">
                  {weight.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Line Height</Label>
          <Input
            type="number"
            value={field.lineHeight || 1.2}
            onChange={(e) => onUpdate(field.id, { lineHeight: parseFloat(e.target.value) || 1.2 })}
            min={0.5}
            max={3}
            step={0.1}
            className="h-8 text-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Alignment</Label>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={field.align === "left" ? "default" : "outline"}
            className="flex-1 h-7"
            onClick={() => onUpdate(field.id, { align: "left" })}
          >
            <IconAlignLeft className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant={field.align === "center" ? "default" : "outline"}
            className="flex-1 h-7"
            onClick={() => onUpdate(field.id, { align: "center" })}
          >
            <IconAlignCenter className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant={field.align === "right" ? "default" : "outline"}
            className="flex-1 h-7"
            onClick={() => onUpdate(field.id, { align: "right" })}
          >
            <IconAlignRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Opacity</Label>
          <Slider
            value={[(field.opacity || 1) * 100]}
            onValueChange={([val]) => onUpdate(field.id, { opacity: val / 100 })}
            min={0}
            max={100}
            step={5}
            className="py-1"
          />
          <span className="text-[10px] text-muted-foreground">{Math.round((field.opacity || 1) * 100)}%</span>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Rotation</Label>
          <Input
            type="number"
            value={field.rotation || 0}
            onChange={(e) => onUpdate(field.id, { rotation: parseInt(e.target.value) || 0 })}
            min={0}
            max={360}
            className="h-8 text-xs"
          />
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground">
        Position: ({Math.round(field.x)}, {Math.round(field.y)})
      </div>

      <Button
        variant="destructive"
        size="sm"
        className="w-full h-7 text-xs"
        onClick={() => onDelete(field.id)}
      >
        <IconTrash className="w-3 h-3 mr-1.5" />
        Remove
      </Button>
    </div>
  );
}

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";

export default function ImageUpload({ onImageUpload }) {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onImageUpload({ file, dataUrl: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <Button
        variant="outline"
        className="w-full h-8 text-xs"
        onClick={() => fileInputRef.current?.click()}
      >
        <IconRefresh className="w-3.5 h-3.5 mr-1.5" />
        Change Background
      </Button>
    </div>
  );
}

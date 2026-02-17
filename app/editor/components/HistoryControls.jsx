import { Button } from "@/components/ui/button";
import { IconArrowBackUp, IconArrowForwardUp } from "@tabler/icons-react";

export default function HistoryControls({ onUndo, onRedo, canUndo, canRedo }) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="flex-1 h-8 text-xs"
        onClick={onUndo}
        disabled={!canUndo}
      >
        <IconArrowBackUp className="w-3.5 h-3.5 mr-1.5" />
        Undo
      </Button>
      <Button
        variant="outline"
        className="flex-1 h-8 text-xs"
        onClick={onRedo}
        disabled={!canRedo}
      >
        <IconArrowForwardUp className="w-3.5 h-3.5 mr-1.5" />
        Redo
      </Button>
    </div>
  );
}

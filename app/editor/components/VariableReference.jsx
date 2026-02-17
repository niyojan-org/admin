import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AVAILABLE_VARIABLES } from "../constants";
import { IconCopy, IconVariable } from "@tabler/icons-react";

export default function VariableReference() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(`{{${text}}}`);
  };

  return (
    <div className="space-y-2 p-3 bg-card border rounded-md">
      <div className="flex items-center gap-2">
        <IconVariable className="w-4 h-4" />
        <h4 className="font-semibold text-sm">Available Variables</h4>
      </div>
      <p className="text-xs text-muted-foreground">
        Click to copy variable syntax
      </p>
      <ScrollArea className="h-48">
        <div className="grid gap-1.5">
          {AVAILABLE_VARIABLES.map((variable) => (
            <button
              key={variable.key}
              onClick={() => copyToClipboard(variable.key)}
              className="flex items-start justify-between p-2 rounded-md hover:bg-accent transition-colors text-left group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{variable.label}</span>
                  <IconCopy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <code className="text-[10px] text-muted-foreground block mt-0.5">
                  {`{{${variable.key}}}`}
                </code>
                <span className="text-[10px] text-muted-foreground/70 block mt-0.5">
                  Example: {variable.example}
                </span>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

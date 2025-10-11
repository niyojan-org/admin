"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { IconPaperclip, IconX } from "@tabler/icons-react";
import { ContactFileUpload } from "./ContactFileUpload";

export const AttachmentDialog = ({ files, onFileChange, onRemoveFile, disabled }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full h-10 justify-start gap-2"
          disabled={disabled}
        >
          <IconPaperclip className="h-4 w-4" />
          <span className="flex-1 text-left">
            {files.length > 0
              ? `${files.length} file${files.length > 1 ? "s" : ""} attached`
              : "Add Attachments (Optional)"}
          </span>
          {files.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {files.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconPaperclip className="h-5 w-5" />
            Attach Files
          </DialogTitle>
          <DialogDescription>
            Upload files to include with your message. Maximum 5 files, 10MB each, 25MB total.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <ContactFileUpload
            files={files}
            onFileChange={onFileChange}
            onRemoveFile={onRemoveFile}
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {files.length > 0 ? (
              <span>
                {files.length} file{files.length > 1 ? "s" : ""} ready to upload
              </span>
            ) : (
              <span>No files attached</span>
            )}
          </div>
          <Button onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

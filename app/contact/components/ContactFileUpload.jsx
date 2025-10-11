"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconUpload, IconX, IconFile, IconFileTypePdf, IconFileTypeDoc, IconPhoto } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export const ContactFileUpload = ({ files, onFileChange, onRemoveFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFileChange(filesArray);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFileChange(filesArray);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) {
      return <IconPhoto className="h-5 w-5 text-blue-500" />;
    } else if (file.type === "application/pdf") {
      return <IconFileTypePdf className="h-5 w-5 text-red-500" />;
    } else if (
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return <IconFileTypeDoc className="h-5 w-5 text-blue-600" />;
    } else {
      return <IconFile className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          files.length >= 5 && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => files.length < 5 && fileInputRef.current?.click()}
      >
        <div className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <IconUpload className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <h4 className="font-medium mb-1">
            {dragActive ? "Drop files here" : "Upload Attachments"}
          </h4>
          
          <p className="text-sm text-muted-foreground mb-2">
            Drag & drop or click to browse
          </p>
          
          <p className="text-xs text-muted-foreground">
            Max 5 files • 10MB each • 25MB total
          </p>
          
          <p className="text-xs text-muted-foreground mt-1">
            Supported: JPG, PNG, GIF, PDF, DOC, DOCX, TXT
          </p>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
        onChange={handleFileInput}
        className="hidden"
        disabled={files.length >= 5}
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Attached Files ({files.length}/5)
            </p>
            <p className="text-xs text-muted-foreground">
              Total: {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))}
            </p>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <Card key={index} className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFile(index)}
                    className="flex-shrink-0 h-8 w-8"
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconUpload, IconPhoto, IconFileUpload } from "@tabler/icons-react";

export default function ImageUploadScreen({ onImageUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onImageUpload({ file, dataUrl: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onImageUpload({ file, dataUrl: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Card className="w-full max-w-lg backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <IconPhoto className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Ticket Template Editor
            </h1>
            <p className="text-muted-foreground">
              Upload a base image to start designing your ticket template
            </p>
          </div>

          <div
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all duration-200"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <IconFileUpload className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium mb-1">
                  Drop your image here
                </p>
                <p className="text-muted-foreground text-sm">
                  or click to browse
                </p>
              </div>
              <p className="text-muted-foreground/60 text-xs">
                Supports: PNG, JPG, JPEG, WebP
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            className="w-full mt-6"
            onClick={() => fileInputRef.current?.click()}
          >
            <IconUpload className="w-4 h-4 mr-2" />
            Upload Base Image
          </Button>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-medium mb-2">
              Tips for best results:
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use high-resolution images for better print quality</li>
              <li>• The editor will maintain your image&apos;s aspect ratio</li>
              <li>• QR code and Ticket Code are mandatory fields</li>
              <li>• You can customize fonts, colors, and positions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Upload, X, Crop, RotateCw, ZoomIn, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconLoader2 } from "@tabler/icons-react";

/**
 * Helper function to create an image from URL
 */
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

/**
 * Helper function to get cropped image
 */
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, "image/jpeg", 0.92);
    });
}

export function ImageCropUpload({
    value,
    onChange,
    onUploadComplete,
    className,
    aspectRatio = 1,
    maxSize = 5 * 1024 * 1024, // 5MB default
    uploadFn,
    placeholder = "Upload an image",
    label = "Image",
    required = false,
}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropDialog, setShowCropDialog] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

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
            const file = e.dataTransfer.files[0];
            handleFileSelection(file);
        }
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            handleFileSelection(file);
        }
    };

    const handleFileSelection = (file) => {
        setError(null);

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            setError(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setImageSrc(reader.result?.toString() || "");
            setShowCropDialog(true);
        });
        reader.readAsDataURL(file);
    };

    const handleCropSave = async () => {
        try {
            setUploading(true);
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);

            // Create a File object from the blob
            const croppedFile = new File(
                [croppedBlob],
                selectedFile.name.replace(/\.(png|jpg|jpeg|webp)$/i, '.jpg'),
                { type: "image/jpeg" }
            );

            // Upload the cropped image if upload function is provided
            if (uploadFn) {
                const result = await uploadFn(croppedFile);
                if (onUploadComplete) {
                    onUploadComplete(result);
                }
                if (result?.url) {
                    onChange(result.url);
                }
            } else {
                // If no upload function, just convert to data URL
                const dataUrl = URL.createObjectURL(croppedBlob);
                onChange(dataUrl);
            }

            setShowCropDialog(false);
            setImageSrc(null);
            setSelectedFile(null);
            resetCropSettings();
        } catch (err) {
            console.error("Error cropping image:", err);
            setError("Failed to process image");
        } finally {
            setUploading(false);
        }
    };

    const resetCropSettings = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setCroppedAreaPixels(null);
    };

    const handleCancel = () => {
        setShowCropDialog(false);
        setImageSrc(null);
        setSelectedFile(null);
        resetCropSettings();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemove = () => {
        onChange("");
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* Label */}
            {label && (
                <Label className="flex items-center gap-1">
                    {label}
                    {required && <span className="text-destructive">*</span>}
                </Label>
            )}

            {/* Preview or Upload Area */}
            {value ? (
                <Card className="relative overflow-hidden">
                    <div className="aspect-square w-full max-w-xs">
                        <img
                            src={value}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                e.target.src = "/placeholder-image.png";
                            }}
                        />
                    </div>
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={handleRemove}
                    >
                        <X className="size-4" />
                    </Button>
                </Card>
            ) : (
                <Card
                    className={cn(
                        "border-2 border-dashed transition-colors cursor-pointer",
                        dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Upload className="size-8 text-primary" />
                            </div>
                        </div>

                        <h4 className="font-medium mb-1">
                            {dragActive ? "Drop image here" : placeholder}
                        </h4>

                        <p className="text-sm text-muted-foreground mb-2">
                            Drag & drop or click to browse
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Supported: JPG, PNG, GIF, WebP
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB
                        </p>
                    </div>
                </Card>
            )}

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
            />

            {/* Error Message */}
            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* Crop Dialog */}
            <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Crop className="size-5" />
                            Crop Image
                        </DialogTitle>
                        <DialogDescription>
                            Adjust the crop area, zoom, and rotation to get the perfect image.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Crop Area */}
                        <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
                            {imageSrc && (
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotation}
                                    aspect={aspectRatio}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                />
                            )}
                        </div>

                        {/* Controls */}
                        <div className="space-y-4">
                            {/* Zoom Control */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm">
                                    <ZoomIn className="size-4" />
                                    Zoom
                                </Label>
                                <Slider
                                    value={[zoom]}
                                    onValueChange={(value) => setZoom(value[0])}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    className="w-full"
                                />
                            </div>

                            {/* Rotation Control */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm">
                                    <RotateCw className="size-4" />
                                    Rotation
                                </Label>
                                <Slider
                                    value={[rotation]}
                                    onValueChange={(value) => setRotation(value[0])}
                                    min={0}
                                    max={360}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* File Info */}
                        {selectedFile && (
                            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                <ImageIcon className="size-5 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(selectedFile.size)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleCropSave} disabled={uploading}>
                            {uploading ? (
                                <>
                                    <IconLoader2 className="mr-2 size-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                "Save & Upload"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

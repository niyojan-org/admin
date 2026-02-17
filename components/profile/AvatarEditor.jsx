"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IconCamera,
  IconUpload,
  IconTrash,
  IconX,
  IconLoader2,
  IconInfoCircle,
  IconPhoto,
  IconZoomIn,
  IconZoomOut,
  IconRotateClockwise,
  IconCheck,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import api from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import Cropper from "react-easy-crop";
import { cn } from "@/lib/utils";

/**
 * Helper function to create image from URL
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

export function AvatarEditor({ user, triggerButton }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState("select"); // 'select' | 'crop' | 'preview'
  const fileInputRef = useRef(null);
  const { updateUser } = useUserStore();

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result?.toString() || "");
      setStep("crop");
    });
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      
      // Create file from blob
      const croppedFile = new File([croppedBlob], selectedFile.name, {
        type: "image/jpeg",
      });

      // Upload the cropped image
      await uploadAvatar(croppedFile);
    } catch (error) {
      console.error("Crop error:", error);
      toast.error("Failed to process image. Please try again.");
    }
  };

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "avatars");

    try {
      setIsUploading(true);

      // Upload file to server
      const uploadRes = await api.post("/util/upload", formData);
      if (uploadRes.status === 200) {
        const avatarURL = uploadRes.data.file.url;

        // Update user profile with new avatar
        const success = await updateUser({ avatar: avatarURL });

        if (success) {
          toast.success("Profile picture updated!");
          handleClose();
        }
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload avatar"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true);
      const success = await updateUser({ avatar: "" });

      if (success) {
        toast.success("Avatar removed successfully!");
        handleClose();
      }
    } catch (error) {
      toast.error("Failed to remove avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset state after animation
    setTimeout(() => {
      setSelectedFile(null);
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setStep("select");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 200);
  };

  const handleBack = () => {
    setImageSrc(null);
    setSelectedFile(null);
    setStep("select");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="gap-2">
            <IconCamera className="h-4 w-4" />
            Edit Avatar
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <IconCamera className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <span className="truncate">
              {step === "crop" ? "Adjust Your Photo" : "Update Profile Picture"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {step === "crop"
              ? "Crop and adjust your photo to fit perfectly"
              : "Upload a new profile picture to personalize your account"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* SELECT STEP */}
          {step === "select" && (
            <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
              {/* Current Avatar Preview */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl"></div>
                  <Avatar className="relative h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-xl">
                    <AvatarImage
                      src={user?.avatar}
                      alt={user?.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl sm:text-3xl font-bold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Current profile picture
                </p>
              </div>

              {/* Guidelines */}
              <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                <IconInfoCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 space-y-1.5 sm:space-y-2">
                  <p className="font-semibold">Image Guidelines:</p>
                  <ul className="space-y-0.5 sm:space-y-1 text-xs text-blue-600 dark:text-blue-400">
                    <li>• Formats: JPG, PNG, GIF, WebP</li>
                    <li>• Max size: 2MB</li>
                    <li>• Best: Square images</li>
                    <li>• Crop & adjust after upload</li>
                  </ul>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="grid gap-2 sm:gap-3">
                <Button
                  size="lg"
                  className="w-full gap-2 h-11 sm:h-12"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IconUpload className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Choose New Picture</span>
                </Button>

                {user?.avatar && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2 h-11 sm:h-12 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                    onClick={handleRemoveAvatar}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <IconLoader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span className="text-sm sm:text-base">Removing...</span>
                      </>
                    ) : (
                      <>
                        <IconTrash className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-sm sm:text-base">Remove Picture</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* CROP STEP */}
          {step === "crop" && imageSrc && (
            <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
              {/* Cropper Area */}
              <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] bg-muted/30 rounded-lg overflow-hidden border-2 border-dashed border-border">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  cropShape="round"
                  showGrid={false}
                />
              </div>

              {/* Controls */}
              <div className="space-y-3 sm:space-y-4 bg-muted/50 rounded-lg p-3 sm:p-4">
                {/* Zoom Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                      <IconZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>Zoom</span>
                    </label>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {Math.round(zoom * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[zoom]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={(value) => setZoom(value[0])}
                    className="w-full"
                  />
                </div>

                {/* Rotation Control */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                      <IconRotateClockwise className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>Rotation</span>
                    </label>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {rotation}°
                    </span>
                  </div>
                  <Slider
                    value={[rotation]}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={(value) => setRotation(value[0])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* File Info */}
              {selectedFile && (
                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <IconPhoto className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Max 2MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="gap-2 flex-col sm:flex-row">
          {step === "crop" && (
            <>
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isUploading}
                className="gap-2 w-full sm:w-auto order-2 sm:order-1"
              >
                <IconX className="h-4 w-4" />
                <span className="text-sm sm:text-base">Back</span>
              </Button>
              <Button
                onClick={handleCropConfirm}
                disabled={isUploading}
                className="gap-2 w-full sm:w-auto order-1 sm:order-2"
              >
                {isUploading ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm sm:text-base">Uploading...</span>
                  </>
                ) : (
                  <>
                    <IconCheck className="h-4 w-4" />
                    <span className="text-sm sm:text-base">Save Photo</span>
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

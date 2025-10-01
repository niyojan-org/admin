"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Utility: Convert File to base64
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const defaultOptions = {
  type: "canvas",
  width: 10,
  height: 10,
  data: "https://www.orgatick.in",
  margin: 0,
  qrOptions: {
    typeNumber: 0,
    mode: "Byte",
    errorCorrectionLevel: "Q",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
    excavate: true,
  },
  dotsOptions: {
    type: "square",
    color: "#000000",
  },
  backgroundOptions: {
    color: "#ffffff",
  },
  cornersSquareOptions: {
    type: "square",
    color: "#000000",
  },
  cornersDotOptions: {
    type: "square",
    color: "#000000",
  },
};


import PropTypes from "prop-types";
import { ScrollArea } from "@radix-ui/react-scroll-area";

function GenerateQR({ qrData, setQrData }) {
  const qrRef = useRef(null);
  const qrInstance = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [dotColor, setDotColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dotShape, setDotShape] = useState("square");
  // Download size only, preview is always fixed
  const [downloadWidth, setDownloadWidth] = useState(400);
  const [downloadHeight, setDownloadHeight] = useState(400);
  const [cornerSquareShape, setCornerSquareShape] = useState("square");
  const [cornerSquareColor, setCornerSquareColor] = useState("#000000");
  const [cornerDotShape, setCornerDotShape] = useState("square");
  const [cornerDotColor, setCornerDotColor] = useState("#000000");
  const [logoFile, setLogoFile] = useState(null);
  const [logoSize, setLogoSize] = useState(0.4);
  const [logoMargin, setLogoMargin] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qrReady, setQrReady] = useState(false);

  // Set default qrData only once
  useEffect(() => {
    if (!qrData) {
      setQrData(process.env.NEXT_PUBLIC_CLIENT_URL || "https://example.com");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Consistent preview size
  const PREVIEW_SIZE = 180;
  useEffect(() => {
    if (!initialized && qrRef.current) {
      qrInstance.current = new QRCodeStyling({
        ...defaultOptions,
        width: PREVIEW_SIZE,
        height: PREVIEW_SIZE,
        data: qrData,
      });
      qrInstance.current.append(qrRef.current);
      setInitialized(true);
      setQrReady(true);
    }
    return () => {
      if (qrRef.current) {
        qrRef.current.innerHTML = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrRef.current]);

  // Update QR code when options change (preview always PREVIEW_SIZE)
  useEffect(() => {
    if (!initialized) return;
    setLoading(true);
    const updateQR = async () => {
      try {
        let image = "";
        if (logoFile) {
          // Validate file type and size
          if (!logoFile.type.startsWith("image/")) {
            toast.error("Logo must be an image file.");
            setLogoFile(null);
            setLoading(false);
            return;
          }
          if (logoFile.size > 1024 * 1024) {
            toast.error("Logo file too large (max 1MB).");
            setLogoFile(null);
            setLoading(false);
            return;
          }
          image = await toBase64(logoFile);
        }
        qrInstance.current.update({
          data: qrData,
          width: PREVIEW_SIZE,
          height: PREVIEW_SIZE,
          image,
          qrOptions: defaultOptions.qrOptions,
          dotsOptions: {
            color: dotColor,
            type: dotShape,
          },
          backgroundOptions: {
            color: bgColor,
          },
          imageOptions: {
            ...defaultOptions.imageOptions,
            imageSize: parseFloat(logoSize),
            margin: parseInt(logoMargin),
          },
          cornersSquareOptions: {
            type: cornerSquareShape,
            color: cornerSquareColor,
          },
          cornersDotOptions: {
            type: cornerDotShape,
            color: cornerDotColor,
          },
        });
        setQrReady(true);
      } catch (err) {
        toast.error("Failed to generate QR code.");
        setQrReady(false);
      } finally {
        setLoading(false);
      }
    };
    updateQR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    qrData,
    dotColor,
    bgColor,
    dotShape,
    cornerSquareShape,
    cornerSquareColor,
    cornerDotShape,
    cornerDotColor,
    logoFile,
    logoSize,
    logoMargin,
    initialized,
  ]);

  // Accessibility: handle Enter key for clipboard
  const handleCopy = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(qrData).then(
      () => toast.success("Link copied"),
      () => toast.error("Copy failed")
    );
  };

  return (
    <Card className="flex flex-col md:flex-row w-full justify-between max-w-3xl md:max-w-5xl overflow-hidden">
      {/* Controls */}
      <CardContent className="flex flex-col space-y-4 w-full md:w-[55%]">
        {/* URL Input */}
        <div className="relative w-full space-y-1">
          <Label htmlFor="qr-url">URL</Label>
          <Input
            id="qr-url"
            value={typeof qrData === "string" ? qrData : ""}
            onChange={(e) => setQrData(e.target.value)}
            aria-label="QR URL"
            autoComplete="off"
          />
        </div>

        <ScrollArea className="max-h-[40vh] sm:max-h-[300px] w-full">
          <div className="space-y-2">
            {/* Download Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qr-width">Download Width</Label>
                <Input
                  id="qr-width"
                  type="number"
                  min={100}
                  max={1000}
                  value={downloadWidth ?? ""}
                  onChange={(e) => setDownloadWidth(Math.max(100, Math.min(1000, Number(e.target.value))))}
                  aria-label="Download Width"
                />
              </div>
              <div>
                <Label htmlFor="qr-height">Download Height</Label>
                <Input
                  id="qr-height"
                  type="number"
                  min={100}
                  max={1000}
                  value={downloadHeight ?? ""}
                  onChange={(e) => setDownloadHeight(Math.max(100, Math.min(1000, Number(e.target.value))))}
                  aria-label="Download Height"
                />
              </div>
            </div>

            {/* Dots */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dot-shape">Dot Shape</Label>
                <Select value={dotShape} onValueChange={setDotShape}>
                  <SelectTrigger id="dot-shape" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                    <SelectItem value="classy">Classy</SelectItem>
                    <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dot-color">Dot Color</Label>
                <Input
                  id="dot-color"
                  type="color"
                  value={dotColor || "#000000"}
                  onChange={(e) => setDotColor(e.target.value)}
                  aria-label="Dot Color"
                />
              </div>
            </div>

            {/* Corners */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="corner-square-shape">Corner Square Shape</Label>
                <Select
                  value={cornerSquareShape}
                  onValueChange={setCornerSquareShape}
                >
                  <SelectTrigger id="corner-square-shape" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                    <SelectItem value="dot">Dot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="corner-square-color">Corner Square Color</Label>
                <Input
                  id="corner-square-color"
                  type="color"
                  value={cornerSquareColor || "#000000"}
                  onChange={(e) => setCornerSquareColor(e.target.value)}
                  aria-label="Corner Square Color"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="w-full">
                <Label htmlFor="corner-dot-shape">Corner Dot Shape</Label>
                <Select value={cornerDotShape} onValueChange={setCornerDotShape}>
                  <SelectTrigger id="corner-dot-shape" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dot">Dot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="corner-dot-color">Corner Dot Color</Label>
                <Input
                  id="corner-dot-color"
                  type="color"
                  value={cornerDotColor || "#000000"}
                  onChange={(e) => setCornerDotColor(e.target.value)}
                  aria-label="Corner Dot Color"
                />
              </div>
            </div>

            {/* Logo */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="logo-upload">Upload Logo</Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setLogoFile(e.target.files[0]);
                    }
                  }}
                  aria-label="Upload Logo"
                />
              </div>
              <div>
                <Label htmlFor="logo-size">Logo Size (0–1)</Label>
                <Input
                  id="logo-size"
                  type="number"
                  step="0.1"
                  min={0}
                  max={1}
                  value={logoSize ?? ""}
                  onChange={(e) => setLogoSize(Math.max(0, Math.min(1, Number(e.target.value))))}
                  aria-label="Logo Size"
                />
              </div>
              <div>
                <Label htmlFor="logo-margin">Logo Margin</Label>
                <Input
                  id="logo-margin"
                  type="number"
                  min={0}
                  max={100}
                  value={logoMargin ?? ""}
                  onChange={(e) => setLogoMargin(Math.max(0, Math.min(100, Number(e.target.value))))}
                  aria-label="Logo Margin"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bg-color">Background Color</Label>
              <Input
                id="bg-color"
                type="color"
                value={bgColor || "#ffffff"}
                onChange={(e) => setBgColor(e.target.value)}
                aria-label="Background Color"
              />
            </div>
          </div>
        </ScrollArea>
      </CardContent>

      {/* QR Preview & Download */}
      <CardContent className="flex flex-col items-center justify-center gap-4 w-full md:w-[45%]">
        <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 flex items-center justify-center bg-white rounded-lg shadow border mx-auto">
          <div ref={qrRef} aria-label="QR Code Preview" className="w-full h-full flex items-center justify-center" />
        </div>
        <Button
          onClick={async () => {
            if (!qrInstance.current) return;
            setLoading(true);
            try {
              // Temporarily update for download only
              await qrInstance.current.update({
                width: parseInt(downloadWidth),
                height: parseInt(downloadHeight),
              });
              await qrInstance.current.download({ name: "event-qr", extension: "png" });
              // Restore preview size
              await qrInstance.current.update({ width: PREVIEW_SIZE, height: PREVIEW_SIZE });
            } finally {
              setLoading(false);
            }
          }}
          disabled={!qrReady || loading}
          aria-disabled={!qrReady || loading}
          className="w-full"
        >
          {loading ? "Generating..." : "Download QR Code"}
        </Button>
      </CardContent>
    </Card>
  );
}

GenerateQR.propTypes = {
  qrData: PropTypes.string,
  setQrData: PropTypes.func.isRequired,
};

export default GenerateQR;

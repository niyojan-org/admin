'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Camera, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// SSR-safe component import
const BarcodeScannerComponent = dynamic(
    () => import('react-qr-barcode-scanner'),
    { ssr: false }
);

export default function QRScanner({ onResult, frameSize = 320 }) {
    const [data, setData] = useState(null);
    const [cameras, setCameras] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState();
    const [error, setError] = useState("");
    const [scanning, setScanning] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getCameras() {
            try {
                // Explicitly request camera permission
                await navigator.mediaDevices.getUserMedia({ video: true });
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoInputs = devices.filter((device) => device.kind === 'videoinput');
                setCameras(videoInputs);
                if (videoInputs[0]) setSelectedCameraId(videoInputs[0].deviceId);
                if (videoInputs.length === 0) setError("No camera devices found.");
            } catch (err) {
                setError("Camera permission denied or unavailable.");
            } finally {
                setLoading(false);
            }
        }
        getCameras();
    }, []);

    const handleSelectChange = (value) => {
        setSelectedCameraId(value);
        setData(null);
        setScanning(true);
        setError("");
    };

    const handleScanAgain = () => {
        setData(null);
        setScanning(true);
        setError("");
    };

    // Call the callback on result
    useEffect(() => {
        if (data && typeof onResult === "function") {
            onResult(data);
        }
    }, [data, onResult]);

    return (
        <Card className="p-6 max-w-md mx-auto shadow-lg">
            <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" /> QR Code Scanner
            </h1>

            {error && (
                <Badge variant="destructive" className="mb-4 w-full text-center">{error}</Badge>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="animate-spin w-8 h-8 mb-2" />
                    <span className="text-muted-foreground">Loading camera...</span>
                </div>
            )}

            {!loading && cameras.length > 1 && (
                <Select
                    onValueChange={handleSelectChange}
                    value={selectedCameraId}
                >
                    <SelectTrigger className="w-full mb-4">
                        <SelectValue placeholder="Select Camera" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {cameras.map((camera, idx) => (
                                <SelectItem key={camera.deviceId} value={camera.deviceId}>
                                    {camera.label || `Camera ${idx + 1}`}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )}

            {!data && selectedCameraId && scanning && !error && (
                <div className="flex flex-col items-center">
                    <div className="relative overflow-hidden" style={{ width: frameSize, height: frameSize }}>
                        <BarcodeScannerComponent
                            width={frameSize}
                            height={frameSize}
                            torch={false}
                            delay={300}
                            videoConstraints={{ deviceId: selectedCameraId }}
                            onError={(err) => setError(err?.message || "Camera error")}
                            onUpdate={(err, result) => {
                                if (result?.text) {
                                    setData(result.text);
                                    setScanning(false);
                                }
                            }}
                        />
                        {/* Square overlay */}
                        <div className="absolute inset-0 pointer-events-none border-4 border-primary rounded-lg" style={{ boxSizing: 'border-box' }} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Align QR code within the square</div>
                </div>
            )}

            {data && (
                <div className="mt-4 bg-green-100 p-4 rounded flex flex-col items-center">
                    <p className="font-semibold mb-2">✅ Scanned Result:</p>
                    <code className="break-all text-center mb-2">{data}</code>
                    <Button size="sm" variant="outline" onClick={handleScanAgain} className="mt-2 flex items-center gap-1">
                        <RefreshCw className="w-4 h-4" /> Scan Again
                    </Button>
                </div>
            )}
        </Card>
    );
}

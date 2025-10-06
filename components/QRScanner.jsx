'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Camera, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';

// SSR-safe component import
const BarcodeScannerComponent = dynamic(
    () => import('react-qr-barcode-scanner'),
    { ssr: false }
);

export default function QRScanner({ onResult, frameSize = 320, className = "" }) {
    const [data, setData] = useState(null);
    const [cameras, setCameras] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState();
    const [error, setError] = useState("");
    const [scanning, setScanning] = useState(true);
    const [loading, setLoading] = useState(true);

    const getCameras = async () => {
        setLoading(true);
        setError("");
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
    };

    useEffect(() => {
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
        <Card className={cn("max-w-md w-full shadow-lg gap-2", className)}>
            <h1 className="text-xl font-bold flex items-center gap-2">
                <Camera className="w-5 h-5" /> Scanner
            </h1>

            {error && (
                <div className="mb-4 space-y-2">
                    <Badge variant="destructive" className="w-full text-center">{error}</Badge>
                    <Button
                        onClick={getCameras}
                        className="w-full flex items-center justify-center gap-2"
                        variant="outline"
                    >
                        <RefreshCw className="w-4 h-4" /> Retry Camera Access
                    </Button>
                </div>
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
                    <SelectTrigger className="w-full ">
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
                <div className="flex flex-col items-center w-full">
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
                        <div className="absolute w-full top-1/2 border-1 border-destructive z-30 animate-pulse duration-75" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Align code within the square</div>
                </div>
            )}

            {data && (
                <div className="mt-4 bg-green-100 p-4 rounded flex flex-col items-center w-full">
                    <p className="font-semibold mb-2">Scanned Completed </p>
                    <p>{data}</p>
                    <Button size="sm" variant="outline" onClick={handleScanAgain} className="mt-2 flex items-center gap-1">
                        <RefreshCw className="w-4 h-4" /> Scan Again
                    </Button>
                </div>
            )}
        </Card>
    );
}

"use client";
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IconCurrencyRupee, IconEye, IconDownload, IconQrcode } from "@tabler/icons-react";
import Qrcode from "@/components/Qrcode";

export default function TicketPreview({ ticket, participant }) {
    const [open, setOpen] = useState(false);
    const qrRef = useRef(null);

    useEffect(() => {
        if (open && qrRef.current && typeof window !== "undefined") {
            import("qr-code-styling").then(({ default: QRCodeStyling }) => {
                const qr = new QRCodeStyling({
                    width: 120,
                    height: 120,
                    data: participant._id,
                    dotsOptions: { color: "#000", type: "rounded" },
                    backgroundOptions: { color: "#fff" },
                });
                qr.append(qrRef.current);
                // Clean up QR on close
                return () => qrRef.current && (qrRef.current.innerHTML = "");
            });
        } else if (qrRef.current) {
            qrRef.current.innerHTML = "";
        }
    }, [open, participant?._id]);

    if (!ticket?.url) return null;

    const handleDownload = async () => {
        try {
            const response = await fetch(ticket.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `ticket-${ticket.code || participant._id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (e) {
            alert("Failed to download ticket image.");
        }
    };

    return (
        <div className="flex w-full items-center justify-between">
            <div>
                <div className="font-medium mb-1">Ticket:</div>
                <div className="text-sm">
                    Type: {ticket?.type || '-'}<br />
                    <span className="flex items-center">Price: <IconCurrencyRupee size={18} />{ticket?.price || '-'}</span>
                    <span className="text-foreground font-semibold">#{ticket?.code || '-'}</span>
                </div>
                <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                        <IconEye size={16} className="mr-1" /> View
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleDownload}>
                        <IconDownload size={16} className="mr-1" /> Download
                    </Button>
                </div>
            </div>
            <Image
                src={ticket.url}
                alt="Ticket"
                width={100}
                height={100}
                className="rounded-md ml-2"
            />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ticket Details</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-2">
                        <Qrcode data={participant._id} size={200} />
                        <div className="text-sm mt-2">
                            <div>Type: {ticket?.type || '-'}</div>
                            <div>Price: <IconCurrencyRupee size={16} className="inline" />{ticket?.price || '-'}</div>
                            <div>Code: <span className="font-semibold">#{ticket?.code || '-'}</span></div>
                        </div>
                        <div className="flex flex-col items-center mt-2">
                            <div className="font-medium mb-1 flex items-center"><IconQrcode size={18} className="mr-1" /> QR Code</div>
                            <div ref={qrRef} />
                            <div className="text-xs text-muted-foreground mt-1">ID: {participant._id}</div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setOpen(false)} variant="default">Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

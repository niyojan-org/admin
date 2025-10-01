"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as htmlToImage from "html-to-image";
import { Separator } from "@/components/ui/separator";
import QRCodeStyling from "qr-code-styling";
import Image from "next/image";
import moment from "moment";
import { IconCalendar, IconDownload } from "@tabler/icons-react";

export default function SocialShareCard({ organization, event, referral, coupon, shareUrl }) {
    const cardRef = useRef(null);
    const qrRef = useRef(null);
    const [qrCode, setQrCode] = useState(null);

    // Generate QR code
    useEffect(() => {
        if (shareUrl && qrRef.current) {
            const qr = new QRCodeStyling({
                width: 150,
                height: 150,
                margin: 0.3,
                type: "svg",
                data: shareUrl,
                dotsOptions: {
                    color: "#1f2937",
                    type: "rounded"
                },
                backgroundOptions: {
                    color: "#ffffff",
                },
                cornersSquareOptions: {
                    color: "#1f2937",
                    type: "rounded"
                },
                cornersDotOptions: {
                    color: "#1f2937",
                    type: "dot"
                }
            });

            qr.append(qrRef.current);
            setQrCode(qr);

            return () => {
                if (qrRef.current) {
                    qrRef.current.innerHTML = '';
                }
            };
        }
    }, [shareUrl]);

    const downloadCard = async () => {
        if (cardRef.current === null) return;
        try {
            const dataUrl = await htmlToImage.toPng(cardRef.current, {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: ''
            });
            const link = document.createElement("a");
            link.download = `${event?.title || 'event'}-share-card.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Error generating image:", error);
        }
    };

    return (
        <div className="flex flex-col items-center py-6 space-y-4">
            {/* Glow effect background */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-2xl blur-xl opacity-30 animate-pulse"></div>

                <div ref={cardRef} className="relative">
                    <Card className="w-[380px] gap-3">
                        <CardTitle className="text-center">
                            {/* Organization Logo */}
                            <div className="flex gap-4 items-center">
                                {organization?.logo && (
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-muted">
                                            <Image
                                                src={organization?.logo}
                                                width={64}
                                                height={64}
                                                className="rounded-full object-cover"
                                                alt="Logo"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="text-2xl font-bold mb-2">
                                        {event?.title || 'Amazing Event'}
                                    </p>

                                    <p className="text-muted-foreground font-medium">
                                        {organization?.name || 'Organizer'}
                                    </p>
                                </div>
                            </div>
                        </CardTitle>

                        <Separator />

                        <CardContent className="space-y-4">
                            {/* Event Details */}
                            <div className="space-y-4">
                                {event?.sessions && (
                                    <div className="flex items-center space-x-3">
                                        <Card className="p-0 border-0">
                                            <CardContent>
                                                <IconCalendar className="w-6 h-6" />
                                            </CardContent>
                                        </Card>
                                        <div>
                                            <p className="font-semibold ">{moment(event.sessions[0].startTime).format("MMMM Do YYYY, h:mm A")}</p>
                                            <p className="text-sm text-muted-foreground">{moment(event.sessions[event.sessions.length - 1].endTime).format("MMMM Do YYYY, h:mm A")}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Promotional Codes */}
                            {(referral || coupon) && (
                                <>
                                    <Card className="gap-1 p-2">
                                        <CardTitle className="text-center">
                                            Special Codes
                                        </CardTitle>
                                        <CardContent className="flex items-center justify-center w-full gap-4">
                                            {referral && (
                                                <div className="text-center w-1/2">
                                                    <p className="text-sm text-foreground mb-1 font-semibold">Referral Code</p>
                                                    <div className="font-mono font-bold text-lg px-3 py-2 rounded-md border border-muted-foreground">
                                                        {referral.code}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        by {referral.whose?.name}
                                                    </p>
                                                </div>
                                            )}
                                            {coupon && (
                                                <div className="text-center w-1/2">
                                                    <p className="text-sm text-foreground mb-1 font-semibold">Discount Code</p>
                                                    <div className="font-mono font-bold text-lg px-3 py-2 rounded-md border border-muted-foreground">
                                                        {coupon.code}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {coupon.discountType === 'percent' ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </>
                            )}

                            {/* QR Code */}
                            <div className="text-center space-y-3">
                                <div className="flex justify-center">
                                    <div className="p-2 rounded-lg shadow-sm border">
                                        <div ref={qrRef} className="flex justify-center items-center"></div>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-semibold">Scan to Register</p>
                                    <p className="text-sm text-muted-foreground">
                                        Quick registration with your phone
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center pt-2">
                                <p className="text-xs text-muted-foreground">
                                    Powered by <span className="font-semibold text-foreground">orgatick.in</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Download Button */}
            <Button
                onClick={downloadCard}
                className="shadow-lg hover:shadow-xl transition-all duration-200"
            >
                <IconDownload className="w-4 h-4 mr-2" />
                Download Share Card
            </Button>
        </div>
    );
}
"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IconQrcode, IconCopy } from '@tabler/icons-react';
import GenerateQR from './GenrateQR';

export default function ShareLink({ url, onCopy, copied, label = "Share Link" }) {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [qrData, setQrData] = useState(url || '');

  // Update QR data when URL changes
  React.useEffect(() => {
    if (url) {
      setQrData(url);
    }
  }, [url]);

  return (
    <Card>
      <CardContent className="">
        <div className="space-y-2 w-full">
          <Label htmlFor="share-url" className="text-sm font-medium">
            {label}
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="share-url"
              type="text"
              value={url}
              readOnly
              className="flex-1"
              placeholder="Loading..."
            />
          </div>
          <div className='flex items-center w-full gap-3'>
            <Button
              onClick={onCopy}
              disabled={!url}
              variant={copied ? "secondary" : "default"}
              size="sm"
              className="flex items-center gap-2 flex-1"
            >
              <IconCopy size={16} />
              {copied ? 'Copied!' : 'Copy'}
            </Button>

            <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={!url}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 flex-1"
                >
                  <IconQrcode size={16} />
                  Get QR
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Generate QR Code</DialogTitle>
                  <DialogDescription>
                    Customize and download your QR code for easy sharing
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <GenerateQR qrData={qrData} setQrData={setQrData} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

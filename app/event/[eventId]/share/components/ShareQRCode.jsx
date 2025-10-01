import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
// You can install 'qrcode.react' package for real QR codes: npm install qrcode.react
// import QRCode from 'qrcode.react';

export default function ShareQRCode({ value }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">QR Code</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-muted p-6 rounded-lg border-2 border-dashed border-border">
            {/* Replace with real QR code component when qrcode.react is installed */}
            {/* <QRCode value={value} size={200} /> */}
            <div className="w-48 h-48 flex items-center justify-center text-muted-foreground text-center">
              <div>
                <div className="text-4xl mb-2">📱</div>
                <div className="text-sm font-medium">QR Code</div>
                <div className="text-xs text-muted-foreground">
                  {value ? 'Ready to scan' : 'Loading...'}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium">Scan to join event</p>
            <p className="text-xs text-muted-foreground">
              Users can scan this QR code to register for the event
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

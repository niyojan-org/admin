"use client";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Updated import for toast
import { Download, Loader2 } from "lucide-react";

const ExportDialog = ({ open, onOpenChange, onExport, isExporting }) => {
  const [format, setFormat] = useState("detailed");
  const [includePaymentDetails, setIncludePaymentDetails] = useState(false);
  const [includeCheckInData, setIncludeCheckInData] = useState(true);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isGroupRegistration, setIsGroupRegistration] = useState("");

  const handleExport = () => {
    onExport({
      format,
      includePaymentDetails: includePaymentDetails.toString(),
      includeCheckInData: includeCheckInData.toString(),
      status: status || undefined,
      paymentStatus: paymentStatus || undefined,
      isGroupRegistration: isGroupRegistration || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Participants</DialogTitle>
          <DialogDescription>
            Customize the export options for your participant data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="format" className="col-span-1">
              Format
            </Label>
            <Select
              id="format"
              value={format}
              onValueChange={setFormat}
              className="col-span-3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="groups-only">Groups Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="col-span-1">Include</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="payment-details" 
                  checked={includePaymentDetails} 
                  onCheckedChange={setIncludePaymentDetails}
                />
                <Label htmlFor="payment-details">Payment Details</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="checkin-data" 
                  checked={includeCheckInData} 
                  onCheckedChange={setIncludeCheckInData}
                />
                <Label htmlFor="checkin-data">Check-in Data</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="status" className="col-span-1">
              Status
            </Label>
            <Select
              id="status"
              value={status}
              onValueChange={setStatus}
              className="col-span-3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Any status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="payment-status" className="col-span-1">
              Payment
            </Label>
            <Select
              id="payment-status"
              value={paymentStatus}
              onValueChange={setPaymentStatus}
              className="col-span-3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Any payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any payment status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="free">Free</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="group-registration" className="col-span-1">
              Group
            </Label>
            <Select
              id="group-registration"
              value={isGroupRegistration}
              onValueChange={setIsGroupRegistration}
              className="col-span-3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Group or individual" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All registrations</SelectItem>
                <SelectItem value="true">Group registrations only</SelectItem>
                <SelectItem value="false">Individual registrations only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IconCurrencyRupee, IconTicket, IconCalendarEvent, IconCheck, IconX } from "@tabler/icons-react";
import Image from "next/image";
import TicketPreview from "./TicketPreview";

// New: ParticipantDetailsCard
function ParticipantDetailsCard({ participant }) {
  if (!participant) return null;

  const getStatusColor = (status) => {
    return status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-300' : 
           status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 
           'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getPaymentStatusColor = (status) => {
    return status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' : 
           status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 
           status === 'failed' ? 'bg-red-100 text-red-800 border-red-300' : 
           'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="">
        <CardTitle className="text-base font-medium">Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Section */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge className={`px-2 py-1 ${getStatusColor("confirmed")}`}>
            {"CONFIRMED" || participant.status?.toUpperCase()}
          </Badge>
          <div className="text-xs text-muted-foreground">
            Registered: {new Date(participant.createdAt).toLocaleDateString()} at {new Date(participant.createdAt).toLocaleTimeString()}
          </div>
        </div>
				<Separator />
        {/* Dynamic Fields */}
        {participant.dynamicFields && Object.keys(participant.dynamicFields).length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <IconTicket className="w-3.5 h-3.5" /> Custom Fields
            </h4>
            <div className="bg-muted/40 rounded-md p-3">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(participant.dynamicFields).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-xs text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm break-words">{value || "-"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ticket Preview
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Ticket Preview</h4>
          <div className="bg-muted/40 rounded-md overflow-hidden">
            <TicketPreview ticket={participant.ticket} participant={participant} />
          </div>
        </div> */}

        {/* Payment Information */}
        {/* {participant.payment && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <IconCurrencyRupee className="w-3.5 h-3.5" /> Payment Details
            </h4>
            <div className="bg-muted/40 rounded-md p-3">
              <div className="flex flex-wrap items-center justify-between mb-2">
                <Badge className={`px-2 py-0.5 ${getPaymentStatusColor(participant.payment?.status)}`}>
                  {participant.payment?.status?.toUpperCase() || "FREE"}
                </Badge>
                <span className="font-medium">
                  ₹{participant.payment?.amount/100 || "0"}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {participant.payment?.razorpayOrderId && (
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground">Order ID</span>
                    <p className="font-mono text-xs break-all">{participant.payment.razorpayOrderId}</p>
                  </div>
                )}
                
                {participant.payment?.razorpayPaymentId && (
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground">Payment ID</span>
                    <p className="font-mono text-xs break-all">{participant.payment.razorpayPaymentId}</p>
                  </div>
                )}
                
                {participant.payment?.organizerShare && (
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground">Organizer Share</span>
                    <p>₹{participant.payment.organizerShare}</p>
                  </div>
                )}
                
                {participant.payment?.platformShare && (
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground">Platform Share</span>
                    <p>₹{participant.payment.platformShare}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )} */}

        {/* Session Check-ins */}
        {/* <div className="space-y-1">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <IconCalendarEvent className="w-3.5 h-3.5" /> Session Check-ins
          </h4>
          <div className="bg-muted/40 rounded-md p-3">
            {participant.sessionCheckIn && participant.sessionCheckIn.length > 0 ? (
              <div className="space-y-2">
                {participant.sessionCheckIn.map((check, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <div className="mt-0.5">
                      <IconCheck className="w-3.5 h-3.5 text-green-500" />
                    </div>
                    <div>
                      <span className="font-medium">{check.checkinby?.name || 'Unknown staff'}</span>
                      <p className="text-muted-foreground">
                        {check.checkIn ? new Date(check.checkIn).toLocaleString() : 'No timestamp'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <IconX className="w-3.5 h-3.5" />
                <span>No check-ins recorded</span>
              </div>
            )}
          </div>
        </div> */}

        {/* Additional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Referral Code */}
          <div className="space-y-1">
            <h4 className="text-xs font-medium">Referral Code</h4>
            <p className="text-sm bg-muted/40 p-2 rounded break-all">
              {participant.referralCode || 'None'}
            </p>
          </div>

          {/* Admin Note */}
          <div className="space-y-1">
            <h4 className="text-xs font-medium">Admin Note</h4>
            <p className="text-sm bg-muted/40 p-2 rounded min-h-[2rem]">
              {participant.adminNote || 'No notes'}
            </p>
          </div>
        </div>

        {/* Coupon */}
        {participant.coupon && Object.keys(participant.coupon).length > 0 && (
          <div className="space-y-1">
            <h4 className="text-xs font-medium">Applied Coupon</h4>
            <div className="bg-muted/40 rounded-md p-2 break-all">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {/* {JSON.stringify(participant.coupon, null, 2)} */}
                {participant.coupon.code || "N/A"}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ParticipantDetailsCard;
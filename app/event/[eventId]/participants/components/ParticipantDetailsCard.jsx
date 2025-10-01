import { Card } from "@/components/ui/card";
import { IconCurrencyRupee } from "@tabler/icons-react";
import Image from "next/image";
import TicketPreview from "./TicketPreview";

// New: ParticipantDetailsCard
function ParticipantDetailsCard({ participant }) {
    if (!participant) return null;
    return (
        <Card className="px-4">
            <div className="font-semibold text-lg">{participant.name} ({participant.email})</div>

            <div className="grid grid-cols-2 text-sm">
                <div className={`${participant.status === 'pending' ? 'text-destructive' : 'text-secondary'} font-semibold`}>Current status: {participant.status}
                </div>
                <div>
                    <span className="font-medium">Registered:</span> {new Date(participant.createdAt).toLocaleString()}
                </div>
                <div>
                    <span className="font-medium">Updated:</span> {new Date(participant.updatedAt).toLocaleString()}
                </div>
                <div>
                    <span className="font-medium">Admin Note:</span> {participant.adminNote || "-"}
                </div>
            </div>
            <div className="grid grid-cols-2">
                <div className="">
                    <div className="font-medium mb-1">Dynamic Fields:</div>
                    <ul className="list-none text-sm">
                        {participant.dynamicFields && Object.entries(participant.dynamicFields).map(([k, v]) => (
                            <li key={k}><span className="font-semibold">{k.replace(/_/g, ' ')}:</span> {v}</li>
                        ))}
                    </ul>
                </div>
                <TicketPreview ticket={participant.ticket} participant={participant} />
            </div>
            <div className="">
                <div className="font-medium mb-1">Payment:</div>
                <div className="text-sm grid grid-cols-2">
                    <div className={`${participant.payment?.status === 'completed' ? 'text-secondary' : 'text-destructive'} font-semibold`}>
                        Status: {participant.payment?.status || '-'}
                    </div>
                    <div>Amount: ₹{participant.payment?.amount || '-'}</div>
                    <div>Order ID: {participant.payment?.razorpayOrderId || '-'}</div>
                    <div>Payment ID: {participant.payment?.razorpayPaymentId || '-'}</div>
                    <div>Your Share: {participant.payment?.organizerShare || '-'}</div>
                    <div>Platform Share: {participant.payment?.platformShare || '-'}</div>
                </div>
            </div>
            <div className="">
                <div className="font-medium mb-1">Session Check-ins:</div>
                <ul className="list-none text-sm">
                    {participant.sessionCheckIn && participant.sessionCheckIn.length > 0 ? (
                        participant.sessionCheckIn.map((check, idx) => (
                            <li key={idx}>
                                By: {check.checkinby?.name || '-'} at {check.checkIn ? new Date(check.checkIn).toLocaleString() : '-'}
                            </li>
                        ))
                    ) : (
                        <li>-</li>
                    )}
                </ul>
            </div>
            <div className="grid grid-cols-2">
                <div className="">
                    <div className="font-medium mb-1">Referral Code:</div>
                    <div className="text-sm">{participant.referralCode || '-'}</div>
                </div>
                <div className="">
                    <div className="font-medium mb-1">Coupon:</div>
                    <div className="text-sm">{participant.coupon && Object.keys(participant.coupon).length > 0 ? JSON.stringify(participant.coupon) : '-'}</div>
                </div>
            </div>
        </Card >
    );
}

export default ParticipantDetailsCard;
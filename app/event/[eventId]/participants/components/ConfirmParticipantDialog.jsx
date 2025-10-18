"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ParticipantDetailsCard from "./ParticipantDetailsCard";
import { confirmParticipantData } from "./participantApi";
import { Download } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { IconCurrencyRupee, IconCalendarEvent, IconCheck, IconX } from "@tabler/icons-react";

const ConfirmDialog = ({ dialogParticipant, setDialogParticipant, eventId, fetchData }) => {
  const handleConfirm = async () => {
    try {
      await confirmParticipantData(eventId, dialogParticipant._id);
      setDialogParticipant(null);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to confirm participant. Try again.");
    }
  };

  const handleDownload = async () => {
    const participantId = dialogParticipant._id;
    try {
      const response = await api.get(`/event/admin/participant/ticket/${participantId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "image/png" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket_${participantId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download ticket. Please try again.");
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === "completed"
      ? "bg-green-100 text-green-800 border-green-300"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
      : status === "failed"
      ? "bg-red-100 text-red-800 border-red-300"
      : "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <Dialog
      open={!!dialogParticipant}
      onOpenChange={(open) => setDialogParticipant(open ? dialogParticipant : null)}
    >
      <DialogContent className="md:max-w-2/3 lg:mx-auto max-h-[90vh] overflow-y-auto">
        {dialogParticipant && (
          <>
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-center sm:text-left">
                Participant Details
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ===== BASIC INFORMATION SECTION ===== */}
              <div className="space-y-4 flex flex-col order-1 lg:order-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between border-b pb-2 gap-2">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    <Button
                      className="md:w-fit sm:w-auto flex items-center gap-2"
                      disabled={dialogParticipant.status !== "confirmed"}
                      onClick={handleDownload}
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download Ticket</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <Info label="Name" value={dialogParticipant.name} />
                    <Info label="Email" value={dialogParticipant.email} />
                    <Info label="Ticket Type" value={dialogParticipant.ticket?.type || "N/A"} />
                    <Info label="Payment Status" value={dialogParticipant.payment?.status || "Free"} />
                  </div>

                  {/* ===== PAYMENT DETAILS MOVED HERE ===== */}
                  {dialogParticipant.payment && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                        <IconCurrencyRupee className="w-4 h-4" /> Payment Details
                      </h4>
                      <div className="bg-muted/40 rounded-md p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <Badge
                            className={`px-2 py-0.5 ${getPaymentStatusColor(dialogParticipant.payment?.status)}`}
                          >
                            {dialogParticipant.payment?.status?.toUpperCase() || "FREE"}
                          </Badge>
                          <span className="font-medium">
                            ₹{dialogParticipant.payment?.amount / 100 || "0"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                          {dialogParticipant.payment?.razorpayOrderId && (
                            <Field label="Order ID" value={dialogParticipant.payment.razorpayOrderId} />
                          )}
                          {dialogParticipant.payment?.razorpayPaymentId && (
                            <Field label="Payment ID" value={dialogParticipant.payment.razorpayPaymentId} />
                          )}
                          {dialogParticipant.payment?.organizerShare && (
                            <Field label="Organizer Share" value={`₹${dialogParticipant.payment.organizerShare}`} />
                          )}
                          {dialogParticipant.payment?.platformShare && (
                            <Field label="Platform Share" value={`₹${dialogParticipant.payment.platformShare}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ===== SESSION CHECK-INS MOVED HERE ===== */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                      <IconCalendarEvent className="w-4 h-4" /> Session Check-ins
                    </h4>
                    <div className="bg-muted/40 rounded-md p-3">
                      {dialogParticipant.sessionCheckIn &&
                      dialogParticipant.sessionCheckIn.length > 0 ? (
                        <div className="space-y-2">
                          {dialogParticipant.sessionCheckIn.map((check, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs">
                              <IconCheck className="w-3.5 h-3.5 text-green-500 mt-0.5" />
                              <div>
                                <span className="font-medium">
                                  {check.checkinby?.name || "Unknown staff"}
                                </span>
                                <p className="text-muted-foreground">
                                  {check.checkIn
                                    ? new Date(check.checkIn).toLocaleString()
                                    : "No timestamp"}
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
                  </div>
                </div>

                {/* Confirm button */}
                {"pending" && (
                  <div className="hidden lg:flex justify-end gap-2 pt-4 border-t mt-4">
                    <Button variant="outline" onClick={() => setDialogParticipant(null)}>
                      Cancel
                    </Button>
                    <Button className="bg-primary text-white hover:bg-primary/90" onClick={handleConfirm}>
                      Confirm
                    </Button>
                  </div>
                )}
              </div>

              {/* ===== LEFT COLUMN ===== */}
              <div className="space-y-4 order-2 lg:order-1 mt-6 lg:mt-0">
                <ParticipantDetailsCard participant={dialogParticipant} />
              </div>
            </div>

            {/* Mobile footer */}
            {dialogParticipant.status === "pending" && (
              <div className="flex lg:hidden flex-col-reverse sm:flex-row justify-end gap-2 pt-6 border-t mt-6">
                <Button
                  variant="outline"
                  onClick={() => setDialogParticipant(null)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto"
                  onClick={handleConfirm}
                >
                  Confirm
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const Info = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium text-sm sm:text-base break-all">{value}</p>
  </div>
);

const Field = ({ label, value }) => (
  <div className="space-y-0.5">
    <span className="text-muted-foreground">{label}</span>
    <p className="font-mono text-xs break-all">{value}</p>
  </div>
);

export default ConfirmDialog;

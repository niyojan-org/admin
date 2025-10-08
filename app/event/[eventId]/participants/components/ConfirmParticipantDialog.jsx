import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ParticipantDetailsCard from "./ParticipantDetailsCard";
import { confirmParticipantData } from "./participantApi";
import { Download } from "lucide-react";

const ConfirmDialog = ({ 
  dialogParticipant, 
  setDialogParticipant, 
  eventId, 
  fetchData 
}) => {
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

  return (
    <Dialog
      open={!!dialogParticipant}
      onOpenChange={(open) => setDialogParticipant(open ? dialogParticipant : null)}
    >
      <DialogContent className="w-full lg:mx-auto 
             max-h-[90vh] lg:max-h-[none] 
             overflow-y-auto lg:overflow-visible">
        {dialogParticipant && (
          <>
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-semibold text-center sm:text-left">
                Participant Details
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Participant Details Card */}
              <div className="space-y-4">
                <ParticipantDetailsCard participant={dialogParticipant} />
              </div>

              {/* Right Column - Basic Information */}
              <div className="space-y-4 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center justify-between border-b pb-2 gap-2">
											<h3 className="text-lg font-medium">Basic Information</h3>
											<Button
													className="md:w-fit sm:w-auto flex items-center gap-2"
													disabled={dialogParticipant.status !== "confirmed"}
											>
													<Download className="w-4 h-4" />
													Download Ticket
											</Button>
									</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium text-sm sm:text-base">{dialogParticipant.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-sm sm:text-base break-all">{dialogParticipant.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Ticket Type</p>
                      <p className="font-medium text-sm sm:text-base">{dialogParticipant.ticket?.type || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <p className="font-medium text-sm sm:text-base">{dialogParticipant.payment?.status || "Free"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p
                        className={`font-medium text-sm sm:text-base ${
                          dialogParticipant.status === "pending"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {dialogParticipant.status.toUpperCase()}
                      </p>
                      <div></div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Registered At</p>
                      <p className="font-medium text-sm sm:text-base">
                        {new Date(dialogParticipant.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confirm Button - Only shown in right column for large screens */}
                {dialogParticipant.status === "pending" && (
                  <div className="hidden lg:flex justify-end gap-2 pt-4 border-t mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDialogParticipant(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary text-white hover:bg-primary/90"
                      onClick={handleConfirm}
                    >
                      Confirm
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Footer - Only shown on small screens */}
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

export default ConfirmDialog;
'use client'
import { 
    AlertDialog, 
    AlertDialogContent, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogDescription,
    AlertDialogFooter, 
    AlertDialogCancel, 
    AlertDialogAction 
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react';

export function DeleteTicketDialog({ 
    open, 
    onOpenChange, 
    ticket, 
    onConfirm, 
    loading 
}) {
    if (!ticket) return null;

    const hasSales = ticket.sold > 0;
    const willBeDisabled = hasSales;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <IconTrash className="w-5 h-5 text-destructive" />
                        {willBeDisabled ? 'Disable Ticket' : 'Delete Ticket'}
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p>
                                    You are about to {willBeDisabled ? 'disable' : 'delete'} the ticket:
                                </p>
                                <div className="p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{ticket.type}</span>
                                        <Badge variant="outline">₹{ticket.price}</Badge>
                                        <Badge variant="secondary">{ticket.sold}/{ticket.capacity} sold</Badge>
                                    </div>
                                </div>
                            </div>

                            {willBeDisabled ? (
                                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <IconAlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-yellow-800">
                                            Ticket will be disabled instead of deleted
                                        </p>
                                        <p className="text-xs text-yellow-700">
                                            This ticket has {ticket.sold} sales and cannot be permanently deleted. 
                                            It will be deactivated instead to preserve sales data.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <IconAlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-red-800">
                                            This action cannot be undone
                                        </p>
                                        <p className="text-xs text-red-700">
                                            The ticket will be permanently removed from the event.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        {loading && (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        )}
                        {willBeDisabled ? 'Disable Ticket' : 'Delete Ticket'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    IconAlertTriangle,
    IconTrash,
    IconToggleLeft
} from '@tabler/icons-react';

export function DeleteReferralDialog({
    open,
    onOpenChange,
    referral,
    onConfirm,
    loading
}) {
    const hasUsage = referral?.usageCount > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconAlertTriangle className="w-5 h-5 text-destructive" />
                        {hasUsage ? 'Disable Referral Code' : 'Delete Referral Code'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {hasUsage ? (
                        <Alert>
                            <IconToggleLeft className="h-4 w-4" />
                            <AlertDescription>
                                This referral code has been used <strong>{referral?.usageCount} time(s)</strong>. 
                                It will be disabled instead of deleted to preserve usage history.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert>
                            <IconTrash className="h-4 w-4" />
                            <AlertDescription>
                                This referral code has not been used yet and will be permanently deleted. 
                                This action cannot be undone.
                            </AlertDescription>
                        </Alert>
                    )}

                    {referral && (
                        <div className="space-y-2 p-3 rounded-lg bg-muted/50 border">
                            <div className="font-medium">Referral Details:</div>
                            <div className="text-sm space-y-1">
                                <div>Code: <code className="bg-primary/10 text-primary px-1 rounded">{referral.code}</code></div>
                                <div>Owner: {referral.whose?.name || 'Unknown'}</div>
                                <div>Usage: {referral.usageCount || 0} / {referral.maxUsage || '∞'}</div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={loading}
                        >
                            {loading && (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                            )}
                            {hasUsage ? 'Disable Referral' : 'Delete Referral'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteReferralDialog;

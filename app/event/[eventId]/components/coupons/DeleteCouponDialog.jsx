import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { IconTrash, IconLoader2 } from '@tabler/icons-react';

export function DeleteCouponDialog({ coupon, onDelete, deleteLoading = new Set() }) {
    const isLoading = deleteLoading?.has?.(coupon._id) || false;
    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    title="Delete coupon"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <IconLoader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <IconTrash className="w-3 h-3" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the coupon "{coupon.code}"?
                        {coupon.usedCount > 0 && (
                            <span className="block mt-2 text-amber-600">
                                This coupon has been used {coupon.usedCount} times and may be deactivated instead of deleted.
                            </span>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onDelete(coupon)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <IconLoader2 className="w-3 h-3 animate-spin mr-1" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

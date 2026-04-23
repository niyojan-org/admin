'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { IconAlertTriangle, IconTrash, IconUser } from '@tabler/icons-react';
import { getPlatformColor } from './speakerUtils';

export function DeleteGuestSpeakerDialog({
    open,
    onOpenChange,
    speaker,
    onConfirm,
    loading = false
}) {
    if (!speaker) return null;

    const handleDelete = async () => {
        try {
            await onConfirm(speaker._id); // Fixed: use _id instead of id
            onOpenChange(false);
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    const socialLinks = speaker.socialLinks || {};
    const hasLinks = Object.keys(socialLinks).length > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <IconTrash className="w-5 h-5" />
                        Delete Guest Speaker
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Alert variant="destructive">
                        <IconAlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            This action cannot be undone. The speaker will be permanently removed from this event.
                        </AlertDescription>
                    </Alert>

                    {/* Speaker Preview */}
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start gap-3">
                            <Avatar className="w-12 h-12 flex-shrink-0">
                                {speaker.photoUrl && speaker.photoUrl.trim() && (
                                    <AvatarImage src={speaker.photoUrl} alt={speaker.name} />
                                )}
                                <AvatarFallback className="bg-primary/10">
                                    <IconUser className="w-6 h-6 text-primary" />
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-foreground leading-none mb-1">
                                    {speaker.name}
                                </h4>

                                {speaker.bio && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                        {speaker.bio}
                                    </p>
                                )}

                                {hasLinks && (
                                    <div className="flex flex-wrap gap-1">
                                        {Object.entries(socialLinks).map(([platform, url]) => (
                                            url && (
                                                <Badge
                                                    key={platform}
                                                    variant="secondary"
                                                    className="text-xs"
                                                    style={{
                                                        borderColor: getPlatformColor(platform) + '40',
                                                        backgroundColor: getPlatformColor(platform) + '10',
                                                        color: getPlatformColor(platform)
                                                    }}
                                                >
                                                    {platform}
                                                </Badge>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                        <p className="font-medium text-foreground mb-1">Are you sure you want to delete this speaker?</p>
                        <p>This will permanently remove <strong>{speaker.name}</strong> from your event.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete Speaker'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteGuestSpeakerDialog;

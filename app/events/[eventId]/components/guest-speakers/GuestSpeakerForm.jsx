'use client'
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { validateGuestSpeaker, formatSpeakerName } from './speakerUtils';
import { IconAlertTriangle, IconUser, IconUpload, IconX } from '@tabler/icons-react';
import SocialLinksManager from './SocialLinksManager';
import api from '@/lib/api';
import { toast } from 'sonner';

const initialFormData = {
    name: '',
    bio: '',
    photoUrl: '',
    socialLinks: {}
};

export function GuestSpeakerForm({
    open,
    onOpenChange,
    speaker = null,
    onSubmit,
    loading = false,
    eventId
}) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState([]);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const isEditing = !!speaker;

    // Initialize form data when speaker changes
    useEffect(() => {
        if (speaker) {
            setFormData({
                name: speaker.name || '',
                bio: speaker.bio || '',
                photoUrl: speaker.photoUrl || '',
                socialLinks: speaker.socialLinks || {}
            });
        } else {
            setFormData(initialFormData);
        }
    }, [speaker]);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setFormData(initialFormData);
            setErrors([]);
            setUploadProgress(0);
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Format speaker name
        const processedData = {
            ...formData,
            name: formatSpeakerName(formData.name),
            bio: formData.bio?.trim() || undefined,
            photoUrl: formData.photoUrl?.trim() || undefined,
        };

        // Remove empty social links
        if (processedData.socialLinks) {
            const cleanedLinks = {};
            Object.entries(processedData.socialLinks).forEach(([platform, url]) => {
                if (url && url.trim()) {
                    cleanedLinks[platform] = url.trim();
                }
            });
            processedData.socialLinks = Object.keys(cleanedLinks).length > 0 ? cleanedLinks : undefined;
        }

        // Validate form
        const validationErrors = validateGuestSpeaker(processedData);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear errors and submit
        setErrors([]);

        try {
            await onSubmit(processedData);
            onOpenChange(false);
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear errors when user starts typing
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    // Handle photo upload
    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrors(['Please select a valid image file']);
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setErrors(['Image size must be less than 5MB']);
            return;
        }

        setUploadingPhoto(true);
        setUploadProgress(0);
        setErrors([]);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('folder', 'guest_photo');
            uploadFormData.append('type', 'img');
            uploadFormData.append('file', file);

            const response = await api.post('/util/upload', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            });

            if (response.data?.file?.url) {
                updateFormData('photoUrl', response.data.file.url);
                toast.success('Photo uploaded successfully');
            } else {
                setErrors(['Failed to upload photo']);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Photo upload failed';
            setErrors([errorMessage]);
            toast.error(errorMessage);
        } finally {
            setUploadingPhoto(false);
            setUploadProgress(0);
        }
    };

    const removePhoto = () => {
        updateFormData('photoUrl', '');
    };

    const isFormDisabled = loading || uploadingPhoto;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <div className="p-1.5 rounded-full bg-primary/10">
                            <IconUser className="w-5 h-5 text-primary" />
                        </div>
                        {isEditing ? 'Edit Guest Speaker' : 'Add Guest Speaker'}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[65vh] sm:max-h-[65vh]">
                    <form onSubmit={handleSubmit} className="space-y-6 px-1 pb-2">
                        {/* Error Display */}
                        {errors.length > 0 && (
                            <Alert variant="destructive">
                                <IconAlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    <ul className="list-disc list-inside space-y-1">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Photo Section */}
                        <div className="space-y-4">
                            <Label className="text-sm font-medium">Speaker Photo</Label>
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <div className="flex-shrink-0 mx-auto sm:mx-0">
                                    <Avatar className="w-24 h-24 sm:w-20 sm:h-20 border-2 border-border/50">
                                        {formData.photoUrl && formData.photoUrl.trim() && (
                                            <AvatarImage src={formData.photoUrl} alt="Speaker photo" className="object-cover" />
                                        )}
                                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                                            <IconUser className="w-12 h-12 sm:w-10 sm:h-10 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    {formData.photoUrl && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={removePhoto}
                                            disabled={isFormDisabled}
                                            className="mt-2 w-full text-xs"
                                        >
                                            <IconX className="w-3 h-3 mr-1" />
                                            Remove
                                        </Button>
                                    )}
                                </div>
                                
                                <div className="flex-1 space-y-3 w-full">
                                    <div>
                                        <Input
                                            value={formData.photoUrl}
                                            onChange={(e) => updateFormData('photoUrl', e.target.value)}
                                            placeholder="Enter photo URL or upload below"
                                            disabled={isFormDisabled}
                                            className="text-sm"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={isFormDisabled}
                                            onClick={() => document.getElementById('photo-upload').click()}
                                            className="flex items-center gap-2 w-full sm:w-auto"
                                        >
                                            <IconUpload className="w-4 h-4" />
                                            {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                                        </Button>
                                        
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                        />
                                        
                                        {uploadingPhoto && (
                                            <div className="space-y-2">
                                                <Progress value={uploadProgress} className="h-2" />
                                                <p className="text-xs text-muted-foreground text-center">
                                                    Uploading... {uploadProgress}%
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Recommended: High-quality headshot, professional appearance (max 5MB)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Speaker Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => updateFormData('name', e.target.value)}
                                    placeholder="Enter speaker's full name"
                                    disabled={isFormDisabled}
                                    required
                                    className="text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Full name as it should appear to participants
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Biography</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => updateFormData('bio', e.target.value)}
                                    placeholder="Enter speaker's biography, achievements, expertise, and why they're relevant to your event..."
                                    disabled={isFormDisabled}
                                    rows={4}
                                    className="resize-none text-sm"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Provide a compelling biography to attract participants</span>
                                    <span>{formData.bio.length} characters</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <SocialLinksManager
                            socialLinks={formData.socialLinks}
                            onChange={(links) => updateFormData('socialLinks', links)}
                            disabled={isFormDisabled}
                        />
                    </form>
                </ScrollArea>

                <DialogFooter className="gap-2 mt-4 pt-4 border-t border-border/50">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isFormDisabled}
                        className="flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isFormDisabled || !formData.name.trim()}
                        className="flex-1 sm:flex-none"
                    >
                        {loading 
                            ? (isEditing ? 'Updating...' : 'Adding...') 
                            : (isEditing ? 'Update Speaker' : 'Add Speaker')
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default GuestSpeakerForm;

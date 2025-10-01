'use client'
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DateTimeInput } from '@/components/ui/date-time-input';
import { validateSession, formatDateTimeLocal } from './sessionUtils';
import { IconAlertTriangle } from '@tabler/icons-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialFormData = {
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    venue: {
        name: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
    }
};

export function SessionForm({
    open,
    onOpenChange,
    session = null,
    onSubmit,
    loading = false,
    eventMode = 'online'
}) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState([]);

    const isEditing = !!session;
    const isVenueRequired = eventMode === 'offline' || eventMode === 'hybrid';

    // Initialize form data when session changes
    useEffect(() => {
        if (session) {
            setFormData({
                title: session.title || '',
                description: session.description || '',
                startTime: formatDateTimeLocal(session.startTime),
                endTime: formatDateTimeLocal(session.endTime),
                venue: {
                    name: session.venue?.name || '',
                    address: session.venue?.address || '',
                    city: session.venue?.city || '',
                    state: session.venue?.state || '',
                    country: session.venue?.country || '',
                    zipCode: session.venue?.zipCode || ''
                }
            });
        } else {
            setFormData(initialFormData);
        }
    }, [session]);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setFormData(initialFormData);
            setErrors([]);
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const validationErrors = validateSession(formData, eventMode);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear errors and submit
        setErrors([]);

        try {
            const sessionData = {
                ...formData,
                // Don't include venue if not required
                ...(isVenueRequired ? {} : { venue: undefined })
            };

            await onSubmit(sessionData);
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
    };

    const updateVenueData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            venue: {
                ...prev.venue,
                [field]: value
            }
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Session' : 'Add New Session'}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className={'h-full'}>
                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] px-1">
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

                        {/* Basic Information */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Session Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => updateFormData('title', e.target.value)}
                                    placeholder="Enter session title"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => updateFormData('description', e.target.value)}
                                    placeholder="Enter session description"
                                    disabled={loading}
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time *</Label>
                                <DateTimeInput
                                    id="startTime"
                                    value={formData.startTime}
                                    onChange={(value) => updateFormData('startTime', value)}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time *</Label>
                                <DateTimeInput
                                    id="endTime"
                                    value={formData.endTime}
                                    onChange={(value) => updateFormData('endTime', value)}
                                    minDateTime={formData.startTime}
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Venue Information */}
                        {isVenueRequired && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Label className="text-base font-medium">Venue Information</Label>
                                    <span className="text-xs text-muted-foreground">
                                        (Required for {eventMode} events)
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="venueName">Venue Name *</Label>
                                        <Input
                                            id="venueName"
                                            value={formData.venue.name}
                                            onChange={(e) => updateVenueData('name', e.target.value)}
                                            placeholder="Enter venue name"
                                            disabled={loading}
                                            required={isVenueRequired}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="venueAddress">Address *</Label>
                                        <Input
                                            id="venueAddress"
                                            value={formData.venue.address}
                                            onChange={(e) => updateVenueData('address', e.target.value)}
                                            placeholder="Enter venue address"
                                            disabled={loading}
                                            required={isVenueRequired}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="venueCity">City *</Label>
                                        <Input
                                            id="venueCity"
                                            value={formData.venue.city}
                                            onChange={(e) => updateVenueData('city', e.target.value)}
                                            placeholder="Enter city"
                                            disabled={loading}
                                            required={isVenueRequired}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="venueState">State *</Label>
                                        <Input
                                            id="venueState"
                                            value={formData.venue.state}
                                            onChange={(e) => updateVenueData('state', e.target.value)}
                                            placeholder="Enter state"
                                            disabled={loading}
                                            required={isVenueRequired}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="venueCountry">Country *</Label>
                                        <Input
                                            id="venueCountry"
                                            value={formData.venue.country}
                                            onChange={(e) => updateVenueData('country', e.target.value)}
                                            placeholder="Enter country"
                                            disabled={loading}
                                            required={isVenueRequired}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="venueZipCode">ZIP Code *</Label>
                                        <Input
                                            id="venueZipCode"
                                            value={formData.venue.zipCode}
                                            onChange={(e) => updateVenueData('zipCode', e.target.value)}
                                            placeholder="Enter ZIP code"
                                            disabled={loading}
                                            required={isVenueRequired}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </ScrollArea>

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
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update Session' : 'Add Session')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default SessionForm;

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

export function SessionForm({
    open,
    onOpenChange,
    session = null,
    onSubmit,
    loading = false,
    eventMode,
    event
}) {
    // Helper function to create default form data
    const getDefaultFormData = () => ({
        title: '',
        description: '',
        startTime: event?.registrationEndsAt 
            ? new Date(new Date(event.registrationEndsAt).getTime() + 60 * 60 * 1000).toISOString() 
            : new Date().toISOString(),
        endTime: event?.registrationEndsAt 
            ? new Date(new Date(event.registrationEndsAt).getTime() + 2 * 60 * 60 * 1000).toISOString() 
            : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        venue: {
            name: '',
            address: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
        }
    });

    const [formData, setFormData] = useState(getDefaultFormData);
    const [errors, setErrors] = useState([]);

    const isEditing = !!session;
    const isVenueRequired = eventMode === 'offline' || eventMode === 'hybrid';

    // Venue field configuration
    const venueFields = [
        { key: 'name', label: 'Venue Name', placeholder: 'Enter venue name' },
        { key: 'address', label: 'Address', placeholder: 'Enter venue address' },
        { key: 'city', label: 'City', placeholder: 'Enter city' },
        { key: 'state', label: 'State', placeholder: 'Enter state' },
        { key: 'country', label: 'Country', placeholder: 'Enter country' },
        { key: 'zipCode', label: 'ZIP Code', placeholder: 'Enter ZIP code' }
    ];

    // Basic form fields configuration
    const basicFields = [
        { 
            key: 'title', 
            label: 'Session Title', 
            placeholder: 'Enter session title', 
            type: 'input', 
            required: true 
        },
        { 
            key: 'description', 
            label: 'Description', 
            placeholder: 'Enter session description', 
            type: 'textarea', 
            required: false,
            rows: 3
        }
    ];

    const dateFields = [
        { 
            key: 'startTime', 
            label: 'Start Time', 
            required: true 
        },
        { 
            key: 'endTime', 
            label: 'End Time', 
            required: true,
            minDateTime: formData.startTime
        }
    ];

    // Handle form input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const newData = {
                ...prev,
                [field]: value
            };
            return newData;
        });
    };

    // Handle venue input changes
    const handleVenueChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            venue: {
                ...prev.venue,
                [field]: value
            }
        }));
    };

    // Initialize form data when session changes
    useEffect(() => {
        if (session) {
            setFormData({
                title: session.title || '',
                description: session.description || '',
                startTime: session.startTime ? new Date(session.startTime).toISOString() : new Date().toISOString(),
                endTime: session.endTime ? new Date(session.endTime).toISOString() : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
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
            setFormData(getDefaultFormData());
        }
    }, [session, event]);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            setFormData(getDefaultFormData());
            setErrors([]);
        }
    }, [open, event]);

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
                            {basicFields.map((field) => (
                                <div key={field.key} className="space-y-2">
                                    <Label htmlFor={field.key}>
                                        {field.label} {field.required && '*'}
                                    </Label>
                                    {field.type === 'textarea' ? (
                                        <Textarea
                                            id={field.key}
                                            value={formData[field.key]}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            disabled={loading}
                                            rows={field.rows}
                                            required={field.required}
                                        />
                                    ) : (
                                        <Input
                                            id={field.key}
                                            value={formData[field.key]}
                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            disabled={loading}
                                            required={field.required}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 gap-4">
                            {dateFields.map((field) => (
                                <div key={field.key} className="space-y-2">
                                    <Label htmlFor={field.key}>
                                        {field.label} {field.required && '*'}
                                    </Label>
                                    <DateTimeInput
                                        id={field.key}
                                        value={formData[field.key]}
                                        onChange={(value) => handleInputChange(field.key, value)}
                                        minDateTime={field.minDateTime}
                                        disabled={loading}
                                        required={field.required}
                                    />
                                </div>
                            ))}
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
                                    {venueFields.map((field) => (
                                        <div key={field.key} className="space-y-2">
                                            <Label htmlFor={`venue${field.key}`}>{field.label} *</Label>
                                            <Input
                                                id={`venue${field.key}`}
                                                value={formData.venue[field.key]}
                                                onChange={(e) => handleVenueChange(field.key, e.target.value)}
                                                placeholder={field.placeholder}
                                                disabled={loading}
                                                required={isVenueRequired}
                                            />
                                        </div>
                                    ))}
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

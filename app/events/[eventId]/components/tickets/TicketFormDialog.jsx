'use client'
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconAlertCircle, IconPlus, IconEdit } from '@tabler/icons-react';

const ticketTypes = [
    { value: "Regular", label: "Regular" },
    { value: "VIP", label: "VIP" },
    { value: "VVIP", label: "VVIP" },
    { value: "Student", label: "Student" },
    { value: "Early Bird", label: "Early Bird" },
    { value: "Group", label: "Group" },
    { value: "Custom", label: "Custom" }
];

export function TicketFormDialog({
    isCreateMode = true,
    ticket = null,
    onCreate,
    onUpdate,
    createLoading = false,
    updateLoading = false,
    trigger,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange
}) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: 'Regular',
        customType: '',
        price: '',
        capacity: '',
        templateUrl: '',
        isGroupTicket: false,
        groupSettings: {
            minParticipants: '',
            maxParticipants: '',
            groupLeaderRequired: false
        }
    });
    const [errors, setErrors] = useState({});

    // Use controlled state if provided, otherwise use internal state
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = controlledOnOpenChange || setInternalOpen;

    // Initialize form when ticket prop changes
    useEffect(() => {
        if (ticket && open) {
            initializeForm(ticket);
        }
    }, [ticket, open]);

    // Initialize form when editing
    const initializeForm = (ticketData) => {
        if (ticketData) {
            const isCustomType = !ticketTypes.some(t => t.value === ticketData.type);
            const formDataToSet = {
                type: isCustomType ? 'Custom' : ticketData.type,
                customType: isCustomType ? ticketData.type : '',
                price: ticketData.price?.toString() || '',
                capacity: ticketData.capacity?.toString() || '',
                templateUrl: ticketData.templateUrl || ''
                ,
                isGroupTicket: !!ticketData.isGroupTicket,
                groupSettings: ticketData.groupSettings ? {
                    minParticipants: ticketData.groupSettings.minParticipants?.toString() || '',
                    maxParticipants: ticketData.groupSettings.maxParticipants?.toString() || '',
                    groupLeaderRequired: !!ticketData.groupSettings.groupLeaderRequired
                } : {
                    minParticipants: '',
                    maxParticipants: '',
                    groupLeaderRequired: false
                }
            };
            setFormData(formDataToSet);
        } else {
            setFormData({
                type: 'Regular',
                customType: '',
                price: '',
                capacity: '',
                templateUrl: '',
                isGroupTicket: false,
                groupSettings: {
                    minParticipants: '',
                    maxParticipants: '',
                    groupLeaderRequired: false
                }
            });
        }
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        // Type validation
        if (formData.type === 'Custom' && !formData.customType.trim()) {
            newErrors.customType = 'Custom ticket type is required';
        }

        // Price validation
        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (parseFloat(formData.price) < 0) {
            newErrors.price = 'Price must be non-negative';
        }

        // Capacity validation
        if (!formData.capacity) {
            newErrors.capacity = 'Capacity is required';
        } else if (parseInt(formData.capacity) < 1) {
            newErrors.capacity = 'Capacity must be at least 1';
        } else if (parseInt(formData.capacity) > 10000) {
            newErrors.capacity = 'Capacity cannot exceed 10,000';
        } else if (!isCreateMode && ticket?.sold > 0 && parseInt(formData.capacity) < ticket.sold) {
            newErrors.capacity = `Capacity cannot be reduced below ${ticket.sold} (already sold)`;
        }

        // Group settings validation when enabled
        if (formData.isGroupTicket) {
            const min = parseInt(formData.groupSettings.minParticipants || '0')
            const max = parseInt(formData.groupSettings.maxParticipants || '0')

            if (!formData.groupSettings.minParticipants) {
                newErrors.groupSettings = 'Minimum participants is required for group tickets'
            } else if (min < 1) {
                newErrors.groupSettings = 'Minimum participants must be at least 1'
            }

            if (!formData.groupSettings.maxParticipants) {
                newErrors.groupSettings = 'Maximum participants is required for group tickets'
            } else if (max < min) {
                newErrors.groupSettings = 'Maximum participants must be greater than or equal to minimum'
            }

            // capacity must be >= maxParticipants
            if (formData.capacity && max > 0 && parseInt(formData.capacity) < max) {
                newErrors.capacity = `Capacity must be at least the group max participants (${max})`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const payload = {
            type: formData.type === 'Custom' ? formData.customType : formData.type,
            price: parseFloat(formData.price),
            capacity: parseInt(formData.capacity),
            templateUrl: formData.templateUrl || undefined
        };

        if (formData.isGroupTicket) {
            payload.isGroupTicket = true
            payload.groupSettings = {
                minParticipants: parseInt(formData.groupSettings.minParticipants),
                maxParticipants: parseInt(formData.groupSettings.maxParticipants),
                groupLeaderRequired: !!formData.groupSettings.groupLeaderRequired
            }
        }

        try {
            if (isCreateMode) {
                await onCreate(payload);
            } else {
                await onUpdate(ticket._id, payload);
            }
            setOpen(false);
            initializeForm();
        } catch (error) {
            // Error handling is done in parent component
        }
    };

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
            initializeForm(ticket);
        }
    };

    const handleTypeChange = (value) => {
        setFormData(prev => ({
            ...prev,
            type: value,
            customType: value === 'Custom' ? prev.customType : ''
        }));
        setErrors(prev => ({ ...prev, customType: undefined }));
    };

    const handleToggleGroup = (checked) => {
        setFormData(prev => ({ ...prev, isGroupTicket: checked }));
        setErrors(prev => ({ ...prev, groupSettings: undefined }));
    }

    const handleGroupNumber = (field, value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setFormData(prev => ({ ...prev, groupSettings: { ...prev.groupSettings, [field]: numericValue } }));
        setErrors(prev => ({ ...prev, groupSettings: undefined }));
    }

    const handleGroupLeaderRequired = (checked) => {
        setFormData(prev => ({ ...prev, groupSettings: { ...prev.groupSettings, groupLeaderRequired: !!checked } }));
    }

    const handleNumberInput = (field, value) => {
        // Only allow numbers and empty string
        const numericValue = value.replace(/[^0-9.]/g, '');
        setFormData(prev => ({ ...prev, [field]: numericValue }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const isLoading = isCreateMode ? createLoading : updateLoading;
    const hasExistingSales = !isCreateMode && ticket?.sold > 0;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent className="w-[95vw] sm:max-w-2xl lg:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isCreateMode ? (
                            <>
                                <IconPlus className="w-5 h-5" />
                                Create Ticket
                            </>
                        ) : (
                            <>
                                <IconEdit className="w-5 h-5" />
                                Edit Ticket
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] sm:max-h-none w-full" innerClassName="p-4">
                    <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 space-x-4">
                        {/* Type Selection */}
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="type">Ticket Type *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={handleTypeChange}
                                disabled={hasExistingSales}
                            >
                                <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder="Select ticket type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ticketTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {hasExistingSales && (
                                <p className="text-xs text-muted-foreground">
                                    Type cannot be changed after sales
                                </p>
                            )}
                            {errors.type && (
                                <p className="text-sm text-destructive">{errors.type}</p>
                            )}
                        </div>

                        {/* Custom Type Input */}
                        {formData.type === 'Custom' && (
                            <div className="space-y-2">
                                <Label htmlFor="customType">Custom Type Name *</Label>
                                <Input
                                    id="customType"
                                    value={formData.customType}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, customType: e.target.value }));
                                        setErrors(prev => ({ ...prev, customType: undefined }));
                                    }}
                                    placeholder="Enter custom ticket type"
                                    className={errors.customType ? 'border-destructive' : ''}
                                    disabled={hasExistingSales}
                                />
                                {hasExistingSales && (
                                    <p className="text-xs text-muted-foreground">
                                        Type cannot be changed after sales
                                    </p>
                                )}
                                {errors.customType && (
                                    <p className="text-sm text-destructive">{errors.customType}</p>
                                )}
                            </div>
                        )}

                        {/* Price Input */}
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹) *</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleNumberInput('price', e.target.value)}
                                placeholder="0.00"
                                className={errors.price ? 'border-destructive' : ''}
                                disabled={hasExistingSales}
                            />
                            {hasExistingSales && (
                                <p className="text-xs text-muted-foreground">
                                    Price cannot be changed after sales
                                </p>
                            )}
                            {errors.price && (
                                <p className="text-sm text-destructive">{errors.price}</p>
                            )}
                        </div>

                        {/* Capacity Input */}
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity *</Label>
                            <Input
                                id="capacity"
                                type="number"
                                min={hasExistingSales ? ticket?.sold : "1"}
                                max="10000"
                                value={formData.capacity}
                                onChange={(e) => handleNumberInput('capacity', e.target.value)}
                                placeholder="100"
                                className={errors.capacity ? 'border-destructive' : ''}
                            />
                            {errors.capacity && (
                                <p className="text-sm text-destructive">{errors.capacity}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {hasExistingSales
                                    ? `Capacity cannot be reduced below ${ticket?.sold} (already sold)`
                                    : "Maximum capacity: 10,000 tickets"
                                }
                            </p>
                        </div>

                        {/* Template URL */}
                        <div className="space-y-2 hidden">
                            <Label htmlFor="templateUrl">Template URL (Optional)</Label>
                            <Input
                                id="templateUrl"
                                type="url"
                                value={formData.templateUrl}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, templateUrl: e.target.value }));
                                }}
                                placeholder="https://example.com/ticket-template.jpg"
                            />
                            <p className="text-xs text-muted-foreground">
                                URL to a custom ticket design template
                            </p>
                        </div>

                        {/* Group Ticket Toggle */}
                        <div className="space-y-2">
                            <Label htmlFor="isGroupTicket">Group Ticket</Label>
                            <div className="flex items-center gap-3">
                                <Switch checked={formData.isGroupTicket} onCheckedChange={handleToggleGroup} id="isGroupTicket" disabled={hasExistingSales} />
                                <p className="text-sm text-muted-foreground">Enable group ticket settings</p>
                            </div>
                            {hasExistingSales && (
                                <p className="text-xs text-muted-foreground">Group settings cannot be changed after sales</p>
                            )}
                        </div>

                        {/* Group Settings */}
                        {formData.isGroupTicket && (
                            <div className="space-y-2 p-2 border rounded">
                                <Label>Group Settings</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="minParticipants">Min Participants</Label>
                                        <Input id="minParticipants" value={formData.groupSettings.minParticipants} onChange={(e) => handleGroupNumber('minParticipants', e.target.value)} placeholder="4" disabled={hasExistingSales} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="maxParticipants">Max Participants</Label>
                                        <Input id="maxParticipants" value={formData.groupSettings.maxParticipants} onChange={(e) => handleGroupNumber('maxParticipants', e.target.value)} placeholder="10" disabled={hasExistingSales} />
                                    </div>
                                </div>
                                <div className="items-center gap-2 mt-2 hidden">
                                    <Switch checked={formData.groupSettings.groupLeaderRequired} onCheckedChange={handleGroupLeaderRequired} disabled={hasExistingSales} />
                                    <Label>Group Leader Required</Label>
                                </div>
                            </div>
                        )}

                        {/* Restrictions Alert */}
                        {!isCreateMode && ticket?.sold > 0 && (
                            <Alert>
                                <IconAlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    This ticket has sales. Type and price cannot be changed, and capacity cannot be reduced below {ticket.sold}.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 col-span-2">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                )}
                                {isCreateMode ? 'Create Ticket' : 'Update Ticket'}
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

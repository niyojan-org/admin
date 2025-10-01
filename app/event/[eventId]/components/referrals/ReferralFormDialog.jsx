'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import {
    IconUser,
    IconRefresh,
    IconSearch,
    IconLoader2,
    IconAlertCircle,
    IconCopy
} from '@tabler/icons-react';
import { DateTimeInput } from '@/components/ui/date-time-input';
import { ScrollArea } from '@/components/ui/scroll-area';
import api from '@/lib/api';

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Code generation utility
const generateSecureCode = (length = 8) => {
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const allChars = upperCase + numbers;

    let result = '';
    // Ensure at least one uppercase and one number
    result += upperCase.charAt(Math.floor(Math.random() * upperCase.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));

    // Fill the rest randomly
    for (let i = 2; i < length; i++) {
        result += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the result
    return result.split('').sort(() => Math.random() - 0.5).join('');
};

// Validation rules
const validationRules = {
    code: {
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[A-Z0-9!@#$%^&*]+$/,
        message: 'Code must contain only uppercase letters, numbers, and special characters'
    },
    maxUsage: {
        required: true,
        min: 1,
        max: 10000
    },
    whose: {
        required: true
    }
};

function ReferralFormDialog({
    trigger,
    open,
    setOpen,
    referral = null,
    onSuccess,
    eventId
}) {
    const isCreateMode = !referral;

    // Form state
    const [formData, setFormData] = useState({
        code: '',
        whose: '',
        maxUsage: '100',
        expiresAt: '',
        isActive: true
    });

    // State management
    const [errors, setErrors] = useState({});
    const [fieldTouched, setFieldTouched] = useState({});
    const [createLoading, setCreateLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);

    // User search state
    const [organizationUsers, setOrganizationUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [usersLoading, setUsersLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Initialization
    useEffect(() => {
        if (open) {
            setErrors({});
            setFieldTouched({});
            setUserSearch('');

            if (isCreateMode) {
                setFormData({
                    code: '',
                    whose: '',
                    maxUsage: '100',
                    expiresAt: '',
                    isActive: true
                });
            } else if (referral) {
                const user = referral.whose;
                setFormData({
                    code: referral.code || '',
                    whose: user?._id || user || '',
                    maxUsage: referral.maxUsage?.toString() || '100',
                    expiresAt: referral.expiresAt || '',
                    isActive: referral.isActive ?? true
                });

                if (user && organizationUsers.length === 0) {
                    setOrganizationUsers([user]);
                }
            }
        }
    }, [open, referral, isCreateMode]);

    // User search
    const debouncedSearchUsers = useCallback(
        debounce(async (searchTerm) => {
            if (searchTerm.trim().length < 2) {
                return;
            }

            setUsersLoading(true);
            try {
                const response = await api.get(`/org/members?search=${encodeURIComponent(searchTerm.trim())}`);

                const data = response.data.data;
                setOrganizationUsers(data.members || []);

                if (data.members?.length === 0) {
                    toast.info('No users found matching your search');
                }
            } catch (error) {
                console.error('Error searching users:', error);
                toast.error('Failed to search users. Please try again.');
            } finally {
                setUsersLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        if (userSearch.trim()) {
            debouncedSearchUsers(userSearch);
        }
    }, [userSearch, debouncedSearchUsers]);

    const handleDropdownOpen = async () => {
        if (!hasSearched && organizationUsers.length === 0) {
            setHasSearched(true);
            setUsersLoading(true);
            try {
                const response = await api.get('/org/members?limit=50');
                const data = response.data.data;
                setOrganizationUsers(data.members || []);
            } catch (error) {
                console.error('Error loading users:', error);
                toast.error('Failed to load users. Please try searching instead.');
            } finally {
                setUsersLoading(false);
            }
        }
    };

    const filteredUsers = useMemo(() => {
        if (!userSearch.trim()) return organizationUsers;

        const searchLower = userSearch.toLowerCase();
        return organizationUsers.filter(user =>
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.orgRole?.toLowerCase().includes(searchLower)
        );
    }, [organizationUsers, userSearch]);

    // Code generation
    const generateReferralCode = () => {
        const newCode = generateSecureCode(8);
        setFormData(prev => ({ ...prev, code: newCode }));
        setErrors(prev => ({ ...prev, code: undefined }));
        setFieldTouched(prev => ({ ...prev, code: true }));
        toast.success('Code generated!');
    };

    // Copy code to clipboard
    const copyCodeToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(formData.code);
            toast.success('Code copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy code');
        }
    };

    // Validation
    const validateField = (fieldName, value) => {
        const rule = validationRules[fieldName];
        if (!rule) return null;

        if (rule.required && (!value || value.toString().trim() === '')) {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }

        if (fieldName === 'code') {
            if (value.length < rule.minLength) {
                return `Code must be at least ${rule.minLength} characters`;
            }
            if (value.length > rule.maxLength) {
                return `Code cannot exceed ${rule.maxLength} characters`;
            }
            if (!rule.pattern.test(value)) {
                return rule.message;
            }
        }

        if (fieldName === 'maxUsage') {
            const numValue = parseInt(value);
            if (isNaN(numValue) || numValue < rule.min) {
                return `Maximum usage must be at least ${rule.min}`;
            }
            if (numValue > rule.max) {
                return `Maximum usage cannot exceed ${rule.max}`;
            }
        }

        if (fieldName === 'expiresAt' && value) {
            const expiryDate = new Date(value);
            if (expiryDate <= new Date()) {
                return 'Expiry date must be in the future';
            }
        }

        return null;
    };

    const validateForm = () => {
        const newErrors = {};

        Object.keys(validationRules).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });

        if (formData.expiresAt) {
            const error = validateField('expiresAt', formData.expiresAt);
            if (error) newErrors.expiresAt = error;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFieldChange = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        setFieldTouched(prev => ({ ...prev, [fieldName]: true }));

        setErrors(prev => ({ ...prev, [fieldName]: undefined }));

        setTimeout(() => {
            const error = validateField(fieldName, value);
            if (error && fieldTouched[fieldName]) {
                setErrors(prev => ({ ...prev, [fieldName]: error }));
            }
        }, 500);
    };

    // Submit
    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        const loadingSetter = isCreateMode ? setCreateLoading : setUpdateLoading;
        loadingSetter(true);

        const toastId = toast.loading(
            isCreateMode ? 'Creating referral code...' : 'Updating referral code...'
        );

        try {
            const payload = {
                ...formData,
                maxUsage: parseInt(formData.maxUsage)
            };

            let response;
            if (isCreateMode) {
                response = await api.post(`/event/admin/referral/${eventId}`, payload);
            } else {
                response = await api.put(`/event/admin/referral/${eventId}/${referral._id}`, payload);
            }

            const data = response.referral;

            toast.dismiss(toastId);

            toast.success(
                isCreateMode
                    ? 'Referral code created successfully!'
                    : 'Referral code updated successfully!',
                {
                    duration: 4000,
                    action: {
                        label: "Copy Code",
                        onClick: () => copyCodeToClipboard()
                    }
                }
            );

            setOpen(false);
            onSuccess?.(data);
        } catch (error) {
            console.error('Error saving referral:', error);
            toast.dismiss(toastId);
            const errorMessage = error.response?.data?.message || 'Failed to save referral code';
            toast.error(errorMessage);
        } finally {
            loadingSetter(false);
        }
    };

    const handleOpenChange = (newOpen) => {
        if (!newOpen && (createLoading || updateLoading)) {
            return;
        }
        setOpen(newOpen);
    };

    const isLoading = isCreateMode ? createLoading : updateLoading;
    const hasExistingUsage = !isCreateMode && referral?.usageCount > 0;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent className="max-h-[85vh] overflow-hidden w-[95vw] max-w-[95vw] sm:w-full sm:max-w-2xl">
                {/* Simple Header - Mobile Optimized */}
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="text-lg sm:text-xl">
                        {isCreateMode ? 'Create Referral Code' : 'Edit Referral Code'}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {isCreateMode ? 'Generate a new referral code and assign it to a team member' : 'Modify referral code settings'}
                    </DialogDescription>
                </DialogHeader>

                {/* Content - Mobile Optimized */}
                <ScrollArea className="max-h-[55vh]">
                    {/* Code Generation Section */}
                    <div className='space-y-3 sm:space-y-4'>{/* Responsive spacing */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Referral Code</CardTitle>
                                <CardDescription>
                                    Generate or enter a unique referral code
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="code">Code *</Label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Input
                                            id="code"
                                            value={formData.code}
                                            onChange={(e) => handleFieldChange('code', e.target.value.toUpperCase())}
                                            placeholder="Enter referral code..."
                                            className={`font-mono flex-1 ${errors.code ? 'border-destructive' : ''}`}
                                            disabled={hasExistingUsage}
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={generateReferralCode}
                                                disabled={hasExistingUsage}
                                                className="flex-1 sm:flex-none"
                                            >
                                                <IconRefresh className="w-4 h-4 mr-2" />
                                                Generate
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={copyCodeToClipboard}
                                                disabled={!formData.code}
                                            >
                                                <IconCopy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {errors.code && (
                                        <p className="text-sm text-destructive">{errors.code}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* User Assignment Section */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">User Assignment</CardTitle>
                                <CardDescription>
                                    Assign this referral code to a team member
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="whose">Assign to User *</Label>
                                    <div className="relative">
                                        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search users by name, email, or role..."
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select
                                        value={formData.whose}
                                        onValueChange={(value) => {
                                            setFormData(prev => ({ ...prev, whose: value }));
                                            setErrors(prev => ({ ...prev, whose: undefined }));
                                            setUserSearch('');
                                        }}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                handleDropdownOpen();
                                            }
                                        }}
                                    >
                                        <SelectTrigger className={errors.whose ? 'border-destructive' : ''}>
                                            <SelectValue placeholder="Select a user">
                                                {formData.whose && organizationUsers.find(u => u._id === formData.whose)?.name}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            {!hasSearched && organizationUsers.length === 0 ? (
                                                <div className="p-2 text-sm text-muted-foreground text-center">
                                                    Click to load members...
                                                </div>
                                            ) : usersLoading ? (
                                                <div className="flex items-center justify-center py-4">
                                                    <IconLoader2 className="w-4 h-4 animate-spin mr-2" />
                                                    <span className="text-sm text-muted-foreground">Searching members...</span>
                                                </div>
                                            ) : filteredUsers.length === 0 ? (
                                                <div className="p-2 text-sm text-muted-foreground text-center">
                                                    {userSearch ? 'No users found matching search' : 'No users available'}
                                                </div>
                                            ) : (
                                                filteredUsers.map(user => (
                                                    <SelectItem key={user._id} value={user._id}>
                                                        <div className="flex items-center gap-3 py-1">
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <IconUser className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium truncate">{user.name}</div>
                                                                <div className="text-xs text-muted-foreground truncate">
                                                                    {user.email}
                                                                </div>
                                                                <div className="text-xs text-primary font-medium">
                                                                    {user.orgRole}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.whose && (
                                        <p className="text-sm text-destructive">{errors.whose}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Usage Configuration Section */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Usage Configuration</CardTitle>
                                <CardDescription>
                                    Set usage limits and validity period
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maxUsage">Maximum Usage *</Label>
                                    <Input
                                        id="maxUsage"
                                        type="number"
                                        min="1"
                                        max="1000"
                                        value={formData.maxUsage}
                                        onChange={(e) => {
                                            setFormData(prev => ({ ...prev, maxUsage: e.target.value }));
                                            setErrors(prev => ({ ...prev, maxUsage: undefined }));
                                        }}
                                        placeholder="100"
                                        className={errors.maxUsage ? 'border-destructive' : ''}
                                    />
                                    {hasExistingUsage && referral?.usageCount > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            Cannot be reduced below current usage ({referral.usageCount})
                                        </p>
                                    )}
                                    {errors.maxUsage && (
                                        <p className="text-sm text-destructive">{errors.maxUsage}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Expiry Date & Time (Optional)</Label>
                                    <DateTimeInput
                                        value={formData.expiresAt}
                                        onChange={(isoString) => {
                                            setFormData(prev => ({ ...prev, expiresAt: isoString }));
                                            setErrors(prev => ({ ...prev, expiresAt: undefined }));
                                        }}
                                        minDateTime={new Date().toISOString()}
                                        className={errors.expiresAt ? 'border-destructive' : ''}
                                    />
                                    {errors.expiresAt && (
                                        <p className="text-sm text-destructive">{errors.expiresAt}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Leave empty for no expiration.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status Section */}
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                            <div className="space-y-1">
                                <Label htmlFor="isActive">Active Status</Label>
                                <p className="text-xs text-muted-foreground">
                                    Only active codes can be used by participants
                                </p>
                            </div>
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                            />
                        </div>

                        {/* Usage Warning */}
                        {hasExistingUsage && (
                            <Alert>
                                <IconAlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    This referral code has {referral.usageCount} usage(s). Some fields cannot be modified.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </ScrollArea>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="order-2 sm:order-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="order-1 sm:order-2"
                    >
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        )}
                        {isCreateMode ? 'Create Referral' : 'Update Referral'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ReferralFormDialog;
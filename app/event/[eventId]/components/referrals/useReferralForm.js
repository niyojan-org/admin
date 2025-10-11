import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { debounce, generateSecureCode, validateField, validateForm } from './referralFormUtils';

export function useReferralForm({ open, referral, isCreateMode, eventId, onSuccess, setOpen }) {
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
    const [userPopoverOpen, setUserPopoverOpen] = useState(false);

    // Initialization
    useEffect(() => {
        if (open) {
            setErrors({});
            setFieldTouched({});
            setUserSearch('');
            setUserPopoverOpen(false);

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
            if (!searchTerm || searchTerm.trim().length < 2) {
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
                setOrganizationUsers([]);
            } finally {
                setUsersLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        if (userSearch && userSearch.trim()) {
            debouncedSearchUsers(userSearch);
        }
    }, [userSearch, debouncedSearchUsers]);

    const handleDropdownOpen = async () => {
        if (!hasSearched && (!organizationUsers || organizationUsers.length === 0)) {
            setHasSearched(true);
            setUsersLoading(true);
            try {
                const response = await api.get('/org/members?limit=50');
                const data = response.data.data;
                setOrganizationUsers(data.members || []);
            } catch (error) {
                console.error('Error loading users:', error);
                toast.error('Failed to load users. Please try searching instead.');
                setOrganizationUsers([]);
            } finally {
                setUsersLoading(false);
            }
        }
    };

    const filteredUsers = useMemo(() => {
        return organizationUsers || [];
    }, [organizationUsers]);

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
    const handleSubmit = useCallback(async () => {
        // Prevent double submission
        const currentLoading = isCreateMode ? createLoading : updateLoading;
        if (currentLoading) {
            console.log('Submit prevented: already in progress');
            return;
        }

        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            console.log('Validation errors:', validationErrors); // Debug log
            console.log('Form data:', formData); // Debug log
            setErrors(validationErrors);

            // Show first error in toast
            const firstError = Object.values(validationErrors)[0];
            toast.error(firstError || 'Please fix the errors before submitting');
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
            if (!payload.code) {
                loadingSetter(false);
                return;
            }
            console.log('Submitting payload:', payload); // Debug log

            let response;
            if (isCreateMode) {
                response = await api.post(`/event/admin/referral/${eventId}`, payload);
            } else {
                response = await api.put(`/event/admin/referral/${eventId}/${referral._id}`, payload);
            }

            console.log('API Response:', response); // Debug log
            const data = response.referral;
            const codeValue = formData.code; // Capture code before dialog closes

            toast.dismiss(toastId);
            toast.success(
                isCreateMode
                    ? 'Referral code created successfully!'
                    : 'Referral code updated successfully!',
                {
                    duration: 4000,
                    action: {
                        label: "Copy Code",
                        onClick: async () => {
                            try {
                                await navigator.clipboard.writeText(codeValue);
                                toast.success('Code copied to clipboard!');
                            } catch (error) {
                                toast.error('Failed to copy code');
                            }
                        }
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
    }, [formData, isCreateMode, createLoading, updateLoading, eventId, referral, setOpen, onSuccess]);

    const isLoading = isCreateMode ? createLoading : updateLoading;
    const hasExistingUsage = !isCreateMode && referral?.usageCount > 0;

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        isLoading,
        hasExistingUsage,
        organizationUsers,
        userSearch,
        setUserSearch,
        usersLoading,
        hasSearched,
        userPopoverOpen,
        setUserPopoverOpen,
        filteredUsers,
        handleDropdownOpen,
        generateReferralCode,
        copyCodeToClipboard,
        handleFieldChange,
        handleSubmit
    };
}

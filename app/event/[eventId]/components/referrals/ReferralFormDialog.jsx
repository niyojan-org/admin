'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useReferralForm } from './useReferralForm';
import { ReferralCodeSection } from './ReferralCodeSection';
import { UserAssignmentSection } from './UserAssignmentSection';
import { UsageConfigSection } from './UsageConfigSection';
import { StatusSection } from './StatusSection';

function ReferralFormDialog({
    trigger,
    open,
    setOpen,
    referral = null,
    onSuccess,
    eventId
}) {
    const isCreateMode = !referral;

    const {
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
    } = useReferralForm({ open, referral, isCreateMode, eventId, onSuccess, setOpen });

    const handleOpenChange = (newOpen) => {
        if (!newOpen && isLoading) {
            return;
        }
        setOpen(newOpen);
    };

    const handleUserSelect = (userId) => {
        setFormData(prev => ({ ...prev, whose: userId }));
        setErrors(prev => ({ ...prev, whose: undefined }));
        setUserPopoverOpen(false);
        setUserSearch('');
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent className="max-h-[85vh] overflow-hidden w-[95vw] max-w-[95vw] sm:w-full sm:max-w-2xl">
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="text-lg sm:text-xl">
                        {isCreateMode ? 'Create Referral Code' : 'Edit Referral Code'}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {isCreateMode ? 'Generate a new referral code and assign it to a team member' : 'Modify referral code settings'}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[55vh]">
                    <div className='space-y-3 sm:space-y-4'>
                        <ReferralCodeSection
                            formData={formData}
                            errors={errors}
                            hasExistingUsage={hasExistingUsage}
                            onFieldChange={handleFieldChange}
                            onGenerate={generateReferralCode}
                            onCopy={copyCodeToClipboard}
                        />

                        <UserAssignmentSection
                            formData={formData}
                            errors={errors}
                            organizationUsers={organizationUsers}
                            userSearch={userSearch}
                            setUserSearch={setUserSearch}
                            usersLoading={usersLoading}
                            hasSearched={hasSearched}
                            userPopoverOpen={userPopoverOpen}
                            setUserPopoverOpen={setUserPopoverOpen}
                            filteredUsers={filteredUsers}
                            onDropdownOpen={handleDropdownOpen}
                            onUserSelect={handleUserSelect}
                        />

                        <UsageConfigSection
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                            setErrors={setErrors}
                            hasExistingUsage={hasExistingUsage}
                            referral={referral}
                        />

                        <StatusSection
                            formData={formData}
                            setFormData={setFormData}
                            hasExistingUsage={hasExistingUsage}
                            referral={referral}
                        />
                    </div>
                </ScrollArea>

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

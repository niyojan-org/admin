'use client'
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';

// Import benefits components
import { useBenefitsData } from './benefits/useBenefitsData';
import BenefitsHeader from './benefits/BenefitsHeader';
import BenefitsList from './benefits/BenefitsList';
import BenefitForm from './benefits/BenefitForm';

export const Benefits = ({ eventId }) => {
    const { user } = useUserStore();
    const [mounted, setMounted] = useState(false);
    const userRole = user?.organization?.role || 'volunteer';

    // Get benefits data and operations
    const {
        benefits,
        loading,
        error,
        addBenefit,
        updateBenefit,
        deleteBenefit,
        reorderBenefits,
        refetch
    } = useBenefitsData(eventId);

    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);

    // Fix hydration issues
    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <Card className="w-full">
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </Card>
        );
    }

    // Handle add benefit
    const handleAddBenefit = async (benefitData) => {
        try {
            await addBenefit(benefitData);
            setShowAddDialog(false);
        } catch (error) {
            // Error is handled in the hook
            throw error;
        }
    };

    // Handle edit benefit
    const handleEditBenefit = async (benefitId, benefitData) => {
        try {
            await updateBenefit(benefitId, benefitData);
        } catch (error) {
            // Error is handled in the hook
            throw error;
        }
    };

    // Handle delete benefit
    const handleDeleteBenefit = async (benefitId) => {
        try {
            await deleteBenefit(benefitId);
        } catch (error) {
            // Error is handled in the hook
            throw error;
        }
    };

    // Handle reorder benefits
    const handleReorderBenefits = async (benefitIds) => {
        try {
            await reorderBenefits(benefitIds);
        } catch (error) {
            // Error is handled in the hook
            throw error;
        }
    };

    return (
        <>
            <Card className="w-full gap-2">
                <BenefitsHeader
                    benefitCount={benefits.length}
                    onAddBenefit={() => setShowAddDialog(true)}
                    userRole={userRole}
                    loading={loading}
                />

                <BenefitsList
                    benefits={benefits}
                    loading={loading}
                    error={error}
                    onEditBenefit={handleEditBenefit}
                    onDeleteBenefit={handleDeleteBenefit}
                    onReorderBenefits={handleReorderBenefits}
                    onAddBenefit={() => setShowAddDialog(true)}
                    onRefresh={refetch}
                    userRole={userRole}
                />
            </Card>

            {/* Add Benefit Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Benefit</DialogTitle>
                    </DialogHeader>
                    <BenefitForm
                        onSubmit={handleAddBenefit}
                        loading={loading}
                        onCancel={() => setShowAddDialog(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

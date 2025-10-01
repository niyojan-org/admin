
'use client'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import api from '@/lib/api';
import { toast } from 'sonner';

// Import organized components
import ReferralCard from './referrals/ReferralCard';
import ReferralFormDialog from './referrals/ReferralFormDialog';
import DeleteReferralDialog from './referrals/DeleteReferralDialog';
import ReferralDetailsDialog from './referrals/ReferralDetailsDialog';
import ReferralStats from './referrals/ReferralStats';
import ReferralFilters from './referrals/ReferralFilters';
import ReferralPagination from './referrals/ReferralPagination';
import ReferralEmptyState from './referrals/ReferralEmptyState';
import ReferralLoadingSkeleton from './referrals/ReferralLoadingSkeleton';
import { useReferralData } from './referrals/useReferralData';
import { processReferrals, paginateData } from './referrals/referralUtils';

export default function Referrals({ eventId }) {
    // Use custom hook for data management
    const {
        referrals,
        systemEnabled,
        loading,
        error,
        toggleLoading,
        systemToggleLoading,
        userRole,
        stats,
        handleToggleReferral,
        handleToggleSystem,
        handleCreateReferral,
        handleUpdateReferral,
        handleDeleteReferral,
        refetch
    } = useReferralData(eventId);

    // Local state for UI
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);

    // Dialog states
    const [selectedReferral, setSelectedReferral] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Process and paginate referrals
    const processedReferrals = processReferrals(referrals, searchQuery, statusFilter, sortBy);
    const { data: paginatedReferrals, totalPages, totalItems } = paginateData(
        processedReferrals, 
        currentPage, 
        itemsPerPage
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, sortBy]);

    // Fetch individual referral details
    const fetchReferralDetails = async (referralId) => {
        try {
            setDetailsLoading(true);
            const response = await api.get(`/event/admin/referral/${eventId}/${referralId}`);
            setSelectedReferral(response.data.referral);
            setShowDetailsDialog(true);
        } catch (error) {
            console.error('Error fetching referral details:', error);
            
            // Handle specific error cases
            if (error.response?.data?.error?.code === 'REFERRAL_NOT_FOUND') {
                toast.error('Referral not found or has been deleted');
            } else if (error.response?.data?.error?.code === 'ACCESS_DENIED') {
                // Don't show toast for access denied - it's handled elsewhere
            } else {
                toast.error('Failed to fetch referral details');
            }
        } finally {
            setDetailsLoading(false);
        }
    };

    // Dialog handlers
    const openCreateDialog = () => {
        setSelectedReferral(null);
        setShowCreateDialog(true);
    };

    const openEditDialog = (referral) => {
        setSelectedReferral(referral);
        setShowEditDialog(true);
    };

    const openDeleteDialog = (referral) => {
        setSelectedReferral(referral);
        setShowDeleteDialog(true);
    };

    const handleViewDetails = (referral) => {
        setSelectedReferral(referral);
        setShowDetailsDialog(true);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setSortBy('newest');
    };

    // Form handlers
    const handleCreateSuccess = async (formData) => {
        try {
            setCreateLoading(true);
            await handleCreateReferral(formData);
            setShowCreateDialog(false);
        } catch (error) {
            console.error('Error creating referral:', error);
            toast.error(error.response?.data?.message || 'Failed to create referral');
            throw error;
        } finally {
            setCreateLoading(false);
        }
    };

    const handleEditSuccess = async (referralId, formData) => {
        try {
            await handleUpdateReferral(referralId, formData);
            setShowEditDialog(false);
            setSelectedReferral(null);
        } catch (error) {
            console.error('Error updating referral:', error);
            toast.error(error.response?.data?.message || 'Failed to update referral');
            throw error;
        }
    };

    const handleDeleteSuccess = async () => {
        try {
            setDeleteLoading(true);
            await handleDeleteReferral(selectedReferral);
            setShowDeleteDialog(false);
            setSelectedReferral(null);
        } catch (error) {
            console.error('Error deleting referral:', error);
            toast.error(error.response?.data?.message || 'Failed to delete referral');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Don't render if there's a critical error that prevents the component from working
    // Allow the component to render for normal cases like no referrals found or access denied
    if (error && error.includes('Event not found')) {
        return null;
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-4">
                <ReferralStats
                    stats={stats}
                    systemEnabled={systemEnabled}
                    onToggleSystem={handleToggleSystem}
                    onCreateReferral={openCreateDialog}
                    userRole={userRole}
                    systemToggleLoading={systemToggleLoading}
                />

                <ReferralFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    processedReferrals={processedReferrals}
                    onClearFilters={clearFilters}
                />
            </CardHeader>

            <CardContent className="pt-0 space-y-1">
                {loading ? (
                    <ReferralLoadingSkeleton />
                ) : paginatedReferrals.length === 0 ? (
                    <ReferralEmptyState
                        searchQuery={searchQuery}
                        statusFilter={statusFilter}
                        userRole={userRole}
                        systemEnabled={systemEnabled}
                    />
                ) : (
                    <>
                        {/* Referrals Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            {paginatedReferrals.map((referral) => (
                                <ReferralCard
                                    key={referral._id}
                                    referral={referral}
                                    onEdit={openEditDialog}
                                    onDelete={openDeleteDialog}
                                    onToggle={handleToggleReferral}
                                    onViewDetails={handleViewDetails}
                                    toggleLoading={toggleLoading.has(referral._id)}
                                    userRole={userRole}
                                />
                            ))}
                        </div>

                        <ReferralPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalItems}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </CardContent>

            {/* Dialogs */}
            <ReferralFormDialog
                trigger={null}
                open={showCreateDialog}
                setOpen={setShowCreateDialog}
                referral={null}
                onSuccess={handleCreateSuccess}
                eventId={eventId}
                loading={createLoading}
            />

            <ReferralFormDialog
                trigger={null}
                open={showEditDialog}
                setOpen={setShowEditDialog}
                referral={selectedReferral}
                onSuccess={handleEditSuccess}
                eventId={eventId}
            />

            <DeleteReferralDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                referral={selectedReferral}
                onConfirm={handleDeleteSuccess}
                loading={deleteLoading}
            />

            <ReferralDetailsDialog
                open={showDetailsDialog}
                onOpenChange={setShowDetailsDialog}
                referral={selectedReferral}
                loading={detailsLoading}
                userRole={userRole}
            />
        </Card>
    );
}
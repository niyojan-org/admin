'use client'
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { IconTicket, IconPlus, IconShieldCheck, IconShieldX } from '@tabler/icons-react';
import api from '@/lib/api';
import { toast } from 'sonner';

// Import organized components
import { CouponHeader } from './coupons/CouponHeader';
import { CouponStats } from './coupons/CouponStats';
import { CouponActions } from './coupons/CouponActions';
import { CouponFormDialog } from './coupons/CouponFormDialog';
import { PaginationControls } from './coupons/PaginationControls';
import { CouponDetailsDialog } from './coupons/CouponDetailsDialog';
import { CouponAllowanceDialog } from './coupons/CouponAllowanceToggle';

export default function Coupons({ eventId }) {
    // State management
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(new Set());
    const [deleteLoading, setDeleteLoading] = useState(new Set());

    // Individual coupon details state
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [couponDetailsLoading, setCouponDetailsLoading] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);

    // Coupon allowance dialog state
    const [showAllowanceDialog, setShowAllowanceDialog] = useState(false);
    const [allowCoupons, setAllowCoupons] = useState(false);
    const [allowanceLoading, setAllowanceLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Debounced functions to prevent multiple API calls
    const debouncedToggle = useCallback(
        debounce(async (couponId, newStatus) => {
            try {
                await api.patch(`/events/admin/coupon/${eventId}/${couponId}/toggle`, { isActive: newStatus });
                setCoupons(prev => prev.map(c =>
                    c._id === couponId ? { ...c, isActive: newStatus } : c
                ));
                toast.success(`Coupon ${newStatus ? 'activated' : 'deactivated'} successfully`);
            } catch (error) {
                console.error('Error toggling coupon:', error);
                toast.error('Failed to update coupon status');
                // Revert the toggle
                setCoupons(prev => prev.map(c =>
                    c._id === couponId ? { ...c, isActive: !newStatus } : c
                ));
            } finally {
                setToggleLoading(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(couponId);
                    return newSet;
                });
            }
        }, 300),
        []
    );

    // Fetch coupons
    const fetchCoupons = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/events/admin/coupon/${eventId}`);

            // Ensure we always set an array
            const couponsData = response.data?.coupons || response.data || [];
            setCoupons(Array.isArray(couponsData) ? couponsData : []);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            setError(error.response?.data?.message || 'Failed to fetch coupons');

            // Don't show toast for role access denied errors
            if (error.response?.data?.error?.code !== 'ROLE_ACCESS_DENIED') {
                toast.error('Failed to fetch coupons');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch coupon allowance status
    const fetchCouponAllowance = async () => {
        try {
            setAllowanceLoading(true);
            const response = await api.get(`/events/admin/coupon/${eventId}/allow-coupons`);
            setAllowCoupons(response.data.allowCoupons || false);
        } catch (error) {
            console.error('Error fetching coupon allowance:', error);
            // Silent fail for allowance status
        } finally {
            setAllowanceLoading(false);
        }
    };

    // Fetch individual coupon details
    const fetchCouponDetails = async (couponId) => {
        try {
            setCouponDetailsLoading(true);
            const response = await api.get(`/events/admin/coupon/${eventId}/${couponId}`);
            setSelectedCoupon(response.data.coupon);
            setShowDetailsDialog(true);
        } catch (error) {
            console.error('Error fetching coupon details:', error);

            // Don't show toast for role access denied errors
            if (error.response?.data?.error?.code !== 'ROLE_ACCESS_DENIED') {
                toast.error('Failed to fetch coupon details');
            }
        } finally {
            setCouponDetailsLoading(false);
        }
    };

    // Create coupon
    const handleCreateCoupon = async (formData) => {
        try {
            setCreateLoading(true);
            console.log(formData);
            const response = await api.post(`/events/admin/coupon/${eventId}`, {
                ...formData,
                eventId
            });
            setCoupons(prev => [response.data.coupon, ...prev]);
            toast.success('Coupon created successfully');
        } catch (error) {
            console.error('Error creating coupon:', error);
            toast.error(error.response?.data?.message || 'Failed to create coupon', {
                description: error.response?.data?.error?.details || ''
            });
        } finally {
            setCreateLoading(false);
        }
    };

    // Update coupon
    const handleUpdateCoupon = async (couponId, formData) => {
        try {
            setUpdateLoading(true);
            const response = await api.put(`event/admin/coupon/${eventId}/${couponId}`, formData);
            setCoupons(prev => prev.map(c =>
                c._id === couponId ? response.data.coupon : c
            ));
            toast.success('Coupon updated successfully');
        } catch (error) {
            console.error('Error updating coupon:', error);
            toast.error(error.response?.data?.message || 'Failed to update coupon');
        } finally {
            setUpdateLoading(false);
        }
    };

    // Toggle coupon status
    const handleToggleCoupon = async (coupon) => {
        const newStatus = !coupon.isActive;

        // Optimistic update
        setCoupons(prev => prev.map(c =>
            c._id === coupon._id ? { ...c, isActive: newStatus } : c
        ));

        // Add to loading set
        setToggleLoading(prev => new Set(prev).add(coupon._id));

        // Call debounced function
        debouncedToggle(coupon._id, newStatus);
    };

    // Delete coupon
    const handleDeleteCoupon = async (coupon) => {
        try {
            setDeleteLoading(prev => new Set(prev).add(coupon._id));
            await api.delete(`/events/admin/coupon/${eventId}/${coupon._id}`);
            setCoupons(prev => prev.filter(c => c._id !== coupon._id));
            toast.success('Coupon deleted successfully');
        } catch (error) {
            console.error('Error deleting coupon:', error);
            toast.error('Failed to delete coupon');
        } finally {
            setDeleteLoading(prev => {
                const newSet = new Set(prev);
                newSet.delete(coupon._id);
                return newSet;
            });
        }
    };

    // Copy to clipboard
    const handleCopyCode = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success('Coupon code copied to clipboard');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            toast.error('Failed to copy coupon code');
        }
    };

    // Pagination calculations
    const couponsArray = Array.isArray(coupons) ? coupons : [];
    const totalPages = Math.ceil(couponsArray.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCoupons = couponsArray.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        if (eventId) {
            fetchCoupons();
            fetchCouponAllowance();
        }
    }, [eventId]);

    // Reset to first page if current page is beyond available pages
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    // Don't render if there's an error
    if (error) {
        return null;
    }

    return (
        <>
            <Card>
                <CardHeader className="">
                    <div className="flex flex-col gap-2 items-start justify-between">
                        <CardTitle className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <IconTicket className="w-5 h-5 text-primary" />
                                <span>Coupons</span>
                            </div>

                            <span className='font-semibold text-muted-foreground text-sm'>Manage Discount and offer</span>
                        </CardTitle>
                        <div className="grid grid-cols-2 items-center justify-between w-full gap-2">
                            {allowanceLoading ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    className="flex items-center gap-1"
                                >
                                    <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                                    Loading...
                                </Button>
                            ) : (
                                <Button
                                    variant={allowCoupons ? "default" : "destructive"}
                                    size="sm"
                                    onClick={() => setShowAllowanceDialog(true)}
                                    className="flex items-center gap-1"
                                >
                                    {allowCoupons ? (
                                        <IconShieldCheck className="w-3 h-3" />
                                    ) : (
                                        <IconShieldX className="w-3 h-3" />
                                    )}
                                    {allowCoupons ? 'Coupons Enabled' : 'Coupons Disabled'}
                                </Button>
                            )}
                            <CouponFormDialog
                                isCreateMode={true}
                                onCreate={handleCreateCoupon}
                                createLoading={createLoading}
                                trigger={
                                    <Button size="sm" className="flex items-center gap-1">
                                        <IconPlus className="w-3 h-3" />
                                        Add Coupon
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="">
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-6 w-20" />
                                            <Skeleton className="h-5 w-5" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-6 w-16" />
                                            <Skeleton className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="mt-2">
                                        <Skeleton className="h-2 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="text-center text-muted-foreground items-center flex flex-col">
                            <IconTicket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">No coupons created yet</p>
                            <p className="text-sm mb-3">Create your first coupon to start offering discounts</p>
                            <CouponFormDialog
                                isCreateMode={true}
                                onCreate={handleCreateCoupon}
                                createLoading={createLoading}
                                trigger={
                                    <Button size="sm" className="flex items-center gap-1">
                                        <IconPlus className="w-3 h-3" />
                                        Add Coupon
                                    </Button>
                                }
                            />
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1">
                                {currentCoupons.map((coupon) => (
                                    <div key={coupon._id} className="border rounded-lg p-4 space-y-3">
                                        <CouponHeader
                                            coupon={coupon}
                                            onCopy={handleCopyCode}
                                            onViewDetails={fetchCouponDetails}
                                        />
                                        <CouponStats
                                            coupon={coupon}
                                        />
                                        <CouponActions
                                            coupon={coupon}
                                            onToggle={handleToggleCoupon}
                                            onEdit={handleUpdateCoupon}
                                            onDelete={handleDeleteCoupon}
                                            toggleLoading={toggleLoading}
                                            deleteLoading={deleteLoading}
                                            updateLoading={updateLoading}
                                        />
                                    </div>
                                ))}
                            </div>

                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalCoupons={couponsArray.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </CardContent>
            </Card >

            <CouponDetailsDialog
                open={showDetailsDialog}
                onOpenChange={setShowDetailsDialog}
                coupon={selectedCoupon}
                loading={couponDetailsLoading}
            />

            <CouponAllowanceDialog
                eventId={eventId}
                open={showAllowanceDialog}
                onOpenChange={setShowAllowanceDialog}
                onAllowanceChange={setAllowCoupons}
            />
        </>
    );
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

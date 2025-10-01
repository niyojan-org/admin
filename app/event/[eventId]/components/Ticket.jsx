'use client'
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { IconTicket, IconPlus } from '@tabler/icons-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useStore, useUserStore } from '@/store/userStore';

// Import organized components
import { TicketHeader } from './tickets/TicketHeader';
import { TicketStats } from './tickets/TicketStats';
import { TicketFormDialog } from './tickets/TicketFormDialog';
import { DeleteTicketDialog } from './tickets/DeleteTicketDialog';
import { TicketDetailsDialog } from './tickets/TicketDetailsDialog';

export default function Tickets({ eventId }) {
    // State management
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [createLoading, setCreateLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(new Set());
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Dialog states
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // Get user role from store
    const { user } = useUserStore();
    const userRole = user?.organization.role || 'volunteer';

    // Debounced functions to prevent multiple API calls
    const debouncedToggle = useCallback(
        debounce(async (ticketId, newStatus) => {
            try {
                await api.put(`/event/admin/ticket/${eventId}/toggle-active-ticket/${ticketId}`);
                setTickets(prev => prev.map(t =>
                    t._id === ticketId ? { ...t, isActive: newStatus } : t
                ));
                toast.success(`Ticket ${newStatus ? 'activated' : 'deactivated'} successfully`);
            } catch (error) {
                console.error('Error toggling ticket:', error);
                toast.error('Failed to update ticket status');
                // Revert the toggle
                setTickets(prev => prev.map(t =>
                    t._id === ticketId ? { ...t, isActive: !newStatus } : t
                ));
            } finally {
                setToggleLoading(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(ticketId);
                    return newSet;
                });
            }
        }, 300),
        [eventId]
    );

    // Fetch tickets
    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/event/admin/ticket/${eventId}`);

            // Ensure we always set an array
            const ticketsData = response.data?.tickets || response.data || [];
            setTickets(Array.isArray(ticketsData) ? ticketsData : []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setError(error.response?.data?.message || 'Failed to fetch tickets');

            // Don't show toast for role access denied errors
            if (error.response?.data?.error?.code !== 'ROLE_ACCESS_DENIED') {
                toast.error('Failed to fetch tickets');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch individual ticket details
    const fetchTicketDetails = async (ticketId) => {
        try {
            setDetailsLoading(true);
            const response = await api.get(`/event/admin/ticket/${eventId}/${ticketId}`);
            setSelectedTicket(response.data.ticket);
            setShowDetailsDialog(true);
        } catch (error) {
            console.error('Error fetching ticket details:', error);
            if (error.response?.data?.error?.code !== 'ROLE_ACCESS_DENIED') {
                toast.error('Failed to fetch ticket details');
            }
        } finally {
            setDetailsLoading(false);
        }
    };

    // Create ticket
    const handleCreateTicket = async (formData) => {
        try {
            setCreateLoading(true);
            const response = await api.post(`/event/admin/ticket/${eventId}`, formData);
            setTickets(prev => [response.data.ticket, ...prev]);
            toast.success('Ticket created successfully');
        } catch (error) {
            console.error('Error creating ticket:', error);
            toast.error(error.response?.data?.message || 'Failed to create ticket', {
                description: error.response?.data?.error?.details || ''
            });
            throw error; // Re-throw to handle in form
        } finally {
            setCreateLoading(false);
        }
    };

    // Update ticket
    const handleUpdateTicket = async (ticketId, formData) => {
        try {
            setUpdateLoading(true);
            const response = await api.put(`/event/admin/ticket/${eventId}/${ticketId}`, formData);
            setTickets(prev => prev.map(t =>
                t._id === ticketId ? response.data.ticket : t
            ));
            toast.success('Ticket updated successfully');

            // Show warnings if any
            if (response.data.warnings && response.data.warnings.length > 0) {
                response.data.warnings.forEach(warning => {
                    toast.info(warning);
                });
            }

            // Close dialog and clear selected ticket after successful update
            setShowEditDialog(false);
            setSelectedTicket(null);
        } catch (error) {
            console.error('Error updating ticket:', error);
            toast.error(error.response?.data?.message || 'Failed to update ticket');
            throw error; // Re-throw to handle in form
        } finally {
            setUpdateLoading(false);
        }
    };

    // Toggle ticket status
    const handleToggleTicket = async (ticket) => {
        const newStatus = !ticket.isActive;

        // Optimistic update
        setTickets(prev => prev.map(t =>
            t._id === ticket._id ? { ...t, isActive: newStatus } : t
        ));

        // Add to loading set
        setToggleLoading(prev => new Set(prev).add(ticket._id));

        // Call debounced function
        debouncedToggle(ticket._id, newStatus);
    };

    // Delete ticket
    const handleDeleteTicket = async (ticket) => {
        try {
            setDeleteLoading(true);
            const response = await api.delete(`/event/admin/ticket/${eventId}/${ticket._id}`);

            if (response.data.action === 'deleted') {
                setTickets(prev => prev.filter(t => t._id !== ticket._id));
            } else if (response.data.action === 'disabled') {
                setTickets(prev => prev.map(t =>
                    t._id === ticket._id ? response.data.ticket : t
                ));
            }
            toast.success(response.data.message);
            setShowDeleteDialog(false);
            setSelectedTicket(null);
        } catch (error) {
            console.error('Error deleting ticket:', error);
            toast.error(error.response?.data?.message || 'Failed to delete ticket');
        } finally {
            setDeleteLoading(false);
        }
    };

    const openDeleteDialog = (ticket) => {
        setSelectedTicket(ticket);
        setShowDeleteDialog(true);
    };

    const openEditDialog = (ticket) => {
        setSelectedTicket(ticket);
        setShowEditDialog(true);
    };

    const handleEditDialogChange = (open) => {
        setShowEditDialog(open);
        if (!open) {
            // Clear selected ticket when dialog closes
            setSelectedTicket(null);
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchTickets();
        }
    }, [eventId]);

    // Don't render if there's an error
    if (error) {
        return null;
    }

    return (
        <>
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <IconTicket className="w-5 h-5 text-primary flex-shrink-0" />
                            <CardTitle className="text-lg">
                                Tickets ({tickets.length})
                            </CardTitle>
                        </div>

                        {['owner', 'admin'].includes(userRole) && (
                            <TicketFormDialog
                                isCreateMode={true}
                                onCreate={handleCreateTicket}
                                createLoading={createLoading}
                                trigger={
                                    <Button size="sm" className="flex items-center gap-1 w-full sm:w-auto">
                                        <IconPlus className="w-3 h-3" />
                                        <span className="sm:hidden">Add New Ticket</span>
                                        <span className="hidden sm:inline">Add Ticket</span>
                                    </Button>
                                }
                            />
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="border rounded-lg p-3 sm:p-4">
                                    {/* Mobile Loading Skeleton */}
                                    <div className="block sm:hidden space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-5 w-24" />
                                                <div className="flex gap-2">
                                                    <Skeleton className="h-4 w-12" />
                                                    <Skeleton className="h-4 w-16" />
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <Skeleton className="h-6 w-6" />
                                                <Skeleton className="h-6 w-6" />
                                                <Skeleton className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                        <Skeleton className="h-2 w-full" />
                                    </div>

                                    {/* Desktop Loading Skeleton */}
                                    <div className="hidden sm:block space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-6 w-32" />
                                                    <Skeleton className="h-5 w-12" />
                                                    <Skeleton className="h-5 w-16" />
                                                </div>
                                                <div className="flex gap-4">
                                                    <Skeleton className="h-4 w-16" />
                                                    <Skeleton className="h-4 w-20" />
                                                    <Skeleton className="h-4 w-24" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-8 w-16" />
                                                <Skeleton className="h-8 w-8" />
                                                <Skeleton className="h-8 w-8" />
                                                <Skeleton className="h-8 w-8" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-2 w-full" />
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <Skeleton className="h-8 w-full" />
                                                <Skeleton className="h-8 w-full" />
                                                <Skeleton className="h-8 w-full" />
                                                <Skeleton className="h-8 w-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="text-center py-8 px-4 text-muted-foreground">
                            <IconTicket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">No tickets created yet</p>
                            <p className="text-sm">Create your first ticket to start selling</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tickets.map((ticket) => (
                                <div key={ticket._id} className="border rounded-lg p-3 sm:p-4 space-y-3">
                                    <TicketHeader
                                        ticket={ticket}
                                        onToggle={handleToggleTicket}
                                        onEdit={openEditDialog}
                                        onDelete={openDeleteDialog}
                                        onViewDetails={fetchTicketDetails}
                                        toggleLoading={toggleLoading.has(ticket._id)}
                                        userRole={userRole}
                                    />
                                    <TicketStats
                                        ticket={ticket}
                                        userRole={userRole}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Ticket Dialog */}
            <TicketFormDialog
                isCreateMode={false}
                ticket={selectedTicket}
                onUpdate={handleUpdateTicket}
                updateLoading={updateLoading}
                trigger={null}
                open={showEditDialog}
                onOpenChange={handleEditDialogChange}
            />

            {/* Delete Ticket Dialog */}
            <DeleteTicketDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                ticket={selectedTicket}
                onConfirm={() => handleDeleteTicket(selectedTicket)}
                loading={deleteLoading}
            />

            {/* Ticket Details Dialog */}
            <TicketDetailsDialog
                open={showDetailsDialog}
                onOpenChange={setShowDetailsDialog}
                ticket={selectedTicket}
                loading={detailsLoading}
                userRole={userRole}
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
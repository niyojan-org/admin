'use client'
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/store/userStore';

// Import session components
import { useSessionData } from './sessions/useSessionData';
import SessionHeader from './sessions/SessionHeader';
import SessionList from './sessions/SessionList';
import SessionForm from './sessions/SessionForm';
import DeleteSessionDialog from './sessions/DeleteSessionDialog';
import ToggleMultipleSessionsDialog from './sessions/ToggleMultipleSessionsDialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { IconAlertHexagon } from '@tabler/icons-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Sessions({ eventId, className, event }) {
    const { user } = useUserStore();
    const [mounted, setMounted] = useState(false);
    const userRole = user?.organization.role || 'volunteer';

    // Get session data and operations
    const {
        sessions,
        allowMultipleSessions,
        loading,
        error,
        addSession,
        updateSession,
        deleteSession,
        toggleMultipleSessions
    } = useSessionData(eventId);

    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showToggleDialog, setShowToggleDialog] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

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

    // Handle add session
    const handleAddSession = async (sessionData) => {
        try {
            await addSession(sessionData);
            setShowAddDialog(false);
        } catch (error) {
            // Error is handled in the hook
            throw error;
        }
    };

    // Handle edit session
    const handleEditSession = (session) => {
        setSelectedSession(session);
        setShowEditDialog(true);
    };

    const handleUpdateSession = async (sessionData) => {
        try {
            await updateSession(selectedSession._id, sessionData);
            setShowEditDialog(false);
            setSelectedSession(null);
        } catch (error) {
            // Error is handled in the hook
            throw error;
        }
    };

    // Handle delete session
    const handleDeleteSession = (session) => {
        setSelectedSession(session);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteSession(selectedSession._id);
            setShowDeleteDialog(false);
            setSelectedSession(null);
        } catch (error) {
            // Error is handled in the hook
        }
    };

    // Handle toggle multiple sessions
    const handleToggleMultipleSessions = async () => {
        try {
            await toggleMultipleSessions();
            setShowToggleDialog(false);
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Failed to toggle multiple sessions');
        }
    };

    if (!eventId) {
        return (
            <Card className={cn("w-full h-full my-auto items-center flex-col justify-center", className)}>
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-2">
                        <IconAlertHexagon className='h-20 w-20' />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">No Event Selected</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Please select an event to view and manage its sessions
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <>
            <Card className={cn("w-full ", className)}>
                <SessionHeader
                    sessionCount={sessions.length}
                    allowMultipleSessions={allowMultipleSessions}
                    onAddSession={() => setShowAddDialog(true)}
                    onToggleMultipleSessions={() => setShowToggleDialog(true)}
                    userRole={userRole}
                    loading={loading}
                />
                <ScrollArea className="h-[400px] max-h-[400px]">
                <SessionList
                    sessions={sessions}
                    loading={loading}
                    error={error}
                    onEditSession={handleEditSession}
                    onDeleteSession={handleDeleteSession}
                    userRole={userRole}
                />
                </ScrollArea>
            </Card>

            {/* Add Session Dialog */}
            <SessionForm
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                onSubmit={handleAddSession}
                loading={loading}
                eventMode={event?.mode || "offline"}
            />

            {/* Edit Session Dialog */}
            <SessionForm
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                session={selectedSession}
                onSubmit={handleUpdateSession}
                loading={loading}
                eventMode={event?.mode || "offline"}
            />

            {/* Delete Session Dialog */}
            <DeleteSessionDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                session={selectedSession}
                onConfirm={handleConfirmDelete}
                loading={loading}
            />

            {/* Toggle Multiple Sessions Dialog */}
            <ToggleMultipleSessionsDialog
                open={showToggleDialog}
                onOpenChange={setShowToggleDialog}
                currentState={allowMultipleSessions}
                sessionCount={sessions.length}
                onConfirm={handleToggleMultipleSessions}
                loading={loading}
            />
        </>
    );
}
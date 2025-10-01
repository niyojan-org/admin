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

export default function Sessions({ eventId }) {
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

    return (
        <>
            <Card className="w-full">
                <SessionHeader
                    sessionCount={sessions.length}
                    allowMultipleSessions={allowMultipleSessions}
                    onAddSession={() => setShowAddDialog(true)}
                    onToggleMultipleSessions={() => setShowToggleDialog(true)}
                    userRole={userRole}
                    loading={loading}
                />

                <SessionList
                    sessions={sessions}
                    loading={loading}
                    error={error}
                    onEditSession={handleEditSession}
                    onDeleteSession={handleDeleteSession}
                    userRole={userRole}
                />
            </Card>

            {/* Add Session Dialog */}
            <SessionForm
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                onSubmit={handleAddSession}
                loading={loading}
                eventMode="online"
            />

            {/* Edit Session Dialog */}
            <SessionForm
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                session={selectedSession}
                onSubmit={handleUpdateSession}
                loading={loading}
                eventMode="online"
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
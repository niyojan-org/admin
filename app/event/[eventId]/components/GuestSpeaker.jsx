'use client'
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import GuestSpeakerHeader from './guest-speakers/GuestSpeakerHeader';
import GuestSpeakerList from './guest-speakers/GuestSpeakerList';
import GuestSpeakerForm from './guest-speakers/GuestSpeakerForm';
import DeleteGuestSpeakerDialog from './guest-speakers/DeleteGuestSpeakerDialog';
import { useGuestSpeakers } from './guest-speakers/useGuestSpeakers';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const GuestSpeaker = ({ eventId, className }) => {
  // Get user role for permission checks
  const { user } = useUserStore();
  const userRole = user?.organization.role || 'volunteer';

  // Dialog states
  const [speakerFormOpen, setSpeakerFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);

  // Use custom hook for all speaker operations
  const {
    speakers,
    loading,
    addingLoading,
    updatingLoading,
    deletingLoading,
    error,
    addSpeaker,
    updateSpeaker,
    deleteSpeaker
  } = useGuestSpeakers(eventId);

  // Handle opening form dialog
  const handleOpenForm = (speaker = null) => {
    setCurrentSpeaker(speaker);
    setSpeakerFormOpen(true);
  };

  // Handle closing form dialog
  const handleCloseForm = () => {
    setSpeakerFormOpen(false);
    setCurrentSpeaker(null);
  };

  // Handle opening delete dialog
  const handleOpenDelete = (speaker) => {
    setCurrentSpeaker(speaker);
    setDeleteDialogOpen(true);
  };

  // Handle closing delete dialog
  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setCurrentSpeaker(null);
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    if (currentSpeaker) {
      return await updateSpeaker(currentSpeaker._id, formData);
    } else {
      return await addSpeaker(formData);
    }
  };

  // Handle speaker deletion
  const handleDeleteConfirm = async (speakerId) => {
    return await deleteSpeaker(speakerId);
  };

  // Determine loading state for form
  const formLoading = currentSpeaker ? updatingLoading : addingLoading;

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
              Please select an event to view and manage its guest speakers
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden shadow-sm border-border/50", className)}>
      {/* Header Section */}
      <GuestSpeakerHeader
        speakerCount={speakers.length}
        userRole={userRole}
        onAddSpeaker={() => handleOpenForm()}
        loading={loading || addingLoading}
      />

      {/* Speakers List */}
      <GuestSpeakerList
        speakers={speakers}
        loading={loading}
        error={error}
        userRole={userRole}
        onEditSpeaker={handleOpenForm}
        onDeleteSpeaker={handleOpenDelete}
        onAddFirstSpeaker={() => handleOpenForm()}
      />

      {/* Speaker Form Dialog */}
      <GuestSpeakerForm
        open={speakerFormOpen}
        onOpenChange={handleCloseForm}
        speaker={currentSpeaker}
        onSubmit={handleFormSubmit}
        loading={formLoading}
        eventId={eventId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteGuestSpeakerDialog
        open={deleteDialogOpen}
        onOpenChange={handleCloseDelete}
        speaker={currentSpeaker}
        onConfirm={handleDeleteConfirm}
        loading={deletingLoading}
      />
    </Card>
  );
};

export default GuestSpeaker;

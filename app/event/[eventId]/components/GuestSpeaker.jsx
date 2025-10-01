'use client'
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import GuestSpeakerHeader from './guest-speakers/GuestSpeakerHeader';
import GuestSpeakerList from './guest-speakers/GuestSpeakerList';
import GuestSpeakerForm from './guest-speakers/GuestSpeakerForm';
import DeleteGuestSpeakerDialog from './guest-speakers/DeleteGuestSpeakerDialog';
import { useGuestSpeakers } from './guest-speakers/useGuestSpeakers';
import { Card } from '@/components/ui/card';

const GuestSpeaker = ({ eventId }) => {
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

  return (
    <Card className="overflow-hidden shadow-sm border-border/50">
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

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AnnouncementForm } from './AnnouncementForm';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { toast } from 'sonner';

/**
 * Dialog for creating new announcements
 */
export const CreateAnnouncementDialog = ({ eventId, open, onOpenChange, onSuccess, limits }) => {
  const { createAnnouncement } = useAnnouncements(eventId);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    if (!limits?.canSend) {
      toast.error('Cannot send announcement', {
        description: 'Please check rate limits',
      });
      return;
    }

    try {
      setLoading(true);
      const result = await createAnnouncement(data);
      
      toast.success('Announcement created successfully', {
        description: result.isScheduled
          ? 'Announcement scheduled for delivery'
          : 'Announcement queued for delivery',
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error('Error creating announcement:', error);
      
      // Handle specific error codes
      if (error.message.includes('rate limit')) {
        toast.error('Rate limit exceeded', {
          description: error.message,
        });
      } else if (error.message.includes('daily limit')) {
        toast.error('Daily limit reached', {
          description: error.message,
        });
      } else {
        toast.error('Failed to create announcement', {
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
          <DialogDescription>
            Send messages to event participants via WhatsApp, Email, or both.
          </DialogDescription>
        </DialogHeader>
        
        <AnnouncementForm
          eventId={eventId}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

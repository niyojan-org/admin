"use client";

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DateTimeInput } from '@/components/ui/date-time-input';
import { Loader2, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { registrationApi } from '@/lib/api/registration';
import { addDays, addWeeks } from 'date-fns';

/**
 * Extend Deadline Dialog Component
 * Allows extending registration deadline with reason
 */
export default function ExtendDeadlineDialog({ 
  open, 
  onClose, 
  eventId,
  currentEndDate,
  onSuccess 
}) {
  const [newEndDate, setNewEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateExtension = () => {
    const now = new Date();
    const currentEnd = currentEndDate ? new Date(currentEndDate) : null;
    const newEnd = newEndDate ? new Date(newEndDate) : null;

    if (!newEndDate) {
      setError('New end date is required');
      return false;
    }

    if (!newEnd || newEnd <= now) {
      setError('New end date must be in the future');
      return false;
    }

    if (currentEnd && newEnd <= currentEnd) {
      setError('New end date must be after current end date');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateExtension()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const extension = {
        newEndDate,
        reason: reason.trim() || 'Deadline extended'
      };

      const result = await registrationApi.extendDeadline(eventId, extension);
      
      toast.success('Registration deadline extended successfully');
      onSuccess?.(result.data);
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to extend deadline';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNewEndDate('');
      setReason('');
      setError('');
      onClose();
    }
  };

  const getQuickExtensions = () => {
    const current = currentEndDate ? new Date(currentEndDate) : new Date();
    
    return [
      {
        label: '1 Day',
        date: addDays(current, 1).toISOString(),
        reason: 'Extended by 1 day due to popular demand'
      },
      {
        label: '3 Days',
        date: addDays(current, 3).toISOString(),
        reason: 'Extended by 3 days to accommodate more registrations'
      },
      {
        label: '1 Week',
        date: addWeeks(current, 1).toISOString(),
        reason: 'Extended by 1 week due to high interest'
      }
    ];
  };

  const applyQuickExtension = (extension) => {
    setNewEndDate(extension.date);
    setReason(extension.reason);
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Extend Registration Deadline</h2>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                Give participants more time to register
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Current Deadline Info */}
          {currentEndDate && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">Current deadline: </span>
                <span className="text-muted-foreground">
                  {new Date(currentEndDate).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Quick Extensions */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Extensions</Label>
            <div className="grid grid-cols-3 gap-2">
              {getQuickExtensions().map((extension, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickExtension(extension)}
                  disabled={isSubmitting}
                  className="h-auto py-2"
                >
                  +{extension.label}
                </Button>
              ))}
            </div>
          </div>

          {/* New End Date */}
          <div className="space-y-2">
            <Label htmlFor="new-end-date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              New End Date & Time
            </Label>
            <DateTimeInput
              id="new-end-date"
              value={newEndDate}
              onChange={setNewEndDate}
              disabled={isSubmitting}
              placeholder="Select new deadline"
              minDateTime={currentEndDate || new Date().toISOString()}
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Extension
              <span className="text-xs text-muted-foreground ml-1">(Optional)</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g., Extended due to popular demand and venue availability"
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {reason.length}/500 characters
            </div>
          </div>

          {/* Extension Preview */}
          {newEndDate && !error && (
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                Extension Preview
              </h4>
              <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <div>New deadline: {new Date(newEndDate).toLocaleString()}</div>
                {currentEndDate && (
                  <div>
                    Additional time: {Math.round((new Date(newEndDate) - new Date(currentEndDate)) / (1000 * 60 * 60 * 24))} days
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !newEndDate}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Extending...
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Extend Deadline
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

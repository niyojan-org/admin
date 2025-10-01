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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DateTimeInput } from '@/components/ui/date-time-input';
import { Loader2, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { registrationApi } from '@/lib/api/registration';

/**
 * Edit Timeline Dialog Component
 * Allows editing registration start and end dates
 */
export default function EditTimelineDialog({ 
  open, 
  onClose, 
  eventId,
  currentStart,
  currentEnd,
  onSuccess 
}) {
  const [registrationStart, setRegistrationStart] = useState(currentStart || '');
  const [registrationEnd, setRegistrationEnd] = useState(currentEnd || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateTimeline = () => {
    const now = new Date();
    const startDate = registrationStart ? new Date(registrationStart) : null;
    const endDate = registrationEnd ? new Date(registrationEnd) : null;

    // Both dates are required
    if (!registrationStart || !registrationEnd) {
      setError('Both start and end dates are required');
      return false;
    }

    // Start date validation
    if (startDate && startDate < now) {
      // Allow past dates if registration is already open
      if (!currentStart || new Date(currentStart) >= now) {
        setError('Registration start date cannot be in the past');
        return false;
      }
    }

    // End date must be after start date
    if (startDate && endDate && endDate <= startDate) {
      setError('Registration end date must be after start date');
      return false;
    }

    // Minimum duration check (1 hour)
    if (startDate && endDate) {
      const diffInMs = endDate.getTime() - startDate.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        setError('Registration period must be at least 1 hour');
        return false;
      }

      // Maximum duration check (6 months)
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      if (diffInDays > 180) {
        setError('Registration period cannot exceed 6 months');
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validateTimeline()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const timeline = {
        registrationStart: registrationStart || null,
        registrationEnd: registrationEnd || null
      };

      const result = await registrationApi.setTimeline(eventId, timeline);
      
      toast.success('Registration timeline updated successfully');
      onSuccess?.(result.data);
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update timeline';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRegistrationStart(currentStart || '');
      setRegistrationEnd(currentEnd || '');
      setError('');
      onClose();
    }
  };

  const getQuickOptions = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(23, 59, 0, 0);

    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setHours(23, 59, 0, 0);

    return [
      {
        label: 'Tomorrow to Next Week',
        start: tomorrow.toISOString(),
        end: nextWeek.toISOString()
      },
      {
        label: 'Next Week to Next Month',
        start: nextWeek.toISOString(),
        end: nextMonth.toISOString()
      }
    ];
  };

  const applyQuickOption = (option) => {
    setRegistrationStart(option.start);
    setRegistrationEnd(option.end);
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Edit Registration Timeline</h2>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                Set when participants can register for this event
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

          {/* Quick Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Options</Label>
            <div className="grid grid-cols-1 gap-2">
              {getQuickOptions().map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickOption(option)}
                  className="justify-start text-left h-auto py-2"
                  disabled={isSubmitting}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Date/Time Inputs */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Registration Start Date & Time
              </Label>
              <DateTimeInput
                id="start-date"
                value={registrationStart}
                onChange={setRegistrationStart}
                disabled={isSubmitting}
                placeholder="Select start date and time"
              />
              <p className="text-xs text-muted-foreground">
                When participants can start registering
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Registration End Date & Time
              </Label>
              <DateTimeInput
                id="end-date"
                value={registrationEnd}
                onChange={setRegistrationEnd}
                disabled={isSubmitting}
                placeholder="Select end date and time"
                minDateTime={registrationStart}
              />
              <p className="text-xs text-muted-foreground">
                When registration will automatically close
              </p>
            </div>
          </div>

          {/* Timeline Preview */}
          {registrationStart && registrationEnd && !error && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Timeline Preview</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Opens: {new Date(registrationStart).toLocaleString()}</div>
                <div>Closes: {new Date(registrationEnd).toLocaleString()}</div>
                <div className="text-xs">
                  Duration: {Math.round((new Date(registrationEnd) - new Date(registrationStart)) / (1000 * 60 * 60 * 24))} days
                </div>
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
            disabled={isSubmitting || !registrationStart || !registrationEnd}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Update Timeline
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { 
  Loader2, 
  Play, 
  Pause, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { registrationApi } from '@/lib/api/registration';

/**
 * Quick Actions Component
 * Provides quick actions for registration management
 */
export default function QuickActions({ 
  eventId,
  isRegistrationOpen,
  registrationStart,
  registrationEnd,
  requirements = {},
  onStatusChange 
}) {
  const [isToggling, setIsToggling] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [error, setError] = useState('');

  const canOpenRegistration = requirements.canOpenRegistration ?? true;
  const requirementsMet = requirements.requirementsMet ?? true;
  const requirementsData = requirements.requirements || { items: [] };

  const handleToggleClick = (action) => {
    setActionType(action);
    setShowConfirmDialog(true);
    setError('');
  };

  const executeAction = async () => {
    setIsToggling(true);
    setError('');

    try {
      let result;
      
      if (actionType === 'toggle') {
        result = await registrationApi.toggleStatus(eventId);
      }

      toast.success(
        result.data.isRegistrationOpen 
          ? 'Registration opened successfully' 
          : 'Registration closed successfully'
      );
      
      onStatusChange?.(result.data);
      setShowConfirmDialog(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to ${actionType} registration`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsToggling(false);
    }
  };

  const getRegistrationStatus = () => {
    const now = new Date();
    const startDate = registrationStart ? new Date(registrationStart) : null;
    const endDate = registrationEnd ? new Date(registrationEnd) : null;

    if (!isRegistrationOpen) {
      return { status: 'closed', label: 'Closed', action: 'open' };
    }

    if (startDate && now < startDate) {
      return { status: 'scheduled', label: 'Scheduled', action: 'close' };
    }

    if (endDate && now > endDate) {
      return { status: 'ended', label: 'Ended', action: 'reopen' };
    }

    return { status: 'open', label: 'Open', action: 'close' };
  };

  const { status, label, action } = getRegistrationStatus();

  const getActionButton = () => {
    const baseProps = {
      onClick: () => handleToggleClick('toggle'),
      disabled: isToggling,
      className: "w-full"
    };

    switch (action) {
      case 'open':
        return (
          <Button 
            {...baseProps}
            disabled={isToggling || !canOpenRegistration}
          >
            {isToggling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Opening...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Open Registration
              </>
            )}
          </Button>
        );
      
      case 'close':
        return (
          <Button {...baseProps} variant="destructive">
            {isToggling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Closing...
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Close Registration
              </>
            )}
          </Button>
        );
      
      case 'reopen':
        return (
          <Button {...baseProps}>
            {isToggling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Reopening...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Reopen Registration
              </>
            )}
          </Button>
        );
      
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'open':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'closed':
        return <Pause className="w-4 h-4 text-red-600" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'ended':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="font-medium">Registration Status</span>
            </div>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>

          {/* Requirements Check */}
          {!requirementsMet && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Registration requirements not met. Please check event setup.
              </AlertDescription>
            </Alert>
          )}

          {/* Requirements List */}
          {requirementsData.items.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Requirements</h4>
              <div className="space-y-1">
                {requirementsData.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${
                      item.severity === 'error' ? 'bg-red-500' :
                      item.severity === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-muted-foreground">{item.message}</span>
                  </div>
                ))}
                {requirementsData.items.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{requirementsData.items.length - 3} more items
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          {getActionButton()}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Confirm {action === 'open' ? 'Open' : 'Close'} Registration
            </DialogTitle>
            <DialogDescription>
              {action === 'open' 
                ? 'Are you sure you want to open registration? Participants will be able to register for this event.'
                : 'Are you sure you want to close registration? No new participants will be able to register.'
              }
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              disabled={isToggling}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={executeAction}
              disabled={isToggling}
              variant={action === 'close' ? 'destructive' : 'default'}
            >
              {isToggling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `${action === 'open' ? 'Open' : 'Close'} Registration`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

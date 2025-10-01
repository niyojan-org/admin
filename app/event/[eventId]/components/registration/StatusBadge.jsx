"use client";

import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * Registration Status Badge Component
 * Displays the current registration status with appropriate styling
 */
export default function StatusBadge({ 
  isRegistrationOpen, 
  registrationStart, 
  registrationEnd,
  isCurrentlyOpen 
}) {
  const getStatusInfo = () => {
    const now = new Date();
    const startDate = registrationStart ? new Date(registrationStart) : null;
    const endDate = registrationEnd ? new Date(registrationEnd) : null;

    // Registration is scheduled but not started
    if (startDate && now < startDate) {
      return {
        status: 'scheduled',
        label: 'Scheduled',
        variant: 'secondary',
        icon: Clock,
        color: 'text-blue-600'
      };
    }

    // Registration is currently open
    if (isRegistrationOpen && isCurrentlyOpen) {
      return {
        status: 'open',
        label: 'Open',
        variant: 'default',
        icon: CheckCircle,
        color: 'text-green-600'
      };
    }

    // Registration has ended
    if (endDate && now > endDate) {
      return {
        status: 'ended',
        label: 'Ended',
        variant: 'secondary',
        icon: XCircle,
        color: 'text-gray-600'
      };
    }

    // Registration is closed
    if (!isRegistrationOpen) {
      return {
        status: 'closed',
        label: 'Closed',
        variant: 'destructive',
        icon: XCircle,
        color: 'text-red-600'
      };
    }

    // Default fallback
    return {
      status: 'unknown',
      label: 'Unknown',
      variant: 'outline',
      icon: AlertCircle,
      color: 'text-gray-500'
    };
  };

  const { label, variant, icon: Icon, color } = getStatusInfo();

  return (
    <Badge variant={variant} className="gap-1.5 px-3 py-1">
      <Icon className={`w-3 h-3 ${color}`} />
      {label}
    </Badge>
  );
}
"use client";

import { useState, useEffect, useCallback } from 'react';
import { registrationApi } from '@/lib/api/registration';
import { toast } from 'sonner';

/**
 * Custom hook for registration management
 * Provides state management and API calls for registration operations
 */
export function useRegistrationManagement(eventId) {
  const [registrationData, setRegistrationData] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch registration data
  const fetchRegistrationData = useCallback(async () => {
    if (!eventId) return;

    try {
      setError('');
      const statusResult = await registrationApi.getStatus(eventId);
      setRegistrationData(statusResult.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load registration data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  // Fetch requirements
  const fetchRequirements = useCallback(async () => {
    if (!eventId) return;

    try {
      const result = await registrationApi.validateRequirements(eventId);
      setRequirements(result.data);
    } catch (err) {
      // Requirements are optional, don't set error
    }
  }, [eventId]);

  // Toggle registration status
  const toggleRegistration = useCallback(async () => {
    if (!eventId) return;

    try {
      const result = await registrationApi.toggleStatus(eventId);
      setRegistrationData(prev => ({
        ...prev,
        ...result.data
      }));
      
      toast.success(
        result.data.isRegistrationOpen 
          ? 'Registration opened successfully' 
          : 'Registration closed successfully'
      );
      
      return result.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to toggle registration';
      toast.error(errorMessage);
      throw err;
    }
  }, [eventId]);

  // Update timeline
  const updateTimeline = useCallback(async (timeline) => {
    if (!eventId) return;

    try {
      const result = await registrationApi.setTimeline(eventId, timeline);
      setRegistrationData(prev => ({
        ...prev,
        registrationStart: result.data.registrationStart,
        registrationEnd: result.data.registrationEnd,
        isRegistrationOpen: result.data.isRegistrationOpen
      }));
      
      toast.success('Registration timeline updated successfully');
      return result.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update timeline';
      toast.error(errorMessage);
      throw err;
    }
  }, [eventId]);

  // Update settings
  const updateSettings = useCallback(async (settings) => {
    if (!eventId) return;

    try {
      const result = await registrationApi.updateSettings(eventId, settings);
      setRegistrationData(prev => ({
        ...prev,
        features: result.data.settings
      }));
      
      toast.success('Registration settings updated successfully');
      return result.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update settings';
      toast.error(errorMessage);
      throw err;
    }
  }, [eventId]);

  // Extend deadline
  const extendDeadline = useCallback(async (extension) => {
    if (!eventId) return;

    try {
      const result = await registrationApi.extendDeadline(eventId, extension);
      setRegistrationData(prev => ({
        ...prev,
        registrationEnd: result.data.newEndDate,
        isRegistrationOpen: result.data.isRegistrationOpen
      }));
      
      toast.success('Registration deadline extended successfully');
      return result.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to extend deadline';
      toast.error(errorMessage);
      throw err;
    }
  }, [eventId]);

  // Refresh data
  const refresh = useCallback(() => {
    setIsLoading(true);
    return Promise.all([
      fetchRegistrationData(),
      fetchRequirements()
    ]);
  }, [fetchRegistrationData, fetchRequirements]);

  // Initial data load
  useEffect(() => {
    if (eventId) {
      fetchRegistrationData();
      fetchRequirements();
    }
  }, [eventId, fetchRegistrationData, fetchRequirements]);

  // Derived state
  const canOpenRegistration = requirements?.canOpenRegistration ?? true;
  const isCurrentlyOpen = registrationData?.isCurrentlyOpen ?? false;
  const hasTimeline = !!(registrationData?.registrationStart && registrationData?.registrationEnd);

  return {
    // State
    registrationData,
    requirements,
    isLoading,
    error,
    
    // Derived state
    canOpenRegistration,
    isCurrentlyOpen,
    hasTimeline,
    
    // Actions
    toggleRegistration,
    updateTimeline,
    updateSettings,
    extendDeadline,
    refresh,
    
    // Setters for external updates
    setRegistrationData,
    setError
  };
}

export default useRegistrationManagement;

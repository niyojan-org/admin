"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Settings, 
  Calendar, 
  Users,
  RefreshCw,
  AlertTriangle 
} from 'lucide-react';
import { toast } from 'sonner';

// Import our sub-components
import StatusBadge from './StatusBadge';
import TimelineDisplay from './TimelineDisplay';
import EditTimelineDialog from './EditTimelineDialog';
import RegistrationStats from './RegistrationStats';
import RegistrationSettings from './RegistrationSettings';
import QuickActions from './QuickActions';
import { registrationApi } from '@/lib/api/registration';

/**
 * Main Registration Dashboard Component
 * Comprehensive registration management interface
 */
export default function RegistrationDashboard({ eventId, className = "" }) {
  const [registrationData, setRegistrationData] = useState(null);
  const [requirements, setRequirements] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTimelineDialog, setShowTimelineDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch registration data
  const fetchRegistrationData = async () => {
    try {
      setError('');
      const [statusResult, requirementsResult] = await Promise.all([
        registrationApi.getStatus(eventId),
        registrationApi.validateRequirements(eventId).catch(() => ({ data: null }))
      ]);

      setRegistrationData(statusResult.data);
      setRequirements(requirementsResult.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to load registration data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (eventId) {
      fetchRegistrationData();
    }
  }, [eventId]);

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    fetchRegistrationData();
  };

  // Handle status changes from child components
  const handleStatusChange = (newData) => {
    setRegistrationData(prev => ({
      ...prev,
      ...newData
    }));
  };

  // Handle timeline updates
  const handleTimelineUpdate = (newData) => {
    setRegistrationData(prev => ({
      ...prev,
      registrationStart: newData.registrationStart,
      registrationEnd: newData.registrationEnd,
      isRegistrationOpen: newData.isRegistrationOpen
    }));
  };

  // Handle settings updates
  const handleSettingsUpdate = (newSettings) => {
    setRegistrationData(prev => ({
      ...prev,
      features: newSettings
    }));
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading registration data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !registrationData) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">Registration Management</CardTitle>
              {registrationData && (
                <StatusBadge
                  isRegistrationOpen={registrationData.isRegistrationOpen}
                  registrationStart={registrationData.registrationStart}
                  registrationEnd={registrationData.registrationEnd}
                  isCurrentlyOpen={registrationData.isCurrentlyOpen}
                />
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          {registrationData?.eventTitle && (
            <p className="text-sm text-muted-foreground">
              {registrationData.eventTitle}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-full md:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <QuickActions
                eventId={eventId}
                isRegistrationOpen={registrationData?.isRegistrationOpen}
                registrationStart={registrationData?.registrationStart}
                registrationEnd={registrationData?.registrationEnd}
                requirements={requirements}
                onStatusChange={handleStatusChange}
              />
              <TimelineDisplay
                registrationStart={registrationData?.registrationStart}
                registrationEnd={registrationData?.registrationEnd}
                isRegistrationOpen={registrationData?.isRegistrationOpen}
              />
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Configure when participants can register for this event. 
                  The timeline automatically manages registration status.
                </p>
                <Button 
                  onClick={() => setShowTimelineDialog(true)}
                  className="w-full"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Edit Timeline
                </Button>
              </CardContent>
            </Card>
						<TimelineDisplay
              registrationStart={registrationData?.registrationStart}
              registrationEnd={registrationData?.registrationEnd}
              isRegistrationOpen={registrationData?.isRegistrationOpen}
            />
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
					<div className="grid grid-cols-1 gap-6">
          <RegistrationStats
            statistics={registrationData?.statistics}
            tickets={registrationData?.tickets}
            eventId={eventId}
          />
					</div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <RegistrationSettings
            eventId={eventId}
            currentSettings={registrationData?.features}
            onUpdate={handleSettingsUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Timeline Edit Dialog */}
      <EditTimelineDialog
        open={showTimelineDialog}
        onClose={() => setShowTimelineDialog(false)}
        eventId={eventId}
        currentStart={registrationData?.registrationStart}
        currentEnd={registrationData?.registrationEnd}
        onSuccess={handleTimelineUpdate}
      />
    </div>
  );
}

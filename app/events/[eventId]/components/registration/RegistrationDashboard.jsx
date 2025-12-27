"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Spinner } from '@/components/ui/spinner';

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
            <Spinner />
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
    <div className={`space-y-4 h-[850px] sm:h-[600px] flex flex-col ${className}`}>
      {/* Header with Status */}
      <Card className="shrink-0">
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
        <Alert variant="destructive" className="flex-shrink-0">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Statistics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="flex-1 overflow-hidden mt-4 ">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pr-2 pb-2">
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
          </ScrollArea>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="flex-1 overflow-hidden mt-4">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pr-2 pb-2">
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
          </ScrollArea>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="flex-1 overflow-hidden mt-4">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-1 gap-6 pr-2 pb-2">
              <RegistrationStats
                statistics={registrationData?.statistics}
                tickets={registrationData?.tickets}
                eventId={eventId}
              />
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="flex-1 overflow-hidden mt-4">
          <ScrollArea className="h-full">
            <div className="pr-2 pb-2">
              <RegistrationSettings
                eventId={eventId}
                currentSettings={registrationData?.features}
                onUpdate={handleSettingsUpdate}
              />
            </div>
          </ScrollArea>
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

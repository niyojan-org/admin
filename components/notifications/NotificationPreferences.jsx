'use client';

import { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  Monitor,
  Volume2,
  Moon,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { defaultPreferences, NotificationCategory } from './notificationData';
import { toast } from 'sonner';

export default function NotificationPreferences({ open, onOpenChange }) {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggleChannel = (channel) => {
    setPreferences((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        enabled: !prev[channel].enabled,
      },
    }));
    setHasChanges(true);
  };

  const handleToggleCategory = (channel, category) => {
    setPreferences((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        categories: {
          ...prev[channel].categories,
          [category]: !prev[channel].categories[category],
        },
      },
    }));
    setHasChanges(true);
  };

  const handleToggleQuietHours = () => {
    setPreferences((prev) => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: !prev.quietHours.enabled,
      },
    }));
    setHasChanges(true);
  };

  const handleToggleSetting = (setting) => {
    setPreferences((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In real app, save to backend
    console.log('Saving preferences:', preferences);
    toast.success('Notification preferences saved successfully!');
    setHasChanges(false);
    onOpenChange(false);
  };

  const handleReset = () => {
    setPreferences(defaultPreferences);
    setHasChanges(true);
    toast.info('Preferences reset to default');
  };

  const categories = [
    {
      value: NotificationCategory.SYSTEM,
      label: 'System',
      description: 'System updates and maintenance notifications',
    },
    {
      value: NotificationCategory.EVENTS,
      label: 'Events',
      description: 'Event registrations, updates, and reminders',
    },
    {
      value: NotificationCategory.PAYMENTS,
      label: 'Payments',
      description: 'Payment confirmations and transaction updates',
    },
    {
      value: NotificationCategory.ALERTS,
      label: 'Alerts',
      description: 'Security alerts and important notifications',
    },
    {
      value: NotificationCategory.SOCIAL,
      label: 'Social',
      description: 'Follows, mentions, and social interactions',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </DialogTitle>
          <DialogDescription>
            Customize how and when you receive notifications
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="channels" className="flex-1">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="max-h-125 px-6 py-4">
            {/* Channels Tab */}
            <TabsContent value="channels" className="space-y-4 mt-0">
              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Email Notifications</CardTitle>
                        <CardDescription>
                          Receive notifications via email
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.email.enabled}
                      onCheckedChange={() => handleToggleChannel('email')}
                    />
                  </div>
                </CardHeader>
                {preferences.email.enabled && (
                  <CardContent className="space-y-3 pt-0">
                    <Separator />
                    <p className="text-sm text-muted-foreground">
                      Choose which categories to receive via email:
                    </p>
                    {categories.map((cat) => (
                      <div
                        key={cat.value}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <Label className="text-sm font-medium">
                            {cat.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {cat.description}
                          </p>
                        </div>
                        <Switch
                          checked={preferences.email.categories[cat.value]}
                          onCheckedChange={() =>
                            handleToggleCategory('email', cat.value)
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>

              {/* Push Notifications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Push Notifications</CardTitle>
                        <CardDescription>
                          Receive push notifications on your devices
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.push.enabled}
                      onCheckedChange={() => handleToggleChannel('push')}
                    />
                  </div>
                </CardHeader>
                {preferences.push.enabled && (
                  <CardContent className="space-y-3 pt-0">
                    <Separator />
                    <p className="text-sm text-muted-foreground">
                      Choose which categories to receive as push notifications:
                    </p>
                    {categories.map((cat) => (
                      <div
                        key={cat.value}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <Label className="text-sm font-medium">
                            {cat.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {cat.description}
                          </p>
                        </div>
                        <Switch
                          checked={preferences.push.categories[cat.value]}
                          onCheckedChange={() =>
                            handleToggleCategory('push', cat.value)
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>

              {/* In-App Notifications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Monitor className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>In-App Notifications</CardTitle>
                        <CardDescription>
                          Receive notifications while using the app
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.inApp.enabled}
                      onCheckedChange={() => handleToggleChannel('inApp')}
                    />
                  </div>
                </CardHeader>
                {preferences.inApp.enabled && (
                  <CardContent className="space-y-3 pt-0">
                    <Separator />
                    <p className="text-sm text-muted-foreground">
                      Choose which categories to show in-app:
                    </p>
                    {categories.map((cat) => (
                      <div
                        key={cat.value}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <Label className="text-sm font-medium">
                            {cat.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {cat.description}
                          </p>
                        </div>
                        <Switch
                          checked={preferences.inApp.categories[cat.value]}
                          onCheckedChange={() =>
                            handleToggleCategory('inApp', cat.value)
                          }
                        />
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4 mt-0">
              <div className="space-y-4">
                {categories.map((cat) => (
                  <Card key={cat.value}>
                    <CardHeader>
                      <CardTitle className="text-base">{cat.label}</CardTitle>
                      <CardDescription>{cat.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Label>Email</Label>
                        </div>
                        <Switch
                          checked={preferences.email.categories[cat.value]}
                          onCheckedChange={() =>
                            handleToggleCategory('email', cat.value)
                          }
                          disabled={!preferences.email.enabled}
                        />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          <Label>Push</Label>
                        </div>
                        <Switch
                          checked={preferences.push.categories[cat.value]}
                          onCheckedChange={() =>
                            handleToggleCategory('push', cat.value)
                          }
                          disabled={!preferences.push.enabled}
                        />
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          <Label>In-App</Label>
                        </div>
                        <Switch
                          checked={preferences.inApp.categories[cat.value]}
                          onCheckedChange={() =>
                            handleToggleCategory('inApp', cat.value)
                          }
                          disabled={!preferences.inApp.enabled}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4 mt-0">
              {/* Quiet Hours */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Moon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Quiet Hours</CardTitle>
                        <CardDescription>
                          Mute notifications during specific hours
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.quietHours.enabled}
                      onCheckedChange={handleToggleQuietHours}
                    />
                  </div>
                </CardHeader>
                {preferences.quietHours.enabled && (
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Label className="text-sm">Start Time</Label>
                        <p className="text-2xl font-bold mt-1">
                          {preferences.quietHours.startTime}
                        </p>
                      </div>
                      <span className="text-muted-foreground">to</span>
                      <div className="flex-1">
                        <Label className="text-sm">End Time</Label>
                        <p className="text-2xl font-bold mt-1">
                          {preferences.quietHours.endTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Sound */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Volume2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Notification Sounds</CardTitle>
                        <CardDescription>
                          Play sound for new notifications
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.soundEnabled}
                      onCheckedChange={() => handleToggleSetting('soundEnabled')}
                    />
                  </div>
                </CardHeader>
              </Card>

              {/* Desktop Notifications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Monitor className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Desktop Notifications</CardTitle>
                        <CardDescription>
                          Show desktop notifications when app is in background
                        </CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.desktopNotifications}
                      onCheckedChange={() =>
                        handleToggleSetting('desktopNotifications')
                      }
                    />
                  </div>
                </CardHeader>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" onClick={handleReset}>
              Reset to Default
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

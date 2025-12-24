"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Settings, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { registrationApi } from '@/lib/api/registration';

/**
 * Registration Settings Component
 * Manages registration features and settings
 */
export default function RegistrationSettings({ 
  eventId, 
  currentSettings = {},
  onUpdate 
}) {
  const [settings, setSettings] = useState({
    autoApproveParticipants: currentSettings.autoApproveParticipants ?? true,
    allowCoupons: currentSettings.allowCoupons ?? true,
    allowReferrals: currentSettings.allowReferrals ?? true,
    enableEmailNotifications: currentSettings.enableEmailNotifications ?? true,
    enableSmsNotifications: currentSettings.enableSmsNotifications ?? false,
    ...currentSettings
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(currentSettings));
      return newSettings;
    });
    setError('');
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsUpdating(true);
    setError('');

    try {
      const result = await registrationApi.updateSettings(eventId, settings);
      
      toast.success('Registration settings updated successfully');
      onUpdate?.(result.data.settings);
      setHasChanges(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update settings';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => {
    setSettings(currentSettings);
    setHasChanges(false);
    setError('');
  };

  const settingsConfig = [
    {
      section: 'Participant Management',
      items: [
        {
          key: 'autoApproveParticipants',
          label: 'Auto-approve Participants',
          description: 'Automatically approve participant registrations without manual review',
          icon: CheckCircle
        }
      ]
    },
    {
      section: 'Registration Features',
      items: [
        {
          key: 'allowCoupons',
          label: 'Enable Coupon Codes',
          description: 'Allow participants to use discount coupons during registration',
          icon: Settings
        },
        {
          key: 'allowReferrals',
          label: 'Enable Referral Tracking',
          description: 'Track and reward participant referrals',
          icon: Settings
        }
      ]
    },
    {
      section: 'Notifications',
      items: [
        {
          key: 'enableEmailNotifications',
          label: 'Email Notifications',
          description: 'Send email notifications for registration events',
          icon: Settings
        },
        {
          key: 'enableSmsNotifications',
          label: 'SMS Notifications',
          description: 'Send SMS notifications for important registration updates',
          icon: Settings
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Registration Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Settings Sections */}
        {settingsConfig.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {section.section}
              </h3>
              {sectionIndex > 0 && <Separator className="mt-2" />}
            </div>

            <div className="space-y-4">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.key} className="flex items-start justify-between py-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full mt-1">
                        <IconComponent className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label className="text-sm font-medium">
                          {item.label}
                        </Label>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings[item.key]}
                      onCheckedChange={(checked) => handleSettingChange(item.key, checked)}
                      disabled={isUpdating}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-xs text-muted-foreground">
            {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!hasChanges || isUpdating}
            >
              Reset
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

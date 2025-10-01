'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconCreditCard,
  IconBrandFacebook,
  IconBrandInstagram
} from '@tabler/icons-react';

export default function DetailsTab({ orgData }) {
  if (!orgData) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCreditCard className="h-5 w-5" />
            Bank Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orgData.bankDetails ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Account Holder</span>
                <span className="font-medium">{orgData.bankDetails.accountHolderName}</span>
              </div>
              <div className="flex justify-between">
                <span>Bank Name</span>
                <span className="font-medium">{orgData.bankDetails.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Number</span>
                <span className="font-mono">****{orgData.bankDetails.accountNumber?.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span>IFSC Code</span>
                <span className="font-mono">{orgData.bankDetails.ifscCode}</span>
              </div>
              {orgData.bankDetails.upiId && (
                <div className="flex justify-between">
                  <span>UPI ID</span>
                  <span className="font-mono">{orgData.bankDetails.upiId}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm">Bank details not provided</p>
          )}
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent>
          {orgData.socialLinks && (Object.keys(orgData.socialLinks).length > 0) ? (
            <div className="space-y-3">
              {orgData.socialLinks.facebook && (
                <div className="flex items-center gap-3">
                  <IconBrandFacebook className="h-4 w-4 text-primary" />
                  <a 
                    href={orgData.socialLinks.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Facebook
                  </a>
                </div>
              )}
              {orgData.socialLinks.instagram && (
                <div className="flex items-center gap-3">
                  <IconBrandInstagram className="h-4 w-4 text-pink-600" />
                  <a 
                    href={orgData.socialLinks.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-pink-600 hover:underline"
                  >
                    Instagram
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No social links provided</p>
          )}
        </CardContent>
      </Card>

      {/* Support Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Support Contact</CardTitle>
        </CardHeader>
        <CardContent>
          {orgData.supportContact ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Name</span>
                <span className="font-medium">{orgData.supportContact.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span className="font-medium">{orgData.supportContact.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone</span>
                <span className="font-medium">{orgData.supportContact.phone}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm">Support contact not provided</p>
          )}
        </CardContent>
      </Card>

      {/* Event Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Event Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          {orgData.eventPreferences ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Max Events/Month</span>
                <span className="font-medium">{orgData.eventPreferences.maxEventsPerMonth}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid Events</span>
                <Badge variant={orgData.eventPreferences.allowsPaidEvents ? "default" : "secondary"}>
                  {orgData.eventPreferences.allowsPaidEvents ? "Allowed" : "Not Allowed"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Auto Approve</span>
                <Badge variant={orgData.eventPreferences.autoApproveEvents ? "default" : "secondary"}>
                  {orgData.eventPreferences.autoApproveEvents ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="space-y-2">
                <span>Preferred Event Types</span>
                <div className="flex flex-wrap gap-1">
                  {orgData.eventPreferences.preferredEventTypes?.map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs capitalize">
                      {type.replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm">Event preferences not set</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

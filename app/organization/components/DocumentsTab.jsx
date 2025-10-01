'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconFileText } from '@tabler/icons-react';
import { getStatusColor, getStatusIcon } from '../utils/organizationUtils';

export default function DocumentsTab({ orgData }) {
  if (!orgData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Documents</CardTitle>
        <CardDescription>
          Manage your organization documents for verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orgData.documents && orgData.documents.length > 0 ? (
          <div className="space-y-4">
            {orgData.documents.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <IconFileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.type}</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(doc.verified)}>
                    {getStatusIcon(doc.verified)}
                    {doc.verified ? "Verified" : "Pending"}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <IconFileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No documents uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

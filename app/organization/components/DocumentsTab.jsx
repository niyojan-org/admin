"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconAlertCircle, IconFileText, IconCheck } from "@tabler/icons-react";

const DocumentsTab = ({ organization }) => {
  const documents = organization.documents || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Uploaded Documents</CardTitle>
          <CardDescription className="text-xs sm:text-sm">All verification documents</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <Alert>
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription>No documents uploaded yet</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {documents.map((doc, index) => (
                <div key={doc._id || index} className="flex flex-col sm:flex-row sm:items-start justify-between p-3 sm:p-4 border rounded-lg gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <IconFileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                      <Badge variant={doc.verified ? "default" : "secondary"} className="mt-2 text-xs">
                        {doc.verified ? (
                          <>
                            <IconCheck className="mr-1 h-3 w-3" />
                            Verified
                          </>
                        ) : (
                          "Pending Verification"
                        )}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc.url, "_blank")}
                    className="w-full sm:w-auto"
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsTab;

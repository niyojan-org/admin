"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  IconLoader2, 
  IconFileText, 
  IconInfoCircle, 
  IconUpload, 
  IconEye, 
  IconTrash,
  IconAlertTriangle,
  IconCircleCheck
} from "@tabler/icons-react";

export default function DocumentsStep({ orgData, onSave, saving }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const requiredDocuments = [
    {
      type: "PAN Card",
      description: "Organization's PAN card or certificate",
      required: true
    },
    {
      type: "GST Certificate",
      description: "GST registration certificate (if applicable)",
      required: false
    },
    {
      type: "Registration Certificate",
      description: "Organization registration certificate",
      required: true
    },
    {
      type: "Address Proof",
      description: "Utility bill or property document",
      required: false
    }
  ];

  const getStatusColor = (verified) => {
    return verified 
      ? "bg-green-100 text-green-800 border-green-200" 
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getStatusIcon = (verified) => {
    return verified 
      ? <IconCircleCheck className="h-4 w-4" />
      : <IconAlertTriangle className="h-4 w-4" />;
  };

  const handleFileUpload = async (documentType, file) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', documentType);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Here you would make the actual API call
      // const response = await api.post('/org/upload-document', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });

      // Simulate API response
      setTimeout(() => {
        setUploadProgress(100);
        clearInterval(progressInterval);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
          // onSave would trigger a refresh of the org data
        }, 500);
      }, 1000);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (documentType, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should not exceed 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        alert('Only PDF, JPEG, and PNG files are allowed');
        return;
      }
      handleFileUpload(documentType, file);
    }
  };

  const getUploadedDocument = (docType) => {
    return orgData?.documents?.find(doc => doc.type === docType);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          Upload required documents for organization verification. All documents should be clear, legible, and in PDF or image format.
        </AlertDescription>
      </Alert>

      {uploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading document...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {requiredDocuments.map((docInfo) => {
          const uploadedDoc = getUploadedDocument(docInfo.type);
          
          return (
            <Card key={docInfo.type}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <IconFileText className="h-4 w-4" />
                    {docInfo.type}
                    {docInfo.required && <span className="text-red-500">*</span>}
                  </CardTitle>
                  {uploadedDoc && (
                    <Badge className={getStatusColor(uploadedDoc.verified)}>
                      {getStatusIcon(uploadedDoc.verified)}
                      {uploadedDoc.verified ? "Verified" : "Pending"}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{docInfo.description}</p>
              </CardHeader>
              <CardContent>
                {uploadedDoc ? (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="font-medium">Document uploaded</p>
                      <p className="text-muted-foreground">
                        {new Date(uploadedDoc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={uploadedDoc.url} target="_blank" rel="noopener noreferrer">
                          <IconEye className="h-4 w-4 mr-1" />
                          View
                        </a>
                      </Button>
                      <Button variant="outline" size="sm">
                        <IconTrash className="h-4 w-4 mr-1" />
                        Replace
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <IconUpload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      PDF, JPEG, PNG (max 5MB)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(docInfo.type, e)}
                      className="hidden"
                      id={`upload-${docInfo.type}`}
                      disabled={uploading}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                      disabled={uploading}
                    >
                      <label htmlFor={`upload-${docInfo.type}`} className="cursor-pointer">
                        <IconUpload className="h-4 w-4 mr-1" />
                        Upload {docInfo.type}
                      </label>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          Document verification may take 1-2 business days. You'll receive an email notification once your documents are reviewed.
        </AlertDescription>
      </Alert>
    </div>
  );
}

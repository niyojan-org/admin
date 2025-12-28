"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrgStore } from "@/store/orgStore";
import api from "@/lib/api";
import { toast } from "sonner";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function Step4({ goNext, goBack }) {
  const { organization, setOrganization } = useOrgStore();

  // Document types that can be uploaded
  const documentTypes = [
    "PAN Card",
    "GST Certificate",
    "Certificate of Incorporation",
    "MOA (Memorandum of Association)",
    "AOA (Articles of Association)",
    "Registration Certificate",
    "Address Proof",
    "Bank Statement",
    "Audit Report",
    "Other",
  ];

  // Initialize form data with organization data if available
  const [documents, setDocuments] = useState(organization?.documents || []);
  const [uploadingFiles, setUploadingFiles] = useState({});

  // State for guidelines dialog
  const [showGuidelinesDialog, setShowGuidelinesDialog] = useState(false);

  // Update form data when organization changes
  useEffect(() => {
    if (organization?.documents) {
      setDocuments(organization.documents);
    }
  }, [organization]);

  // Add new document entry
  const addDocument = () => {
    setDocuments([...documents, { type: "", url: "", file: null }]);
  };

  // Remove document entry
  const removeDocument = (index) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    setDocuments(newDocuments);
  };

  // Handle document type change
  const handleDocumentTypeChange = (index, type) => {
    const newDocuments = [...documents];
    newDocuments[index] = { ...newDocuments[index], type };
    setDocuments(newDocuments);
  };

  // Handle file selection
  const handleFileChange = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload only PDF, JPEG, or PNG files.");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB.");
      return;
    }

    setUploadingFiles((prev) => ({ ...prev, [index]: true }));

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documents[index].type);
      formData.append("folder", "organization-documents");
      formData.append("title", `${organization.slug} - ${documents[index].type}`);

      // Upload file to server
      const response = await api.post("/util/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update documents array with the uploaded file URL
      const newDocuments = [...documents];
      newDocuments[index] = {
        ...newDocuments[index],
        url: response.data.file.url,
        file: file,
      };
      setDocuments(newDocuments);

      toast.success("Document uploaded successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload document. Please try again.");
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Validation function
  const validateForm = () => {
    if (documents.length === 0) {
      toast.error("Please upload at least one document.");
      return false;
    }

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      if (!doc.type) {
        toast.error(`Please select document type for document ${i + 1}.`);
        return false;
      }
      if (!doc.url) {
        toast.error(`Please upload file for document ${i + 1}.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      const documentData = {
        documents: documents.map((doc) => ({
          type: doc.type,
          url: doc.url,
        })),
      };

      const response = await api.post("/org/register/documents", documentData);
      toast.success(response.data.message || "Documents have been successfully uploaded!");
      setOrganization(response.data.org);
      goNext();
    } catch (error) {
      if (error.response?.data.error?.code === "DOCUMENTS_EXISTS") {
        toast.info("Let's move to next step");
        goNext();
        return;
      }
      toast.error(error.response?.data?.message || "Failed to save documents. Please try again.", {
        description:
          error.response?.data?.error?.details || "An error occurred while saving your documents.",
      });
    }
  };
  return (
  <div className="h-full bg-background rounded border border-border shadow flex flex-col justify-between py-4 sm:py-6 md:py-8 space-y-4 w-full px-2 sm:px-4 md:px-10">
      <div className="flex gap-4 justify-between items-start flex-wrap">
        <p className="text-foreground text-sm sm:text-lg flex-1">Please upload your organization documents</p>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground text-center">
            <span className="text-destructive">*</span> At least one document required
          </div>
          <Dialog open={showGuidelinesDialog} onOpenChange={setShowGuidelinesDialog}>
            <DialogTrigger asChild>
              <Button type="button" title="View Guidelines" variant={'icon'}>
                <IconInfoSquareRounded />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-primary">Document Upload Guidelines</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <ul className="text-sm text-primary space-y-1">
                    <li>• Supported formats: PDF, JPEG, PNG</li>
                    <li>• Maximum file size: 5MB per document</li>
                    <li>• Ensure documents are clear and readable</li>
                    <li>• Upload all required documents for your organization type</li>
                    <li>• Documents will be verified for authenticity</li>
                    <li>• You can upload multiple documents of the same type if needed</li>
                  </ul>
                </div>
                <div className="p-4 bg-success/5 rounded-lg border-l-4 border-success">
                  <h4 className="font-medium text-success mb-2">Tips</h4>
                  <ul className="text-sm text-success space-y-1">
                    <li>• Scan documents in high resolution for clarity</li>
                    <li>• Ensure all text is legible in the uploaded files</li>
                    <li>• PAN Card and GST Certificate are commonly required</li>
                    <li>• Keep original documents ready for verification if needed</li>
                    <li>• Use "Other" category for additional supporting documents</li>
                  </ul>
                </div>
                <div className="p-4 bg-warning/5 rounded-lg border-l-4 border-warning">
                  <h4 className="font-medium text-warning mb-2">Important</h4>
                  <ul className="text-sm text-warning space-y-1">
                    <li>• All documents must be valid and current</li>
                    <li>• Expired documents will not be accepted</li>
                    <li>• Organization name must match across all documents</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-sm bg-background py-1 border-0 p-0 flex-1 overflow-y-auto">
        <CardContent className="py-2 sm:py-4 sm:space-y-6">
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-primary font-semibold text-lg">Document Upload</h3>
              <p className="text-sm text-muted-foreground">
                Upload organization documents (PDF, JPEG, PNG - Max 5MB each)
              </p>
            </div>

            {/* Document List */}
            <div className="space-y-4">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No documents added yet. Click "Add Document" to get started.</p>
                </div>
              ) : (
                documents.map((document, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-primary">Document {index + 1}</h4>
                      <button
                        onClick={() => removeDocument(index)}
                        className="text-destructive hover:text-destructive text-sm"
                        type="button"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Document Type */}
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold text-base">Document Type *</Label>
                        <Select
                          value={document.type}
                          onValueChange={(value) => handleDocumentTypeChange(index, value)}
                          required
                        >
                          <SelectTrigger className="w-full h-11">
                            <SelectValue placeholder="Select Document Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {documentTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* File Upload */}
                      <div className="space-y-2">
                        <Label className="text-foreground font-semibold text-base">Upload File *</Label>
                        <div className="relative">
                          <Input
                            type="file"
                            accept=".pdf,.jpeg,.jpg,.png"
                            onChange={(e) => handleFileChange(index, e)}
                            className="h-11 border-border focus:border-primary focus:ring-primary"
                            disabled={uploadingFiles[index]}
                          />
                          {uploadingFiles[index] && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            </div>
                          )}
                        </div>
                        {document.url && (
                          <p className="text-sm text-success">✓ File uploaded successfully</p>
                        )}
                      </div>
                    </div>

                    {/* File Preview/Info */}
                    {document.file && (
                      <div className="bg-muted p-3 rounded border">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm text-muted-foreground">
                            <strong>File:</strong> {document.file.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <strong>Size:</strong> {(document.file.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add Document Button */}
            <div className="flex justify-center">
              <Button
                onClick={addDocument}
                variant="outline"
                className="px-4 py-2 w-full sm:w-auto"
                type="button"
              >
                Add Document
              </Button>
            </div>

            {/* Removed inline Guidelines - now shown in dialog */}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end mt-4 gap-2 sm:gap-4">
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => goBack()}>
          Back
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            if (!validateForm()) {
              return;
            }
            handleSubmit();
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

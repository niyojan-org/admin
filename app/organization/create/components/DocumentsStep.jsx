"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useOrganizationCreationStore, DOCUMENT_TYPE_OPTIONS } from "@/store/organizationCreationStore";
import { FileText, Plus, Trash2, ExternalLink, Upload } from "lucide-react";
import { uploadDocument } from "@/lib/api/resources";
import { toast } from "sonner";

export default function DocumentsStep() {
  const {
    organizationDraft,
    addDocument,
    updateDocument,
    removeDocument,
    stepErrors,
    setStepErrors,
    clearStepErrors,
  } = useOrganizationCreationStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({ type: "", url: "" });
  const [documentError, setDocumentError] = useState({});
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const errors = stepErrors[5] || {};
  const documents = organizationDraft.documents;

  // Validate document before adding
  const validateDocument = () => {
    const docErrors = {};

    if (!newDocument.type) {
      docErrors.type = "Please select a document type";
    }

    if (!newDocument.url) {
      docErrors.file = "Please upload a document file";
    }

    // Check for duplicate type
    const existingTypes = documents.map((d) => d.type);
    if (newDocument.type && existingTypes.includes(newDocument.type)) {
      docErrors.type = "A document with this type already exists";
    }

    setDocumentError(docErrors);
    return Object.keys(docErrors).length === 0;
  };

  // Validate step
  const validateStep = useCallback(() => {
    const newErrors = {};

    if (documents.length === 0) {
      newErrors.documents = "At least one document is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setStepErrors(5, newErrors);
    } else {
      clearStepErrors(5);
    }
  }, [documents.length, setStepErrors, clearStepErrors]);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      setUploadingDocument(true);
      setSelectedFile(file);

      // Upload file and get URL
      const uploadResult = await uploadDocument(file, newDocument.type || "Document");
      
      if (uploadResult?.url) {
        setNewDocument(prev => ({ ...prev, url: uploadResult.url }));
        toast.success("Document uploaded successfully!");
      } else {
        throw new Error("Failed to get upload URL");
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload document");
      setSelectedFile(null);
    } finally {
      setUploadingDocument(false);
    }
  };

  // Handle add document
  const handleAddDocument = () => {
    if (validateDocument()) {
      addDocument({ ...newDocument });
      setNewDocument({ type: "", url: "" });
      setSelectedFile(null);
      setIsAddDialogOpen(false);
      setDocumentError({});
      clearStepErrors(5);
    }
  };

  // Handle remove document
  const handleRemoveDocument = (index) => {
    removeDocument(index);
    if (documents.length <= 1) {
      setStepErrors(5, { documents: "At least one document is required" });
    }
  };

  // Get available document types (exclude already added ones)
  const getAvailableDocumentTypes = () => {
    const usedTypes = documents.map((d) => d.type);
    return DOCUMENT_TYPE_OPTIONS.filter((opt) => !usedTypes.includes(opt.value));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Documents
        </CardTitle>
        <CardDescription>
          Upload your organization&apos;s verification documents. At least one document is required.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Document list */}
        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div className="flex flex-1 items-center gap-3 min-w-0">
                  <FileText className="size-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{doc.type}</p>
                    <p className="text-sm text-muted-foreground">Document uploaded</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(doc.url, '_blank')}
                    className="shrink-0 text-primary hover:text-primary hover:bg-primary/10"
                    title="View document"
                  >
                    <ExternalLink className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveDocument(index)}
                    className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <Upload className="size-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">No documents added</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add at least one verification document
            </p>
          </div>
        )}

        {errors.documents && (
          <p className="text-sm text-destructive">{errors.documents}</p>
        )}

        {/* Add Document Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full"
              disabled={getAvailableDocumentTypes().length === 0}
            >
              <Plus className="size-4 mr-2" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent className={'max-w-3xl'}>
            <DialogHeader>
              <DialogTitle>Add Document</DialogTitle>
              <DialogDescription>
                Select the document type and provide the URL where the document is hosted.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Document Type */}
              <div className="space-y-2">
                <Label htmlFor="docType">
                  Document Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newDocument.type}
                  onValueChange={(value) =>
                    setNewDocument((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger aria-invalid={!!documentError.type}>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDocumentTypes().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {documentError.type && (
                  <p className="text-sm text-destructive">{documentError.type}</p>
                )}
              </div>

              {/* Document Upload */}
              <div className="space-y-2">
                <Label htmlFor="docFile">
                  Upload Document <span className="text-destructive">*</span>
                </Label>
                <div className="space-y-3">
                  <input
                    id="docFile"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('docFile')?.click()}
                    disabled={uploadingDocument || !newDocument.type}
                    className="w-full"
                  >
                    <Upload className="size-4 mr-2" />
                    {uploadingDocument ? "Uploading..." : selectedFile ? selectedFile.name : "Choose File"}
                  </Button>

                  {documentError.file && (
                    <p className="text-sm text-destructive">{documentError.file}</p>
                  )}
                  
                  {!newDocument.type && (
                    <p className="text-xs text-muted-foreground">
                      Please select a document type first
                    </p>
                  )}
                  
                  {newDocument.type && !uploadingDocument && (
                    <p className="text-xs text-muted-foreground">
                      Max file size: 10MB. Supported: PDF, DOC, DOCX, JPG, PNG
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewDocument({ type: "", url: "" });
                  setSelectedFile(null);
                  setDocumentError({});
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddDocument} disabled={uploadingDocument}>
                Add Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Info card */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Accepted documents:</strong> Certificate of Incorporation, GST Certificate, PAN Card, Business License, Tax Exemption Certificate, etc.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <strong>Note:</strong> Upload your documents securely (max 10MB per file).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

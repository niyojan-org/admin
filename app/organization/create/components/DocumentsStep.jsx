"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const errors = stepErrors[5] || {};
  const documents = organizationDraft.documents;

  // Validate URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate document before adding
  const validateDocument = () => {
    const docErrors = {};

    if (!newDocument.type) {
      docErrors.type = "Please select a document type";
    }

    if (!newDocument.url) {
      docErrors.url = "Please enter the document URL";
    } else if (!isValidUrl(newDocument.url)) {
      docErrors.url = "Please enter a valid URL";
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

  // Handle add document
  const handleAddDocument = () => {
    if (validateDocument()) {
      addDocument({ ...newDocument });
      setNewDocument({ type: "", url: "" });
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
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline truncate"
                    >
                      <span className="truncate">{doc.url}</span>
                      <ExternalLink className="size-3 shrink-0" />
                    </a>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDocument(index)}
                  className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </Button>
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

              {/* Document URL */}
              <div className="space-y-2">
                <Label htmlFor="docUrl">
                  Document URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="docUrl"
                  type="url"
                  placeholder="https://example.com/document.pdf"
                  value={newDocument.url}
                  onChange={(e) =>
                    setNewDocument((prev) => ({ ...prev, url: e.target.value }))
                  }
                  aria-invalid={!!documentError.url}
                />
                {documentError.url && (
                  <p className="text-sm text-destructive">{documentError.url}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewDocument({ type: "", url: "" });
                  setDocumentError({});
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddDocument}>Add Document</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Info card */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Accepted documents:</strong> Certificate of Incorporation, GST Certificate, PAN Card, Business License, Tax Exemption Certificate, etc.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            <strong>Note:</strong> Documents should be hosted on a secure, publicly accessible URL (e.g., cloud storage).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

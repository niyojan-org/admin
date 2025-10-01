"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Send } from "lucide-react";

const FormActions = ({ 
    onPreview, 
    onSubmit, 
    loading, 
    isScheduled,
    canPreview = true,
    disabled = false
}) => {
    return (
        <div className="flex gap-3 pt-4">
            <Button
                type="button"
                variant="outline"
                onClick={onPreview}
                className="flex-1"
                disabled={!canPreview || disabled}
            >
                <Eye className="h-4 w-4 mr-2" />
                Preview
            </Button>
            <Button
                type="submit"
                onClick={onSubmit}
                disabled={loading || disabled}
                className="flex-1"
            >
                <Send className="h-4 w-4 mr-2" />
                {loading ? (
                    "Processing..."
                ) : isScheduled ? (
                    "Schedule"
                ) : (
                    "Send Now"
                )}
            </Button>
        </div>
    );
};

export default FormActions;

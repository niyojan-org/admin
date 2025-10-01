'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, Star } from 'lucide-react';

const BenefitForm = ({ 
    benefit = null, 
    onSubmit, 
    loading = false,
    onCancel
}) => {
    const [formData, setFormData] = useState({
        title: benefit?.title || '',
        description: benefit?.description || '',
        icon: benefit?.icon || '',
        isActive: benefit?.isActive ?? true,
        order: benefit?.order ?? 0
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Title must be 100 characters or less';
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = 'Description must be 500 characters or less';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            await onSubmit(formData);
        } catch (error) {
            // Error is handled in parent component
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Professional Certificate"
                    maxLength={100}
                    className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    {formData.title.length}/100 characters
                </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the benefit participants will receive..."
                    maxLength={500}
                    rows={3}
                    className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    {formData.description.length}/500 characters
                </p>
            </div>

            {/* Icon URL */}
            <div className="space-y-2">
                <Label htmlFor="icon">Icon URL</Label>
                <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    placeholder="https://example.com/icon.png"
                    type="url"
                />
                <p className="text-xs text-muted-foreground">
                    Optional: Provide a URL for a custom icon
                </p>
            </div>

            {/* Icon Preview */}
            {formData.icon && (
                <div className="space-y-2">
                    <Label>Icon Preview</Label>
                    <div className="flex items-center space-x-3">
                        <img
                            src={formData.icon}
                            alt="Icon preview"
                            className="h-8 w-8 rounded-md object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="h-8 w-8 rounded-md bg-secondary items-center justify-center hidden">
                            <span className="text-xs text-muted-foreground">Invalid</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Status */}
            <div className="flex items-center space-x-2">
                <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive" className="text-sm">
                    Show this benefit to participants
                </Label>
            </div>

            <DialogFooter>
                {onCancel && (
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onCancel}
                        disabled={submitting || loading}
                    >
                        Cancel
                    </Button>
                )}
                <Button 
                    type="submit" 
                    disabled={submitting || loading}
                    className="min-w-[100px]"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {benefit ? 'Updating...' : 'Adding...'}
                        </>
                    ) : (
                        benefit ? 'Update Benefit' : 'Add Benefit'
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
};

export default BenefitForm;
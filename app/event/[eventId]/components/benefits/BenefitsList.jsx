'use client'
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Gift, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import BenefitCard from './BenefitCard';

const BenefitsList = ({ 
    benefits, 
    loading, 
    error, 
    onEditBenefit, 
    onDeleteBenefit, 
    onAddBenefit,
    onReorderBenefits,
    onRefresh,
    userRole 
}) => {
    const canManageBenefits = ['owner', 'admin'].includes(userRole);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);

    const handleDragStart = (e, benefit, index) => {
        if (!canManageBenefits) return;
        setDraggedItem({ benefit, index });
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        e.dataTransfer.setDragImage(e.target, 20, 20);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (!canManageBenefits || !draggedItem) return;
        e.dataTransfer.dropEffect = 'move';
        setDragOverItem(index);
    };

    const handleDragLeave = () => {
        setDragOverItem(null);
    };

    const handleDrop = async (e, dropIndex) => {
        e.preventDefault();
        if (!canManageBenefits || !draggedItem || !onReorderBenefits) return;

        const dragIndex = draggedItem.index;
        if (dragIndex === dropIndex) {
            setDraggedItem(null);
            setDragOverItem(null);
            return;
        }

        // Create new order array
        const newBenefits = [...benefits];
        const draggedBenefit = newBenefits[dragIndex];
        
        // Remove dragged item
        newBenefits.splice(dragIndex, 1);
        // Insert at new position
        newBenefits.splice(dropIndex, 0, draggedBenefit);

        // Update order values
        const updatedBenefits = newBenefits.map((benefit, index) => ({
            ...benefit,
            order: index
        }));

        // Get benefit IDs in new order
        const benefitIds = updatedBenefits.map(benefit => benefit._id);

        try {
            await onReorderBenefits(benefitIds);
        } catch (error) {
            console.error('Failed to reorder benefits:', error);
        }

        setDraggedItem(null);
        setDragOverItem(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverItem(null);
    };

    if (loading) {
        return (
            <CardContent className="p-0">
                <div className="space-y-3 px-6 py-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-start space-x-3">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-2/3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        );
    }

    if (error) {
        return (
            <CardContent className="px-6 py-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                        <span>{error}</span>
                        {onRefresh && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={onRefresh}
                                className="ml-2"
                            >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Retry
                            </Button>
                        )}
                    </AlertDescription>
                </Alert>
            </CardContent>
        );
    }

    if (!benefits || benefits.length === 0) {
        return (
            <CardContent className="px-6 py-4">
                <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Gift className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-medium text-foreground mb-2">
                        No benefits added yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                        Start adding benefits to showcase the value participants will get from your event.
                    </p>
                    {canManageBenefits && onAddBenefit && (
                        <Button onClick={onAddBenefit} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Benefit
                        </Button>
                    )}
                </div>
            </CardContent>
        );
    }

    return (
        <ScrollArea className="h-full">
            <CardContent className="pr-3">
                <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                        <div
                            key={benefit._id}
                            draggable={canManageBenefits}
                            onDragStart={(e) => handleDragStart(e, benefit, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`
                                transition-all duration-200
                                ${draggedItem?.index === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
                                ${dragOverItem === index && draggedItem?.index !== index ? 'border-2 border-primary border-dashed rounded-lg p-1' : ''}
                            `}
                        >
                            <BenefitCard
                                benefit={benefit}
                                onEdit={onEditBenefit}
                                onDelete={onDeleteBenefit}
                                userRole={userRole}
                                loading={loading}
                                index={index}
                                isDragging={draggedItem?.index === index}
                            />
                        </div>
                    ))}
                </div>

                {/* Benefits limit warning */}
                {benefits.length >= 15 && canManageBenefits && (
                    <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You have {benefits.length} benefits. Consider keeping it under 10 for better user experience.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </ScrollArea>
    );
};

export default BenefitsList;
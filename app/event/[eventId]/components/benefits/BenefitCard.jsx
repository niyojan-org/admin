'use client'
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Star, Eye, EyeOff, GripVertical } from 'lucide-react';
import BenefitForm from './BenefitForm';

const BenefitCard = ({ 
    benefit, 
    onEdit, 
    onDelete, 
    userRole, 
    loading,
    index,
    isDragging = false
}) => {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const canManageBenefits = ['owner', 'admin'].includes(userRole);

    const handleEdit = async (benefitData) => {
        try {
            await onEdit(benefit._id, benefitData);
            setShowEditDialog(false);
        } catch (error) {
            // Error is handled in the hook
            throw error;
        }
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            await onDelete(benefit._id);
        } catch (error) {
            // Error is handled in the hook
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <Card className={`group hover:shadow-md transition-all duration-200 py-2 ${isDragging ? 'shadow-lg' : ''}`}>
            <CardContent className="">
                <div className="flex items-start justify-between">
                    <div className="flex items-center flex-1 space-x-2">
                        {/* Drag Handle */}
                        {canManageBenefits && (
                            <div className={`transition-opacity cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                        )}
                        
                        {/* Benefit Icon */}
                        <div className="flex-shrink-0">
                            {benefit.icon ? (
                                <img 
                                    src={benefit.icon} 
                                    alt={benefit.title}
                                    className="h-8 w-8 rounded-md object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className={`h-8 w-8 rounded-md bg-primary flex items-center justify-center ${benefit.icon ? 'hidden' : 'flex'}`}>
                                <Star className="h-4 w-4 text-primary-foreground" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm text-foreground mb-1 leading-tight">
                                        {benefit.title}
                                    </h4>
                                    {benefit.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center space-x-2">
                                    <Badge 
                                        variant={benefit.isActive ? "default" : "secondary"} 
                                        className="text-xs h-5"
                                    >
                                        {benefit.isActive ? (
                                            <>
                                                <Eye className="h-3 w-3 mr-1" />
                                                Active
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="h-3 w-3 mr-1" />
                                                Hidden
                                            </>
                                        )}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        #{benefit.order + 1}
                                    </span>
                                </div>

                                {/* Actions */}
                                {canManageBenefits && (
                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ">
                                        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog} >
                                            <DialogTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-6 w-6 p-0"
                                                    disabled={loading}
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Benefit</DialogTitle>
                                                </DialogHeader>
                                                <BenefitForm
                                                    benefit={benefit}
                                                    onSubmit={handleEdit}
                                                    loading={loading}
                                                />
                                            </DialogContent>
                                        </Dialog>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    disabled={loading || deleteLoading}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Benefit</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete "{benefit.title}"? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        onClick={handleDelete}
                                                        className="bg-destructive hover:bg-destructive/90"
                                                        disabled={deleteLoading}
                                                    >
                                                        {deleteLoading ? 'Deleting...' : 'Delete'}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BenefitCard;
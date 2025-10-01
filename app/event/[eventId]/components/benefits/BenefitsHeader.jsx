'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Gift } from 'lucide-react';

const BenefitsHeader = ({
    benefitCount,
    onAddBenefit,
    userRole,
    loading
}) => {
    const canManageBenefits = ['owner', 'admin'].includes(userRole);

    return (
        <CardHeader className="">
            <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Gift className="h-4 w-4" />
                    Event Benefits
                    <Badge variant="secondary" className="text-xs">
                        {benefitCount}
                    </Badge>
                </CardTitle>

                {canManageBenefits && (
                    <Button
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={onAddBenefit}
                        disabled={loading}
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Add Benefit</span>
                    </Button>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-2">
                <Card className="text-center p-1.5 sm:p-2 gap-0 rounded-md">
                    <CardContent>
                        <p className='text-lg font-semibold'>{benefitCount}</p>
                        <p className="text-xs text-muted-foreground">Total Benefits</p>
                    </CardContent>
                </Card>
                <Card className="text-center p-1.5 sm:p-2 gap-0 rounded-md">
                    <CardContent>
                        <p className='text-lg font-semibold'>{benefitCount > 0 ? benefitCount : 0}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                    </CardContent>
                </Card>

                <Card className="text-center p-1.5 sm:p-2 gap-0 rounded-md">
                    <CardContent>
                        <div className="text-sm sm:text-lg font-semibold">
                            {benefitCount > 5 ? 'High' : benefitCount > 2 ? 'Medium' : 'Low'}
                        </div>
                        <div className="text-xs text-muted-foreground">Appeal</div>
                    </CardContent>
                </Card>
            </div>
        </CardHeader>
    );
};

export default BenefitsHeader;
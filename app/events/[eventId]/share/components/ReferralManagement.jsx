import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ReferralManagement({
    referrals = [],
    referral,
    onSelect,
    onClear,
    loading
}) {
    const safeReferrals = referrals || [];

    const ReferralCard = ({ referralItem, isSelected, onSelectItem }) => (
        <div
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
            onClick={() => onSelectItem(referralItem._id)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                        }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={referralItem.whose.avatar} alt={referralItem.whose.name} />
                        <AvatarFallback>{referralItem.whose.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-lg">{referralItem.code}</span>
                            <Badge variant={referralItem.isActive ? "default" : "secondary"} className="text-xs">
                                {referralItem.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <p className="text-sm font-medium">{referralItem.whose.name}</p>
                        <p className="text-xs text-muted-foreground">{referralItem.whose.email}</p>
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <div className="text-sm font-medium">
                        {referralItem.usageCount}/{referralItem.maxUsage}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {new Date(referralItem.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Card className={'gap-2'}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Referral Management</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Select a referral link for tracking user acquisitions
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {safeReferrals.length > 0 ? (
                    <div className="space-y-2">
                        {/* Clear Selection Button */}
                        {referral && (
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">
                                    Selected: <span className="font-mono font-medium">{referral.code}</span>
                                </p>
                                <Button
                                    onClick={onClear}
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Clear Selection
                                </Button>
                            </div>
                        )}

                        {/* Referral List */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Available Referrals</Label>
                            <ScrollArea className="h-96">
                                <div className="space-y-3 pr-4">
                                    {safeReferrals.map((referralItem) => (
                                        <ReferralCard
                                            key={referralItem._id}
                                            referralItem={referralItem}
                                            isSelected={referral?._id === referralItem._id}
                                            onSelectItem={onSelect}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 space-y-4">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                            <Plus className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-lg font-medium">No referral links available</p>
                            <p className="text-sm text-muted-foreground">No referrals have been created yet</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { IconSearch, IconAdjustments } from '@tabler/icons-react';

export function ReferralFilters({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    processedReferrals,
    onClearFilters
}) {
    const hasActiveFilters = searchQuery || statusFilter !== 'all' || sortBy !== 'newest';
    const filterCount = [
        searchQuery ? 1 : 0,
        statusFilter !== 'all' ? 1 : 0,
        sortBy !== 'newest' ? 1 : 0
    ].filter(Boolean).length;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-muted-foreground">
                    {processedReferrals.length} referral{processedReferrals.length !== 1 ? 's' : ''}
                    {hasActiveFilters && <span> (filtered)</span>}
                </span>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="h-6 px-2 text-xs self-start sm:self-auto"
                    >
                        Clear filters
                    </Button>
                )}
            </div>

            {/* Filter Button */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                        <IconAdjustments className="w-4 h-4" />
                        <span>Filters</span>
                        {hasActiveFilters && (
                            <Badge variant="secondary" className="ml-1 px-1 text-xs">
                                {filterCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" side="bottom" align="end">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Search Referrals</Label>
                            <div className="relative">
                                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by code or user..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Status</Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Sort By</Label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="oldest">Oldest</SelectItem>
                                        <SelectItem value="usage">Most Used</SelectItem>
                                        <SelectItem value="code">By Code</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default ReferralFilters;

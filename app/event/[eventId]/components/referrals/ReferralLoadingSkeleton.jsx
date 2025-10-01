'use client'
import { Skeleton } from '@/components/ui/skeleton';

export function ReferralLoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                    <Skeleton className="h-2 w-full" />
                </div>
            ))}
        </div>
    );
}

export default ReferralLoadingSkeleton;

import React from 'react';
import { Skeleton } from '@/components/ui/Loading';

export function AdminCardSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
                <Skeleton width="150px" height="1.5rem" />
                <Skeleton width="60px" height="1.75rem" className="rounded-full" />
            </div>

            {/* Info items */}
            <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                    <Skeleton variant="circular" width="1rem" height="1rem" />
                    <Skeleton width="200px" height="0.875rem" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton variant="circular" width="1rem" height="1rem" />
                    <Skeleton width="180px" height="0.875rem" />
                </div>
            </div>
        </div>
    );
}

export function AdminPageSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton width="200px" height="2.25rem" />
                    <Skeleton width="300px" height="1.25rem" />
                </div>
                <Skeleton width="140px" height="2.5rem" className="rounded-lg" />
            </div>

            {/* Admin Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <AdminCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
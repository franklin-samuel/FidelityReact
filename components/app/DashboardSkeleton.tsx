import React from 'react';
import { Skeleton } from '@/components/ui/Loading';

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton width="200px" height="2.25rem" />
                <Skeleton width="300px" height="1.25rem" />
            </div>

            {/* Metrics Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <Skeleton width="120px" height="1rem" />
                            <Skeleton variant="circular" width="1.25rem" height="1.25rem" />
                        </div>
                        <Skeleton width="80px" height="2.25rem" />
                    </div>
                ))}
            </div>

            {/* Loyalty Settings Card Skeleton */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-start gap-4">
                    <Skeleton variant="rectangular" width="3rem" height="3rem" className="rounded-xl" />
                    <div className="flex-1 space-y-3">
                        <Skeleton width="200px" height="1.5rem" />
                        <Skeleton width="100%" height="1rem" />
                        <Skeleton width="180px" height="2.5rem" className="rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
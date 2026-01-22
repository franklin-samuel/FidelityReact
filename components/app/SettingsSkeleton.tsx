import React from 'react';
import { Skeleton } from '@/components/ui/Loading';

export function SettingsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton width="180px" height="2.25rem" />
                <Skeleton width="350px" height="1.25rem" />
            </div>

            {/* Settings Card Skeleton */}
            <div className="max-w-2xl">
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    {/* Card Header */}
                    <div className="flex items-center gap-3 p-6 border-b border-zinc-200 dark:border-zinc-800">
                        <Skeleton
                            variant="rectangular"
                            width="3rem"
                            height="3rem"
                            className="rounded-xl"
                        />
                        <div className="flex-1 space-y-2">
                            <Skeleton width="200px" height="1.5rem" />
                            <Skeleton width="100%" height="1rem" />
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Skeleton width="250px" height="1rem" />
                            <div className="flex items-center gap-4">
                                <Skeleton width="8rem" height="2.5rem" className="rounded-lg" />
                                <Skeleton width="60px" height="1.25rem" />
                            </div>
                            <Skeleton width="100%" height="0.875rem" />
                        </div>

                        {/* Example Preview */}
                        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton variant="circular" width="1rem" height="1rem" />
                                <Skeleton width="80px" height="0.875rem" />
                            </div>
                            <Skeleton width="100%" height="0.875rem" />
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-6 border-t border-zinc-200 dark:border-zinc-800">
                        <Skeleton width="180px" height="2.5rem" className="rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
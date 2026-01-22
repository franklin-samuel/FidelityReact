import React from 'react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'spinner' | 'dots' | 'pulse';
    text?: string;
    fullScreen?: boolean;
}

export function Loading({
                            size = 'md',
                            variant = 'spinner',
                            text,
                            fullScreen = false
                        }: LoadingProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-16 w-16',
        xl: 'h-24 w-24'
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
    };

    const SpinnerVariant = () => (
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-amber-500 border-t-transparent`}></div>
    );

    const DotsVariant = () => (
        <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-3 w-3 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-3 w-3 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
    );

    const PulseVariant = () => (
        <div className="relative">
            <div className={`${sizeClasses[size]} rounded-full bg-amber-500 animate-ping absolute opacity-75`}></div>
            <div className={`${sizeClasses[size]} rounded-full bg-amber-500`}></div>
        </div>
    );

    const renderVariant = () => {
        switch (variant) {
            case 'dots':
                return <DotsVariant />;
            case 'pulse':
                return <PulseVariant />;
            default:
                return <SpinnerVariant />;
        }
    };

    const content = (
        <div className="flex flex-col items-center gap-3">
            {renderVariant()}
            {text && (
                <p className={`text-zinc-600 dark:text-zinc-400 animate-pulse ${textSizeClasses[size]}`}>
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-50">
                {content}
            </div>
        );
    }

    return content;
}

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string;
    height?: string;
    animation?: 'pulse' | 'wave';
}

export function Skeleton({
                             className = '',
                             variant = 'text',
                             width,
                             height,
                             animation = 'pulse'
                         }: SkeletonProps) {
    const baseClasses = animation === 'wave' ? 'skeleton' : 'animate-pulse bg-zinc-200 dark:bg-zinc-800';

    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };

    const style = {
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'text' ? '1em' : variant === 'circular' ? '40px' : '200px')
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
            <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                    <Skeleton width="60%" height="1.5rem" />
                    <Skeleton width="40%" height="1rem" />
                </div>
                <Skeleton variant="circular" width="3rem" height="3rem" />
            </div>
            <div className="space-y-2">
                <Skeleton width="100%" height="0.5rem" />
                <Skeleton width="80%" height="0.5rem" />
            </div>
            <div className="flex gap-2 pt-2">
                <Skeleton width="100%" height="2.5rem" />
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <Skeleton variant="circular" width="3rem" height="3rem" />
                    <div className="flex-1 space-y-2">
                        <Skeleton width="40%" height="1rem" />
                        <Skeleton width="60%" height="0.875rem" />
                    </div>
                    <Skeleton width="5rem" height="2rem" />
                </div>
            ))}
        </div>
    );
}
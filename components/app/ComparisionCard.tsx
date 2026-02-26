import React from 'react';
import { formatCurrency } from '@/utils/formatter';

interface ComparisonCardProps {
    label: string;
    currentValue: string | number;
    previousValue?: string | number;
    growthAbsolute?: number;
    growthPercentage?: number;
    tooltip?: string;
    formatValue?: (val: number) => string;
}

export function ComparisonCard({
                                   label,
                                   currentValue,
                                   previousValue,
                                   growthAbsolute,
                                   growthPercentage,
                                   tooltip,
                                   formatValue,
                               }: ComparisonCardProps) {
    const hasComparison = growthAbsolute !== undefined || growthPercentage !== undefined;
    const isPositive = (growthAbsolute ?? 0) >= 0;
    const showPercentage = growthPercentage !== undefined && growthPercentage !== 0;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-2">
            <div className="flex items-start justify-between">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
                {tooltip && (
                    <div className="group relative">
                        <svg className="w-4 h-4 text-zinc-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="absolute right-0 top-6 w-64 bg-zinc-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl">
                            {tooltip}
                            <div className="absolute -top-1 right-2 w-2 h-2 bg-zinc-900 transform rotate-45" />
                        </div>
                    </div>
                )}
            </div>

            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {currentValue}
            </p>

            {hasComparison && (
                <div className="flex items-center gap-2 text-sm">
                    <span className={`flex items-center gap-1 font-medium ${
                        isPositive
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                    }`}>
                        {isPositive ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        )}
                        {formatValue && growthAbsolute !== undefined
                            ? formatValue(Math.abs(growthAbsolute))
                            : Math.abs(growthAbsolute ?? 0)
                        }
                        {showPercentage && ` (${isPositive ? '+' : ''}${growthPercentage.toFixed(2)}%)`}
                    </span>
                </div>
            )}
        </div>
    );
}
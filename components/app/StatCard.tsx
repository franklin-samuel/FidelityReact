import React from 'react';

interface StatCardProps {
    label: string;
    value: string;
    highlight?: boolean;
    subtitle?: string;
    icon?: React.ReactNode;
    tooltip?: string;
}

export function StatCard({ label, value, highlight = false, subtitle, icon, tooltip }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-1">
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
                <div className="flex items-center gap-2">
                    {icon && (
                        <span className="text-zinc-400 dark:text-zinc-500">
                            {icon}
                        </span>
                    )}
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
            </div>
            <p className={`text-2xl font-bold ${highlight ? 'text-amber-500' : 'text-zinc-900 dark:text-zinc-50'}`}>
                {value}
            </p>
            {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
        </div>
    );
}
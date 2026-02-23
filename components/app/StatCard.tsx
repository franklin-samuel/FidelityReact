import React from 'react';

interface StatCardProps {
    label: string;
    value: string;
    highlight?: boolean;
    subtitle?: string;
    icon?: React.ReactNode;
}

export function StatCard({ label, value, highlight = false, subtitle, icon }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-1">
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
                {icon && (
                    <span className="text-zinc-400 dark:text-zinc-500">
                        {icon}
                    </span>
                )}
            </div>
            <p className={`text-2xl font-bold ${highlight ? 'text-amber-500' : 'text-zinc-900 dark:text-zinc-50'}`}>
                {value}
            </p>
            {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
        </div>
    );
}
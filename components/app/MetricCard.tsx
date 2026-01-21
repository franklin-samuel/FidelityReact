
import React from 'react';

interface MetricCardRootProps {
    children: React.ReactNode;
    variant?: 'default' | 'highlight';
}

const MetricCardRoot: React.FC<MetricCardRootProps> = ({ children, variant = 'default' }) => {
    const variantStyles = variant === 'highlight'
        ? 'border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/20'
        : 'border-zinc-200 dark:border-zinc-800';

    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-xl border ${variantStyles} p-6`}>
            {children}
        </div>
    );
};

interface MetricCardHeaderProps {
    icon: React.ReactNode;
    iconColor?: string;
    title: string;
}

const MetricCardHeader: React.FC<MetricCardHeaderProps> = ({ icon, iconColor = 'text-zinc-600', title }) => {
    return (
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</h3>
            <span className={`w-5 h-5 ${iconColor}`}>{icon}</span>
        </div>
    );
};

interface MetricCardValueProps {
    children: React.ReactNode;
    variant?: 'default' | 'highlight';
}

const MetricCardValue: React.FC<MetricCardValueProps> = ({ children, variant = 'default' }) => {
    const colorStyles = variant === 'highlight'
        ? 'text-amber-500'
        : 'text-zinc-900 dark:text-zinc-50';

    return (
        <p className={`text-4xl font-bold ${colorStyles}`}>
            {children}
        </p>
    );
};

export const MetricCard = {
    Root: MetricCardRoot,
    Header: MetricCardHeader,
    Value: MetricCardValue
};
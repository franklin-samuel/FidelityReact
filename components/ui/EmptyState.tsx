import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-16 animate-fade-in">
            {icon && (
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                {title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                {description}
            </p>
            {action && (
                <Button.Root onClick={action.onClick}>
                    {action.icon && <Button.Icon>{action.icon}</Button.Icon>}
                    {action.label}
                </Button.Root>
            )}
        </div>
    );
}
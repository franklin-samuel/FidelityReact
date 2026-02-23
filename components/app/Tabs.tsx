import React from 'react';

interface TabsRootProps {
    children: React.ReactNode;
    className?: string;
}

const TabsRoot: React.FC<TabsRootProps> = ({ children, className = '' }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
    return (
        <div className={`flex gap-2 border-b border-zinc-200 dark:border-zinc-800 ${className}`}>
            {children}
        </div>
    );
};

interface TabsTriggerProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ active, onClick, children, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                active
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {children}
        </button>
    );
};

interface TabsContentProps {
    active: boolean;
    children: React.ReactNode;
    className?: string;
}

const TabsContent: React.FC<TabsContentProps> = ({ active, children, className = '' }) => {
    if (!active) return null;

    return (
        <div className={`animate-fade-in ${className}`}>
            {children}
        </div>
    );
};

export const Tabs = {
    Root: TabsRoot,
    List: TabsList,
    Trigger: TabsTrigger,
    Content: TabsContent
};
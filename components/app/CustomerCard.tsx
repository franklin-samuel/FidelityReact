import React from 'react';

interface CustomerCardRootProps {
    children: React.ReactNode;
    isFreeReady?: boolean;
}

const CustomerCardRoot: React.FC<CustomerCardRootProps> = ({ children, isFreeReady = false }) => {
    const borderColor = isFreeReady
        ? 'border-green-200 dark:border-green-900 bg-green-50/30 dark:bg-green-950/20'
        : 'border-zinc-200 dark:border-zinc-800';

    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-xl border ${borderColor} p-6 space-y-4`}>
            {children}
        </div>
    );
};

interface CustomerCardHeaderProps {
    name: string;
    isFreeReady?: boolean;
}

const CustomerCardHeader: React.FC<CustomerCardHeaderProps> = ({ name, isFreeReady = false }) => {
    return (
        <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{name}</h3>
            {isFreeReady && (
                <span className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
          Grátis!
        </span>
            )}
        </div>
    );
};

interface CustomerCardInfoProps {
    icon: React.ReactNode;
    children: React.ReactNode;
}

const CustomerCardInfo: React.FC<CustomerCardInfoProps> = ({ icon, children }) => {
    return (
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="w-4 h-4">{icon}</span>
            <span>{children}</span>
        </div>
    );
};

interface CustomerCardProgressProps {
    current: number;
    total: number;
}

const CustomerCardProgress: React.FC<CustomerCardProgressProps> = ({ current, total }) => {
    const percentage = (current / total) * 100;
    const isFull = current >= total;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Progresso</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
          {current}/{total}
        </span>
            </div>
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all ${isFull ? 'bg-green-600' : 'bg-zinc-900 dark:bg-zinc-50'}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
        </div>
    );
};

interface CustomerCardClaimedProps {
    count: number;
}

const CustomerCardClaimed: React.FC<CustomerCardClaimedProps> = ({ count }) => {
    if (count === 0) return null;

    return (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {count} corte{count !== 1 ? 's' : ''} grátis já resgatado{count !== 1 ? 's' : ''}
        </p>
    );
};

interface CustomerCardActionsProps {
    children: React.ReactNode;
}

const CustomerCardActions: React.FC<CustomerCardActionsProps> = ({ children }) => {
    return (
        <div className="flex items-center gap-3 pt-2">
            {children}
        </div>
    );
};

export const CustomerCard = {
    Root: CustomerCardRoot,
    Header: CustomerCardHeader,
    Info: CustomerCardInfo,
    Progress: CustomerCardProgress,
    Claimed: CustomerCardClaimed,
    Actions: CustomerCardActions
};
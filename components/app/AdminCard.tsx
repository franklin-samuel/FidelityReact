import React from 'react';

interface AdminCardRootProps {
    children: React.ReactNode;
    isCurrentUser?: boolean;
}

const AdminCardRoot: React.FC<AdminCardRootProps> = ({ children, isCurrentUser = false }) => {
    const borderColor = isCurrentUser
        ? 'border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/20'
        : 'border-zinc-200 dark:border-zinc-800';

    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-xl border ${borderColor} p-6 space-y-4`}>
            {children}
        </div>
    );
};

interface AdminCardHeaderProps {
    name: string;
    isCurrentUser?: boolean;
    actions?: React.ReactNode;
}

const AdminCardHeader: React.FC<AdminCardHeaderProps> = ({ name, isCurrentUser = false, actions }) => {
    return (
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{name}</h3>
            </div>
            <div className="flex items-center gap-2">
                {isCurrentUser && (
                    <span className="px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full">
                        Você
                    </span>
                )}
                {actions}
            </div>
        </div>
    );
};

interface AdminCardInfoProps {
    icon: React.ReactNode;
    children: React.ReactNode;
}

const AdminCardInfo: React.FC<AdminCardInfoProps> = ({ icon, children }) => {
    return (
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="w-4 h-4">{icon}</span>
            <span>{children}</span>
        </div>
    );
};

export const AdminCard = {
    Root: AdminCardRoot,
    Header: AdminCardHeader,
    Info: AdminCardInfo
};
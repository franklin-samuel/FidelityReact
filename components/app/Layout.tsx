import React from 'react';

interface LayoutRootProps {
    children: React.ReactNode;
}

const LayoutRoot: React.FC<LayoutRootProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {children}
        </div>
    );
};

interface LayoutSidebarProps {
    children: React.ReactNode;
}

const LayoutSidebar: React.FC<LayoutSidebarProps> = ({ children }) => {
    return (
        <aside className="w-64 h-screen bg-zinc-900 dark:bg-black flex flex-col fixed left-0 top-0">
            {children}
        </aside>
    );
};

interface LayoutMainProps {
    children: React.ReactNode;
}

const LayoutMain: React.FC<LayoutMainProps> = ({ children }) => {
    return (
        <div className="lg:ml-64 flex-1 w-full">
            {children}
        </div>
    );
};

interface LayoutContentProps {
    children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    );
};

interface LayoutHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
}

const LayoutHeader: React.FC<LayoutHeaderProps> = ({ title, description, actions }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 lg:mb-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{title}</h1>
                {description && (
                    <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">{description}</p>
                )}
            </div>
            {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
    );
};

export const Layout = {
    Root: LayoutRoot,
    Sidebar: LayoutSidebar,
    Main: LayoutMain,
    Content: LayoutContent,
    Header: LayoutHeader
};
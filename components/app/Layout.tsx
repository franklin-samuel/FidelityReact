
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
        <div className="ml-64 flex-1">
            {children}
        </div>
    );
};

interface LayoutContentProps {
    children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
    return (
        <div className="p-8">
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
        <div className="flex items-start justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{title}</h1>
                {description && (
                    <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
                )}
            </div>
            {actions && <div>{actions}</div>}
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
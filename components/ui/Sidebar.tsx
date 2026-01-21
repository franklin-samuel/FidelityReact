
import React from 'react';

interface SidebarRootProps {
    children: React.ReactNode;
}

const SidebarRoot: React.FC<SidebarRootProps> = ({ children }) => {
    return (
        <aside className="w-64 h-screen bg-zinc-900 dark:bg-black flex flex-col fixed left-0 top-0">
            {children}
        </aside>
    );
};

interface SidebarLogoProps {
    children: React.ReactNode;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ children }) => {
    return (
        <div className="p-6 flex items-center gap-3">
            {children}
        </div>
    );
};

interface SidebarNavProps {
    children: React.ReactNode;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ children }) => {
    return (
        <nav className="flex-1 px-4 space-y-1">
            {children}
        </nav>
    );
};

interface SidebarItemProps {
    icon: React.ReactNode;
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, children, active = false, onClick }) => {
    const activeStyles = active
        ? 'bg-zinc-800 dark:bg-zinc-900 text-amber-500'
        : 'text-zinc-400 hover:bg-zinc-800 dark:hover:bg-zinc-900 hover:text-zinc-100';

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeStyles}`}
        >
            <span className="w-5 h-5">{icon}</span>
            <span className="font-medium">{children}</span>
        </button>
    );
};

interface SidebarFooterProps {
    children: React.ReactNode;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ children }) => {
    return (
        <div className="p-4 border-t border-zinc-800 dark:border-zinc-900">
            {children}
        </div>
    );
};

export const Sidebar = {
    Root: SidebarRoot,
    Logo: SidebarLogo,
    Nav: SidebarNav,
    Item: SidebarItem,
    Footer: SidebarFooter
};
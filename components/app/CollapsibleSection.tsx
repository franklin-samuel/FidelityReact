import React from 'react';

interface CollapsibleSectionProps {
    title: string;
    subtitle?: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

export function CollapsibleSection({ title, subtitle, isOpen, onToggle, children }: CollapsibleSectionProps) {
    return (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
                <div className="text-left">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
                    {subtitle && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>
                    )}
                </div>
                <svg
                    className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 bg-white dark:bg-zinc-900 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
}
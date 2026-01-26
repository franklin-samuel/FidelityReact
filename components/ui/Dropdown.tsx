'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DropdownRootProps {
    children: React.ReactNode;
}

const DropdownRoot: React.FC<DropdownRootProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className="relative inline-block">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        isOpen,
                        setIsOpen,
                    });
                }
                return child;
            })}
        </div>
    );
};

interface DropdownTriggerProps {
    children: React.ReactNode;
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
}

const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ children, isOpen, setIsOpen }) => {
    return (
        <button
            onClick={() => setIsOpen?.(!isOpen)}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Abrir menu"
        >
            {children}
        </button>
    );
};

interface DropdownContentProps {
    children: React.ReactNode;
    isOpen?: boolean;
    align?: 'left' | 'right';
}

const DropdownContent: React.FC<DropdownContentProps> = ({
                                                             children,
                                                             isOpen,
                                                             align = 'right'
                                                         }) => {
    if (!isOpen) return null;

    const alignmentClass = align === 'left' ? 'left-0' : 'right-0';

    return (
        <div
            className={`absolute ${alignmentClass} top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in`}
        >
            {children}
        </div>
    );
};

interface DropdownItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'danger';
    disabled?: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
                                                       children,
                                                       onClick,
                                                       variant = 'default',
                                                       disabled = false
                                                   }) => {
    const variantStyles = {
        default: 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800',
        danger: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${variantStyles[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {children}
        </button>
    );
};

interface DropdownSeparatorProps {}

const DropdownSeparator: React.FC<DropdownSeparatorProps> = () => {
    return <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />;
};

export const Dropdown = {
    Root: DropdownRoot,
    Trigger: DropdownTrigger,
    Content: DropdownContent,
    Item: DropdownItem,
    Separator: DropdownSeparator
};
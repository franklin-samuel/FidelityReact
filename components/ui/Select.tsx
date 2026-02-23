import React from 'react';

interface SelectRootProps {
    children: React.ReactNode;
    className?: string;
}

const SelectRoot: React.FC<SelectRootProps> = ({ children, className = '' }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {children}
        </div>
    );
};

interface SelectLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    required?: boolean;
}

const SelectLabel: React.FC<SelectLabelProps> = ({ children, required, className = '', ...props }) => {
    return (
        <label className={`text-sm font-medium text-zinc-700 dark:text-zinc-300 ${className}`} {...props}>
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
};

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ error, className = '', children, ...props }) => {
    const errorStyles = error
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : 'border-zinc-300 focus:ring-zinc-900 focus:border-zinc-900 dark:border-zinc-700 dark:focus:ring-zinc-50 dark:focus:border-zinc-50';

    return (
        <select
            className={`
                w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-900
                text-zinc-900 dark:text-zinc-50
                focus:outline-none focus:ring-2 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                ${errorStyles} ${className}
            `}
            {...props}
        >
            {children}
        </select>
    );
};

interface SelectErrorProps {
    children: React.ReactNode;
}

const SelectError: React.FC<SelectErrorProps> = ({ children }) => {
    return (
        <p className="text-sm text-red-600 dark:text-red-400">
            {children}
        </p>
    );
};

export const Select = {
    Root: SelectRoot,
    Label: SelectLabel,
    Field: SelectField,
    Error: SelectError
};
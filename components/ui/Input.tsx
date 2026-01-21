
import React from 'react';

interface InputRootProps {
    children: React.ReactNode;
    className?: string;
}

const InputRoot: React.FC<InputRootProps> = ({ children, className = '' }) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {children}
        </div>
    );
};

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
    required?: boolean;
}

const InputLabel: React.FC<InputLabelProps> = ({ children, required, className = '', ...props }) => {
    return (
        <label className={`text-sm font-medium text-zinc-700 dark:text-zinc-300 ${className}`} {...props}>
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
};

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ error, className = '', ...props }) => {
    const errorStyles = error
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : 'border-zinc-300 focus:ring-zinc-900 focus:border-zinc-900 dark:border-zinc-700 dark:focus:ring-zinc-50 dark:focus:border-zinc-50';

    return (
        <input
            className={`
        w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-zinc-900
        text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600
        focus:outline-none focus:ring-2 transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${errorStyles} ${className}
      `}
            {...props}
        />
    );
};

interface InputIconProps {
    children: React.ReactNode;
    position?: 'left' | 'right';
}

const InputIcon: React.FC<InputIconProps> = ({ children, position = 'left' }) => {
    return (
        <span className={`absolute top-1/2 -translate-y-1/2 ${position === 'left' ? 'left-3' : 'right-3'} text-zinc-400`}>
      {children}
    </span>
    );
};

interface InputContainerProps {
    children: React.ReactNode;
}

const InputContainer: React.FC<InputContainerProps> = ({ children }) => {
    return (
        <div className="relative">
            {children}
        </div>
    );
};

interface InputErrorProps {
    children: React.ReactNode;
}

const InputError: React.FC<InputErrorProps> = ({ children }) => {
    return (
        <p className="text-sm text-red-600 dark:text-red-400">
            {children}
        </p>
    );
};

export const Input = {
    Root: InputRoot,
    Label: InputLabel,
    Field: InputField,
    Icon: InputIcon,
    Container: InputContainer,
    Error: InputError
};
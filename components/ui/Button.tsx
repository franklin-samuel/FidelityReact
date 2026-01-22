import React from 'react';

interface ButtonRootProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const ButtonRoot: React.FC<ButtonRootProps> = ({
                                                   variant = 'primary',
                                                   size = 'md',
                                                   className = '',
                                                   children,
                                                   disabled,
                                                   ...props
                                               }) => {
    const baseStyles = 'rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 button-press';

    const variantStyles = {
        primary: 'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 hover:scale-105',
        secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-500 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600 glow-green hover:scale-105',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 hover:scale-105'
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

interface ButtonIconProps {
    children: React.ReactNode;
    position?: 'left' | 'right';
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ children }) => {
    return <span className="inline-flex items-center">{children}</span>;
};

export const Button = {
    Root: ButtonRoot,
    Icon: ButtonIcon
};
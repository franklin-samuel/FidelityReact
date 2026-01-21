
import React from 'react';

interface CardRootProps {
    children: React.ReactNode;
    className?: string;
}

const CardRoot: React.FC<CardRootProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 ${className}`}>
            {children}
        </div>
    );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
    return (
        <div className={`p-6 border-b border-zinc-200 dark:border-zinc-800 ${className}`}>
            {children}
        </div>
    );
};

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
    return (
        <h3 className={`text-lg font-semibold text-zinc-900 dark:text-zinc-50 ${className}`}>
            {children}
        </h3>
    );
};

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => {
    return (
        <p className={`text-sm text-zinc-600 dark:text-zinc-400 mt-1 ${className}`}>
            {children}
        </p>
    );
};

interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
};

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
    return (
        <div className={`p-6 border-t border-zinc-200 dark:border-zinc-800 ${className}`}>
            {children}
        </div>
    );
};

export const Card = {
    Root: CardRoot,
    Header: CardHeader,
    Title: CardTitle,
    Description: CardDescription,
    Body: CardBody,
    Footer: CardFooter
};
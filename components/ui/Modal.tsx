
import React from 'react';

interface ModalRootProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ModalRoot: React.FC<ModalRootProps> = ({ open, onClose, children }) => {
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-md mx-4">
                {children}
            </div>
        </div>
    );
};

interface ModalContentProps {
    children: React.ReactNode;
    className?: string;
}

const ModalContent: React.FC<ModalContentProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl ${className}`}>
            {children}
        </div>
    );
};

interface ModalHeaderProps {
    children: React.ReactNode;
    onClose?: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ children, onClose }) => {
    return (
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {children}
            </h2>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

interface ModalBodyProps {
    children: React.ReactNode;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children }) => {
    return (
        <div className="p-6">
            {children}
        </div>
    );
};

interface ModalFooterProps {
    children: React.ReactNode;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => {
    return (
        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-200 dark:border-zinc-800">
            {children}
        </div>
    );
};

export const Modal = {
    Root: ModalRoot,
    Content: ModalContent,
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter
};
import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    title: string;
    description: string;
}

export function DeleteConfirmModal({
                                       isOpen,
                                       onClose,
                                       onConfirm,
                                       isDeleting,
                                       title,
                                       description,
                                   }: DeleteConfirmModalProps) {
    return (
        <Modal.Root open={isOpen} onClose={() => !isDeleting && onClose()}>
            <Modal.Content>
                <Modal.Header onClose={() => !isDeleting && onClose()}>
                    {title}
                </Modal.Header>
                <Modal.Body>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {description}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Root variant="secondary" onClick={onClose} disabled={isDeleting}>
                        Cancelar
                    </Button.Root>
                    <Button.Root variant="danger" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? (
                            <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Deletando...</>
                        ) : 'Deletar'}
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}
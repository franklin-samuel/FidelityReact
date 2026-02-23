import React from 'react';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Service } from '@/types/service';
import type { Product } from '@/types/product';

interface CatalogFormData {
    name: string;
    price: string;
    commission_percentage: string;
}

interface CatalogFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    form: CatalogFormData;
    setForm: React.Dispatch<React.SetStateAction<CatalogFormData>>;
    editingItem: Service | Product | null;
    isSaving: boolean;
    itemType: 'service' | 'product';
}

export function CatalogForm({
                                isOpen,
                                onClose,
                                onSubmit,
                                form,
                                setForm,
                                editingItem,
                                isSaving,
                                itemType,
                            }: CatalogFormProps) {
    const itemLabel = itemType === 'service' ? 'Serviço' : 'Produto';

    return (
        <Modal.Root open={isOpen} onClose={() => !isSaving && onClose()}>
            <Modal.Content>
                <Modal.Header onClose={() => !isSaving && onClose()}>
                    {editingItem ? `Editar ${itemLabel}` : `Novo ${itemLabel}`}
                </Modal.Header>
                <form onSubmit={onSubmit}>
                    <Modal.Body>
                        <div className="space-y-4">
                            <Input.Root>
                                <Input.Label htmlFor="name" required>Nome</Input.Label>
                                <Input.Field
                                    id="name"
                                    placeholder="Ex: Corte simples"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                    disabled={isSaving}
                                />
                            </Input.Root>
                            <Input.Root>
                                <Input.Label htmlFor="price" required>Preço (R$)</Input.Label>
                                <Input.Field
                                    id="price"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0,00"
                                    value={form.price}
                                    onChange={e => setForm({ ...form, price: e.target.value })}
                                    required
                                    disabled={isSaving}
                                />
                            </Input.Root>
                            <Input.Root>
                                <Input.Label htmlFor="commission" required>Comissão (%)</Input.Label>
                                <Input.Field
                                    id="commission"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    placeholder="0"
                                    value={form.commission_percentage}
                                    onChange={e => setForm({ ...form, commission_percentage: e.target.value })}
                                    required
                                    disabled={isSaving}
                                />
                            </Input.Root>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Root type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
                            Cancelar
                        </Button.Root>
                        <Button.Root type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Salvando...</>
                            ) : 'Salvar'}
                        </Button.Root>
                    </Modal.Footer>
                </form>
            </Modal.Content>
        </Modal.Root>
    );
}
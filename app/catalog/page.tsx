'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Dropdown } from '@/components/ui/Dropdown';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '@/hooks/useService';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProduct';
import type { Service } from '@/types/service';
import type { Product } from '@/types/product';

type TabType = 'services' | 'products';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

interface ItemFormData {
    name: string;
    price: string;
    commission_percentage: string;
}

const emptyForm: ItemFormData = { name: '', price: '', commission_percentage: '' };

export default function CatalogPage() {
    const [tab, setTab] = useState<TabType>('services');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Service | Product | null>(null);
    const [deletingItem, setDeletingItem] = useState<Service | Product | null>(null);
    const [form, setForm] = useState<ItemFormData>(emptyForm);

    const { data: services, isLoading: loadingServices } = useServices();
    const { data: products, isLoading: loadingProducts } = useProducts();
    const { mutate: createService, isPending: creatingService } = useCreateService();
    const { mutate: updateService, isPending: updatingService } = useUpdateService();
    const { mutate: deleteService, isPending: deletingService } = useDeleteService();
    const { mutate: createProduct, isPending: creatingProduct } = useCreateProduct();
    const { mutate: updateProduct, isPending: updatingProduct } = useUpdateProduct();
    const { mutate: deleteProduct, isPending: deletingProduct } = useDeleteProduct();

    const isService = tab === 'services';
    const isLoading = isService ? loadingServices : loadingProducts;
    const items = isService ? services : products;
    const isSaving = isService ? (creatingService || updatingService) : (creatingProduct || updatingProduct);
    const isDeleting = isService ? deletingService : deletingProduct;

    const handleOpenCreate = () => {
        setEditingItem(null);
        setForm(emptyForm);
        setIsCreateModalOpen(true);
    };

    const handleOpenEdit = (item: Service | Product) => {
        setEditingItem(item);
        setForm({
            name: item.name,
            price: String(item.price),
            commission_percentage: String(item.commission_percentage),
        });
        setIsCreateModalOpen(true);
    };

    const handleOpenDelete = (item: Service | Product) => {
        setDeletingItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: form.name,
            price: parseFloat(form.price),
            commission_percentage: parseFloat(form.commission_percentage),
        };

        if (editingItem) {
            if (isService) {
                updateService({ id: editingItem.id, data: payload }, { onSuccess: () => setIsCreateModalOpen(false) });
            } else {
                updateProduct({ id: editingItem.id, data: payload }, { onSuccess: () => setIsCreateModalOpen(false) });
            }
        } else {
            if (isService) {
                createService(payload, { onSuccess: () => { setIsCreateModalOpen(false); setForm(emptyForm); } });
            } else {
                createProduct(payload, { onSuccess: () => { setIsCreateModalOpen(false); setForm(emptyForm); } });
            }
        }
    };

    const handleDelete = () => {
        if (!deletingItem) return;
        if (isService) {
            deleteService(deletingItem.id, { onSuccess: () => { setIsDeleteModalOpen(false); setDeletingItem(null); } });
        } else {
            deleteProduct(deletingItem.id, { onSuccess: () => { setIsDeleteModalOpen(false); setDeletingItem(null); } });
        }
    };

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    <div className="space-y-6 animate-fade-in">
                        <Layout.Header
                            title="Serviços e Produtos"
                            description="Gerencie o catálogo da barbearia"
                            actions={
                                <Button.Root onClick={handleOpenCreate}>
                                    <Button.Icon>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </Button.Icon>
                                    {isService ? 'Novo Serviço' : 'Novo Produto'}
                                </Button.Root>
                            }
                        />

                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
                            {(['services', 'products'] as TabType[]).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                                        tab === t
                                            ? 'border-amber-500 text-amber-500'
                                            : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                    }`}
                                >
                                    {t === 'services' ? 'Serviços' : 'Produtos'}
                                </button>
                            ))}
                        </div>

                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : !items || items.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                                    Nenhum {isService ? 'serviço' : 'produto'} cadastrado
                                </p>
                                <Button.Root onClick={handleOpenCreate} variant="secondary">
                                    Adicionar
                                </Button.Root>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="animate-fade-in bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        <div>
                                            <p className="font-medium text-zinc-900 dark:text-zinc-50">{item.name}</p>
                                            <p className="text-sm text-zinc-500">Comissão: {item.commission_percentage}%</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                                {formatCurrency(item.price)}
                                            </p>
                                            <Dropdown.Root>
                                                <Dropdown.Trigger>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content>
                                                    <Dropdown.Item onClick={() => handleOpenEdit(item)}>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Editar
                                                    </Dropdown.Item>
                                                    <Dropdown.Item variant="danger" onClick={() => handleOpenDelete(item)}>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Deletar
                                                    </Dropdown.Item>
                                                </Dropdown.Content>
                                            </Dropdown.Root>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Create/Edit Modal */}
                    <Modal.Root open={isCreateModalOpen} onClose={() => !isSaving && setIsCreateModalOpen(false)}>
                        <Modal.Content>
                            <Modal.Header onClose={() => !isSaving && setIsCreateModalOpen(false)}>
                                {editingItem ? `Editar ${isService ? 'Serviço' : 'Produto'}` : `Novo ${isService ? 'Serviço' : 'Produto'}`}
                            </Modal.Header>
                            <form onSubmit={handleSubmit}>
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
                                    <Button.Root type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)} disabled={isSaving}>
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

                    {/* Delete Modal */}
                    <Modal.Root open={isDeleteModalOpen} onClose={() => !isDeleting && setIsDeleteModalOpen(false)}>
                        <Modal.Content>
                            <Modal.Header onClose={() => !isDeleting && setIsDeleteModalOpen(false)}>
                                Confirmar Exclusão
                            </Modal.Header>
                            <Modal.Body>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    Tem certeza que deseja deletar <strong className="text-zinc-900 dark:text-zinc-50">{deletingItem?.name}</strong>? Esta ação não pode ser desfeita.
                                </p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Root variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                                    Cancelar
                                </Button.Root>
                                <Button.Root variant="danger" onClick={handleDelete} disabled={isDeleting}>
                                    {isDeleting ? (
                                        <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Deletando...</>
                                    ) : 'Deletar'}
                                </Button.Root>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Root>
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
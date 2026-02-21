'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Dropdown } from '@/components/ui/Dropdown';
import { useBarbers, useCreateBarber, useDeleteBarber } from '@/hooks/useBarber';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Barber } from '@/types/barber';

export default function BarbersPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingBarber, setDeletingBarber] = useState<Barber | null>(null);
    const [emailConfirmation, setEmailConfirmation] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const { data: barbers, isLoading } = useBarbers();
    const { mutate: createBarber, isPending: creating } = useCreateBarber();
    const { mutate: deleteBarber, isPending: deleting } = useDeleteBarber();

    const canDelete = emailConfirmation === deletingBarber?.email;

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createBarber(form, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setForm({ name: '', email: '', password: '' });
            }
        });
    };

    const handleDelete = () => {
        if (!deletingBarber || !canDelete) return;
        deleteBarber({ barberId: deletingBarber.id, data: { email_confirmation: emailConfirmation } }, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDeletingBarber(null);
                setEmailConfirmation('');
            }
        });
    };

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    <div className="space-y-6 animate-fade-in">
                        <Layout.Header
                            title="Barbeiros"
                            description="Gerencie os barbeiros da barbearia"
                            actions={
                                <Button.Root onClick={() => setIsCreateModalOpen(true)}>
                                    <Button.Icon>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </Button.Icon>
                                    Novo Barbeiro
                                </Button.Root>
                            }
                        />

                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : !barbers || barbers.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-zinc-600 dark:text-zinc-400 mb-4">Nenhum barbeiro cadastrado</p>
                                <Button.Root variant="secondary" onClick={() => setIsCreateModalOpen(true)}>
                                    Adicionar barbeiro
                                </Button.Root>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {barbers.map((barber, index) => (
                                    <div
                                        key={barber.id}
                                        className="animate-fade-in bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-sm flex-shrink-0">
                                                {barber.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-zinc-900 dark:text-zinc-50">{barber.name}</p>
                                                <p className="text-sm text-zinc-500">{barber.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-xs text-zinc-400 hidden sm:block">
                                                Desde {format(new Date(barber.created_at), "MMM yyyy", { locale: ptBR })}
                                            </p>
                                            <Dropdown.Root>
                                                <Dropdown.Trigger>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                    </svg>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content>
                                                    <Dropdown.Item
                                                        variant="danger"
                                                        onClick={() => { setDeletingBarber(barber); setIsDeleteModalOpen(true); }}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Remover
                                                    </Dropdown.Item>
                                                </Dropdown.Content>
                                            </Dropdown.Root>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Create Modal */}
                    <Modal.Root open={isCreateModalOpen} onClose={() => !creating && setIsCreateModalOpen(false)}>
                        <Modal.Content>
                            <Modal.Header onClose={() => !creating && setIsCreateModalOpen(false)}>
                                Novo Barbeiro
                            </Modal.Header>
                            <form onSubmit={handleCreate}>
                                <Modal.Body>
                                    <div className="space-y-4">
                                        <Input.Root>
                                            <Input.Label htmlFor="name" required>Nome</Input.Label>
                                            <Input.Field id="name" placeholder="Nome completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required disabled={creating} />
                                        </Input.Root>
                                        <Input.Root>
                                            <Input.Label htmlFor="email" required>E-mail</Input.Label>
                                            <Input.Field id="email" type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required disabled={creating} />
                                        </Input.Root>
                                        <Input.Root>
                                            <Input.Label htmlFor="password" required>Senha</Input.Label>
                                            <Input.Field id="password" type="password" placeholder="Senha inicial" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required disabled={creating} />
                                        </Input.Root>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button.Root type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)} disabled={creating}>Cancelar</Button.Root>
                                    <Button.Root type="submit" disabled={creating}>
                                        {creating ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Criando...</> : 'Criar'}
                                    </Button.Root>
                                </Modal.Footer>
                            </form>
                        </Modal.Content>
                    </Modal.Root>

                    {/* Delete Modal */}
                    <Modal.Root open={isDeleteModalOpen} onClose={() => !deleting && setIsDeleteModalOpen(false)}>
                        <Modal.Content>
                            <Modal.Header onClose={() => !deleting && setIsDeleteModalOpen(false)}>
                                Remover Barbeiro
                            </Modal.Header>
                            <Modal.Body>
                                <div className="space-y-4">
                                    <p className="text-zinc-600 dark:text-zinc-400">
                                        Para confirmar a remoção de <strong className="text-zinc-900 dark:text-zinc-50">{deletingBarber?.name}</strong>, digite o e-mail abaixo:
                                    </p>
                                    <p className="text-sm font-mono bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg text-zinc-700 dark:text-zinc-300">
                                        {deletingBarber?.email}
                                    </p>
                                    <Input.Root>
                                        <Input.Field
                                            placeholder="Digite o e-mail para confirmar"
                                            value={emailConfirmation}
                                            onChange={e => setEmailConfirmation(e.target.value)}
                                            disabled={deleting}
                                        />
                                    </Input.Root>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Root variant="secondary" onClick={() => { setIsDeleteModalOpen(false); setEmailConfirmation(''); }} disabled={deleting}>Cancelar</Button.Root>
                                <Button.Root variant="danger" onClick={handleDelete} disabled={!canDelete || deleting}>
                                    {deleting ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Removendo...</> : 'Remover'}
                                </Button.Root>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Root>
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
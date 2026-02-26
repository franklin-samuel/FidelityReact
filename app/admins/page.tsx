'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { AdminCard } from '@/components/app/AdminCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Dropdown } from '@/components/ui/Dropdown';
import { useUsers, useCreateUser, useDeleteUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AdminPageSkeleton } from '@/components/app/AdminSkeleton';
import type { User } from '@/types/user';

export default function AdminsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);
    const [emailConfirmation, setEmailConfirmation] = useState('');

    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { data: users, isLoading } = useUsers();
    const { mutate: createUser, isPending: creating } = useCreateUser();
    const { mutate: deleteUser, isPending: deleting } = useDeleteUser();
    const { user: currentUser, refetch } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            refetch();
        }
    }, [currentUser, refetch]);

    const handleCreateAdmin = (e: React.FormEvent) => {
        e.preventDefault();

        createUser(newAdmin, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setNewAdmin({ name: '', email: '', password: '' });
            }
        });
    };

    const handleDeleteClick = (admin: User) => {
        setSelectedAdmin(admin);
        setIsDeleteModalOpen(true);
        setEmailConfirmation('');
    };

    const handleDeleteConfirm = () => {
        if (!selectedAdmin) return;

        deleteUser(
            {
                userId: selectedAdmin.id,
                data: { email_confirmation: emailConfirmation }
            },
            {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedAdmin(null);
                    setEmailConfirmation('');
                }
            }
        );
    };

    const handleCloseDeleteModal = () => {
        if (!deleting) {
            setIsDeleteModalOpen(false);
            setSelectedAdmin(null);
            setEmailConfirmation('');
        }
    };

    if (isLoading) {
        return (
            <Layout.Root>
                <Sidebar />
                <Layout.Main>
                    <Layout.Content>
                        <AdminPageSkeleton />
                    </Layout.Content>
                </Layout.Main>
            </Layout.Root>
        );
    }

    const admins = users || [];

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    <div className="space-y-6 animate-fade-in">
                        <Layout.Header
                            title="Administradores"
                            description="Gerencie os administradores do sistema"
                            actions={
                                <Button.Root onClick={() => setIsCreateModalOpen(true)}>
                                    <Button.Icon>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </Button.Icon>
                                    Novo Admin
                                </Button.Root>
                            }
                        />

                        {/* Admins Grid */}
                        {admins.length === 0 ? (
                            <div className="text-center py-16 animate-fade-in">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                                    <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                                    Nenhum administrador cadastrado
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                    Comece adicionando o primeiro administrador do sistema
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {admins.map((admin, index) => {
                                    const isCurrentUser = currentUser?.email === admin.email;
                                    const formattedDate = format(new Date(admin.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

                                    return (
                                        <div
                                            key={admin.id}
                                            className="animate-fade-in"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <AdminCard.Root isCurrentUser={isCurrentUser}>
                                                <AdminCard.Header
                                                    name={admin.name}
                                                    isCurrentUser={isCurrentUser}
                                                    actions={
                                                        !isCurrentUser && (
                                                            <Dropdown.Root>
                                                                <Dropdown.Trigger>
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                    </svg>
                                                                </Dropdown.Trigger>
                                                                <Dropdown.Content>
                                                                    <Dropdown.Item
                                                                        variant="danger"
                                                                        onClick={() => handleDeleteClick(admin)}
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                        Deletar
                                                                    </Dropdown.Item>
                                                                </Dropdown.Content>
                                                            </Dropdown.Root>
                                                        )
                                                    }
                                                />

                                                <div className="space-y-1.5">
                                                    <AdminCard.Info
                                                        icon={
                                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                            </svg>
                                                        }
                                                    >
                                                        {admin.email}
                                                    </AdminCard.Info>

                                                    <AdminCard.Info
                                                        icon={
                                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        }
                                                    >
                                                        Desde {formattedDate}
                                                    </AdminCard.Info>
                                                </div>
                                            </AdminCard.Root>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Create Admin Modal */}
                    <Modal.Root open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                        <Modal.Content>
                            <Modal.Header onClose={() => setIsCreateModalOpen(false)}>
                                Novo Administrador
                            </Modal.Header>

                            <form onSubmit={handleCreateAdmin}>
                                <Modal.Body>
                                    <div className="space-y-4">
                                        <Input.Root>
                                            <Input.Label htmlFor="admin-name" required>Nome</Input.Label>
                                            <Input.Field
                                                id="admin-name"
                                                placeholder="Nome completo"
                                                value={newAdmin.name}
                                                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                                required
                                                disabled={creating}
                                            />
                                        </Input.Root>

                                        <Input.Root>
                                            <Input.Label htmlFor="admin-email" required>Email</Input.Label>
                                            <Input.Field
                                                id="admin-email"
                                                type="email"
                                                placeholder="admin@barbearia.com"
                                                value={newAdmin.email}
                                                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                                required
                                                disabled={creating}
                                            />
                                        </Input.Root>

                                        <Input.Root>
                                            <Input.Label htmlFor="admin-password" required>Senha</Input.Label>
                                            <Input.Field
                                                id="admin-password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={newAdmin.password}
                                                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                                required
                                                disabled={creating}
                                            />
                                        </Input.Root>
                                    </div>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button.Root
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        disabled={creating}
                                    >
                                        Cancelar
                                    </Button.Root>
                                    <Button.Root type="submit" disabled={creating}>
                                        {creating ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                                                Salvando...
                                            </>
                                        ) : (
                                            'Salvar'
                                        )}
                                    </Button.Root>
                                </Modal.Footer>
                            </form>
                        </Modal.Content>
                    </Modal.Root>

                    {/* Delete Admin Modal */}
                    <Modal.Root open={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
                        <Modal.Content>
                            <Modal.Header onClose={handleCloseDeleteModal}>
                                Confirmar Exclusão
                            </Modal.Header>

                            <Modal.Body>
                                {selectedAdmin && (
                                    <div className="space-y-4">
                                        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5">
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">
                                                        Atenção: Esta ação não pode ser desfeita!
                                                    </h4>
                                                    <p className="text-sm text-red-800 dark:text-red-300">
                                                        Você está prestes a deletar o administrador{' '}
                                                        <strong>{selectedAdmin.name}</strong>.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Input.Root>
                                            <Input.Label htmlFor="email-confirmation" required>
                                                Para confirmar, digite o email do administrador
                                            </Input.Label>
                                            <Input.Field
                                                id="email-confirmation"
                                                type="email"
                                                placeholder={selectedAdmin.email}
                                                value={emailConfirmation}
                                                onChange={(e) => setEmailConfirmation(e.target.value)}
                                                disabled={deleting}
                                                autoFocus
                                            />
                                        </Input.Root>
                                    </div>
                                )}
                            </Modal.Body>

                            <Modal.Footer>
                                <Button.Root
                                    variant="secondary"
                                    onClick={handleCloseDeleteModal}
                                    disabled={deleting}
                                >
                                    Cancelar
                                </Button.Root>
                                <Button.Root
                                    variant="danger"
                                    onClick={handleDeleteConfirm}
                                    disabled={deleting || emailConfirmation !== selectedAdmin?.email}
                                >
                                    {deleting ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                                            Deletando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Deletar Administrador
                                        </>
                                    )}
                                </Button.Root>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Root>
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
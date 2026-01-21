'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { AdminCard } from '@/components/app/AdminCard'
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useUsers, useCreateUser } from '@/hooks/useUser';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { data: users, isLoading } = useUsers();
    const { mutate: createUser, isPending } = useCreateUser();

    // Por enquanto vou usar um valor fixo para demonstração
    const currentUserEmail = 'samuelfranklin@gmail.com';

    const handleCreateAdmin = (e: React.FormEvent) => {
        e.preventDefault();

        createUser(newAdmin, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setNewAdmin({ name: '', email: '', password: '' });
            }
        });
    };

    if (isLoading) {
        return (
            <Layout.Root>
                <Sidebar />
                <Layout.Main>
                    <Layout.Content>
                        <div className="flex items-center justify-center h-96">
                            <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
                        </div>
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
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-zinc-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-zinc-600 dark:text-zinc-400">Nenhum administrador cadastrado</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {admins.map((admin) => {
                                const isCurrentUser = admin.email === currentUserEmail;
                                const formattedDate = format(new Date(admin.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

                                return (
                                    <AdminCard.Root key={admin.id} isCurrentUser={isCurrentUser}>
                                        <AdminCard.Header name={admin.name} isCurrentUser={isCurrentUser} />

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
                                );
                            })}
                        </div>
                    )}
                </Layout.Content>
            </Layout.Main>

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
                                    />
                                </Input.Root>
                            </div>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button.Root
                                type="button"
                                variant="secondary"
                                onClick={() => setIsCreateModalOpen(false)}
                            >
                                Cancelar
                            </Button.Root>
                            <Button.Root type="submit" disabled={isPending}>
                                {isPending ? 'Salvando...' : 'Salvar'}
                            </Button.Root>
                        </Modal.Footer>
                    </form>
                </Modal.Content>
            </Modal.Root>
        </Layout.Root>
    );
}
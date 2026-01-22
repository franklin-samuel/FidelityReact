'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout} from '@/components/app/Layout';
import { CustomerCard} from '@/components/app/CustomerCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useCustomers, useSearchCustomers, useCreateCustomer } from '@/hooks/useCustomer';
import { useRegisterHaircut } from '@/hooks/useHaircut';
import { useSettings } from '@/hooks/useSettings';
import type { Customer } from '@/types/customer';

export default function ClientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phone_number: ''
    });

    const { data: allCustomers, isLoading: customersLoading } = useCustomers();
    const { data: searchResults } = useSearchCustomers(searchTerm);
    const { data: settings } = useSettings();
    const { mutate: createCustomer, isPending: creating } = useCreateCustomer();
    const { mutate: registerHaircut, isPending: registering } = useRegisterHaircut();

    const haircutsForFree = settings?.haircuts_for_free || 10;

    const customers = searchTerm.length > 0
        ? searchResults
        : allCustomers

    const handleCreateCustomer = (e: React.FormEvent) => {
        e.preventDefault();

        createCustomer(newCustomer, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setNewCustomer({ name: '', email: '', phone_number: '' });
            }
        });
    };

    const handleRegisterHaircut = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsRegisterModalOpen(true);
    };

    const confirmRegisterHaircut = () => {
        if (!selectedCustomer) return;

        registerHaircut(selectedCustomer.id, {
            onSuccess: () => {
                setIsRegisterModalOpen(false);
                setSelectedCustomer(null);
            }
        });
    };

    if (customersLoading) {
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

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    <Layout.Header
                        title="Clientes"
                        description="Gerencie seus clientes e registre cortes"
                        actions={
                            <Button.Root onClick={() => setIsCreateModalOpen(true)}>
                                <Button.Icon>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </Button.Icon>
                                Novo Cliente
                            </Button.Root>
                        }
                    />

                    {/* Search */}
                    <div className="mb-6">
                        <Input.Root>
                            <Input.Container>
                                <Input.Icon>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </Input.Icon>
                                <Input.Field
                                    placeholder="Buscar por nome, telefone ou email..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Input.Container>
                        </Input.Root>
                    </div>

                    {/* Customers Grid */}
                    {customers == null ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-zinc-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {customers.map((customer) => {
                                const isFreeReady = customer.haircut_count >= haircutsForFree;

                                return (
                                    <CustomerCard.Root key={customer.id} isFreeReady={isFreeReady}>
                                        <CustomerCard.Header name={customer.name} isFreeReady={isFreeReady} />

                                        <div className="space-y-1.5">
                                            <CustomerCard.Info
                                                icon={
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                }
                                            >
                                                {customer.phone_number}
                                            </CustomerCard.Info>

                                            <CustomerCard.Info
                                                icon={
                                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                }
                                            >
                                                {customer.email}
                                            </CustomerCard.Info>
                                        </div>

                                        <CustomerCard.Progress
                                            current={customer.haircut_count}
                                            total={haircutsForFree}
                                        />

                                        <CustomerCard.Claimed count={customer.free_haircuts_claimed} />

                                        <CustomerCard.Actions>
                                            <button
                                                onClick={() => handleRegisterHaircut(customer)}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                                                    isFreeReady
                                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                                        : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100'
                                                }`}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                                                </svg>
                                                {isFreeReady ? 'Registrar Grátis' : 'Registrar Corte'}
                                            </button>
                                        </CustomerCard.Actions>
                                    </CustomerCard.Root>
                                );
                            })}
                        </div>
                    )}
                </Layout.Content>
            </Layout.Main>

            {/* Create Customer Modal */}
            <Modal.Root open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <Modal.Content>
                    <Modal.Header onClose={() => setIsCreateModalOpen(false)}>
                        Novo Cliente
                    </Modal.Header>

                    <form onSubmit={handleCreateCustomer}>
                        <Modal.Body>
                            <div className="space-y-4">
                                <Input.Root>
                                    <Input.Label htmlFor="name" required>Nome</Input.Label>
                                    <Input.Field
                                        id="name"
                                        placeholder="Nome completo"
                                        value={newCustomer.name}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                        required
                                    />
                                </Input.Root>

                                <Input.Root>
                                    <Input.Label htmlFor="email" required>Email</Input.Label>
                                    <Input.Field
                                        id="email"
                                        type="email"
                                        placeholder="email@exemplo.com"
                                        value={newCustomer.email}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                        required
                                    />
                                </Input.Root>

                                <Input.Root>
                                    <Input.Label htmlFor="phone" required>Telefone</Input.Label>
                                    <Input.Field
                                        id="phone"
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        value={newCustomer.phone_number}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, phone_number: e.target.value })}
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
                            <Button.Root type="submit" disabled={creating}>
                                {creating ? 'Salvando...' : 'Salvar'}
                            </Button.Root>
                        </Modal.Footer>
                    </form>
                </Modal.Content>
            </Modal.Root>

            {/* Register Haircut Modal */}
            <Modal.Root open={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)}>
                <Modal.Content>
                    <Modal.Header onClose={() => setIsRegisterModalOpen(false)}>
                        Confirmar Registro
                    </Modal.Header>

                    <Modal.Body>
                        {selectedCustomer && (
                            <div className="space-y-4">
                                <p className="text-zinc-900 dark:text-zinc-50">
                                    Deseja registrar um corte para{' '}
                                    <span className="font-semibold">{selectedCustomer.name}</span>?
                                </p>

                                {selectedCustomer.haircut_count >= haircutsForFree && (
                                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg p-4">
                                        <p className="text-sm text-green-800 dark:text-green-200">
                                            Este corte será registrado como <strong>GRÁTIS</strong> e o contador será zerado.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button.Root
                            variant="secondary"
                            onClick={() => setIsRegisterModalOpen(false)}
                        >
                            Cancelar
                        </Button.Root>
                        <Button.Root
                            variant={selectedCustomer && selectedCustomer.haircut_count >= haircutsForFree ? 'success' : 'primary'}
                            onClick={confirmRegisterHaircut}
                            disabled={registering}
                        >
                            {registering ? 'Registrando...' : 'Confirmar'}
                        </Button.Root>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </Layout.Root>
    );
}
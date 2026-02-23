'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { CustomerCard } from '@/components/app/CustomerCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CardSkeleton } from '@/components/ui/Loading';
import { useCustomers, useSearchCustomers, useCreateCustomer } from '@/hooks/useCustomer';
import { useBarbers } from '@/hooks/useBarber';
import { useSettings } from '@/hooks/useSettings';
import type { Customer, Gender, ReferralSource, PreferredFrequency, PreferredStyle } from '@/types/customer';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}

function SelectField({ className = '', children, ...props }: SelectFieldProps) {
    return (
        <select
            className={`w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

const EMPTY = '';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
    { value: 'MALE', label: 'Masculino' },
    { value: 'FEMALE', label: 'Feminino' },
    { value: 'OTHER', label: 'Outro' },
    { value: 'NOT_INFORMED', label: 'Não informado' },
];

const REFERRAL_OPTIONS: { value: ReferralSource; label: string }[] = [
    { value: 'INSTAGRAM', label: 'Instagram' },
    { value: 'INDICATION', label: 'Indicação' },
    { value: 'GOOGLE', label: 'Google' },
    { value: 'FACEBOOK', label: 'Facebook' },
    { value: 'OUTDOOR', label: 'Outdoor' },
    { value: 'WALKING', label: 'Passando na frente' },
    { value: 'OTHERS', label: 'Outros' },
    { value: 'NOT_INFORMED', label: 'Não informado' },
];

const FREQUENCY_OPTIONS: { value: PreferredFrequency; label: string }[] = [
    { value: 'SEMANAL', label: 'Semanal' },
    { value: 'QUINZENAL', label: 'Quinzenal' },
    { value: 'MENSAL', label: 'Mensal' },
    { value: 'BIMENSAL', label: 'Bimensal' },
    { value: 'TRIMENSAL', label: 'Trimestral' },
    { value: 'NOT_INFORMED', label: 'Não informado' },
];

const STYLE_OPTIONS: { value: PreferredStyle; label: string }[] = [
    { value: 'LOW_FADE', label: 'Low Fade' },
    { value: 'MEDIUM_FADE', label: 'Medium Fade' },
    { value: 'HIGH_FADE', label: 'High Fade' },
    { value: 'TAPER_FADE', label: 'Taper Fade' },
    { value: 'BALD', label: 'Raspado' },
    { value: 'SOCIAL', label: 'Social' },
    { value: 'CLASSIC', label: 'Clássico' },
    { value: 'OTHERS', label: 'Outros' },
    { value: 'NOT_INFORMED', label: 'Não informado' },
];


interface CustomerForm {
    name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    gender: Gender | '';
    referral_source: ReferralSource | '';
    preferred_frequency: PreferredFrequency | '';
    preferred_style: PreferredStyle | '';
    preferred_barber_id: string;
    instagram_username: string;
    occupation: string;
}

const emptyForm: CustomerForm = {
    name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    referral_source: '',
    preferred_frequency: '',
    preferred_style: '',
    preferred_barber_id: '',
    instagram_username: '',
    occupation: '',
};


export default function ClientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [form, setForm] = useState<CustomerForm>(emptyForm);

    const { data: allCustomers, isLoading: customersLoading } = useCustomers();
    const { data: searchResults, isLoading: searchLoading } = useSearchCustomers(searchTerm);
    const { data: settings } = useSettings();
    const { data: barbers } = useBarbers();
    const { mutate: createCustomer, isPending: creating } = useCreateCustomer();

    const haircutsForFree = settings?.haircuts_for_free || 10;

    const customers = searchTerm.length > 0 ? searchResults : allCustomers;

    React.useEffect(() => {
        if (searchTerm.length > 0) {
            setIsSearching(true);
            const timer = setTimeout(() => setIsSearching(false), 300);
            return () => clearTimeout(timer);
        } else {
            setIsSearching(false);
        }
    }, [searchTerm]);

    const set = (key: keyof CustomerForm) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: any = {
            name: form.name,
            email: form.email,
            phone_number: form.phone_number,
        };
        if (form.date_of_birth) payload.date_of_birth = form.date_of_birth;
        if (form.gender) payload.gender = form.gender;
        if (form.referral_source) payload.referral_source = form.referral_source;
        if (form.preferred_frequency) payload.preferred_frequency = form.preferred_frequency;
        if (form.preferred_style) payload.preferred_style = form.preferred_style;
        if (form.preferred_barber_id) payload.preferred_barber_id = form.preferred_barber_id;
        if (form.instagram_username) payload.instagram_username = form.instagram_username;
        if (form.occupation) payload.occupation = form.occupation;

        createCustomer(payload, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setForm(emptyForm);
            },
        });
    };

    const closeModal = () => {
        if (!creating) {
            setIsCreateModalOpen(false);
            setForm(emptyForm);
        }
    };

    if (customersLoading) {
        return (
            <Layout.Root>
                <Sidebar />
                <Layout.Main>
                    <Layout.Content>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                                    <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                                </div>
                                <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                            </div>
                            <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
                            </div>
                        </div>
                    </Layout.Content>
                </Layout.Main>
            </Layout.Root>
        );
    }

    const showSearchLoader = isSearching || searchLoading;
    const hasCustomers = customers && customers.length > 0;

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    <div className="space-y-6 animate-fade-in">
                        <Layout.Header
                            title="Clientes"
                            description="Gerencie seus clientes e registre cortes"
                            actions={
                                <Button.Root onClick={() => setIsCreateModalOpen(true)} className="transition-all hover:scale-105">
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
                        <div className="relative">
                            <Input.Root>
                                <Input.Container>
                                    <Input.Icon>
                                        {showSearchLoader ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        )}
                                    </Input.Icon>
                                    <Input.Field
                                        placeholder="Buscar por nome, telefone ou email..."
                                        className="pl-10 pr-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </Input.Container>
                            </Input.Root>
                            {searchTerm && hasCustomers && (
                                <div className="absolute -bottom-6 left-0 text-sm text-zinc-600 dark:text-zinc-400 animate-fade-in">
                                    {customers!.length} {customers!.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                                </div>
                            )}
                        </div>

                        {/* Grid */}
                        {!hasCustomers ? (
                            <div className="text-center py-16 animate-fade-in">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                                    <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                                    {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                                    {searchTerm
                                        ? `Nenhum resultado para "${searchTerm}". Tente outro termo.`
                                        : 'Comece adicionando seu primeiro cliente ao sistema'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {customers!.map((customer, index) => {
                                    const isFreeReady = customer.service_count >= haircutsForFree;
                                    return (
                                        <div
                                            key={customer.id}
                                            className="animate-fade-in hover-scale"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <CustomerCard.Root isFreeReady={isFreeReady}>
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
                                                <CustomerCard.Progress current={customer.service_count} total={haircutsForFree} />
                                                <CustomerCard.Claimed count={customer.discounts_claimed} />
                                            </CustomerCard.Root>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ─── Modal: Criar Cliente ─── */}
                    <Modal.Root open={isCreateModalOpen} onClose={closeModal}>
                        <Modal.Content className="slide-in-down max-w-lg">
                            <Modal.Header onClose={closeModal}>Novo Cliente</Modal.Header>
                            <form onSubmit={handleCreate}>
                                <Modal.Body>
                                    <div className="space-y-5">

                                        {/* ── Seção: Dados básicos ── */}
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
                                                Dados básicos
                                            </p>
                                            <div className="space-y-3">
                                                <Input.Root>
                                                    <Input.Label htmlFor="name" required>Nome</Input.Label>
                                                    <Input.Field
                                                        id="name"
                                                        placeholder="Nome completo"
                                                        value={form.name}
                                                        onChange={set('name')}
                                                        required
                                                        disabled={creating}
                                                        autoFocus
                                                    />
                                                </Input.Root>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Input.Root>
                                                        <Input.Label htmlFor="email" required>Email</Input.Label>
                                                        <Input.Field
                                                            id="email"
                                                            type="email"
                                                            placeholder="email@exemplo.com"
                                                            value={form.email}
                                                            onChange={set('email')}
                                                            required
                                                            disabled={creating}
                                                        />
                                                    </Input.Root>
                                                    <Input.Root>
                                                        <Input.Label htmlFor="phone" required>Telefone</Input.Label>
                                                        <Input.Field
                                                            id="phone"
                                                            type="tel"
                                                            placeholder="(00) 00000-0000"
                                                            value={form.phone_number}
                                                            onChange={set('phone_number')}
                                                            required
                                                            disabled={creating}
                                                        />
                                                    </Input.Root>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Seção: Perfil ── */}
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
                                                Perfil
                                            </p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input.Root>
                                                    <Input.Label htmlFor="dob">Data de nascimento</Input.Label>
                                                    <Input.Field
                                                        id="dob"
                                                        type="date"
                                                        value={form.date_of_birth}
                                                        onChange={set('date_of_birth')}
                                                        disabled={creating}
                                                    />
                                                </Input.Root>
                                                <Input.Root>
                                                    <Input.Label htmlFor="gender">Gênero</Input.Label>
                                                    <SelectField
                                                        id="gender"
                                                        value={form.gender}
                                                        onChange={set('gender')}
                                                        disabled={creating}
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {GENDER_OPTIONS.map((o) => (
                                                            <option key={o.value} value={o.value}>{o.label}</option>
                                                        ))}
                                                    </SelectField>
                                                </Input.Root>
                                                <Input.Root>
                                                    <Input.Label htmlFor="occupation">Profissão</Input.Label>
                                                    <Input.Field
                                                        id="occupation"
                                                        placeholder="Ex: Advogado"
                                                        value={form.occupation}
                                                        onChange={set('occupation')}
                                                        disabled={creating}
                                                    />
                                                </Input.Root>
                                                <Input.Root>
                                                    <Input.Label htmlFor="instagram">Instagram</Input.Label>
                                                    <Input.Field
                                                        id="instagram"
                                                        placeholder="@usuario"
                                                        value={form.instagram_username}
                                                        onChange={set('instagram_username')}
                                                        disabled={creating}
                                                    />
                                                </Input.Root>
                                            </div>
                                        </div>

                                        {/* ── Seção: Preferências ── */}
                                        <div>
                                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
                                                Preferências
                                            </p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input.Root>
                                                    <Input.Label htmlFor="referral">Como nos conheceu?</Input.Label>
                                                    <SelectField
                                                        id="referral"
                                                        value={form.referral_source}
                                                        onChange={set('referral_source')}
                                                        disabled={creating}
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {REFERRAL_OPTIONS.map((o) => (
                                                            <option key={o.value} value={o.value}>{o.label}</option>
                                                        ))}
                                                    </SelectField>
                                                </Input.Root>
                                                <Input.Root>
                                                    <Input.Label htmlFor="frequency">Frequência</Input.Label>
                                                    <SelectField
                                                        id="frequency"
                                                        value={form.preferred_frequency}
                                                        onChange={set('preferred_frequency')}
                                                        disabled={creating}
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {FREQUENCY_OPTIONS.map((o) => (
                                                            <option key={o.value} value={o.value}>{o.label}</option>
                                                        ))}
                                                    </SelectField>
                                                </Input.Root>
                                                <Input.Root>
                                                    <Input.Label htmlFor="style">Estilo preferido</Input.Label>
                                                    <SelectField
                                                        id="style"
                                                        value={form.preferred_style}
                                                        onChange={set('preferred_style')}
                                                        disabled={creating}
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {STYLE_OPTIONS.map((o) => (
                                                            <option key={o.value} value={o.value}>{o.label}</option>
                                                        ))}
                                                    </SelectField>
                                                </Input.Root>
                                                <Input.Root>
                                                    <Input.Label htmlFor="barber">Barbeiro preferido</Input.Label>
                                                    <SelectField
                                                        id="barber"
                                                        value={form.preferred_barber_id}
                                                        onChange={set('preferred_barber_id')}
                                                        disabled={creating}
                                                    >
                                                        <option value="">Sem preferência</option>
                                                        {(barbers ?? []).map((b) => (
                                                            <option key={b.id} value={b.id}>{b.name}</option>
                                                        ))}
                                                    </SelectField>
                                                </Input.Root>
                                            </div>
                                        </div>
                                    </div>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button.Root type="button" variant="secondary" onClick={closeModal} disabled={creating}>
                                        Cancelar
                                    </Button.Root>
                                    <Button.Root type="submit" disabled={creating}>
                                        {creating ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                                                Salvando...
                                            </>
                                        ) : 'Salvar'}
                                    </Button.Root>
                                </Modal.Footer>
                            </form>
                        </Modal.Content>
                    </Modal.Root>
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
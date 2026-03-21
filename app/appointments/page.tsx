'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { AppointmentRow } from '@/components/app/AppointmentRow';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { useAppointments, useDeleteAppointment } from '@/hooks/useAppointment';
import { useBarbers } from '@/hooks/useBarber';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import type { AppointmentFilters, AppointmentType, PaymentMethod } from '@/types/appointment';
import type { Appointment } from '@/types/appointment';
import { DailyReportModal } from '@/components/app/DailyReportModal';
import { useDailyReport } from '@/hooks/useDailyReport';

const SIZE_OPTIONS = [10, 25, 50, 100];

const TYPE_OPTIONS: { value: AppointmentType | ''; label: string }[] = [
    { value: '', label: 'Todos os tipos' },
    { value: 'SERVICE', label: 'Serviços' },
    { value: 'PRODUCT', label: 'Produtos' },
];

const PAYMENT_OPTIONS: { value: PaymentMethod | ''; label: string }[] = [
    { value: '', label: 'Qualquer pagamento' },
    { value: 'PIX', label: 'Pix' },
    { value: 'MONEY', label: 'Dinheiro' },
    { value: 'CREDIT', label: 'Crédito' },
    { value: 'DEBIT', label: 'Débito' },
];

interface DraftFilters {
    type: AppointmentType | '';
    payment_method: PaymentMethod | '';
    barber_id: string;
    date_from: string;
    date_to: string;
}

const EMPTY_DRAFT: DraftFilters = {
    type: '',
    payment_method: '',
    barber_id: '',
    date_from: '',
    date_to: '',
};

function FiltersModal({
                          open,
                          onClose,
                          initial,
                          onApply,
                          isAdmin,
                          barbers,
                      }: {
    open: boolean;
    onClose: () => void;
    initial: DraftFilters;
    onApply: (draft: DraftFilters) => void;
    isAdmin: boolean;
    barbers?: { id: string; name: string }[];
}) {
    const [draft, setDraft] = useState<DraftFilters>(initial);

    useEffect(() => {
        if (open) setDraft(initial);
    }, [open]);

    const set = (key: keyof DraftFilters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setDraft((prev) => ({ ...prev, [key]: e.target.value }));

    const handleClear = () => setDraft(EMPTY_DRAFT);

    const handleApply = () => {
        onApply(draft);
        onClose();
    };

    const hasAny = Object.values(draft).some(Boolean);

    return (
        <Modal.Root open={open} onClose={onClose}>
            <Modal.Content>
                <Modal.Header onClose={onClose}>Filtros avançados</Modal.Header>

                <Modal.Body>
                    <div className="space-y-4">
                        <Select.Root>
                            <Select.Label htmlFor="f-type">Tipo</Select.Label>
                            <Select.Field id="f-type" value={draft.type} onChange={set('type')}>
                                {TYPE_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </Select.Field>
                        </Select.Root>

                        <Select.Root>
                            <Select.Label htmlFor="f-payment">Forma de pagamento</Select.Label>
                            <Select.Field id="f-payment" value={draft.payment_method} onChange={set('payment_method')}>
                                {PAYMENT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </Select.Field>
                        </Select.Root>

                        {isAdmin && (
                            <Select.Root>
                                <Select.Label htmlFor="f-barber">Barbeiro</Select.Label>
                                <Select.Field id="f-barber" value={draft.barber_id} onChange={set('barber_id')}>
                                    <option value="">Todos os barbeiros</option>
                                    {(barbers ?? []).map((b) => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </Select.Field>
                            </Select.Root>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Período</label>
                            <div className="flex items-center gap-3">
                                <Input.Root className="flex-1">
                                    <Input.Label htmlFor="f-from">De</Input.Label>
                                    <Input.Field
                                        id="f-from"
                                        type="date"
                                        value={draft.date_from}
                                        onChange={set('date_from')}
                                    />
                                </Input.Root>
                                <Input.Root className="flex-1">
                                    <Input.Label htmlFor="f-to">Até</Input.Label>
                                    <Input.Field
                                        id="f-to"
                                        type="date"
                                        value={draft.date_to}
                                        onChange={set('date_to')}
                                    />
                                </Input.Root>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    {hasAny && (
                        <button
                            onClick={handleClear}
                            className="mr-auto text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                        >
                            Limpar filtros
                        </button>
                    )}
                    <Button.Root variant="secondary" onClick={onClose}>Cancelar</Button.Root>
                    <Button.Root onClick={handleApply}>Aplicar</Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}

function DeleteConfirmationModal({
                                     open,
                                     onClose,
                                     onConfirm,
                                     appointment,
                                     isDeleting,
                                 }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    appointment: Appointment | null;
    isDeleting: boolean;
}) {
    if (!appointment) return null;

    const isService = appointment.type === 'SERVICE';
    const itemName = isService ? appointment.service_name : appointment.product_name;

    return (
        <Modal.Root open={open} onClose={onClose}>
            <Modal.Content>
                <Modal.Header onClose={onClose}>Confirmar exclusão</Modal.Header>
                <Modal.Body>
                    <div className="space-y-3">
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Tem certeza que deseja excluir este atendimento?
                        </p>
                        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                {itemName ?? (isService ? 'Serviço' : 'Produto')}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                {appointment.customer_name && `Cliente: ${appointment.customer_name}`}
                            </p>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-400">
                            Esta ação não pode ser desfeita.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Root variant="secondary" onClick={onClose} disabled={isDeleting}>
                        Cancelar
                    </Button.Root>
                    <Button.Root variant="danger" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                    </Button.Root>
                </Modal.Footer>
            </Modal.Content>
        </Modal.Root>
    );
}

function Pagination({
                        page, totalPages, totalElements, size, hasNext, hasPrevious, onPageChange, onSizeChange,
                    }: {
    page: number; totalPages: number; totalElements: number; size: number;
    hasNext: boolean; hasPrevious: boolean;
    onPageChange: (p: number) => void; onSizeChange: (s: number) => void;
}) {
    const from = totalElements === 0 ? 0 : (page - 1) * size + 1;
    const to = Math.min(page * size, totalElements);

    const getPages = (): (number | 'ellipsis')[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | 'ellipsis')[] = [1];
        if (page > 3) pages.push('ellipsis');
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
        if (page < totalPages - 2) pages.push('ellipsis');
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                <span>{totalElements === 0 ? '0 resultados' : `${from} – ${to} de ${totalElements}`}</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs">Por página:</span>
                    <Select.Root>
                        <Select.Field
                            value={size}
                            onChange={(e) => onSizeChange(Number(e.target.value))}
                            className="py-1 px-2 text-xs w-20"
                        >
                            {SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                        </Select.Field>
                    </Select.Root>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)} disabled={!hasPrevious}
                    className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {getPages().map((p, i) =>
                    p === 'ellipsis'
                        ? <span key={`e-${i}`} className="px-2 text-zinc-400 text-sm">…</span>
                        : <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                p === page ? 'bg-amber-500 text-white' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            }`}
                        >{p}</button>
                )}

                <button
                    onClick={() => onPageChange(page + 1)} disabled={!hasNext}
                    className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

const DEFAULT_FILTERS: AppointmentFilters = {
    page: 1, size: 10, search: '',
    type: '', payment_method: '', barber_id: '', date_from: '', date_to: '',
};

export default function AppointmentsPage() {
    const [filters, setFilters] = useState<AppointmentFilters>(DEFAULT_FILTERS);
    const [searchInput, setSearchInput] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
    const debouncedSearch = useDebounce(searchInput, 400);
    const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
    const { data: dailyReportData, isLoading: loadingDailyReport, refetch: refetchDailyReport } = useDailyReport(isDailyReportOpen);

    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const { data: barbers } = useBarbers();

    const deleteAppointment = useDeleteAppointment();

    useEffect(() => {
        setFilters((prev) => ({ ...prev, search: debouncedSearch, page: 1 }));
    }, [debouncedSearch]);

    const { data: result, isLoading } = useAppointments(filters);

    const handleApplyFilters = useCallback((draft: DraftFilters) => {
        setFilters((prev) => ({ ...prev, ...draft, page: 1 }));
    }, []);

    const handlePageChange = useCallback((page: number) => setFilters((prev) => ({ ...prev, page })), []);
    const handleSizeChange = useCallback((size: number) => setFilters((prev) => ({ ...prev, size, page: 1 })), []);

    const handleClearAll = useCallback(() => {
        setSearchInput('');
        setFilters(DEFAULT_FILTERS);
    }, []);

    const handleDeleteClick = useCallback((appointment: Appointment) => {
        setAppointmentToDelete(appointment);
        setDeleteModalOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!appointmentToDelete) return;

        try {
            await deleteAppointment.mutateAsync(appointmentToDelete.id);
            setDeleteModalOpen(false);
            setAppointmentToDelete(null);
        } catch (error) {
            console.error('Delete error:', error);
        }
    }, [appointmentToDelete, deleteAppointment]);

    const handleOpenDailyReport = useCallback(() => {
        setIsDailyReportOpen(true);
        refetchDailyReport();
    }, [refetchDailyReport]);

    const appointments = result?.content ?? [];
    const totalElements = result?.total_elements ?? 0;
    const totalPages = result?.total_pages ?? 1;
    const currentPage = result?.page ?? 1;
    const currentSize = result?.size ?? 25;
    const hasNext = result?.has_next ?? false;
    const hasPrevious = result?.has_previous ?? false;

    const activeAdvancedCount = [
        filters.type, filters.payment_method, filters.barber_id,
        filters.date_from || filters.date_to,
    ].filter(Boolean).length;

    const hasAnyFilter = !!searchInput || activeAdvancedCount > 0;

    const currentDraft: DraftFilters = {
        type: (filters.type ?? '') as AppointmentType | '',
        payment_method: (filters.payment_method ?? '') as PaymentMethod | '',
        barber_id: filters.barber_id ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
    };

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    <div className="space-y-5 animate-fade-in">
                        <Layout.Header
                            title={isAdmin ? 'Atendimentos' : 'Meus Atendimentos'}
                            description={isAdmin ? 'Histórico completo de atendimentos' : 'Seu histórico de atendimentos'}
                            actions={
                                isAdmin && (
                                    <Button.Root onClick={handleOpenDailyReport}>
                                        <Button.Icon>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </Button.Icon>
                                        Gerar Relatório Diário
                                    </Button.Root>
                                )
                            }
                        />
                        {/* Results */}
                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                                    <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                                    Nenhum atendimento encontrado
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    {hasAnyFilter
                                        ? 'Tente ajustar os filtros para ver mais resultados'
                                        : 'Os atendimentos registrados aparecerão aqui'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    {appointments.map((appointment, index) => (
                                        <AppointmentRow
                                            key={appointment.id}
                                            appointment={appointment}
                                            variant={isAdmin ? 'admin' : 'barber'}
                                            onDelete={handleDeleteClick}
                                            index={index}
                                        />
                                    ))}
                                </div>

                                <Pagination
                                    page={currentPage}
                                    totalPages={totalPages}
                                    totalElements={totalElements}
                                    size={currentSize}
                                    hasNext={hasNext}
                                    hasPrevious={hasPrevious}
                                    onPageChange={handlePageChange}
                                    onSizeChange={handleSizeChange}
                                />
                            </>
                        )}
                    </div>
                </Layout.Content>
                <DailyReportModal
                    isOpen={isDailyReportOpen}
                    onClose={() => setIsDailyReportOpen(false)}
                    data={dailyReportData ?? null}
                    isLoading={loadingDailyReport}
                />
            </Layout.Main>

            <FiltersModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initial={currentDraft}
                onApply={handleApplyFilters}
                isAdmin={isAdmin}
                barbers={barbers}
            />

            <DeleteConfirmationModal
                open={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setAppointmentToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                appointment={appointmentToDelete}
                isDeleting={deleteAppointment.isPending}
            />
        </Layout.Root>
    );
}
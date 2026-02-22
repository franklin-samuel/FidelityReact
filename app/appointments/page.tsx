'use client';

import React from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { useAppointments } from '@/hooks/useAppointment';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Appointment } from '@/types/appointment';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const PAYMENT_LABELS: Record<string, string> = {
    PIX: 'Pix',
    MONEY: 'Dinheiro',
    CREDIT: 'Crédito',
    DEBIT: 'Débito',
};

function AppointmentRow({ appointment, isAdmin }: { appointment: Appointment; isAdmin: boolean }) {
    const isService = appointment.type === 'SERVICE';
    const hasDiscount = appointment.loyalty_discount_applied;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isService
                        ? 'bg-amber-50 dark:bg-amber-950/30'
                        : 'bg-blue-50 dark:bg-blue-950/30'
                }`}>
                    {isService ? (
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    )}
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            {isService ? 'Serviço' : 'Produto'}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                                Desconto fidelidade
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-zinc-400">
                        {format(new Date(appointment.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6 text-sm">

                <div className="text-center">
                    <p className="text-xs text-zinc-400">Gorjeta</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{formatCurrency(appointment.tip)}</p>
                </div>

                <div className="text-center">
                    <p className="text-xs text-zinc-400">Comissão</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{appointment.commission_percentage}%</p>
                </div>

                {!isAdmin && appointment.barber_total !== undefined && (
                    <div className="text-center">
                        <p className="text-xs text-zinc-400">Meu Total</p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">{formatCurrency(appointment.barber_total)}</p>
                    </div>
                )}

                {isAdmin && appointment.barbershop_revenue !== undefined && (
                    <div className="text-center">
                        <p className="text-xs text-zinc-400">Receita</p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">{formatCurrency(appointment.barbershop_revenue)}</p>
                    </div>
                )}
                <div className="text-center min-w-[80px]">
                    <p className="text-xs text-zinc-400">Total</p>
                    <p className={`font-bold text-base ${hasDiscount ? 'text-green-600 dark:text-green-400' : 'text-zinc-900 dark:text-zinc-50'}`}>
                        {formatCurrency(appointment.total_amount)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function AppointmentsPage() {
    const { data: appointments, isLoading } = useAppointments();
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    <div className="space-y-6 animate-fade-in">
                        <Layout.Header
                            title={isAdmin ? 'Atendimentos' : 'Meus Atendimentos'}
                            description={isAdmin
                                ? 'Histórico completo de atendimentos'
                                : 'Seu histórico de atendimentos'}
                        />

                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : !appointments || appointments.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                                    <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                                    Nenhum atendimento registrado
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    Os atendimentos registrados aparecerão aqui
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {appointments.map((appointment, index) => (
                                    <div
                                        key={appointment.id}
                                        className="animate-fade-in"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        <AppointmentRow appointment={appointment} isAdmin={isAdmin} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
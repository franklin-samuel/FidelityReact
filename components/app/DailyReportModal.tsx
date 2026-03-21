'use client';

import React, { useEffect } from 'react';
import { formatCurrency, getPaymentMethodLabel } from '@/utils/formatter';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { DailyReport } from '@/types/daily-report';

interface DailyReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: DailyReport | null;
    isLoading: boolean;
}

export function DailyReportModal({ isOpen, onClose, data, isLoading }: DailyReportModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden animate-slide-in-up flex flex-col">
                <div className="relative bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 px-6 py-6 flex-shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-700/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

                    <div className="relative z-10 flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Relatório de Caixa</h2>
                                {data && (
                                    <p className="text-amber-100 text-xs mt-0.5 font-medium">
                                        {format(parseISO(data.date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {data && (
                        <div className="relative z-10 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <svg className="w-3.5 h-3.5 text-amber-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs font-medium text-white">
                                Período: {format(parseISO(data.period.start), 'HH:mm', { locale: ptBR })} - {format(parseISO(data.period.end), 'HH:mm', { locale: ptBR })}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {isLoading ? (
                        <div className="space-y-4 h-full flex flex-col justify-center">
                            {/* Loading skeleton */}
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-36 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        </div>
                    ) : data ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
                                    <div className="relative bg-white dark:bg-zinc-800 border-2 border-green-200 dark:border-green-900 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-950/40 rounded-full">
                                                <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                                <span className="text-xs font-bold text-green-600 dark:text-green-400">Hoje</span>
                                            </div>
                                        </div>
                                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">Total Arrecadado</p>
                                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                            {formatCurrency(data.total_revenue)}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
                                    <div className="relative bg-white dark:bg-zinc-800 border-2 border-blue-200 dark:border-blue-900 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                </svg>
                                            </div>
                                            <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-950/40 rounded-full">
                                                <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Contagem</span>
                                            </div>
                                        </div>
                                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">Total de Atendimentos</p>
                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                            {data.total_appointments}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                        Por Método de Pagamento
                                    </h3>
                                </div>

                                {data.by_payment_method.length === 0 ? (
                                    <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 mb-4 shadow-inner">
                                            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                        <h4 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                            Nenhum atendimento registrado hoje
                                        </h4>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                                            Os dados aparecerão aqui conforme os atendimentos forem sendo registrados
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {data.by_payment_method.map((method, index) => {
                                            const percentage = data.total_revenue > 0
                                                ? (method.revenue / data.total_revenue) * 100
                                                : 0;

                                            const config: Record<string, {
                                                gradient: string;
                                                border: string;
                                                icon: string;
                                                badge: string;
                                            }> = {
                                                'PIX': {
                                                    gradient: 'from-teal-500 to-cyan-600',
                                                    border: 'border-teal-200 dark:border-teal-900',
                                                    icon: 'text-teal-600 dark:text-teal-400',
                                                    badge: 'bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300'
                                                },
                                                'MONEY': {
                                                    gradient: 'from-green-500 to-emerald-600',
                                                    border: 'border-green-200 dark:border-green-900',
                                                    icon: 'text-green-600 dark:text-green-400',
                                                    badge: 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300'
                                                },
                                                'CREDIT': {
                                                    gradient: 'from-blue-500 to-indigo-600',
                                                    border: 'border-blue-200 dark:border-blue-900',
                                                    icon: 'text-blue-600 dark:text-blue-400',
                                                    badge: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                                                },
                                                'DEBIT': {
                                                    gradient: 'from-purple-500 to-violet-600',
                                                    border: 'border-purple-200 dark:border-purple-900',
                                                    icon: 'text-purple-600 dark:text-purple-400',
                                                    badge: 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                                                },
                                            };

                                            const style = config[method.payment_method] || {
                                                gradient: 'from-zinc-500 to-zinc-600',
                                                border: 'border-zinc-200 dark:border-zinc-800',
                                                icon: 'text-zinc-600 dark:text-zinc-400',
                                                badge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                                            };

                                            return (
                                                <div
                                                    key={method.payment_method}
                                                    className={`relative bg-white dark:bg-zinc-800 border-2 ${style.border} rounded-2xl p-4 hover:shadow-lg transition-shadow duration-300 animate-fade-in group`}
                                                    style={{ animationDelay: `${index * 75}ms` }}
                                                >
                                                    {/* Background gradient on hover */}
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                                    <div className="relative">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className={`w-10 h-10 bg-gradient-to-br ${style.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                                                                    {method.payment_method === 'PIX' && (
                                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                        </svg>
                                                                    )}
                                                                    {method.payment_method === 'MONEY' && (
                                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                        </svg>
                                                                    )}
                                                                    {method.payment_method === 'CREDIT' && (
                                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                                        </svg>
                                                                    )}
                                                                    {method.payment_method === 'DEBIT' && (
                                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                                                                        {getPaymentMethodLabel(method.payment_method)}
                                                                    </h4>
                                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                        {percentage.toFixed(1)}% do total
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className={`flex items-center gap-1 px-2.5 py-1 ${style.badge} rounded-full shadow-sm flex-shrink-0`}>
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                                </svg>
                                                                <span className="text-xs font-bold">{method.appointments}</span>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3">
                                                            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                                                {formatCurrency(method.revenue)}
                                                            </p>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                                                <span>Participação</span>
                                                                <span>{percentage.toFixed(1)}%</span>
                                                            </div>
                                                            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden shadow-inner">
                                                                <div
                                                                    className={`h-full bg-gradient-to-r ${style.gradient} transition-all duration-1000 ease-out rounded-full shadow-sm`}
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 h-full flex flex-col items-center justify-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 mb-4">
                                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Erro ao carregar relatório
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Tente novamente em alguns instantes
                            </p>
                        </div>
                    )}
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Relatório gerado em tempo real
                        </p>
                        <button
                            onClick={onClose}
                            className="px-5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:opacity-90 transition-opacity duration-200 shadow-lg text-sm"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
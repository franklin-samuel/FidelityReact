'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/app/StatCard';
import { LineChart, PieChart } from '@/components/app/Charts';
import { useBarberDashboard } from '@/hooks/useDashboard';
import { useBarbers } from '@/hooks/useBarber';
import { formatCurrency, formatCurrencyShort } from '@/utils/formatter';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/Loading';

function BarberDashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton width="3rem" height="3rem" className="rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton width="12rem" height="2.25rem" />
                    <Skeleton width="16rem" height="1.25rem" />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height="6rem" className="rounded-xl" />
                ))}
            </div>
            <Skeleton height="18rem" className="rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton height="14rem" className="rounded-xl" />
                <Skeleton height="14rem" className="rounded-xl" />
            </div>
        </div>
    );
}

export default function BarberDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const barberId = params?.id as string;

    const { data: barbers } = useBarbers();
    const { data: metrics, isLoading } = useBarberDashboard(barberId);

    const barber = barbers?.find(b => b.id === barberId);

    const chartData = (metrics?.last_30_days_earnings ?? []).map((d) => ({
        date: format(parseISO(d.date), 'dd/MM', { locale: ptBR }),
        value: Number(d.amount),
    }));

    const commission = Number(metrics?.month_commission ?? 0);
    const tips = Number(metrics?.month_tips ?? 0);
    const donutData = [
        { name: 'Comissão', value: commission },
        { name: 'Gorjetas', value: tips },
    ];

    if (!barberId) {
        return null;
    }

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    {isLoading || !metrics ? (
                        <BarberDashboardSkeleton />
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-2xl flex-shrink-0">
                                        {barber?.name.charAt(0).toUpperCase() || 'B'}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                            {barber?.name || 'Barbeiro'}
                                        </h1>
                                        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                                            Desempenho e ganhos
                                        </p>
                                    </div>
                                </div>
                                <Button.Root variant="secondary" onClick={() => router.push('/barbers')}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Voltar
                                </Button.Root>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <StatCard
                                    label="Ganhos Hoje"
                                    value={formatCurrency(Number(metrics.today_earnings))}
                                />
                                <StatCard
                                    label="Ganhos Esta Semana"
                                    value={formatCurrency(Number(metrics.week_earnings))}
                                    highlight
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                />
                                <StatCard
                                    label="Ganhos Este Mês"
                                    value={formatCurrency(Number(metrics.month_earnings))}
                                />
                            </div>

                            <Card.Root>
                                <Card.Header>
                                    <Card.Title>Ganhos — últimos 30 dias</Card.Title>
                                    <Card.Description>Evolução dos ganhos do barbeiro</Card.Description>
                                </Card.Header>
                                <Card.Body>
                                    {chartData.length === 0 ? (
                                        <p className="text-sm text-zinc-400 text-center py-8">Sem dados suficientes</p>
                                    ) : (
                                        <LineChart
                                            data={chartData}
                                            dataKey="value"
                                            xAxisKey="date"
                                            name="Ganhos"
                                            formatYAxis={formatCurrencyShort}
                                            formatTooltip={formatCurrency}
                                        />
                                    )}
                                </Card.Body>
                            </Card.Root>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                                        Desempenho Este Mês
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <StatCard
                                            label="Atendimentos"
                                            value={String(metrics.month_appointments ?? 0)}
                                        />
                                        <StatCard
                                            label="Ticket Médio"
                                            value={formatCurrency(Number(metrics.month_average_ticket))}
                                        />
                                        <StatCard
                                            label="Comissão"
                                            value={formatCurrency(Number(metrics.month_commission))}
                                        />
                                        <StatCard
                                            label="Gorjetas"
                                            value={formatCurrency(Number(metrics.month_tips))}
                                        />
                                    </div>
                                </div>

                                <Card.Root>
                                    <Card.Header>
                                        <Card.Title>Comissão vs Gorjeta</Card.Title>
                                        <Card.Description>Breakdown dos ganhos este mês</Card.Description>
                                    </Card.Header>
                                    <Card.Body className="flex items-center justify-center">
                                        {commission === 0 && tips === 0 ? (
                                            <p className="text-sm text-zinc-400 py-8">Sem dados</p>
                                        ) : (
                                            <PieChart
                                                data={donutData}
                                                dataKey="value"
                                                nameKey="name"
                                                colors={['#f59e0b', '#22c55e']}
                                                innerRadius={50}
                                                outerRadius={75}
                                                height={180}
                                                formatTooltip={formatCurrency}
                                            />
                                        )}
                                    </Card.Body>
                                </Card.Root>
                            </div>

                            <Card.Root className="border-2 border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/20">
                                <Card.Header>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <Card.Title>Resumo Semanal para Pagamento</Card.Title>
                                            <Card.Description>
                                                Total a ser pago referente aos ganhos desta semana
                                            </Card.Description>
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                                                Total da Semana
                                            </p>
                                            <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                                                {formatCurrency(Number(metrics.week_earnings))}
                                            </p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card.Root>
                        </div>
                    )}
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/app/StatCard';
import { LineChart, BarChart, PieChart } from '@/components/app/Charts';
import { useDashboardMetrics } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
import { isAdminMetrics, type AdminDashboardMetrics, type BarberDashboardMetrics } from '@/types/dashboard';
import { formatCurrency, formatCurrencyShort } from '@/utils/formatter';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/Loading';

function AdminDashboard({ metrics }: { metrics: AdminDashboardMetrics }) {
    const router = useRouter();
    const growth = metrics.monthly_growth_percentage ?? 0;
    const growthPositive = growth >= 0;

    const chartData = (metrics.last_30_days_revenue ?? []).map((d) => ({
        date: format(parseISO(d.date), 'dd/MM', { locale: ptBR }),
        value: Number(d.amount),
    }));

    const monthCompare = [
        { name: 'Mês anterior', value: Number(metrics.previous_month_revenue ?? 0) },
        { name: 'Mês atual', value: Number(metrics.current_month_revenue ?? 0) },
    ];

    const breakdown = [
        { name: 'Serviços', value: Number(metrics.services_revenue ?? 0) },
        { name: 'Produtos', value: Number(metrics.products_revenue ?? 0) },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Visão geral do faturamento</p>
                </div>
                <Button.Root variant="secondary" size="sm" onClick={() => router.push('/analytics')}>
                    <Button.Icon>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </Button.Icon>
                    Analytics
                </Button.Root>
            </div>

            {/* Revenue Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    label="Faturamento Hoje"
                    value={formatCurrency(Number(metrics.today_revenue))}
                />
                <StatCard
                    label="Esta Semana"
                    value={formatCurrency(Number(metrics.week_revenue))}
                />
                <StatCard
                    label="Este Mês"
                    value={formatCurrency(Number(metrics.month_revenue))}
                    highlight
                    subtitle={`${growthPositive ? '+' : ''}${growth?.toFixed(1)}% vs mês anterior`}
                />
            </div>

            {/* Line Chart: últimos 30 dias */}
            <Card.Root>
                <Card.Header>
                    <Card.Title>Faturamento — últimos 30 dias</Card.Title>
                </Card.Header>
                <Card.Body>
                    {chartData.length === 0 ? (
                        <p className="text-sm text-zinc-400 text-center py-8">Sem dados suficientes</p>
                    ) : (
                        <LineChart
                            data={chartData}
                            dataKey="value"
                            xAxisKey="date"
                            name="Faturamento"
                            formatYAxis={formatCurrencyShort}
                            formatTooltip={formatCurrency}
                        />
                    )}
                </Card.Body>
            </Card.Root>

            {/* Bar Chart + Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Comparativo mensal */}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Comparativo mensal</Card.Title>
                        <Card.Description>
                            {growthPositive ? '▲' : '▼'} {Math.abs(growth).toFixed(1)}% em relação ao mês anterior
                        </Card.Description>
                    </Card.Header>
                    <Card.Body>
                        <BarChart
                            data={monthCompare}
                            dataKey="value"
                            xAxisKey="name"
                            name="Faturamento"
                            color={['#a1a1aa', '#f59e0b']}
                            height={180}
                            formatYAxis={formatCurrencyShort}
                            formatTooltip={formatCurrency}
                        />
                    </Card.Body>
                </Card.Root>

                {/* Serviços vs Produtos */}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Serviços vs Produtos</Card.Title>
                        <Card.Description>Breakdown de receita do mês</Card.Description>
                    </Card.Header>
                    <Card.Body className="flex items-center justify-center">
                        {breakdown.every((b) => b.value === 0) ? (
                            <p className="text-sm text-zinc-400 py-8">Sem dados</p>
                        ) : (
                            <PieChart
                                data={breakdown}
                                dataKey="value"
                                nameKey="name"
                                colors={['#f59e0b', '#6366f1']}
                                innerRadius={50}
                                outerRadius={75}
                                height={180}
                                formatTooltip={formatCurrency}
                            />
                        )}
                    </Card.Body>
                </Card.Root>
            </div>

            {/* Top Barbers */}
            {metrics.top_barbers && metrics.top_barbers.length > 0 && (
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Top Vendedores do mês</Card.Title>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {metrics.top_barbers.map((barber, i) => (
                                <div key={i} className="flex items-center justify-between px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                            {i + 1}
                                        </span>
                                        <p className="font-medium text-zinc-900 dark:text-zinc-50 text-sm">{barber.barber_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">
                                            {formatCurrency(Number(barber.total_revenue))}
                                        </p>
                                        <p className="text-xs text-zinc-400">{barber.appointments_count} vendas</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card.Root>
            )}
        </div>
    );
}

function BarberDashboard({ metrics }: { metrics: BarberDashboardMetrics }) {
    const chartData = (metrics.last_30_days_earnings ?? []).map((d) => ({
        date: format(parseISO(d.date), 'dd/MM', { locale: ptBR }),
        value: Number(d.amount),
    }));

    const commission = Number(metrics.month_commission ?? 0);
    const tips = Number(metrics.month_tips ?? 0);
    const donutData = [
        { name: 'Comissão', value: commission },
        { name: 'Gorjetas', value: tips },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Seus ganhos e desempenho</p>
            </div>

            {/* Earnings Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    label="Meus Ganhos Hoje"
                    value={formatCurrency(Number(metrics.today_earnings))}
                />
                <StatCard
                    label="Esta Semana"
                    value={formatCurrency(Number(metrics.week_earnings))}
                />
                <StatCard
                    label="Este Mês"
                    value={formatCurrency(Number(metrics.month_earnings))}
                    highlight
                />
            </div>

            {/* Line Chart */}
            <Card.Root>
                <Card.Header>
                    <Card.Title>Meus ganhos — últimos 30 dias</Card.Title>
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

            {/* Performance cards + Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stats */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Meu desempenho este mês
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

                {/* Donut: Comissão vs Gorjeta */}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Comissão vs Gorjeta</Card.Title>
                        <Card.Description>Breakdown dos seus ganhos este mês</Card.Description>
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
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton width="12rem" height="2.25rem" />
                <Skeleton width="16rem" height="1.25rem" />
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

export default function DashboardPage() {
    const { user } = useAuth();
    const { data: metrics, isLoading } = useDashboardMetrics();
    const isAdmin = user?.role === 'ADMIN';

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    {isLoading || !metrics ? (
                        <DashboardSkeleton />
                    ) : isAdmin && isAdminMetrics(metrics) ? (
                        <AdminDashboard metrics={metrics} />
                    ) : !isAdmin ? (
                        <BarberDashboard metrics={metrics as BarberDashboardMetrics} />
                    ) : null}
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
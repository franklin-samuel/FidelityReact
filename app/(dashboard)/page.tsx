'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useDashboardMetrics } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
import { isAdminMetrics, type AdminDashboardMetrics, type BarberDashboardMetrics } from '@/types/dashboard';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);

const formatCurrencyShort = (value: number) => {
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
    return `R$ ${value?.toFixed(0)}`;
};

function MetricBox({
                       label,
                       value,
                       highlight,
                       sub,
                   }: {
    label: string;
    value: string;
    highlight?: boolean;
    sub?: string;
}) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-1">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
            <p className={`text-2xl font-bold ${highlight ? 'text-amber-500' : 'text-zinc-900 dark:text-zinc-50'}`}>
                {value}
            </p>
            {sub && <p className="text-xs text-zinc-400">{sub}</p>}
        </div>
    );
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 shadow-lg text-sm">
            <p className="text-zinc-500 mb-1">{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: p.color }} className="font-semibold">
                    {p.name}: {formatCurrency(p.value)}
                </p>
            ))}
        </div>
    );
}

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
    const PIE_COLORS = ['#f59e0b', '#6366f1'];

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
                <MetricBox label="Faturamento Hoje" value={formatCurrency(Number(metrics.today_revenue))} />
                <MetricBox label="Esta Semana" value={formatCurrency(Number(metrics.week_revenue))} />
                <MetricBox
                    label="Este Mês"
                    value={formatCurrency(Number(metrics.month_revenue))}
                    highlight
                    sub={`${growthPositive ? '+' : ''}${growth?.toFixed(1)}% vs mês anterior`}
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
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                                <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} width={64} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    name="Faturamento"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
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
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={monthCompare} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} width={64} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" name="Faturamento" radius={[6, 6, 0, 0]}>
                                    <Cell fill="#a1a1aa" />
                                    <Cell fill="#f59e0b" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
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
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={breakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        dataKey="value"
                                        nameKey="name"
                                        paddingAngle={3}
                                    >
                                        {breakdown.map((_, i) => (
                                            <Cell key={i} fill={PIE_COLORS[i]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v: any) => formatCurrency(v)} />
                                    <Legend iconType="circle" iconSize={10} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </Card.Body>
                </Card.Root>
            </div>

            {/* Top Barbers */}
            {metrics.top_barbers && metrics.top_barbers.length > 0 && (
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Top Barbeiros do mês</Card.Title>
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
                                        <p className="text-xs text-zinc-400">{barber.appointments_count} atendimentos</p>
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
    const PIE_COLORS = ['#f59e0b', '#22c55e'];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Seus ganhos e desempenho</p>
            </div>

            {/* Earnings Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricBox label="Meus Ganhos Hoje" value={formatCurrency(Number(metrics.today_earnings))} />
                <MetricBox label="Esta Semana" value={formatCurrency(Number(metrics.week_earnings))} />
                <MetricBox label="Este Mês" value={formatCurrency(Number(metrics.month_earnings))} highlight />
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
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                                <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} width={64} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    name="Ganhos"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
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
                        <MetricBox
                            label="Atendimentos"
                            value={String(metrics.month_appointments ?? 0)}
                        />
                        <MetricBox
                            label="Ticket Médio"
                            value={formatCurrency(Number(metrics.month_average_ticket))}
                        />
                        <MetricBox
                            label="Comissão"
                            value={formatCurrency(Number(metrics.month_commission))}
                        />
                        <MetricBox
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
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={donutData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        dataKey="value"
                                        nameKey="name"
                                        paddingAngle={3}
                                    >
                                        {donutData.map((_, i) => (
                                            <Cell key={i} fill={PIE_COLORS[i]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v: any) => formatCurrency(v)} />
                                    <Legend iconType="circle" iconSize={10} />
                                </PieChart>
                            </ResponsiveContainer>
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
                <div className="h-9 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-5 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                ))}
            </div>
            <div className="h-72 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-56 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                <div className="h-56 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
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
'use client';

import React from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { Card } from '@/components/ui/Card';
import { useAnalyticsData } from '@/hooks/useAnalytics';
import {
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
import {ReferralSource} from "@/types/customer";


const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);

const formatCurrencyShort = (value: number) => {
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
    return `R$ ${value?.toFixed(0)}`;
};

const GENDER_LABELS: Record<string, string> = {
    MALE: 'Masculino',
    FEMALE: 'Feminino',
    OTHER: 'Outro',
    NOT_INFORMED: 'Não informado',
};

const CHANNEL_LABELS: Record<string, string> = {
    INSTAGRAM: 'Instagram',
    INDICATION: 'Indicação',
    GOOGLE: 'Google',
    FACEBOOK: 'Facebook',
    OUTDOOR: 'Outdoor',
    WALKING: 'Passando na frente',
    OTHERS: 'Outros',
    NOT_INFORMED: 'Não informado',
};

const STYLE_LABELS: Record<string, string> = {
    LOW_FADE: 'Low Fade',
    MEDIUM_FADE: 'Medium Fade',
    HIGH_FADE: 'High Fade',
    TAPER_FADE: 'Taper Fade',
    BALD: 'Careca / Navalhado',
    SOCIAL: 'Social',
    CLASSIC: 'Clássico',
    OTHERS: 'Outros',
    NOT_INFORMED: 'Não informado',
};

const FREQUENCY_LABELS: Record<string, string> = {
    SEMANAL: 'Semanal',
    QUINZENAL: 'Quinzenal',
    MENSAL: 'Mensal',
    BIMENSAL: 'Bimensal',
    TRIMENSAL: 'Trimestral',
    NOT_INFORMED: 'Não informado',
};

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 shadow-lg text-sm">
            <p className="text-zinc-500 mb-1">{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: p.color }} className="font-semibold">
                    {p.name}: {typeof p.value === 'number' && p.value > 100
                    ? p.name.toLowerCase().includes('ticket') || p.name.toLowerCase().includes('r$')
                        ? formatCurrency(p.value)
                        : p.value
                    : p.value}
                </p>
            ))}
        </div>
    );
}

function CurrencyTooltip({ active, payload, label }: any) {
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


const PALETTE = ['#f59e0b', '#6366f1', '#22c55e', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6'];

function OverviewCards({ data }: { data: any }) {
    const retentionPct = ((data.retention_rate ?? 0) * 100).toFixed(1);
    const items = [
        { label: 'Total de Clientes', value: String(data.total_customers ?? 0) },
        { label: 'Ticket Médio', value: formatCurrency(Number(data.average_ticket ?? 0)) },
        { label: 'Receita Total', value: formatCurrency(Number(data.total_revenue ?? 0)) },
        { label: 'Taxa de Retenção', value: `${retentionPct}%` },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5"
                >
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.label}</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{item.value}</p>
                </div>
            ))}
        </div>
    );
}


function DemographicsSection({ data }: { data: any }) {
    const ageData = Object.entries(data.customers_by_age_group ?? {}).map(([key, val]) => ({
        name: key,
        value: val as number,
    }));

    const genderData = Object.entries(data.customers_by_gender ?? {}).map(([key, val]) => ({
        name: GENDER_LABELS[key] ?? key,
        value: val as number,
    }));

    return (
        <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Demographics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Faixa etária */}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Clientes por Faixa Etária</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {ageData.length === 0 ? (
                            <p className="text-sm text-zinc-400 text-center py-8">Sem dados</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={ageData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={70}
                                        dataKey="value"
                                        nameKey="name"
                                        paddingAngle={2}
                                    >
                                        {ageData.map((_, i) => (
                                            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v: any) => v} />
                                    <Legend iconType="circle" iconSize={10} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </Card.Body>
                </Card.Root>

                {/* Gênero */}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Distribuição por Gênero</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {genderData.length === 0 ? (
                            <p className="text-sm text-zinc-400 text-center py-8">Sem dados</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={genderData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={70}
                                        dataKey="value"
                                        nameKey="name"
                                        paddingAngle={3}
                                    >
                                        {genderData.map((_, i) => (
                                            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v: any) => v} />
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


function PreferencesSection({ data }: { data: any }) {
    const channelData = (data.acquisition_channels ?? []).map((c: any) => ({
        name: CHANNEL_LABELS[c.channel] ?? c.channel,
        clientes: c.customer_count,
        pct: c.percentage?.toFixed(1),
    }));

    const styleData = (data.popular_styles ?? []).map((s: any) => ({
        name: STYLE_LABELS[s.style] ?? s.style,
        cortes: s.count,
    }));

    const freqData = Object.entries(data.preferred_frequency ?? {}).map(([key, val]) => ({
        name: FREQUENCY_LABELS[key] ?? key,
        clientes: val as number,
    }));

    return (
        <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Preferências & Comportamento</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Canais */}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Canais de Aquisição</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {channelData.length === 0 ? (
                            <p className="text-sm text-zinc-400 text-center py-8">Sem dados</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={channelData} layout="vertical" margin={{ left: 16, right: 16 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
                                    <XAxis type="number" tick={{ fontSize: 11 }} />
                                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                                    <Tooltip />
                                    <Bar dataKey="clientes" name="Clientes" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </Card.Body>
                </Card.Root>

                {/* Estilos */}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Estilos Mais Pedidos</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {styleData.length === 0 ? (
                            <p className="text-sm text-zinc-400 text-center py-8">Sem dados</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={styleData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={70}
                                        dataKey="cortes"
                                        nameKey="name"
                                        paddingAngle={2}
                                    >
                                        {styleData.map((_: any, i: number) => (
                                            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v: any) => v} />
                                    <Legend iconType="circle" iconSize={10} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </Card.Body>
                </Card.Root>
            </div>

            {/* Frequência */}
            {freqData.length > 0 && (
                <Card.Root className="mt-6">
                    <Card.Header>
                        <Card.Title>Frequência de Visita Preferida</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={freqData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="clientes" name="Clientes" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card.Root>
            )}
        </div>
    );
}

function FinancialSection({ data }: { data: any }) {
    const topCustomers = data.top_customers ?? [];

    const avgByAge = Object.entries(data.avg_ticket_by_age ?? {}).map(([key, val]) => ({
        name: key,
        ticket: Number(val),
    }));

    const channelRevenue = (data.channel_vs_revenue ?? []).map((c: any) => ({
        name: CHANNEL_LABELS[c.channel] ?? c.channel,
        ticket: Number(c.average_ticket),
        clientes: c.customer_count,
    }));

    return (
        <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Financial Insights</h2>
            <div className="space-y-6">
                {/* Top Clientes */}
                {topCustomers.length > 0 && (
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Top 10 Clientes VIP</Card.Title>
                            <Card.Description>Maiores gastadores</Card.Description>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {topCustomers.slice(0, 10).map((c: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                {i + 1}
                                            </span>
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{c.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                                {formatCurrency(Number(c.total_spent))}
                                            </p>
                                            <p className="text-xs text-zinc-400">{c.visits_count} visitas</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card.Root>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ticket médio por faixa etária */}
                    {avgByAge.length > 0 && (
                        <Card.Root>
                            <Card.Header>
                                <Card.Title>Ticket Médio por Faixa Etária</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={avgByAge} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                        <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} width={64} />
                                        <Tooltip content={<CurrencyTooltip />} />
                                        <Bar dataKey="ticket" name="Ticket médio" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card.Root>
                    )}

                    {/* Canal vs Ticket Médio */}
                    {channelRevenue.length > 0 && (
                        <Card.Root>
                            <Card.Header>
                                <Card.Title>Canal vs Ticket Médio</Card.Title>
                                <Card.Description>Qual canal traz clientes com maior valor</Card.Description>
                            </Card.Header>
                            <Card.Body>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={channelRevenue} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                        <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} width={64} />
                                        <Tooltip content={<CurrencyTooltip />} />
                                        <Bar dataKey="ticket" name="Ticket médio" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card.Root>
                    )}
                </div>
            </div>
        </div>
    );
}

function AnalyticsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="h-9 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    );
}

export default function AnalyticsPage() {
    const { data, isLoading } = useAnalyticsData();

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    {isLoading || !data ? (
                        <AnalyticsSkeleton />
                    ) : (
                        <div className="space-y-10 animate-fade-in">
                            <div>
                                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Analytics</h1>
                                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                                    Dados demográficos, preferências e insights financeiros dos clientes
                                </p>
                            </div>

                            <OverviewCards data={data} />
                            <DemographicsSection data={data} />
                            <PreferencesSection data={data} />
                            <FinancialSection data={data} />
                        </div>
                    )}
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
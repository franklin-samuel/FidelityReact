'use client';

import React from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/app/StatCard';
import { BarChart, PieChart } from '@/components/app/Charts';
import { useAnalyticsData } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/Loading';
import {
    formatCurrency,
    formatCurrencyShort,
    getGenderLabel,
    getReferralSourceLabel,
    getStyleLabel,
    getFrequencyLabel,
} from '@/utils/formatter';

const PALETTE = ['#f59e0b', '#6366f1', '#22c55e', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6'];

function OverviewCards({ data }: { data: any }) {
    const retentionPct = ((data.retention_rate ?? 0)).toFixed(2);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                label="Total de Clientes"
                value={String(data.total_customers ?? 0)}
            />
            <StatCard
                label="Ticket Médio"
                value={formatCurrency(Number(data.average_ticket ?? 0))}
            />
            <StatCard
                label="Receita Total"
                value={formatCurrency(Number(data.total_revenue ?? 0))}
            />
            <StatCard
                label="Taxa de Retenção"
                value={`${retentionPct}%`}
            />
        </div>
    );
}

function DemographicsSection({ data }: { data: any }) {
    const ageData = Object.entries(data.customers_by_age_group ?? {}).map(([key, val]) => ({
        name: key,
        value: val as number,
    }));

    const genderData = Object.entries(data.customers_by_gender ?? {}).map(([key, val]) => ({
        name: getGenderLabel(key),
        value: val as number,
    }));

    return (
        <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Demographics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Clientes por Faixa Etária</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {ageData.length === 0 ? (
                            <p className="text-sm text-zinc-400 text-center py-8">Sem dados</p>
                        ) : (
                            <PieChart
                                data={ageData}
                                dataKey="value"
                                nameKey="name"
                                colors={PALETTE}
                                outerRadius={70}
                                height={200}
                            />
                        )}
                    </Card.Body>
                </Card.Root>

                <Card.Root>
                    <Card.Header>
                        <Card.Title>Distribuição por Gênero</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {genderData.length === 0 ? (
                            <p className="text-sm text-zinc-400 text-center py-8">Sem dados</p>
                        ) : (
                            <PieChart
                                data={genderData}
                                dataKey="value"
                                nameKey="name"
                                colors={PALETTE}
                                innerRadius={45}
                                outerRadius={70}
                                height={200}
                            />
                        )}
                    </Card.Body>
                </Card.Root>
            </div>
        </div>
    );
}

function PreferencesSection({ data }: { data: any }) {
    const channelData = (data.acquisition_channels ?? []).map((c: any) => ({
        name: getReferralSourceLabel(c.channel),
        clientes: c.customer_count,
    }));

    const styleData = (data.popular_styles ?? []).map((s: any) => ({
        name: getStyleLabel(s.style),
        cortes: s.count,
    }));

    const freqData = Object.entries(data.preferred_frequency ?? {}).map(([key, val]) => ({
        name: getFrequencyLabel(key),
        clientes: val as number,
    }));

    return (
        <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Preferências & Comportamento</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Canais de Aquisição</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {channelData.length === 0 ? (
                            <p className="text-sm text-zinc-400 text-center py-8">Sem dados</p>
                        ) : (
                            <BarChart
                                data={channelData}
                                dataKey="clientes"
                                xAxisKey="name"
                                name="Clientes"
                                color="#f59e0b"
                                height={200}
                                layout="vertical"
                            />
                        )}
                    </Card.Body>
                </Card.Root>

                <Card.Root>
                    <Card.Header>
                        <Card.Title>Estilos Mais Pedidos</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {styleData.length === 0 ? (
                            <p className="text-sm text-zinc-400 text-center py-8">Sem dados</p>
                        ) : (
                            <PieChart
                                data={styleData}
                                dataKey="cortes"
                                nameKey="name"
                                colors={PALETTE}
                                outerRadius={70}
                                height={200}
                            />
                        )}
                    </Card.Body>
                </Card.Root>
            </div>

            {freqData.length > 0 && (
                <Card.Root className="mt-6">
                    <Card.Header>
                        <Card.Title>Frequência de Visita Preferida</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <BarChart
                            data={freqData}
                            dataKey="clientes"
                            xAxisKey="name"
                            name="Clientes"
                            color="#6366f1"
                            height={180}
                        />
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
        name: getReferralSourceLabel(c.channel),
        ticket: Number(c.average_ticket),
    }));

    return (
        <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Financial Insights</h2>
            <div className="space-y-6">
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
                    {avgByAge.length > 0 && (
                        <Card.Root>
                            <Card.Header>
                                <Card.Title>Ticket Médio por Faixa Etária</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <BarChart
                                    data={avgByAge}
                                    dataKey="ticket"
                                    xAxisKey="name"
                                    name="Ticket médio"
                                    color="#22c55e"
                                    height={200}
                                    formatYAxis={formatCurrencyShort}
                                    formatTooltip={formatCurrency}
                                />
                            </Card.Body>
                        </Card.Root>
                    )}

                    {channelRevenue.length > 0 && (
                        <Card.Root>
                            <Card.Header>
                                <Card.Title>Canal vs Ticket Médio</Card.Title>
                                <Card.Description>Qual canal traz clientes com maior valor</Card.Description>
                            </Card.Header>
                            <Card.Body>
                                <BarChart
                                    data={channelRevenue}
                                    dataKey="ticket"
                                    xAxisKey="name"
                                    name="Ticket médio"
                                    color="#ec4899"
                                    height={200}
                                    formatYAxis={formatCurrencyShort}
                                    formatTooltip={formatCurrency}
                                />
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
            <Skeleton width="12rem" height="2.25rem" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} height="5rem" className="rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} height="16rem" className="rounded-xl" />
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
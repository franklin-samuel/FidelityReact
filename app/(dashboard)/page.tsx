'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { MetricCard } from '@/components/app/MetricCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDashboardMetrics } from '@/hooks/useDashboard';
import { useSettings } from '@/hooks/useSettings';

export default function DashboardPage() {
    const router = useRouter();
    const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
    const { data: settings, isLoading: settingsLoading } = useSettings();

    if (metricsLoading || settingsLoading) {
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

    const dashboardMetrics = metrics;
    const haircutsForFree = settings?.haircuts_for_free;

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    <Layout.Header
                        title="Dashboard"
                        description="Visão geral do programa de fidelidade"
                    />

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <MetricCard.Root>
                            <MetricCard.Header
                                title="Total de Clientes"
                                icon={
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                }
                                iconColor="text-zinc-600 dark:text-zinc-400"
                            />
                            <MetricCard.Value>
                                {dashboardMetrics?.total_customers || 0}
                            </MetricCard.Value>
                        </MetricCard.Root>

                        <MetricCard.Root>
                            <MetricCard.Header
                                title="Cortes Realizados"
                                icon={
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                                    </svg>
                                }
                                iconColor="text-zinc-600 dark:text-zinc-400"
                            />
                            <MetricCard.Value>
                                {dashboardMetrics?.total_haircuts || 0}
                            </MetricCard.Value>
                        </MetricCard.Root>

                        <MetricCard.Root>
                            <MetricCard.Header
                                title="Cortes Grátis Dados"
                                icon={
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                    </svg>
                                }
                                iconColor="text-zinc-600 dark:text-zinc-400"
                            />
                            <MetricCard.Value>
                                {dashboardMetrics?.free_haircuts_given || 0}
                            </MetricCard.Value>
                        </MetricCard.Root>

                        <MetricCard.Root variant="highlight">
                            <MetricCard.Header
                                title="Prontos para Grátis"
                                icon={
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                                iconColor="text-amber-500"
                            />
                            <MetricCard.Value variant="highlight">
                                {dashboardMetrics?.customers_ready_for_free_haircut || 0}
                            </MetricCard.Value>
                        </MetricCard.Root>
                    </div>

                    {/* Loyalty Settings Card */}
                    <Card.Root>
                        <Card.Body>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                    </svg>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                                        Configuração de Fidelidade
                                    </h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                        Atualmente, clientes ganham um corte grátis a cada{' '}
                                        <span className="font-semibold text-amber-500">{haircutsForFree} cortes</span>
                                    </p>

                                    <Button.Root
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => router.push('/settings')}
                                    >
                                        <Button.Icon>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </Button.Icon>
                                        Alterar Configuração
                                    </Button.Root>
                                </div>
                            </div>
                        </Card.Body>
                    </Card.Root>
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
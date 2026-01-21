'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';

export default function SettingsPage() {
    const [haircutsForFree, setHaircutsForFree] = useState<number>(11);

    const { data: settings, isLoading } = useSettings();
    const { mutate: updateSettings, isPending } = useUpdateSettings();

    useEffect(() => {
        if (settings?.haircuts_for_free) {
            setHaircutsForFree(settings.haircuts_for_free);
        }
    }, [settings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateSettings({
            haircuts_for_free: haircutsForFree
        });
    };

    if (isLoading) {
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

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    <Layout.Header
                        title="Configurações"
                        description="Configure as regras do programa de fidelidade"
                    />

                    <div className="max-w-2xl">
                        <Card.Root>
                            <Card.Header>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <Card.Title>Programa de Fidelidade</Card.Title>
                                        <Card.Description>
                                            Defina quantos cortes são necessários para ganhar um grátis
                                        </Card.Description>
                                    </div>
                                </div>
                            </Card.Header>

                            <form onSubmit={handleSubmit}>
                                <Card.Body>
                                    <div className="space-y-6">
                                        <Input.Root>
                                            <Input.Label htmlFor="haircuts">
                                                Cortes para ganhar um grátis
                                            </Input.Label>
                                            <Input.Field
                                                id="haircuts"
                                                type="number"
                                                min="1"
                                                value={haircutsForFree}
                                                onChange={(e) => setHaircutsForFree(Number(e.target.value))}
                                                required
                                            />
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5">
                                                Quando um cliente atingir este número de cortes, ele ganhará um corte grátis
                                            </p>
                                        </Input.Root>

                                        {/* Example */}
                                        <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                                                Exemplo
                                            </h4>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                Com <span className="font-semibold text-amber-500">{haircutsForFree}</span>{' '}
                                                cortes configurados, o cliente pagará por {haircutsForFree} cortes e o{' '}
                                                {haircutsForFree + 1}º será grátis.
                                            </p>
                                        </div>
                                    </div>
                                </Card.Body>

                                <Card.Footer>
                                    <Button.Root type="submit" disabled={isPending}>
                                        <Button.Icon>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                            </svg>
                                        </Button.Icon>
                                        {isPending ? 'Salvando Alterações...' : 'Salvar Alterações'}
                                    </Button.Root>
                                </Card.Footer>
                            </form>
                        </Card.Root>
                    </div>
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
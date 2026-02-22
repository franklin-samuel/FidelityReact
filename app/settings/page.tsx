'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';
import { SettingsSkeleton } from '@/components/app/SettingsSkeleton';

export default function SettingsPage() {
    const [haircutsForFree, setHaircutsForFree] = useState<number>(10);
    const [hasChanges, setHasChanges] = useState(false);

    const { data: settings, isLoading } = useSettings();
    const { mutate: updateSettings, isPending } = useUpdateSettings();

    useEffect(() => {
        if (settings?.haircuts_for_free) {
            setHaircutsForFree(settings.haircuts_for_free);
        }
    }, [settings]);

    useEffect(() => {
        if (settings) {
            setHasChanges(haircutsForFree !== settings.haircuts_for_free);
        }
    }, [haircutsForFree, settings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateSettings({
            haircuts_for_free: haircutsForFree
        }, {
            onSuccess: () => {
                setHasChanges(false);
            }
        });
    };

    if (isLoading) {
        return (
            <Layout.Root>
                <Sidebar />
                <Layout.Main>
                    <Layout.Content>
                        <SettingsSkeleton />
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
                    <div className="space-y-6 animate-fade-in">
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
                                                Defina quantos serviços são necessários para ganhar 50% OFF
                                            </Card.Description>
                                        </div>
                                    </div>
                                </Card.Header>

                                <form onSubmit={handleSubmit}>
                                    <Card.Body>
                                        <div className="space-y-6">
                                            <Input.Root>
                                                <Input.Label htmlFor="haircuts">
                                                    Serviços para ganhar 50% FREE
                                                </Input.Label>
                                                <div className="flex items-center gap-4">
                                                    <Input.Field
                                                        id="haircuts"
                                                        type="number"
                                                        min="1"
                                                        max="100"
                                                        value={haircutsForFree}
                                                        onChange={(e) => setHaircutsForFree(Number(e.target.value))}
                                                        required
                                                        disabled={isPending}
                                                        className="w-32"
                                                    />
                                                    <span className="text-zinc-600 dark:text-zinc-400">cortes</span>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                                                    Quando um cliente atingir este número de serviços, ele ganhará um serviço com 50% OFF
                                                </p>
                                            </Input.Root>

                                            {/* Example Preview */}
                                            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 transition-all">
                                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Exemplo
                                                </h4>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    Com <span className="font-semibold text-amber-500">{haircutsForFree}</span>{' '}
                                                    serviços configurados, o cliente pagará por {haircutsForFree} cortes e o{' '}
                                                    {haircutsForFree + 1}º será <span className="font-black">50% OFF</span>.
                                                </p>
                                            </div>

                                            {/* Change Indicator */}
                                            {hasChanges && (
                                                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 animate-fade-in">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Você tem alterações não salvas
                                                </div>
                                            )}
                                        </div>
                                    </Card.Body>

                                    <Card.Footer>
                                        <Button.Root
                                            type="submit"
                                            disabled={isPending || !hasChanges}
                                            className="transition-all"
                                        >
                                            {isPending ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                                                    Salvando Alterações...
                                                </>
                                            ) : (
                                                <>
                                                    <Button.Icon>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                                        </svg>
                                                    </Button.Icon>
                                                    Salvar Alterações
                                                </>
                                            )}
                                        </Button.Root>
                                    </Card.Footer>
                                </form>
                            </Card.Root>
                        </div>
                    </div>
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
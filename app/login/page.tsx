'use client';

import React, { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { mutate: login, isPending } = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        login({
            username: email,
            password
        });
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-white dark:text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        Barber<span className="text-amber-500">Club</span>
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">Sistema de Fidelidade</p>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                            Área Administrativa
                        </h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Acesse o painel de controle da sua barbearia
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input.Root>
                            <Input.Label htmlFor="email">Email</Input.Label>
                            <Input.Field
                                id="email"
                                type="email"
                                placeholder="admin@barbearia.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Input.Root>

                        <Input.Root>
                            <Input.Label htmlFor="password">Senha</Input.Label>
                            <Input.Field
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Input.Root>

                        <Button.Root
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? 'Entrando...' : 'Entrar'}
                        </Button.Root>
                    </form>
                </div>
            </div>
        </div>
    );
}
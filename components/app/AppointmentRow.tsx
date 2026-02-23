import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatter';
import type { Appointment } from '@/types/appointment';

interface FieldItemProps {
    label: string;
    value: string;
    highlight?: boolean;
}

function FieldItem({ label, value, highlight }: FieldItemProps) {
    return (
        <div className="text-center">
            <p className="text-xs text-zinc-400">{label}</p>
            <p className={`font-medium text-sm ${highlight ? 'text-green-600 dark:text-green-400 font-bold' : 'text-zinc-900 dark:text-zinc-50'}`}>
                {value}
            </p>
        </div>
    );
}

interface AppointmentRowProps {
    appointment: Appointment;
    variant: 'barber' | 'admin';
}

export function AppointmentRow({ appointment, variant }: AppointmentRowProps) {
    const isService = appointment.type === 'SERVICE';
    const hasDiscount = appointment.loyalty_discount_applied;
    const itemName = isService ? appointment.service_name : appointment.product_name;

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Item info */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isService ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-blue-50 dark:bg-blue-950/30'
                    }`}>
                        {isService ? (
                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                {itemName ?? (isService ? 'Serviço' : 'Produto')}
                            </span>
                            {hasDiscount && (
                                <span className="text-xs bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                                    Fidelidade
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-zinc-400">
                                {format(new Date(appointment.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                            {variant === 'admin' && appointment.barber_name && (
                                <>
                                    <span className="text-xs text-zinc-300 dark:text-zinc-600">•</span>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                        {appointment.barber_name}
                                    </p>
                                </>
                            )}
                            {variant === 'admin' && appointment.customer_name && (
                                <>
                                    <span className="text-xs text-zinc-300 dark:text-zinc-600">•</span>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {appointment.customer_name}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Financial fields */}
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                    <FieldItem label="Preço" value={formatCurrency(appointment.price)} />
                    <FieldItem label="Comissão" value={`${appointment.commission_percentage}%`} />
                    <FieldItem label="Gorjeta" value={formatCurrency(appointment.tip ?? 0)} />
                    <FieldItem
                        label={variant === 'admin' ? 'Ganho Barbearia' : 'Meu Ganho'}
                        value={formatCurrency(variant === 'admin' ? (appointment.barbershop_revenue ?? 0) : (appointment.barber_total ?? 0))}
                        highlight={true}
                    />
                </div>
            </div>
        </div>
    );
}
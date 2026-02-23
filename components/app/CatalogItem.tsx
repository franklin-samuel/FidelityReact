import React from 'react';
import { formatCurrency } from '@/utils/formatter';
import { Dropdown } from '@/components/ui/Dropdown';
import type { Service } from '@/types/service';
import type { Product } from '@/types/product';

interface CatalogItemProps {
    item: Service | Product;
    onEdit: (item: Service | Product) => void;
    onDelete: (item: Service | Product) => void;
}

export function CatalogItem({ item, onEdit, onDelete }: CatalogItemProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
            <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{item.name}</p>
                <p className="text-sm text-zinc-500">Comissão: {item.commission_percentage}%</p>
            </div>
            <div className="flex items-center gap-4">
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {formatCurrency(item.price)}
                </p>
                <Dropdown.Root>
                    <Dropdown.Trigger>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </Dropdown.Trigger>
                    <Dropdown.Content>
                        <Dropdown.Item onClick={() => onEdit(item)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                        </Dropdown.Item>
                        <Dropdown.Item variant="danger" onClick={() => onDelete(item)}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Deletar
                        </Dropdown.Item>
                    </Dropdown.Content>
                </Dropdown.Root>
            </div>
        </div>
    );
}
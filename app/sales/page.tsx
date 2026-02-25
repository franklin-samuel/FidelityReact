'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useServices } from '@/hooks/useService';
import { useProducts } from '@/hooks/useProduct';
import { useSearchCustomers } from '@/hooks/useCustomer';
import { useLoyaltyStatus } from '@/hooks/useLoyalty';
import { useRegisterServiceAppointment, useRegisterProductAppointment } from '@/hooks/useAppointment';
import type { Service } from '@/types/service';
import type { Product } from '@/types/product';
import type { Customer } from '@/types/customer';
import type { PaymentMethod } from '@/types/appointment';

type SaleStep = 'select-item' | 'select-customer' | 'confirm';
type TabType = 'services' | 'products';

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
    { value: 'PIX', label: 'Pix' },
    { value: 'MONEY', label: 'Dinheiro' },
    { value: 'CREDIT', label: 'Crédito' },
    { value: 'DEBIT', label: 'Débito' },
];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function SalesPage() {
    const [tab, setTab] = useState<TabType>('services');
    const [step, setStep] = useState<SaleStep>('select-item');
    const [itemSearchTerm, setItemSearchTerm] = useState('');

    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerSearch, setCustomerSearch] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
    const [tip, setTip] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const { data: services, isLoading: loadingServices } = useServices();
    const { data: products, isLoading: loadingProducts } = useProducts();
    const { data: searchResults, isLoading: searchingCustomers } = useSearchCustomers(customerSearch);
    const { mutate: registerService, isPending: registeringService } = useRegisterServiceAppointment();
    const { mutate: registerProduct, isPending: registeringProduct } = useRegisterProductAppointment();

    const isService = tab === 'services';
    const selectedItem = isService ? selectedService : selectedProduct;
    const isRegistering = registeringService || registeringProduct;

    const filteredItems = useMemo(() => {
        const items = isService ? services : products;
        if (!items) return [];

        if (!itemSearchTerm.trim()) return items;

        const term = itemSearchTerm.toLowerCase();
        return items.filter(item =>
            item.name.toLowerCase().includes(term)
        );
    }, [services, products, isService, itemSearchTerm]);

    const loyaltyCustomerId = selectedCustomer?.id ?? null;
    const loyaltyServiceId = isService && selectedService ? selectedService.id : null;
    const { data: loyaltyStatus, isLoading: loadingLoyalty } = useLoyaltyStatus(
        loyaltyCustomerId,
        loyaltyServiceId
    );

    const tipValue = parseFloat(tip) || 0;

    const originalPrice = isService
        ? (loyaltyStatus?.original_price ?? selectedService?.price ?? 0)
        : (selectedProduct?.price ?? 0);

    const discountAmount = (isService && loyaltyStatus?.has_discount)
        ? (loyaltyStatus.discount_amount ?? 0)
        : 0;

    const totalBeforeTip = originalPrice - discountAmount;
    const totalWithTip = totalBeforeTip + tipValue;

    const handleSelectItem = (item: Service | Product, type: TabType) => {
        if (type === 'services') {
            setSelectedService(item as Service);
            setSelectedProduct(null);
        } else {
            setSelectedProduct(item as Product);
            setSelectedService(null);
        }
        setSelectedCustomer(null);
        setCustomerSearch('');
        setStep('select-customer');
    };

    const handleSkipCustomer = () => {
        setSelectedCustomer(null);
        setStep('confirm');
    };

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setCustomerSearch('');
        setStep('confirm');
    };

    const handleConfirm = () => {
        if (isService && selectedService) {
            registerService({
                service_id: selectedService.id,
                payment_method: paymentMethod,
                customer_id: selectedCustomer?.id,
                tip: tipValue > 0 ? tipValue : undefined,
            }, {
                onSuccess: () => {
                    resetAll();
                    setIsConfirmOpen(false);
                }
            });
        } else if (selectedProduct) {
            registerProduct({
                product_id: selectedProduct.id,
                payment_method: paymentMethod,
                customer_id: selectedCustomer?.id,
                tip: tipValue > 0 ? tipValue : undefined,
            }, {
                onSuccess: () => {
                    resetAll();
                    setIsConfirmOpen(false);
                }
            });
        }
    };

    const resetAll = () => {
        setSelectedService(null);
        setSelectedProduct(null);
        setSelectedCustomer(null);
        setCustomerSearch('');
        setItemSearchTerm('');
        setPaymentMethod('PIX');
        setTip('');
        setStep('select-item');
    };

    const handleTabChange = (newTab: TabType) => {
        setTab(newTab);
        setSelectedService(null);
        setSelectedProduct(null);
        setSelectedCustomer(null);
        setItemSearchTerm('');
        setStep('select-item');
    };

    return (
        <Layout.Root>
            <Sidebar />
            <Layout.Main>
                <Layout.Content>
                    <div className="space-y-6 animate-fade-in max-w-4xl">
                        <Layout.Header
                            title="Vendas"
                            description="Registre um novo atendimento"
                        />

                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
                            <button
                                onClick={() => handleTabChange('services')}
                                className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                                    tab === 'services'
                                        ? 'border-amber-500 text-amber-500'
                                        : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                            >
                                Serviços
                            </button>
                            <button
                                onClick={() => handleTabChange('products')}
                                className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                                    tab === 'products'
                                        ? 'border-amber-500 text-amber-500'
                                        : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                }`}
                            >
                                Produtos
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: item list */}
                            <div className="lg:col-span-2 space-y-3">
                                <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                                    {tab === 'services' ? 'Selecione um serviço' : 'Selecione um produto'}
                                </h2>

                                {/* Campo de busca */}
                                <Input.Root>
                                    <Input.Container>
                                        <Input.Icon>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </Input.Icon>
                                        <Input.Field
                                            placeholder={`Buscar ${tab === 'services' ? 'serviço' : 'produto'}...`}
                                            value={itemSearchTerm}
                                            onChange={(e) => setItemSearchTerm(e.target.value)}
                                            className="pl-10 pr-10"
                                        />
                                        {itemSearchTerm && (
                                            <button
                                                onClick={() => setItemSearchTerm('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </Input.Container>
                                </Input.Root>

                                {(tab === 'services' ? loadingServices : loadingProducts) ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                                        ))}
                                    </div>
                                ) : filteredItems.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-sm text-zinc-400">
                                            {itemSearchTerm
                                                ? `Nenhum ${tab === 'services' ? 'serviço' : 'produto'} encontrado`
                                                : `Nenhum ${tab === 'services' ? 'serviço' : 'produto'} cadastrado`
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredItems.map((item) => {
                                            const isSelected = isService
                                                ? selectedService?.id === item.id
                                                : selectedProduct?.id === item.id;

                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleSelectItem(item, tab)}
                                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                                                        isSelected
                                                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                                                            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                                                    }`}
                                                >
                                                    <div>
                                                        <p className="font-medium text-zinc-900 dark:text-zinc-50">{item.name}</p>
                                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                            Comissão: {item.commission_percentage}%
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-lg font-bold ${isSelected ? 'text-amber-500' : 'text-zinc-900 dark:text-zinc-50'}`}>
                                                            {formatCurrency(item.price)}
                                                        </p>
                                                        {isSelected && (
                                                            <span className="text-xs text-amber-500 font-medium">Selecionado</span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Right: summary panel */}
                            <div className="space-y-4">
                                {/* Step 1 done: item selected */}
                                {selectedItem && (
                                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-4 animate-fade-in">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Resumo</h3>
                                            <button
                                                onClick={resetAll}
                                                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                            >
                                                Limpar
                                            </button>
                                        </div>

                                        {/* Selected item */}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-600 dark:text-zinc-400">{selectedItem.name}</span>
                                            <span className="font-medium text-zinc-900 dark:text-zinc-50">
                                                {formatCurrency(selectedItem.price)}
                                            </span>
                                        </div>

                                        {/* Step 2: customer */}
                                        {(step === 'select-customer' || step === 'confirm') && (
                                            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-2">
                                                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                                    Cliente {!isService && '(opcional)'}
                                                </p>

                                                {step === 'select-customer' ? (
                                                    <div className="space-y-2">
                                                        <Input.Root>
                                                            <Input.Field
                                                                placeholder="Buscar cliente..."
                                                                value={customerSearch}
                                                                onChange={e => setCustomerSearch(e.target.value)}
                                                                className="text-sm"
                                                            />
                                                        </Input.Root>

                                                        {searchingCustomers && (
                                                            <p className="text-xs text-zinc-400">Buscando...</p>
                                                        )}

                                                        {customerSearch.length > 0 && searchResults && (
                                                            <div className="space-y-1 max-h-40 overflow-y-auto">
                                                                {searchResults.map(customer => (
                                                                    <button
                                                                        key={customer.id}
                                                                        onClick={() => handleSelectCustomer(customer)}
                                                                        className="w-full text-left px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                                                                    >
                                                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{customer.name}</p>
                                                                        <p className="text-xs text-zinc-500">{customer.phone_number}</p>
                                                                    </button>
                                                                ))}
                                                                {searchResults.length === 0 && (
                                                                    <p className="text-xs text-zinc-400 px-2">Nenhum cliente encontrado</p>
                                                                )}
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={handleSkipCustomer}
                                                            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 underline"
                                                        >
                                                            Continuar sem cliente
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            {selectedCustomer ? (
                                                                <>
                                                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{selectedCustomer.name}</p>
                                                                    <p className="text-xs text-zinc-500">{selectedCustomer.phone_number}</p>
                                                                </>
                                                            ) : (
                                                                <p className="text-sm text-zinc-400">Sem cliente</p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => setStep('select-customer')}
                                                            className="text-xs text-amber-500 hover:text-amber-600"
                                                        >
                                                            Alterar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Loyalty status */}
                                        {step === 'confirm' && isService && selectedCustomer && (
                                            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
                                                {loadingLoyalty ? (
                                                    <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                                                ) : loyaltyStatus?.has_discount ? (
                                                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-3">
                                                        <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                                                            🎉 Desconto de fidelidade disponível!
                                                        </p>
                                                        <div className="space-y-0.5 text-xs">
                                                            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                                                                <span>Preço original</span>
                                                                <span>{formatCurrency(loyaltyStatus.original_price ?? 0)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                                                                <span>Desconto (50%)</span>
                                                                <span>- {formatCurrency(loyaltyStatus.discount_amount ?? 0)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : loyaltyStatus && (
                                                    <p className="text-xs text-zinc-400">
                                                        Fidelidade: {loyaltyStatus.service_count} cortes acumulados
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Step 3: confirm */}
                                        {step === 'confirm' && (
                                            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-3">
                                                {/* Totals */}
                                                <div className="space-y-1 text-sm">
                                                    {discountAmount > 0 && (
                                                        <div className="flex justify-between text-green-600 dark:text-green-400">
                                                            <span>Subtotal com desconto</span>
                                                            <span>{formatCurrency(totalBeforeTip)}</span>
                                                        </div>
                                                    )}
                                                    {tipValue > 0 && (
                                                        <div className="flex justify-between text-zinc-500">
                                                            <span>Gorjeta</span>
                                                            <span>+ {formatCurrency(tipValue)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-50 text-base pt-1 border-t border-zinc-100 dark:border-zinc-800">
                                                        <span>Total</span>
                                                        <span className={discountAmount > 0 ? 'text-green-600 dark:text-green-400' : ''}>
                                                            {formatCurrency(totalWithTip)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Button.Root
                                                    className="w-full"
                                                    onClick={() => setIsConfirmOpen(true)}
                                                >
                                                    Finalizar Venda
                                                </Button.Root>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!selectedItem && (
                                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-6 text-center">
                                        <p className="text-sm text-zinc-400">
                                            Selecione um {tab === 'services' ? 'serviço' : 'produto'} para começar
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Confirm Modal */}
                    <Modal.Root open={isConfirmOpen} onClose={() => !isRegistering && setIsConfirmOpen(false)}>
                        <Modal.Content>
                            <Modal.Header onClose={() => !isRegistering && setIsConfirmOpen(false)}>
                                Confirmar Venda
                            </Modal.Header>
                            <Modal.Body>
                                <div className="space-y-4">
                                    {/* Summary */}
                                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-600 dark:text-zinc-400">Item</span>
                                            <span className="font-medium text-zinc-900 dark:text-zinc-50">{selectedItem?.name}</span>
                                        </div>
                                        {selectedCustomer && (
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-zinc-400">Cliente</span>
                                                <span className="font-medium text-zinc-900 dark:text-zinc-50">{selectedCustomer.name}</span>
                                            </div>
                                        )}
                                        {discountAmount > 0 && (
                                            <div className="flex justify-between text-green-600 dark:text-green-400">
                                                <span>Desconto fidelidade</span>
                                                <span>- {formatCurrency(discountAmount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-50 pt-1 border-t border-zinc-200 dark:border-zinc-700">
                                            <span>Total (sem gorjeta)</span>
                                            <span>{formatCurrency(totalBeforeTip)}</span>
                                        </div>
                                    </div>

                                    {/* Payment method */}
                                    <div>
                                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Meio de pagamento</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {PAYMENT_METHODS.map(pm => (
                                                <button
                                                    key={pm.value}
                                                    onClick={() => setPaymentMethod(pm.value)}
                                                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                                                        paymentMethod === pm.value
                                                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                                                            : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                                                    }`}
                                                >
                                                    {pm.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tip */}
                                    <Input.Root>
                                        <Input.Label htmlFor="tip">Gorjeta (opcional)</Input.Label>
                                        <Input.Field
                                            id="tip"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="R$ 0,00"
                                            value={tip}
                                            onChange={e => setTip(e.target.value)}
                                            disabled={isRegistering}
                                        />
                                    </Input.Root>

                                    {/* Final total */}
                                    <div className="flex justify-between items-center text-lg font-bold text-zinc-900 dark:text-zinc-50 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                                        <span>Total final</span>
                                        <span className={discountAmount > 0 ? 'text-green-600 dark:text-green-400' : ''}>
                                            {formatCurrency(totalWithTip)}
                                        </span>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button.Root
                                    variant="secondary"
                                    onClick={() => setIsConfirmOpen(false)}
                                    disabled={isRegistering}
                                >
                                    Cancelar
                                </Button.Root>
                                <Button.Root
                                    onClick={handleConfirm}
                                    disabled={isRegistering}
                                >
                                    {isRegistering ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Registrando...
                                        </>
                                    ) : 'Confirmar'}
                                </Button.Root>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Root>
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
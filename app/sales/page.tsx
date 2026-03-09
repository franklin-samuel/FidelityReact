'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/app/Sidebar';
import { Layout } from '@/components/app/Layout';
import { Stepper } from '@/components/app/Stepper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useServices } from '@/hooks/useService';
import { useProducts } from '@/hooks/useProduct';
import { useSearchCustomers } from '@/hooks/useCustomer';
import { useLoyaltyStatus } from '@/hooks/useLoyalty';
import { useRegisterServiceAppointment, useRegisterProductAppointment } from '@/hooks/useAppointment';
import { useSettings } from '@/hooks/useSettings';
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
    const { data: settings } = useSettings();

    const isService = tab === 'services';
    const selectedItem = isService ? selectedService : selectedProduct;
    const isRegistering = registeringService || registeringProduct;

    const filteredItems = useMemo(() => {
        const items = isService ? services : products;
        if (!items) return [];
        if (!itemSearchTerm.trim()) return items;
        const term = itemSearchTerm.toLowerCase();
        return items.filter(item => item.name.toLowerCase().includes(term));
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

    const haircutsForFree = settings?.haircuts_for_free || 10;

    const canGoToStep = (targetStep: SaleStep): boolean => {
        if (targetStep === 'select-item') return true;
        if (targetStep === 'select-customer') return !!selectedItem;
        if (targetStep === 'confirm') return !!selectedItem;
        return false;
    };

    const goToStep = (targetStep: SaleStep) => {
        if (canGoToStep(targetStep)) {
            setStep(targetStep);
        }
    };

    const handleSelectItem = (item: Service | Product, type: TabType) => {
        if (type === 'services') {
            setSelectedService(item as Service);
            setSelectedProduct(null);
        } else {
            setSelectedProduct(item as Product);
            setSelectedService(null);
        }
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
                    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
                        <Layout.Header
                            title="Nova Venda"
                            description="Registre um novo atendimento de serviço ou produto"
                        />

                        <Stepper
                            currentStep={step}
                            onStepClick={goToStep}
                            canGoToStep={canGoToStep}
                        />

                        {step === 'select-item' && (
                            <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
                                <button
                                    onClick={() => handleTabChange('services')}
                                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
                                        tab === 'services'
                                            ? 'border-amber-500 text-amber-500'
                                            : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                                        </svg>
                                        Serviços
                                        {services && <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{services.length}</span>}
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleTabChange('products')}
                                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
                                        tab === 'products'
                                            ? 'border-amber-500 text-amber-500'
                                            : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Produtos
                                        {products && <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{products.length}</span>}
                                    </span>
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                {/* STEP 1: Selecionar Item */}
                                {step === 'select-item' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                                {tab === 'services' ? 'Selecione um serviço' : 'Selecione um produto'}
                                            </h2>
                                            <span className="text-sm text-zinc-400">
                                                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
                                            </span>
                                        </div>

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
                                                    <div key={i} className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                                                ))}
                                            </div>
                                        ) : filteredItems.length === 0 ? (
                                            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                                                    <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                                <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-1">
                                                    {itemSearchTerm
                                                        ? `Nenhum ${tab === 'services' ? 'serviço' : 'produto'} encontrado`
                                                        : `Nenhum ${tab === 'services' ? 'serviço' : 'produto'} cadastrado`
                                                    }
                                                </p>
                                                {itemSearchTerm && (
                                                    <p className="text-sm text-zinc-400">
                                                        Tente ajustar sua busca
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {filteredItems.map((item, index) => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => handleSelectItem(item, tab)}
                                                        className="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md hover:-translate-y-0.5 animate-fade-in"
                                                        style={{ animationDelay: `${index * 30}ms` }}
                                                    >
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">{item.name}</p>
                                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                                Comissão: {item.commission_percentage}%
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold text-amber-500">
                                                                {formatCurrency(item.price)}
                                                            </p>
                                                            <p className="text-xs text-zinc-400">Selecionar →</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* STEP 2: Selecionar Cliente */}
                                {step === 'select-customer' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <div>
                                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                                                Vincular Cliente (Opcional)
                                            </h2>
                                            <p className="text-sm text-zinc-500">
                                                Busque e selecione um cliente ou pule esta etapa
                                            </p>
                                        </div>

                                        <Input.Root>
                                            <Input.Label htmlFor="customer-search">Buscar cliente</Input.Label>
                                            <Input.Container>
                                                <Input.Icon>
                                                    {searchingCustomers ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                    )}
                                                </Input.Icon>
                                                <Input.Field
                                                    id="customer-search"
                                                    placeholder="Digite nome, telefone ou email..."
                                                    value={customerSearch}
                                                    onChange={e => setCustomerSearch(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </Input.Container>
                                        </Input.Root>

                                        {customerSearch.length > 0 && searchResults && (
                                            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 max-h-80 overflow-y-auto">
                                                {searchResults.length === 0 ? (
                                                    <div className="p-6 text-center">
                                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-3">
                                                            <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-sm text-zinc-400">Nenhum cliente encontrado</p>
                                                    </div>
                                                ) : (
                                                    searchResults.map((customer, index) => (
                                                        <button
                                                            key={customer.id}
                                                            onClick={() => handleSelectCustomer(customer)}
                                                            className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors animate-fade-in"
                                                            style={{ animationDelay: `${index * 30}ms` }}
                                                        >
                                                            <p className="font-medium text-zinc-900 dark:text-zinc-50">{customer.name}</p>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <p className="text-sm text-zinc-500">{customer.phone_number}</p>
                                                                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                                                <p className="text-sm text-zinc-500">{customer.email}</p>
                                                            </div>
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-center pt-4">
                                            <Button.Root variant="secondary" onClick={handleSkipCustomer}>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                                </svg>
                                                Pular e continuar sem cliente
                                            </Button.Root>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: Confirmar */}
                                {step === 'confirm' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                            Confirmar Pagamento
                                        </h2>

                                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                                                    <div>
                                                        <p className="text-xs text-zinc-400 mb-1">Item selecionado</p>
                                                        <p className="font-semibold text-zinc-900 dark:text-zinc-50">{selectedItem?.name}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => goToStep('select-item')}
                                                        className="text-xs text-amber-500 hover:text-amber-600"
                                                    >
                                                        Alterar
                                                    </button>
                                                </div>

                                                <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                                                    <div className="flex-1">
                                                        <p className="text-xs text-zinc-400 mb-1">Cliente</p>
                                                        {selectedCustomer ? (
                                                            <>
                                                                <p className="font-semibold text-zinc-900 dark:text-zinc-50">{selectedCustomer.name}</p>
                                                                <p className="text-sm text-zinc-500">{selectedCustomer.phone_number}</p>
                                                            </>
                                                        ) : (
                                                            <p className="text-sm text-zinc-400">Sem cliente vinculado</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => goToStep('select-customer')}
                                                        className="text-xs text-amber-500 hover:text-amber-600"
                                                    >
                                                        {selectedCustomer ? 'Alterar' : 'Adicionar'}
                                                    </button>
                                                </div>
                                            </div>

                                            {step === 'confirm' && isService && selectedCustomer && (
                                                loadingLoyalty ? (
                                                    <div className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                                                ) : loyaltyStatus?.has_discount ? (
                                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-900 rounded-lg p-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-green-700 dark:text-green-400 mb-2">
                                                                    Desconto de Fidelidade Disponível!
                                                                </p>
                                                                <div className="space-y-1 text-sm">
                                                                    <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                                                                        <span>Preço original</span>
                                                                        <span>{formatCurrency(loyaltyStatus.original_price ?? 0)}</span>
                                                                    </div>
                                                                    <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                                                                        <span>Desconto (50%)</span>
                                                                        <span>- {formatCurrency(loyaltyStatus.discount_amount ?? 0)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : loyaltyStatus && (
                                                    <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                                </svg>
                                                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                                    Programa de Fidelidade
                                                                </p>
                                                            </div>
                                                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-full">
                                                                {loyaltyStatus.service_count} serviços
                                                            </span>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                                                                <span>Progresso para próximo desconto</span>
                                                                <span className="font-medium">
                                                                    {loyaltyStatus.service_count} / {haircutsForFree}
                                                                </span>
                                                            </div>
                                                            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 rounded-full"
                                                                    style={{ width: `${Math.min((loyaltyStatus.service_count / haircutsForFree) * 100, 100)}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                {haircutsForFree - loyaltyStatus.service_count > 0
                                                                    ? `Faltam ${haircutsForFree - loyaltyStatus.service_count} serviços para ganhar 50% OFF`
                                                                    : 'Parabéns! Você já pode usar seu desconto'
                                                                }
                                                            </p>
                                                            {loyaltyStatus.discounts_claimed > 0 && (
                                                                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                                                    ✓ {loyaltyStatus.discounts_claimed} desconto{loyaltyStatus.discounts_claimed > 1 ? 's' : ''} já utilizado{loyaltyStatus.discounts_claimed > 1 ? 's' : ''}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}

                                            <div>
                                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Método de pagamento</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {PAYMENT_METHODS.map(pm => (
                                                        <button
                                                            key={pm.value}
                                                            onClick={() => setPaymentMethod(pm.value)}
                                                            className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                                                                paymentMethod === pm.value
                                                                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 shadow-md'
                                                                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                                                            }`}
                                                        >
                                                            {pm.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

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
                                                />
                                            </Input.Root>

                                            <div className="pt-4 border-t-2 border-zinc-200 dark:border-zinc-700">
                                                <div className="space-y-2">
                                                    {discountAmount > 0 && (
                                                        <>
                                                            <div className="flex justify-between text-sm text-zinc-500">
                                                                <span>Subtotal</span>
                                                                <span className="line-through">{formatCurrency(originalPrice)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                                                                <span>Com desconto</span>
                                                                <span>{formatCurrency(totalBeforeTip)}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                    {tipValue > 0 && (
                                                        <div className="flex justify-between text-sm text-zinc-500">
                                                            <span>Gorjeta</span>
                                                            <span>+ {formatCurrency(tipValue)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-center text-xl font-bold text-zinc-900 dark:text-zinc-50 pt-2">
                                                        <span>Total</span>
                                                        <span className={discountAmount > 0 ? 'text-green-600 dark:text-green-400' : ''}>
                                                            {formatCurrency(totalWithTip)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 sticky top-6">
                                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
                                        Resumo da Venda
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-zinc-400 mb-2">Item</p>
                                            {selectedItem ? (
                                                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                                                    <p className="font-medium text-zinc-900 dark:text-zinc-50 text-sm">{selectedItem.name}</p>
                                                    <p className="text-lg font-bold text-amber-500 mt-1">{formatCurrency(selectedItem.price)}</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-zinc-400 italic">Nenhum item selecionado</p>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-xs text-zinc-400 mb-2">Cliente</p>
                                            {selectedCustomer ? (
                                                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                                                    <p className="font-medium text-zinc-900 dark:text-zinc-50 text-sm">{selectedCustomer.name}</p>
                                                    <p className="text-xs text-zinc-500 mt-1">{selectedCustomer.phone_number}</p>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-zinc-400 italic">Sem cliente vinculado</p>
                                            )}
                                        </div>

                                        {step === 'confirm' && (
                                            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                                <p className="text-xs text-zinc-400 mb-2">Total a pagar</p>
                                                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                                    {formatCurrency(totalWithTip)}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 space-y-2">
                                        {step === 'confirm' && (
                                            <Button.Root
                                                className="w-full"
                                                onClick={() => setIsConfirmOpen(true)}
                                                disabled={!selectedItem}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Finalizar Venda
                                            </Button.Root>
                                        )}
                                        {selectedItem && (
                                            <Button.Root
                                                variant="secondary"
                                                className="w-full"
                                                onClick={resetAll}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancelar e Recomeçar
                                            </Button.Root>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal.Root open={isConfirmOpen} onClose={() => !isRegistering && setIsConfirmOpen(false)}>
                        <Modal.Content>
                            <Modal.Header onClose={() => !isRegistering && setIsConfirmOpen(false)}>
                                Confirmar Venda
                            </Modal.Header>
                            <Modal.Body>
                                <div className="space-y-4">
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
                                        <div className="flex justify-between">
                                            <span className="text-zinc-600 dark:text-zinc-400">Pagamento</span>
                                            <span className="font-medium text-zinc-900 dark:text-zinc-50">
                                                {PAYMENT_METHODS.find(p => p.value === paymentMethod)?.label}
                                            </span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div className="flex justify-between text-green-600 dark:text-green-400">
                                                <span>Desconto fidelidade</span>
                                                <span>- {formatCurrency(discountAmount)}</span>
                                            </div>
                                        )}
                                        {tipValue > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-zinc-600 dark:text-zinc-400">Gorjeta</span>
                                                <span className="font-medium text-zinc-900 dark:text-zinc-50">+ {formatCurrency(tipValue)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold text-lg text-zinc-900 dark:text-zinc-50 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                                            <span>Total</span>
                                            <span className={discountAmount > 0 ? 'text-green-600 dark:text-green-400' : ''}>
                                                {formatCurrency(totalWithTip)}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                                        Confirme os dados acima para finalizar a venda
                                    </p>
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
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Confirmar Venda
                                        </>
                                    )}
                                </Button.Root>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal.Root>
                </Layout.Content>
            </Layout.Main>
        </Layout.Root>
    );
}
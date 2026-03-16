import React from 'react';

type SaleStep = 'select-item' | 'select-barber' | 'select-customer' | 'confirm';

interface StepperProps {
    currentStep: SaleStep;
    onStepClick: (step: SaleStep) => void;
    canGoToStep: (step: SaleStep) => boolean;
    isAdmin?: boolean;
}

export function Stepper({ currentStep, onStepClick, canGoToStep, isAdmin = false }: StepperProps) {
    const adminSteps = [
        {
            id: 'select-item' as SaleStep,
            label: 'Item',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            description: 'Selecione o serviço ou produto'
        },
        {
            id: 'select-barber' as SaleStep,
            label: 'Barbeiro',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                </svg>
            ),
            description: 'Qual barbeiro fez o atendimento?'
        },
        {
            id: 'select-customer' as SaleStep,
            label: 'Cliente',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            description: 'Opcional: vincule um cliente'
        },
        {
            id: 'confirm' as SaleStep,
            label: 'Pagamento',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            description: 'Confirme e finalize a venda'
        },
    ];

    const barberSteps = [
        {
            id: 'select-item' as SaleStep,
            label: 'Item',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            description: 'Selecione o serviço ou produto'
        },
        {
            id: 'select-customer' as SaleStep,
            label: 'Cliente',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            description: 'Opcional: vincule um cliente'
        },
        {
            id: 'confirm' as SaleStep,
            label: 'Pagamento',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            description: 'Confirme e finalize a venda'
        },
    ];

    const steps = isAdmin ? adminSteps : barberSteps;

    const getStepIndex = (step: SaleStep) => steps.findIndex(s => s.id === step);
    const currentIndex = getStepIndex(currentStep);

    return (
        <div className="mb-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = getStepIndex(step.id) < currentIndex;
                    const canClick = canGoToStep(step.id);
                    const isClickable = canClick && !isActive;

                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center flex-1">
                                <button
                                    onClick={() => isClickable && onStepClick(step.id)}
                                    disabled={!isClickable}
                                    className={`
                                        w-14 h-14 rounded-full flex items-center justify-center
                                        transition-all duration-300 mb-3 relative
                                        ${isActive
                                        ? 'bg-amber-500 text-white ring-4 ring-amber-200 dark:ring-amber-900 scale-110 shadow-lg'
                                        : isCompleted
                                            ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer hover:scale-105 shadow-md'
                                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                    }
                                        ${isClickable ? 'hover:shadow-lg' : ''}
                                    `}
                                    title={step.description}
                                >
                                    {isCompleted ? (
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        step.icon
                                    )}
                                    {isActive && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-ping" />
                                    )}
                                </button>
                                <div className="text-center">
                                    <span className={`
                                        text-sm font-semibold transition-colors block
                                        ${isActive
                                        ? 'text-amber-500'
                                        : isCompleted
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-zinc-400'
                                    }
                                    `}>
                                        {step.label}
                                    </span>
                                    <span className="text-xs text-zinc-400 hidden sm:block mt-1">
                                        {isCompleted ? '✓ Concluído' : isActive ? 'Atual' : 'Pendente'}
                                    </span>
                                </div>
                            </div>

                            {index < steps.length - 1 && (
                                <div className="flex flex-col items-center mb-12 mx-4 flex-1">
                                    <div className={`
                                        h-1 w-full rounded-full transition-all duration-500
                                        ${isCompleted || (index < currentIndex)
                                        ? 'bg-green-500'
                                        : 'bg-zinc-200 dark:bg-zinc-800'
                                    }
                                    `} />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
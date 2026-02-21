import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';
import type { CreateCustomerRequest, UpdateCustomerRequest } from '@/types/customer';
import { useDebounce } from './useDebounce';

export const CUSTOMER_QUERY_KEY = 'customers';

export const useCustomers = () => {
    return useQuery({
        queryKey: [CUSTOMER_QUERY_KEY],
        queryFn: () => customerService.list(),
    });
};

export const useSearchCustomers = (query: string) => {
    const debouncedQuery = useDebounce(query, 300);

    return useQuery({
        queryKey: [CUSTOMER_QUERY_KEY, 'search', debouncedQuery],
        queryFn: () => customerService.search(debouncedQuery),
        enabled: debouncedQuery.length >= 2,
    });
};

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateCustomerRequest) => customerService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
        },
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) =>
            customerService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
        },
    });
};
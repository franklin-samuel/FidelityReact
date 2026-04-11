import { httpClient } from '@/utils/http-client';
import type {BarberDashboardMetrics, DashboardMetrics} from '@/types/dashboard';

export const dashboardService = {
    getMetrics: async (): Promise<DashboardMetrics> => {
        const response = await httpClient.get<DashboardMetrics>('/dashboard');
        return response.data!;
    },

    getBarberMetrics: async (barberId: string): Promise<BarberDashboardMetrics> => {
        const response = await httpClient.get<BarberDashboardMetrics>(`/dashboard/barber/${barberId}`);
        return response.data!;
    },
};
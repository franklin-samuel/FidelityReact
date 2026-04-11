import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export const DASHBOARD_QUERY_KEY = 'dashboard';

export const BARBER_DASHBOARD_QUERY_KEY = 'barber-dashboard';

export const useDashboardMetrics = () => {
    return useQuery({
        queryKey: [DASHBOARD_QUERY_KEY, 'metrics'],
        queryFn: () => dashboardService.getMetrics(),
    });
};

export const useBarberDashboard = (barberId: string) => {
    return useQuery({
        queryKey: [BARBER_DASHBOARD_QUERY_KEY, barberId],
        queryFn: () => dashboardService.getBarberMetrics(barberId),
        enabled: !!barberId,
    });
};
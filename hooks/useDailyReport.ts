import { useQuery } from '@tanstack/react-query';
import { dailyReportService } from '@/services/daily-report.service';

export const DAILY_REPORT_QUERY_KEY = 'daily-report';

export const useDailyReport = (enabled: boolean = false) => {
    return useQuery({
        queryKey: [DAILY_REPORT_QUERY_KEY],
        queryFn: () => dailyReportService.getToday(),
        enabled,
        staleTime: 0,
        refetchOnMount: true,
    });
};
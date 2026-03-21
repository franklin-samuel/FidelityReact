import { httpClient } from '@/utils/http-client';
import type { DailyReport } from '@/types/daily-report';

export const dailyReportService = {
    getToday: async (): Promise<DailyReport> => {
        const response = await httpClient.get<DailyReport>('/financial/daily');
        return response.data!;
    },
};
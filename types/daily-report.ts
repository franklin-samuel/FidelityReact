export interface DailyReportPaymentMethod {
    payment_method: string;
    revenue: number;
    appointments: number;
}

export interface DailyReportPeriod {
    start: string;
    end: string;
}

export interface DailyReport {
    date: string;
    period: DailyReportPeriod;
    total_revenue: number;
    total_appointments: number;
    by_payment_method: DailyReportPaymentMethod[];
}
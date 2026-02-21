import { httpClient } from '@/utils/http-client';
import type {
    Appointment,
    RegisterServiceAppointmentRequest,
    RegisterProductAppointmentRequest,
    UpdateAppointmentRequest,
} from '@/types/appointment';

export const appointmentService = {
    list: async (): Promise<Appointment[]> => {
        const response = await httpClient.get<Appointment[]>('/appointment');
        return response.data || [];
    },

    registerService: async (data: RegisterServiceAppointmentRequest): Promise<Appointment> => {
        const response = await httpClient.post<Appointment>('/appointment/service', data);
        return response.data!;
    },

    registerProduct: async (data: RegisterProductAppointmentRequest): Promise<Appointment> => {
        const response = await httpClient.post<Appointment>('/appointment/product', data);
        return response.data!;
    },

    linkCustomer: async (appointmentId: string, data: UpdateAppointmentRequest): Promise<Appointment> => {
        const response = await httpClient.patch<Appointment>(`/appointment/${appointmentId}`, data);
        return response.data!;
    },
};
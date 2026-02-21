export interface Customer {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    service_count: number;
    discounts_claimed: number;
    created_at: string;
    modified_at: string;
}

export interface CreateCustomerRequest {
    name: string;
    email: string;
    phone_number: string;
}

export interface UpdateCustomerRequest {
    name: string;
    email: string;
    phone_number: string;
}
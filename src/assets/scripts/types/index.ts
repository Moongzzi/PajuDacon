export type User = {
    id: number;
    name: string;
    email: string;
};

export interface Product {
    id: number;
    title: string;
    price: number;
}

export type ApiResponse<T> = {
    data: T;
    error?: string;
};
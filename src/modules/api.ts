import axios from 'axios';
import { dest_api } from '../target_config';

export interface Service {
    ID: number;
    Title: string;
    Icon: string;
    ImageURL: string;
    Rate: string;
    Term: string;
    Amount: string;
    Description: string;
    SumFrom: number;
    CreatedAt: string;

    // Поля для совместимости с JSON от бэкенда (camelCase)
    id?: number;
    title?: string;
    icon?: string;
    image_url?: string;
    rate?: string;
    term?: string;
    amount?: string;
    description?: string;
    sum_from?: number;
    created_at?: string;
}

export interface ServiceListResponse {
    Total: number;
    Orders: Service[];
    orders?: Service[]; // Поддержка camelCase
}

export interface ServiceFilter {
    title?: string;
    date_from?: string;
    date_to?: string;
    price_min?: number;
    price_max?: number;
}

// Функция для получения заголовков с токеном (для обратной совместимости)
const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const getServices = async (filter: ServiceFilter = {}): Promise<ServiceListResponse> => {
    const params = new URLSearchParams();
    if (filter.title) params.append("title", filter.title);
    if (filter.date_from) params.append("date_from", filter.date_from);
    if (filter.date_to) params.append("date_to", filter.date_to);
    if (filter.price_min) params.append("price_min", filter.price_min.toString());
    if (filter.price_max) params.append("price_max", filter.price_max.toString());

    try {
        const response = await axios.get<ServiceListResponse>(
            `${dest_api}/credits?${params.toString()}`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch services");
    }
};

export const getServiceById = async (id: number): Promise<Service> => {
    try {
        const response = await axios.get<Service>(
            `${dest_api}/credits/${id}`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch service");
    }
};

// Запрос корзины (для демонстрации в Network, даже если вернет 401/403)
export const getBasket = async () => {
    // Этот запрос может упасть с 401 (Unauthorized), если мы не залогинены,
    // но он будет виден в браузере, что и требуется.
    try {
        await axios.get(`${dest_api}/applications/basket`, { headers: getAuthHeaders() });
    } catch (e) {
        // Игнорируем ошибку, нам важен сам факт запроса
        console.log("Basket fetch failed (expected for guest)");
    }
};

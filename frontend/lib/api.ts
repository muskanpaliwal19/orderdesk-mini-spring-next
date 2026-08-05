
import { Order, OrderPayload } from './types';

const API_BASE_URL = '/api';

async function fetcher(url: string, options: RequestInit = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
        const errorMessage = Array.isArray(errorData.errors) ? errorData.errors.join(', ') : (errorData.message || 'An unknown error occurred.');
        throw new Error(errorMessage);
    }
    // For DELETE or other methods that might not have a body
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

export const getOrders = (): Promise<Order[]> => {
  return fetcher(`${API_BASE_URL}/orders`);
};

export const deleteOrder = (id: number): Promise<null> => {
  return fetcher(`${API_BASE_URL}/orders/${id}`, { method: 'DELETE' });
};

export const createOrder = (data: OrderPayload): Promise<Order> => {
    return fetcher(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
};

export const updateOrder = (id: number, data: OrderPayload): Promise<Order> => {
    return fetcher(`${API_BASE_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
};

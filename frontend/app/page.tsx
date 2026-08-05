'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Order, OrderPayload } from '@/lib/types';

const API_BASE_URL = '/api';

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
    } catch (e: any) {
      setError(`Failed to fetch orders: ${e.message}`);
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = (order: Order | null = null) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await fetchOrders(); // Refresh list
      } catch (e: any) {
        setError(`Failed to delete order: ${e.message}`);
        console.error(e);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-gray-50">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
         <h1 className="text-4xl font-bold text-gray-800 mb-8">Order Management</h1>
      </div>

      {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
      
      <div className="w-full max-w-5xl">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Order
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(order)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <OrderModal
          order={selectedOrder}
          onClose={closeModal}
          onSave={fetchOrders}
          setError={setError}
        />
      )}
    </main>
  );
}

interface OrderModalProps {
    order: Order | null;
    onClose: () => void;
    onSave: () => void;
    setError: (message: string | null) => void;
}

function OrderModal({ order, onClose, onSave, setError }: OrderModalProps) {
  const [formData, setFormData] = useState<OrderPayload>({
    product: order?.product || '',
    quantity: order?.quantity || 1,
    customerName: order?.customerName || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value, 10) : value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.product.trim() || !formData.customerName.trim() || formData.quantity <= 0) {
        setError("All fields are required and quantity must be positive.");
        return;
    }
    
    setIsSubmitting(true);

    const method = order ? 'PUT' : 'POST';
    const url = order ? `${API_BASE_URL}/orders/${order.id}` : `${API_BASE_URL}/orders`;

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
            const errorMessage = Array.isArray(errorData.errors) ? errorData.errors.join(', ') : (errorData.message || 'An unknown error occurred.');
            throw new Error(errorMessage);
        }
        
        onSave(); // Refresh orders list
        onClose(); // Close modal
    } catch (e: any) {
        setError(`Failed to save order: ${e.message}`);
        console.error(e);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{order ? 'Edit Order' : 'Create Order'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product</label>
            <input type="text" name="product" id="product" value={formData.product} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" min="1" required />
          </div>
          <div className="mb-4">
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input type="text" name="customerName" id="customerName" value={formData.customerName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          </div>
          <div className="flex items-center justify-end pt-4 border-t">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md mr-2 hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300">{isSubmitting ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

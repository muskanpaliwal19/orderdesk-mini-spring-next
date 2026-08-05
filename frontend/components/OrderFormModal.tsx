'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Order, OrderPayload } from '@/lib/types';
import { createOrder, updateOrder } from '@/lib/api';

interface OrderFormModalProps {
  order: Order | null;
  onClose: () => void;
  onSave: () => void; // To trigger a refresh on the parent
  setError: (message: string | null) => void;
}

export default function OrderFormModal({ order, onClose, onSave, setError }: OrderFormModalProps) {
  const [formData, setFormData] = useState<OrderPayload>({
    product: '',
    quantity: 1,
    customerName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        product: order.product,
        quantity: order.quantity,
        customerName: order.customerName,
      });
    } else {
      setFormData({ product: '', quantity: 1, customerName: '' });
    }
  }, [order]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.product.trim() || !formData.customerName.trim() || formData.quantity <= 0) {
      setError("All fields are required and quantity must be positive.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (order) {
        await updateOrder(order.id, formData);
      } else {
        await createOrder(formData);
      }
      onSave();
      onClose();
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

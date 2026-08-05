'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Order, OrderPayload, OrderStatus } from '@/lib/types';
import { createOrder, updateOrder } from '@/lib/api';

interface OrderFormModalProps {
  order: Order | null;
  onClose: () => void;
  onSave: () => void; // To trigger a refresh on the parent
  setError: (message: string | null) => void;
}

const emptyPayload: OrderPayload = {
    customerName: '',
    customerEmail: '',
    itemDescription: '',
    quantity: 1,
    unitPriceCents: 0,
    status: 'NEW',
    notes: '',
};

export default function OrderFormModal({ order, onClose, onSave, setError }: OrderFormModalProps) {
  const [formData, setFormData] = useState<OrderPayload>(emptyPayload);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
        const {id, createdAt, updatedAt, ...payload} = order;
        setFormData(payload);
    } else {
        setFormData(emptyPayload);
    }
  }, [order]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' || name === 'unitPriceCents' ? parseInt(value, 10) || 0 : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.customerName.trim() || !formData.itemDescription.trim() || formData.quantity <= 0) {
      setError("Customer name, item description and a positive quantity are required.");
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
      <div className="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">{order ? 'Edit Order' : 'Create Order'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
              <input type="text" name="customerName" id="customerName" value={formData.customerName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">Customer Email</label>
              <input type="email" name="customerEmail" id="customerEmail" value={formData.customerEmail} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label htmlFor="itemDescription" className="block text-sm font-medium text-gray-700">Item Description</label>
            <textarea name="itemDescription" id="itemDescription" value={formData.itemDescription} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" min="1" required />
            </div>
            <div>
              <label htmlFor="unitPriceCents" className="block text-sm font-medium text-gray-700">Unit Price (Cents)</label>
              <input type="number" name="unitPriceCents" id="unitPriceCents" value={formData.unitPriceCents} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" min="0" required />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              {['NEW', 'PAID', 'SHIPPED', 'CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea name="notes" id="notes" value={formData.notes ?? ''} onChange={handleInputChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
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

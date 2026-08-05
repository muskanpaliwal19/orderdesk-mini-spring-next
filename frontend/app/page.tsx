'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/lib/types';
import { getOrders, deleteOrder } from '@/lib/api';
import OrderList from '@/components/OrderList';
import OrderFormModal from '@/components/OrderFormModal';

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
      setError(null);
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
        await deleteOrder(id);
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
        <OrderList orders={orders} onEdit={openModal} onDelete={handleDelete} />
      </div>

      {isModalOpen && (
        <OrderFormModal
          order={selectedOrder}
          onClose={closeModal}
          onSave={fetchOrders}
          setError={setError}
        />
      )}
    </main>
  );
}

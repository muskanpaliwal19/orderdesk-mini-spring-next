'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/lib/types';
import { getOrders, deleteOrder } from '@/lib/api';
import OrderList from '@/components/OrderList';
import OrderFormModal from '@/components/OrderFormModal';

// Function to escape CSV fields
function escapeCsvField(field: any): string {
    if (field == null) {
        return '';
    }
    const str = String(field);
    // If the field contains a comma, a quote, or a newline, wrap it in double quotes.
    if (/[\",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

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
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Failed to fetch orders: ${e.message}`);
      } else {
        setError('An unknown error occurred');
      }
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
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(`Failed to delete order: ${e.message}`);
        } else {
          setError('An unknown error occurred');
        }
        console.error(e);
      }
    }
  };

  const handleExport = () => {
    const header = ['id', 'customer_name', 'customer_email', 'item_description', 'quantity', 'unit_price_cents', 'status', 'created_at'];
    const rows = orders.map(order => [
        order.id,
        order.customerName,
        order.customerEmail,
        order.itemDescription,
        order.quantity,
        order.unitPriceCents,
        order.status,
        order.createdAt
    ].map(escapeCsvField).join(','));

    const csvContent = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeOrderTotal = orders
    .filter(order => order.status !== 'CANCELLED')
    .reduce((total, order) => total + order.quantity * order.unitPriceCents, 0);

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-gray-50">
      <div className="z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Order Management</h1>
        <div className="text-right">
            <div className="text-lg"><span className="font-bold">Active Order Total:</span> {`$${(activeOrderTotal / 100).toFixed(2)}`}</div>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}

      <div className="w-full max-w-7xl">
        <div className="flex justify-end mb-4 space-x-2">
            <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
                Export CSV
            </button>
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

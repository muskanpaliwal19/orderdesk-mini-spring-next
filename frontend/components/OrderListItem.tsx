'use client';

import { Order, OrderStatus } from '@/lib/types';

interface OrderListItemProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: number) => void;
}

const statusColors: Record<OrderStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrderListItem({ order, onEdit, onDelete }: OrderListItemProps) {
  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (dateString: string) => new Date(dateString).toISOString().split('T')[0];

  return (
    <tr key={order.id}>
      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
        <div>{order.customerName}</div>
        <div className="text-xs text-gray-500">{order.customerEmail}</div>
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{order.itemDescription}</td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{order.quantity}</td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{formatCurrency(order.unitPriceCents)}</td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{formatCurrency(order.unitPriceCents * order.quantity)}</td>
      <td className="px-4 py-2 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </td>
      <td className="px-4 py-2 text-sm text-gray-500 max-w-sm truncate">{order.notes}</td>
      <td className="px-4 py-2 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => onEdit(order)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
        <button onClick={() => onDelete(order.id)} className="text-red-600 hover:text-red-900">Delete</button>
      </td>
    </tr>
  );
}

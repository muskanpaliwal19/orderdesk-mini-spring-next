'use client';

import { Order } from '@/lib/types';

interface OrderListItemProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: number) => void;
}

export default function OrderListItem({ order, onEdit, onDelete }: OrderListItemProps) {
  return (
    <tr key={order.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.product}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.quantity}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customerName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => onEdit(order)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
        <button onClick={() => onDelete(order.id)} className="text-red-600 hover:text-red-900">Delete</button>
      </td>
    </tr>
  );
}

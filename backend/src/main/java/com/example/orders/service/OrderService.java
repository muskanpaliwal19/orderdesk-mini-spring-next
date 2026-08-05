package com.example.orders.service;

import com.example.orders.model.Order;
import com.example.orders.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order createOrder(Order order) {
        order.setId(null);
        return orderRepository.save(order);
    }

    public Optional<Order> updateOrder(Long id, Order order) {
        return orderRepository.findById(id)
                .map(existingOrder -> {
                    existingOrder.setCustomerName(order.getCustomerName());
                    existingOrder.setCustomerEmail(order.getCustomerEmail());
                    existingOrder.setItemDescription(order.getItemDescription());
                    existingOrder.setQuantity(order.getQuantity());
                    existingOrder.setUnitPriceCents(order.getUnitPriceCents());
                    existingOrder.setStatus(order.getStatus());
                    existingOrder.setNotes(order.getNotes());
                    return orderRepository.save(existingOrder);
                });
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}

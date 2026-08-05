package com.example.orders;

import com.example.orders.dto.CreateOrderRequest;
import com.example.orders.dto.UpdateOrderRequest;
import com.example.orders.exception.ResourceNotFoundException;
import com.example.orders.model.Order;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order createOrder(CreateOrderRequest createOrderRequest) {
        Order order = new Order(createOrderRequest);
        return orderRepository.save(order);
    }

    public Order updateOrder(Long id, UpdateOrderRequest updateOrderRequest) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (updateOrderRequest.getProductName() != null) {
            order.setProductName(updateOrderRequest.getProductName());
        }
        if (updateOrderRequest.getQuantity() != null) {
            order.setQuantity(updateOrderRequest.getQuantity());
        }
        if (updateOrderRequest.getPrice() != null) {
            order.setPrice(updateOrderRequest.getPrice());
        }

        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        orderRepository.delete(order);
    }

     public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }
}

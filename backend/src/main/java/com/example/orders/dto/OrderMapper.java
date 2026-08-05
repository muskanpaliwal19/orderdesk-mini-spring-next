package com.example.orders.dto;

import com.example.orders.model.Order;
import com.example.orders.model.OrderStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class OrderMapper {

    public OrderDto toDto(Order order) {
        return new OrderDto(
                order.getId(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getItemDescription(),
                order.getQuantity(),
                order.getUnitPriceCents(),
                order.getStatus(),
                order.getNotes(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }

    public Order toEntity(CreateOrderRequest createOrderRequest) {
        Order order = new Order();
        order.setCustomerName(createOrderRequest.customerName());
        order.setCustomerEmail(createOrderRequest.customerEmail());
        order.setItemDescription(createOrderRequest.itemDescription());
        order.setQuantity(createOrderRequest.quantity());
        order.setUnitPriceCents(convertDollarsToCents(createOrderRequest.unitPriceDollars()));
        order.setStatus(OrderStatus.NEW);
        order.setNotes(createOrderRequest.notes());
        return order;
    }

    public void updateEntity(Order order, UpdateOrderRequest updateOrderRequest) {
        order.setCustomerName(updateOrderRequest.customerName());
        order.setCustomerEmail(updateOrderRequest.customerEmail());
        order.setItemDescription(updateOrderRequest.itemDescription());
        order.setQuantity(updateOrderRequest.quantity());
        order.setUnitPriceCents(convertDollarsToCents(updateOrderRequest.unitPriceDollars()));
        order.setStatus(updateOrderRequest.status());
        order.setNotes(updateOrderRequest.notes());
    }

    private Integer convertDollarsToCents(BigDecimal dollars) {
        if (dollars == null) {
            throw new IllegalArgumentException("Price cannot be null.");
        }
        return dollars.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP).intValue();
    }
}

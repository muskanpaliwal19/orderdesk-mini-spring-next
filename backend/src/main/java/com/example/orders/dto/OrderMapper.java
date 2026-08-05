package com.example.orders.dto;

import com.example.orders.model.Order;
import org.springframework.stereotype.Component;

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
        order.setUnitPriceCents(createOrderRequest.unitPriceCents());
        order.setStatus(createOrderRequest.status());
        order.setNotes(createOrderRequest.notes());
        return order;
    }
}

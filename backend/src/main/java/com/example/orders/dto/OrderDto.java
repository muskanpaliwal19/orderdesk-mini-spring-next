package com.example.orders.dto;

import com.example.orders.model.OrderStatus;

import java.time.Instant;

public record OrderDto(
        Long id,
        String customerName,
        String customerEmail,
        String itemDescription,
        int quantity,
        int unitPriceCents,
        OrderStatus status,
        String notes,
        Instant createdAt,
        Instant updatedAt
) {
}

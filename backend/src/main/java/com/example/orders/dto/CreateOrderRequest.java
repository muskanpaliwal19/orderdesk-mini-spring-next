package com.example.orders.dto;

import com.example.orders.model.OrderStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CreateOrderRequest(
        @NotBlank String customerName,
        @NotBlank String customerEmail,
        @NotBlank String itemDescription,
        @Min(1) int quantity,
        @Min(0) int unitPriceCents,
        OrderStatus status,
        String notes
) {
}

package com.example.orders.dto;

import com.example.orders.model.OrderStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;


public record UpdateOrderRequest(
        @NotBlank(message = "Customer name is required") String customerName,
        @NotBlank(message = "Customer email is required") @Email(message = "Invalid email format") String customerEmail,
        @NotBlank(message = "Item description is required") String itemDescription,
        @NotNull(message = "Quantity is required") @Min(value = 1, message = "Quantity must be at least 1") Integer quantity,
        @NotNull(message = "Unit price is required") @Positive(message = "Unit price must be positive") java.math.BigDecimal unitPriceDollars,
        @NotNull(message = "Status is required") OrderStatus status,
        String notes
) {
}

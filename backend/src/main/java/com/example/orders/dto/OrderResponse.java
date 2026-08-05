package com.example.orders.dto;

import com.example.orders.model.Order;
import java.math.BigDecimal;
import java.time.Instant;

public class OrderResponse {
    private Long id;
    private String product;
    private int quantity;
    private BigDecimal price;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;

    public OrderResponse(Order order) {
        this.id = order.getId();
        this.product = order.getProduct();
        this.quantity = order.getQuantity();
        this.price = order.getPrice();
        this.status = order.getStatus();
        this.createdAt = order.getCreatedAt();
        this.updatedAt = order.getUpdatedAt();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getProduct() {
        return product;
    }

    public int getQuantity() {
        return quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}

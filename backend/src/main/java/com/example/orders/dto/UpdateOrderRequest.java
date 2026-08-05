package com.example.orders.dto;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class UpdateOrderRequest {

    private String productName;

    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @Positive(message = "Price must be positive")
    private BigDecimal price;

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}

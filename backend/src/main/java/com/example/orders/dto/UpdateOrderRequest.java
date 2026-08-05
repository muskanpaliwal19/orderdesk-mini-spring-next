package com.example.orders.dto;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class UpdateOrderRequest {

    private String product;

    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @Positive(message = "Price must be positive")
    private BigDecimal price;

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
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

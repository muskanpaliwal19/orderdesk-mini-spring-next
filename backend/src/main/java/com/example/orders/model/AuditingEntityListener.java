package com.example.orders.model;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.time.Instant;

public class AuditingEntityListener {

    @PrePersist
    public void prePersist(Order order) {
        Instant now = Instant.now();
        order.setCreatedAt(now);
        order.setUpdatedAt(now);
    }

    @PreUpdate
    public void preUpdate(Order order) {
        order.setUpdatedAt(Instant.now());
    }
}

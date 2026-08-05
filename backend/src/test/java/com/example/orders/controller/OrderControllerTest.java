package com.example.orders.controller;

import com.example.orders.model.Order;
import com.example.orders.model.OrderStatus;
import com.example.orders.repository.OrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
    }

    @Test
    void testGetAllOrders() throws Exception {
        Order order1 = new Order();
        order1.setCustomerName("Customer 1");
        order1.setCustomerEmail("customer1@example.com");
        order1.setItemDescription("Item 1");
        order1.setQuantity(1);
        order1.setUnitPriceCents(1000);
        order1.setStatus(OrderStatus.NEW);
        order1.setCreatedAt(Instant.now());
        order1.setUpdatedAt(Instant.now());
        orderRepository.save(order1);

        // To ensure order2 has a later timestamp
        Thread.sleep(10);

        Order order2 = new Order();
        order2.setCustomerName("Customer 2");
        order2.setCustomerEmail("customer2@example.com");
        order2.setItemDescription("Item 2");
        order2.setQuantity(2);
        order2.setUnitPriceCents(2000);
        order2.setStatus(OrderStatus.PAID);
        order2.setCreatedAt(Instant.now());
        order2.setUpdatedAt(Instant.now());
        orderRepository.save(order2);

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].customerName", is("Customer 2")))
                .andExpect(jsonPath("$[1].customerName", is("Customer 1")));
    }

    @Test
    void testCreateOrder() throws Exception {
        Map<String, Object> createOrderRequest = new HashMap<>();
        createOrderRequest.put("customerName", "New Customer");
        createOrderRequest.put("customerEmail", "new@example.com");
        createOrderRequest.put("itemDescription", "New Item");
        createOrderRequest.put("quantity", 3);
        createOrderRequest.put("unitPriceDollars", new BigDecimal("30.00"));
        createOrderRequest.put("notes", "Some notes");

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createOrderRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customerName", is("New Customer")))
                .andExpect(jsonPath("$.customerEmail", is("new@example.com")))
                .andExpect(jsonPath("$.itemDescription", is("New Item")))
                .andExpect(jsonPath("$.quantity", is(3)))
                .andExpect(jsonPath("$.unitPriceCents", is(3000)))
                .andExpect(jsonPath("$.status", is("NEW")))
                .andExpect(jsonPath("$.notes", is("Some notes")));
    }
    
    @Test
    void testCreateOrder_invalidRequest() throws Exception {
        Map<String, Object> createOrderRequest = new HashMap<>();
        // Missing customerName
        createOrderRequest.put("customerEmail", "new@example.com");
        createOrderRequest.put("itemDescription", "New Item");
        createOrderRequest.put("quantity", 3);
        createOrderRequest.put("unitPriceDollars", new BigDecimal("30.00"));

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createOrderRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetOrderById() throws Exception {
        Order order = new Order();
        order.setCustomerName("Customer 1");
        order.setCustomerEmail("customer1@example.com");
        order.setItemDescription("Item 1");
        order.setQuantity(1);
        order.setUnitPriceCents(1000);
        order.setStatus(OrderStatus.NEW);
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());
        Order savedOrder = orderRepository.save(order);

        mockMvc.perform(get("/api/orders/" + savedOrder.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(savedOrder.getId().intValue())))
                .andExpect(jsonPath("$.customerName", is("Customer 1")));
    }

    @Test
    void testGetOrderById_notFound() throws Exception {
        mockMvc.perform(get("/api/orders/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateOrder() throws Exception {
        Order order = new Order();
        order.setCustomerName("Old Name");
        order.setCustomerEmail("old@example.com");
        order.setItemDescription("Old Item");
        order.setQuantity(1);
        order.setUnitPriceCents(1000);
        order.setStatus(OrderStatus.NEW);
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());
        Order savedOrder = orderRepository.save(order);

        Map<String, Object> updateRequest = new HashMap<>();
        updateRequest.put("customerName", "New Name");
        updateRequest.put("customerEmail", "new@example.com");
        updateRequest.put("itemDescription", "New Item");
        updateRequest.put("quantity", 2);
        updateRequest.put("unitPriceDollars", new BigDecimal("20.00"));
        updateRequest.put("status", "PAID");
        updateRequest.put("notes", "Some notes");

        mockMvc.perform(put("/api/orders/" + savedOrder.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.customerName", is("New Name")))
                .andExpect(jsonPath("$.status", is("PAID")));
    }
}

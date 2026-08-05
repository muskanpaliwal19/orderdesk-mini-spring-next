package com.example.orders.controller;

import com.example.orders.dto.CreateOrderRequest;
import com.example.orders.dto.OrderDto;
import com.example.orders.dto.OrderMapper;
import com.example.orders.dto.UpdateOrderRequest;
import com.example.orders.model.Order;
import com.example.orders.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.StringWriter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    public OrderController(OrderService orderService, OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderMapper = orderMapper;
    }

    @GetMapping
    public List<OrderDto> getAllOrders(@SortDefault(sort = "createdAt", direction = Sort.Direction.DESC) Sort sort) {
        return orderService.getAllOrders(sort).stream()
                .map(orderMapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(orderMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDto createOrder(@Valid @RequestBody CreateOrderRequest createOrderRequest) {
        Order order = orderMapper.toEntity(createOrderRequest);
        Order createdOrder = orderService.saveOrder(order);
        return orderMapper.toDto(createdOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDto> updateOrder(@PathVariable Long id, @Valid @RequestBody UpdateOrderRequest updateOrderRequest) {
        return orderService.getOrderById(id)
                .map(existingOrder -> {
                    orderMapper.updateEntity(existingOrder, updateOrderRequest);
                    Order savedOrder = orderService.saveOrder(existingOrder);
                    return ResponseEntity.ok(orderMapper.toDto(savedOrder));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (orderService.deleteOrder(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/export.csv")
    public ResponseEntity<String> exportCsv() {
        List<Order> orders = orderService.getAllOrders(Sort.by(Sort.Direction.ASC, "id"));
        StringWriter sw = new StringWriter();
        sw.append("id,customer_name,customer_email,item_description,quantity,unit_price_cents,status,created_at,updated_at,notes\n");
        for (Order order : orders) {
            sw.append(String.join(",",
                    String.valueOf(order.getId()),
                    escapeCsv(order.getCustomerName()),
                    escapeCsv(order.getCustomerEmail()),
                    escapeCsv(order.getItemDescription()),
                    String.valueOf(order.getQuantity()),
                    String.valueOf(order.getUnitPriceCents()),
                    order.getStatus().name(),
                    escapeCsv(order.getCreatedAt().toString()),
                    escapeCsv(order.getUpdatedAt().toString()),
                    escapeCsv(order.getNotes())
            )).append("\n");
        }

        return ResponseEntity.ok()
                .header("Content-Type", "text/csv")
                .header("Content-Disposition", "attachment; filename=orders.csv")
                .body(sw.toString());
    }

    private String escapeCsv(String data) {
        if (data == null) {
            return "";
        }
        if (data.contains(",") || data.contains("\"") || data.contains("\n")) {
            return "\"" + data.replace("\"", "\"\"") + "\"";
        }
        return data;
    }
}

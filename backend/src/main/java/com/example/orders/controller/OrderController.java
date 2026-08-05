package com.example.orders.controller;

import com.example.orders.dto.CreateOrderRequest;
import com.example.orders.dto.OrderDto;
import com.example.orders.dto.OrderMapper;
import com.example.orders.dto.UpdateOrderRequest;
import com.example.orders.model.Order;
import com.example.orders.service.OrderService;
import com.example.orders.service.CsvExportService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderMapper orderMapper;
    private final CsvExportService csvExportService;

    public OrderController(OrderService orderService, OrderMapper orderMapper, CsvExportService csvExportService) {
        this.orderService = orderService;
        this.orderMapper = orderMapper;
        this.csvExportService = csvExportService;
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
        String csv = csvExportService.exportOrdersToCsv();
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv")
                .header("Content-Disposition", "attachment; filename=orders.csv")
                .body(csv);
    }
}
